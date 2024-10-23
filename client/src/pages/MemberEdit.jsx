import React, { Component } from 'react'
import '../assets/member.css'
import '../assets/customSwalStyles.css'
import axios from 'axios'
import Header from '../components/header'
import Footer from '../components/footer'
import defaultImg from '../assets/images/defaultphoto.jpg' // 預設會員圖片

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

class MemberEdit extends Component {
  state = {
    Users: {
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      birth: '',
      sex: ''
    },
    phoneError: ''
  }

  componentDidMount() {
    this.fetchUserData()
  }

  // 將會員生日 UTC 日期轉換為本地日期
  formatDate = (dateString) => {
    const date = new Date(dateString)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0') // 月份從0開始，要+1
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  // 取得會員資料
  fetchUserData = async () => {
    try {
      const response = await axios.get('http://localhost:3000/riverflow/user', {
        withCredentials: true //  Cookie
      })

      // 格式化日期
      const birth = response.data.birth ? this.formatDate(response.data.birth) : ''

      // 更新状态以显示用户数据
      this.setState({
        Users: {
          ...response.data,
          birth // 确保日期格式正确
        },
        isLoading: false
      })
    } catch (error) {
      localStorage.removeItem('token')
      this.setState({
        Users: { ...this.state.Users, birth: '' },
        isLoading: false
      })
      window.location.href = '/login/Index'
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.Users.userImg !== this.state.Users.userImg) {
      this.forceUpdate(); // 强制组件重新渲染
    }
  }

  //上傳大頭貼到前端顯示
UploadImg = async () => {
  const { selectedFile } = this.state
  if (!selectedFile) return

  const formData = new FormData()
  formData.append('userImg', selectedFile)

  try {
    const response = await axios.post('http://localhost:3000/riverflow/user/update/img', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      withCredentials: true // Cookie
    })
    // 更新大頭貼檔名，添加時間戳記立即更新圖片
    this.setState((prevState) => ({
      Users: {
        ...prevState.Users,
        userImg: `${response.data.fileName}?${new Date().getTime()}`
      }
    }), () => {
      // 強制圖片重新加载
      const imgElement = document.querySelector('.member-img img');
      if (imgElement) {
        imgElement.src = `${require(`../assets/images/users/${this.state.Users.userImg}`).default}?${new Date().getTime()}`;
      }
    })
  } catch (error) {
    console.error('Error uploading file:', error)
    alert('上傳文件發生錯誤，請稍後再試。')
    return null
  }
}


  handleSave = async (e) => {
    try {
      const { Users } = this.state
      await axios.put('http://localhost:3000/riverflow/user/update', Users, {
        withCredentials: true // Cookie
      })

      MySwal.fire({
        // title: "資料更新",
        text: '資料更新成功囉！',
        width: '250px',
        background: 'var(--bk2)',
        color: 'var(--gr1)',
        confirmButtonColor: 'var(--main)',
        confirmButtonText: 'OK',
        customClass: {
          title: 'custom-title', // 自訂標題的class
          htmlContainer: 'custom-text', // 自訂内文的 class
          confirmButton: 'swal2-confirm' // 按鈕class
        }
      })
    } catch (error) {
      console.error('Error updating user data:', error)
      alert('更新資料時發生錯誤，請稍後再試。')
    }
  }

