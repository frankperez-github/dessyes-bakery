import { Button, Card, CardActionArea, CardActions, CardContent, CardMedia, Paper, Typography } from "@mui/material";
import {IconMinus, IconPlus} from "@tabler/icons-react"
import { Dispatch, SetStateAction, useEffect, useState } from "react";

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
                        setOrder: any
                    })
{   
    const [quant, setQuant] = useState(1)
    const addToOrder=(prod: any)=>{
        let total = 0;
        const newOrder =[
            ...props.order.products.filter((product)=>product.name != prod.name), 
            {
                "name": prod.name,
                "quantity": quant*props.item.defaultQuant,
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
    
    return (
        <Card sx={{ 
            maxWidth: "90%" ,
            borderRadius: "0.8rem"
            }}
            className="my-20"
            >
            <CardActionArea>
                <CardMedia
                component="img"
                height="140"
                image={`api/images/${props.item.image}`}
                alt="bakery"
                />
                <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    {props.item.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {props.item.description}
                    <br />
                    <span className=" font-bold">{props.item.defaultQuant}  unidad{props.item.defaultQuant > 1  ? "es"  : ''}</span>
                </Typography>
                <Typography gutterBottom variant="h6" className="text-[#85BB65] mt-5" component="div">
                   ${props.item.unitPrice*props.item.defaultQuant}
                </Typography>
                </CardContent>
            </CardActionArea>
            <CardActions sx={{justifyContent: "space-evenly"}}>
                <Button size="large" color="success" onClick={()=>addToOrder(props.item)}>
                    Agregar al pedido
                </Button>
                <div className="quantity w-24 flex ml-10 justify-between">
                    <IconMinus className="w-4" onClick={()=>setQuant(quant-1)}/>
                    <input value={quant} onChange={()=>{}} id="quant-info" type="number" className="w-12 text-center"/>
                    <IconPlus className="w-4" onClick={()=>setQuant(quant+1)}/>
                </div>
            </CardActions>
    </Card>
    )
}

export default Item;