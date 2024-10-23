import React, { useState, useEffect } from 'react' // 使用 React Hooks
import '../assets/event/eventPage3-2.css'
import { Link, useParams, useNavigate } from 'react-router-dom' // 使用 v6 的 hooks
import yitaiImg from '../assets/images/events/event-yitai.jpg'
import seatImg from '../assets/images/ticketSeat.png'
import $ from 'jquery'
import axios from 'axios'
import Header from '../components/header'
import Footer from '../components/footer'
import Swal from 'sweetalert2'

function EventConfirmSeat() {
  const [event, setEvent] = useState({
    eventId: 1,
    eventType: 'DJ',
    eventName: '星空下的電音狂歡 <頂尖DJ戶外派對>',
    eventDesc:
      '準備好迎接一個難忘的夜晚吧！熱血派對夜將帶給你一場無與倫比的DJ戶外音樂盛宴。這次活動將在台北市市民廣場盛大舉行，這裡擁有開闊的空間和絕佳的音響效果，讓你在星空下盡情舞動，感受音樂的無限魅力。\n現場將設有一個巨型舞台，配備最先進的音響設備和炫酷的燈光效果，確保每一位參加者都能享受到頂級的音樂體驗。我們精心挑選了多位頂尖DJ，他們將帶來一系列高能量的電子音樂，從節奏強烈的電音到充滿律動感的混音，讓你在音樂的海洋中徹底釋放自我。\n除了音樂之外，活動現場還設有多個主題區域，包括美食區、飲品區和互動遊戲區。你可以在這裡品嚐到來自各地的美食，享受各種精選飲品，並參加趣味橫生的互動遊戲，贏取豐富獎品。\n現場還將設有專業的攝影團隊，捕捉每一個精彩瞬間，讓你留下最美好的回憶。我們還準備了多種派對小道具，如螢光棒、面具和飾品，讓你可以自由搭配，打造屬於自己的獨特造型。\n這次活動不僅是一場音樂派對，更是一個交友的平台。你將有機會結識來自不同地方、擁有共同興趣的朋友，一起分享對音樂的熱愛，共同創造美好的回憶。',
    eventDate: '2024-08-14T11:30:00.000Z',
    location: '台北市中山區濱江街5號',
    seat: 0,
    ticketType: [
      { type: '1F搖滾區', price: 2900, stock: 30 },
      { type: '2F座席區', price: 2300, stock: 100 },
      { type: '2F站席區', price: 2300, stock: 100 },
      { type: '1F身障區', price: 1190, stock: 100 }
    ],
    launchDate: '2024-07-25T12:00:00.000Z',
    launchStatus: 1,
    saleDate: '2024-08-07T07:00:00.000Z',
    coverImg: 'event-yitai.jpg',
    eventAnoc:
      '若信用卡刷卡付款失敗，會將刷卡失敗的訂單，陸續轉為【ATM虛擬帳號付款】，屆時請依的訂單顯示之「銀行帳號」、「銀行代碼」於「匯款期限」內完成付款，系統將以款項實際入帳時間為準，請於繳費後一小時至我的訂單確認，若訂單付款狀態顯示為「待繳費」，須等待銀行回傳付款狀態；若逾期未付款，系統收到銀行回傳付款狀態後將自動取消該筆訂單並顯示「付款失敗」，各家銀行轉帳入帳時間不同，請盡早繳款以保障您的權益。'
  })

  const [openTicketType, setOpenTicketType] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const { id } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    setupJQuery()
    // console.log('Component mounted. Event ID:', id);
    if (id) {
      fetchEventDetails(id)
    } else {
      console.error('No ID provided in URL')
      setError('未提供活動ID')
      setLoading(false)
    }
  }, [id])

  const setupJQuery = () => {
    $('.seatName')
      .off('click')
      .on('click', function (e) {
        const $clickedTicketName = $(this).next('.ticketName')
        $clickedTicketName.slideToggle()
        $('.ticketName').not($clickedTicketName).slideUp()
      })
  }

  const fetchEventDetails = async (eventId) => {
    try {
      // console.log('Fetching event details for ID:', eventId);
      const response = await axios.get(`http://localhost:3000/riverflow/events/${eventId}`)
      console.log('API Response:', response.data)
      if (response.data && response.data.length > 0) {
        const eventData = response.data[0]
        if (typeof eventData.ticketType === 'string') {
          try {
            eventData.ticketType = JSON.parse(eventData.ticketType)
          } catch (parseError) {
            console.error('解析 ticketType 時發生錯誤：', parseError)
            eventData.ticketType = []
          }
        }
        eventData.ticketType = Array.isArray(eventData.ticketType) ? eventData.ticketType : []
        setEvent(eventData)
        setLoading(false)
      } else {
        throw new Error('No event data received')
      }
    } catch (error) {
      console.error('獲取活動詳情時出錯：', error)
      setLoading(false)
      setError('無法獲取活動詳情')
      setEvent((prevEvent) => ({ ...prevEvent, ticketType: [] }))
    }
  }

  const toggleTicket = (ticketType) => {
    console.log('toggleTicket', ticketType)
    setOpenTicketType((prevType) => {
      prevType === ticketType ? null : ticketType
    })
  }

  //  購買票數上限為4張
  const handleQuantityChange = (ticketType, change) => {
    setEvent((prevEvent) => {
      const updatedTicketType = prevEvent.ticketType.map((ticket) => {
        if (ticket.type === ticketType) {
          const currentQuantity = ticket.quantity || 0;
          const currentStock = ticket.stock;
          const maxAllowedPurchase = 4;
  
          // 計算新的數量，但不立即應用庫存限制
          let newQuantity = Math.max(0, currentQuantity + change);
  
          // 如果新數量超過最大允許購買數，則限制在最大允許購買數
          if (newQuantity > maxAllowedPurchase) {
            newQuantity = maxAllowedPurchase;
          }
  
          // 計算實際變化量
          const actualChange = newQuantity - currentQuantity;
  
          // 檢查庫存是否足夠
          if (currentStock - actualChange < 0) {
            // 如果庫存不足，則將新數量設置為當前庫存量
            newQuantity = currentStock;
          }
  
          // console.log(`票券類型: ${ticketType}, 當前數量: ${currentQuantity}, 新數量: ${newQuantity}, 當前庫存: ${currentStock}`);
  
          return {
            ...ticket,
            quantity: newQuantity,
            stock: currentStock - (newQuantity - currentQuantity)
          };
        }
        return ticket
      })

      // 如果購買的數量大於 0，將其他票券的數量重置為 0
      const selectedTicket = updatedTicketType.find((ticket) => ticket.type === ticketType)
      if (selectedTicket.quantity > 0) {
        updatedTicketType.forEach((ticket) => {
          if (ticket.type !== ticketType) {
            //  庫存歸還
            ticket.stock += ticket.quantity || 0
            ticket.quantity = 0
          }
        })
      }

      return { ...prevEvent, ticketType: updatedTicketType }
    })
  }
  // 存取資料到下一頁
  const handleNextStep = () => {
    window.scrollTo(0, 0);
    const selectedTickets = event.ticketType
      .filter((ticket) => ticket.quantity > 0)
      .map((ticket) => ({
        type: ticket.type,
        area: '一般票', // 固定為 "一般票"
        price: ticket.price,
        quantity: ticket.quantity
      }))

    if (selectedTickets.length > 0) {
      navigate('/Event/ConfirmInfo', {
        state: {
          selectedTickets,
          eventDetails: {
            eventId: event.eventId,
            eventName: event.eventName,
            eventDate: event.eventDate,
            location: event.location,
            eventImg: `/images/events/${event.coverImg}`,
            
          }
        }
      })
    } else {
      Swal.fire({
        title: '錯誤',
        text: '請至少選擇一張票',
        icon: 'error',
        confirmButtonColor: '#98d900',
        timer: 3000,
        timerProgressBar: true
      })
    }
  }

  return (
    <div className='w-bg scrollCust'>
      <Header />
      <div className='framWrap'>
        {/* 活動明細 */}
        <div className='eventName'>
          <div className='eventImg'>
            <img src={`/images/events/${event.coverImg}`} alt='' />
          </div>
          <div className='eventTitle'>
            <h1>{event.eventName}</h1>
            <p>日期：{new Date(event.eventDate).toLocaleDateString()}</p>
            <p>時間：{new Date(event.eventDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            <p>場次地點：{event.location}</p>
          </div>
        </div>

        {/* 中間的線 */}
        <div className='middleLine'>
          <p></p>
        </div>

        {/* 購買順序 */}
        <div className='order'>
          <div className='ticketOrder'>
            <div className='ticketOrder1'>
              <span>1</span>
            </div>
            <div>
              <span>選擇票區</span>
            </div>
            <p></p>
          </div>

          <div class='ticketOrder'>
            <div>
              <span>2</span>
            </div>
            <div>
              <span>確認明細</span>
            </div>
            <p></p>
          </div>

          <div className='ticketOrder'>
            <div>
              <span>3</span>
            </div>
            <div>
              <span>確認資料</span>
            </div>
            <p></p>
          </div>
        </div>

        {/* 選擇票種數量 */}
        <div className='ticketChoose'>
          <div className='ticketText'>
            <h3>票區一覽</h3>
          </div>
          {/* 選擇票種 */}
          <div className='ticketSeat'>
            <div className='seatImage'>
              <img src={seatImg} alt='' />
            </div>

            <div className='seat'>
              {event.ticketType.map((ticket, index) => (
                <div key={ticket.type} className={`${['first', 'second', 'third', 'forth'][index]}Floor`}>
                  <div className='seatName' onClick={() => toggleTicket(ticket.type)}>
                    <div>
                      <span>{ticket.type}</span>
                      <div>
                        <span>剩餘</span>
                        <span id={`remaining${ticket.type}`}>{ticket.stock}</span>
                      </div>
                    </div>
                    <div>
                      <span>NT${ticket.price}</span>
                    </div>
                  </div>
                  <div className={`ticketName ${openTicketType === ticket.type ? 'active' : ''}`}>
                    <div className='ticketCotent'>
                      <div>
                        <span>一般票</span>
                      </div>
                      <div className='ticketBtn'>
                        <button
                          className='decrement'
                          onClick={() => handleQuantityChange(ticket.type, -1)}
                          data-target={`#quantity${ticket.type}`}
                          data-remaining={`#remaining${ticket.type}`}
                        >
                          <i className='fa-solid fa-circle-minus'></i>
                        </button>
                        <span id={`quantity${ticket.type}`}>{ticket.quantity || 0}</span>
                        <button
                          className='increment'
                          onClick={() => handleQuantityChange(ticket.type, 1)}
                          data-target={`#quantity${ticket.type}`}
                          data-remaining={`#remaining${ticket.type}`}
                        >
                          <i className='fa-solid fa-circle-plus'></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* 下一步按鍵 */}
        <div className='nextBtn'>
          <button onClick={handleNextStep}>下一步</button>
        </div>
      </div>
      <Footer/>
    </div>
  )
}

export default EventConfirmSeat
