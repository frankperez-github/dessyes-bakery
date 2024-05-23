'use client'
import React from 'react'
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Item from './components/Item';
import { AppBar, Toolbar } from '@mui/material';
import Image from 'next/image';

export default function Home() {
  const items = [
    {
      id: 0,
      name: "Cake",
      description: "Cake de panetela y crema pastelera.",
      image: "/cake.jpeg",
      price: "3000",
      defaultQuant: 1
    },
    {
      id: 1,      
      name: "Pastel",
      description: "Pastel de hojaldre con guayaba o coco.",
      image: "/pasteles.jpeg",
      price: "60",
      defaultQuant: 1
    },
    {
      id: 2,
      name: "Rollo de canela",
      description: "Rollo de canela con glaseado de vainilla.",
      image: "/coffecake.jpeg",
      price: "90",
      defaultQuant: 1
    },
    {
      id: 3,      
      name: "Magdalena",
      description: "Magdalena de vainilla.",
      image: "/magdalenas.jpeg",
      price: "65",
      defaultQuant: 1
    },
    {
      id: 4,      
      name: "Dona",
      description: "Dona con glaseado de vainilla o cobertura de chocolate.",
      image: "/donas.jpeg",
      price: "65",
      defaultQuant: 1
    }
]
  
  return (
    <main className="">
      <AppBar position="static">
        <Toolbar sx={{backgroundColor: "white"}} className='lg:flex-row flex flex-col px-32'>
          <div className="w-[85%] lg:w-full mx-auto my-5 xl:ml-auto xl:mb-5">
            <Image src="/logo.webp" className='' height={110} width={160} alt="logo"/>
            <h1 className='text-black text-center mt-2 text-lg'>Dessye&apos;s</h1>
          </div>
        </Toolbar>
      </AppBar>
      <div className="lg:block hidden">
        <Swiper
        className='swiper'
        modules={[Navigation, Pagination, Scrollbar, A11y]}
        spaceBetween={50}
        slidesPerView={3}
        navigation
        pagination={{ clickable: true }}
        >
          {
            items.map((item, index) => (
              <SwiperSlide className='pl-10' key={index}>
                <Item item={item} quant={1}/>
              </SwiperSlide>
            ))
          }
        </Swiper>
      </div>
      <div className="lg:hidden block">
          {
            items.map((item, index) => (
              <SwiperSlide className='pl-10' key={index}>
                <Item item={item} quant={1}/>
              </SwiperSlide>
            ))
          }
      </div>
    </main>
  );
}
