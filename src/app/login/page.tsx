'use client'
import Layout from "../components/Layout";
import { signInWithEmail, signInWithProvider } from '../../supabase/supabaseAuth';
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

    const [showPassword, setShowPassword] = useState(false);


    const handleSignIn = async (e:any) => {
        e.preventDefault()
        try {
            await signInWithEmail(email, password);
            if(typeof(window) !== undefined)
            {
                toast.success("Sesión iniciada")
                window.location.replace("/")
            } 
        } catch (error:any) {
            toast.error("Ha habido un error, vuelva a intentar.")
            console.error('Error signing in: '+error.message);
        }
    };

    const handleSignInWithGoogle = async (e:any) => {
        e.preventDefault()
        try {
            const { data } = await signInWithProvider('google');
        } catch (error:any) {
            console.error('Error signing in with Google:', error.message);
        }
    };

    return(
        <Layout>
            <ToastContainer />

            <form onSubmit={handleSignIn} className="flex flex-col mb-24 mt-20 lg:px-[30%] xl:px-[30%]">
                <TextField 
                    sx={{width: '80%', margin: '5% auto'}}  
                    variant="outlined" 
                    type="email" 
                    label="Correo" 
                    required 
                    onChange={(e)=>setEmail(e.target.value)}
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
                        style={{backgroundColor: process.env.NEXT_PUBLIC_PRIMARY_COLOR}}
                        className={clsx(`border-2 w-full p-2 rounded-lg my-5 text-white font-bold`)}
                        >
                            Iniciar Sesión
                    </button>
                    <p className="w-full">¿No tiene una cuenta aún? <br /><a href="/register" className="text-blue-700 border-b-2 border-blue-700">Crear cuenta</a></p>
                </div>
            </form>
        </Layout>
    )
}