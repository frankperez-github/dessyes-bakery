import { GridColDef } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { DataTable } from "../DataTable";

export default function AdminOrders()
{

    const [paymentStatus, setPaymentStatus] = useState<any[]>([])
    const fetchPaymentStatus = async () => {
        try {
            const response = await fetch("/api/paymentStatus");
            const data = await response.json();
            setPaymentStatus(data.paymentStatus);
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    };

    const [orderStatus, setOrderStatus] = useState<any[]>([])
    const fetchOrderStatus = async () => {
        try {
            const response = await fetch("/api/orderStatus");
            const data = await response.json();
            setOrderStatus(data.orderStatus);
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    };
    
    useEffect(()=>{
        fetchOrderStatus()
        fetchPaymentStatus()
    },[])
    
    const handlePaymentStatusChange = async (row:any, e:any) =>{
        if(!window) return
        const {orderProducts, orderWithoutProducts} = row
        const response = await fetch("/api/orders/"+row.id, 
            {
                method: "PUT",
                body: JSON.stringify({...orderWithoutProducts, paymentStatus: e.target.value})
            }
        )
        if(response.ok)
        {
            toast.success("Orden Actualizada")
        }
        else
        {
            toast.error("Ha ocurrido un error, intente otra vez.")
        }
    }
    const handleOrderStatusChange = async (row:any, e:any) =>{
        if(!window) return
        const {orderProducts, orderWithoutProducts} = row
        const response = await fetch("/api/orders/"+row.id, 
            {
                method: "PUT",
                body: JSON.stringify({...orderWithoutProducts, orderStatus: e.target.value})
            }
        )
        if(response.ok)
        {
            toast.success("Orden Actualizada")
        }
        else
        {
            toast.error("Ha ocurrido un error, intente otra vez.")
        }
    }

    const columns: GridColDef[] = [
        { 
          field: 'id', 
          headerName: 'Número de orden', 
          width: 300,
          sortable: true,
          renderCell: (params: any) => <p>{params.row.id}</p>,
        },
        {
          field: 'orderProducts', 
          headerName: 'Productos', 
          width: 180, 
          sortable: false,
          renderCell: (params: any) => {
            const productList = params.row.orderProducts
              ?.map((prod: any) => `${prod.productName} x ${prod.quantity}`)
              .join('<br/>');
        
            return (
              <div className="row-cell">
                <span dangerouslySetInnerHTML={{ __html: productList }} />
              </div>
            );
          },
        },
        { 
          field: 'totalAmount', 
          headerName: 'Monto Total', 
          width: 150, 
          sortable: false,
          renderCell: (params: any) => <p>{params.row.total}</p>,
        },
        { 
          field: 'paymentMethod', 
          headerName: 'Método de pago', 
          width: 150, 
          sortable: false,
          renderCell: (params: any) => <p>{params.row.paymentMethod}</p>,
        },
        { 
          field: 'paymentStatus', 
          headerName: 'Estado del pago', 
          width: 150, 
          sortable: false,
          renderCell: (params: any) => {
            return (
              <select
                onChange={(e: any) => handlePaymentStatusChange(params.row, e)}
              >
                {paymentStatus?.map((paymSt: any, index: number) => (
                  <option selected={paymSt.status === params.row.paymentStatus} key={index} value={paymSt.status}>
                    {paymSt.status}
                  </option>
                ))}
              </select>
            );
          }
        },
        { 
          field: 'contactName', 
          headerName: 'Nombre de contacto', 
          sortable: true, 
          width: 160, 
          renderCell: (params: any) => <p>{params.row.contactName}</p>,
        },
        { 
          field: 'contactPhone', 
          headerName: 'Teléfono de contacto', 
          width: 180, 
          sortable: false,
          renderCell: (params: any) => <a className="border-b-2 border-blue-600 text-blue-600" href={`tel:${params.row.contactPhone}`}>{params.row.contactPhone}</a>,
        },
        { 
          field: 'deliveryAddress', 
          headerName: 'Dirección de entrega', 
          width: 400, 
          sortable: false,
          renderCell: (params: any) => <p>{params.row.deliveryAddress}</p>,
        },
        { 
          field: 'orderStatus', 
          headerName: 'Estado de la orden', 
          width: 150, 
          sortable: false,
          renderCell: (params: any) => 
          {
            return (
              <select
                onChange={(e: any) => handleOrderStatusChange(params.row, e)}
              >
                {orderStatus?.map((ordSt: any, index: number) => (
                  <option selected={ordSt.status === params.row.orderStatus} key={index} value={ordSt.status}>
                    {ordSt.status}
                  </option>
                ))}
              </select>
            )
          }    
        }
    ];

    const [orders, setOrders] = useState<any[]>([])
    const [loadingOrders, setLoadingOrders] = useState(false)
    const fetchOrders = async () => {
        try {
            const response = await fetch("/api/orders");
            const data = await response.json();
            setOrders(data.orders);
            setLoadingOrders(false)
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    };
    const fetchOrderProducts = async () => {
        try
        {
            const updatedOrders = await Promise.all(
                orders?.map(async (ord) => {
                    const response = await fetch('/api/orderProducts/' + ord.id, {
                        method: "GET"
                    });
                    const data = await response.json();
                    return { ...ord, orderProducts: data.orderProducts };
                })
            );
            setOrders(updatedOrders);
        }
        catch(e)
        {
            console.log(e)
        }
    };

    useEffect(()=>{
        if(!loadingOrders)
        {
            fetchOrderProducts()
        }
    },[loadingOrders])

    useEffect(()=>{
        fetchOrders()
        setLoadingOrders(true)
        
    },[])

    
    return(
        <div className="">
            <div className="w-[92%] my-10 mx-auto p-10">
                <h1 className="my-4 font-bold text-lg">
                    Órdenes pendientes:
                </h1>
                
                <DataTable columns={columns} rows={orders?.filter((x:Order)=>x.orderStatus === "Procesando")}/>
            </div>
            <div className="w-[92%] my-10 mx-auto p-10">
                <h1 className="my-4 font-bold text-lg">
                    Órdenes enviándose:
                </h1>
                
                <DataTable columns={columns} rows={orders?.filter((x:Order)=>x.orderStatus === "Enviando")}/>
            </div>
            <div className="w-[92%] my-10 mx-auto p-10">
                <h1 className="my-4 font-bold text-lg">
                    Órdenes entregadas:
                </h1>
                
                <DataTable columns={columns} rows={orders?.filter((x:Order)=>x.orderStatus === "Entregada")}/>
            </div>
            <div className="w-[92%] my-10 mx-auto p-10">
                <h1 className="my-4 font-bold text-lg">
                    Órdenes canceladas:
                </h1>
                
                <DataTable columns={columns} rows={orders?.filter((x:Order)=>x.orderStatus === "Cancelada")}/>
            </div>
        </div>
    )
}