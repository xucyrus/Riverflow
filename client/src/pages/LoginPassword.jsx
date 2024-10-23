import React, { Component } from 'react';
import '../assets/login.css';
import Header from '../components/header'
import Footer from '../components/footer'

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);



class LoginPassword extends Component {
    state = {
        Users: {
            "firstName": "",
            "lastName": "",
            "phone": "",
            "email": "",
            "secret": "",
            "birth": "",
            "sex": "",
        },
        emailError: '', 
        isPasswordVisible: false,
        isLoading: false // 跟蹤加載狀態
        

    }

    // 發送驗證信的請求
    SendVerification = async () => {
        const { email } = this.state.Users;
        if (email === '') {
            this.setState({ emailError: '請輸入電子郵件地址' });
            return;
        }
    
        if (!this.validateEmail(email)) {
            this.setState({ emailError: '請輸入有效的電子郵件地址' });
            return;
        }
        this.setState({ isLoading: true }); 
        try {
            const response = await fetch('http://localhost:3000/riverflow/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            // 後端返回token的JSON
            const data = await response.json();
            const resetToken = data.token;
    
            MySwal.fire({
                title: "驗證信已發送",
                text: "密碼重置連結已發送到您的信箱！",
                width: "300px",
                background: "var(--bk2)",
                color: "var(--gr1)",
                confirmButtonColor: "var(--main)",
                confirmButtonText: "OK",
                customClass: {
                    title: 'custom-title',
                    htmlContainer: 'custom-text',
                    confirmButton: 'swal2-confirm'
                },
            }).then((result) => {
                if (result.isConfirmed) {
                    // 帶有token的路徑
                    window.location = `/Login/Verify/reset-password/${resetToken}`;
                }
            });
        } catch (error) {
            console.error('發送驗證信時出錯:', error);
            this.setState({ emailError: '發送驗證信時出錯，請稍後再試。' });
        } finally {
            this.setState({ isLoading: false }); // 請求完成後停止加載
        }
    };
    




    validateEmail = (email) => {
        const emailPattern = /^[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$/i;
        return emailPattern.test(email);
    }



    render() {
        const { email, emailError } = this.state.Users;


        return (
            <div>
                <Header />

                <section class="password">
                    <form >
                        <h4>重設密碼</h4>
                        <p>
                            如忘記密碼，請輸入註冊時的Email，我們將以Email傳送驗證碼，並請依畫面指示輸入以進行密碼重設。
                        </p>
                        <div class="input-text">
                            <label>帳號</label>
                            <input type="text" id="email" name="email"
                                value={this.state.Users.email}
                                style={{ width: '80%' }}
                                placeholder="Enter email"
                                autoComplete='off'
                                onChange={this.EmailChange} /><br />
                        </div>
                        <span className="tips" id="" dangerouslySetInnerHTML={{ __html: emailError }}></span>


                        <input type="button" id="btnSent" class="btn" value="發送驗證信" onClick={this.SendVerification} />

                    </form>
                     {/* Loading */}
                     {this.state.isLoading && (
                        <div className="loading-overlay">
                            <div className="spinner"></div> {/* 你可以用CSS或图片来实现转动的加载效果 */}
                            <p className="loading-text">Loading<span className="dots"></span></p>
                        </div>
                    )}
                </section>


                <Footer/>
            </div >




        );


    }

    goRegister = () => {
        window.location = "/Login/Register";
    }
    goVerify = () => {
        window.location = "/Login/Verify";
    }

    handlePasswordToggle = () => {
        this.setState(prevState => (
            { isPasswordVisible: !prevState.isPasswordVisible }));
    }
    PasswordChange = (e) => {
        var newState = { ...this.state };
        newState.Users.secret = e.target.value;
        this.setState(newState);
    }


    validateEmail = (email) => {
        const emailPattern = /^[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$/i;
        return emailPattern.test(email);
    }

    EmailChange = (event) => {
        const email = event.target.value;
        this.setState((prevState) => ({
            Users: {
                ...prevState.Users,
                email,
            },
            emailError: '', // 清除錯誤信息
        }));
    };





}
export default LoginPassword;