import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data);
    } catch (error) {
      console.error('獲取產品列表時出錯:', error);
    }
  };

  const addToCart = async (product) => {
    try {
      await api.post('/cart', {
        productId: product.id,
        productName: product.name,
        productOpt: product.defaultOption, // 假設有默認選項
        quantity: 1,
        price: product.price
      });
      alert('商品已添加到購物車');
    } catch (error) {
      console.error('添加商品到購物車時出錯:', error);
      alert('無法添加商品到購物車。請稍後再試。');
    }
  };

  return (
    <div className="product-list">
      <h2>商品列表</h2>
      {products.map((product) => (
        <div key={product.id} className="product-item">
          <h3>{product.name}</h3>
          <p>價格: ${product.price}</p>
          <button onClick={() => addToCart(product)}>添加到購物車</button>
        </div>
      ))}
    </div>
  );
};

export default ProductList;