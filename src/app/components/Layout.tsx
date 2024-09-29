'use client';

import { AppBar, Toolbar } from '@mui/material';
import { IconArrowLeft, IconBrandFacebook, IconBrandInstagram, IconBrandX, IconExternalLink, IconShoppingCartFilled, IconUserFilled } from '@tabler/icons-react';
import Image from 'next/image';
import { useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import clsx from 'clsx';
import useIsClient from '../hooks/useIsClient';

export default function Layout({ children, cartCount = 0, setShowOrder }: any) {
    const { user } = useAuth();
    const isClient = useIsClient();

    const logoSrc = process.env.NEXT_PUBLIC_LOGO || '';
    const siteName = process.env.NEXT_PUBLIC_NAME || '';

    function sleep(time: any) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }

    useEffect(() => {
        if (isClient && cartCount > 0) {
            const cartCountElement = document.getElementById("cartCount");
            if (cartCountElement) {
                cartCountElement.classList.add("cartCount");
                sleep(1200).then(() => {
                    cartCountElement.classList.remove("cartCount");
                });
            }
        }
    }, [cartCount, isClient]);

    const handleProfileRedirect = () => {
        if (isClient) {
            if (!user) {
                window.location.replace('/login');
            } else {
                window.location.replace('/profile?category=Profile');
            }
        }
    };

    return (
        <div className="">
            <AppBar position="sticky" style={{backgroundColor: process.env.NEXT_PUBLIC_PRIMARY_COLOR}} className='!z-10'>
                <div className="flex justify-between items-center">
                    <div className='flex justify-start'>
                        <div style={{opacity: isClient && window.location.pathname !== "/" ? "1" : "0"}} className="ml-3 mt-14 w-[15%] lg:w-[5%] xl:w-[5%] lg:my-auto lg:mx-10 xl:my-auto xl:mx-10 cursor-pointer">
                            <IconArrowLeft size={"70%"} onClick={() => window.location.replace('/')} />
                        </div>
                        <div className="xl:w-[10%] w-[30%] flex flex-col items-center lg:w-full lg:ml-[3%] xl:ml-[3%] my-3 ml-[32%] xl:mb-5" onClick={()=>window.location.replace("/")}>
                            <Image src={logoSrc} className='image' fill alt="logo" />
                        </div>
                    </div>
                    <div className="w-[45%] lg:w-[5%] xl:mr-[5%] mt-10 lg:mt-0 xl:mt-0 flex justify-between py-4 cursor-pointer mr-5">
                        {user && user.displayName ? (
                            <h1 className='w-[42%] h-12 pl-1.5 pt-1 border-2 rounded-full text-3xl' onClick={handleProfileRedirect}>
                                {user.displayName.split(' ').length > 1 ? user.displayName.split(' ')[0][0] + "" + user.displayName.split(' ')[1][0] : user.displayName.split(' ')[0][0]}
                            </h1>
                        ) : (
                            <IconUserFilled size="40%" onClick={handleProfileRedirect} />
                        )}
                        <div className="flex w-1/2" onClick={() => { if (cartCount > 0) { setShowOrder(true); window.scrollTo(0, 0); } }}>
                            <IconShoppingCartFilled size={cartCount > 0 ? '100%' : '92%'} />
                            {cartCount > 0 && (
                                <div id="cartCount" className="bg-[#ff0000] font-bold -mt-2 -ml-4 mb-2 w-7 h-5 items-center pb-6 text-black text-center rounded-full">
                                    {cartCount}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </AppBar>
            {children}
            <div 
                style={{
                    borderColor: process.env.NEXT_PUBLIC_SECONDARY_COLOR
                }}
                className='footer lg:max-h-30 lg:flex xl:flex lg:justify-between xl:justify-between border-t-2 py-10 px-5 border-solid mt-32'
            >
                <div className="">
                    <Image src={logoSrc} className='' height={110} width={160} alt="logo" />
                    <div className="contact-section mt-5 flex w-1/3 lg:w-full xl:w-full justify-between">
                        {process.env.NEXT_PUBLIC_INSTAGRAM && (
                            <a href={process.env.NEXT_PUBLIC_INSTAGRAM}>
                                <IconBrandInstagram />
                            </a>
                        )}
                        {process.env.NEXT_PUBLIC_FACEBOOK && (
                            <a href={process.env.NEXT_PUBLIC_FACEBOOK}>
                                <IconBrandFacebook />
                            </a>
                        )}
                        {process.env.NEXT_PUBLIC_X && (
                            <a href={process.env.NEXT_PUBLIC_X}>
                                <IconBrandX />
                            </a>
                        )}
                    </div>
                </div>
                <a href="https://criollos.tech" target='_blank' className='flex align-middle items-end mt-36 lg:mt-0 xl:mt-0 w-full lg:w-2/12 xl:w-2/12 lg:justify-end xl:justify-end'>
                    <div className="">
                        <div className="w-10 mr-2">
                            <Image src="Criollos_logo.svg" alt="criollos.tech" className='image ' fill />
                        </div>
                    </div>
                    <div className="flex items-center w-7/12 lg:w-full xl:w-full mt-5 ">
                        <h2 className='text-sm'>
                            © 2024 Criollos.Tech
                        </h2>
                        <IconExternalLink className='w-3 -mt-2 ' />
                    </div>
                </a>
            </div>
        </div>
    );
}
