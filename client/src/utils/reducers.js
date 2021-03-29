import { useReducer } from 'react';
import {
    UPDATE_PRODUCTS,
    UPDATE_CATEGORIES,
    UPDATE_CURRENT_CATEGORY
} from './actions';

export const reducer = (state, action) => {
    switch (action.type) {
        // if action type value is the value of `UPDATE_PRODUCTS`, return a new state object with an updated products array
        case UPDATE_PRODUCTS:
            return {
                ...state,
                products: [...action.products],
            };
        // if action type value is the value of `UPDATE_CATEGORIES`, return a new state object with an updated categories array
        case UPDATE_CATEGORIES:
            return {
                ...state,
                categories: [...action.categories]
            };
        
        case UPDATE_CURRENT_CATEGORY:
            return {
                ...state,
                currentCategory: action.currentCategory
            };

        // it it's none of these actions, do not update state at all and keep things the same!
        default:
            return state;
    }
};

// function to initialize our global state object and provide functionality for updating that state by automatically running it through the custom reducer function created above. ** useReducer is used for managing larger amounts of state, unlike useState which is used for smaller tasks like handle form field values and button clicks
export function useProductReducer(initialState) {
    return useReducer(reducer, initialState);
}