// Author : zhier1114
import React, { useState, useEffect, useCallback } from 'react'
import { Link, useMatch } from 'react-router-dom'
import ProductOrderItem from '../../components/productOrderItem'
import axios from 'axios'

export default function PrdOrderList() {
  useMatch('/admin/prdOrderList/*')

  const [productOrders, setProductOrders] = useState([])
  const [filteredProductOrders, setFilteredProductOrders] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [productOrdersPerPage] = useState(5)
  const [searchTerm, setSearchTerm] = useState('')

  const sortOrders = (orders) => {
    return orders.sort((a, b) => a.orderId - b.orderId)
  }

  const fetchProductOrders = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:3000/riverflow/admin/product-orders', {
        withCredentials: true
      })

      const sortedOrders = sortOrders(response.data)
      setProductOrders(sortedOrders)
      setFilteredProductOrders(sortedOrders)
    } catch (err) {
      console.error('獲取活動訂單失敗：', err)
    }
  }, [])

  useEffect(() => {
    fetchProductOrders()
  }, [fetchProductOrders])

  useEffect(() => {
    const updateStatusColors = () => {
      document.querySelectorAll('.Status').forEach((elem) => {
        if (elem.innerText === '已完成') {
          elem.style.color = 'var(--side)'
        } else if (elem.innerText === '已取消') {
          elem.style.color = 'var(--cancel)'
        }
      })
    }
    updateStatusColors()
  }, [filteredProductOrders, currentPage])

  const handleSearch = async (e) => {
    e.preventDefault()
    try {
      if (searchTerm === '' || searchTerm === undefined) {
        await fetchProductOrders()
      } else {
        const response = await axios.get(
          `http://localhost:3000/riverflow/admin/product-orders/search?keyword=${searchTerm}`,
          { withCredentials: true }
        )
        const sortedResults = sortOrders(response.data)
        setFilteredProductOrders(sortedResults)
      }
      setCurrentPage(1)
    } catch (err) {
      console.error('活動訂單搜尋失敗：', err)
    }
  }

  const indexOfLastProductOrder = currentPage * productOrdersPerPage
  const indexOfFirstProductOrder = indexOfLastProductOrder - productOrdersPerPage
  const currentProductOrders = filteredProductOrders.slice(indexOfFirstProductOrder, indexOfLastProductOrder)
  const totalPages = Math.ceil(filteredProductOrders.length / productOrdersPerPage)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  return (
    <div className='main'>
      <div className='pageTitle'>商品訂單</div>
      <div className='flex'>
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
      </div>
      <table className='listTable'>
        <thead>
          <tr>
            <td>訂單編號</td>
            <td>訂購人姓名</td>
            <td>訂購人手機</td>
            <td>訂單價格</td>
            <td>付款方式</td>
            <td>狀態</td>
            <td>操作</td>
          </tr>
        </thead>
        {filteredProductOrders.length === 0 ? (
          <tbody>
            <tr>
              <td colSpan='7'>沒有找到相關商品訂單</td>
            </tr>
          </tbody>
        ) : (
          <tbody>
            {currentProductOrders.map((productOrder) => (
              <ProductOrderItem key={productOrder.orderId} productOrder={productOrder} />
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
