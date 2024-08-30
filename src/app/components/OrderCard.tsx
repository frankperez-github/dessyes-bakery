import { IconCalendarEvent, IconChevronDown, IconChevronUp, IconCoin, IconCreditCard, IconMap2, IconMoneybag, IconReceipt } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import clsx from 'clsx';

export default function OrderCard({ order }: { order: Order }) {
    const statusColors = {
        "Procesando": "yellow-200",
        "Enviando": "yellow-200",
        "Entregada": "green-400",
        "Cancelada": "red-400"
    };

    const [showDetails, setShowDetails] = useState(false);
    const [orderProducts, setOrderProducts] = useState<any[]>([]);

    const fetchOrderProducts = async () => {
        const response = await fetch('/api/orderProducts/' + order.id, {
            method: "GET"
        });
        setOrderProducts((await response.json()).orderProducts);
    };

    useEffect(() => {
        fetchOrderProducts();
    }, []);

    useEffect(()=>{
        if(orderProducts?.length > 0)
        {
            console.log(order.total.replaceAll("/", " ").split(" "))
        }
    },[orderProducts])

    return (
        <div style={{borderColor: statusColors[order.orderStatus]}} className={clsx("w-10/12 mx-auto border-2 flex flex-col gap-4 rounded-md p-6 my-10")}>
            <div className="flex">
                <IconCalendarEvent className="mr-2" />
                <p className="font-bold">
                    Fecha: <span className="ml-2 font-light">{order.created_at.substring(0, 10)}</span>
                </p>
            </div>
            <div className="flex">
                <div className="max-w-[8%] lg:max-w-[2%] xl:max-w-[2%] mr-2">
                    <IconMap2 size={"100%"} className="mr-2" />
                </div>
                <p className="font-bold">
                    Dirección de entrega: <span className="ml-2 font-light">{order.deliveryAddress}</span>
                </p>
            </div>
            <div className="flex">
                <IconCreditCard className="mr-2" />
                <p className="font-bold">
                    Método de pago: <span className="ml-2 font-light">{order.paymentMethod}</span>
                </p>
            </div>
            <div className="flex">
                <IconMoneybag className="mr-2" />
                <p className="font-bold">
                    Estado del pago: <span className="ml-2 font-light">{order.paymentStatus}</span>
                </p>
            </div>
            <div className="flex">
                <IconCoin className="mr-2" />
                <p className="font-bold">
                    Monto: <span className="ml-2 font-light">{order.total}</span>
                </p>
            </div>
            <p className="font-bold">
                <div className="flex" style={{color: statusColors[order.orderStatus]}}>
                    <IconReceipt className="mr-2" />
                    Estado de la orden: <span className={clsx(`ml-2 font-bold`)}>{order.orderStatus}</span>
                </div>
            </p>
            {
                showDetails &&
                <div className="products-list text-left w-full">
                    <table className="w-full border-2">
                        <thead>
                            <tr className="w-full">
                                <th className="border-x-2 border-b-2 text-center px-2">Producto</th>
                                <th className="border-x-2 border-b-2 text-center px-2">Cantidad</th>
                                <th className="border-x-2 border-b-2 text-center px-2">Precio unidad</th>
                            </tr>
                        </thead>
                        <tbody className="text-center">
                            {
                                orderProducts?.map((prod: any, key) => (
                                    <tr className="border-2" key={key}>
                                        <td className="border-x-2">{prod.productName}</td>
                                        <td className="border-x-2">{prod.quantity}</td>
                                        <td className="border-x-2" dangerouslySetInnerHTML={{ __html: prod.unitPrice }} ></td>
                                    </tr>
                                ))
                            }
                                <tr className="border-2">
                                    <td className="border-x-2">Envío</td>
                                    <td className="border-x-2">1</td>
                                    <td className="border-x-2">
                                        {(parseFloat(order.total.replaceAll("/", " ").split(" ")[0]) - orderProducts.reduce((acc, product:any) => 
                                            acc + (+product.unitPrice.replace(/<br>/g, " ").replace(/\n/g, " ").split(" ")[0]) * (product.quantity), 0
                                        )).toFixed(2)} CUP
                                        <br/>
                                        {(parseFloat(order.total.replaceAll("/", " ").split(" ")[4]) - orderProducts.reduce((acc, product:any) => 
                                            acc + (+product.unitPrice.replace(/<br>/g, " ").replace(/\n/g, " ").split(" ")[2]) * (product.quantity), 0
                                        )).toFixed(2)} MLC
                                        <br/>
                                        {(parseFloat(order.total.replaceAll("/", " ").split(" ")[8]) - orderProducts.reduce((acc, product:any) => 
                                            acc + (+product.unitPrice.replace(/<br>/g, " ").replace(/\n/g, " ").split(" ")[4]) * (product.quantity), 0
                                        )).toFixed(2)} USD
                                    </td>
                                </tr>
                        </tbody>
                    </table>
                </div>
            }
            <button onClick={() => setShowDetails(!showDetails)} className="w-full my-2 justify-center border-2 rounded-lg bg-gray-200 p-2 ml-auto flex gap-3">
                Detalles
                {
                    !showDetails ?
                        <IconChevronDown />
                        :
                        <IconChevronUp />
                }
            </button>
        </div>
    );
}
