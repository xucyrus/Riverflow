import React, { Component } from 'react'
import '../assets/rap.css'
import Header from '../components/header'
import Footer from '../components/footer'

class Rap extends Component {

    componentDidMount() {
        document.body.classList.remove('w-bg');
    
        const buttons = document.querySelectorAll('.tablinks');
        const audio = document.getElementById('audio');
    
        buttons.forEach(button => {
            button.addEventListener('click', this.ButtonClick);
        });
    
        const stopbtn = document.getElementById('stopbtn');
        stopbtn.addEventListener('click', this.StopButtonClick);
    }
    
    componentWillUnmount() {
        document.body.classList.add('w-bg');
    
        const buttons = document.querySelectorAll('.tablinks');
        buttons.forEach(button => {
            button.removeEventListener('click', this.ButtonClick);
        });
    
        const stopbtn = document.getElementById('stopbtn');
        stopbtn.removeEventListener('click', this.StopButtonClick);
    }
    
    ButtonClick = (event) => {
        const audio = document.getElementById('audio');
        const audioSrc = event.target.getAttribute('data-audio');
    
        console.log("Button clicked:", audioSrc);
        if (!audio.paused) {
            audio.pause();
        }
        audio.currentTime = 0;
        audio.src = audioSrc;
        console.log("Audio source set to:", audio.src);
        audio.load();
        audio.oncanplaythrough = () => {
            console.log("Audio can play through, starting playback...");
            if (audio.paused) {
                audio.play().catch(error => {
                    console.error("播放音频时出错：", error);
                });
            } else {
                console.log("Audio is already playing, not restarting playback.");
            }
        };
    };
    
    StopButtonClick = () => {
        const audio = document.getElementById('audio');
        console.log("STOP button clicked. Pausing audio...");
        audio.pause();
        audio.currentTime = 0;
        audio.oncanplaythrough = null; // 移除監聽防止音樂播放
        console.log("Audio paused and reset to start.");
    };
    
