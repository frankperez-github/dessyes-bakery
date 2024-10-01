import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function AdminTransportation()
{
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
                form.reset()
                return response.json();
            }), {
                pending: `${transportationMethod === "POST" ? "Creating" : transportationMethod === "PUT" ? "Updating" : "Deleting"} Transportation`,
                success: `Transportation ${transportationMethod === "POST" ? "created" : transportationMethod === "PUT" ? "updated" : "deleted"} 👌`,
                error: `There was an error 🤯`
            }
        );
    }
    return(
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
                                transportations.map((transportation:any, key:number)=>
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
    )
}