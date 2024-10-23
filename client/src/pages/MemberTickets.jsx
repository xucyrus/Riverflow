import React, { Component } from 'react';
import axios from 'axios';
import '../assets/member.css';
import Header from '../components/header'
import Footer from '../components/footer'
import defaultImg from '../assets/images/defaultphoto.jpg'; // 預設會員圖片


class MemberTickets extends Component {
    state = {
        Users: {
            "firstName": "",
            "lastName": "",
            "phone": "",
            "email": "",
            "birth": "",
            "sex": "",
        },
        TicketsDetails: [
            // { "tdId": "", "eventDate": "", "eventName": "", "quantity": "", "ticketType": "", "tdStatus": "", "tdPrice": "", "randNum": "" },
            // { "tdId": "A234567890", "eventDate": "2024/09/1", "eventName": "《大嘻哈哈哈》-烏拉拉", "quantity": 2, "ticketType": "一般票", "tdStatus": "未付款", "tdPrice": "5600", "randNum": "k1kif0d12c" },

            // { "tdId": "B1234567890", "eventDate": "2024/07/03", "eventName": "《大嘻哈哈哈》-烏拉拉", "quantity": 1, "ticketType": "一般票", "tdStatus": "已結束", "tdPrice": "600", "randNum": "x1kig0d12c" },
            // { "tdId": "F1234567890", "eventDate": "2024/02/01", "eventName": "音樂戰艦Leo王｜演唱會｜台北國際會議中心", "quantity": 2, "ticketType": "一般票", "tdStatus": "已結束", "tdPrice": "2900", "randNum": "g2kig0d12c" },

        ],
     
        isLoading: true,      
        error: null           

    }
    componentDidMount() {
        this.fetchUserData();
        this.fetchOrderData();

    }

    fetchUserData = async () => {
        try {
            const response = await axios.get('http://localhost:3000/riverflow/user', {
                withCredentials: true // 确保请求带上 Cookie
            });
            console.log("Fetched user data:", response.data); // 打印返回的数据
            this.setState({
                Users: response.data,
                isLoading: false
            });
        } catch (error) {
            console.error("Error fetching user data:", error);
            // 清除本地存储中的 Token，并重定向到登录页面
            localStorage.removeItem('token');
            this.setState({
                isLoading: false,
                error: 'Failed to fetch user data. Please log in again.'
            });
            // window.location.href = '/login';
        }
    };

    fetchOrderData = async () => {
        try {
            const response = await axios.get('http://localhost:3000/riverflow/user/events', {
                withCredentials: true
            });
            console.log("Fetched order data:", response.data); 
    
           
            this.setState({
                TicketsDetails: Array.isArray(response.data) ? response.data : [],
                isLoading: false
            });
        } catch (error) {
            console.error("Error fetching order data:", error);
            this.setState({
                error: 'Failed to fetch order data.',
                isLoading: false
            });
        }
    };
    

    // 格式化日期的方法
    formatDate(dateString) {
        // 將日期字符串轉換 Date
        const date = new Date(dateString);

        
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); 
        const day = String(date.getDate()).padStart(2, '0');

