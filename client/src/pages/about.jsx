import React from 'react'
import '../assets/style.css'
import AboutBanner from '../assets/images/aboutBanner.jpg'
import MemberPic1 from '../assets/images/memberPic_01.png'
import Header from '../components/header'

export default function AboutUs () {
  return (
    <div className='aboutPage'>
      <Header />
      <section>
        <div className='aboutBanner'>
          <img src={AboutBanner} alt='about_banner' />
        </div>
      </section>
      <section className='container'>
        <div className='gtitle'>
          <span>Members</span>
        </div>
        <div id='aboutMem01' className='memberIntro flex'>
          <div className='memImgBlk'>
            <img src={MemberPic1} alt='member_pic01' />
            <div className='memLabel'>Team Leader</div>
            <div className='memLabel purple'>Cat Lover :）</div>
          </div>
          <div className='memInfoBlk'>
            <div className='memNameInfo flex'>
              <div className='memName'>名字</div>
              <div className='memLink flex'>
                <a href='#'>
                  <i className='fa-brands fa-square-behance' />
                </a>
                <a href='#'>
                  <i className='fa-brands fa-instagram' />
                </a>
              </div>
            </div>
            <p>簡短的自我介紹約50字?簡短的自我介紹約50字?簡短的自我介紹約50字?簡短的自我介紹約50字?</p>
          </div>
        </div>
        <div id='aboutMem02' className='memberIntro flex picRight'>
          <div className='memImgBlk'>
            <img src={MemberPic1} alt='member_pic02' />
            <div className='memLabel purple label2'>UI/UX Designer</div>
            <div className='memLabel label2'>Gamer</div>
          </div>
          <div className='memInfoBlk'>
            <div className='memNameInfo flex'>
              <div className='memName'>名字</div>
              <div className='memLink flex'>
                <a href='#'>
                  <i className='fa-brands fa-square-behance' />
                </a>
                <a href='#'>
                  <i className='fa-brands fa-instagram' />
                </a>
              </div>
            </div>
            <p>
              簡短的自我介紹約50字?簡短的自我介紹約50字?簡短的自我介紹約50字?簡短的自我介紹約50字?簡短的自我介紹約50字?
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
