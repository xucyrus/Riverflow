import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import '../assets/adminPage.css'
import axios from 'axios'

export default function LeftCol() {
  const navigate = useNavigate()

  const handleLogOut = async () => {
    try {
      await axios.get('http://localhost:3000/riverflow/admin/logout', {
        withCredentials: true
      })
      // 清除客戶端的 token
      document.cookie = 'adminToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
      // 重定向到登錄頁面
      navigate('/admin/login')
    } catch (err) {
      console.error('登出失敗:', err)
    }
  }

  return (
    <div className='sideBar'>
      <div className='greeting flex'>
        <div>
          <span>管理帳號</span>，你好！
        </div>
        <button onClick={handleLogOut} className='btn'>
          登出
        </button>
      </div>
      <div className='sideMenu'>
        <ul>
          <li className='sideMenuOpt'>
            <label className='menuTitle flex'>
              <i className='fa-solid fa-bag-shopping' />
              商品管理
            </label>
            <ul className='secMenu'>
              <li>
                <NavLink to='/admin/prdList' className='menuPage'>
                  商品列表
                </NavLink>
              </li>
              <li>
                <NavLink to='/admin/prdOrderList' className='menuPage'>
                  商品訂單
                </NavLink>
              </li>
            </ul>
          </li>
          <li className='sideMenuOpt'>
            <label className='menuTitle flex'>
              <i className='fa-solid fa-newspaper' />
              專欄管理
            </label>
            <ul className='secMenu'>
              <li>
                <NavLink to='/admin/blogList' className='menuPage'>
                  文章列表
                </NavLink>
              </li>
            </ul>
          </li>
          <li className='sideMenuOpt'>
            <label className='menuTitle flex'>
              <i className='fa-solid fa-calendar-days' />
              活動管理
            </label>
            <ul className='secMenu'>
              <li>
                <NavLink to='/admin/eventList' className='menuPage'>
                  活動列表
                </NavLink>
              </li>
              <li>
                <NavLink to='/admin/eventOrderList' className='menuPage'>
                  活動訂單
                </NavLink>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  )
}
