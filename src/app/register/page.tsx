'use client'
import Layout from "../components/Layout";
import { signUpWithEmail } from '../../supabase/supabaseAuth';
import { useState } from "react";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import clsx from "clsx";

export default function Register()
{
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [phone, setPhone] = useState('');

    const [showPassword, setShowPassword] = useState(false);


    const handleSignUp = async (e:any) => {
        e.preventDefault()
        try {
            await signUpWithEmail(email, password, displayName, phone);
            toast.success('Usuario registrado');
        } catch (error:any) {
            toast.error('Ha habido un error');
        }
    };
    return(
        <Layout>
            <ToastContainer />
            <form onSubmit={handleSignUp} className="flex flex-col mb-24 mt-20">
                <TextField 
                    sx={{width: '80%', margin: '5% auto'}}  
                    variant="outlined" 
                    type="email" 
                    label="Correo" 
                    required 
                    onChange={(e)=>setEmail(e.target.value)}
                />
                
                <TextField 
                    sx={{width: '80%', margin: '5% auto'}}  
                    variant="outlined" 
                    type="text" 
                    label="Nombre" 
                    required 
                    onChange={(e)=>setDisplayName(e.target.value)}
                />
                
                <TextField 
                    sx={{width: '80%', margin: '5% auto'}}  
                    variant="outlined" 
                    type="phone" 
                    label="Teléfono" 
                    required 
                    onChange={(e)=>setPhone(e.target.value)}
                />
                
                <TextField
                    sx={{ width: '80%', margin: '5% auto' }}
                    variant="outlined"
                    type={showPassword ? 'text' : 'password'}
                    label="Contraseña"
                    required
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
                    <button 
                        style={{
                            backgroundColor: process.env.NEXT_PUBLIC_PRIMARY_COLOR,
                        }}
                        className={clsx(`border-2 w-full p-2 rounded-lg my-5 text-white font-bold`)}
                        >
                            Crear cuenta
                    </button>
                    <p className="w-full">¿Ya tiene una cuenta? <br /><a href="/login" className="text-blue-700 border-b-2 border-blue-700">Iniciar sesion</a></p>
                </div>
            </form>
        </Layout>
    )
}