// Author: zhier1114
import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function EventOrderInfo() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    createdAt: '',
    rcptName: '',
    sex: '',
    email: '',
    phone: '',
    receiptType: '',
    receiptInfo: '',
    eventName: '',
    quantity: 0,
    ticketType: '',
    randNum: '',
    tdPrice: 0,
    tdStatus: ''
  })

  const fetchEventOrderDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/riverflow/admin/event-orders/${id}`, {
        withCredentials: true
      })
      const eventOrderData = response.data[0]

      // 處理時間格式
      const formatDate = (dateString) => {
        if (!dateString) return ''
        const date = new Date(dateString)
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        const hours = String(date.getHours()).padStart(2, '0')
        const minutes = String(date.getMinutes()).padStart(2, '0')
        const seconds = String(date.getSeconds()).padStart(2, '0')
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
      }
      const createDate = formatDate(eventOrderData.createdAt)
      eventOrderData.createdAt = createDate

      setFormData(eventOrderData)
    } catch (error) {
      console.error('獲取活動訂單詳細內容失敗：', error)
    }
  }

  useEffect(() => {
    fetchEventOrderDetails()
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
      await axios.put(`http://localhost:3000/riverflow/admin/event-orders/${id}`, formData, {
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
      <div className='pageTitle'>購票訂單詳細</div>
      <div className='tabs'>
        <ul className='tabBtnList'>
          <li>
            <a href='#orderDetail' id='defaultOpen' className='tabBtn active'>
              訂單詳細資訊
            </a>
          </li>
        </ul>

        {/* <!-- tabContent 活動訂單資訊--> */}
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
                      {formData.rcptName}
                    </div>
                  </div>
                  <div className='orderItem half'>
                    <div>訂購人性別：</div>
                    <div id='orderUserGender' className='orderItemInfo'>
                      ${formData.sex}
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
                  <div>付款方式：</div>
                  <div id='eventOrderPayment' className='orderItemInfo'>
                    線上付款
                  </div>
                </div>
                <div className='orderItem'>
                  <div>付款狀態：</div>
                  <div id='eventOrderPaymentStatus' className='orderItemInfo'>
                    付款成功
                  </div>
                </div>
                <div className='orderItem'>
                  <div>電子發票：</div>
                  <div id='eventOrderReceipt' className='orderItemInfo'>
                    {formData.receiptType}
                  </div>
                  <div id='eventCarrier' className='orderItemInfo'>
                    {formData.receiptInfo}
                  </div>
                </div>
              </div>
              <div className='details'>
                <div className='orderItem'>
                  <div>購買場次：</div>
                  <div id='orderEventName' className='orderItemInfo'>
                    {formData.eventName}
                  </div>
                </div>
                <div className='orderItem'>
                  <div>購買票數</div>
                  <div id='orderTicketNum' className='orderItemInfo'>
                    {formData.quantity}
                  </div>
                </div>
                <div className='orderItem'>
                  <div>購買票種</div>
                  <div id='orderEventArea' className='orderItemInfo'>
                    {formData.ticketType}
                  </div>
                </div>
                <div className='orderItem'>
                  <div>取票序號</div>
                  <div id='orderRandonNum' className='orderItemInfo'>
                    {formData.randNum}
                  </div>
                </div>
                <div className='orderItem'>
                  <div>訂單金額：</div>
                  <div className='orderItemInfo flex'>
                    <span>NT$</span>
                    <span id='orderSumPrice'>{formData.tdPrice}</span>
                  </div>
                </div>
                <div className='orderItem'>
                  <label>訂單狀態：</label>
                  <select
                    name='tdStatus'
                    value={formData.tdStatus}
                    id='eventOrderStatus'
                    className='statusEdit'
                    onChange={handleInputChange}
                  >
                    <option value='已付款'>已付款</option>
                    <option value='已退款'>已退款</option>
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
