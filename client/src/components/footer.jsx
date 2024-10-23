import React from 'react'
import { Link } from 'react-router-dom'
// import '../assets/basic.css'
import FooterLogo from '../assets/images/riverflow_logo_f.png'

export default function Footer () {
  return (
    <footer>
      <div className='flex container'>
        <img className='logo' src={FooterLogo} alt='logo' />
        <div className='flex footer-right'>
          <div className='flex linkList'>
            <Link to='/aboutUs' className='footerLink'>
              關於我們
            </Link>
            <a href='#' className='footerLink'>
              聯絡我們
            </a>
            <a href='#' className='footerLink'>
              條款與隱私
            </a>
            <a href='#' className='footerLink'>
              FAQ
            </a>
          </div>
          <span className='copyright'>Copyright © 2006-2024 RiverFlow</span>
        </div>
      </div>
    </footer>
  )
}
