import React from 'react'
import { Route, Routes } from 'react-router-dom'

import Footer from './components/footer'

import Index from './pages/Index'
import AboutUs from './pages/about'

import News from './pages/News'
import NewsArticle from './pages/NewsArticle'

// 介紹頁
import Skate from './pages/skate'
import Rap from './pages/HippopRap'
import DJ from './pages/DJ'
import Dance from './pages/dance'

import Login from './pages/Login'
import LoginVerify from './pages/LoginVerify'
import LoginRegister from './pages/LoginRegister'
import LoginPassword from './pages/LoginPassword'

import MemberIndex from './pages/MemberIndex'
import MemberEdit from './pages/MemberEdit'
import MemberOrderList from './pages/MemberOrderList'
import MemberOrder from './pages/MemberOrder'
import MemberTickets from './pages/MemberTickets'
import MemberCollection from './pages/MemberCollection'

import EventOrder from './pages/eventOrder'
import EventConfirmInfo from './pages/eventConfirmInfo'
import EventConfirmNoseat from './pages/eventConfirmNoseat'
import EventConfirmSeat from './pages/eventConfirmSeat'
import EventIndex from './pages/eventIndex'
import EventDetail from './pages/eventDetail'
import { TicketProvider } from './pages/TicketContext'
import ProductAll from './pages/ProductAll'
import ProductDetail from './pages/ProductDetail'

import Cart from './pages/cart'
import CartCheckout from './pages/cartCheckOut'
import CartConfirmation from './pages/cartConfirmation'

import PaymentSuccess from './pages/success'
import Graffiti from './pages/graffiti'

export default function UserInterface() {
  return (
    <div>
      <Routes>
        <Route index element={<Index />} />
        <Route path='aboutUs' element={<AboutUs />} />

        <Route path='DJ' element={<DJ />} />
        <Route path='Rap' element={<Rap />} />
        <Route path='Graffiti' element={<Graffiti />} />
        <Route path='Skate' element={<Skate />} />
        <Route path='Dance' element={<Dance />} />

        <Route path='News/Index' element={<News />} />
        <Route path='News/Article/:id' element={<NewsArticle />} />

        <Route path='Login/Index' element={<Login />} />
        <Route path='Login/Verify/reset-password/:token' element={<LoginVerify />} />
        <Route path='Login/Register' element={<LoginRegister />} />
        <Route path='Login/Password' element={<LoginPassword />} />

        <Route path='Member/Index' element={<MemberIndex />} />
        <Route path='Member/Edit' element={<MemberEdit />} />
        <Route path='Member/OrderList' element={<MemberOrderList />} />
        <Route path='/Member/Order/:id' element={<MemberOrder />} />
        <Route path='Member/Tickets' element={<MemberTickets />} />
        <Route path='Member/Collection' element={<MemberCollection />} />

        <Route path='Event/Order' element={<EventOrder />} />
        <Route path='Event/Index' element={<EventIndex />} />
        <Route path='Event/Detail/:id' element={<EventDetail />} />
        <Route path='Event/ConfirmNoseat/:id' element={<EventConfirmNoseat />} />
        <Route path='Event/ConfirmSeat/:id' element={<EventConfirmSeat />} />
        <Route path='Event/ConfirmInfo' element={<EventConfirmInfo />} />

        <Route path='Product/All' element={<ProductAll />} />
        <Route path='Product/Detail/:productId' element={<ProductDetail />} />

        <Route path='Order/Cart' element={<Cart />} />
        <Route path='Order/CartCheckout' element={<CartCheckout />} />
        <Route path='Order/CartConfirmation' element={<CartConfirmation />} />
        <Route path='Order/PaymentSuccess' element={<PaymentSuccess />} />
      </Routes>
    </div>
  )
}
