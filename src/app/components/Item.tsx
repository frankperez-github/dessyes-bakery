import { Button, Card, CardActionArea, CardActions, CardContent, CardMedia, Paper, Typography } from "@mui/material";
import { describe } from "node:test";

function Item(props: { item: { name: string, description: string } })
{
    const mensaje = `Hola, me gustaría pedir ${props.item.name} por favor.`
    return (
        <Card sx={{ 
            maxWidth: "90%" ,
            }}
            className="my-20"
            >
            <CardActionArea>
                <CardMedia
                component="img"
                height="140"
                image="/logo1(1).png"
                alt="green iguana"
                />
                <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    {props.item.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {props.item.description}
                </Typography>
                </CardContent>
            </CardActionArea>
            <CardActions>
                <a href={`https://wa.me/+5355006336?text=${mensaje}`}>
                    <Button size="large" color="success">
                    Pedir
                    </Button>
                </a>
            </CardActions>
    </Card>
    )
}

export default Item;