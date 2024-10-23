import React, { Component } from 'react'
import '../assets/member.css'
import axios from 'axios'
import Header from '../components/header'
import Footer from '../components/footer'
import defaultImg from '../assets/images/defaultphoto.jpg' // 預設會員圖片
import { useParams, useNavigate, useLocation } from 'react-router-dom'

// 這是是因為orderId所需的程式碼

function withRouter(Component) {
  return function (props) {
    const params = useParams() 
    const navigate = useNavigate() 
    const location = useLocation() 
    return <Component {...props} params={params} navigate={navigate} location={location} />
  }
}

class MemberOrder extends Component {
  state = {
    Users: {
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      birth: '',
      sex: ''
    },
    Order: [
      // 去看資料庫怎麼寫!
      { orderId: '', createdAt: '', payMethod: '', totalPrice: '', orderStatus: '' }
    ],
    OrderList: [
      // 去看資料庫怎麼寫!
      { orderId: '', createdAt: '', payMethod: '', totalPrice: '', orderStatus: '' }
    ],

    isLoading: true, 
    error: null, 
    showAdditionalOrders: false,
    activeAccordion: null,
  }
  componentDidMount() {
    this.fetchUserData()
    this.fetchOrderListData()
    const { params } = this.props

    if (params && params.id) {
      this.fetchOrderData(params.id)
    } else {
      console.error('params or params.id is undefined')
    }

    document.getElementById('defaultOpen')?.click();
  }

  fetchUserData = async () => {
    try {
      const response = await axios.get('http://localhost:3000/riverflow/user', {
        withCredentials: true //保持 Cookie
      })
      console.log('Fetched user data:', response.data) 
      this.setState({
        Users: response.data,
        isLoading: false
      })
    } catch (error) {
      console.error('Error fetching user data:', error)
      // 清除本地的 Token
      localStorage.removeItem('token')
      this.setState({
        isLoading: false,
        error: 'Failed to fetch user data. Please log in again.'
      })
      // window.location.href = '/login';
    }
  }
  // OrderList 訂單查詢
  fetchOrderListData = async () => {
    try {
      const response = await axios.get('http://localhost:3000/riverflow/user/products/', {
        withCredentials: true
      })
      console.log('Fetched orderList data:', response.data)
      this.setState({
        OrderList: response.data
      })
    } catch (error) {
      console.error('Error fetching order data:', error)
      this.setState({
        error: 'Failed to fetch order data.'
      })
    }
  }
  // 單個詳細訂單
  fetchOrderData = async (id) => {
    try {
      const response = await axios.get(`http://localhost:3000/riverflow/user/products/${id}`, {
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
    console.log('Fetching order data for ID:', id)
  }

  // 格式化日期的方法
  formatDate(dateString) {
    // 將日期字符串轉換為 Date
    const date = new Date(dateString)

    // 獲取年、月、日
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0') // 月份從 0 開始
    const day = String(date.getDate()).padStart(2, '0')

    // 格式化為 YYYY/MM/DD
    const formattedDate = `${year}/${month}/${day}`
    console.log('Formatted Date:', formattedDate) // 輸出格式化後的日期
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
    const { Order, isLoading, error , showAdditionalOrders} = this.state
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

    // 變更寄送方式名稱
    const shipMethodMap = {
      '7-11': '7-11',
      OKMart: 'OKMart',
      FamilyMart: 'FamilyMart',
      delivery: '宅配'
    }

    // 根據訂單篩選，用filter過濾
    // const unpaidOrders = this.state.Order.filter(order => order.orderStatus === 'processing');
    const paymentOrders = this.state.OrderList.filter((order) => order.orderStatus === 'pending')
    const completedOrders = this.state.OrderList.filter((order) => order.orderStatus === 'completed')
    const notYetCompletedOrders = this.state.OrderList.filter((order) => order.orderStatus === 'cancelled')

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
        <div className='Order'>
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
              <button className='tablink' onClick={this.backOrderList}>
                待出貨
              </button>
              <button
                className='tablink'
                style={{ display: 'none' }}
                onClick={(e) => this.openPage('Unpaid', e.currentTarget, '3px solid var(--main)')}
                id='defaultOpen'
              ></button>
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
              {/* {this.state.Order.map((order, index) => */}
              <div className='member-order' key={this.state.Order.orderId}>
                <div className='member-wrap'>
                  <span>訂單編號：{this.state.Order.orderId}</span>
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
                      <td>{this.formatDate(this.state.Order.createdAt)}</td>
                      <td>NT${this.state.Order.totalPrice}</td>
                      <td>{payMethodMap[this.state.Order.payMethod] || this.state.Order.payMethod}</td>
                      <td>{statusMap[this.state.Order.orderStatus] || this.state.Order.orderStatus}</td>
                    </tr>
                  </tbody>
                </table>

                <div className='accordion'>
                  <div
                    className={`container ${this.state.activeAccordion === this.state.Order.orderId ? 'active' : ''}`}
                  >
                    <div className='label' onClick={() => this.toggleAccordion(this.state.Order.orderId)}>
                      收件人資訊
                    </div>

                    <div className='member-content'>
                      <span>
                        收件人：{this.state.Users.firstName}
                        {this.state.Users.lastName}
                      </span>
                      <br />
                      <span>聯絡電話：{this.state.Users.phone}</span>
                      <br />
                      <span>寄送方式：{shipMethodMap[Order.shipMethod] || Order.shipMethod}</span>
                      <br />
                      <span>收件地址：{Order.shipMethod === 'delivery' ? Order.rcptAddr : Order.convAddr}</span>
                      <br />
                    </div>
                  </div>
                  <table>
                    <thead>
                      <tr>
                        <th colspan='2'>商品名稱</th>
                        <th>數量</th>
                        <th></th>
                        <th>小計</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.isArray(Order.orderItem) && Order.orderItem.length > 0 ? (
                        Order.orderItem.map((productItem, index) => (
                          <tr key={index}>
                            <td colSpan='2'>
                              {productItem.productName} / {productItem.productOpt}
                            </td>
                            <td>{productItem.quantity}</td>
                            <td></td>
                            <td>{productItem.price}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan='5'>沒有訂單項目</td>
                        </tr>
                      )}

                      <tr style={{ borderBottom: '0.5px solid var(--main)' }}>
                        <td colspan='2'>運費</td>
                        <td></td>
                        <td></td>
                        <td>$60</td>
                      </tr>

                      <tr>
                        <td colspan='2' style={{ fontWeight: 'bold' }}>
                          應付金額
                        </td>
                        <td></td>
                        <td></td>
                        <td style={{ fontWeight: 'bold' }}>${Order.totalPrice}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              {/* )} */}
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
        <Footer/>
      </div>
    )
  }

  toggleAccordion = (orderId) => {
    this.setState((prevState) => ({
      activeAccordion: prevState.activeAccordion === orderId ? null : orderId
    }))
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

  componentDidUpdate(prevProps, prevState)  {
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

export default withRouter(MemberOrder)
