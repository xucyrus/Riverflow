import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const AdminLogin = () => {
  const [account, setAccount] = useState('')
  const [secret, setSecret] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    console.log('account:', account)
    console.log('secret:', secret)

    try {
      const response = await axios.post(
        'http://localhost:3000/riverflow/admin/login',
        { account, secret },
        { withCredentials: true }
      )
      if (response.data.message === '管理員登入成功') {
        navigate('/admin/dashboard')
      }
    } catch (error) {
      alert('帳號或密碼錯誤，請重新嘗試')
      console.error('登入失敗:', error)
      // 處理登入錯誤，例如顯示錯誤消息
    }
  }

  return (
    <div className='adminLogin'>
      <section className='login'>
        <form onSubmit={handleLogin} className='form'>
          <h4>管理員登入</h4>
          <div className='input-text'>
            <label htmlFor='account'>帳號</label>
            <input
              type='text'
              id='account'
              name='account'
              value={account}
              onChange={(e) => setAccount(e.target.value)}
              required
              placeholder='輸入管理員帳號'
            />
          </div>
          <div className='input-text'>
            <label htmlFor='secret'>密碼</label>
            <input
              type='password'
              id='secret'
              value={secret}
              name='secret'
              onChange={(e) => setSecret(e.target.value)}
              required
              placeholder='輸入管理員密碼'
            />
          </div>
          <input type='submit' className='btn' value='登入' />
        </form>
      </section>
    </div>
  )
}

export default AdminLogin
