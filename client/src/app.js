import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Cookies from 'js-cookie'

import AdminLogin from './pages/adminPages/adminLogin'
import AdminInterface from './adminInterface'
import UserInterface from './userInterface'

const isAuthenticated = () => {
  const token = Cookies.get('adminToken')

  return !!token
}

const ProtectedAdminRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to='/admin/login' replace />
  }
  return children
}

// import { TicketProvider } from './pages/TicketContext';

// import Header from './components/header'
// import Footer from './components/footer'

// import Index from './pages/Index'
// import News from './pages/News'
// import NewsArticle from './pages/NewsArticle'

// import Skate from './pages/skate'

// import Login from './pages/Login'
// import LoginVerify from './pages/LoginVerify'
// import LoginRegister from './pages/LoginRegister'
// import LoginPassword from './pages/LoginPassword'

// import MemberIndex from './pages/MemberIndex'
// import MemberEdit from './pages/MemberEdit'
// import MemberOrderList from './pages/MemberOrderList'
// import MemberOrder from './pages/MemberOrder'
// import MemberTickets from './pages/MemberTickets'
// import MemberCollection from './pages/MemberCollection'

// import EventOrder from './pages/eventOrder'
// import EventConfirmInfo from './pages/eventConfirmInfo'
// import EventConfirmNoseat from './pages/eventConfirmNoseat'
// import EventConfirmSeat from './pages/eventConfirmSeat'
// import EventIndex from './pages/eventIndex'
// import EventDetail from './pages/eventDetail'
// import ProductAll from './pages/ProductAll'

// import AboutUs from './pages/about'
// import ProductDetail from './pages/ProductDetail'

// import Cart from './pages/cart'
// import cartCheckOut from './pages/cartCheckOut'
// import cartConfirmation from './pages/cartConfirmation'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 管理員路由 */}
        <Route path='/admin/login' element={<AdminLogin />} />
        <Route
          path='/admin/*'
          element={
            <ProtectedAdminRoute>
              <AdminInterface />
            </ProtectedAdminRoute>
          }
        />

        {/* 使用者介面路由 */}
        <Route path='/*' element={<UserInterface />} />
      </Routes>
    </BrowserRouter>
  )
}

// class App extends Component {
//   render () {
//     return (
//       <Router>
//         <div>
//           <Routes>
//             <Route path="/" Component={UserInterface} />
//             <Route path="/admin/" Component={AdminInterface} />
//             {/* <Route path="/Index" component={Index} />

//             <Route path="/Login/Index" component={Login} />
//             <Route path="/Login/Verify" component={LoginVerify} />
//             <Route path="/Login/Register" component={LoginRegister} />
//             <Route path="/Login/Password" component={LoginPassword} />

//             <Route path="/Member/Index" component={MemberIndex} />
//             <Route path="/Member/Edit" component={MemberEdit} />
//             <Route path="/Member/OrderList" component={MemberOrderList} />
//             <Route path="/Member/Order" component={MemberOrder} />
//             <Route path="/Member/Tickets" component={MemberTickets} />
//             <Route path="/Member/Collection" component={MemberCollection} />

//             <Route path="/Event/Order" component={EventOrder} />
//             <Route path="/Event/Index" component={EventIndex} />
//             <Route path="/Event/Detail/:id" component={EventDetail} />
//             <Route path="/Event/ConfirmNoseat" component={EventConfirmNoseat} />
//             <Route path="/Event/ConfirmSeat/:id" component={EventConfirmSeat} />
//             <Route path="/Event/ConfirmInfo" component={EventConfirmInfo} />

// <Route path="/Product/All" component={ProductAll} />
// <Route path="/Product/Detail" component={ProductDetail} />

//             <Route path="/Order/Cart" component={Cart} />
//             <Route path="/Order/cartCheckOut" component={cartCheckOut} />
//             <Route path="/Order/cartConfirmation" component={cartConfirmation} />

//             <Route path="/AboutUs" component={AboutUs} /> */}
//           </Routes>
//         </div>
//       </Router>
//     )
//   }
// }

// export default App
