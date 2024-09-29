import { Button, CardActions, CardContent, Typography } from "@mui/material";
import {IconChevronCompactDown, IconChevronCompactUp, IconChevronDown, IconMinus, IconPlus} from "@tabler/icons-react"
import Image from "next/image";
import { useState } from "react";

function Item(props: { 
                        item: { 
                                id: number, 
                                name: string, 
                                description: string, 
                                image: string, 
                                unitPrice: number, 
                                defaultQuant: number 
                        }, 
                        quant:number,
                        order: {
                            "products": any[],
                            "total": number
                        },
                        setOrder: any,
                        MLCPrice: number,
                        USDPrice: number
                    })
{   
    const [quant, setQuant] = useState(1)
    const addToOrder=(prod: any)=>{
        let total = 0;
        const newOrder =[
            ...props.order.products?.filter((product)=>product.name != prod.name), 
            {
                "productId": prod.id,
                "name": prod.name,
                "quantity": quant*props.item?.defaultQuant,
                "unitPrice": prod.unitPrice
            }]
        newOrder.map((prod)=>total+=prod.unitPrice*prod.quantity)
        props.setOrder(
            {
                "products": newOrder,
                "total": total
            }
        )
    }

    const [showMoreInfo, setShowMoreInfo] = useState(false)

    return (
        <div style={{ 
            maxWidth: "90%" ,
            borderRadius: "0.8rem",
            border: 'solid 1px #e1e1e1'
            }}
            onClick={()=>setShowMoreInfo(!showMoreInfo)}
            className="cursor-pointer my-10 lg:mb-0 xl:mb-0 mx-auto lg:mx-0 xl:mx-0"
            >
            <div>
                <div className="lg:h-[15vw] h-[60vw]">
                    <Image src={`${props.item?.image}`} fill className="image rounded-t-xl" alt=""/>
                </div>
                <CardContent>
                    <Typography gutterBottom variant="h5" mb="0" component="div">
                        {props.item?.name}
                    </Typography>
                    {
                        showMoreInfo &&
                        <>
                            <Typography variant="body2" mt="5%" color="text.secondary">
                                {props.item?.description}
                                <br />
                                <span className=" font-bold">{props.item?.defaultQuant}  unidad{props.item?.defaultQuant > 1  ? "es"  : ''}</span>
                            </Typography>
                            <Typography gutterBottom variant="h6" className="text-gray-500 mt-5" component="div">
                            {props.item?.unitPrice*props.item?.defaultQuant} CUP {props.MLCPrice ? " / "+((props.item?.unitPrice*props.item?.defaultQuant)/props.MLCPrice).toFixed(2)+" MLC" : ''} {props.USDPrice ? " / "+((props.item?.unitPrice*props.item?.defaultQuant)/props.USDPrice).toFixed(2)+" USD" : ''} 
                            </Typography>
                        </>
                    }
                </CardContent>
            </div>
            {
                showMoreInfo &&
                <>
                    <div className="quantity w-8/12 flex m-auto my-5 justify-between">
                        <IconMinus 
                            style={{
                                backgroundColor: process.env.NEXT_PUBLIC_SECONDARY_COLOR
                            }}
                            className='w-8 h-8 p-2 cursor-pointer mt-0.5 rounded-full' 
                            onClick={()=>setQuant(quant-1)}
                        />
                        <input value={quant} onChange={()=>{}} id="quant-info" type="number" className="w-5/12 text-center border-solid border-2 p-1"/>
                        <IconPlus 
                            style={{
                                backgroundColor: process.env.NEXT_PUBLIC_SECONDARY_COLOR
                            }}
                            className='w-8 h-8 p-2 cursor-pointer mt-0.5 rounded-full' 
                            onClick={()=>setQuant(quant+1)}
                        />
                    </div>
                    <CardActions sx={{justifyContent: "space-evenly"}}>
                        <Button size="large" className="!text-black !font-bold !bg-gray-200 !border-gray-200 hover:!border-gray-400 hover:!bg-gray-400 !border-solid !border-2 !mb-5 w-10/12" onClick={()=>addToOrder(props.item)}>
                            Agregar al pedido
                        </Button>
                    </CardActions>
                </>
            }
            <div className="w-2/12 mx-auto -mt-5">
            {
                !showMoreInfo ? 
                <IconChevronCompactDown size={"90%"}/>
                :
                <IconChevronCompactUp size={"90%"}/>
            }
            </div>
    </div>
    )
}

export default Item;