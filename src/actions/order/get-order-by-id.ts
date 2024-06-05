"use server";

import { auth } from "@/auth.config";
import prisma from "@/lib/prisma";

export const getOrderById = async (orderId: string) => {
  const session = await auth();

  try {
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
      },
      include: {
        OrderAddress: true,
        OrderItem: {
          select: {
            price: true,
            quantity: true,
            size: true,
            product: {
              select: {
                title: true,
                slug: true,
                ProductImage: {
                  select: {
                    url: true,
                  },
                  take: 1,
                },
              },
            },
          },
        },
      },
    });

    if (!order) throw new Error(`Orden con id ${orderId} no existe`);

    if (session?.user.role === "user") {
      if (session.user.id !== order.userId) {
        throw new Error("No tienes permisos para ver esta orden");
      }
    }

    return {
      ok: true,
      order: {
        ...order,
        OrderItem: order.OrderItem.map( item => ({
          quantity: item.quantity,
          size: item.size,
          price: item.price,
          slug: item.product.slug,
          title: item.product.title,
          image: item.product.ProductImage[0].url,
        }))
      },
    };
  } catch (error: any) {
    console.log(error);
    return {
      ok: false,
      message: error.message,
    };
  }
};
