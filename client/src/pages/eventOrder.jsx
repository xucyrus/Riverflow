import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import '../assets/event/eventPage5.css'  // 修正 CSS 文件的路徑
import Header from '../components/header' 
import Footer from '../components/footer'
import Swal from 'sweetalert2'
import axios from 'axios'



const EventOrder = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [eventDetails, setEventDetails] = useState({})
  const [tickets, setTickets] = useState([])
  const [totalTickets, setTotalTickets] = useState(0)
  const [totalCost, setTotalCost] = useState(0)
  const [contactName, setContactName] = useState('林小美')
  const [contactEmail, setContactEmail] = useState('linxiaomei015@gmail.com')
  const [contactPhone, setContactPhone] = useState('0912345121')
  const [ibonSelected, setIbonSelected] = useState(false)
  const [creditCardSelected, setCreditCardSelected] = useState(false)
  const [otherMethodSelected, setOtherMethodSelected] = useState(false);

  useEffect(() => {
    if (location.state) {
      const { eventDetails, tickets, totalTickets, totalCost } = location.state
      setEventDetails(eventDetails)
      setTickets(tickets)
      setTotalTickets(totalTickets)
      setTotalCost(totalCost)
    }
  }, [location])

  const handleNextStep = async (e) => {
    e.preventDefault()
    
    // 根據後端 API 要求格式化數據
    const consolidatedTickets = tickets.reduce((acc, ticket) => {
      const existingTicket = acc.find(t => t.type === ticket.type && t.area === ticket.area);
      if (existingTicket) {
        existingTicket.quantity += ticket.quantity;
        existingTicket.price += ticket.price;
      } else {
        acc.push({...ticket});
      }
      return acc;
    }, []);

    const event = {
      eventId: eventDetails.id,
      eventName: eventDetails.title,
      eventDesc: `${eventDetails.date} ${eventDetails.time} 於 ${eventDetails.location}`,
      ticketType: consolidatedTickets.map(ticket => ({
        type: ticket.type,
        quantity: ticket.quantity,
        totalquantity: ticket.totalquantity,
        price: ticket.price
      }))
    }
    console.log('orderData :',event);
    try {
      // 創建 Stripe 結帳會話
      const stripeResponse = await axios.post('http://localhost:3000/riverflow/pay/create-event-checkout-session', event,
        {
          withCredentials: true // 確保發送 cookies
        }
      )

      if (stripeResponse.data.url) {
        // 如果成功，將用戶重定向到 Stripe 結帳 URL
        Swal.fire({
          title: '前往付款中',
          icon: 'info',
          confirmButtonColor: '#98d900',
          timer: 1500,
          timerProgressBar: true,
          // 跳轉頁面
          willClose: () => {
              window.location.href = stripeResponse.data.url
          }
      })
        
      } else {
        throw new Error('無法創建 Stripe 結帳會話')
      }
    } catch (error) {
      console.error('處理訂單時發生錯誤:', error)
      Swal.fire({
        title: '錯誤',
        text: '處理您的訂單時發生錯誤。請再試一次。',
        icon: 'error',
        confirmButtonColor: '#98d900',
        timer: 3000,
        timerProgressBar: true
      })
    }
  }

  const isNextStepEnabled = contactName && contactEmail && contactPhone && (ibonSelected || creditCardSelected)

  return (
    <div className="w-bg scrollCust">
    <Header />
    <div className="framWrap container">
      
      <div className="header">
        <img src="/assets/images/indexImgnav.jpg" alt="" />  {/* 修正圖片路徑 */}
      </div>

      <div className="eventName">
        <div className="eventImg">
          <img src={eventDetails.image} alt="" />
        </div>
        <div className="eventTitle">
          <h1>{eventDetails.title}</h1>
          <p>日期：{eventDetails.date}</p>
          <p>時間：{eventDetails.time}</p>
          <p>場次地點：{eventDetails.location}</p>
        </div>
      </div>

      <div className="middleLine">
        <p></p>
      </div>

      <div className="order">
        <div className="ticketOrder">
          <div>
            <span>1</span>
          </div>
          <div>
            <span>選擇票區</span>
          </div>
          <p></p>
        </div>
        <div className="ticketOrder">
          <div>
            <span>2</span>
          </div>
          <div>
            <span>確認明細</span>
          </div>
          <p></p>
        </div>
        <div className="ticketOrder">
          <div className="ticketOrder3">
            <span>3</span>
          </div>
          <div>
            <span>確認資料</span>
          </div>
          <p></p>
        </div>
      </div>

      <div className="ticketChoose">
        <div className="ticketText">
          <h3>聯絡人資訊</h3>
        </div>
        <div className="contact">
          <div></div>
          <div>
            <div>
              <label htmlFor="contactName">顧客姓名</label>
              <br />
              <input
                type="text"
                id="contactName"
                name="contactName"
                placeholder="請輸入姓名"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="contactEmail">電子信箱</label>
              <br />
              <input
                type="text"
                id="contactEmail"
                name="contactEmail"
                placeholder="請輸入電子信箱"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="contactPhone">電話號碼</label>
              <br />
              <input
                type="text"
                id="contactPhone"
                name="contactPhone"
                placeholder="請輸入電話號碼"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
              />
            </div>
          </div>
          <div></div>
        </div>
      </div>

      <div className="ticketChoose">
        <div className="ticketText">
          <h3>取票方式</h3>
        </div>
        <div className="ticketTake">
    <div className="takeTitle">
      <label htmlFor="fee-ibon">
        <input
          type="radio"
          name="fee"
          id="fee-ibon"
          checked={ibonSelected}
          onChange={() => {
            setIbonSelected(true);
            setOtherMethodSelected(false);
          }}
        />
        <div>
          <p>ibon</p>
          <p>取票時，酌收30元手續費</p>
        </div>
      </label>
    </div>
    <div className="takeTitle">
      <label htmlFor="fee-other">
        <input
          type="radio"
          name="fee"
          id="fee-other"
          checked={otherMethodSelected}
          onChange={() => {
            setOtherMethodSelected(true);
            setIbonSelected(false);
          }}
        />
        <div>
          <p>現場取票</p>
          <p>依照現場情況，排隊取票</p>
        </div>
      </label>
    </div>
  </div>
      </div>

      <div className="ticketChoose">
        <div className="ticketText">
          <h3>付款方式</h3>
        </div>
        <div className="ticketTake">
          <div className="takeTitle">
            <label htmlFor="credit">
              <input
                type="radio"
                name="credit"
                id="credit"
                checked={creditCardSelected}
                onChange={() => setCreditCardSelected(!creditCardSelected)}
              />
              <div>
                <p>信用卡線上支付</p>
              </div>
            </label>
          </div>
        </div>
      </div>

      <div className="ticketChoose">
        <div className="ticketText">
          <h3>購票明細</h3>
        </div>
        <div className="ticketDetail">
          <div>
            <p></p>
          </div>
          <div className="contentTitle">
            <div>
              <span>票區</span>
            </div>
            <div>
              <span>票種</span>
            </div>
            <div>
              <span>金額</span>
            </div>
          </div>
          <div>
            <p></p>
          </div>
          {tickets.map((ticket, index) => (
            <React.Fragment key={index}>
              <div className="contentTitle">
                <div>
                  <span>{eventDetails.seat !== 0 ? ticket.type : '無'}</span>
                </div>
                <div>
                  <span>{eventDetails.seat !== 0 ? ticket.area : ticket.type}</span>
                </div>
                <div>
                  <span>NT${ticket.price}</span>
                </div>
              </div>
              <div>
                <p></p>
              </div>
            </React.Fragment>
          ))}
          <div className="cost">
            <div></div>
            <div>
              <span>共</span>
              <span>{totalTickets}</span>
              <span>張</span>
            </div>
            <div>
              <span>合計</span>
              <span>NT${totalCost}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="nextBtn">
        <button className="nextStep" id="nextStep" disabled={!isNextStepEnabled} onClick={handleNextStep}>
          下一步
        </button>
      </div>
    </div>
    <Footer/>
    </div>
  )
}

export default EventOrder