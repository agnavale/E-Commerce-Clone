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
                cart: state.cart
                    .map(item => 
                        item._id === action.payload._id 
                            ? { ...item, qty: action.payload.qty }  
                            : item
                    )
                    .filter(item => item.qty > 0) 
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

            const response = await fetch(`${process.env.REACT_APP_BACKEND_URI}/api/cart`, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            })

            const json = await response.json()
            if(response.ok) {
                dispatch({type: 'SET_CART', payload: json })
            }
        }

        if (!user) {
            dispatch({ type: 'SET_CART', payload: [] })
            return
        } 
        fetchCart() 
    }, [dispatch, user])

    const totalItems = state.cart.reduce((acc, item) => acc + item.qty, 0);
    const totalAmount = state.cart.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2);;

    return(
        <CartContext.Provider value= {{...state, dispatch, totalItems, totalAmount}}>
            { children }
        </CartContext.Provider>
    )
}