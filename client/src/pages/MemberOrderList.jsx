import React, { Component } from 'react'
import axios from 'axios'
import '../assets/member.css'
import Header from '../components/header'
import Footer from '../components/footer'
import defaultImg from '../assets/images/defaultphoto.jpg' // 預設會員圖片

class MemberOrderList extends Component {
  state = {
    Users: {
      // 去看資料庫怎麼寫!
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      birth: '',
      sex: '',
      userImg: ''
    },
    Order: [
      // 去看資料庫怎麼寫!
      { orderId: '', createdAt: '', payMethod: '', totalPrice: '', orderStatus: '' }
    ],

    showAdditionalOrders: false,
    activeAccordion: null,
    isLoading: true,
    error: null
  }

  async componentDidMount() {
    await this.fetchUserData();
    await this.fetchOrderData();
  
    const defaultOpenElement = document.getElementById('defaultOpen');
    if (defaultOpenElement) {
      defaultOpenElement.click();
    } else {
      console.error("Element with ID 'defaultOpen' not found.");
    }
  }

  fetchUserData = async () => {
    try {
      const response = await axios.get('http://localhost:3000/riverflow/user', {
        withCredentials: true // Cookie
      })
      console.log('Fetched user data:', response.data)
      this.setState({
        Users: response.data,
        isLoading: false
      })
    } catch (error) {
      console.error('Error fetching user data:', error)
      // 清除本地Token
      localStorage.removeItem('token')
      this.setState({
        isLoading: false,
        error: 'Failed to fetch user data. Please log in again.'
      })
      // window.location.href = '/login';
    }
  }

  fetchOrderData = async () => {
    try {
      const response = await axios.get('http://localhost:3000/riverflow/user/products/', {
        withCredentials: true
      })
      console.log('Fetched order data:', response.data)
      this.setState({
        Order: response.data
      })
    } catch (error) {
      console.error('Error fetching order data:', error)
      this.setState({
        error: 'Failed to fetch order data.'
      })
    }
  }

  // 格式化日期的方法
  formatDate(dateString) {
    // 將日期字符轉換為 Date 
    const date = new Date(dateString)

    // 獲取年、月、日
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0') // 月份從 0 開始
    const day = String(date.getDate()).padStart(2, '0')

    // 格式化為 YYYY/MM/DD
    const formattedDate = `${year}/${month}/${day}`
    console.log('Formatted Date:', formattedDate) // 输出格式化后的日期
    return formattedDate
  }

  // 登出
  Logout = async () => {
    try {
      await axios.get('http://localhost:3000/riverflow/user/logout', {
        withCredentials: true // Cookie
      })
      // 清除本地的 Token
      localStorage.removeItem('token')
      // 重定向到登录页面
      window.location.href = '/login/Index'
    } catch (error) {
      console.error('Error logging out:', error)

    }
  }

  render() {
    const { Users, isLoading, error, showAdditionalOrders } = this.state;

    if (isLoading) {
      return <div>Loading...</div>
    }

    if (error) {
      return <div>{error}</div>
    }

    // 當前日期一個月前的日期
    const oneMonthAgo = new Date()
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)

    // 變更訂單狀態名稱
    const statusMap = {
      已付款: '待出貨',
      pending: '未付款',
      completed: '已完成',
      cancelled: '未完成'
    }
    // 變更付款方式名稱
    const payMethodMap = {
      card: '信用卡',
      bankTransfer: 'AMT',
      cash: '現金付款'
    }

    // 根據訂單篩選，用filter過濾
    const unpaidOrders = this.state.Order.filter((order) => order.orderStatus === '已付款')
    const paymentOrders = this.state.Order.filter((order) => order.orderStatus === 'pending')
    const completedOrders = this.state.Order.filter((order) => order.orderStatus === 'completed')
    const notYetCompletedOrders = this.state.Order.filter((order) => order.orderStatus === 'cancelled')

    // 篩選近一個月的訂單 已完成 ＆ 未完成
    const recentCompletedOrders = completedOrders.filter((order) => new Date(order.createdAt) >= oneMonthAgo)
    const recentnotYetCompletedOrders = notYetCompletedOrders.filter(
      (order) => new Date(order.createdAt) >= oneMonthAgo
    )

    // 根據 showAdditionalOrders 狀態來顯示訂單
    const displayedCompletedOrders = showAdditionalOrders
      ? recentCompletedOrders
      : completedOrders.slice(0, 2);
    const displayedrecentnotYetCompletedOrders = showAdditionalOrders
      ? recentnotYetCompletedOrders
      : notYetCompletedOrders.slice(0, 2);

    // 如果會員沒有照片就使用預設圖片
    const { userImg } = this.state.Users
    const imageSrc = userImg ? require(`../assets/images/users/${userImg}`) : defaultImg

