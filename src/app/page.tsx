'use client'
import React, { useEffect, useState } from 'react'
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Item from './components/Item';
import { AppBar, Toolbar, Button, CircularProgress } from '@mui/material';
import Image from 'next/image';
import { IconTrash } from '@tabler/icons-react';

export default function Home() {

  const items = [
    {
      id: 0,
      name: "Cake",
      description: "Cake de panetela y crema pastelera.",
      image: "/cake.jpeg",
      price: 3000,
      defaultQuant: 1,
    },
    {
      id: 1,      
      name: "Pasteles",
      description: "Pasteles de hojaldre con guayaba o coco.",
      image: "/pasteles.jpeg",
      price: 60,
      defaultQuant: 6,
    },
    {
      id: 2,
      name: "Rollos de canela",
      description: "Rollos de canela con glaseado de vainilla.",
      image: "/coffecake.jpeg",
      price: 90,
      defaultQuant: 8,
    },
    {
      id: 3,      
      name: "Magdalenas",
      description: "Magdalenas de vainilla.",
      image: "/magdalenas.jpeg",
      price: 65,
      defaultQuant: 19
    },
    // {
    //   id: 4,      
    //   name: "Dona",
    //   description: "Dona con glaseado de vainilla o cobertura de chocolate.",
    //   image: "/donas.jpeg",
    //   price: 80,
    //   defaultQuant: 1
    // }
    {
      id: 5,
      name: "Eclairs",
      description: "Eclairs relleno con crema pastelera de vainilla y bañado en cobertura de chocolate",
      image: "/eclairs.jpeg",
      price: 160,
      defaultQuant: 9
    },
    // {
    //   id: 6,
    //   name: "Cake Helado",
    //   description: "Cake con capas de panetela de chocolate y helado",
    //   image: "/IceCreamCake.jpeg",
    //   price: 4000,
    //   defaultQuant: 1
    // },
    {
      id: 7,
      name: "Brazo Gitano",
      description: "Brazo gitano de panetela y nata. Cubierto con nata y cobertura de chocolate",
      image: "/SwissRoll.jpeg",
      price: 1500,
      defaultQuant: 1
    },
    {
      id: 8,
      name: "Paquete de Panes suaves",
      description: "Panes redondos, frescos y suaves.",
      image: "/bread.jpeg",
      price: 180,
      defaultQuant: 9
    }
]

  const [showOrder, setShowOrder] = useState(false)
  const [order, setOrder] = useState<{"products": any[], "total": number}>({"products":[], "total": 0})
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage]= useState("")

  useEffect(()=>{
    let newMessage = "Detalles de la orden:"
    order.products.map((prod)=>
    {
      newMessage+= `%0a🍰 ${prod.name} x${prod.quantity}`
    })
    newMessage += "%0a---------------------"
    newMessage+=`%0a💰Monto Total: ${order.total}cup`
    setMessage(newMessage)
  },[order])

  const removeFromOrder=(prod: any)=>{
    let total = 0;
    const newOrder =[...order.products.filter((product)=>product.name != prod.name)]
    newOrder.map((prod)=>total+=prod.price*prod.quantity)
    setOrder(
        {
            "products": newOrder as any,
            "total": total
        } 
    )
}
  return (
    <main className="bg-[#fff]">
      <AppBar position="static">
        <Toolbar sx={{backgroundColor: "#fff"}} className='lg:flex-row flex flex-col px-32'>
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
                  <Item item={item} quant={1} order={order} setOrder={setOrder}/>
              </SwiperSlide>
            ))
          }
        </Swiper>
      </div>
      <div className="lg:hidden block">
          {
            items.map((item, index) => (
              <SwiperSlide className='pl-10' key={index}>
                <Item item={item} quant={1} order={order} setOrder={setOrder}/>
              </SwiperSlide>
            ))
          }
      </div>
      {
        showOrder &&
        <div className="">
          <div className="bg-[#ffffff8a] fixed w-full h-full z-10 top-0 blur-2xl"></div>
          <div className="OrderList flex flex-col justify-between fixed top-[20%] w-[80%] mx-[10%] z-10 bg-[#f0f0f0] p-[5%] rounded-xl">
            <div className="">
              <h2 className='font-bold text-xl mb-5'>Compruebe su orden:</h2>

              <table id='orderTable' className='w-full px-2 text-center mb-12'>
                <thead className='text-black font-bold'>
                  <tr>
                    <td>Producto</td>
                    <td>Cantidad</td>
                    <td>Precio</td>
                    <td></td>
                  </tr>
                </thead>
                <tbody>
                  {order.products.map((product, key)=>{
                    return(
                        <tr className='text-sm text-center' key={key}>
                          <td>
                          {product.name}
                          </td>
                          <td>
                          {product.quantity}
                          </td>
                          <td>
                          {product.price * product.quantity}
                          </td>
                          <td>
                            <IconTrash  onClick={()=>removeFromOrder(product)}/>
                          </td>
                        </tr>
                    )
                })}
                  <br />
                  <tr className='border-t-2 border-[#c6c6c6]'>
                    <br />
                    <td>Total a pagar:</td>
                    <td className='font-bold'>${order.total}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="flex justify-between w-full mt-4">
              <Button 
                size="large" 
                color="success" 
                onClick={()=>{setShowOrder(false)}}
                className='w-[40%] bg-[#fff] text-black' 
              >
                  Cancelar
              </Button>
              <a href={`https://wa.me/+5350103682?text=${message}`} className="w-[40%] rounded-lg">
                <Button 
                  size="large" 
                  color="success" 
                  sx={{
                    '.MuiButton-root:hover': {
                      backgroundColor:  "#FFA500 !important"
                    } 
                  }}
                  onClick={()=>setIsLoading(true)}
                  className='w-full bg-[#FFA500] text-black' 
                >
                    Listo!
                </Button>
              </a>
            </div>
          </div>
        </div>
      }

      {
        order.products.length > 0 &&
        <Button 
          size="large" 
          color="success" 
          onClick={()=>setShowOrder(true)}
          sx={{
            position: 'absolute'
          }}  
          className='fixed top-[90%] left-[60%] bg-[#FFA500] text-black' 
        >
            Ver pedido ({order.products.length})
        </Button>
      }
      {
        isLoading &&
        <div className="loading fixed top-[0%] left-[0%] pt-[90%] pl-[48%] bg-slate-100 w-full h-full z-20">
          <CircularProgress />
          <h2 className='-ml-[62%] mt-5'>Vamos a procesar su pedido, un momento...</h2>
        </div>
      }
    </main>
  );
}
