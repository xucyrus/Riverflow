import React, { Component } from 'react'
import axios from 'axios'
import '../assets/login.css'
import '../assets/customSwalStyles.css'
import Header from '../components/header'
import Footer from '../components/footer'
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

class LoginRegister extends Component {
  state = {
    Users: {
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      secret: '', // 原本會員的密碼
      birth: '',
      sex: ''
    },
    isNewPasswordVisible: false,
    isConfirmPasswordVisible: false,
    newPassword: '',
    confirmPassword: '',
    passwordError: '',
    checkPasswordError: '',
    nameError: '',
    emailError: '',
    agreeToPrivacy: false,
    isLoading: false // 跟蹤加載狀態
  }

  componentDidMount() {
    this.setState({
      newPassword: '',
      confirmPassword: ''
    })
  }

  render() {
    const {
      isNewPasswordVisible,
      isConfirmPasswordVisible,
      passwordError,
      checkPasswordError,
      newPassword,
      confirmPassword,
      nameError,
      emailError
    } = this.state

    return (
      <div className='loginPage'>
        <Header />
        <section className='register'>
          <div className='form'>
            <h4>註冊新帳號</h4>
            <div class='input-text'>
              <label>姓</label>
              <input
                type='text'
                value={this.state.Users.firstName}
                name='firstName'
                id='firstName'
                placeholder='First Name'
                required
                autoComplete='off'
                onChange={this.handleInputChange}
              />
              <label>名</label>
              <input
                type='text'
                value={this.state.Users.lastName}
                name='lastName'
                id='lastName'
                placeholder='Last Name'
                required
                autoComplete='off'
                onChange={this.handleInputChange}
              />
            </div>
            <span className='tips' dangerouslySetInnerHTML={{ __html: nameError }}></span>

            <div class='input-text'>
              <label>帳號</label>
              <input
                type='text'
                id='email'
                name='email'
                style={{ width: '80%' }}
                value={this.state.Users.email}
                placeholder='Enter Email'
                autoComplete='off'
                onChange={this.EmailChange}
              />
              <br />
            </div>
            <span className='tips' id='' dangerouslySetInnerHTML={{ __html: emailError }}></span>

            <div className='input-text input-password'>
              <label>密碼</label>
              <input
                type={isNewPasswordVisible ? 'text' : 'password'}
                style={{ width: '80%' }}
                name='newPassword'
                id='newPassword'
                value={this.state.Users.secret}
                placeholder='Enter Password'
                required
                onChange={this.NewPassword}
                autoComplete='new-password'
              />
              <div>
                <i
                  className={`bi ${isNewPasswordVisible ? 'bi-eye-fill' : 'bi-eye-slash-fill'}`}
                  onClick={() => this.handlePasswordToggle('isNewPasswordVisible')}
                ></i>
              </div>
            </div>
            <span className='tips' dangerouslySetInnerHTML={{ __html: passwordError || '含英數至少六個字元' }}></span>
            <br />

            <div className='input-text input-password'>
              <label style={{ width: '75px' }}>確認密碼</label>
              <input
                type={isConfirmPasswordVisible ? 'text' : 'password'}
                style={{ width: '80%' }}
                name='confirmPassword'
                id='checkPassword'
                value={confirmPassword}
                placeholder='Check password'
                onChange={this.handleConfirmPasswordChange}
              />
              <div>
                <i
                  className={`bi ${isConfirmPasswordVisible ? 'bi-eye-fill' : 'bi-eye-slash-fill'}`}
                  onClick={() => this.handlePasswordToggle('isConfirmPasswordVisible')}
                ></i>
              </div>
            </div>
            <span className='tips' dangerouslySetInnerHTML={{ __html: checkPasswordError }}></span>
            <br />

            {/* <input type="button" className="btn" value="Login" onClick={this.SentBtn} /> */}
            <input
              type='button'
              className='btn'
              value='註冊'
              onClick={this.registerUser}
              disabled={!this.state.agreeToPrivacy}
              style={{
                backgroundColor: this.state.agreeToPrivacy ? '' : '#6e9c02',
                cursor: this.state.agreeToPrivacy ? 'pointer' : 'not-allowed'
              }}
            />
            <label class='input-checkbox'>
              <input type='checkbox' onChange={this.handleCheckboxChange} />
              <span>我已詳閱並同意</span>
              <button onClick={this.openPrivacy}>隱私權政策</button>
            </label>
            <span>
              沒有River Flow帳號嗎？
              <a onClick={this.goLogin}>前往登入</a>
            </span>
          </div>

          {/* 隱私權 彈跳視窗 */}
          <div class='privacy' id='privacy'>
            <div class='privacy-wrap'>
              <div class='privacy-header'>
                <h3>服務條款與隱私權</h3>
                <button class='closebtn' onClick={this.cancelPrivacy}>
                  <i class='bi bi-x'></i>
                </button>
              </div>
              <div class='privacy-body scrollCust'>
                <div class='privacy-container'>
                  <h3>RIVERFLOW 服務條款</h3>
                  <p>
                    歡迎您使用 RIVERFLOW
                    的服務。本服務條款（以下簡稱「條款」）規範您使用我們提供的網站、活動及商品銷售服務。請您仔細閱讀以下條款，以確保您了解並接受所有條款內容。
                  </p>
                  <br />
                  <h4>1. 接受條款</h4>
                  <ul>
                    <li>
                      當您使用或訪問 RIVERFLOW
                      的網站和服務時，即表示您同意遵守本條款。如果您不同意本條款的任何部分，請勿使用本網站或服務。
                    </li>
                  </ul>

                  <h4>2. 服務內容</h4>
                  <ul>
                    <li>
                      RIVERFLOW
                      提供有關嘻哈文化的資訊、活動報名以及相關商品的銷售。我們保留隨時更改、暫停或終止服務的權利，恕不另行通知。
                    </li>
                  </ul>

                  <h4>3. 用戶責任</h4>
                  <ul>
                    <li>您同意在使用本網站和服務時，不從事任何非法、侵權或違反公共道德的行為。</li>
                    <li>您需確保您提供的所有資料均為準確且最新的。如資料有任何變動，請及時更新。</li>
                  </ul>

                  <h4>4. 知識產權</h4>
                  <ul>
                    <li>
                      本網站上的所有內容，包括但不限於文字、圖片、標誌、設計，均受著作權及其他相關法律保護，未經授權，禁止以任何形式使用。
                    </li>
                  </ul>

                  <h4>5. 責任限制</h4>
                  <ul>
                    <li>
                      RIVERFLOW
                      不對由於使用或無法使用本服務而導致的任何直接、間接、偶然或特別損害負責。即使我們已被告知該等損害發生的可能性。
                    </li>
                  </ul>

                  <h4>6. 條款修改</h4>
                  <ul>
                    <li>
                      RIVERFLOW
                      保留隨時修改本條款的權利。任何修改將會在網站上公佈並自公佈日起生效。請定期查看本條款以了解最新資訊。
                    </li>
                  </ul>
                  <br />
                  <hr />
                  <br />

                  <h3>RIVERFLOW 隱私權政策</h3>
                  <p>我們重視您的隱私，並致力於保護您的個人資訊。以下是我們的隱私權政策，請仔細閱讀。</p>
                  <br />
                  <h4>1. 資料收集</h4>
                  <ul>
                    <li>我們會在您註冊、訂購商品或參加活動時收集您的個人資料，如姓名、聯絡方式及支付資訊。</li>
                  </ul>

                  <h4>2. 資料使用</h4>
                  <ul>
                    <li>
                      我們使用您的個人資料以提供您所需的服務、處理訂單、聯絡您並改善我們的服務。我們不會將您的資料出售給第三方。
                    </li>
                  </ul>

                  <h4>3. 資料安全</h4>
                  <ul>
                    <li>我們採取合理的技術和組織措施保護您的個人資料，防止其遭受未經授權的訪問、使用或披露。</li>
                  </ul>

                  <h4>4. 資料分享</h4>
                  <ul>
                    <li>
                      除非得到您的同意或法律要求，我們不會將您的個人資料分享給第三方。我們可能會與信任的合作夥伴分享資料以協助我們運營服務，但僅限於為您提供服務所必需的範圍內。
                    </li>
                  </ul>

                  <h4>5. 隱私權政策修改</h4>
                  <ul>
                    <li>
                      我們可能會不時更新本政策。任何更改將於網站上公告，並自公告日起生效。建議您定期查看以了解我們的最新隱私政策。
                    </li>
                  </ul>
                  <br />
                  <em>如果您對於本服務條款或隱私權政策有任何疑問，請隨時聯絡我們。</em>
                </div>
              </div>

              <div class='privacy-footer'>
                <button class='btn' onClick={this.cancelPrivacy}>
                  同意
                </button>
              </div>
            </div>
          </div>

          {/* Loading */}
          {this.state.isLoading && (
            <div className='loading-overlay'>
              <div className='spinner'></div>
              <p className='loading-text'>
                Loading<span className='dots'></span>
              </p>
            </div>
          )}
        </section>
        <Footer/>
      </div>
    )
  }

