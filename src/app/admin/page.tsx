'use client'

import { useEffect, useState } from "react"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AdminPanel()
{
    const [products, setProducts] = useState([]);
    const [productMethod, setProductMethod] = useState("POST")
    const [selectedProduct, setSelectedProduct] = useState({_id:"", name:"", image:"", description:"", unitPrice:""})
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
            setSelectedProduct({_id:"", name:"", image:"", description:"", unitPrice:""})
            setLoadedProducts(false)
            setProducts([])
        }
    },[productMethod])

    useEffect(()=>{
        if(products.length !== 0)
        {
            setLoadedProducts(true)
        }
    },[products])

    const onSubmitProduct = async (e:any) => {
        e.preventDefault()
        const form = (document.forms as unknown as {[key:string]:HTMLFormElement})["createForm"]
        const product = {
            "name": (form["name"] as unknown as HTMLInputElement).value,
            "description": (form["description"] as unknown as HTMLInputElement).value,
            "unitPrice": (form["price"] as unknown as HTMLInputElement).value,
            "image": (form["image"] as unknown as HTMLInputElement).value
        }
        await toast.promise(
            fetch(`${window.location.origin}/api/products/${selectedProduct?._id}`, {
                method: productMethod,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(product)
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
    const [selectedTransportation, setSelectedTransportation] = useState({_id:"", city:"", transportation_price:""})
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
            setSelectedTransportation({_id:"", city:"", transportation_price:""})
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
            fetch(`${window.location.origin}/api/transportations/${selectedTransportation?._id}`, {
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
                            <select name="" id="" onChange={(e)=>setSelectedProduct(products.filter((x:any)=>x._id == e.target.value)[0])}>
                                <option value="default">Select Product</option>
                                {
                                    products.map((product:any, key)=>
                                        <option key={key} value={product._id} onClick={()=>setSelectedProduct(product)}>{product.name}</option>
                                    )
                                }
                            </select>
                    }
                </h1>
                <form action="" name="createForm" onSubmit={(e)=>onSubmitProduct(e)} className="w-full xl:grid lg:grid grid-cols-2 text-lg">
                    <div className="xl:flex lg:flex flex-row my-10">
                        <label className="mr-5" htmlFor="name">Nombre:</label>
                        <input onChange={(e)=>{setSelectedProduct({
                            _id: selectedProduct?._id,
                            name: e.target.value,
                            image: selectedProduct?.image,
                            description: selectedProduct?.description,
                            unitPrice: selectedProduct?.unitPrice
                        })}} value={selectedProduct?.name} className="border-2" type="text" name="name" id="" />
                    </div>

                    <div className="xl:flex lg:flex flex-row my-10">
                        <label className="mr-5" htmlFor="description">Descripción:</label>
                        <input onChange={(e)=>{setSelectedProduct({
                            _id: selectedProduct?._id,
                            name: selectedProduct?.name,
                            image: selectedProduct?.image,
                            description: e.target.value,
                            unitPrice: selectedProduct?.unitPrice
                        })}} value={selectedProduct?.description} className="border-2" type="text" name="description" id="" />
                    </div>

                    <div className="xl:flex lg:flex flex-row my-10">
                        <label className="mr-5" htmlFor="price">Precio unitario:</label>
                        <input onChange={(e)=>{setSelectedProduct({
                            _id: selectedProduct?._id,
                            name: selectedProduct?.name,
                            image: selectedProduct?.image,
                            description: selectedProduct?.description,
                            unitPrice: e.target.value
                        })}} value={selectedProduct?.unitPrice} className="border-2" type="number" step="any" name="price" id="" />
                    </div>

                    <div className="xl:flex lg:flex flex-row my-10">
                        <label className="mr-5" htmlFor="image">Imagen:</label>
                        <input className="border-2 w-full" type="file" name="image" id="" />
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
                            <select name="" id="" onChange={(e)=>setSelectedTransportation(transportations.filter((x:any)=>x._id == e.target.value)[0])}>
                                {
                                    transportations.map((transportation:any, key)=>
                                        <option key={key} value={transportation._id} onClick={()=>setSelectedTransportation(transportation)}>{transportation.city}</option>
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
                                _id: selectedTransportation?._id,
                                city: e.target.value,
                                transportation_price: selectedTransportation?.transportation_price
                            })}}/>
                        }
                    </div>

                    <div className="xl:flex lg:flex flex-row my-10">
                        <label className="mr-5" htmlFor="transportation_price">Precio:</label>
                        {
                            <input className="border-2" type="number" step="any" name="transportation_price" id="" value={selectedTransportation?.transportation_price} onChange={(e)=>{setSelectedTransportation({
                                _id: selectedTransportation?._id,
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
