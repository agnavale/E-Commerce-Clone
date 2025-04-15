import { CartContext } from "../context/CartContext";
import { useContext } from "react";

export const useCartContext = () => {
    const context = useContext(CartContext)

    if(!context) {
        throw Error('CartContext must be used inside an AuthContextProvider')
    }

    return context
}