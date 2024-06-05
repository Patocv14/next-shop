import { getOrderById } from "@/actions";
import { Title } from "@/components";
import { IsPaid } from "./ui/IsPaid";
import { ProductsInCart } from "./ui/ProductsInCart";
import { redirect } from "next/navigation";

interface Props {
  params: {
    id: string;
  };
}

export default async function OrderPage({ params }: Props) {
  const { id } = params;

  const { order, ok } = await getOrderById(id);
  if(!ok || !order) {
    redirect('/')
  }
  const { OrderAddress, OrderItem } = order
  if(!OrderAddress || !OrderItem) {
    redirect('/')
  }


  return (
    <div className="flex justify-center items-center mb-72 px-10 sm:px-0">
      <div className="flex flex-col w-[1000px] ">
        <Title title={`Orden #${id.split("-").at(1)}`} />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          {/* Carrito */}

          <div className="flex flex-col mt-5">
            <IsPaid isPaid={order.isPaid} />

            {/* Items */}

            <ProductsInCart productsInCart={OrderItem} />
          </div>

          {/* checkout */}

          <div className="bg-white rounded-xl shadow-xl p-7">
            <h2 className="text-2xl mb-2">Direccion de entrega</h2>
            <div className="mb-10">
              <p className="text-xl font-bold">{OrderAddress.firstName} {OrderAddress.lastName}</p>
              <p>{OrderAddress.address}</p>
              <p>{OrderAddress.city}</p>
              <p>{OrderAddress.phone}</p>
              <p>{OrderAddress.postalCode}</p>
            </div>

            {/* Divider */}

            <div className="w-full h-0.5 rounded bg-gray-200 mb-10" />

            <h2 className="text-2xl mb-2">Resumen de orden</h2>

            <div className="grid grid-cols-2">
              <span>No. Products</span>
              <span className="text-right">{order.itemsInOrder}</span>

              <span>Subtotal</span>
              <span className="text-right">{order.subTotal}</span>

              <span>Impuestos(15%)</span>
              <span className="text-right">{order.tax}</span>

              <span className="mt-5 text-2xl">Total:</span>
              <span className="mt-5 text-2xl text-right">{order.total}</span>
            </div>
            <div className="mt-5 mb-2 w-full">
              <IsPaid isPaid={order.isPaid} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
