import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from '@apollo/react-hooks';
import { useStoreContext } from "../utils/GlobalState";
import { idbPromise } from '../utils/helpers';
import { 
  UPDATE_PRODUCTS,
  REMOVE_FROM_CART,
  UPDATE_CART_QUANTITY,
  ADD_TO_CART 
} from "../utils/actions";
import Cart from '../components/Cart'; 

import { QUERY_PRODUCTS } from "../utils/queries";
import spinner from '../assets/spinner.gif'
import { parse } from "graphql";

function Detail() {
  const [state, dispatch] = useStoreContext();
  const { id } = useParams();

  const [currentProduct, setCurrentProduct] = useState({})

  const { loading, data } = useQuery(QUERY_PRODUCTS);

  const { products, cart } = state;
  

  const addToCart = () => {
    const itemInCart = cart.find((cartItem) => cartItem._id === id);
   
    if (itemInCart) {
      dispatch({
        type: UPDATE_CART_QUANTITY,
        _id: id, 
        purchaseQuantity: parseInt(itemInCart.purchaseQuantity) + 1
      });
      // if we're updating quantity, use existing item data and increment purchaseQuantity value by one
      idbPromise('cart', 'put', {
        ...itemInCart,
        purchaseQuantity: parseInt(itemInCart.purchaseQuantity) + 1
      });
    } else {
      dispatch({
        type: ADD_TO_CART,
        product: { ...currentProduct, purchaseQuantity: 1 }
      });
      // if product isn't in cart, add it to the current shopping cart in IDB
      idbPromise('cart', 'put', { ...currentProduct, purchaseQuantity: 1 });
    }
  };
  
  const removeFromCart = () => {
    dispatch({
      type: REMOVE_FROM_CART,
      _id: currentProduct._id
    });
    // upon removal from cart, delete the item from IDB using `currentProduct._id` to locate what to remove
    idbPromise('cart', 'delete', { ...currentProduct });
  };

  useEffect(() => {
    // already in global store
    if (products.length) {
      setCurrentProduct(products.find(product => product._id === id));
    }
    // retrieved from server
    else if (data) {
      dispatch({
        type: UPDATE_PRODUCTS,
        products: data.products
      });

      data.products.forEach((product) => {
        idbPromise('products', 'put', product);
      });
    }
    // get cache from idb
    else if (!loading) {
      idbPromise('products', 'get').then((indexedProducts) => {
        dispatch({
          type: UPDATE_PRODUCTS,
          products: indexedProducts
        });
      });
    }
    // the second arguments here are known as a dependency array. The useEffect's functionality it dependent on them to work and only runs when it detects that they've changed in value. i.e. when there's no product data in the global store, we use the product data from useQuery to set the product data to the global state object, thus triggering useEffect.
  }, [products, data, loading, dispatch, id]);

  return (
    <>
      {currentProduct ? (
        <div className="container my-1">
          <Link to="/">
            ??? Back to Products
          </Link>

          <h2>{currentProduct.name}</h2>

          <p>
            {currentProduct.description}
          </p>

          <p>
            <strong>Price:</strong>
            ${currentProduct.price}
            {" "}
            <button onClick={addToCart}>
              Add to Cart
            </button>
            <button
              disabled={!cart.find(p => p._id === currentProduct._id)} 
              onClick={removeFromCart}
            >
              Remove from Cart
            </button>
          </p>

          <img
            src={`/images/${currentProduct.image}`}
            alt={currentProduct.name}
          />
        </div>
      ) : null}
      {
        loading ? <img src={spinner} alt="loading" /> : null
      }
      <Cart />
    </>
  );
};

export default Detail;
