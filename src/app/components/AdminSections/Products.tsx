import { GridColDef } from "@mui/x-data-grid";
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { DataTable } from "../DataTable";
import { IconEdit, IconTrash, IconX } from "@tabler/icons-react";

export default function AdminProducts()
{
    const [products, setProducts] = useState<product[]>([]);
    const [productMethod, setProductMethod] = useState("POST")
    const [selectedProduct, setSelectedProduct] = useState({id:"", name:"", image:"", description:"", unitPrice:"", defaultQuant:"", priority: ""})

    const fetchProducts = () =>{
        fetch(`${window.location.origin}/api/products`)
        .then(response => response.json())
        .then(data => setProducts(data.products))
    }
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
        fetchProducts()
    },[productMethod])

    const [priorityChanged, setPriorityChanged] = useState(false);

    const handlePriorityChange = (e: any, id: any) => {
        const oldPriority = products.find((x:product)=>x.id === id)?.priority;
        const newPriority = e.target.value;

        const updatedProducts = products?.map((product: product) =>
            product.id === id
                ? { ...product, priority: newPriority }
                : product.priority == newPriority
                ? { ...product, priority: oldPriority }
                : product
        );

        setProducts(updatedProducts);

        if (oldPriority !== newPriority) {
            setPriorityChanged(true);
        }
    };

    useEffect(() => {
        if (priorityChanged) {
            handlePrioritySubmit();
            setPriorityChanged(false);
        }
    }, [priorityChanged]);


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
              pending: 'Actualizando productos...',
              success: 'Productos actualizados satisfactoriamente!',
              error: 'Falló la actualización de productos.',
            }
          );
        } catch (error) {
          console.error("Error updating products:", error);
        }
    };

    const onSubmitProduct = async (e: any) => {
        e?.preventDefault();
        const formData = new FormData(e?.target);
        formData.append("priority", selectedProduct?.priority ? selectedProduct?.priority+"" : "0")
        await toast.promise(
            fetch(`${(typeof(window) !== undefined) ? window.location.origin : ''}/api/products/${selectedProduct?.id}`, {
                method: productMethod,
                body: formData
            }).then(response => {
                return response.json();
            }), {
                pending: `${productMethod === "POST" ? "Creando" : (productMethod === "PUT" ? "Actualizando" : "Eliminando")} producto`,
                success: `Producto ${productMethod === "POST" ? "creado" : (productMethod === "PUT" ? "actualizado" : "eliminado")} 👌`,
                error: `There was an error 🤯`
            }
        );
        setShowEditModal(false)
        setSelectedProduct(null!)
        fetchProducts()
    }

    const [showEditModal, setShowEditModal] = useState(false)

    const handleEditButtonClick = (product: product) => {
        setProductMethod("PUT")
        setSelectedProduct(product)
        setShowEditModal(true)
    }

    const handleRemoveButtonClick = (product: product) =>{
        setProductMethod("DELETE") 
        setSelectedProduct(product)
    }
    useEffect(()=>{
        if(productMethod === "DELETE")
        {
            if(confirm("Quiere borrar el producto "+selectedProduct?.name+"?")) onSubmitProduct(null)
        }
    },[productMethod])

    const [productHasChanged, setProductHasChanged] = useState(false)

    useEffect(()=>{
        setProductHasChanged(products.filter((x:product)=>
            x.id == selectedProduct?.id &&
            x.defaultQuant == selectedProduct?.defaultQuant &&
            x.description == selectedProduct?.description &&
            x.name == selectedProduct?.name &&
            x.unitPrice == selectedProduct?.unitPrice
     ).length == 1)
    },[selectedProduct])


    const columns: GridColDef[] = [
        {
          field: 'name', 
          headerName: 'Nombre', 
          width: 180, 
          sortable: false,
          renderCell: (params: any) => <p>{params.row.name}</p>,
        },
        { 
          field: 'description', 
          headerName: 'Descripción', 
          width: 350, 
          sortable: false,
          renderCell: (params: any) => <p>{params.row.description}</p>,
        },
        { 
          field: 'unitPrice', 
          headerName: 'Precio por unidad', 
          width: 150, 
          sortable: true,
          renderCell: (params: any) => <p className="">{params.row.unitPrice} CUP</p>,
          cellClassName: 'centered-cell'
        },
        { 
          field: 'defaultQuant', 
          headerName: 'Cantidad del pack', 
          width: 150, 
          sortable: true,
          renderCell: (params: any) => <p className="">{params.row.defaultQuant}</p>,
          cellClassName: 'centered-cell'
        },
        { 
          field: 'priority', 
          headerName: 'Prioridad al mostrar', 
          sortable: true, 
          width: 160, 
          renderCell: (params: any) => 
          {
            const p = params.row
            return (
                <select name="" id="" onChange={(e)=>{handlePriorityChange(e, p.id)}}>
                    <option value="">{p.priority}</option>
                    {
                        new Array(products.length).fill(null)?.map((_:any, i:number)=>{
                            if(i != p.priority)
                            {
                                return(
                                    <option value={i} key={i} >
                                        {i}
                                    </option>
                                )
                            }
                        })
                    }
                </select>
            )
          },
          cellClassName: 'centered-cell'
        },
        { 
          field: 'stock', 
          headerName: 'Stock', 
          sortable: true, 
          width: 160, 
          renderCell: (params: any) => <p className="">{parseInt(process.env.NEXT_PUBLIC_MEMBERSHIP!)>1 ? params.row.stock : ""}</p>,
          cellClassName: 'centered-cell'
        },
        { 
          field: 'actions', 
          headerName: 'Acciones', 
          sortable: false, 
          width: 160, 
          renderCell: (params: any) => 
            <div className="flex gap-5">
                <p className="cursor-pointer" onClick={()=>handleRemoveButtonClick(params.row)}><IconTrash/></p>
                <p className="cursor-pointer" onClick={()=>handleEditButtonClick(params.row)}><IconEdit /></p>
            </div>,
          cellClassName: 'centered-cell'
        }
    ];
    
    return(
        <div className="w-[75%] my-5 mx-auto rounded-xl p-10">
            <div className="w-full flex justify-end">
                <button onClick={()=>{setShowEditModal(true), setProductMethod("POST")}} className="border-2 w-[20%] mb-12 p-2 rounded-lg bg-gray-500 text-white">
                    Crear producto
                </button>
            </div>
            <DataTable columns={columns} rows={products}/>
            {
                showEditModal &&
                <div onClick={()=>setShowEditModal(false)} className="fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-50 z-10 backdrop-blur-sm flex justify-center items-center overflow-auto">
                    <div onClick={(e) => e.stopPropagation()} className="relative z-20 p-10 font-bold text-lg w-full max-w-5xl mx-auto bg-white rounded-xl shadow-lg overflow-y-auto max-h-[90vh]">
                        <div onClick={()=>setShowEditModal(false)} className="flex justify-end cursor-pointer"><IconX /></div>
                        <h1>{productMethod === "POST" ? "Crear producto" : "Actualizar producto"}: {productMethod === "PUT" ? selectedProduct?.name : ""}</h1>
                        <form onSubmit={onSubmitProduct} name="createForm" className="items-center w-full lg:grid xl:grid grid-cols-2 gap-4 text-lg">
                            <div className="w-8/12 flex flex-col gap-4 my-10">
                                <label className="mr-2" htmlFor="name">Nombre:</label>
                                <input
                                    onChange={(e) => {
                                        setSelectedProduct({
                                            ...selectedProduct,
                                            name: e.target.value,
                                        });
                                    }}
                                    value={selectedProduct?.name}
                                    className="border-2 font-normal"
                                    type="text"
                                    name="name"
                                    id=""
                                />
                            </div>

                            <div className="w-8/12 flex flex-col gap-4 my-10">
                                <label className="mr-2" htmlFor="description">Descripción:</label>
                                <textarea
                                    onChange={(e) => {
                                        setSelectedProduct({
                                            ...selectedProduct,
                                            description: e.target.value,
                                        });
                                    }}
                                    value={selectedProduct?.description}
                                    className="border-2 font-normal h-auto"
                                    name="description"
                                    id=""
                                />
                            </div>

                            <div className="w-8/12 flex flex-col gap-4 my-10">
                                <label className="mr-2" htmlFor="unitPrice">Precio por unidad:</label>
                                <input
                                    onChange={(e) => {
                                        setSelectedProduct({
                                            ...selectedProduct,
                                            unitPrice: e.target.value,
                                        });
                                    }}
                                    value={selectedProduct?.unitPrice}
                                    className="border-2 font-normal w-auto"
                                    type="number"
                                    step="any"
                                    name="unitPrice"
                                    id=""
                                />
                            </div>

                            <div className="w-8/12 flex flex-col gap-4 my-10">
                                <label className="w-1/2" htmlFor="defaultQuant">Cantidad:</label>
                                <input
                                    onChange={(e) => {
                                        setSelectedProduct({
                                            ...selectedProduct,
                                            defaultQuant: e.target.value,
                                        });
                                    }}
                                    value={selectedProduct?.defaultQuant}
                                    className="border-2 font-normal w-auto h-auto"
                                    type="number"
                                    step="any"
                                    name="defaultQuant"
                                    id=""
                                />
                            </div>

                            <div className="w-8/12 flex flex-col gap-4 my-10">
                                <label className="mr-2" htmlFor="image">Imagen:</label>
                                <input className="border-2 w-auto font-normal" type="file" name="image" />
                            </div>

                            <div className="flex my-10 col-span-2">
                                <button disabled={productHasChanged} style={{opacity: productHasChanged ? "0.6" : "1"}} className="border-2 w-1/3 p-2 rounded-lg bg-green-500 text-white mx-auto">
                                    {productMethod === "POST" ? "Crear" : "Actualizar"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            }
            
        </div>
    )
}