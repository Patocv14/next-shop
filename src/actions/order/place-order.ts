"use server";

import { auth } from "@/auth.config";
import type { Address, Size } from "@/interfaces";
import prisma from "@/lib/prisma";

interface ProductToOrder {
  productId: string;
  quantity: number;
  size: Size;
}

export const placeOrder = async (
  productsId: ProductToOrder[],
  address: Address
) => {
  const session = await auth();
  const userId = session?.user?.id;
  // verificar ssion de usuario
  if (!userId) {
    return {
      ok: false,
      message: "No hay session de usuario",
    };
  }

  // Obtener la informacion de los products
  // Nota: Recuerden que podemos llevar 2 o mas productos con el mismo ID
  const products = await prisma.product.findMany({
    where: {
      id: {
        in: productsId.map((p) => p.productId),
      },
    },
  });

  const itemsInOrder = productsId.reduce((count, p) => count + p.quantity, 0);

  const { subTotal, tax, total } = productsId.reduce(
    (totals, item) => {
      const productQuantity = item.quantity;
      const product = products.find((p) => p.id === item.productId);

      if (!product) throw new Error(`${item.productId} no existe - 500`);

      const subTotal = product.price * productQuantity;

      totals.subTotal += subTotal;
      totals.tax += subTotal * 0.15;
      totals.total += subTotal * 1.15;

      return totals;
    },
    { subTotal: 0, tax: 0, total: 0 }
  );
  //  Crear la transaccion de base de datos

  try {
    const prismaTx = await prisma.$transaction(async (tx) => {
      // 1. Actualizar el stock de los productos

      const updatedProductsPromises = products.map((product) => {
        // Acomular los valores
        const productQuantity = productsId
          .filter((p) => p.productId === product.id)
          .reduce((acc, item) => item.quantity + acc, 0);

        if (productQuantity === 0) {
          throw new Error(`${product.id}, no tiene cantidad definida`);
        }

        return tx.product.update({
          where: { id: product.id },
          data: {
            inStock: {
              decrement: productQuantity,
            },
          },
        });
      });

      const updatedProducts = await Promise.all(updatedProductsPromises);
      updatedProducts.forEach((product) => {
        if (product.inStock < 0) {
          throw new Error(
            `No hay suficiente stock para el producto ${product.title}`
          );
        }
      });

      // 2. Crear la orden HEADER

      const order = await tx.order.create({
        data: {
          userId,
          itemsInOrder: itemsInOrder,
          subTotal,
          tax,
          total,

          OrderItem: {
            createMany: {
              data: productsId.map((p) => ({
                quantity: p.quantity,
                size: p.size,
                productId: p.productId,
                price:
                  products.find((product) => product.id === p.productId)
                    ?.price || 0,
              })),
            },
          },
        },
      });

      // 3. Crear la direccion de la orden

      const orderAddress = await tx.orderAddress.create({
        data: {
          address: address.address,
          address2: address.address2,
          city: address.city,
          phone: address.phone,
          postalCode: address.postalCode,
          firstName: address.firstName,
          lastName: address.lastName,
          countryId: address.country,
          orderId: order.id,
        },
      });

      return {
        order: order,
        updatedProducts: updatedProducts,
        orderAddress: orderAddress,
      };
    });

    return {
      ok: true,
      order: prismaTx.order,
      prismaTx,
    };
  } catch (error: any) {
    return {
      ok: false,
      message: error.message,
    };
  }
};
