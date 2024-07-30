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

//   const items = [
//     {
//       id: 8,
//       name: "Pan suave",
//       description: "Pan redondo, fresco y suave.",
//       image: "/bread.jpeg",
//       unitPrice: 20,
//       defaultQuant: 1
//     },
//     {
//       id: 9,
//       name: "Merenguito",
//       description: "Merenguito.",
//       image: "/merengue.jpeg",
//       unitPrice: 2,
//       defaultQuant: 1
//     },
//     {
//       id: 2,
//       name: "Rollos de canela",
//       description: "Rollos de canela con glaseado de vainilla.",
//       image: "/coffecake.jpeg",
//       unitPrice: 85,
//       defaultQuant: 8,
//     },
//     {
//       id: 1,      
//       name: "Pasteles",
//       description: "Pasteles de hojaldre con guayaba o coco.",
//       image: "/pasteles.jpeg",
//       unitPrice: 60,
//       defaultQuant: 6,
//     },
//     {
//       id: 3,      
//       name: "Magdalenas",
//       description: "Magdalenas de vainilla.",
//       image: "/magdalenas.jpeg",
//       unitPrice: 65,
//       defaultQuant: 6
//     },
//     {
//       id: 5,
//       name: "Eclairs",
//       description: "Eclairs relleno con crema pastelera de vainilla y bañado en cobertura de chocolate",
//       image: "/eclairs.jpeg",
//       unitPrice: 160,
//       defaultQuant: 6
//     },
//     {
//       id: 0,
//       name: "Cake",
//       description: "Cake de panetela y crema pastelera.",
//       image: "/cake.jpeg",
//       unitPrice: 3000,
//       defaultQuant: 1,
//     },
//     // {
//     //   id: 4,      
//     //   name: "Dona",
//     //   description: "Dona con glaseado de vainilla o cobertura de chocolate.",
//     //   image: "/donas.jpeg",
//     //   unitPrice: 80,
//     //   defaultQuant: 1
//     // }
//     // {
//     //   id: 6,
//     //   name: "Cake Helado",
//     //   description: "Cake con capas de panetela de chocolate y helado",
//     //   image: "/IceCreamCake.jpeg",
//     //   unitPrice: 4000,
//     //   defaultQuant: 1
//     // },
//     {
//       id: 7,
//       name: "Brazo Gitano",
//       description: "Brazo gitano de panetela y nata. Cubierto con nata y cobertura de chocolate",
//       image: "/SwissRoll.jpeg",
//       unitPrice: 1500,
//       defaultQuant: 1
//     },
//     {
//       id: 8,
//       name: "Palmeras",
//       description: "Palmeritas de hojaldre",
//       image: "/Palmeras.jpeg",
//       unitPrice: 60,
//       defaultQuant: 6
//     }
// ]

  const [showOrder, setShowOrder] = useState(false)
  const [order, setOrder] = useState<{"products": any[], "total": number}>({"products":[], "total": 0})
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage]= useState("")
  
  const [paymentMethod, setPaymentMethod] = useState("Enzona")
  const [copiedCard, setCopiedCard] = useState(false)
  const [copiedPhone, setCopiedPhone] = useState(false)

  const [deliveryAddress, setDeliveryAddress] = useState("")
  const [selectedTransportation, setSelectedTransportation] = useState<{city:string, transportation_price:number}>({city:"", transportation_price:0})
  
  
  useEffect(()=>{
    let newMessage = "Detalles de la orden:"
    order.products.map((prod)=>
    {
      newMessage+= `%0a🍰 ${prod.name} x${prod.quantity}  ----> 💰${prod.quantity*prod.unitPrice}cup`
    })
    newMessage += "%0a---------------------"
    newMessage+=`%0a💰Subtotal: ${order.total}cup`
    newMessage+=`%0a💰Costo envio: ${selectedTransportation?.transportation_price}cup`
    newMessage+=`%0a💰Monto Total: ${order.total + selectedTransportation?.transportation_price}cup`
    newMessage+=`%0a Método de Pago: ${paymentMethod}`
    if(selectedTransportation?.transportation_price !== 0)
      {
        newMessage+=`%0a🚚Direccion de entrega: ${deliveryAddress}`
      }
      setMessage(newMessage)
    },[order, selectedTransportation, deliveryAddress])
    
  const removeFromOrder=(prod: any)=>{
    let total = 0;
    const newOrder =[...order.products.filter((product)=>product.name != prod.name)]
    newOrder.map((prod)=>total+=prod.unitPrice*prod.quantity)
    setOrder(
      {
        "products": newOrder as any,
        "total": total
      } 
    )
  }
  
  const handleSubmit=()=>{
    if(selectedTransportation?.city !== "") 
      {
        setIsLoading(true)
        window.location.replace(`https://wa.me/+5353103058?text=${message}`)
      }
      else
      {
        alert("Seleccione un municipio")
      }
    }
    
  const [products, setProducts] = useState<any[]>([])
  const [transportations, setTransportations] = useState<{city:string, transportation_price:number}[]>([])
  
  useEffect(()=>{
    fetch("/api/transportations", {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    }).then(
      res=>res.json()
    ).then(
      data=>setTransportations(data instanceof Array ? data : data.transportations)
    )

    fetch("/api/products", {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    }).then(res=>res.json()).then(
      data=>setProducts(data instanceof Array ? data : data.products)
    )
  },[])

  useEffect(()=>{
    if(isLoading)
    {
      setTimeout(()=>setIsLoading(false), 5000)
    }
  },[isLoading])

  const confirmationPhone = "53103058"
  const confirmationCard = "9205 9598 7370 9944"

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
              products.map((item, index) => (
                <SwiperSlide className='pl-10' key={index}>
                    <Item item={item} quant={1} order={order} setOrder={setOrder}/>
                </SwiperSlide>
              ))
            }
          </Swiper>
        </div>
        <div className="lg:hidden block">
            {
              products.map((item, index) => (
                <SwiperSlide className='pl-10' key={index}>
                  <Item item={item} quant={1} order={order} setOrder={setOrder}/>
                </SwiperSlide>
              ))
            }
        </div>
        {
          showOrder &&
          <div className="">
            <div className="bg-[#ffffffe3] fixed w-full h-full z-10 top-0"></div>
            <div className="OrderList flex flex-col justify-between absolute top-[10%] w-[80%] mx-[10%] z-10 bg-[#f0f0f0] p-[5%] rounded-xl">
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
                            {product.unitPrice * product.quantity}
                            </td>
                            <td>
                              <IconTrash  onClick={()=>removeFromOrder(product)}/>
                            </td>
                          </tr>
                      )
                  })}
                    <br />
                    <tr className='border-t-2 border-[#c6c6c6]'>
                      <td><h1>Municipio:</h1></td>
                      <td></td>
                      <select name="" id="" onChange={(e)=>setSelectedTransportation(transportations.filter((t)=>t.city === e.target.value)[0])}>
                        <option value="" className='font-bold'  id="defaultCity">Seleccione</option>
                        {
                          transportations.map((transp)=>(
                            <option key={transp.city} value={transp.city}>{transp.city}</option>
                          ))
                          
                        }
                      </select>
                    </tr>
                    <tr className=' border-[#c6c6c6]'>
                      <td className='text-left'>Subtotal:</td>
                      <td></td>
                      <td className='font-bold text-right'>${order.total}</td>
                    </tr>
                    <tr >
                      <td className='text-left'>Envio:</td>
                      <td></td>
                      <td className='font-bold text-right'>${selectedTransportation?.transportation_price}</td>
                    </tr>
                    <tr className=' border-[#c6c6c6]'>
                      <td className='text-left'>Total:</td>
                      <td></td>
                      <td className='font-bold text-right'>${order.total + selectedTransportation?.transportation_price}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              {
                (selectedTransportation?.city !== "UH" && selectedTransportation?.city !== "") &&
                <div className="mb-10">
                  <label htmlFor="">Dirección de entrega:</label>
                  <textarea onChange={(e)=>setDeliveryAddress(e.target.value)} className='w-full'/>
                </div>
              }

              <div className="">
                <h2 className='font-bold'>Seleccione el metodo de pago:</h2>
                <select name="" id="" onChange={(e)=>setPaymentMethod(e.target.value)}>
                  <option value="Enzona">QR Enzona</option>
                  <option value="Transfermovil">QR Transfermovil</option>
                  <option value="Tarjeta">Número de tarjeta</option>
                  <option value="Efectivo">Efectivo a la entrega</option>
                </select>
                {
                  paymentMethod === "Efectivo" &&
                  <h2 className='text-red-500 font-bold my-5'>Este método de pago solo es permitido si no es su primera compra.</h2>
                }
                {
                  paymentMethod === "Tarjeta" ?
                    <div className="my-10">
                      <h2>Tarjeta:</h2>
                      <div className="flex justify-evenly">
                        <h2>{confirmationCard}</h2>
                        <button onClick={()=>{navigator.clipboard.writeText(confirmationCard); setCopiedCard(true); setCopiedPhone(false)}}>{copiedCard ? "✅" : "copiar"}</button>
                      </div>

                      <h2>Teléfono:</h2>
                      <div className="flex justify-evenly">
                        <h2>{confirmationPhone}</h2>
                        <button onClick={()=>{navigator.clipboard.writeText(confirmationPhone); setCopiedCard(false); setCopiedPhone(true)}}>{copiedPhone ? "✅" : "copiar"}</button>
                      </div>
                    </div>
                  :
                  paymentMethod === "Enzona" ?
                    <div className="mx-auto w-2/3 my-10">
                      <Image src="/enzona.jpeg" fill className='image' alt="QR enzona"/>
                      <h2 className='mt-5'>Confirmar a:</h2>
                      <div className="flex justify-evenly">
                        <h2>{confirmationPhone}</h2>
                        <button onClick={()=>{navigator.clipboard.writeText(confirmationPhone); setCopiedCard(false); setCopiedPhone(true)}}>{copiedPhone ? "✅" : "copiar"}</button>
                      </div>
                    </div>
                    
                  :
                  paymentMethod === "Transfermovil" &&
                    <div className="mx-auto w-2/3 my-10">
                      <Image src="/transfermovil.jpeg" fill className='image' alt="QR enzona"/>
                    </div>
                }
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
                <Button 
                  size="large" 
                  color="success" 
                  sx={{
                    '.MuiButton-root:hover': {
                      backgroundColor:  "#FFA500 !important"
                    } 
                  }}
                  onClick={()=>handleSubmit()}
                  className='bg-[#FFA500] text-black w-[40%] rounded-lg' 
                >
                  {
                    paymentMethod === "Efectivo" ? "Listo!" : "Ya pagué!"
                  }
                    
                </Button>
              </div>
            </div>
          </div>
        }

        {
          order.products.length > 0 &&
          <Button 
            size="large" 
            color="success" 
            onClick={()=>{setShowOrder(true); window.scrollTo(0,0)}}
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