    render() {
        return (
            <div>
                <Header />
                <section class="rap">
                    <div class="gtitle">
                        <h1>Rap Music</h1>
                    </div>

                    <div class="rap-container">
                        <div class="beatmaker-box">
                            <div class="beatmaker">
                                <div class="screen">
                                    <span id="beatname">Boombap</span>
                                </div>
                                <div class="keyboard">
                                    <div class="keyboard-btn">
                                        <button class="tablinks" data-audio="/rapmusic/boombap.mp3"
                                            onClick={(e) => this.openBeat(e, 'Boombap')}>Boombap</button>

                                    </div>
                                    <div class="keyboard-btn">
                                        <button class="tablinks" data-audio="/rapmusic/jazz.mp3"
                                            onClick={(e) => this.openBeat(e, 'Jazz')}>Jazz</button>
                                    </div>
                                    <div class="keyboard-btn">
                                        <button class="tablinks" data-audio="/rapmusic/GFunk.mp3"
                                            onClick={(e) => this.openBeat(e, 'GFunk')}>G-Funk</button>
                                    </div>
                                    <div class="keyboard-btn">
                                        <button class="tablinks" data-audio="/rapmusic/Trap.mp3"
                                            onClick={(e) => this.openBeat(e, 'Trap')}>Trap</button>
                                    </div>
                                    <div class="keyboard-btn">
                                        <button class="tablinks" data-audio="/rapmusic/Drill.mp3"
                                            onClick={(e) => this.openBeat(e, 'Drill')}>Drill</button>
                                    </div>
                                    <div class="keyboard-btn">
                                        <button class="tablinks" data-audio="/rapmusic/Emo.mp3"
                                            onClick={(e) => this.openBeat(e, 'Emo')}>Emo</button>
                                    </div>
                                    <div class="keyboard-btn">
                                        <button class="tablinks" data-audio="/rapmusic/Mumble.mp3"
                                            onClick={(e) => this.openBeat(e, 'Mumble')}>Mumble</button>
                                    </div>
                                    <div class="keyboard-btn">
                                        <button class="tablinks" data-audio="/rapmusic/Hardcore.mp3"
                                            onClick={(e) => this.openBeat(e, 'Hardcore')}>Hardcore</button>
                                    </div>
                                    <div class="keyboard-btn">
                                        <button class="tablinks" data-audio="/rapmusic/Alternative.mp3"
                                            onClick={(e) => this.openBeat(e, 'Alternative')}>Alternative</button>
                                    </div>

                                </div>

                                <div class="stopbtn">
                                    <button id="stopbtn">STOP</button>
                                </div>
                                <audio id="audio" volume="1.0"></audio>
                            </div>

                        </div>

                        <div class="wrap">
                            <div id="Boombap" class="tabcontent">
                                <h1 class="animate__animated animate__fadeInUp">Boombap</h1>
                                <p class="animate__animated animate__fadeInUp">
                                    BoomBap講究用最少的伴奏器材來製作最多有韻律的節奏。整首基本節奏，然後強調大鼓， 所以聽起來就是（Boom-Bap Boom-Boom
                                    Bap）很規律，歌詞也多是關於自己人生的自傳類故事或者批判社會類型的。
                                </p>
                            </div>
                            <div id="Jazz" class="tabcontent">
                                <h1 class="animate__animated animate__fadeInUp">Jazz</h1>
                                <p class="animate__animated animate__fadeInUp">
                                    通常他的伴奏都取樣(sample)來自Jazz，裡面的旋律比較繚繞，有一種挑逗的感覺，通常不是一個循環，在幾個小節之後會有變化。
                                </p>
                            </div>
                            <div id="GFunk" class="tabcontent">
                                <h1 class="animate__animated animate__fadeInUp">G-Funk</h1>
                                <p class="animate__animated animate__fadeInUp">
                                    是一種融合了匪幫饒舌（Gangsta Rap）與放克的曲風，伴奏取樣Funk音樂，抒情女聲、厚重bass line、合成器等等元素，內容大多把妹、吸毒、殺人、搶劫之類的。
                                </p>
                            </div>
                            <div id="Trap" class="tabcontent">
                                <h1 class="animate__animated animate__fadeInUp">Trap</h1>
                                <p class="animate__animated animate__fadeInUp">
                                    「Trap」一詞起源於美國南部的亞特蘭大，過去指的是進行毒品交易的地方，那裡的饒舌歌手是最早在音樂中使用這個詞的人。嚴格來說Trap是一種分支的音樂風格(Trap
                                    Music)，Beat中很常用到TR
                                    808的鼓組、緊密的hi-hat，加上電子合成器與管弦樂的聲響，營造出一個整體陰暗、誘惑、迷幻的氛圍。歌詞主要以錢、車、毒品、武器、泡妞、炫耀，派對等主題為核心。

                                    正因為Trap是一種音樂風格、編曲風格又或是說一種音樂元素，所以在很多New school音樂裡常常可以聽到Trap的影子。
                                </p>
                            </div>
                            <div id="Drill" class="tabcontent">
                                <h1 class="animate__animated animate__fadeInUp">Drill</h1>
                                <p class="animate__animated animate__fadeInUp">
                                    既然身為 Trap 的分支，Drill music 既在編曲承襲陷阱特色，又更加強調黑暗氛圍——大多採樣 邪典鋼琴殘響 做為主基調，凸顯凶狠的街頭與史詩感；由合成器縈繞沉重鼓點、細碎
                                    Hi-hat（爵士鼓組中的腳踏鈸）散佈在曲中各處，不時加入鈴聲、軍鼓點綴，最後放入 808 鼓機獨有的低頻音色 (如 Slide 等) 加以填充完成；而鑽頭音樂底下分佈甚廣的 Chicago
                                    Drill、UK Drill 和 Brooklyn Drill 間會有所不同，在後面內文中也將一併聊到。
                                </p>
                            </div>
                            <div id="Emo" class="tabcontent">
                                <h1 class="animate__animated animate__fadeInUp">Emo</h1>
                                <p class="animate__animated animate__fadeInUp">
                                    音樂題材圍繞著藥物、憂鬱、死亡等較沈重的題材，以緩慢的吟唱加上層層堆疊的柔和旋律，創造出無法自拔的傷感氛圍，歌曲裡也經常性地出現歇斯底里式的吶喊。
                                </p>
                            </div>
                            <div id="Mumble" class="tabcontent">
                                <h1 class="animate__animated animate__fadeInUp">Mumble</h1>
                                <p class="animate__animated animate__fadeInUp">
                                    指含糊不清的說唱方式，模糊不清的Flow風格和無意義的歌詞，把人聲直接當成一種樂器，完全捨棄複雜的詞，幾個簡單的詞一直重複。
                                </p>
                            </div>
                            <div id="Hardcore" class="tabcontent">
                                <h1 class="animate__animated animate__fadeInUp">Hardcore</h1>
                                <p class="animate__animated animate__fadeInUp">
                                    直譯成中文就是硬核說唱，具有極強的破壞力和煽動力，它的特徵常是憤怒、侵略和對抗，主要凸顯技術的說唱，用高難度的Flow、刁鑽的技巧、或超高速的吐字量，製造一種強硬的壓迫感。
                                </p>
                            </div>
                            <div id="Alternative" class="tabcontent">
                                <h1 class="animate__animated animate__fadeInUp">Alternative</h1>
                                <p class="animate__animated animate__fadeInUp">
                                    另類嘻哈 (又被稱作另類說唱)
                                    ，對其定義眾說紛紜，說唱音樂有其固有形式，而另類嘻哈則不遵從這些傳統形式，其流派模糊，包含鄉土爵士樂、流行音樂/搖滾樂、爵士樂、靈魂樂和雷鬼音樂。反正無法歸類的都會先被算這種。
                                </p>
                            </div>

                        </div>


                    </div>

                </section>
                <Footer/>
            </div>
        )
    }

    openBeat(evt, BeatName) {
        var i, tabcontent, tablinks;
        tabcontent = document.getElementsByClassName("tabcontent");
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";

        }
        tablinks = document.getElementsByClassName("tablinks");
        for (i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(" active", "");
        }
        document.getElementById(BeatName).style.display = "block";
        evt.currentTarget.className += " active";

        const beatname = document.getElementById("beatname");
        beatname.innerText = BeatName
    }

    componentDidUpdate() {
        document.getElementById("defaultOpen").click();
    }



}

export default Rap