import { Link, NavLink, useLocation } from 'react-router-dom'
import HeaderLogo from '../assets/images/riverflow_logo.png'

export default function Header() {
  const location = useLocation()
  const isHomePage = location.pathname === '/'

  window.onload = function () {
    const dropdown = document.querySelector('.dropdown')
    dropdown.addEventListener('click', dropDown)

    const dropdownMob = document.querySelector('.dropdown_mob')
    dropdownMob.addEventListener('click', dropDownMob)

    const menuIcon = document.querySelector('.menuIcon')
    menuIcon.addEventListener('click', menuExpand)

    function dropDown() {
      const arrow = document.querySelector('.bi-caret-down-fill')
      // console.log(arrow)
      const dropMenu = document.querySelector('.cultureList')
      dropMenu.classList.toggle('expand')
      arrow.classList.toggle('rotate')
    }

    function dropDownMob() {
      const arrow = document.querySelector('.bi-caret-down-fill_mob')
      const dropMenu = document.querySelector('.cultureList_mob')
      dropMenu.classList.toggle('expand')
      arrow.classList.toggle('rotate')
    }

    function menuExpand() {
      const menu = document.querySelector('.headerLink.mob')
      menu.classList.toggle('expand')
    }
  }

  return (
    <header class={`${isHomePage ? 'sticky-navbar' : ''}`}>
      <div class='flex container '>
        <Link to='/'>
          <img class='logo' src={HeaderLogo} alt='logo' />
        </Link>
        <div class='flex header-right'>
          <ul class='headerLink flex'>
            <li>
              <NavLink to='/'>首頁</NavLink>
            </li>
            <li class='cultureListName dropdown'>
              <a class='dropdownToggle'>
                嘻哈文化<i class='bi bi-caret-down-fill'> </i>
              </a>
              <div id='dropdownMenu' class=''>
                <ul class='cultureList flex'>
                  <li>
                    <a href='/DJ' class='cultureOpt'>
                      DJ
                    </a>
                  </li>
                  <li>
                    <a href='/Dance' class='cultureOpt'>
                      街舞
                    </a>
                  </li>
                  <li>
                    <a href='/RAP' class='cultureOpt'>
                      饒舌
                    </a>
                  </li>
                  <li>
                    <Link to='/Graffiti' class='cultureOpt'>
                      塗鴉
                    </Link>
                  </li>
                  <li>
                    <Link to='/skate' class='cultureOpt'>
                      滑板
                    </Link>
                  </li>
                </ul>
              </div>
            </li>
            <li>
              <NavLink to='/News/Index'>嘻哈專欄</NavLink>
            </li>
            <li>
              <NavLink to='/Event/Index'>into flow</NavLink>
            </li>
            <li>
              <NavLink to='/Product/All'>商店</NavLink>
            </li>
          </ul>
          <div class='functionIcons flex'>
            <Link to='/Member/Tickets' class='headerIcon'>
              <i class='bi bi-ticket-perforated'> </i>
            </Link>
            <Link to='/Order/Cart' class='headerIcon'>
              <i class='bi bi-cart'> </i>
            </Link>
            <Link to='/Member/Index' class='headerIcon'>
              <i class='bi bi-person'> </i>
            </Link>
            <div class='headerIcon mobOnly'>
              <input id='menuBtn' class='menuBtn' type='checkbox' />
              <label htmlFor='menuBtn' class='menuIcon'>
                <span class='navigation'> </span>
              </label>
            </div>
          </div>
        </div>
      </div>
      <div class='mobMenu'>
        <ul class='headerLink mob flex'>
          <li>
            <NavLink to='/'>首頁</NavLink>
          </li>
          <li class='cultureListName dropdown dropdown_mob'>
            <a class='dropdownToggle'>
              嘻哈文化<i class='bi bi-caret-down-fill bi-caret-down-fill_mob'> </i>
            </a>
            <div id='dropdownMenu'>
              <ul class='cultureList cultureList_mob flex'>
                <li>
                  <a href='#' class='cultureOpt'>
                    DJ
                  </a>
                </li>
                <li>
                  <a href='#' class='cultureOpt'>
                    街舞
                  </a>
                </li>
                <li>
                  <a href='#' class='cultureOpt'>
                    饒舌
                  </a>
                </li>
                <li>
                  <a href='#' class='cultureOpt'>
                    塗鴉
                  </a>
                </li>
                <li>
                  <a href='#' class='cultureOpt'>
                    滑板
                  </a>
                </li>
              </ul>
            </div>
          </li>
          <li>
            <a href='#'>嘻哈專欄</a>
          </li>
          <li>
            <NavLink to='/Event/Index'>into flow</NavLink>
          </li>
          <li>
            <NavLink to='/Product/All'>商店</NavLink>
          </li>
        </ul>
      </div>
    </header>
  )
}
