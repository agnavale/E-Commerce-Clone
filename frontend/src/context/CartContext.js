import { createContext, useReducer, useEffect } from "react";
import { useAuthContext } from "../hooks/useAuthContext";


export const CartContext = createContext()

export const cartReducer = (state, action) => {
    switch (action.type) {
        case 'SET_CART':
            return {
                cart: action.payload
            }
        case 'ADD_ITEM':
            return {
                cart: [action.payload, ...state.cart]
            }
        case 'DELETE_ITEM':
            return { 
                cart: state.cart.filter(item => item._id !== action.payload._id)
            }
        case 'UPDATE_ITEM':
            return {
                cart: state.cart.map(item => 
                    item._id === action.payload._id ? {...item, qty: item.qty + action.payload.qty} : item
                )
            }
        default:
            return state
    }
}

export const CartContextProvider = ({ children }) => {
    const { user } = useAuthContext()
    const [state, dispatch] = useReducer(cartReducer, {
        cart: []
    })
    
    useEffect(() => {
        const fetchCart = async () => {

            const response = await fetch('/api/cart', {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            })

            const json = await response.json()
            if(response.ok) {
                dispatch({type: 'SET_CART', payload: json })
            }
        }
        if (user) {
            fetchCart()
        }
    }, [dispatch, user])

    const totalItems = state.cart.reduce((acc, item) => acc + item.qty, 0);


    return(
        <CartContext.Provider value= {{...state, dispatch, totalItems}}>
            { children }
        </CartContext.Provider>
    )
}