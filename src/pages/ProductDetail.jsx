import { useParams } from "react-router";

function ProductDetail(){
    const {id} = useParams()

    return <h1>Product ID: {id}</h1>
}