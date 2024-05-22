import { Button, Card, CardActionArea, CardActions, CardContent, CardMedia, Paper, Typography } from "@mui/material";
import {IconMinus, IconPlus} from "@tabler/icons-react"
import { useState } from "react";

function Item(props: { 
                        item: { 
                                id: number, 
                                name: string, 
                                description: string, 
                                image: string, 
                                price: string, 
                                defaultQuant: number 
                        }, 
                        quant:number 
                    })
{   
    const [quant, setQuant] = useState(props.item.defaultQuant)
    const mensaje = `Hola, me gustaría encargar ${quant} unidades de ${props.item.name}, por favor.`
    return (
        <Card sx={{ 
            maxWidth: "90%" ,
            borderRadius: "3%"
            }}
            className="my-20"
            >
            <CardActionArea>
                <CardMedia
                component="img"
                height="140"
                image={props.item.image}
                alt="bakery"
                />
                <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    {props.item.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {props.item.description}
                </Typography>
                <Typography gutterBottom variant="h6" className="text-[#85BB65] mt-5" component="div">
                   ${props.item.price}
                </Typography>
                </CardContent>
            </CardActionArea>
            <CardActions sx={{justifyContent: "space-evenly"}}>
                <a href={`https://wa.me/+5350103682?text=${mensaje}`} className="border-2 rounded-lg">
                    <Button size="large" color="success">
                    Encargar
                    </Button>
                </a>
                <div className="quantity w-24 flex ml-10 justify-between">
                    <IconMinus className="w-4" onClick={()=>setQuant(quant-1)}/>
                    <input value={quant} id="quant-info" type="number" className="w-12 text-center"/>
                    <IconPlus className="w-4" onClick={()=>setQuant(quant+1)}/>
                </div>
            </CardActions>
    </Card>
    )
}

export default Item;