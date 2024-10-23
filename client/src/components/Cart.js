import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Cart = ({ userId }) => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    fetchCart();
  }, [userId]);

  const fetchCart = async () => {
    try {
      const response = await axios.get(`/api/cart/${userId}`);
      setCartItems(response.data);
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  const updateQuantity = async (ciid, quantity) => {
    try {
      await axios.put('/api/cart/update', { ciid, quantity });
      fetchCart();
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const removeItem = async (ciid) => {
    try {
      await axios.delete(`/api/cart/remove/${ciid}`);
      fetchCart();
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleCheckout = async () => {
    try {
      const response = await axios.post('/riverflow/pay/create-checkout-session', {
        items: cartItems.map(item => ({
          name: item.productName,
          size: item.productOpt,
          price: item.price,
          quantity: item.quantity
        }))
      });
      window.location = response.data.url;
    } catch (error) {
      console.error('Error creating checkout session:', error);
    }
  };

  return (
    <div className="cart">
      <h2>購物車</h2>
      {cartItems.map(item => (
        <div key={item.ciid} className="cart-item">
          <span>{item.productName} ({item.productOpt})</span>
          <span>NT$ {item.price}</span>
          <input
            type="number"
            value={item.quantity}
            onChange={(e) => updateQuantity(item.ciid, e.target.value)}
            min="1"
          />
          <button onClick={() => removeItem(item.ciid)}>移除</button>
        </div>
      ))}
      <div className="cart-total">
        <strong>總計: NT$ {calculateTotal()}</strong>
      </div>
      <button onClick={handleCheckout}>結帳</button>
    </div>
  );
};

export default Cart;