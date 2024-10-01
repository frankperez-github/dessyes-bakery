import { useEffect, useState } from "react"
import { toast } from "react-toastify"

export default function AdminProducts()
{
    const [products, setProducts] = useState<product[]>([]);
    const [productMethod, setProductMethod] = useState("POST")
    const [selectedProduct, setSelectedProduct] = useState({id:"", name:"", image:"", description:"", unitPrice:"", defaultQuant:"", priority: ""})

    type product = {
        id: string,
        name: string, 
        image: string, 
        description: string,
        unitPrice: string,
        defaultQuant: string,
        priority: string
    }

    useEffect(()=>{
        fetch(`${window.location.origin}/api/products`)
        .then(response => response.json())
        .then(data => setProducts(data.products))
        
    },[productMethod])

    const handlePriorityChange = (e:any, id:any) => {
        const newPriority = e.target.value;
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

    const onSubmitProduct = async (e: any) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        formData.append("priority", 0+"")
        await toast.promise(
            fetch(`${(typeof(window) !== undefined) ? window.location.origin : ''}/api/products/${selectedProduct?.id}`, {
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
    }
    return(
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
                                products?.map((product:any, key:number)=>
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
                            products?.map((p:any, key:number)=>
                                <tr key={key} className="text-center">
                                    <td>
                                        <select name="" defaultValue={p.priority} id="" onChange={(e)=>{handlePriorityChange(e, p.id)}}>
                                            {
                                                products?.map((prod:product, i:number)=>(
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