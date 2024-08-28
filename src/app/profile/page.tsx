'use client'
import { signOut } from "@/supabase/supabaseAuth";
import Layout from "../components/Layout";
import useAuth from "../hooks/useAuth";
import { Skeleton } from "@mui/material";
import { useEffect, useState } from "react";
import OrderCard from "../components/OrderCard";
import OrdersCardSkeletons from "../components/OrdersCardsSkeleton";
import clsx from "clsx";

export default function Profile()
{
    
    const user = useAuth()
    
    const params = typeof(window) !== undefined ? new URLSearchParams(window.location.search): new URLSearchParams();
    const category = params.get('category');
    const [userOrders, setUserOrders] = useState<Order[]>()
    
    const handleSignOut = async (e:any) => {
        e.preventDefault()
        try {
            await signOut();
            if(typeof(window) !== undefined)
            {
                window.location.replace('/')
            }
        } catch (error:any) {
            console.error('Error signing out:', error.message);
        }
    };

    const fetchOrders = async () =>{
        const orders = await fetch("/api/orders")
        const filteredOrders = (await orders?.json()).orders?.filter((ord:any)=>ord.userId === user?.id)
        setUserOrders(filteredOrders)
    }

    useEffect(()=>{
        if(user)
        {
            fetchOrders()
        }
    },[user])

    
    useEffect(()=>{
        switch (category) {
            case "Profile":
                document.getElementById("Profile")?.classList.add("selectedProfileSection")
                document.getElementById("Orders")?.classList.remove("selectedProfileSection")
                break;
            case "Orders":
                document.getElementById("Orders")?.classList.add("selectedProfileSection")
                document.getElementById("Profile")?.classList.remove("selectedProfileSection")
                break;
            default:
                break;
        }
    },[category])

    return(
        <Layout>
            <div className="flex justify-between">
                <p id="Profile" onClick={()=>window.location.replace("/profile?category=Profile")} className="cursor-pointer text-center w-1/2 px-auto py-5 border-gray-100  border-2">
                    Perfil
                </p>
                <p id="Orders" onClick={()=>window.location.replace("/profile?category=Orders")} className="cursor-pointer text-center w-1/2 px-auto py-5 border-gray-100 border-2">
                    Órdenes
                </p>
            </div>
            {
                category === "Profile" ?
                <div className="">
                    <div className="flex my-20 w-[85%] mx-auto">
                        <div className="flex flex-col gap-10">
                            <div className="flex gap-2">
                                <h2 className="font-bold">Nombre: </h2>
                                {
                                    user?
                                    <h2 className="text-gray-500">{user?.displayName}</h2>
                                    :
                                    <Skeleton variant="rectangular" width={210} height={30} />
                                }
                            </div>
                            <div className="flex gap-2">
                                <h2 className="font-bold">Teléfono: </h2>
                                {
                                    user?
                                    <h2 className="text-gray-500">{user?.phone}</h2>
                                    :
                                    <Skeleton variant="rectangular" width={210} height={30} />
                                }
                            </div>
                            <div className="flex gap-2">
                                <h2 className="font-bold">Correo: </h2>
                                {
                                    user?
                                    <h2 className="text-gray-500">{user?.email}</h2>
                                    :
                                    <Skeleton variant="rectangular" width={210} height={30} />
                                }
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-evenly mb-10">
                        <button className={clsx(`w-[40%] lg:w-1/4 xl:w-1/4  px-5 py-2 rounded-lg border-2 border-${process.env.NEXT_PUBLIC_PRIMARY_COLOR} bg-${process.env.NEXT_PUBLIC_PRIMARY_COLOR} text-white font-bold`)} onClick={()=>window.location.replace('/editProfile')}>Editar Perfil</button>
                        <button className="w-[40%] lg:w-1/4 xl:w-1/4 px-5 py-2 rounded-lg border-2 border-red-600 bg-red-600 text-white font-bold" onClick={handleSignOut}>Cerrar Sesión</button>
                    </div>
                </div>
                :
                <div className="">
                    {
                        !userOrders
                        ?
                            <OrdersCardSkeletons />
                        :
                            userOrders?.length! > 0 ?
                            userOrders?.map((order:any, key:number)=>
                            (
                                <div className="" key={key}>
                                    <OrderCard order={order}/>
                                </div>
                            ))
                            :
                            <div className="">
                                <h2 className="flex justify-center my-10">Aún no hay órdenes</h2>
                            </div>
                    }
                </div>
            }
        </Layout>
    )
}