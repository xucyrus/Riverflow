import React from 'react';
import '../assets/graffiti.css'
import graffitiVdo from '../assets/images/Graffiti/Postcard from Bulgaria _ Friends On Foreign Soil.mov'
import graffitiIndex from '../assets/images/Graffiti/graffitiIndex.png'
import graffiti0 from '../assets/images/Graffiti/graffiti0.png'
import graffiti1 from '../assets/images/Graffiti/graffiti1.jpeg'
import graffiti3 from '../assets/images/Graffiti/graffiti3.png'
import graffiti4 from '../assets/images/Graffiti/graffiti4.jpeg'
import graffiti5 from '../assets/images/Graffiti/graffiti5.png'
import graffiti6 from '../assets/images/Graffiti/graffiti6.jpeg'
import Paste1 from '../assets/images/Graffiti/Paste1.png'
import Paste2 from '../assets/images/Graffiti/Paste2.png'
import Paste3 from '../assets/images/Graffiti/Paste3.png'
import Paste4 from '../assets/images/Graffiti/Paste4.png'
import Header from '../components/header'
import Footer from '../components/footer'

const Graffiti = () => {
  return (
    <div className="outer">
      <Header/>
      <section>
        <div className="section__content">
          <svg>
            <image
              href={graffitiIndex}
              x="50%"
              y="50%"
              width="200"
              height="200"
              transform="translate(-100, -100)"
            />
          </svg>
        </div>
      </section>
      <section>
        <video
          src={graffitiVdo}
          autoPlay
          muted
          loop
          playsInline
        ></video>
        <div className="section__content">
          <p>
            作為嘻哈文化的四大元素之一，塗鴉（ Graffiti ）最早發跡於 1960
            年代的紐約布朗克斯區，當時的黑人青少年因為長期受到種族歧視與不平等對待，於是將不滿的情緒宣洩在隨處塗鴉上，任意在街上寫下帶有諷刺意味的文字和圖樣，也讓當年的塗鴉創作被視為髒亂的象徵。後來隨著時代變遷，加上嘻哈文化的流行，塗鴉漸漸成為一種透過圖像、字體向社會表達自我的藝術形式。
          </p>
        </div>
      </section>
      <section className="w-bg illustrate">
        <div>
          <img 
            className="graffiti1" 
            src={graffiti0} 
            alt=""
            style={{width: '25%', transform: 'scaleX(-1) rotate(-30deg)', position: 'absolute', left: '2rem'}}
          />

          <div className="graffitiContent">
            <div>
              <h4>什麼樣的創作可以被稱為街頭塗鴉</h4>
              <p>
                塗鴉(Graffiti)其實沒有非常硬性的定義，但通常是指在公共空間或私有設施、牆壁上做的人為標記，這些人為標記可以是一幅圖畫，也可以是圖騰或純文字。大部分能看到街頭塗鴉的地點有建築外牆、商店鐵捲門或是大眾運輸工具上。（當然，沒有經過設施擁有者許可的塗鴉一般屬於違法或犯罪行為。）
              </p>
              <p>
                街頭塗鴉通常以噴漆或是麥克筆在牆上作畫，字體設計與圖樣的變化可以根據使用的工具而有所不同。例如，噴漆罐可以更換不同的噴頭，噴頭有許多種類的尺寸和形狀，不同的噴頭款式可以產生不同的線寬和噴霧效果。
              </p>
            </div>
            <img src={graffiti1} alt="" />
          </div>
          
          <img className="graffiti3" src={graffiti3} alt="" />
          <img className="graffiti5" src={graffiti5} alt="" />
          
          <div className="graffitiContent2">
            <img src={graffiti4} alt="" />
            <div>
              <h4>街頭塗鴉可以細分成哪些形式？</h4>
              <p>
                街頭塗鴉可以根據創作的內容以及難度分為三種形式：標貼塗鴉（tag）、拋擲塗鴉（throw-up）、大作塗鴉（piece）。
              </p>
              <p>
                第一種 tag 是從 1960
                年代的美國青少年幫派發展出來，他們會將自己的名字經過設計後直接用麥克筆或噴漆簽在牆上，或是做成貼紙貼在牆上，方便又快速的創作手法是最適合入門的塗鴉形式。
              </p>
              <p>
                第二種 throw-up
                通常是指單一填色勾邊的圖像形式，使用兩種以上的顏色作畫，並在基本的圖樣或字母加上反光點、厚度、陰影等等，讓塗鴉空間化並增加立體感，有不同的字體、風格之分，最常見的
                throw-up
                字體是「泡泡字（bubble）」，圓潤的字體外型方便寫手迅速作畫，能在短時間內留下標記，是目前街頭塗鴉的主流。
              </p>
              <p>
                第三種 piece 是三種塗鴉形式裡難度最高的，英文的 piece 是 masterpiece
                的縮寫，通常指一件「大型塗鴉藝術作品」。這種類型的塗鴉有完整的構圖與設計，需要花費較多心力在創作上。這類作品需要較大的空間，也會利用多樣的畫作技法進行創作，藝術效果最明顯，大部分的大作塗鴉會在指定的合法區域內完成（例如：河濱公園的塗鴉區、西門電影公園等等），是完整度最高的塗鴉創作。
              </p>
            </div>
          </div>
          
          <img className="paste1" src={Paste1} alt="" />
          <img className="paste2" src={Paste2} alt="" />
          <img className="paste3" src={Paste3} alt="" />
          <img className="paste4" src={Paste4} alt="" />
          
          <div className="graffitiContent3">
            <div>
              <h4>塗鴉寫手保持匿名、不露臉的原因</h4>
              <p>
                從事街頭塗鴉的藝術家被稱為寫手（writer），寫手們會為自己取一個專屬的簽名符號（tag，類似在塗鴉圈中使用的藝名），不公開自己的真實姓名或露臉，主要是為了保護身份並避開法律責任。大部分的寫手在塗鴉時會戴上面罩，則是為了防止吸入噴漆影響身體健康。
              </p>
            </div>
            <img src={graffiti6} alt="" />
          </div>
        </div>

        <Footer />
      </section>
    </div>
  );
};

export default Graffiti;