    return (
      <div>
        <Header />

        <div className='OrderList'>
          <div className='nav-box' flex='1'>
            <div className=''>
              <div className='member'>
                <div>
                  <img className='member-img' src={imageSrc} alt='' />
                </div>
                <div className='profile'>
                  <h3>Hey！{this.state.Users.lastName} </h3>
                  <a onClick={this.backMember}>個人資料</a>
                </div>
              </div>
              <div className='nav'>
                <ul>
                  <li>
                    <a onClick={this.backOrderList}>
                      <i className='bi bi-clipboard'></i> 訂單查詢
                    </a>
                  </li>
                  <li>
                    <a onClick={this.backTickets}>
                      <i className='bi bi-ticket-perforated'></i> 活動票券
                    </a>
                  </li>
                  <li>
                    <a onClick={this.backCollection}>
                      <i className='bi bi-heart'></i> 我的最愛
                    </a>
                  </li>
                </ul>
              </div>
              <button className='btn' onClick={this.Logout}>
                會員登出
              </button>
            </div>
          </div>
          <div className='order-box' flex='2'>
            <h3>訂單查詢</h3>
            <div className='btn-box'>
              <button
                className='tablink'
                onClick={(e) => this.openPage('Unpaid', e.currentTarget, '3px solid var(--main)')}
                id='defaultOpen'
              >
                待出貨
              </button>
              <button
                className='tablink'
                onClick={(e) => this.openPage('Payment', e.currentTarget, '3px solid var(--main)')}
              >
                未付款
              </button>
              <button
                className='tablink'
                onClick={(e) => this.openPage('Completed', e.currentTarget, '3px solid var(--main)')}
              >
                已完成
              </button>
              <button
                className='tablink'
                onClick={(e) => this.openPage('NotYetCompleted', e.currentTarget, '3px solid var(--main)')}
              >
                未完成
              </button>
            </div>

            <div id='Unpaid' className='tabcontent'>
              {unpaidOrders.map((order) => (
                <div className='member-order' key={order.orderId}>
                  <div className='member-wrap'>
                    <span>訂單編號：{order.orderId}</span>
                    <button className='orderbtn' onClick={() => this.goOrder(order.orderId)}>
                      訂單明細
                    </button>
                  </div>
                  <table>
                    <thead>
                      <tr>
                        <th>日期</th>
                        <th>總金額</th>
                        <th>付款方式</th>
                        <th>狀態</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{this.formatDate(order.createdAt)}</td>
                        <td>NT${order.totalPrice}</td>
                        <td>{payMethodMap[order.payMethod] || order.payMethod}</td>
                        <td>{statusMap[order.orderStatus] || order.orderStatus}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              ))}
            </div>

            <div id='Payment' className='tabcontent'>
              {paymentOrders.map((order) => (
                <div className='member-order' key={order.orderId}>
                  <div className='member-wrap'>
                    <span>訂單編號：{order.orderId}</span>
                  
                      <button className='orderbtn' onClick={() => this.goOrder(order.orderId)}>
                        訂單明細
                      </button>
                    
                  </div>
                  <table>
                    <thead>
                      <tr>
                        <th>日期</th>
                        <th>總金額</th>
                        <th>付款方式</th>
                        <th>狀態</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{this.formatDate(order.createdAt)}</td>
                        <td>NT${order.totalPrice}</td>
                        <td>{payMethodMap[order.payMethod] || order.payMethod}</td>
                        <td>{statusMap[order.orderStatus] || order.orderStatus}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              ))}
            </div>

            <div id='Completed' className='tabcontent'>
              {displayedCompletedOrders.map((order) => (
                <div className='member-order' key={order.orderId}>
                  <div className='member-wrap'>
                    <span>訂單編號：{order.orderId}</span>
                   
                    <button className='orderbtn' onClick={() => this.goOrder(order.orderId)}>
                        訂單明細
                      </button>
                    
                  </div>
                  <table>
                    <thead>
                      <tr>
                        <th>日期</th>
                        <th>總金額</th>
                        <th>付款方式</th>
                        <th>狀態</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{this.formatDate(order.createdAt)}</td>
                        <td>NT${order.totalPrice}</td>
                        <td>{payMethodMap[order.payMethod] || order.payMethod}</td>
                        <td>{statusMap[order.orderStatus] || order.orderStatus}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              ))}
              <button className='btn' onClick={this.toggleAdditionalOrders}>
                {showAdditionalOrders ? '收起近一個月的訂單' : '顯示近一個月的訂單'}
              </button>
            </div>

            <div id='NotYetCompleted' className='tabcontent'>
              {displayedrecentnotYetCompletedOrders.map((order) => (
                <div className='member-order' key={order.orderId}>
                  <div className='member-wrap'>
                    <span>訂單編號：{order.orderId}</span>
                 
                    <button className='orderbtn' onClick={() => this.goOrder(order.orderId)}>
                        訂單明細
                      </button>
                    
                  </div>
                  <table>
                    <thead>
                      <tr>
                        <th>日期</th>
                        <th>總金額</th>
                        <th>付款方式</th>
                        <th>狀態</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{this.formatDate(order.createdAt)}</td>
                        <td>NT${order.totalPrice}</td>
                        <td>{payMethodMap[order.payMethod] || order.payMethod}</td>
                        <td>{statusMap[order.orderStatus] || order.orderStatus}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              ))}
              <button className='btn' onClick={this.toggleAdditionalOrders}>
                {showAdditionalOrders ? '收起近一個月的訂單' : '顯示近一個月的訂單'}
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  toggleAdditionalOrders = () => {
    this.setState((prevState) => ({
      showAdditionalOrders: !prevState.showAdditionalOrders
    }));
  }

  openPage(pageName, elmnt, border) {
    var i, tabcontent, tablinks
    tabcontent = document.getElementsByClassName('tabcontent')
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = 'none'
    }
    tablinks = document.getElementsByClassName('tablink')
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].style.borderBottom = '3px solid var(--bk2)'
    }
    document.getElementById(pageName).style.display = 'block'
    elmnt.style.borderBottom = border
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.showAdditionalOrders !== prevState.showAdditionalOrders) {
    }
  }

  // 選單按鈕
  backMember = async () => {
    window.location = '/Member/Index'
  }
  backOrderList = async () => {
    window.location = '/Member/OrderList'
  }
  backTickets = async () => {
    window.location = '/Member/Tickets'
  }
  backCollection = async () => {
    window.location = '/Member/Collection'
  }
  goOrder = (orderId) => {
    window.location = `/Member/Order/${orderId}`
  }
}

export default MemberOrderList
