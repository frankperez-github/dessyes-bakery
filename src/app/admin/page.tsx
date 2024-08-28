'use client'

import { Switch } from "@mui/material";
import Link from "next/link";
import { useEffect, useState } from "react"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { DataTable } from "../components/DataTable";
import { GridColDef } from "@mui/x-data-grid";

type product = {
    id: string,
    name: string, 
    image: string, 
    description: string,
    unitPrice: string,
    defaultQuant: string,
    priority: string
}

export default function AdminPanel()
{
    const [products, setProducts] = useState<product[]>([]);
    const [productMethod, setProductMethod] = useState("POST")
    const [selectedProduct, setSelectedProduct] = useState({id:"", name:"", image:"", description:"", unitPrice:"", defaultQuant:"", priority: ""})

    useEffect(()=>{
        if(window)
        {
            fetch(`${window.location.origin}/api/products`)
            .then(response => response.json())
            .then(data => setProducts(data.products))
        }
        
    },[productMethod])

    const onSubmitProduct = async (e: any) => {
        if(!window) return
        e.preventDefault();
        const formData = new FormData(e.target);
        await toast.promise(
            fetch(`${window.location.origin}/api/products/${selectedProduct?.id}`, {
                method: productMethod,
                body: formData
            }).then(response => {
                return response.json();
            }), {
                pending: `${productMethod === "POST" ? "Creating" : productMethod === "PUT" ? "Updating" : "Deleting"} Product`,
                success: `Product ${productMethod === "POST" ? "created" : productMethod === "PUT" ? "updated" : "deleted"} 👌`,
                error: `There was an error 🤯`
            }
        );
        window.location.reload()
    }

    const [transportations, setTransportations] = useState([]);
    const [transportationMethod, setTransportationMethod] = useState("POST")
    const [selectedTransportation, setSelectedTransportation] = useState({id:"", city:"", transportation_price:""})
    const [loadedTransportations, setLoadedTransportations] = useState(false)

    useEffect(()=>{
        if(transportationMethod === "DELETE"  || transportationMethod === "PUT")
        {
            fetch(`${window.location.origin}/api/transportations`)
            .then(response => response.json())
            .then(data => setTransportations(data.transportations))
        }
        else
        {
            setSelectedTransportation({id:"", city:"", transportation_price:""})
            setLoadedTransportations(false)
            setTransportations([])
        }
    },[transportationMethod])

    useEffect(()=>{
        if(transportations.length !== 0)
        {
            setLoadedTransportations(true)
        }
    },[transportations])
    

    const onSubmitTransportation = async (e:any) => {
        e.preventDefault()
        const form = (document.forms as unknown as {[key:string]:HTMLFormElement})["createTransportation"]
        const transportation = {
            "city": (form["city"] as unknown as HTMLInputElement).value,
            "transportation_price": (form["transportation_price"] as unknown as HTMLInputElement).value,
        }
        await toast.promise(
            fetch(`${window.location.origin}/api/transportations/${selectedTransportation?.id}`, {
                method: transportationMethod,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(transportation)
            }).then(response => {
                return response.json();
            }), {
                pending: `${transportationMethod === "POST" ? "Creating" : transportationMethod === "PUT" ? "Updating" : "Deleting"} Transportation`,
                success: `Transportation ${transportationMethod === "POST" ? "created" : transportationMethod === "PUT" ? "updated" : "deleted"} 👌`,
                error: `There was an error 🤯`
            }
        );
        window.location.reload()
    }

    const handlePriorityChange = (e:any, id:any) => {
        const newPriority = e.target.value;
    
        // Update the array of products with the new priority
        const updatedProducts = products?.map((product:product) =>
          product.id === id ? { ...product, priority: newPriority } : product
        );
    
        setProducts(updatedProducts);
    };

    const handlePrioritySubmit = async () => {
        try {
          await toast.promise(
            Promise.all(
              products?.map(async (product: product) => {
                const formData = new FormData();
                formData.append('id', product?.id);
                formData.append('name', product?.name);
                formData.append('image', product?.image);
                formData.append('description', product?.description);
                formData.append('unitPrice', product?.unitPrice);
                formData.append('defaultQuant', product?.defaultQuant);
                formData.append('priority', product?.priority);
      
                const response = await fetch(`${window.location.origin}/api/products/${product.id}`, {
                  method: 'PUT',
                  body: formData
                });
      
                if (!response.ok) {
                  throw new Error(`Failed to update product ${product.id}`);
                }
              })
            ),
            {
              pending: 'Updating products?...',
              success: 'Products updated successfully!',
              error: 'Failed to update products?.',
            }
          );
        } catch (error) {
          console.error("Error updating products:", error);
        }
    };

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
        fetchOrders()
        setLoadingOrders(true)
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
            window.location.reload()
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
            window.location.reload()
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
      

    
    return(
        <div className="">
            <ToastContainer />
            <div className="fixed top-[90%] xl:left-[80%] lg:left-[80%] md:left-[80%] left-[65%]">
                <a href="/" className="text-3xl border-2 border-black bg-gray-300 !z-40 p-5 rounded-lg">Ir a la vista de usuario</a>
            </div>
            <div className="w-[92%] my-32 mx-auto p-10">
                <h1 className="my-4 font-bold text-lg">
                    Órdenes pendientes:
                </h1>
                
                <DataTable columns={columns} rows={orders.filter((x:Order)=>x.orderStatus === "Procesando")}/>
            </div>
            <div className="w-[92%] my-32 mx-auto p-10">
                <h1 className="my-4 font-bold text-lg">
                    Órdenes enviándose:
                </h1>
                
                <DataTable columns={columns} rows={orders.filter((x:Order)=>x.orderStatus === "Enviando")}/>
            </div>
            <div className="w-[92%] my-32 mx-auto p-10">
                <h1 className="my-4 font-bold text-lg">
                    Órdenes entregadas:
                </h1>
                
                <DataTable columns={columns} rows={orders.filter((x:Order)=>x.orderStatus === "Entregada")}/>
            </div>
            <div className="w-[92%] my-32 mx-auto p-10">
                <h1 className="my-4 font-bold text-lg">
                    Órdenes canceladas:
                </h1>
                
                <DataTable columns={columns} rows={orders.filter((x:Order)=>x.orderStatus === "Cancelada")}/>
            </div>
            <div className="w-10/12 my-32 mx-auto border-2 border-red-500 rounded-xl p-10">
                <h1 className="my-4 font-bold text-lg">
                    <select name="productMethod" id="" onChange={(e)=>{setProductMethod(e.target.value)}}>
                        <option value="POST">Insertar</option>
                        <option value="PUT">Actualizar</option>
                        <option value="DELETE">Borrar</option>
                    </select>
                        producto:
                    {
                        productMethod !== "POST" && productMethod !== "GET"  
                            &&
                            <select name="" id="" onChange={(e)=>setSelectedProduct(products?.filter((x:any)=>x.id == e.target.value)[0])}>
                                <option value="default">Select Product</option>
                                {
                                    products?.map((product:any, key)=>
                                        <option key={key} value={product.id} onClick={()=>setSelectedProduct(product)}>{product.name}</option>
                                    )
                                }
                            </select>
                    }
                </h1>
                <form onSubmit={onSubmitProduct} name="createForm" className="w-full xl:grid lg:grid grid-cols-2 gap-4 text-lg">
                    <div className="xl:flex lg:flex flex-row my-10">
                        <label className="mr-2" htmlFor="name">Nombre:</label>
                        <input onChange={(e)=>{setSelectedProduct({
                            id: selectedProduct?.id,
                            name: e.target.value,
                            image: selectedProduct?.image,
                            description: selectedProduct?.description,
                            unitPrice: selectedProduct?.unitPrice,
                            defaultQuant: selectedProduct?.defaultQuant,
                            priority: selectedProduct?.priority
                        })}} value={selectedProduct?.name} className="border-2" type="text" name="name" id="" />
                    </div>

                    <div className="xl:flex lg:flex flex-row my-10">
                        <label className="mr-2" htmlFor="description">Descripción:</label>
                        <input onChange={(e)=>{setSelectedProduct({
                            id: selectedProduct?.id,
                            name: selectedProduct?.name,
                            image: selectedProduct?.image,
                            description: e.target.value,
                            unitPrice: selectedProduct?.unitPrice,
                            defaultQuant: selectedProduct?.defaultQuant,
                            priority: selectedProduct?.priority
                        })}} value={selectedProduct?.description} className="border-2" type="text" name="description" id="" />
                    </div>

                    <div className="xl:flex lg:flex flex-row my-10">
                        <label className="mr-2" htmlFor="unitPrice">Precio unitario:</label>
                        <input onChange={(e)=>{setSelectedProduct({
                            id: selectedProduct?.id,
                            name: selectedProduct?.name,
                            image: selectedProduct?.image,
                            description: selectedProduct?.description,
                            unitPrice: e.target.value,
                            defaultQuant: selectedProduct?.defaultQuant,
                            priority: selectedProduct?.priority
                        })}} value={selectedProduct?.unitPrice} className="border-2" type="number" step="any" name="unitPrice" id="" />
                    </div>

                    <div className="xl:flex lg:flex flex-row my-10">
                        <label className="mr-2" htmlFor="defaultQuant">Cantidad del paquete:</label>
                        <input onChange={(e)=>{setSelectedProduct({
                            id: selectedProduct?.id,
                            name: selectedProduct?.name,
                            image: selectedProduct?.image,
                            description: selectedProduct?.description,
                            unitPrice: selectedProduct?.unitPrice,
                            defaultQuant: e.target.value,
                            priority: selectedProduct?.priority
                        })}} value={selectedProduct?.defaultQuant} className="border-2" type="number" step="any" name="defaultQuant" id="" />
                    </div>

                    <div className="xl:flex lg:flex flex-row my-10">
                        <label className="mr-2" htmlFor="image">Imagen:</label>
                        <input className="border-2 w-full" type="file" name="image"/>
                    </div>
                    <div className="flex my-10 col-span-2">
                        <button className="border-2 w-1/3 p-2 rounded-lg bg-red-500 text-white mx-auto">
                            {
                                productMethod === "POST" ? "Crear" : 
                                productMethod === "PUT" ? "Actualizar" : "Eliminar"
                            }
                        </button>
                    </div>
                </form>
            </div>
            <div className="w-10/12 my-32 mx-auto border-2 border-red-500 rounded-xl p-10">
                <div className="my-4 font-bold text-lg flex">
                    <select name="productMethod" id="" onChange={(e)=>{setTransportationMethod(e.target.value)}}>
                        <option value="POST">Insertar</option>
                        <option value="PUT">Actualizar</option>
                        <option value="DELETE">Borrar</option>
                    </select>
                    <h1 className="my-4 font-bold text-lg">
                        transportación:
                    </h1>
                    {
                        loadedTransportations  
                            &&
                            <select name="" id="" onChange={(e)=>setSelectedTransportation(transportations.filter((x:any)=>x.id == e.target.value)[0])}>
                                <option value="Seleccione">Seleccione</option>
                                {
                                    transportations.map((transportation:any, key)=>
                                        <option key={key} value={transportation.id} onClick={()=>setSelectedTransportation(transportation)}>{transportation.city}</option>
                                    )
                                }
                            </select>
                    }
                </div>
                <form action="" name="createTransportation" onSubmit={(e)=>onSubmitTransportation(e)} className="w-full xl:grid lg:grid grid-cols-2 gap-4 text-lg">
                    <div className="xl:flex lg:flex flex-row my-10">
                        <label className="mr-2" htmlFor="city">Municipio:</label>
                        {
                            <input className="border-2" type="text" name="city" id="" value={selectedTransportation?.city} onChange={(e)=>{setSelectedTransportation({
                                id: selectedTransportation?.id,
                                city: e.target.value,
                                transportation_price: selectedTransportation?.transportation_price
                            })}}/>
                        }
                    </div>

                    <div className="xl:flex lg:flex flex-row my-10">
                        <label className="mr-2" htmlFor="transportation_price">Precio:</label>
                        {
                            <input className="border-2" type="number" step="any" name="transportation_price" id="" value={selectedTransportation?.transportation_price} onChange={(e)=>{setSelectedTransportation({
                                id: selectedTransportation?.id,
                                city: selectedTransportation?.city,
                                transportation_price: e.target.value
                            
                            })}}/>
                        }
                    </div>
                    <div className="flex my-10 col-span-2">
                        <button className="border-2 w-1/3 p-2 rounded-lg bg-red-500 text-white mx-auto">
                            {
                                transportationMethod === "POST" ? "Crear" : 
                                transportationMethod === "PUT" ? "Actualizar" : "Eliminar"
                            }
                        </button>
                    </div>
                </form>


            </div>
            <div className="w-10/12 my-32 mx-auto border-2 border-red-500 rounded-xl p-10">
                <table className="w-1/2 justify-between mx-auto">
                    <thead>
                        <tr>
                            <th>Prioridad:</th>
                            <th>Nombre:</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            products?.map((p:any, key)=>
                                <tr key={key} className="text-center">
                                    <td>
                                        <select name="" defaultValue={p.priority} id="" onChange={(e)=>{handlePriorityChange(e, p.id)}}>
                                            {
                                                products?.map((prod, i)=>(
                                                    <option value={i} key={i} >
                                                        {i}
                                                    </option>
                                                ))
                                            }
                                        </select>
                                    </td>
                                    <td className="text-center">
                                        {p.name}
                                    </td>
                                </tr>
                            )
                        }
                    </tbody>
                </table>
                <div className="flex mt-10 col-span-2">
                    <button onClick={handlePrioritySubmit} className="border-2 w-1/3 p-2 rounded-lg bg-red-500 text-white mx-auto">
                        Guardar
                    </button>
                </div>
            </div>
        </div>
    )
}
