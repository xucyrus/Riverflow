import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../assets/cartCheckOut.css'
import Header from '../components/header'
import Footer from '../components/footer'
import { useLocation } from 'react-router-dom'

// CartCheckout 元件：負責購物車的結帳流程，包括選擇配送方式、付款方式、填寫地址、選擇發票等功能
const CartCheckout = () => {
  const location = useLocation() // 取得上一頁傳遞的狀態
  const [cartItems, setCartItems] = useState(location.state?.cartItems || []) // 購物車中的商品項目
  const [orderRemark, setOrderRemark] = useState('') // 訂單備註
  const [deliveryMethod, setDeliveryMethod] = useState('') // 配送方式
  const [storeAddress, setStoreAddress] = useState('') // 超商取貨地址
  const [homeAddress, setHomeAddress] = useState('') // 宅配地址
  const [paymentMethod, setPaymentMethod] = useState('') // 付款方式
  const [invoiceType, setInvoiceType] = useState('') // 發票類型
  const [companyInfo, setCompanyInfo] = useState('') // 公司行號資訊
  const [mobileInfo, setMobileInfo] = useState('') // 手機載具資訊
  const [shippingFee, setShippingFee] = useState(60) // 預設運費
  const [dropdownVisible, setDropdownVisible] = useState(null) // 控制下拉選單顯示狀態
  const navigate = useNavigate() // 用於頁面導航

  // 切換下拉選單的顯示狀態
  const toggleDropdown = (dropdownName) => {
    setDropdownVisible((prev) => (prev === dropdownName ? null : dropdownName))
  }

  // 點擊下拉選單外部時關閉下拉選單
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown')) {
        setDropdownVisible(null)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [])

  // 更改配送方式的處理函數
  const handleDeliveryMethodChange = (method) => {
    setDeliveryMethod(method)
    setDropdownVisible(null)

    // 根據選擇的配送方式，清除或保留相應的地址資訊
    if (method === '7-ELEVEN' || method === '全家') {
      setHomeAddress('') // 清除宅配地址
      setStoreAddress('') // 清除超商取貨地址
    } else if (method === '宅配') {
      setStoreAddress('') // 清除超商取貨地址
    }
  }

  // 設定超商取貨地址
  const handleStoreAddressChange = (address) => {
    setStoreAddress(address)
    setDropdownVisible(null)
  }

  // 設定付款方式
  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method)
    setDropdownVisible(null)
  }

  // 設定發票類型並清除不必要的資訊
  const handleInvoiceTypeChange = (type) => {
    setInvoiceType(type)
    if (type === 'company') {
      setMobileInfo('') // 清除手機載具資訊
    } else if (type === 'mobile') {
      setCompanyInfo('') // 清除公司行號資訊
    }
    setDropdownVisible(null)
  }

  // 計算最終總金額，包括商品金額和運費
  const updateFinalTotal = () => {
    const itemTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0) // 計算商品總金額
    return itemTotal + shippingFee // 加上運費後的總金額
  }

  // 提交訂單並導航到訂單確認頁面，傳遞訂單相關資訊
  const handleSubmit = () => {
    navigate('/Order/CartConfirmation', {
      state: {
        orderRemark,
        cartItems,
        deliveryMethod,
        storeAddress,
        homeAddress,
        paymentMethod,
        invoiceType,
        companyInfo,
        mobileInfo,
        shippingFee,
        finalTotal: updateFinalTotal()
      }
    })
  }

  // 渲染頁面內容，顯示購物車資訊、選擇配送方式、付款方式和發票類型等
  return (
    <div className='cartCheckOut'>
      <Header /> {/* 顯示頁面頂部的標題 */}
      <div className='container'>
        <div className='content-left'>
          {/* 顯示訂單流程的步驟 */}
          <div className='order-steps'>
            <div className='order-detail'>
              <a href='#'>訂單資訊</a>
              <i className='fa-solid fa-arrow-right-long'></i>
            </div>
            <div className='order-detail'>
              <a href='#' style={{ color: 'darkgray' }}>
                訂單確認
              </a>
              <i style={{ color: 'gray' }} className='fa-solid fa-arrow-right-long'></i>
            </div>
            <div className='order-detail'>
              <a href='#' style={{ color: 'gray' }}>
                訂單完成
              </a>
              <i className='fa-solid fa-arrow-right-long' style={{ visibility: 'hidden' }}></i>
            </div>
          </div>

          {/* 顯示購物車中商品的簡要資訊 */}
          <div className='order-info'>
            <h3>訂單資訊</h3>
            <p>
              已選購<span id='item-count'>{cartItems.length}樣商品</span>
            </p>
          </div>

          {/* 列出所有購物車中的商品，每個商品包括名稱、選項、數量和總價 */}
          {cartItems.map((item) => (
            <div className='cart-items' key={item.ciId}>
              <img src={`/images/products/${item.productImg}`} alt={item.productName} />
              <div className='cart-item-content'>
                <h4>{item.productName}</h4>
                <h5>{item.productOpt}</h5>
              </div>
              <div className='quantity-plus-minus'>
                <button
                  className='minus-button'
                  onClick={() => handleQuantityChange(item.ciId, -1)}
                  disabled={item.quantity === 1}
                >
                  <i className='fa-solid fa-circle-minus' aria-hidden='true'></i>
                </button>
                <p className='quantity'>{item.quantity}</p>
                <button className='plus-button' onClick={() => handleQuantityChange(item.ciId, 1)}>
                  <i className='fa-solid fa-circle-plus' aria-hidden='true'></i>
                </button>
              </div>
              <p className='total' data-price={item.price}>
                NT${item.price * item.quantity}
              </p>
            </div>
          ))}
        </div>

        <div className='content-right'>
          {/* 付款和發票相關的選項 */}
          <div className='payment-method'>
            <h2>選擇付款方式</h2>

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

              {/* 配送方式的選擇 */}
              <div className='form-group dropdown'>
                <label htmlFor='delivery-method'>運送方式</label>
                <br />
                <input
                  className='text-border'
                  type='text'
                  id='delivery-method'
                  placeholder='請選擇運送方式'
                  value={deliveryMethod}
                  readOnly
                  onClick={() => toggleDropdown('delivery')}
                />
                {dropdownVisible === 'delivery' && (
                  <div className='dropdown-content'>
                    <div data-type='store' onClick={() => handleDeliveryMethodChange('7-ELEVEN')}>
                      7-ELEVEN
                    </div>
                    <div data-type='store' onClick={() => handleDeliveryMethodChange('全家')}>
                      全家
                    </div>
                    <div data-type='home' onClick={() => handleDeliveryMethodChange('宅配')}>
                      宅配
                    </div>
                  </div>
                )}
                <span id='delivery-address' className='address-display'>
                  {deliveryMethod === 'store' ? storeAddress : homeAddress}
                </span>
              </div>

              {/* 根據選擇的配送方式顯示相應的地址輸入框 */}
              {deliveryMethod === '7-ELEVEN' || deliveryMethod === '全家' ? (
                <div className='form-group dropdown'>
                  <label htmlFor='store-address'>超商地址</label>
                  <br />
                  <input
                    className='text-border'
                    type='text'
                    id='store-address'
                    placeholder='請選擇地址'
                    value={storeAddress}
                    readOnly
                    onClick={() => toggleDropdown('storeAddress')}
                  />
                  {dropdownVisible === 'storeAddress' && (
                    <div className='dropdown-content'>
                      <div onClick={() => handleStoreAddressChange('台北市信義路123號')}>台北市信義路123號</div>
                      <div onClick={() => handleStoreAddressChange('新北市中和路456號')}>新北市中和路456號</div>
                      <div onClick={() => handleStoreAddressChange('台中市大同路789號')}>台中市大同路789號</div>
                    </div>
                  )}
                </div>
              ) : null}

              {/* 宅配方式的地址輸入框 */}
              {deliveryMethod === '宅配' ? (
                <div className='form-group' id='home-address-group'>
                  <label htmlFor='home-address'>宅配地址</label>
                  <br />
                  <input
                    className='text-border'
                    type='text'
                    id='home-address'
                    placeholder='請輸入宅配地址'
                    value={homeAddress}
                    onChange={(e) => setHomeAddress(e.target.value)}
                  />
                </div>
              ) : null}

              {/* 付款方式的選擇 */}
              <div className='form-group dropdown'>
                <label htmlFor='payment-method'>付款方式</label>
                <br />
                <input
                  className='text-border'
                  type='text'
                  id='payment-method'
                  placeholder='請選擇付款方式'
                  value={paymentMethod}
                  readOnly
                  onClick={() => toggleDropdown('payment')}
                />
                {dropdownVisible === 'payment' && (
                  <div className='dropdown-content'>
                    <div onClick={() => handlePaymentMethodChange('線上付款')}>線上付款</div>
                    <div onClick={() => handlePaymentMethodChange('貨到付款')}>貨到付款</div>
                  </div>
                )}
              </div>

              {/* 發票類型的選擇 */}
              <div className='invoice-promo-code'>
                <div className='form-group dropdown'>
                  <label htmlFor='invoice'>電子發票</label>
                  <br />
                  <input
                    className='text-border'
                    type='text'
                    id='invoice'
                    placeholder='請選擇發票類型'
                    value={invoiceType}
                    readOnly
                    onClick={() => toggleDropdown('invoice')}
                  />
                  {dropdownVisible === 'invoice' && (
                    <div className='dropdown-content'>
                      <div onClick={() => handleInvoiceTypeChange('三聯式')}>三聯式</div>
                      <div onClick={() => handleInvoiceTypeChange('捐贈發票')}>捐贈發票</div>
                      <div onClick={() => handleInvoiceTypeChange('手機載具')}>手機載具</div>
                    </div>
                  )}
                </div>
              </div>

              {/* 根據發票類型顯示相應的輸入框 */}
              {invoiceType === 'company' && (
                <div className='form-group' id='company-info-group'>
                  <label htmlFor='company-info'>公司行號</label>
                  <br />
                  <input
                    className='text-border'
                    type='text'
                    id='company-info'
                    placeholder='請輸入公司行號'
                    value={companyInfo}
                    onChange={(e) => setCompanyInfo(e.target.value)}
                  />
                </div>
              )}

              {invoiceType === 'mobile' && (
                <div className='form-group' id='mobile-info-group'>
                  <label htmlFor='mobile-info'>手機載具</label>
                  <br />
                  <input
                    className='text-border'
                    type='text'
                    id='mobile-info'
                    placeholder='請輸入手機載具'
                    value={mobileInfo}
                    onChange={(e) => setMobileInfo(e.target.value)}
                  />
                </div>
              )}

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
                <button type='button' id='submit' onClick={handleSubmit}>
                  訂單確認
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

export default CartCheckout
