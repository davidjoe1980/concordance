import { BasketActionTypes } from "../constants/action-types";

export const addProduct = (product) => {
    return {
        type: BasketActionTypes.ADD_PRODUCT,
        payload: product,
    }
}

export const removeProduct = (product) => {
    return {
        type: BasketActionTypes.REMOVE_PRODUCT,
        payload: product
    }
}