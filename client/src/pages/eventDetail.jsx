import React, { useState, useEffect } from 'react' // 修改：使用 React Hooks
import { Link, useParams, useNavigate } from 'react-router-dom' // 修改：移除 withRouter，添加 useParams
import axios from 'axios'
import '../assets/event/eventPage2.css'
import '../utils/eventDetail.js'
import Header from '../components/header'
import Footer from '../components/footer'
import CKEditorContent from '../components/CKEditorContent';
import '../assets/ckeditor-content-styles.css'

function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // 修改：使用 useState 鉤子管理狀態
  const [event, setEvent] = useState({
    eventId: 1,
    eventType: 'DJ',
    eventName: '星空下的電音狂歡 <頂尖DJ戶外派對>',
    eventDesc: '準備好迎接一個難忘的夜晚吧！熱血派對夜將帶給你一場無與倫比的DJ戶外音樂盛宴。這次活動將在台北市市民廣場盛大舉行，這裡擁有開闊的空間和絕佳的音響效果，讓你在星空下盡情舞動，感受音樂的無限魅力。\n現場將設有一個巨型舞台，配備最先進的音響設備和炫酷的燈光效果，確保每一位參加者都能享受到頂級的音樂體驗。我們精心挑選了多位頂尖DJ，他們將帶來一系列高能量的電子音樂，從節奏強烈的電音到充滿律動感的混音，讓你在音樂的海洋中徹底釋放自我。\n除了音樂之外，活動現場還設有多個主題區域，包括美食區、飲品區和互動遊戲區。你可以在這裡品嚐到來自各地的美食，享受各種精選飲品，並參加趣味橫生的互動遊戲，贏取豐富獎品。\n現場還將設有專業的攝影團隊，捕捉每一個精彩瞬間，讓你留下最美好的回憶。我們還準備了多種派對小道具，如螢光棒、面具和飾品，讓你可以自由搭配，打造屬於自己的獨特造型。\n這次活動不僅是一場音樂派對，更是一個交友的平台。你將有機會結識來自不同地方、擁有共同興趣的朋友，一起分享對音樂的熱愛，共同創造美好的回憶。',
    eventDate: '2024-08-14T11:30:00.000Z',
    location: '台北市中山區濱江街5號',
    seat: 0,
    ticketType: [
      { "type": "1F搖滾區", "price": 2900, "stock": 30 }, 
      { "type": "2F座席區", "price": 2300, "stock": 100 },
      { "type": "2F站席區", "price": 2300, "stock": 100 },
      { "type": "1F身障區", "price": 1190, "stock": 100 }
    ],
    launchDate: '2024-07-25T12:00:00.000Z',
    launchStatus: 1,
    saleDate: '2024-08-07T07:00:00.000Z',
    coverImg: 'event-yitai.jpg',
    eventAnoc: '若信用卡刷卡付款失敗，會將刷卡失敗的訂單，陸續轉為【ATM虛擬帳號付款】，屆時請依的訂單顯示之「銀行帳號」、「銀行代碼」於「匯款期限」內完成付款，系統將以款項實際入帳時間為準，請於繳費後一小時至我的訂單確認，若訂單付款狀態顯示為「待繳費」，須等待銀行回傳付款狀態；若逾期未付款，系統收到銀行回傳付款狀態後將自動取消該筆訂單並顯示「付款失敗」，各家銀行轉帳入帳時間不同，請盡早繳款以保障您的權益。'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 修改：使用 useEffect 鉤子替代 componentDidMount
  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/riverflow/events/${id}`)
        console.log('response.data:', response.data)
        const eventData = response.data[0];
        setEvent(eventData);
        setLoading(false);
      } catch (error) {
        console.error('獲取活動詳情時出錯：', error);
        setLoading(false);
        setError('獲取活動詳情時出錯');
      }
    };

    fetchEventDetails();
  }, [id]);

  
  const handleBuyTicket = () => {
    window.scrollTo(0, 0);
    if (event.seat === 0) {
      navigate(`/Event/ConfirmNoseat/${event.eventId}`);
    } else if (event.seat === 1) {
      navigate(`/Event/ConfirmSeat/${event.eventId}`);
    } else {
      // 如果 seat 不是 0 或 1，可以顯示錯誤消息
      setError('無效的座位狀態');
    }
  }


    // 新增：加載中和錯誤處理
    if (loading) return <div>載入中...</div>
    if (error) return <div>{error}</div>

    return (
      <div class="w-bg scrollCust">
        <Header />
        <div class="container framWrap">
          <div class="header">
            <img src="" alt="" />
          </div>

          {/* <!-- 活動詳細頁面-首圖 --> */}
          <div class="headerImage">
            <img src={`/images/events/${event.coverImg}`} alt={event.eventName} />
          </div>
          {/* <!-- 活動詳細頁面-標題 --> */}
          <div class="detailEventTitle">
            <h1>{event.eventName}</h1>
            <p>[最新公告]</p>
            <p>如尚未加入會員,請於售票前完成加入並完成驗證,以免影響自身權益（請勿售票當天加入會員）</p>
            <p>{event.eventAnoc}</p>
          </div>
          {/* <!-- 活動詳細頁面-選單 --> */}
          <div class="eventBar">
            <div>
              <a href="#buyNow">立即購買</a>
            </div>
            <div>
              <a href="#eventIntroduce">活動介紹</a>
            </div>
            <div>
              <a href="#eventCaution">注意事項</a>
            </div>
            <div>
              <a href="#eventRemind">購買提醒</a>
            </div>
            <div>
              <a href="#eventTicket">取票方式</a>
            </div>
            <div>
              <a href="#eventRefund">退票規定</a>
            </div>
          </div>
          {/* <!-- 選單-立即購買 --> */}
          <div class="buyNow" id="buyNow">
            <p>立即購買</p>
            <div>
              <div class="buyTitle">
                <div>場次名稱</div>
                <div>場次日期</div>
                <div>場次時間</div>
                <div>場次地點</div>
                <div>售票狀態</div>
              </div>
              <div class="buyItem">
                <div>{event.eventName}</div>
                <div>{new Date(event.eventDate).toLocaleDateString()}</div>
                <div>{new Date(event.eventDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                <div>{event.location}</div>
                <div>
                <button className="buyNowBtn" onClick={handleBuyTicket}>立即購買</button>
                </div>
              </div>
            </div>
          </div>
          {/* <!-- 選單-活動介紹 --> */}
          <div class="eventIntroduce" id="eventIntroduce">
            <p>活動介紹</p>
            <div class="introduceImage">
              {/* <img src={`/images/events/${event.coverImg}`} alt={event.eventName} /> */}
            </div>
            {/* 改成用文字編輯器顯示 */}
            <CKEditorContent content={event.eventDesc} />
            {/* <p>活動簡介</p> */}
            {/* <p>{event.eventDesc}</p> */}
            {/* <p dangerouslySetInnerHTML={{ __html: event.eventDesc }} /> */}
          </div>
          {/* <!-- 選單-注意事項 --> */}
          <div class="eventCaution" id="eventCaution">
            <p class="eventCautionTitle">注意事項</p>
            <ol>
              <li>
                <p>
                  消費者須以真實姓名、手機號碼購票及填寫有效個人資訊，如以虛假訊息填寫個人資料購買票券已經涉及「偽造私文書罪」，主辦單位及Riverflow售票皆有權利立即取消該消費者訂單，請勿以身試法！
                </p>
              </li>
              <li>
                <p>
                  請確實核對訂購內容，票劵一經售出，表示購票人同意支付本次交易的內容與價格，不得以任何理由拒付本次交易費用。
                </p>
              </li>
              <li>
                <p>
                  如遇票券毀損、滅失或遺失，主辦單位將依「藝文表演票券定型化契約應記載及不得記載事項」第七項「票券毀損、滅失及遺失之入場機制：主辦單位應提供消費者票券毀損、滅失及遺失時之入場機制並詳加說明。」之規定辦理，詳情請洽Riverflow售票客服。
                </p>
              </li>
              <li>
                <p>
                  一樓站區無指定席位，又因票券屬無記名有價證券，故遺失票券者可拒絕入場，請妥善保管票券，遺失恕不補發，票券毀損或無法辨識者等同遺失票處理。
                </p>
              </li>
              <li>
                <p>6歲以下不得入場，一人一票，憑票入場。票券視同有價證券，請妥善保存。</p>
              </li>
              <li>
                <p>
                  活動現場嚴禁使用相機、攝影機、DV、錄音機等，未經主辦單位同意，嚴禁拍照、錄影、錄音。屢勸不聽者，主辦單位將強制違規者立即離場。
                </p>
              </li>
              <li>
                <p>本節目禁止攜帶外食、飲料、任何種類之金屬、玻璃、寶特瓶容器、雷射筆、LED燈、煙火或任何危險物品。</p>
              </li>
              <li>
                <p>各表演場館各有其入場規定，請持票人遵守之，遲到觀眾需遵守館方管制。</p>
              </li>
              <li>
                <p>相關規定以活動官網及現場公告為主，主辦單位保留加場、修改、終止及本活動相關演出內容之權利。</p>
              </li>
              <li>
                <p>
                  若有任何形式非供自用而加價轉售（無論加價名目為代購費、交通費、補貼等均包含在內）之情事經查屬實者，將依社會秩序維護法第64條第2款逕向警方檢舉。
                </p>
              </li>
              <li>
                <p>購票前請詳閱注意事項，一旦購票成功視為同意上述所有活動注意事項。</p>
              </li>
            </ol>
          </div>
          {/* <!-- 選單-購買提醒 --> */}
          <div class="eventRemind" id="eventRemind">
            <p class="remindTitle">購買提醒</p>
            <ol>
              <li>
                <p>
                  欲購票者需進行手機驗證及Email驗證，始可購票，未完成驗證者，恕無法購票。建議可於會員專區
                  "個人資料"，先行設定付款信用卡，可節省您的購票時間及購票流程。
                </p>
              </li>
              <li>
                <p>
                  Yahoo及Hotmail信箱擋信機制相對嚴苛，為確保您的權益，強烈建議您在註冊會員時填寫的電子郵件，盡量不要使用Yahoo或Hotmail郵件信箱，以免因擋信、漏信，甚至被視為垃圾郵件而無法收到『訂單成立通知信』。
                </p>
              </li>
              <li>
                <p>
                  訂單成立通知信僅提供交易通知之用，未收到訂單成立通知信不代表交易沒有成功。一旦無法確認於網站上的訂單是否交易成功，請至會員帳戶的"我的訂單"查詢消費資料。
                </p>
              </li>
              <li>
                <p>
                  信用卡付款訂單不論是否收到銀行授權成功通知，刷卡交易的成功與否皆以"我的訂單"查詢的付款狀態為主，若訂單付款狀態顯示為「待繳費」，須等待您的發卡銀行回傳付款狀態；若刷卡失敗，系統將自動取消該筆訂單。
                </p>
              </li>
              <li>
                <p>
                  為強化信用卡網路付款安全，Riverflow售票系統導入了更安全的信用卡 3D
                  驗證服務，以提供持卡人更安全的網路交易環境。
                </p>
              </li>
            </ol>
          </div>
          {/* <!-- 選單-取票方式 --> */}
          <div class="eventTicket" id="eventTicket">
            <p class="ticketTitle">取票方式</p>
            <ol>
              <li>
                <p>取票方式：ibon機台取票(手續費每筆$30/4張為限，於7-11超商門市付款時以現金方式支付。)</p>
              </li>
              <li>
                <p>付款完成之訂單，逾期未取票者視同售出，恕不接受退換票或退費。</p>
              </li>
              <li>
                <p>現場無提供取票服務，請於開演前完成取票。</p>
              </li>
            </ol>
          </div>
          {/* <!-- 選單-退票規定 --> */}
          <div class="eventRefund" id="eventRefund">
            <p class="refundTitle">退票規定</p>
            <ol>
              <li>
                <p>
                  根據文化部訂定『藝文表演票券定型化契約應記載及不得記載事項』第六項「退、換票機制」之規定，共有四種退換票規定，本節目退票方案選擇方案二訂定如下說明。
                </p>
              </li>
              <li>
                <p>
                  購票後(不含購票當日)三日內得退票，第四日起即不接受退票申請，已領票者申請退票日期以郵戳寄送日為準，未領票者申請退票日期以傳真或Email寄達日為準，換票視同退票處理。購票後(不含購票當日)之第三日若遇假日，則順延至下一個工作日截止收件。
                </p>
              </li>
              <li>
                <p>
                  退票期限內申請退票者，每張票券須酌收票面金額5%手續費。相關服務費、轉帳、取票手續費用與寄回郵資非屬票價部分不在退費範圍之內。
                </p>
              </li>
              <li>
                <p>
                  如購票日距活動日不足三日，請於活動開始前完成退票申請，逾期恕不受理，未取票者請於活動開始前以傳真或Email申請退票，已取票者請自行計算郵寄時間，活動開始前未於退票期限內寄達者，Riverflow售票系統將依退票申請表上之聯絡方式通知申請人取回票券，若無法和申請人取得聯繫或無法達成取回票券共識者，
                  Riverflow售票系統將不負票券保管或任何其他責任，所有責任與後果將由申請人自行承擔。
                </p>
              </li>
            </ol>
          </div>
        </div>
        <br />
        <br />
        <br />
        <br />
        <Footer/>
      </div>
    )
  
}

export default EventDetail
