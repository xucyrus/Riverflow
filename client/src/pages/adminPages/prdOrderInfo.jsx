// Author: zhier1114
import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function PrdOrderInfo() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    createdAt: '',
    userName: '',
    sex: '',
    email: '',
    phone: '',
    totalPrice: 0,
    payMethod: '',
    orderStatus: '',
    receiptType: '',
    receiptInfo: '',
    rcptName: '',
    rcptPhone: '',
    rcptAddr: null,
    shipMethod: '',
    convAddr: '',
    orderRemark: '',
    backRemark: '',
    options: []
  })

  const fetchProductOrderDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/riverflow/admin/product-orders/${id}`, {
        withCredentials: true
      })
      const productOrderData = response.data[0]

      const formatDate = (dateString) => {
        if (!dateString) return ''
        const date = new Date(dateString)
        return date.toLocaleString('zh-TW', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        })
      }

      setFormData({
        ...productOrderData,
        createdAt: formatDate(productOrderData.createdAt),
        backRemark: productOrderData.backRemark || ''
      })
    } catch (error) {
      console.error('獲取活動訂單詳細內容失敗：', error)
    }
  }

  useEffect(() => {
    fetchProductOrderDetails()
  }, [id])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.put(`http://localhost:3000/riverflow/admin/product-orders/${id}`, formData, {
        withCredentials: true
      })
      alert('訂單已成功更新')
      navigate(-1)
    } catch (error) {
      console.error('更新訂單失敗：', error)
      alert('更新訂單失敗，請稍後再試')
    }
  }

  return (
    <div className='main'>
      <div className='pageTitle'>購物訂單詳細</div>
      <div className='tabs'>
        <ul className='tabBtnList'>
          <li>
            <a href='#orderDetail' id='defaultOpen' className='tabBtn active'>
              訂單詳細資訊
            </a>
          </li>
        </ul>

        {/* <!-- tabContent 商品資訊--> */}
        <div id='orderDetail' className='tabContent'>
          <form onSubmit={handleSubmit} className='prdOrderForm'>
            <div className='orderInfoList flex'>
              <div className='details'>
                <div className='orderItem'>
                  <div>訂單成立時間：</div>
                  <div id='orderTime' className='orderItemInfo'>
                    {formData.createdAt}
                  </div>
                </div>
                <div className='orderItemList flex'>
                  <div className='orderItem half'>
                    <div>訂購人名稱：</div>
                    <div id='orderUserName' className='orderItemInfo'>
                      {formData.userName}
                    </div>
                  </div>
                  <div className='orderItem half'>
                    <div>訂購人性別：</div>
                    <div id='orderUserGender' className='orderItemInfo'>
                      {formData.sex}
                    </div>
                  </div>
                </div>
                <div className='orderItem'>
                  <div>訂購人e-mail：</div>
                  <div id='orderUserEmail' className='orderItemInfo'>
                    {formData.email}
                  </div>
                </div>
                <div className='orderItem'>
                  <div>訂購人電話：</div>
                  <div id='orderUserPhone' className='orderItemInfo'>
                    {formData.phone}
                  </div>
                </div>
                <div className='orderItem'>
                  <div>購買商品：</div>
                  <div className='orderItemInfo'>
                    {formData.options.map((option, index) => (
                      <div key={index} className='productItem'>
                        {option}
                      </div>
                    ))}
                  </div>
                </div>
                <div className='orderItem'>
                  <div>訂單金額：</div>
                  <div className='orderItemInfo flex'>
                    <span>NT$</span>
                    <span id='orderSumPrice'>{formData.totalPrice}</span>
                  </div>
                </div>
                <div className='orderItem'>
                  <div>付款方式：</div>
                  <div id='orderPayment' className='orderItemInfo'>
                    {formData.payMethod}
                  </div>
                </div>
                <div className='orderItem'>
                  <div>付款狀態：</div>
                  <div id='orderPaymentStatus' className='orderItemInfo'>
                    付款成功
                  </div>
                </div>
                <div className='orderItem'>
                  <div>電子發票：</div>
                  <div id='orderReceipt' className='orderItemInfo'>
                    {formData.receiptType}
                  </div>
                  <div id='carrier' className='orderItemInfo'>
                    {formData.receiptType !== 'dupInvoice' || 'carrier' ? '無' : formData.receiptInfo}
                  </div>
                </div>
              </div>
              <div className='details'>
                <div className='orderItem'>
                  <div>收件人姓名</div>
                  <div id='orderRecipient' className='orderItemInfo'>
                    {formData.rcptName}
                  </div>
                </div>
                <div className='orderItem'>
                  <div>收件人手機</div>
                  <div id='orderRecipientPhone' className='orderItemInfo'>
                    {formData.rcptPhone}
                  </div>
                </div>
                <div className='orderItemList flex'>
                  <div className='orderItem half'>
                    <div>收件人取貨方式：</div>
                    <div id='orderShipment' className='orderItemInfo'>
                      {formData.shipMethod}
                    </div>
                  </div>
                  <div className='orderItem half'>
                    <div>收件人取貨店鋪：</div>
                    <div id='orderShipmentShop' className='orderItemInfo'>
                      {formData.shipMethod === 'delivery' ? '無' : formData.convAddr}
                    </div>
                  </div>
                </div>
                <div className='orderItem'>
                  <div>收件人地址</div>
                  <div id='orderShipmentAddress' className='orderItemInfo'>
                    {formData.shipMethod !== 'delivery' ? '無' : formData.rcptAddr}
                  </div>
                </div>
                <div className='orderItem'>
                  <div>訂單備註</div>
                  <div id='orderUserNote' className='orderItemInfo infoArea'>
                    {formData.orderRemark}
                  </div>
                </div>
                <div className='orderItem'>
                  <label>賣家備註：</label>
                  <textarea
                    name='backRemark'
                    onChange={handleInputChange}
                    value={formData.backRemark}
                    id='orderSellerNote'
                    className='note'
                    placeholder='輸入備註事項'
                  ></textarea>
                </div>
                <div className='orderItem'>
                  <label>訂單狀態：</label>
                  <select
                    name='orderStatus'
                    id='prdOrderStatus'
                    value={formData.orderStatus}
                    onChange={handleInputChange}
                    className='statusEdit'
                  >
                    {/* <option value='processing'>處理中</option> */}
                    {/* <option value='shipped'>已出貨</option> */}
                    <option value='completed'>已完成</option>
                    <option value='cancelled'>已取消</option>
                    {/* <option value='refunded'>已退款</option> */}
                  </select>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div className='btnList flex'>
        <button className='btn' onClick={() => navigate(-1)}>
          <i className='fa-solid fa-angle-left' /> 返回
        </button>
        <button onClick={handleSubmit} className='btn' type='submit'>
          <i className='fa-solid fa-floppy-disk' /> 儲存
        </button>
      </div>
    </div>
  )
}
