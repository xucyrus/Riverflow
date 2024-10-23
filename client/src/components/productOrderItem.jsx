// Author: zhier1114
import React from 'react'
import { Link } from 'react-router-dom'

const ProductOrderItem = ({ productOrder }) => {
  const { orderId, rcptName, rcptPhone, totalPrice } = productOrder

  let payMethod = productOrder.payMethod
  let orderStatus = productOrder.orderStatus

  if (payMethod === 'card') {
    payMethod = '線上刷卡'
  } else if (payMethod === 'bankTransfer') {
    payMethod = '銀行轉帳'
  } else if (payMethod === 'cash') {
    payMethod = '現金付款'
  }

  if (orderStatus === 'completed') {
    orderStatus = '已完成'
  } else if (orderStatus === 'cancelled') {
    orderStatus = '已取消'
  }

  return (
    <tr className='item'>
      <td className='prdOrderId'>{orderId}</td>
      <td className='userName'>{rcptName}</td>
      <td className='userPhone'>{rcptPhone}</td>
      <td className='prdOrderPrice'>
        <span>$</span>
        {totalPrice}
      </td>
      <td className='prdPayment'>{payMethod}</td>
      <td className='Status'>{orderStatus}</td>
      <td className='itemOpt'>
        <div className='flex'>
          <Link to={`edit/${orderId}`}>
            <button id='btnEdit' className='btn itemOpr orderEdit inline-flex'>
              <i className='fa-solid fa-pen' />
              編輯狀態
            </button>
          </Link>
        </div>
      </td>
    </tr>
  )
}

export default ProductOrderItem
