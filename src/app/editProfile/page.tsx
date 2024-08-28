'use client'
import Layout from "../components/Layout";
import { updateUser } from '../../supabase/supabaseAuth';
import { useEffect, useState } from "react";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { toast } from "react-toastify";
import useAuth from "../hooks/useAuth";
import clsx from "clsx";

export default function Register()
{
    const user = useAuth()


    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [displayName, setDisplayName] = useState("")
    const [phone, setPhone] = useState("")

    const [showPassword, setShowPassword] = useState(false);


    useEffect(()=>{
        if(user)
        {
            setEmail(user.email)
            setPhone(user.phone)
            setDisplayName(user.displayName)
        }
    },[user])

    const handleUserUpdate = async (e:any) => {
        e.preventDefault()
        try {
            await updateUser({
                email,
                password: password ? password : user?.password,
                data: {
                    displayName,
                    phone,
                }
            });
            if(window) window.location.replace('/profile?category=Profile')
        } catch (error:any) {
            console.error('Ha habido un error');
        }
    };

    return(
        <Layout>
            <form onSubmit={handleUserUpdate} className="flex flex-col mb-24 mt-20">
                <TextField 
                    value={email}
                    sx={{width: '80%', margin: '5% auto'}}  
                    variant="outlined" 
                    type="email" 
                    label="Correo" 
                    required 
                    InputLabelProps={{
                        shrink: user?true:false,
                    }}
                    onChange={(e)=>setEmail(e.target.value)}
                />
                
                <TextField 
                    value={displayName}
                    sx={{width: '80%', margin: '5% auto'}}  
                    variant="outlined" 
                    type="text" 
                    label="Nombre" 
                    required 
                    InputLabelProps={{
                        shrink: user?true:false,
                    }}
                    onChange={(e)=>setDisplayName(e.target.value)}
                />
                
                <TextField 
                    value={phone}
                    sx={{width: '80%', margin: '5% auto'}}  
                    variant="outlined" 
                    type="phone" 
                    label="Teléfono" 
                    required 
                    InputLabelProps={{
                        shrink: user?true:false,
                    }}
                    onChange={(e)=>setPhone(e.target.value)}
                />
                
                <TextField
                    sx={{ width: '80%', margin: '5% auto' }}
                    variant="outlined"
                    type={showPassword ? 'text' : 'password'}
                    label="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={()=>setShowPassword(!showPassword)}
                                    edge="end"
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                    
                />
                <div className="w-[80%] mx-auto justify-between">
                    <button className={clsx(`border-2 w-full p-2 rounded-lg my-5 bg-${process.env.NEXT_PUBLIC_PRIMARY_COLOR} text-white font-bold`)}>Actualizar Perfil</button>
                </div>
            </form>
        </Layout>
    )
}