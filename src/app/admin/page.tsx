'use client'

import { IconButton, InputAdornment, TextField } from "@mui/material";
import { useEffect, useState } from "react"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Visibility, VisibilityOff } from "@mui/icons-material";
import DashBoardMenu from "../components/DashBoardMenu";
import AdminOrders from "../components/AdminSections/Orders";
import AdminProducts from "../components/AdminSections/Products";
import AdminTransportation from "../components/AdminSections/Transportation";

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
    const [showPassPhraseModal, setShowPassPhraseModal]= useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [enterePassPhrase, setEnteredPassPhrase] = useState("")
    const checkPassPhrase = () =>{
        if(enterePassPhrase === process.env.NEXT_PUBLIC_ADMIN_PASSPHRASE)
        {
            window.localStorage.setItem("authTime", new Date()+"")
            setShowPassPhraseModal(false)
        }
        else
        {
            toast.error("Frase incorrecta.")
        }
    }

    useEffect(()=>{
        const now = new Date()
        const authTime = new Date(window.localStorage.getItem("authTime")!)
        const nowConverted = now.getHours()*60+now.getMinutes()
        const authTimeConverted =  authTime.getHours()*60+authTime.getMinutes()
        if(nowConverted - authTimeConverted > 60)
        {
            setShowPassPhraseModal(true)
        }
    },[])

    const [openSection, setOpenSection] = useState("")
    
    

    return(
        <div className="">
            {
                showPassPhraseModal &&
                <div className=" w-9/12 lg:w-1/4 xl:w-1/4 mx-auto lg:absolute xl:absolute top-[40%] left-[37%] items-center grid grid-cols-1 justify-center">
                    <h2 className="text-lg mt-[70%] lg:mt-0 xl:mt-0 mb-10">Introduzca la frase de acceso a la administración:</h2>
                    <div className="flex lg:flex-row xl:flex-row flex-col gap-6 items-center justify-between">
                        <TextField
                            className="lg:w-[70%] xl:w-[70%] w-full"
                            type={showPassword ? "text" : "password"}
                            label="Frase"
                            variant="outlined"
                            onChange={(e)=>setEnteredPassPhrase(e.target.value)}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                    <IconButton
                                    onClick={()=>setShowPassword(!showPassword)}
                                    edge="end"
                                    >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                                ),
                            }}
                        />
                        <button className="w-[80%] lg:w-1/4 xl:w-1/4 px-5 py-2 rounded-lg border-2 border-green-600 bg-green-600 text-white font-bold" onClick={()=>checkPassPhrase()}>Acceder</button>
                    </div>
                </div>
            }
            <ToastContainer />
            {
                !showPassPhraseModal &&
                <div className="w-[95%] ml-auto">
                    <DashBoardMenu setOpenSection={setOpenSection} openSection={openSection}/>
                    {
                        openSection === "AdminOrders"
                            ?
                                <AdminOrders />
                            :
                            openSection === "AdminProducts"
                                ?
                                    <AdminProducts />
                                :
                                openSection === "AdminTransportation"
                                ?
                                    <AdminTransportation />
                                :
                                <></>
                    }
                </div>
            }
        </div>
    )
}
