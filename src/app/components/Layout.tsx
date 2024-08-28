import { AppBar, Toolbar } from '@mui/material';
import {  IconArrowLeft, IconBrandFacebook, IconBrandInstagram, IconBrandX, IconExternalLink, IconShoppingCartFilled, IconUser, IconUserFilled } from '@tabler/icons-react';
import Image from 'next/image';
import { useEffect } from 'react';
import { signOut, getUser } from '../../supabase/supabaseAuth';
import useAuth from '../hooks/useAuth';
import clsx from 'clsx';

export default function Layout ({children, cartCount=0, setShowOrder}:any)
{
    
    const user = useAuth()

    function sleep (time:any) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }
    useEffect(()=>{
        if(cartCount > 0)
        {
            document.getElementById("cartCount")?.classList.add("cartCount")
            sleep(1200).then(() => {
                document.getElementById("cartCount")?.classList.remove("cartCount")
            });
        }
    },[cartCount])

    const handleProfileRedirect = ()=>{
        if(!window) return
        if(!user)
        {
            window.location.replace('/login')
        }   
        else
        {
            window.location.replace('/profile?category=Profile')
        }
    }
    return(
        <div className="">
            <AppBar position="sticky" className={clsx(`!bg-${process.env.NEXT_PUBLIC_PRIMARY_COLOR} !z-10`)}>
                <Toolbar sx={{backgroundColor: "#fff"}} className='lg:flex-row flex flex-col px-32'>
                    <div className="w-[85%] flex flex-col items-center lg:w-full mx-auto my-2 xl:ml-auto xl:mb-5">
                        <Image src={process.env.NEXT_PUBLIC_LOGO || ""} className='' height={80} width={120} alt="logo"/>
                        <h1 className='text-black text-center mt-2 text-lg'>{process.env.NEXT_PUBLIC_NAME}</h1>
                    </div>
                </Toolbar>
                <div className="flex justify-between items-center">
                    {
                        (window && window.location.pathname !== "/") &&
                        <div className="ml-3 w-[15%] lg:w-[5%] xl:w-[5%] cursor-pointer">
                            <IconArrowLeft size={"70%"} onClick={()=>window.location.replace('/')}/>
                        </div>
                    }
                    <div className="w-28 flex justify-between py-4 cursor-pointer ml-auto mr-10">
                        {
                            user ?
                                <h1 className='w-[42%] h-12 pl-1.5 pt-1 border-2 rounded-full text-3xl' onClick={()=>handleProfileRedirect()}>
                                    {user.displayName.split(' ').length > 1 ? 
                                        user.displayName.split(' ')[0][0]+""+user.displayName.split(' ')[1][0] : 
                                            user.displayName.split(' ')[0][0]}
                                </h1>
                            :
                                <IconUserFilled size="40%" onClick={()=>handleProfileRedirect()}/>
                        }
                        <div className="flex w-1/2" onClick={()=>{if(cartCount > 0){ setShowOrder(true); window.scrollTo(0,0)}}}>
                            <IconShoppingCartFilled size={cartCount > 0 ? '100%' : '92%'}/>
                            {
                                cartCount > 0 &&
                                <div id="cartCount" className="bg-[#ff0000] font-bold -mt-2 -ml-4 mb-2 w-7 h-5 items-center pb-6 text-black text-center rounded-full">
                                    {cartCount}
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </AppBar>
            {children}
            <div className={clsx(`footer lg:max-h-30 lg:flex xl:flex lg:justify-between xl:justify-between border-t-2 py-10 px-5 border-solid border-${process.env.NEXT_PUBLIC_SECONDARY_COLOR}`)}>
                <div className="">
                    <Image src={process.env.NEXT_PUBLIC_LOGO || ""} className='' height={110} width={160} alt="logo"/>
                    <div className="contact-section mt-5 flex w-1/3 lg:w-full xl:w-full justify-between">
                        {
                            process.env.NEXT_PUBLIC_INSTAGRAM &&
                            <a href={process.env.NEXT_PUBLIC_INSTAGRAM}>
                                <IconBrandInstagram  />
                            </a>
                        }
                        {
                            process.env.NEXT_PUBLIC_FACEBOOK &&
                            <a href={process.env.NEXT_PUBLIC_FACEBOOK}>
                                <IconBrandFacebook  />
                            </a>
                        }
                        {
                            process.env.NEXT_PUBLIC_X &&
                            <a href={process.env.NEXT_PUBLIC_X}>
                                <IconBrandX />
                            </a>
                        }
                    </div>
                </div>
                <a href="https://criollos.tech" target='_blank' className='flex align-middle items-end mt-36 lg:mt-0 xl:mt-0 w-full lg:w-2/12 xl:w-2/12 lg:justify-end xl:justify-end'>
                    <div className="">
                        <div className="w-10 mr-2">
                            <Image src="Criollos_logo.svg" alt="criollos.tech" className='image ' fill/>
                        </div>
                    </div>
                    <div className="flex items-center w-7/12 lg:w-full xl:w-full mt-5 ">
                        <h2 className='text-sm'>
                        © 2024 Criollos.Tech
                        </h2>
                        <IconExternalLink className='w-3 -mt-2 '/>
                    </div>
                </a>
            </div>
        </div>
    )
}