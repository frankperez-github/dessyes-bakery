import { IconEdit, IconTrash, IconX } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { DataTable } from "../DataTable";
import { GridColDef } from "@mui/x-data-grid";

export default function AdminTransportation()
{
    const [transportations, setTransportations] = useState([]);
    const [transportationMethod, setTransportationMethod] = useState("POST")
    const [selectedTransportation, setSelectedTransportation] = useState({id:"", city:"", transportation_price:""})

    const fetchTransportations = () =>{
        fetch(`${window.location.origin}/api/transportations`)
            .then(response => response.json())
            .then(data => setTransportations(data.transportations))
    }
    
    useEffect(()=>{
        fetchTransportations()
    },[])


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
                form.reset()
                return response.json();
            }), {
                pending: `${transportationMethod === "POST" ? "Creando" : transportationMethod === "PUT" ? "Actualizando" : "Eliminando"} transportación`,
                success: `Transportación ${transportationMethod === "POST" ? "creada" : transportationMethod === "PUT" ? "actualizada" : "eliminada"} 👌`,
                error: `There was an error 🤯`
            }
        );
        fetchTransportations()
    }

    const [showEditModal, setShowEditModal] = useState(false)

    const handleEditButtonClick = (transportation: any) => {
        setTransportationMethod("PUT")
        setSelectedTransportation(transportation)
        setShowEditModal(true)
    }

    const handleRemoveButtonClick = (transportation: any) =>{
        setTransportationMethod("DELETE") 
        setSelectedTransportation(transportation)
    }
    useEffect(()=>{
        if(transportationMethod === "DELETE")
        {
            if(confirm("Quiere borrar la transportación a "+selectedTransportation?.city+"?")) onSubmitTransportation(null)
        }
    },[transportationMethod])

    const [transportationHasChanged, setTransportationHasChanged] = useState(false)

    useEffect(()=>{
        setTransportationHasChanged(transportations.filter((x:any)=>
            x.city == selectedTransportation?.city &&
            x.transportation_price == selectedTransportation?.transportation_price
     ).length == 1)
    },[selectedTransportation])


    const columns: GridColDef[] = [
        {
          field: 'city', 
          headerName: 'Municipio', 
          width: 180, 
          sortable: false,
          renderCell: (params: any) => <p>{params.row.city}</p>,
        },
        { 
          field: 'price', 
          headerName: 'Precio', 
          width: 350, 
          sortable: false,
          renderCell: (params: any) => <p>{params.row.transportation_price} CUP</p>,
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
                    <button onClick={()=>{setShowEditModal(true), setTransportationMethod("POST")}} className="border-2 w-[20%] mb-12 p-2 rounded-lg bg-gray-500 text-white">
                        Crear transportación
                    </button>
                </div>
                <DataTable columns={columns} rows={transportations}/>
                {
                    showEditModal &&
                    <div onClick={()=>setShowEditModal(false)} className="fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-50 z-10 backdrop-blur-sm flex justify-center items-center overflow-auto">
                        <div onClick={(e) => e.stopPropagation()} className="relative z-20 p-10 font-bold text-lg w-full max-w-5xl mx-auto bg-white rounded-xl shadow-lg overflow-y-auto max-h-[90vh]">
                            <div onClick={()=>setShowEditModal(false)} className="flex justify-end cursor-pointer"><IconX /></div>
                            <h1>{transportationMethod === "POST" ? "Crear transportación" : "Actualizar transportación:"}</h1>
                            <form onSubmit={onSubmitTransportation} name="createForm" className="items-center w-full lg:grid xl:grid grid-cols-2 gap-4 text-lg">
                                <div className="w-8/12 flex flex-col gap-4 my-10">
                                    <label className="mr-2" htmlFor="name">Municipio:</label>
                                    <input
                                        onChange={(e) => {
                                            setSelectedTransportation({
                                                ...selectedTransportation,
                                                city: e.target.value,
                                            });
                                        }}
                                        value={selectedTransportation?.city}
                                        className="border-2 font-normal"
                                        type="text"
                                        name="city"
                                        id=""
                                    />
                                </div>
                                <div className="w-8/12 flex flex-col gap-4 my-10">
                                    <label className="mr-2" htmlFor="name">Precio:</label>
                                    <input
                                        onChange={(e) => {
                                            setSelectedTransportation({
                                                ...selectedTransportation,
                                                transportation_price: e.target.value,
                                            });
                                        }}
                                        value={selectedTransportation?.transportation_price}
                                        className="border-2 font-normal"
                                        type="text"
                                        name="transportation_price"
                                        id=""
                                    />
                                </div>
    
                                <div className="flex my-10 col-span-2">
                                    <button disabled={transportationHasChanged} style={{opacity: transportationHasChanged ? "0.6" : "1"}} className="border-2 w-1/3 p-2 rounded-lg bg-green-500 text-white mx-auto">
                                        {transportationMethod === "POST" ? "Crear" : "Actualizar"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                }
                
            </div>
    )
}