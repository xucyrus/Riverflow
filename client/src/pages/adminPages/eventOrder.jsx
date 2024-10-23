// Author: zhier1114
import React, { useState, useEffect, useCallback } from 'react'
import { Link, useMatch } from 'react-router-dom'
import EventOrderItem from '../../components/eventOrderItem'
import axios from 'axios'

export default function EventOrderList() {
  const match = useMatch('/admin/eventOrderList/*')

  const [eventOrders, setEventOrders] = useState([])
  const [filteredEventOrders, setFilteredEventOrders] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [eventOrdersPerPage] = useState(5)
  const [searchTerm, setSearchTerm] = useState('')

  const fetchEventOrders = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:3000/riverflow/admin/event-orders', {
        withCredentials: true
      })
      setEventOrders(response.data)
      setFilteredEventOrders(response.data)
    } catch (err) {
      console.error('獲取活動訂單失敗：', err)
    }
  }, [])

  useEffect(() => {
    fetchEventOrders()
  }, [fetchEventOrders])

  useEffect(() => {
    const updateStatusColors = () => {
      document.querySelectorAll('.Status').forEach((elem) => {
        if (elem.innerText === '已付款') {
          elem.style.color = 'var(--side)'
        } else if (elem.innerText === '已退款') {
          elem.style.color = 'var(--err)'
        }
      })
    }
    updateStatusColors()
  }, [filteredEventOrders, currentPage])

  const handleSearch = async (e) => {
    e.preventDefault()
    try {
      if (searchTerm === '' || searchTerm === undefined) {
        await fetchEventOrders()
      } else {
        const response = await axios.get(
          `http://localhost:3000/riverflow/admin/event-orders/search?keyword=${searchTerm}`,
          {
            withCredentials: true
          }
        )
        setFilteredEventOrders(response.data)
      }
      setCurrentPage(1)
    } catch (err) {
      console.error('活動訂單搜尋失敗：', err)
    }
  }

  const indexOfLastEventOrder = currentPage * eventOrdersPerPage
  const indexOfFirstEventOrder = indexOfLastEventOrder - eventOrdersPerPage
  const currentEventOrders = filteredEventOrders.slice(indexOfFirstEventOrder, indexOfLastEventOrder)
  const totalPages = Math.ceil(filteredEventOrders.length / eventOrdersPerPage)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  return (
    <div className='main'>
      <div className='pageTitle'>活動訂單</div>
      <div className='flex'>
        <form onSubmit={handleSearch} className='flex'>
          <input
            type='text'
            id='pdtSearch'
            className='search'
            placeholder='關鍵字搜尋'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <input type='submit' value='搜尋' />
        </form>
      </div>
      <table className='listTable'>
        <thead>
          <tr>
            <td>訂單編號</td>
            <td>訂購人姓名</td>
            <td>購買場次</td>
            <td>購買票數</td>
            <td>訂單價格</td>
            <td>狀態</td>
            <td>操作</td>
          </tr>
        </thead>
        {filteredEventOrders.length === 0 ? (
          <tbody>
            <tr>
              <td colSpan='7'>沒有找到相關活動訂單</td>
            </tr>
          </tbody>
        ) : (
          <tbody>
            {currentEventOrders.map((eventOrder) => (
              <EventOrderItem key={eventOrder.tdId} eventOrder={eventOrder} />
            ))}
          </tbody>
        )}
      </table>
      <div className='pagination'>
        {Array.from({ length: totalPages }, (_, i) => (
          <button key={i} onClick={() => paginate(i + 1)} className={currentPage === i + 1 ? 'active' : ''}>
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  )
}