  handleCheckboxChange = () => {
    this.setState({ agreeToPrivacy: !this.state.agreeToPrivacy })
  }

  EmailChange = (event) => {
    const email = event.target.value
    const emailPattern = /^[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$/i
    let emailError = ''

    if (!email.match(emailPattern)) {
      emailError = `<i class="bi bi-asterisk"></i> 不符合email規則，請確認是否包含[@]`
    }

    this.setState((prevState) => ({
      Users: {
        ...prevState.Users,
        email
      },
      emailError
    }))
  }

  goLogin = () => {
    window.location = '/Login/Index'
  }

  // 顯示密碼的功能
  handlePasswordToggle = (type) => {
    this.setState((prevState) => ({
      [type]: !prevState[type]
    }))
  }

  // 新密碼驗證，同時啟動確認密碼功能
  NewPassword = (event) => {
    const newPassword = event.target.value.trim() // 修剪空白字符
    // console.log('New Password Input:', newPassword); // 

    const passwordPattern = /^(?=.*[a-zA-Z])(?=.*[0-9]).{6,}$/
    let passwordError = ''

    if (!newPassword.match(passwordPattern)) {
      passwordError = '<i class="bi bi-asterisk"></i> 請輸入正確的密碼格式: 含英數至少六個字元'
    } else {
      passwordError = ''
    }

    this.setState(
      (prevState) => ({
        Users: {
          ...prevState.Users,
          secret: newPassword
        },
        passwordError
      }),
      () => {
        // 確保狀態更新後調用 CheckPassword
        console.log('Updated New Password (after state update):', this.state.Users.secret) 
        this.CheckPassword()
      }
    )
  }

  // 確認密碼功能，並在下方顯示提示
  CheckPassword = () => {
    const { Users, confirmPassword } = this.state
    const newPassword = Users.secret // 確保獲取正確的 newPassword
    // console.log('Current New Password (CheckPassword):', newPassword); 
    // console.log('Current Confirm Password:', confirmPassword); 

    let checkPasswordError = ''

    if (confirmPassword && newPassword !== confirmPassword) {
      checkPasswordError = '<i class="bi bi-asterisk"></i> 密碼不吻合'
    } else if (confirmPassword && newPassword === confirmPassword) {
      checkPasswordError = '密碼吻合'
    } else {
      checkPasswordError = ''
    }

    this.setState({ checkPasswordError })
  }

  // 確認密碼更動時，同時啟動確認密碼功能
  handleConfirmPasswordChange = (event) => {
    const confirmPassword = event.target.value.trim()
    this.setState({ confirmPassword }, this.CheckPassword)
  }

  handleInputChange = (event) => {
    const { name, value } = event.target
    // console.log('Field:', name, 'Value:', value); // 調試輸出
    this.setState((prevState) => ({
      Users: {
        ...prevState.Users,
        [name]: value
      }
    }))
  }


  registerUser = async () => {
    const { Users, agreeToPrivacy } = this.state
    const { firstName, lastName, email, secret } = Users

    console.log('Sending data:', { firstName, lastName, email, secret })

    let nameError = ''
    let passwordError = ''
    let emailError = ''

    if (!firstName || !lastName) {
      nameError = '<i class="bi bi-asterisk"></i> 請輸入姓名'
    }

    if (!secret) {
      passwordError = '<i class="bi bi-asterisk"></i> 請輸入密碼'
    }

    if (!email) {
      emailError = `<i class="bi bi-asterisk"></i> 請輸入email`
    }

    this.setState({ nameError, passwordError, emailError })

    if (!nameError && !passwordError && !emailError && agreeToPrivacy) {
      this.setState({ isLoading: true }) // 開始加載
      try {
        const response = await axios.post(
          'http://localhost:3000/riverflow/user/register',
          JSON.stringify({
            firstName: this.state.Users.firstName,
            lastName: this.state.Users.lastName,
            email: this.state.Users.email,
            secret: this.state.Users.secret
          }),
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        )

        console.log('Response data:', response.data)

        MySwal.fire({
          title: '註冊成功',
          text: '請至信箱，收取驗證信！',
          width: '300px',
          background: 'var(--bk2)',
          color: 'var(--gr1)',
          confirmButtonColor: 'var(--main)',
          confirmButtonText: 'OK',
          customClass: {
            title: 'custom-title', 
            htmlContainer: 'custom-text', 
            confirmButton: 'swal2-confirm' 
          }
        }).then((result) => {
          if (result.isConfirmed) {
            window.location = '/Login/Index'
          }
        })
      } catch (error) {
        console.error('註冊失敗:', error.response ? error.response.data : error.message)
        alert(`註冊失敗！錯誤信息：${error.response ? error.response.data : error.message}`)
      } finally {
        this.setState({ isLoading: false }) // 請求後停止加載
      }
    }
  }

  openPrivacy = () => {
    const privacy = document.getElementById('privacy')
    privacy.style.visibility = 'visible'
  }
  cancelPrivacy = () => {
    const privacy = document.getElementById('privacy')
    privacy.style.visibility = 'hidden'
  }
}

export default LoginRegister
