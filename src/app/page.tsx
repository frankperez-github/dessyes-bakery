'use client'
import React from 'react'
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Item from './components/Item';
import { AppBar, IconButton, InputBase, Toolbar, Typography, alpha, styled } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import Image from 'next/image';

export default function Home() {
  const items = [
    {
        name: "Random Name #1",
        description: "Probably the most random thing you have ever seen!"
    },
    {
        name: "Random Name #2",
        description: "Hello World!"
    }
]
  
  return (
    <main className="">
      <AppBar position="static">
        <Toolbar className='lg:flex-row flex flex-col px-32'>
          {/* <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton> */}
          <div className="w-[40%] lg:w-full mx-auto my-5 xl:ml-auto xl:mb-5">
            <Image src="/logo1(1).png" className='' height={100} width={100} alt="logo"/>
          </div>
          {/* <Search className='my-5 lg:my-auto'>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search> */}
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
                <Item item={item} />
              </SwiperSlide>
            ))
          }
        </Swiper>
      </div>
      <div className="lg:hidden block">
          {
            items.map((item, index) => (
              <SwiperSlide className='pl-10' key={index}>
                <Item item={item}/>
              </SwiperSlide>
            ))
          }
      </div>
    </main>
  );
}
