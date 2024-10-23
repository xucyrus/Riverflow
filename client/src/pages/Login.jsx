import React, { Component } from 'react'
import axios from 'axios'
import '../assets/login.css'
import Header from '../components/header'
import Footer from '../components/footer'

class Login extends Component {
  state = {
    Users: {
      firstName: '林',
      lastName: '小美',
      phone: '0912-333-555',
      email: '',
      secret: '',
      birth: '1995/10/10',
      sex: '女'
    },
    isPasswordVisible: false
  }

  Login = async () => {
    try {
      let dataToserver = {
        email: this.state.Users.email,
        secret: this.state.Users.secret
      }

      const result = await axios.post('http://localhost:3000/riverflow/user/login', JSON.stringify(dataToserver), {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true // 發送請求包含 Cookie
      })

      // 檢查
      console.log('Login response:', result)

      // 檢查是否登入成功
      if (result.data.message === '登入成功') {
        window.location = '/'
      } else {
        console.error('Login failed:', result.data.message)
      }
    } catch (error) {
      console.error('Login error:', error)
      this.setState({ error: true })
    }
  }

  render() {
    const { isPasswordVisible } = this.state

    return (
      <div>
        <Header />

        <section className="login">
          <div className="form">
            <h4>會員登入</h4>
            <div className="input-text">
              <label>帳號</label>
              <input
                type="text"
                style={{ width: '80%' }}
                id="email"
                name="email"
                value={this.state.Users.email}
                placeholder="Enter email"
                onChange={this.EmailChange}
                autoComplete='off'
              />
              <br />
            </div>

            <span className="tips" id="" dangerouslySetInnerHTML={{ __html: this.state.emailError }}></span>

            <div className="input-text">
              <label>密碼</label>
              <input
                type={isPasswordVisible ? 'text' : 'password'}
                style={{ width: '80%' }}
                name="password"
                id="password"
                value={this.state.Users.secret}
                placeholder="Enter password"
                pattern="^(?=.*[a-zA-Z])(?=.*[0-9]).{6,}$"
                required
                autoComplete="new-password"
                onChange={this.PasswordChange}
              />
              <div>
                <i
                  id="showBtn"
                  className={`bi ${isPasswordVisible ? 'bi-eye-fill' : 'bi-eye-slash-fill'}`}
                  onClick={this.handlePasswordToggle}
                ></i>
              </div>
            </div>
            <a onClick={this.goPassword}>忘記密碼？</a>
            <input type="button" className="btn" value="Login" onClick={this.Login} />
            <span>
              沒有River Flow帳號嗎？
              <a onClick={this.goRegister}>前往註冊</a>
            </span>
          </div>

          {/* 無法登入 彈跳視窗 */}

          {this.state.error && (
            <div className="nolongin" id="nolongin">
              <div className="nolongin-wrap">
                <h4>無法登入</h4>
                <p>請確認輸入的資料及大小寫是否正確。若不是 RiverFlow 會員請前往註冊。</p>
                <button className="btn" onClick={() => this.setState({ error: false })}>
                  確認
                </button>
              </div>
            </div>
          )}
        </section>
        <Footer/>
      </div>
    )
  }

  goRegister = () => {
    window.location = '/Login/Register'
  }
  goPassword = () => {
    window.location = '/Login/Password'
  }

  handlePasswordToggle = () => {
    this.setState((prevState) => ({ isPasswordVisible: !prevState.isPasswordVisible }))
  }
  PasswordChange = (e) => {
    var newState = { ...this.state }
    newState.Users.secret = e.target.value
    this.setState(newState)
  }

  EmailChange = (event) => {
    const email = event.target.value
    const emailPattern = /^[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$/i
    let emailError = ''

    if (!email.match(emailPattern)) {
      emailError = `<i className="bi bi-asterisk"></i> 不符合email規則，請確認是否包含[@]`
    }

    this.setState((prevState) => ({
      Users: {
        ...prevState.Users,
        email
      },
      emailError
    }))
  }
}
export default Login