        // 格式化为 YYYY/MM/DD
        const formattedDate = `${year}/${month}/${day}`;
        console.log('Formatted Date:', formattedDate); // 输出格式化后的日期
        return formattedDate;
    }

    // 登出
    Logout = async () => {
        try {
            await axios.get('http://localhost:3000/riverflow/user/logout', {
                withCredentials: true // 确保请求带上 Cookie
            });
            // 清除本地存储中的 Token
            localStorage.removeItem('token');
            // 重定向到登录页面
            window.location.href = '/login/Index';
        } catch (error) {
            console.error("Error logging out:", error);
            // 可以显示错误消息或者其他处理
        }
    };


    render() {
        const { Users,TicketsDetails,isLoading, error } = this.state;

        if (isLoading) {
            return <div>Loading...</div>;
        }

        if (error) {
            return <div>{error}</div>;
        }

        // 根據訂單篩選，用filter過濾
        const Ticket = this.state.TicketsDetails.filter(ticket => ticket.tdStatus === '已付款');
        const Unpaid = this.state.TicketsDetails.filter(ticket => ticket.tdStatus === 'pending');
        const OrderDone = this.state.TicketsDetails.filter(ticket => ticket.tdStatus === 'complete');

        // 變更訂單狀態名稱
        const tdStatusMap = {
            "已付款": "活動中",
            "pending": "未付款",
            "complete": "已結束",

        };

       
       // 如果會員沒有照片就使用預設圖片
        const { userImg } = this.state.Users;
        const imageSrc = userImg ?require(`../assets/images/users/${userImg}`)  : defaultImg;

        return (



            <div>
                <Header />
                <div class="Tickets">


                    <div class="nav-box" flex="1">
                        <div class="">
                            <div class="member">
                                <div>
                                <img className="member-img" src={imageSrc} alt="" />
                                </div>
                                <div class="profile">
                                    <h3>Hey！{this.state.Users.lastName}</h3>
                                    <a onClick={this.backMember}>個人資料</a>
                                </div>
                            </div>
                            <div class="nav">
                                <ul>
                                    <li><a onClick={this.backOrderList}><i class="bi bi-clipboard"></i> 訂單查詢</a></li>
                                    <li><a onClick={this.backTickets}><i class="bi bi-ticket-perforated"></i> 活動票券</a></li>
                                    <li><a onClick={this.backCollection}><i class="bi bi-heart"></i> 我的最愛</a></li>

                                </ul>
                                <button className='btn' onClick={this.Logout}>會員登出</button>

                            </div>
                        </div>

                    </div>
                    <div class="order-box" flex="2">

                        <h3>活動票券</h3>
                        <div class="btn-box">
                            <button class="tablink" onClick={(e) => this.openPage('Ticket', e.currentTarget, '3px solid var(--main)')} id="defaultOpen">活動中</button>
                            <button class="tablink" onClick={(e) => this.openPage('Unpaid', e.currentTarget, '3px solid var(--main)')}>未付款</button>
                            <button class="tablink" onClick={(e) => this.openPage('OrderDone', e.currentTarget, '3px solid var(--main)')}>已結束</button>
                        </div>

                        <div id="Ticket" class="tabcontent">
                            {Ticket.map(ticket =>
                                <div class="member-order" key={ticket.Id}>
                                    <div class="member-wrap">
                                        <span>訂單編號：{ticket.tdId}</span>
                                        <span>取票號：{ticket.randNum}</span>
                                    </div>
                                    <table>
                                        <thead>
                                            <th>日期</th>
                                            <th colspan="2">活動名稱</th>
                                            <th>數量</th>
                                            <th>總金額</th>
                                            <th>票種</th>
                                            <th>狀態</th>
                                        </thead>

                                        <tbody>
                                            <td data-title="日期：">{this.formatDate(ticket.eventDate)}</td>
                                            <td data-title="活動名稱：" colspan="2">{ticket.eventName}</td>
                                            <td data-title="數量：">{ticket.quantity}</td>
                                            <td data-title="金額：">NT${ticket.tdPrice}</td>
                                            <td data-title="票種：">{ticket.ticketType}</td>
                                            <td data-title="狀態：">{tdStatusMap[ticket.tdStatus] || ticket.tdStatus}</td>
                                        </tbody>
                                    </table>
                                </div>
                            )}

                        </div>
                        <div id="Unpaid" class="tabcontent">
                            {Unpaid.map(ticket =>
                                <div class="member-order">
                                    <div class="member-wrap">
                                        <span>訂單編號：{ticket.tdId}</span>
                                        <span>取票號：{ticket.randNum}</span>

                                    </div>
                                    <table>
                                        <thead>
                                            <th>日期</th>
                                            <th colspan="2">活動名稱</th>
                                            <th>數量</th>
                                            <th>總金額</th>
                                            <th>票種</th>
                                            <th>狀態</th>
                                        </thead>

                                        <tbody>
                                            <td>{this.formatDate(ticket.eventDate)}</td>
                                            <td colspan="2">{ticket.eventName}</td>
                                            <td>{ticket.quantity}</td>
                                            <td>NT${ticket.tdPrice}</td>
                                            <td>{ticket.ticketType}</td>
                                            <td>{tdStatusMap[ticket.tdStatus] || ticket.tdStatus}</td>
                                        </tbody>
                                    </table>
                                </div>
                            )}


                        </div>
                        <div id="OrderDone" class="tabcontent">
                            {OrderDone.map(ticket =>
                                <div class="member-order">
                                    <div class="member-wrap">
                                        <span>訂單編號：{ticket.tdId}</span>
                                        <span>取票號：{ticket.randNum}</span>
                                    </div>
                                    <table>
                                        <thead>
                                            <th>日期</th>
                                            <th colspan="2">活動名稱</th>
                                            <th>數量</th>
                                            <th>總金額</th>
                                            <th>票種</th>
                                            <th>狀態</th>
                                        </thead>

                                        <tbody>
                                            <td>{ticket.eventDate}</td>
                                            <td colspan="2">{ticket.eventName}</td>
                                            <td>{ticket.quantity}</td>
                                            <td>NT${ticket.tdPrice}</td>
                                            <td>{ticket.ticketType}</td>
                                            <td>{ticket.tdStatus}</td>
                                        </tbody>
                                    </table>
                                </div>

                            )}
                        </div>



                    </div>


                </div>
                <Footer/>
            </div>


        );
    }

    openPage(pageName, elmnt, border) {
        var i, tabcontent, tablinks;
        tabcontent = document.getElementsByClassName("tabcontent");
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
        }
        tablinks = document.getElementsByClassName("tablink");
        for (i = 0; i < tablinks.length; i++) {
            tablinks[i].style.borderBottom = "3px solid var(--bk2)";
        }
        document.getElementById(pageName).style.display = "block";
        elmnt.style.borderBottom = border;
    }

    componentDidUpdate() {
        document.getElementById("defaultOpen").click();
    }


    // 選單按鈕
    backMember = async () => {
        window.location = "/Member/Index";
    }
    backOrderList = async () => {
        window.location = "/Member/OrderList";
    }
    backTickets = async () => {
        window.location = "/Member/Tickets";
    }
    backCollection = async () => {
        window.location = "/Member/Collection";
    }
    goOrder = async () => {
        window.location = "/Member/Order";
    }



}
export default MemberTickets;