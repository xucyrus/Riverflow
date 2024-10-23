import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import '../assets/cart.css'
import Header from '../components/header'
import Footer from '../components/footer'

// 負責顯示每個購物車項目的內容，例如商品名稱、圖片、數量、單價、總金額，以及刪除按鈕
const CartItem = ({ item, onQuantityChange, onDelete }) => {
  // 調整購物車項目的數量
  const handleQuantityChange = (change) => {
    onQuantityChange(item.ciid, item.quantity + change)
  }

  return (
    <tr className='cart-item'>
      <td>
        <div className='cart-item-left-content'>
          <img src={`/images/products/${item.productImg}`} alt={item.productName} />
          <div className='cart-item-content'>
            <h4>{item.productName}</h4>
            <h5>{item.productOpt}</h5>
          </div>
        </div>
      </td>
      <td className='price'>NT${item.price}</td>
      <td>
        <div className='quantity-plus-minus'>
          <a
            href='#'
            onClick={(e) => {
              e.preventDefault()
              // 減少商品數量
              handleQuantityChange(-1)
            }}
            className='quantity-minus'
            aria-disabled={item.quantity === 1 ? 'true' : 'false'}
          >
            <i className='fa-solid fa-circle-minus'></i>
          </a>
          <p className='quantity'>{item.quantity}</p>
          <a
            href='#'
            onClick={(e) => {
              e.preventDefault()
              // 增加商品數量
              handleQuantityChange(1)
            }}
            className='quantity-plus'
          >
            <i className='fa-solid fa-circle-plus'></i>
          </a>
        </div>
      </td>
      <td className='total'>NT${item.price * item.quantity}</td>
      <td>
        <a
          href='#'
          onClick={(e) => {
            e.preventDefault()
            // 刪除該購物車項目
            onDelete(item.ciid)
          }}
          className='delete'
        >
          <i className='fa-regular fa-trash-can'></i>
        </a>
      </td>
    </tr>
  )
}

// 購物車主元件
// 管理購物車中的所有項目，負責獲取和更新購物車資料、刪除項目以及導向結帳頁面
const Cart = () => {
  // 儲存購物車項目的狀態
  const [cartItems, setCartItems] = useState([])
  // 載入狀態
  const [isLoading, setIsLoading] = useState(false)
  // 使用 useNavigate 進行頁面導航
  const navigate = useNavigate()

  // 當元件初次渲染時，從後端獲取購物車資料
  useEffect(() => {
    axios.defaults.withCredentials = true // 設定 axios 帶上憑證
    fetchCartItems()
  }, [])

  // 獲取購物車項目的函數
  // 向後端發送請求，取得購物車資料並更新狀態
  const fetchCartItems = () => {
    axios
      .get('http://localhost:3000/riverflow/cart/')
      .then((response) => {
        // 成功取得資料後更新購物車狀態
        setCartItems(response.data)
      })
      .catch((error) => {
        // 錯誤處理
        console.error('獲取購物車項目失敗', error)
        if (error.response && error.response.status === 401) {
          console.error('Token 可能已過期或無效，需要重新登入')
        }
      })
  }

  // 更新購物車項目的數量
  // 向後端發送請求更新指定項目的數量
  const updateCart = (ciid, newQuantity) => {
    if (newQuantity <= 0) return // 防止數量為負或零
    axios
      .put('http://localhost:3000/riverflow/cart/update', { ciid, quantity: newQuantity })
      .then(() => {
        setCartItems(cartItems.map((item) => (item.ciid === ciid ? { ...item, quantity: newQuantity } : item))) // 更新狀態
      })
      .catch((error) => {
        console.error('更新購物車項目失敗', error)
      })
  }

  // 刪除購物車項目的函數
  // 向後端發送請求以刪除指定項目
  const deleteItem = (ciid) => {
    axios
      .delete(`http://localhost:3000/riverflow/cart/remove/${ciid}`)
      .then(() => {
        setCartItems(cartItems.filter((item) => item.ciid !== ciid)) // 從狀態中移除項目
      })
      .catch((error) => {
        console.error('刪除購物車項目失敗', error) // 錯誤處理
      })
  }

  // 處理結帳功能
  // 導向結帳頁面並傳遞購物車項目資料
  const handleCheckout = () => {
    navigate('/Order/cartCheckOut', { state: { cartItems } }) // 使用 navigate 傳遞狀態和導航
  }

  // 計算購物車中所有項目的總數量
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0)
  // 計算購物車中所有項目的總金額
  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)

  // 返回購物車的 UI 元素，顯示購物車內容和操作
  return (
    <div className='cart-wrap-f'>
      <Header />
      <div className='container-f'>
        <div className='cart-wrap'>
          <div className='container'>
            <div className='top'>
              <h3>River Flow | 購物車</h3>
            </div>
            <div className='cart-border'>
              <table className='cart-table'>
                <thead>
                  <tr>
                    <th className='shop-push'>商品</th>
                    <th>單價</th>
                    <th>數量</th>
                    <th>總金額</th>
                    <th>刪除</th>
                  </tr>
                </thead>
              </table>
            </div>
            <div className='cart-border-inner'>
              <table className='cart-table'>
                <tbody id='cart-items'>
                  {cartItems.map((item) => (
                    <CartItem key={item.ciid} item={item} onQuantityChange={updateCart} onDelete={deleteItem} />
                  ))}
                </tbody>
              </table>
            </div>
            <div className='checkButton'>
              <p>
                已選購 <span id='item-count'>{totalItems}</span> 項商品
              </p>
              <div className='rightCheckButton'>
                總金額: NT$<span id='total-amount'>{totalPrice}</span>
                <button onClick={handleCheckout} disabled={isLoading || cartItems.length === 0} className='GoBtn'>
                  {isLoading ? '處理中...' : '前往訂單'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Cart
