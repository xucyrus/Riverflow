import React, { Component } from 'react';
import '../assets/member.css';
import axios from 'axios';
import Header from '../components/header'
import Footer from '../components/footer'
import defaultImg from '../assets/images/defaultphoto.jpg'; // 預設會員圖片


class MemberCollection extends Component {
    state = {
        Users: {
            "firstName": "",
            "lastName": "",
            "phone": "",
            "email": "",
            "birth": "",
            "sex": "",
        },
        ProductFavorite: [
            {
                "productId": "",
                "productName": "名字",
                "productDesc": "描述",
                "productPrice": 250,
                "productImg": "../assets/images/products/product1_1.jpeg"
            },
        ],

        isLoading: true,    
        error: null
    }
    // 執行程式碼
    componentDidMount() {
        this.fetchUserData();
        this.fetchFavoritesData();
    }

    // 取得會員資料
    fetchUserData = async () => {
        try {
            const response = await axios.get('http://localhost:3000/riverflow/user', {
                withCredentials: true //  Cookie
            });
            // check會員資料
            console.log("Fetched user data:", response.data); 
            this.setState({
                Users: response.data,
                isLoading: false
            });
        } catch (error) {
            console.error("Error fetching user data:", error);
            
            localStorage.removeItem('token');
            this.setState({
                isLoading: false,
                error: 'Failed to fetch user data. Please log in again.'
            });
            
        }
    };

    // 獲取喜愛商品的資料
    fetchFavoritesData = async () => {
        try {
            const response = await axios.get('http://localhost:3000/riverflow/user/favorites', {
                withCredentials: true
            });
            console.log("Fetched order data:", response.data);
            this.setState({
                ProductFavorite: response.data
            });
        } catch (error) {
            console.error("Error fetching order data:", error);
            this.setState({
                error: 'Failed to fetch order data.'
            });
        }


    };
    

    // 登出
    Logout = async () => {
        try {
            await axios.get('http://localhost:3000/riverflow/user/logout', {
                withCredentials: true // Cookie
            });
            // 清除 Token
            localStorage.removeItem('token');
            
            window.location.href = '/login/Index';
        } catch (error) {
            console.error("Error logging out:", error);
           
        }
    };



    render() {
        const { Users, isLoading, error } = this.state;
        if (isLoading) {
            return <div>Loading...</div>;
        }

        if (error) {
            return <div>{error}</div>;
        }
        // 如果會員沒有照片就使用預設圖片
        const { userImg } = this.state.Users;
        const imageSrc = userImg ? require(`../assets/images/users/${userImg}`) : defaultImg;
        return (
            <div>
                <Header />
                <div class="Collection">


                    <div class="nav-box" flex="1">
                        <div class="">
                            <div class="member">
                                <div>
                                    <img className="member-img" src={imageSrc} alt="" />
                                </div>
                                <div class="profile">
                                    <h3>Hey！{this.state.Users.lastName} </h3>
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

                        <h3>我的最愛</h3>
                        <div class="btn-box">
                            <button class="tablink" onClick={(e) => this.openPage('Collection', e.currentTarget, '3px solid var(--main)')} id="defaultOpen">商品</button>

                        </div>

                        <div id="Collection" class="tabcontent">
                            {this.state.ProductFavorite.map((productItem, index) => (
                                <div class="member-order" key={index}>

                                    <div class="Img-box">
                                    <img src={`/images/products/${productItem.productImg}`} alt="" />
                                    </div>
                                    <div class="container">
                                        <div class="member-wrap">
                                            <h3>{productItem.productName}</h3>
                                            <button class="closebtn" onClick={() => this.Delete(productItem.productId)}><i class="bi bi-x"></i></button>
                                        </div>
                                        <div class="member-wrap">
                                            <p class="multiline-ellipsis">{productItem.productDesc}</p>
                                        </div>
                                        <div class="member-wrap">
                                            <span>NT${productItem.productPrice}</span>
                                            <button class="orderbtn" onClick={() => this.goProduct(productItem.productId)}>前往商品頁</button>
                                        </div>
                                    </div>

                                </div>

                            ))}
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

    //  前往商品頁
    goProduct = (productId) => {
        window.location = `/Product/Detail/${productId}`;
    };
    // 刪除商品
    Delete = async (productId) => {
        try {
            const response = await axios.delete(`http://localhost:3000/riverflow/user/favorites/${productId}`, {
                withCredentials: true
            });
            if (response.status === 200) {
                console.log("商品已成功刪除");
                 // 更新商品列表
                 this.setState(prevState => ({
                    ProductFavorite: prevState.ProductFavorite.filter(product => product.productId !== productId)
                }));
            }
        } catch (error) {
            console.error("刪除商品時出錯:", error);
        }
    };







}
export default MemberCollection;