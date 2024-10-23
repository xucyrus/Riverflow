import React, { useState } from 'react'
import '../assets/cartConfirmation.css'
import '../assets/reset.css'
import Header from '../components/header'
import Footer from '../components/footer'

import Swal from 'sweetalert2'
import axios from 'axios'
import { useLocation } from 'react-router-dom'

// CartConfirmation 元件：負責顯示訂單確認頁面，包括顧客資訊、配送方式、付款方式、發票資訊等
const CartConfirmation = () => {
  const location = useLocation() // 獲取從前一頁傳遞過來的狀態資料
  const {
    cartItems,
    deliveryMethod,
    storeAddress,
    homeAddress,
    paymentMethod,
    invoiceType,
    companyInfo,
    mobileInfo,
    shippingFee,
    finalTotal,
    initialOrderRemark,
    initialCustomerName = '林小美',
    initialCustomerEmail = 'linxiaomei015@gmail.com',
    initialCustomerPhone = '0912-345-121'
  } = location.state || {}

  // 設定各種狀態來儲存表單的資料
  const [customerName, setCustomerName] = useState(initialCustomerName) // 顧客姓名
  const [customerEmail] = useState(initialCustomerEmail) // 信箱（不可編輯）
  const [customerPhone, setCustomerPhone] = useState(initialCustomerPhone) // 顧客電話
  const [orderRemark, setOrderRemark] = useState(initialOrderRemark || '') // 訂單備註
  const [isLoading, setIsLoading] = useState(false) // 處理訂單的狀態

  // 處理線上付款的函數
  const handleCheckout = async () => {
    setIsLoading(true)
    try {
      const response = await axios.post('http://localhost:3000/riverflow/pay/create-checkout-session', {
        shippingFee,
        finalTotal,
        items: cartItems.map((item) => ({
          name: item.productName,
          size: item.productOpt,
          price: item.price,
          quantity: item.quantity,
          productId: item.productId
        }))
      })

      Swal.fire({
        title: '正在前往線上付款',
        icon: 'info',
        confirmButtonColor: '#98d900',
        timer: 3000,
        timerProgressBar: true
      }).then(() => {
        setTimeout(() => {
          window.location = response.data.url
        }, 0)
      })
    } catch (error) {
      console.error('創建結帳會話失敗', error)
      alert('結帳過程中發生錯誤，請稍後再試。')
    } finally {
      setIsLoading(false)
    }
  }

  // 提交訂單的處理函數
  const handleSubmitOrder = async () => {
    try {
      const orderData = {
        cartItems,
        deliveryMethod,
        storeAddress,
        homeAddress,
        paymentMethod,
        invoiceType,
        companyInfo,
        mobileInfo,
        shippingFee,
        finalTotal,
        orderRemark,
        customerName,
        customerEmail,
        customerPhone
      }

      // 根據付款方式處理不同的訂單提交流程
      if (paymentMethod === '線上付款') {
        // 進行線上付款
        await handleCheckout()
      } else {
        // 保存訂單資訊到會員訂單中
        const response = await axios.post('http://localhost:3000/riverflow/order/save', orderData)
        if (response.status === 200) {
          Swal.fire({
            title: '訂單已保存',
            text: '您的訂單已成功保存。',
            icon: 'success',
            confirmButtonColor: '#98d900',
            timer: 6000,
            timerProgressBar: true,
            willClose: () => {
              window.location.href = '/Member/OrderList' // 跳轉到訂單列表頁面
            }
          })
        } else {
          throw new Error('訂單保存過程中發生錯誤。')
        }
      }
    } catch (error) {
      console.error('錯誤：', error.message)
      Swal.fire({
        title: '錯誤',
        text: '處理您的訂單過程中發生錯誤。請稍後再試。',
        icon: 'error',
        confirmButtonColor: '#d33'
      })
    }
  }

  // 計算最終總金額
  const updateFinalTotal = () => finalTotal

  // 渲染頁面內容，顯示訂單確認資訊和提交訂單按鈕
  return (
    <div className='cartConfirmation-container'>
      <Header /> {/* 顯示頁面頂部的標題 */}
      <div className='container'>
        <div className='content-left'>
          {/* 顯示訂單流程的步驟 */}
          <div className='order-steps'>
            <div className='order-detail'>
              <a href='#' style={{ color: 'gray' }}>
                訂單資訊
              </a>
              <i style={{ color: 'gray' }} className='fa-solid fa-arrow-right-long'></i>
            </div>
            <div className='order-detail'>
              <a href='#'>訂單確認</a>
              <i className='fa-solid fa-arrow-right-long'></i>
            </div>
            <div className='order-detail'>
              <a href='#' style={{ color: 'gray' }}>
                訂單完成
              </a>
              <i className='fa-solid fa-arrow-right-long' style={{ visibility: 'hidden' }}></i>
            </div>
          </div>

          {/* 顯示顧客基本資料 */}
          <div className='order-info'>
            <h3>訂單確認</h3>
            <p>顧客基本資料</p>
          </div>

          {/* 顧客資訊表單：姓名、信箱、電話、訂單備註 */}
          <div className='customer-info'>
            <label htmlFor='customerName'>顧客姓名</label>
            <br />
            <input
              type='text'
              id='customerName'
              name='customerName'
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder='請輸入姓名'
            />
            <br />
            <label htmlFor='customerEmail'>電子信箱</label>
            <br />
            <input
              type='text'
              id='customerEmail'
              name='customerEmail'
              value={customerEmail}
              placeholder='請輸入電子信箱'
              readOnly
              style={{ cursor: 'not-allowed' }}
            />
            <br />
            <label htmlFor='customerPhone'>電話號碼</label>
            <br />
            <input
              type='text'
              id='customerPhone'
              name='customerPhone'
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder='請輸入電話號碼'
            />
            <br />
            <label htmlFor='orderRemark'>訂單備註</label>
            <br />
            <input
              type='text'
              id='orderRemark'
              name='orderRemark'
              value={orderRemark}
              onChange={(e) => setOrderRemark(e.target.value)}
              placeholder='有什麼需要告訴賣家嗎?'
            />
          </div>
        </div>

        <div className='content-right'>
          {/* 顯示付款方式、配送方式和發票資訊 */}
          <div className='payment-method'>
            <h2>確認付款方式</h2>

            <form id='order-form'>
              {/* 顯示固定的國家資訊 */}
              <div className='form-group dropdown'>
                <label className='country' htmlFor='country'>
                  國家
                </label>
                <br />
                <input
                  className='text-border'
                  type='text'
                  id='country'
                  value='台灣'
                  readOnly
                  style={{ cursor: 'not-allowed' }}
                />
              </div>

              {/* 顯示選擇的配送方式和地址 */}
              <div className='form-group dropdown'>
                <label htmlFor='deliveryMethod'>運送方式</label>
                <br />
                <input className='text-border' value={deliveryMethod} type='text' id='deliveryMethod' readOnly />
                {deliveryMethod === '7-ELEVEN' || deliveryMethod === '全家' ? (
                  <div className='form-group dropdown' id='store-address-group'>
                    <label htmlFor='storeAddress'>超商地址</label>
                    <br />
                    <input className='text-border' type='text' id='storeAddress' value={storeAddress} readOnly />
                  </div>
                ) : deliveryMethod === '宅配' ? (
                  <div className='form-group' id='home-address-group'>
                    <label htmlFor='homeAddress'>宅配地址</label>
                    <br />
                    <input className='text-border' type='text' id='homeAddress' value={homeAddress} readOnly />
                  </div>
                ) : null}
              </div>

              {/* 顯示選擇的付款方式 */}
              <div className='form-group dropdown'>
                <label htmlFor='paymentMethod'>付款方式</label>
                <br />
                <input className='text-border' type='text' id='paymentMethod' value={paymentMethod} readOnly />
              </div>

              {/* 顯示發票相關的選項 */}
              <div className='invoice-promo-code'>
                <div className='form-group dropdown'>
                  <label htmlFor='invoiceType'>電子發票</label>
                  <br />
                  <input className='text-border' type='text' id='invoiceType' value={invoiceType} readOnly />
                </div>

                {invoiceType === '三聯式' ? (
                  <div className='form-group dropdown'>
                    <label htmlFor='companyInfo'>公司抬頭</label>
                    <br />
                    <input className='text-border' type='text' id='companyInfo' value={companyInfo} readOnly />
                  </div>
                ) : null}

                {invoiceType === '手機條碼' ? (
                  <div className='form-group dropdown'>
                    <label htmlFor='mobileInfo'>手機條碼</label>
                    <br />
                    <input className='text-border' type='text' id='mobileInfo' value={mobileInfo} readOnly />
                  </div>
                ) : null}
              </div>

              {/* 顯示商品總金額和運費 */}
              <div className='total-amount'>
                <p>
                  商品金額:
                  <span id='item-total'>${cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)}</span>
                </p>
                <p>
                  運費金額: <span id='shipping-fee'>${shippingFee}</span>
                </p>
                <p>
                  付款總金額: <span id='final-total'>${updateFinalTotal()}</span>
                </p>
              </div>

              {/* 提交訂單的按鈕 */}
              <div className='submit'>
                <button type='button' className='confirm-order' onClick={handleSubmitOrder} disabled={isLoading}>
                  {isLoading ? '處理中...' : '確認訂單'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default CartConfirmation