  // 登出
  Logout = async () => {
    try {
      await axios.get('http://localhost:3000/riverflow/user/logout', {
        withCredentials: true // Cookie
      })
      // 清除本地 Token
      localStorage.removeItem('token')
      window.location.href = '/login/Index'
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  render() {
    const { Users, phoneError } = this.state

    // 如果會員沒有照片就使用預設圖片
    const { userImg } = this.state.Users
    const imageSrc = userImg ? require(`../assets/images/users/${userImg}`) : defaultImg

    return (
      <div>
        <Header />

        <section className='Member'>
          <div className='nav-box' flex='1'>
            <div className='member-wrap'>
              <div className='member'>
                <div className='member-img'>
                  <img className='member-img img' src={imageSrc} alt='Profile' />
                  <label className='prettier-input'>
                    <input type='file' onChange={this.handleFileChange} />
                    <div onClick={this.UploadImg}>
                      上傳
                      <br />
                      大頭貼
                    </div>
                  </label>
                </div>
                <div className='profile'>
                  <h3>Hey！{this.state.Users.lastName} </h3>
                  <a onClick={this.backMember}>個人資料</a>
                </div>
              </div>
              <div className='nav'>
                <ul>
                  <li>
                    <a onClick={this.backOrderList}>
                      <i className='bi bi-clipboard'></i> 訂單查詢
                    </a>
                  </li>
                  <li>
                    <a onClick={this.backTickets}>
                      <i className='bi bi-ticket-perforated'></i> 活動票券
                    </a>
                  </li>
                  <li>
                    <a onClick={this.backCollection}>
                      <i className='bi bi-heart'></i> 我的最愛
                    </a>
                  </li>
                </ul>
                <button className='btn' onClick={this.Logout}>
                  會員登出
                </button>
              </div>
            </div>
          </div>
          <div className='profile-box' flex='2' id='profile'>
            <div className='member-wrap'>
              <div className='item'>
                <h3>個人資料</h3>
              </div>
              <div className='input-card'>
                <label>您的姓氏</label>
                <br />
                <input
                  type='text'
                  name='firstName'
                  id='firstName'
                  placeholder={Users.firstName}
                  value={Users.firstName}
                  onChange={this.handleInputChange}
                />
              </div>
              <div className='input-card'>
                <label>您的名字</label>
                <br />
                <input
                  type='text'
                  name='lastName'
                  id='lastName'
                  placeholder={Users.lastName}
                  value={Users.lastName}
                  onChange={this.handleInputChange}
                />
              </div>
              <div className='input-card'>
                <label>聯絡電話</label>
                <br />
                <input
                  type='tel'
                  id='phone'
                  name='phone'
                  onChange={this.handlePhoneChange}
                  value={Users.phone}
                  placeholder={Users.phone}
                  required
                  autoComplete='new-tel'
                />
              </div>
              <span className='tips' id='' dangerouslySetInnerHTML={{ __html: this.state.phoneError }}></span>
              <div className='input-card'>
                <label>您的帳號</label>
                <br />
                <input type='email' name='' id='' placeholder={Users.email} disabled />
              </div>
              <div className='input-date'>
                <label>您的生日</label>
                <br />
                <input
                  type='date'
                  name='birth'
                  id='birth'
                  placeholder={Users.birth}
                  value={Users.birth}
                  onChange={this.handleInputChange}
                />
              </div>
              <div className='input-card'>
                <label>您的性別</label>
                <br />
                <select name='sex' id='sex' value={Users.sex} onChange={this.handleInputChange}>
                  <option value='Male'>男</option>
                  <option value='Female'>女</option>
                </select>
              </div>
              <div className='btn-box'>
                <input type='button' value='查看個人資料' onClick={this.backMember} />
                <input type='button' value='修改密碼' onClick={this.verifyClick} />
                <input type='button' value='儲存' onClick={this.handleSave} />
              </div>
            </div>
          </div>
        </section>
        <Footer/>
      </div>
    )
  }

  // 大頭照
  handleFileChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        this.setState({
          previewImg: reader.result
        })
      }
      reader.readAsDataURL(file)
      this.setState({ selectedFile: file })
    }
  }

  //日期
  handleInputChange = (e) => {
    const { name, value } = e.target
    // 轉換為 YYYY-MM-DD 格式
    const newValue = name === 'birth' ? value.split('/').join('-') : value
    this.setState({ Users: { ...this.state.Users, [name]: value } })
  }

  // 判斷手機號碼規則
  handlePhoneChange = (e) => {
    const phone = e.target.value
    const phonePattern = /^09[0-9]{2}-[0-9]{3}-[0-9]{3}$/

    let phoneError = ''
    if (!phone) {
      phoneError = '<i class="bi bi-asterisk"></i> 請輸入手機號碼'
    } else if (!phonePattern.test(phone)) {
      phoneError = '<i class="bi bi-asterisk"></i> 請輸入符合手機的格式：0912-345-678'
    }

    this.setState({ Users: { ...this.state.Users, phone }, phoneError })
  }

  backMember = () => {
    window.location = '/Member/Index'
  }

  verifyClick = () => {
    window.location = '/Login/Verify'
  }

  backOrderList = () => {
    window.location = '/Member/OrderList'
  }

  backTickets = () => {
    window.location = '/Member/Tickets'
  }

  backCollection = () => {
    window.location = '/Member/Collection'
  }
}

export default MemberEdit
