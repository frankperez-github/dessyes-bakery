import { IconTrash } from "@tabler/icons-react"
import { useEffect, useState } from "react"
import { Button, CircularProgress } from "@mui/material"
import useAuth from "../hooks/useAuth"
import clsx from "clsx"

export default function Cart({transportations, setShowOrder, order, setOrder, MLCPrice, USDPrice}:any)
{
    const [message, setMessage]= useState("")
  
    const [paymentMethod, setPaymentMethod] = useState("")
    const [paymentStatus, setPaymentStatus] = useState("Pendiente")

    const [name, setName] = useState("")
    const [phone, setPhone] = useState("")

    const [copiedCard, setCopiedCard] = useState(false)
    const [copiedPhone, setCopiedPhone] = useState(false)

    const [deliveryAddress, setDeliveryAddress] = useState("")
    const [selectedTransportation, setSelectedTransportation] = useState<{city:string, transportation_price:number}>({city:"", transportation_price:0})
    
    const [isLoading, setIsLoading] = useState(false)

    useEffect(()=>{
        let newMessage = "Detalles de la orden:"
        order.products?.map((prod:any)=>
        {
            newMessage+= `%0a🍰 ${prod.name} x${prod.quantity}  ----> 💰${prod.quantity*prod.unitPrice}cup`
        })
        
        newMessage += "%0a---------------------"
        newMessage+=`%0a💰Subtotal: ${order.total}cup`
        newMessage+=`%0a💰Costo envio: ${selectedTransportation?.transportation_price}cup`
        newMessage+=`%0a💰Monto Total: ${order.total + selectedTransportation?.transportation_price}cup`
        newMessage+=`%0a Método de Pago: ${paymentMethod}`
        newMessage+=`%0a Nombre: ${name}`
        newMessage+=`%0a Teléfono: ${phone}`
        newMessage+=`%0a Dirección de entrega: ${deliveryAddress}, ${selectedTransportation.city}`

        setMessage(newMessage)
        
    },[selectedTransportation, deliveryAddress, paymentMethod, name, phone, order?.products, order?.total])
        
    const removeFromOrder=(prod: any)=>{
        let total = 0;
        const newOrder =[...order.products?.filter((product:any)=>product.name != prod.name)]
        newOrder.map((prod)=>total+=prod.unitPrice*prod.quantity)
            setOrder(
            {
                "products": newOrder as any,
                "total": total
            } 
        )
    }


    const confirmationPhone = "53103058"
    const CUPCard = "9227 9598 7524 2567"
    const MLCCard = "9235 9598 7053 2996"

    const { user } = useAuth()

    const handleSubmit = async () =>{
        if(!window) return
        if(selectedTransportation?.city !== "" && deliveryAddress !== "" && name !== "" && phone !== "") 
        {
            if(paymentStatus !== "Completado" && paymentMethod === "TarjetaInternacional")
            {
              alert("Realice el pago o escoja otro método de pago.")
              return
            }

            setIsLoading(true)
            

            const newOrder:Order = {
              paymentStatus,
              userId: user?.id,
              total: `${order.total + " CUP" + (MLCPrice ? " / " + (order.total / MLCPrice).toFixed(2) + " MLC" : '') + (USDPrice ? " / " + (order.total / USDPrice).toFixed(2) + " USD" : "")}`,
              deliveryAddress: deliveryAddress + ", " + selectedTransportation.city,
              orderStatus: "Procesando",
              created_at: new Date().toISOString().replace('T', ' ').replace('Z', '+00').replace(/\.\d+/, (ms) => `.${ms.slice(1, 4)}000`),
              paymentMethod: paymentMethod === "TarjetaInternacional" ?
                "USD Transfer" :
                paymentMethod === "TarjetaCUP" ?
                  "CUP Transfer" :
                  paymentMethod === "TarjetaMLC" ?
                    "MLC Transfer" :
                    "Cash",
              contactName: name,
              contactPhone: phone,
            }

            
            const responseOrder = await fetch(`/api/orders/`, {
              method: 'POST',
              body: JSON.stringify(newOrder)
            });
            
            const orderId = (await responseOrder.json()).orderId

            const orderProducts = order.products.map((prod:any)=>{
              return{
                orderId,
                productId: prod.productId,
                unitPrice: `${prod.unitPrice} CUP${MLCPrice ? "<br>" + (prod.unitPrice / MLCPrice).toFixed(2) + " MLC" : ''}${USDPrice ? "<br>" + (prod.unitPrice / USDPrice).toFixed(2) + " USD" : ""}`,
                quantity: prod.quantity,
                productName: prod.name
              }
            })

            const responseProds = await fetch(`/api/orderProducts/`, {
              method: 'POST',
              body: JSON.stringify(orderProducts)
            });

            if(responseOrder.ok && responseProds.ok)
            {
              if(typeof(window) !== undefined)
              {
                window.location.replace(`https://wa.me/+5353103058?text=${message}`)
              }
              setOrder({"products": [], "total": 0})
              setIsLoading(false)
            }
            else
            {
              setIsLoading(false)
              alert("Ha ocurrido un error, intente de nuevo.")
            }
        }
        else
        {
            alert("Por favor, complete la información de entrega.")
            return
        }
    }

    return(
        <div className="">
            <div className="bg-[#ffffffe3] fixed w-full h-full z-10 top-0"></div>
            <div className="OrderList flex flex-col justify-between absolute top-[10%] w-[80%] mx-[10%] z-10 bg-[#f0f0f0] p-[5%] rounded-xl">
              <div className="">
                <h2 className='font-bold text-2xl mb-5'>Compruebe su orden:</h2>
                <table id='orderTable' className='w-full px-2 text-left'>
                  <thead className='text-black font-bold'>
                    <tr>
                      <td>Producto</td>
                      <td className="text-center">Cantidad</td>
                      <td className="text-center">Precio</td>
                      <td></td>
                    </tr>
                  </thead>
                  <tbody>
                    {order.products?.map((product:any, key:number)=>{
                      return(
                          <tr className='text-sm text-left' key={key}>
                            <td>
                                {product.name}
                            </td>
                            <td className="text-center">
                                {product.quantity}
                            </td>
                            <td className="text-center">
                                {product.unitPrice * product.quantity}
                            </td>
                            <td className="cursor-pointer">
                                <IconTrash  onClick={()=>removeFromOrder(product)}/>
                            </td>
                          </tr>
                      )
                  })}
                    <br />
                    <br />
                    <tr className='border-[#c6c6c6]'>
                        <td className='text-left'>Subtotal:</td>
                        <td></td>
                        <td className='font-bold text-right'>{order.total} CUP</td>
                    </tr>
                    <tr >
                        <td className='text-left'>Envío:</td>
                        <td></td>
                        <td className='font-bold text-right'>{selectedTransportation?.transportation_price} CUP</td>
                    </tr>
                    <tr className='border-[#c6c6c6] border-t-2'>
                        <td className='text-left'>Total CUP:</td>
                        <td></td>
                        <td className='font-bold text-right column'>
                            {order.total + selectedTransportation?.transportation_price} CUP 
                        </td>
                    </tr>
                    <tr className='border-[#c6c6c6]'>
                        <td className='text-left'>Total MLC:</td>
                        <td></td>
                        <td className='font-bold text-right column'>
                            {MLCPrice ? ((order.total + selectedTransportation?.transportation_price) / MLCPrice).toFixed(2) + " MLC" : ''} 
                        </td>
                    </tr>
                    <tr className='border-[#c6c6c6] border-b-2'>
                        <td className='text-left'>Total USD:</td>
                        <td></td>
                        <td className='font-bold text-right column'>
                            {USDPrice ? ((order.total + selectedTransportation?.transportation_price) / USDPrice).toFixed(2) + " USD" : ''} 
                        </td>
                    </tr>
                  </tbody>
                </table>
                <form action="" className="mb-16">
                    <h2 className='font-bold text-2xl mt-14 mb-5'>Contacto de entrega:</h2>
                    <div className="flex justify-between gap-5">
                        <h2 className='font-bold mt-5'>Municipio:</h2>
                        <select name="" id="" className="mt-5" onChange={(e)=>setSelectedTransportation(transportations.filter((t:any)=>t.city === e.target.value)[0])}>
                            <option value="" className='font-bold'  id="defaultCity">Seleccione</option>
                            {
                                transportations.map((transp:any)=>(
                                    <option key={transp.city} value={transp.city}>{transp.city}</option>
                                ))
                            }
                        </select>
                    </div>
                    {
                        selectedTransportation?.city !== "" &&
                        <div className="flex justify-between gap-5 ">
                            <h2 className='font-bold mt-5 pb-2'>Dirección:</h2>
                            <textarea onChange={(e)=>setDeliveryAddress(e.target.value)} className='w-8/12 h-10 mt-auto'/>
                        </div>
                    }
                    <div className="flex justify-between gap-5">
                        <h2 className='font-bold mt-5'>Nombre:</h2>
                        <input type="text" className="h-6 w-8/12 mt-auto" onChange={(e)=>setName(e.target.value)}/>
                    </div>
                    <div className="flex justify-between gap-5">
                        <h2 className='font-bold mt-5'>Teléfono:</h2>
                        <input type="text" className="h-6 w-8/12 mt-auto" onChange={(e)=>setPhone(e.target.value)}/>
                    </div>
                </form>
              </div>
              

              <div className="">
                <h2 className='font-bold'>Seleccione el metodo de pago:</h2>
                <div className="lg:flex xl:flex  w-full ">
                  <div className="lg:w-full xl:w-full lg:mt-5 xl:mt-5">
                    <button className="payment-option" onClick={()=>setPaymentMethod("TarjetaCUP")}>Tarjeta CUP</button>
                    {
                      paymentMethod === "TarjetaCUP" &&
                        <div className="my-10 lg:ml-10 xl:ml-10">
                          <h2>Tarjeta:</h2>
                          <div className="flex justify-evenly">
                            <h2>{CUPCard}</h2>
                            <button onClick={()=>{navigator.clipboard.writeText(CUPCard); setCopiedCard(true); setCopiedPhone(false)}}>{copiedCard ? "✅" : "copiar"}</button>
                          </div>

                          <h2>Teléfono:</h2>
                          <div className="flex justify-evenly">
                            <h2>{confirmationPhone}</h2>
                            <button onClick={()=>{navigator.clipboard.writeText(confirmationPhone); setCopiedCard(false); setCopiedPhone(true)}}>{copiedPhone ? "✅" : "copiar"}</button>
                          </div>
                        </div>
                    }
                  </div>
                  <div className="lg:w-full xl:w-full lg:mt-5 xl:mt-5">
                    <button className="payment-option" onClick={()=>setPaymentMethod("TarjetaMLC")}>Tarjeta MLC</button>
                    {
                        paymentMethod === "TarjetaMLC" &&
                        <div className="my-10 lg:ml-10 xl:ml-10">
                          <h2>Tarjeta:</h2>
                          <div className="flex justify-evenly">
                            <h2>{MLCCard}</h2>
                            <button onClick={()=>{navigator.clipboard.writeText(MLCCard); setCopiedCard(true); setCopiedPhone(false)}}>{copiedCard ? "✅" : "copiar"}</button>
                          </div>

                          <h2>Teléfono:</h2>
                          <div className="flex justify-evenly">
                            <h2>{confirmationPhone}</h2>
                            <button onClick={()=>{navigator.clipboard.writeText(confirmationPhone); setCopiedCard(false); setCopiedPhone(true)}}>{copiedPhone ? "✅" : "copiar"}</button>
                          </div>
                        </div>
                    }
                  </div>
                  <div className="lg:w-full xl:w-full lg:mt-5 xl:mt-5">
                    <button className="payment-option" onClick={()=>setPaymentMethod("TarjetaInternacional")}>Visa o Mastercard</button>
                  </div>
                  <div className="lg:w-full xl:w-full lg:mt-5 xl:mt-5">
                    <button className="payment-option" onClick={()=>setPaymentMethod("Efectivo")}>Efectivo</button>
                    {
                      paymentMethod === "Efectivo" &&
                      <h2 className='text-red-500 font-bold my-5 lg:ml-8 xl:ml-8'>Este método de pago solo es permitido si no es su primera compra.</h2>
                    }
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between w-full mt-16">
                <Button 
                  size="large" 
                  color="success" 
                  onClick={()=>{setShowOrder(false)}}
                  className='w-[40%] lg:w-1/3 xl:w-1/3 !bg-[#fff] !text-black' 
                >
                    Cancelar
                </Button>
                <Button 
                  size="large" 
                  color="success" 
                  onClick={()=>handleSubmit()}
                  className={clsx(`!bg-${process.env.NEXT_PUBLIC_PRIMARY_COLOR} hover:!bg-${process.env.NEXT_PUBLIC_PRIMARY_COLOR} !text-black w-[40%] lg:w-1/3 xl:w-1/3 rounded-lg`)} 
                >
                  {
                    paymentMethod === "Efectivo" ? "Listo!" : "Ya pagué!"
                  }
                    
                </Button>
              </div>
            </div>
            {
                isLoading &&
                <div className="loading fixed top-[0%] left-[0%] pt-[90%] pl-[48%] bg-slate-100 w-full h-full z-20">
                    <CircularProgress />
                    <h2 className='-ml-[62%] mt-5'>Vamos a procesar su pedido, un momento...</h2>
                </div>
            }
        </div>
    )
}