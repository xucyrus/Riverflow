// Author: zhier1114
import React from 'react'
import { Link } from 'react-router-dom'

const EventOrderItem = ({ eventOrder }) => {
  const { tdId, rcptName, eventName, quantity, tdPrice, tdStatus } = eventOrder

  return (
    <tr className='item'>
      <td className='evtOrderId'>{tdId}</td>
      <td className='userName'>{rcptName}</td>
      <td className='evtName'>{eventName}</td>
      <td className='evtOrderNum'>{quantity}</td>
      <td className='evtOrderPrice'>
        <span>$</span>
        {tdPrice}
      </td>
      <td className='Status'>{tdStatus}</td>
      <td className='itemOpt'>
        <div className='flex'>
          <Link to={`edit/${tdId}`}>
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

export default EventOrderItem
