import React, { Component } from 'react';
import '../assets/news.css';
import axios from 'axios';
import Header from '../components/header';
import Footer from '../components/footer'
import { useParams, useNavigate, useLocation } from 'react-router-dom';
// 文字編輯器
import CKEditorContent from '../components/CKEditorContent';

// 這是是因為orderId所加的程式碼

function withRouter(Component) {
    return function (props) {
        const params = useParams(); 
        const navigate = useNavigate(); 
        const location = useLocation();
        return <Component {...props} params={params} navigate={navigate} location={location} />;
    };
}


const NewsCard = ({ newsId, image, type, date, title, description, isGreen, goArticle }) => {
    const newsCardMap = {
        "DJ": "DJ",
        "streetDance": "街舞",
        "rap": "饒舌",
        "graffiti": "塗鴉",
        "skate": "滑板",
    };

    const dateObj = new Date(date);
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');

    return (
        <div className="card-box" onClick={() => goArticle(newsId)}>
            <div className="newsCard-green">
                <div className="img-box">
                    <img src={`${process.env.PUBLIC_URL}${image}`} alt="" />
                </div>
                <div className="item">
                    <div className="card-wrap">
                        <p>
                            <span>/// </span><span>{newsCardMap[type] || type}</span>
                        </p>
                        <br /><br />
                        <span>{year}</span>
                        <span>{month}.{day}</span>
                    </div>
                    <div className="card-wrap">
                        <h4 className="multiline-ellipsis">{title}</h4>
                        <p className='multiline-ellipsis' dangerouslySetInnerHTML={{ __html: description }}/>
                    </div>
                    <div className="card-wrap">
                        <div className="morebtn"><i className="bi bi-arrow-right"></i></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

class NewsArticle extends Component {
    state = {
        Article: {
            "newsId": 1,
            "newsType": "rap",
            "newsTitle": "來自成都集團CDC的大陸饒舌歌手王以太",
            "coverImg": "/images/news/news1.jpg",
            "newsContent": "在2018年《中國新說唱》中取得全國前六強的好成績",
            "newsAuthor": "都敏俊",
            "newsStatus": 1,
            "pubTime": null,
            "createdAt": "2024-08-05T03:03:28.000Z",
            "updatedAt": "2024-08-17T10:34:27.000Z"
        }
        ,
        New: [],

    };
    componentDidMount() {
        window.addEventListener('scroll', this.Scroll);

        this.fetchNewsData(); 

        const { params } = this.props;
        console.log("params:", params);
        if (params && params.id) {
            this.fetchArticleData(params.id);
        } else {
            console.error("params or params.id is undefined");
        }
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.Scroll);
    }

    Scroll = () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        document.getElementById("myBar").style.width = scrolled + "%";
    };


    // 格式化日期的方法
    formatDate(dateString) {
        
        const date = new Date(dateString);

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); 
        const day = String(date.getDate()).padStart(2, '0');

        const formattedDate = `${year}/${month}/${day}`;
        console.log('Formatted Date:', formattedDate); 
        return formattedDate;
    }


    //隨機抽取新聞
    getRandomNews(newsArray, count) {
        let shuffled = newsArray.slice(0);
        let i = newsArray.length, temp, randomIndex;

        while (i !== 0) {
            randomIndex = Math.floor(Math.random() * i);
            i--;
            temp = shuffled[i];
            shuffled[i] = shuffled[randomIndex];
            shuffled[randomIndex] = temp;
        }

        // 返回前 count 專欄
        return shuffled.slice(0, count);
    }

    fetchNewsData = async () => {
        try {
            const response = await axios.get('http://localhost:3000/riverflow/news/news');
            // 獲取隨機的專欄
            const randomNews = this.getRandomNews(response.data, 5);
            this.setState({ News: randomNews });
        } catch (error) {
            console.error("Error fetching news data:", error);
        }
    };



    fetchArticleData = async (id) => {
        try {
            const response = await axios.get(`http://localhost:3000/riverflow/news/news/${id}`, {
                withCredentials: true
            });

            // 确保返回的数据是数组且非空 
            // 確保返回的數據是數組且非空
            if (Array.isArray(response.data) && response.data.length > 0) {
                const articleData = response.data[0]; //獲取第一個
                console.log("Fetched Article data:", articleData);
                this.setState({
                    Article: {
                        newsTitle: articleData.newsTitle || "文章標題",
                        coverImg: articleData.coverImg || "/images/news/default.jpg",
                        newsAuthor: articleData.newsAuthor || "未知作者",
                        createdAt: articleData.createdAt || "未知時間",
                        newsContent: articleData.newsContent || "內容缺失"
                    }
                });
            } else {
                console.error("Response data is not in expected format or is empty");
                this.setState({ error: 'No article data found.' });
            }
        } catch (error) {
            console.error("Error fetching article data:", error);
            this.setState({ error: 'Failed to fetch article data.' });
        }
    }

    getCardClass = (index) => {
        const pattern = [true, false, false, true, true, false];
        return pattern[index % pattern.length];
    };

    goArticle(newsId) {
        window.location = `/News/Article/${newsId}`
      }



    goNews = () => {
        window.location = "/News/Index";
    };

    render() {
        const { News, Article } = this.state;
        console.log("Article state:", Article);
        if (!Article || !Article.newsTitle || Article.newsTitle === "文章標題") {
            return <div>Loading...</div>;
        }





        return (
            <div>
                <Header />
                <div className="progress-container">
                    <div className="progress-bar" id="myBar"></div>
                </div>
                <section className="newsArticle newsContent">
                    <div className="news-banner">
                        <img src={this.state.Article.coverImg} alt="" />
                    </div>
                    <article>
                        <div className="news-title">
                            <h1>{Article.newsTitle || "文章標題"}</h1>
                        </div>
                        <div className="meta">
                            <h3>由<span> {Article.newsAuthor} </span>編寫</h3>
                            <span>發佈時間 :  {this.formatDate(Article.createdAt)}  </span>
                        </div>
                    </article>
                    <article>
                        <div className="wrap">
                            {/* <p dangerouslySetInnerHTML={{ __html: Article.newsContent }} /> */}
                            <CKEditorContent content={Article.newsContent} />
                        </div>
                    </article>
                </section>
                <section className="newsList">
                    <div className="newsList-title">
                        <h2>為你推薦</h2>
                    </div>
                    <div className="newsList-wrap">
                        <div className="box">
                            {Array.isArray(News) && News.length > 0 ? (
                                News.map((newItem, index) =>
                                    <NewsCard
                                        key={newItem.newsId}
                                        newsId={newItem.newsId}
                                        image={newItem.coverImg} 
                                        type={newItem.newsType}
                                        date={newItem.createdAt}
                                        title={newItem.newsTitle}
                                        description={newItem.newsContent}
                                        goArticle={this.goArticle}
                                    />
                                )
                            ) : (
                                <div>No news available</div>
                            )}
                        </div>
                    </div>
                </section>
                <div onClick={this.goNews} className="back-btn">
                    <h4>Back to List</h4>
                    <i className="bi bi-arrow-left"></i>
                </div>
                
                <Footer/>
            </div>
        );
    }
}

export default withRouter(NewsArticle);
