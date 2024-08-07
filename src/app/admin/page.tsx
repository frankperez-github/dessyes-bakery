'use client'

import { useEffect, useState } from "react"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { json } from "stream/consumers";

export default function AdminPanel()
{
    const [products, setProducts] = useState([]);
    const [productMethod, setProductMethod] = useState("POST")
    const [selectedProduct, setSelectedProduct] = useState({id:"", name:"", image:"", description:"", unitPrice:"", defaultQuant:""})
    const [loadedProducts, setLoadedProducts] = useState(false)

    useEffect(()=>{
        if(productMethod === "DELETE"  || productMethod === "PUT")
        {
            fetch(`${window.location.origin}/api/products`)
            .then(response => response.json())
            .then(data => setProducts(data.products))
        }
        else
        {
            setSelectedProduct({id:"", name:"", image:"", description:"", unitPrice:"", defaultQuant: ""})
            setLoadedProducts(false)
            setProducts([])
        }
    },[productMethod])

    useEffect(()=>{
        if(products && products.length>0)
        {
            setLoadedProducts(true)
        }
    },[products])

    const onSubmitProduct = async (e: any) => {
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
        // window.location.reload()
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
    
    return(
        <div className="">
            <ToastContainer />
            <div className=" xl:w-1/2 lg:w-1/2 md:w-1/2 w-10/12 my-32 mx-auto border-2 border-red-500 rounded-xl p-10">
                <h1 className="my-4 font-bold text-xl">
                    <select name="productMethod" id="" onChange={(e)=>{setProductMethod(e.target.value)}}>
                        <option value="POST">Insert</option>
                        <option value="PUT">Update</option>
                        <option value="DELETE">Delete</option>
                    </select>
                        product:
                    {
                        loadedProducts  
                            &&
                            <select name="" id="" onChange={(e)=>setSelectedProduct(products.filter((x:any)=>x.id == e.target.value)[0])}>
                                <option value="default">Select Product</option>
                                {
                                    products.map((product:any, key)=>
                                        <option key={key} value={product.id} onClick={()=>setSelectedProduct(product)}>{product.name}</option>
                                    )
                                }
                            </select>
                    }
                </h1>
                <form onSubmit={onSubmitProduct} name="createForm" className="w-full xl:grid lg:grid grid-cols-2 text-lg">
                    <div className="xl:flex lg:flex flex-row my-10">
                        <label className="mr-5" htmlFor="name">Nombre:</label>
                        <input onChange={(e)=>{setSelectedProduct({
                            id: selectedProduct?.id,
                            name: e.target.value,
                            image: selectedProduct?.image,
                            description: selectedProduct?.description,
                            unitPrice: selectedProduct?.unitPrice,
                            defaultQuant: selectedProduct?.defaultQuant
                        })}} value={selectedProduct?.name} className="border-2" type="text" name="name" id="" />
                    </div>

                    <div className="xl:flex lg:flex flex-row my-10">
                        <label className="mr-5" htmlFor="description">Descripción:</label>
                        <input onChange={(e)=>{setSelectedProduct({
                            id: selectedProduct?.id,
                            name: selectedProduct?.name,
                            image: selectedProduct?.image,
                            description: e.target.value,
                            unitPrice: selectedProduct?.unitPrice,
                            defaultQuant: selectedProduct?.defaultQuant
                        })}} value={selectedProduct?.description} className="border-2" type="text" name="description" id="" />
                    </div>

                    <div className="xl:flex lg:flex flex-row my-10">
                        <label className="mr-5" htmlFor="unitPrice">Precio unitario:</label>
                        <input onChange={(e)=>{setSelectedProduct({
                            id: selectedProduct?.id,
                            name: selectedProduct?.name,
                            image: selectedProduct?.image,
                            description: selectedProduct?.description,
                            unitPrice: e.target.value,
                            defaultQuant: selectedProduct?.defaultQuant
                        })}} value={selectedProduct?.unitPrice} className="border-2" type="number" step="any" name="unitPrice" id="" />
                    </div>

                    <div className="xl:flex lg:flex flex-row my-10">
                        <label className="mr-5" htmlFor="defaultQuant">Contenido de la ración:</label>
                        <input onChange={(e)=>{setSelectedProduct({
                            id: selectedProduct?.id,
                            name: selectedProduct?.name,
                            image: selectedProduct?.image,
                            description: selectedProduct?.description,
                            unitPrice: selectedProduct?.unitPrice,
                            defaultQuant: e.target.value,
                        })}} value={selectedProduct?.defaultQuant} className="border-2" type="number" step="any" name="defaultQuant" id="" />
                    </div>

                    <div className="xl:flex lg:flex flex-row my-10">
                        <label className="mr-5" htmlFor="image">Imagen:</label>
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
            <div className="xl:w-1/2 lg:w-1/2 md:w-1/2 w-10/12 my-32 mx-auto border-2 border-red-500 rounded-xl p-10">
                <div className="my-4 font-bold text-xl flex">
                    <select name="productMethod" id="" onChange={(e)=>{setTransportationMethod(e.target.value)}}>
                        <option value="POST">Insert</option>
                        <option value="PUT">Update</option>
                        <option value="DELETE">Delete</option>
                    </select>
                    <h1 className="my-4 font-bold text-xl">
                        transportation charge:
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
                <form action="" name="createTransportation" onSubmit={(e)=>onSubmitTransportation(e)} className="w-full xl:grid lg:grid grid-cols-2 text-lg">
                    <div className="xl:flex lg:flex flex-row my-10">
                        <label className="mr-5" htmlFor="city">Municipio:</label>
                        {
                            <input className="border-2" type="text" name="city" id="" value={selectedTransportation?.city} onChange={(e)=>{setSelectedTransportation({
                                id: selectedTransportation?.id,
                                city: e.target.value,
                                transportation_price: selectedTransportation?.transportation_price
                            })}}/>
                        }
                    </div>

                    <div className="xl:flex lg:flex flex-row my-10">
                        <label className="mr-5" htmlFor="transportation_price">Precio:</label>
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
        </div>
    )
}
