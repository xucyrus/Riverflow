import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../../src/assets/basic.css';
import '../../src/assets/event/eventPage4.css';
import Header from '../components/header'
import Footer from '../components/footer'

const EventConfirmInfo = () => {
  const location = useLocation();
  const navigate = useNavigate();
    const [eventDetails, setEventDetails] = useState({
      eventImg: "",
        title: "",
        date: "",
        time: "",
        location: ""
      });
    
      const [tickets, setTickets] = useState([]);
    
      useEffect(() => {
        if (location.state) {
          const { eventDetails, selectedTickets } = location.state;
          setEventDetails({
            id: eventDetails.eventId,
            image: eventDetails.eventImg,
            title: eventDetails.eventName,
            date: new Date(eventDetails.eventDate).toLocaleDateString(),
            time: new Date(eventDetails.eventDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            location: eventDetails.location,
            seat: eventDetails.eventSeat
          });
          console.log('selectedTickets : ',selectedTickets)
          const expandedTickets = selectedTickets.flatMap(ticket => 
            Array(ticket.quantity).fill().map(() => ({
              totalquantity: ticket.quantity,
              quantity: 1,
              area: ticket.area,
              type: ticket.type,
              price: ticket.price
            }))
          );
          console.log('expandedTickets : ',expandedTickets)
          setTickets(expandedTickets);
        }
      }, [location]);
    
      const totalTickets = tickets.length;
  const totalCost = tickets.reduce((sum, ticket) => sum + ticket.price, 0);
  
  const handleNextStep = () => {
    
    window.scrollTo(0, 0);
    navigate('/Event/Order', {
      state: {
        eventDetails,
        tickets,
        totalTickets,
        totalCost
      }
    });
  };
    
      return (
        <div className="w-bg">
          <Header />
          <div className="framWrap">
            <div className="header"><img src="../../src/assets/images/indexImg/nav.jpg" alt="" /></div>
    
            <div className="eventName">
              <div className="eventImg">
                <img src={eventDetails.image} alt={eventDetails.title} />
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
                <div><span>1</span></div>
                <div><span>選擇票區</span></div>
                <p></p>
              </div>
              <div className="ticketOrder">
                <div className="ticketOrder2"><span>2</span></div>
                <div><span>確認明細</span></div>
                <p></p>
              </div>
              <div className="ticketOrder">
                <div><span>3</span></div>
                <div><span>確認資料</span></div>
                <p></p>
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
            <button onClick={handleNextStep}>下一步</button>
            </div>
          </div>
          <Footer/>
        </div>
      );
    };

export default EventConfirmInfo;
