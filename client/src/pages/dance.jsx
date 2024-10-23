import React, { useEffect } from 'react'
import '../assets/dance.css'
import '../assets/dance-2.css'
import Header from '../components/header'
import Footer from '../components/footer'

import AOS from 'aos'
import 'aos/dist/aos.css'
import anime from 'animejs/lib/anime.es.js'

// 圖片資源
import image1 from '../assets/images/dance/街舞1.jpeg'
import image2 from '../assets/images/dance/街舞2.jpg'
import image3 from '../assets/images/dance/街舞3.jpg'

let player

// 定義在 useEffect 外部
const onPlayerReady = (event) => {
  // event.target.playVideo()
}

const onPlayerStateChange = (event) => {
  if (event.data === window.YT.PlayerState.ENDED) {
    // 處理影片播放結束的邏輯
  }
}

const Dance = () => {
  useEffect(() => {
    // 初始化 AOS (Animate On Scroll)
    AOS.init()

    // 模擬點擊預設的頁籤
    document.getElementById('defaultOpen').click()

    // 加載 YouTube Iframe API
    const tag = document.createElement('script')
    tag.src = 'https://www.youtube.com/iframe_api'
    const firstScriptTag = document.getElementsByTagName('script')[0]
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)

    // YouTube API 的初始化函數
    window.onYouTubeIframeAPIReady = () => {
      player = new window.YT.Player('player', {
        height: '60%',
        width: '100%',
        videoId: 'JCN2RMklDU8',
        events: {
          onReady: onPlayerReady,
          onStateChange: onPlayerStateChange
        }
      })
    }

    // anime.js 動畫效果
    const ml4 = {
      opacityIn: [0, 1],
      scaleIn: [0.2, 1],
      scaleOut: 3,
      durationIn: 800,
      durationOut: 600,
      delay: 500
    }

    anime
      .timeline({ loop: true })
      .add({
        targets: '.ml4 .letters-1',
        opacity: ml4.opacityIn,
        scale: ml4.scaleIn,
        duration: ml4.durationIn
      })
      .add({
        targets: '.ml4 .letters-1',
        opacity: 0,
        scale: ml4.scaleOut,
        duration: ml4.durationOut,
        easing: 'easeInExpo',
        delay: ml4.delay
      })
      .add({
        targets: '.ml4 .letters-2',
        opacity: ml4.opacityIn,
        scale: ml4.scaleIn,
        duration: ml4.durationIn
      })
      .add({
        targets: '.ml4 .letters-2',
        opacity: 0,
        scale: ml4.scaleOut,
        duration: ml4.durationOut,
        easing: 'easeInExpo',
        delay: ml4.delay
      })
      .add({
        targets: '.ml4 .letters-3',
        opacity: ml4.opacityIn,
        scale: ml4.scaleIn,
        duration: ml4.durationIn
      })
      .add({
        targets: '.ml4 .letters-3',
        opacity: 0,
        scale: ml4.scaleOut,
        duration: ml4.durationOut,
        easing: 'easeInExpo',
        delay: ml4.delay
      })
      .add({
        targets: '.ml4 .letter-1',
        opacity: 0.9,
        duration: 500,
        delay: 500
      })

    // 處理 cursor 效果
    const cursor = document.getElementsByClassName('cursor')[0]

    if (cursor) {
      document.onmousemove = (ev) => {
        cursor.style.top = `${ev.clientY}px`
        cursor.style.left = `${ev.clientX}px`
      }
    }

    const images = document.querySelectorAll('.image')
    if (images.length > 0) {
      images.forEach((item) => {
        item.addEventListener('mouseover', () => {
          cursor?.classList.add('active')
        })
        item.addEventListener('mouseleave', () => {
          cursor?.classList.remove('active')
        })
      })
    }

    window.addEventListener('scroll', () => {
      const container2 = document.querySelector('.container-2')
      if (container2) {
        container2.style.bottom = `${window.scrollY * -1}px`
      }
    })
  }, [])

  // 處理分頁按鈕切換
  const openCity = (evt, cityName) => {
    const tabcontent = document.getElementsByClassName('tabcontent')
    for (let i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = 'none'
    }
    const tablinks = document.getElementsByClassName('tablinks')
    for (let i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(' active', '')
    }
    document.getElementById(cityName).style.display = 'block'
    evt.currentTarget.className += ' active'
  }

  // 處理影片切換
  const loadVideo = (videoId) => {
    if (player && player.loadVideoById) {
      player.loadVideoById(videoId)
    } else {
      player = new window.YT.Player('player', {
        height: '60%',
        width: '100%',
        videoId: videoId,
        events: {
          onReady: onPlayerReady,
          onStateChange: onPlayerStateChange
        }
      })
    }
  }

  return (
    <div>
      {/* 頂部導航 */}
      <Header />
      <div className='danceAll'>
        <section className='banner'>
          <div className='ml4'>
            <div className='letters letters-1'>
              <img src={image1} alt='街舞' />
              <p>街舞</p>
            </div>
            <div className='letters letters-2'>
              <img src={image2} alt='節奏' />
              <p>節奏</p>
            </div>
            <div className='letters letters-3'>
              <img src={image3} alt='律動' />
              <p>律動</p>
            </div>
          </div>
        </section>

        <section className='Dance-container'>
          <div className='container-1'>
            <div data-aos='fade-right' data-aos-duration='1500' className='image'>
              <img
                src='https://static01.nyt.com/images/2020/07/05/arts/05dancer-in-nyc-1/05dancer-in-nyc-1-mediumSquareAt3X.jpg'
                alt='街舞圖片1'
              />
            </div>
            <div data-aos='fade-right' data-aos-duration='1500' className='image'>
              <img src='https://miro.medium.com/v2/resize:fit:1400/0*OoC5Wlrg2wF_t9Nj.jpg' alt='街舞圖片2' />
            </div>
            <div data-aos='fade-right' data-aos-duration='1500' className='image'>
              <img
                src='https://cdn.prod.website-files.com/5e2b8863ba7fff8df8949888/65b013aa4ac5e8eb92098e91_5e28eb130ab615fb245115a5_what-is-popping-dance.jpeg'
                alt='街舞圖片3'
              />
            </div>
            <div data-aos='fade-right' data-aos-duration='1500' className='image'>
              <img
                src='https://bucket-img.tnlmedia.com/cabinet/2023/08/6a785c7c-809a-40d6-90ac-d4d367c79955.png'
                alt='街舞圖片4'
              />
            </div>
            <div data-aos='fade-right' data-aos-duration='1500' className='image'>
              <img
                src='https://cdn.blackpoolgrand.co.uk/app/uploads/2020/01/Jinjo17_Credit_Belinda_Lawley-1.jpg'
                alt='街舞圖片5'
              />
            </div>
            <div data-aos='fade-right' data-aos-duration='1500' className='image'>
              <img
                src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSQw1RpF_27jtFAG5oFnzyFcGmbIlfdf0U4g&s'
                alt='街舞圖片6'
              />
            </div>
          </div>

          <div className='container-text-1 font' data-aos='zoom-in' data-aos-duration='1500'>
            <h2>街舞的起源</h2>
            <p>
              街舞，又稱為嘻哈舞（Hip-Hop Dance），起源於美國的紐約市，最早是在 1970
              年代由街頭舞者開始的。當時街頭文化受到多種音樂流派影響，包括放克（Funk）、靈魂樂（Soul）、以及早期的嘻哈音樂。
              這些舞者在街頭、俱樂部、甚至是公園中，透過即興表演來展示他們的舞技，並逐漸發展出多種街舞風格。
            </p>
          </div>

          <div className='container-text-2 font' data-aos='zoom-in' data-aos-duration='1500'>
            <h2>Breaking（霹靂舞）</h2>
            <p>
              Breaking 是最早的街舞形式之一，也常被稱為 B-Boying 或
              B-Girling。這種舞蹈注重地板動作、旋轉技巧以及力量的表現。 Breaking
              的四大元素包括：Toprock（站立動作）、Downrock（地板動作）、Freeze（定格動作）、以及Power
              Moves（力量動作）。
            </p>
          </div>

          <div className='container-text-3 font' data-aos='zoom-in' data-aos-duration='1500'>
            <h2>Popping（震撼舞）</h2>
            <p>
              Popping 是一種以肌肉收縮和放鬆來創造出震動效果的舞蹈風格，通常伴隨著機械式的動作和精確的節奏感。這種風格在
              1970 年代由 Boogaloo Sam 所創立，是 Funk 舞蹈文化的一部分。
            </p>
          </div>

          <div className='container-text-4 font' data-aos='zoom-in' data-aos-duration='1500'>
            <h2>Locking（鎖舞）</h2>
            <p>
              Locking 是由 Don Campbell 在 1970
              年代創立的舞蹈風格。這種舞蹈以突然的定格動作（Lock）和誇張的手勢、姿態為特色，舞者常常會在表演中與觀眾互動，展現出強烈的舞台感。
            </p>
          </div>

          <div className='container-text-5 font' data-aos='zoom-in' data-aos-duration='1500'>
            <h2>Hip-Hop（嘻哈舞）</h2>
            <p>
              Hip-Hop
              舞的風格多樣化，結合了多種舞蹈元素，如流暢的步伐、搖擺的動作以及快速的腳步變換。這種舞蹈通常以團隊的形式表演，強調舞者之間的互動和節奏感。
            </p>
          </div>

          <div className='container-text-6 font' data-aos='zoom-in' data-aos-duration='1500'>
            <h2>Krumping（狂放舞）</h2>
            <p>
              Krumping
              是一種充滿力量和情感表達的舞蹈風格，起源於美國洛杉磯的街頭。這種舞蹈注重強烈的身體律動、面部表情以及情感的釋放。
            </p>
          </div>

          <div className='container-3 '>
            <div data-aos='fade-left' data-aos-duration='1500' className='image'>
              <img
                src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjlYI3HaMcAOAUFue1eTyw6QmCL1LBjYcoSg&s'
                alt='街舞圖片7'
              />
            </div>
            <div data-aos='fade-left' data-aos-duration='1500' className='image'>
              <img
                src='https://compote.slate.com/images/16649c8b-29ad-4954-9b0a-45f5e82373a3.jpeg?crop=1560%2C1040%2Cx0%2Cy0'
                alt='街舞圖片8'
              />
            </div>
            <div data-aos='fade-left' data-aos-duration='1500' className='image'>
              <img
                src='https://img.redbull.com/images/c_crop,x_1135,y_0,h_3456,w_2592/c_fill,w_450,h_600/q_auto:low,f_auto/redbullcom/2020/8/24/gbrtlbsc4gh4shxgkebq/greenteck-popping-workshop'
                alt='街舞圖片9'
              />
            </div>
            <div data-aos='fade-left' data-aos-duration='1500' className='image'>
              <img src={image2} alt='街舞圖片10' />
            </div>
            <div data-aos='fade-left' data-aos-duration='1500' className='image'>
              <img
                src='https://cdn.prod.website-files.com/5e2b8863ba7fff8df8949888/65b01374ff505575209fdadd_bam-martin-limelight-sbu-beats-basic.jpeg'
                alt='街舞圖片11'
              />
            </div>
            <div data-aos='fade-left' data-aos-duration='1500' className='image'>
              <img
                src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSIlB4lRBpWLAXDKHrwYoshquQpJr1TqE1KOw&s'
                alt='街舞圖片12'
              />
            </div>
          </div>
        </section>

        <section className='btmDance' data-aos='zoom-in' data-aos-duration='2000'>
          <div className='container'>
            <div className='maintitle'> HOW TO DANCE</div>
            <div style={{ display: 'flex' }}>
              <div className='col-4' style={{ marginTop: '20vh', padding: '5vh', display: 'flex' }}>
                <div className='tab'>
                  <button
                    className='tablinks'
                    style={{ borderRadius: '21px 0px 0px 0px' }}
                    onClick={(e) => openCity(e, 'BREAK')}
                    id='defaultOpen'
                  >
                    BREAK
                  </button>
                  <button className='tablinks' onClick={(e) => openCity(e, 'POP')}>
                    POP
                  </button>
                  <button className='tablinks' onClick={(e) => openCity(e, 'LOCK')}>
                    LOCK
                  </button>
                  <button
                    className='tablinks'
                    style={{ borderRadius: '0px 0px 0px 21px' }}
                    onClick={(e) => openCity(e, 'HIPHOP')}
                  >
                    HIPHOP
                  </button>
                </div>

                <div id='BREAK' className='tabcontent'>
                  <button onClick={() => loadVideo('JCN2RMklDU8')}>TOPROCK | Indian Step</button>
                  <button onClick={() => loadVideo('3s6lAxak9LY')}>TOPROCK | Two Step</button>
                  <button onClick={() => loadVideo('FH4l_6FAwp4')}>TOPROCK | Salsa Step</button>
                  <button onClick={() => loadVideo('5W_TD4p6r48')}>TOPROCK | MARCHING STEPS</button>
                  <button onClick={() => loadVideo('6797nFQw6xY')}>FOOTWORK | Six Step</button>
                  <button onClick={() => loadVideo('4wyQ5gzEbCA')}>FOOTWORK | CC</button>
                  <button onClick={() => loadVideo('0dB7JjpBMtI')}>POWERMOVE | Windmill</button>
                  <button onClick={() => loadVideo('8w2OAzzwl84')}>POWERMOVE | Flare</button>
                  <button onClick={() => loadVideo('1vG2S9oE1wA')}>POWERMOVE | AirFlare</button>
                </div>

                <div id='POP' className='tabcontent'>
                  <button onClick={() => loadVideo('ARuho3eTVKo')}>BASIC | POPS</button>
                  <button onClick={() => loadVideo('EfkgoZbVL98')}>BASIC | ROBOT</button>
                  <button onClick={() => loadVideo('9Zd1LnclWug')}>BASIC | BOOGALOO</button>
                  <button onClick={() => loadVideo('-lrINh3JetY')}>BASIC | WAVE</button>
                  <button onClick={() => loadVideo('MvbYzMbNuLo')}>BASIC | DRILLS</button>
                  <button onClick={() => loadVideo('CJ2fdXVjSuw')}>BASIC | COBRA</button>
                </div>

                <div id='LOCK' className='tabcontent'>
                  <button onClick={() => loadVideo('d4jXQmXnvzo')}>BASIC | LOCK</button>
                  <button onClick={() => loadVideo('c11qFFGuxCw')}>BASIC | SCOOBOT</button>
                  <button onClick={() => loadVideo('-l2KbyrPKBo')}>BASIC | POINTS</button>
                  <button onClick={() => loadVideo('AvOzCKlo6NU')}>BASIC | SKEETER RABBIT</button>
                  <button onClick={() => loadVideo('DsjtWYuPSvE')}>BASIC | ALPHA</button>
                </div>

                <div id='HIPHOP' className='tabcontent'>
                  <button onClick={() => loadVideo('Aj34T435FAg')}>BASIC | BOUNCE</button>
                  <button onClick={() => loadVideo('ymvs5k6wfxo')}>BASIC | ROLLING</button>
                  <button onClick={() => loadVideo('ucItVcz5BHs')}>BASIC | ROCK</button>
                  <button onClick={() => loadVideo('LMsybwOj2EM')}>BASIC | CRISS CROSS</button>
                </div>
              </div>

              <div className='col-8' style={{ marginTop: '20vh', padding: '5vh' }}>
                <div className='title' style={{ marginButtom: '10vh' }}>
                  動作介紹
                </div>
                <div style={{ border: '4px solid #BAF13A' }} id='player'></div>
              </div>
            </div>
          </div>
        </section>
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />

        <br />
        <br />
        <br />
        <br />
      </div>
      {/* <Footer /> */}
    </div>
  )
}

export default Dance
