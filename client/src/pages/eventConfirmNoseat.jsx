import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Swal from 'sweetalert2'
import Header from '../components/header'
import Footer from '../components/footer'
import '../assets/event/eventPage3-1.css'

function EventConfirmNoseat() {
  const [event, setEvent] = useState({
    eventId: 1,
    eventName: '默認活動名稱',
    eventDate: new Date(),
    location: '默認地點',
    eventImg: '默認圖片URL',
    ticketType: [
      { type: '全票', price: 300, stock: 100, quantity: 0 },
      { type: '身心障礙票', price: 200, stock: 50, quantity: 0 }
    ]
  })

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const { id } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    if (id) {
      fetchEventDetails(id)
    } else {
      console.error('No ID provided in URL')
      setError('未提供活動ID')
      setLoading(false)
    }
  }, [id])

  const fetchEventDetails = async (eventId) => {
    try {
      const response = await axios.get(`http://localhost:3000/riverflow/events/${eventId}`)
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

  const handleQuantityChange = (ticketType, change) => {
    setEvent((prevEvent) => {
      const updatedTicketType = prevEvent.ticketType.map((ticket) => {
        if (ticket.type === ticketType) {
          const currentQuantity = ticket.quantity || 0
          const currentStock = ticket.stock
          const maxAllowedPurchase = 4

          let newQuantity = Math.max(0, Math.min(maxAllowedPurchase, currentQuantity + change))

          if (currentStock - (newQuantity - currentQuantity) < 0) {
            newQuantity = currentQuantity + currentStock
          }

          return {
            ...ticket,
            quantity: newQuantity,
            stock: currentStock - (newQuantity - currentQuantity)
          }
        }
        return ticket
      })

      const selectedTicket = updatedTicketType.find((ticket) => ticket.type === ticketType)
      if (selectedTicket.quantity > 0) {
        updatedTicketType.forEach((ticket) => {
          if (ticket.type !== ticketType) {
            ticket.stock += ticket.quantity || 0
            ticket.quantity = 0
          }
        })
      }

      return { ...prevEvent, ticketType: updatedTicketType }
    })
  }

  const handleNextStep = () => {
    window.scrollTo(0, 0);
    const selectedTickets = event.ticketType
      .filter((ticket) => ticket.quantity > 0)
      .map((ticket) => ({
        type: ticket.type,
        area: '一般票',
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
            eventSeat: event.seat
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

  if (loading) return <div>載入中...</div>
  if (error) return <div>錯誤: {error}</div>

  return (
    <div className='w-bg scrollCust'>
      <Header />
      <div className='framWrap'>
        {/* 活動明細 */}
        <div className='eventName'>
          <div className='eventImg'>
            <img src={`/images/events/${event.coverImg}`} alt={event.eventName} />
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
              <span>選擇票種</span>
            </div>
            <p></p>
          </div>

          <div className='ticketOrder'>
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
            <h3>選擇票種</h3>
          </div>
          {event.ticketType.map((ticket) => (
            <div key={ticket.type} className='ticketMan'>
              <div>
                <span>{ticket.type}</span>
                <span>剩餘</span>
                <span>{ticket.stock}</span>
              </div>
              <div>
                <p>NT${ticket.price}</p>
              </div>
              <div className='ticketNumber'>
                <button className='decrement' onClick={() => handleQuantityChange(ticket.type, -1)}>
                  <i className='fa-solid fa-circle-minus'></i>
                </button>
                <p>{ticket.quantity || 0}</p>
                <button className='increment' onClick={() => handleQuantityChange(ticket.type, 1)}>
                  <i className='fa-solid fa-circle-plus'></i>
                </button>
              </div>
              <div className='ticketMiddle'>
                <p></p>
              </div>
            </div>
          ))}
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

export default EventConfirmNoseat
