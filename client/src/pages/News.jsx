import React, { Component } from 'react'
import '../assets/news.css'
import axios from 'axios'
import Header from '../components/header'
import Footer from '../components/footer'


const NewsCard = ({ newsId, image, type, date, title, description, isGreen, goArticle }) => {
  const newsCardMap = {
    DJ: 'DJ',
    streetDance: '街舞',
    rap: '饒舌',
    graffiti: '塗鴉',
    skate: '滑板'
  }

  const dateObj = new Date(date)
  const year = dateObj.getFullYear()
  const month = String(dateObj.getMonth() + 1).padStart(2, '0')
  const day = String(dateObj.getDate()).padStart(2, '0')

  return (
    <div className='card-box' onClick={() => goArticle(newsId)}>
      <div className={isGreen ? 'newsCard-green' : 'newsCard-gray'}>
        <div className='img-box'>
          <img src={`${process.env.PUBLIC_URL}${image}`} alt='' />
        </div>
        <div className='item'>
          <div className='wrap'>
            <p>
              <span>/// </span>
              <span>{newsCardMap[type] || type}</span>
            </p>
            <br />
            <br />
            <span>{year}</span>
            <span>
              {month}.{day}
            </span>
          </div>
          <div className='wrap'>
            <h4 className='multiline-ellipsis'>{title}</h4>
            <p className='multiline-ellipsis' dangerouslySetInnerHTML={{ __html: description }}/>
          </div>
          <div className='wrap'>
            <div className='morebtn'>
              <i className='bi bi-arrow-right'></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

class NewsIndex extends Component {
  constructor(props) {
    super(props)
    this.state = {
      News: [],
      selectedType: 'All',
      currentPage: 1,
      cardsPerPage: 6
    }
    this.goArticle = this.goArticle.bind(this)
  }

  goArticle(newsId) {
    window.location = `/News/Article/${newsId}`
  }

  componentDidMount() {
    this.fetchNewsData()
  }

  fetchNewsData = async () => {
    try {
      const response = await axios.get('http://localhost:3000/riverflow/news/news')
      console.log('Fetched news data:', response.data)
      this.setState({ News: response.data })
    } catch (error) {
      console.error('Error fetching news data:', error)
    }
  }

  handleTypeChange = (type) => {
    this.setState({ selectedType: type, currentPage: 1 })
  }

  Pagination = (direction) => {
    this.setState((prevState) => ({
      currentPage: prevState.currentPage + direction
    }))
  }

  getCardClass = (index) => {
    const pattern = [true, false, false, true, true, false]
    return pattern[index % pattern.length]
  }

  render() {
    const { News, selectedType, currentPage, cardsPerPage } = this.state

    // 根據左側選單，分類專欄
    const filteredNews = selectedType === 'All' ? News : News.filter((news) => news.newsType === selectedType)

    // 計算當前頁面的card
    const indexOfLastCard = currentPage * cardsPerPage
    const indexOfFirstCard = indexOfLastCard - cardsPerPage
    const currentCards = filteredNews.slice(indexOfFirstCard, indexOfLastCard)

    // 計算頁數
    const totalPages = Math.ceil(filteredNews.length / cardsPerPage)

    // 動代產生頁碼
    const pageNumbers = []
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i)
    }

    return (
      <div>
        <Header />
        <section className='news'>
          <div className='nav-box'>
            <div className='tab'>
              <button
                className={`tablinks ${selectedType === 'All' ? 'active' : ''}`}
                onClick={() => this.handleTypeChange('All')}
                id='defaultOpen'
              >
                <h3>全部類別</h3>
              </button>
              <button
                className={`tablinks ${selectedType === 'DJ' ? 'active' : ''}`}
                onClick={() => this.handleTypeChange('DJ')}
              >
                <h3>
                  <i className='bi bi-disc-fill'></i> DJ <span>| Disc Jockey</span>
                </h3>
              </button>
              <button
                className={`tablinks ${selectedType === 'streetDance' ? 'active' : ''}`}
                onClick={() => this.handleTypeChange('streetDance')}
              >
                <h3>
                  <i className='fa-solid fa-people-pulling'></i> 街舞 <span>| Breaking</span>
                </h3>
              </button>
              <button
                className={`tablinks ${selectedType === 'rap' ? 'active' : ''}`}
                onClick={() => this.handleTypeChange('rap')}
              >
                <h3>
                  <i className='fa-solid fa-microphone-lines'></i> 饒舌 <span>| Rapping</span>
                </h3>
              </button>
              <button
                className={`tablinks ${selectedType === 'graffiti' ? 'active' : ''}`}
                onClick={() => this.handleTypeChange('graffiti')}
              >
                <h3>
                  <i className='fa-solid fa-spray-can-sparkles'></i> 塗鴉 <span>| Graffiti</span>
                </h3>
              </button>
              <button
                className={`tablinks ${selectedType === 'skate' ? 'active' : ''}`}
                onClick={() => this.handleTypeChange('skate')}
              >
                <h3>
                  <i className='bi bi-bandaid-fill'></i> 滑板 <span>| Skate</span>
                </h3>
              </button>
            </div>
          </div>
          <div className='content-box'>
            <div id='All' className='tabcontent' style={{ display: selectedType === 'All' ? 'block' : 'none' }}>
              <div className='newsContent'>
                {currentCards.map((newItem, index) => (
                  <NewsCard
                    key={newItem.newsId}
                    newsId={newItem.newsId}
                    image={newItem.coverImg} 
                    type={newItem.newsType}
                    date={newItem.createdAt}
                    title={newItem.newsTitle}
                    description= {newItem.newsContent}
                    isGreen={this.getCardClass(index)}
                    goArticle={this.goArticle}
                  />
                ))}
              </div>
              <div className='btn-box'>
                {currentPage > 1 && (
                  <button className='btn' onClick={() => this.Pagination(-1)}>
                    <i className='bi bi-arrow-left-circle'></i>
                  </button>
                )}

                {pageNumbers.map((number) => (
                  <button
                    key={number}
                    className={`btn ${currentPage === number ? 'active' : ''}`}
                    onClick={() => this.setState({ currentPage: number })}
                  >
                    {number}
                  </button>
                ))}

                {currentPage < totalPages && (
                  <button className='btn' onClick={() => this.Pagination(1)}>
                    <i className='bi bi-arrow-right-circle'></i>
                  </button>
                )}
              </div>
            </div>

            <div id='DJ' className='tabcontent' style={{ display: selectedType === 'DJ' ? 'block' : 'none' }}>
              <div className='newsContent'>
                {currentCards.map((newItem, index) => (
                  <NewsCard
                    key={newItem.newsId}
                    newsId={newItem.newsId}
                    image={newItem.coverImg}
                    type={newItem.newsType}
                    date={newItem.createdAt}
                    title={newItem.newsTitle}
                    description= {newItem.newsContent}
                    isGreen={this.getCardClass(index)}
                    goArticle={this.goArticle}
                  />
                ))}
              </div>
              <div className='btn-box'>
                {currentPage > 1 && (
                  <button className='btn' onClick={() => this.Pagination(-1)}>
                    <i className='bi bi-arrow-left-circle'></i>
                  </button>
                )}

                {pageNumbers.map((number) => (
                  <button
                    key={number}
                    className={`btn ${currentPage === number ? 'active' : ''}`}
                    onClick={() => this.setState({ currentPage: number })}
                  >
                    {number}
                  </button>
                ))}

                {currentPage < totalPages && (
                  <button className='btn' onClick={() => this.Pagination(1)}>
                    <i className='bi bi-arrow-right-circle'></i>
                  </button>
                )}
              </div>
            </div>
            <div
              id='streetDance'
              className='tabcontent'
              style={{ display: selectedType === 'streetDance' ? 'block' : 'none' }}
            >
              <div className='newsContent'>
                {currentCards.map((newItem, index) => (
                  <NewsCard
                    key={newItem.newsId}
                    newsId={newItem.newsId}
                    image={newItem.coverImg}
                    type={newItem.newsType}
                    date={newItem.createdAt}
                    title={newItem.newsTitle}
                    description= {newItem.newsContent}
                    isGreen={this.getCardClass(index)}
                    goArticle={this.goArticle}
                  />
                ))}
              </div>
              <div className='btn-box'>
                {currentPage > 1 && (
                  <button className='btn' onClick={() => this.Pagination(-1)}>
                    <i className='bi bi-arrow-left-circle'></i>
                  </button>
                )}

                {pageNumbers.map((number) => (
                  <button
                    key={number}
                    className={`btn ${currentPage === number ? 'active' : ''}`}
                    onClick={() => this.setState({ currentPage: number })}
                  >
                    {number}
                  </button>
                ))}

                {currentPage < totalPages && (
                  <button className='btn' onClick={() => this.Pagination(1)}>
                    <i className='bi bi-arrow-right-circle'></i>
                  </button>
                )}
              </div>
            </div>
            <div id='rap' className='tabcontent' style={{ display: selectedType === 'rap' ? 'block' : 'none' }}>
              <div className='newsContent'>
                {currentCards.map((newItem, index) => (
                  <NewsCard
                    key={newItem.newsId}
                    newsId={newItem.newsId}
                    image={newItem.coverImg}
                    type={newItem.newsType}
                    date={newItem.createdAt}
                    title={newItem.newsTitle}
                    description= {newItem.newsContent}
                    isGreen={this.getCardClass(index)}
                    goArticle={this.goArticle}
                  />
                ))}
              </div>
              <div className='btn-box'>
                {currentPage > 1 && (
                  <button className='btn' onClick={() => this.Pagination(-1)}>
                    <i className='bi bi-arrow-left-circle'></i>
                  </button>
                )}

                {pageNumbers.map((number) => (
                  <button
                    key={number}
                    className={`btn ${currentPage === number ? 'active' : ''}`}
                    onClick={() => this.setState({ currentPage: number })}
                  >
                    {number}
                  </button>
                ))}

                {currentPage < totalPages && (
                  <button className='btn' onClick={() => this.Pagination(1)}>
                    <i className='bi bi-arrow-right-circle'></i>
                  </button>
                )}
              </div>
            </div>
            <div
              id='graffiti'
              className='tabcontent'
              style={{ display: selectedType === 'graffiti' ? 'block' : 'none' }}
            >
              <div className='newsContent'>
                {currentCards.map((newItem, index) => (
                  <NewsCard
                    key={newItem.newsId}
                    newsId={newItem.newsId}
                    image={newItem.coverImg}
                    type={newItem.newsType}
                    date={newItem.createdAt}
                    title={newItem.newsTitle}
                    description={newItem.newsContent}
                    isGreen={this.getCardClass(index)}
                    goArticle={this.goArticle}
                  />
                ))}
              </div>
              <div className='btn-box'>
                {currentPage > 1 && (
                  <button className='btn' onClick={() => this.Pagination(-1)}>
                    <i className='bi bi-arrow-left-circle'></i>
                  </button>
                )}

                {pageNumbers.map((number) => (
                  <button
                    key={number}
                    className={`btn ${currentPage === number ? 'active' : ''}`}
                    onClick={() => this.setState({ currentPage: number })}
                  >
                    {number}
                  </button>
                ))}

                {currentPage < totalPages && (
                  <button className='btn' onClick={() => this.Pagination(1)}>
                    <i className='bi bi-arrow-right-circle'></i>
                  </button>
                )}
              </div>
            </div>
            <div id='skate' className='tabcontent' style={{ display: selectedType === 'skate' ? 'block' : 'none' }}>
              <div className='newsContent'>
                {currentCards.map((newItem, index) => (
                  <NewsCard
                    key={newItem.newsId}
                    newsId={newItem.newsId}
                    image={newItem.coverImg}
                    type={newItem.newsType}
                    date={newItem.createdAt}
                    title={newItem.newsTitle}
                    description= {newItem.newsContent}
                    isGreen={this.getCardClass(index)}
                    goArticle={this.goArticle}
                  />
                ))}
              </div>
              <div className='btn-box'>
                {currentPage > 1 && (
                  <button className='btn' onClick={() => this.Pagination(-1)}>
                    <i className='bi bi-arrow-left-circle'></i>
                  </button>
                )}

                {pageNumbers.map((number) => (
                  <button
                    key={number}
                    className={`btn ${currentPage === number ? 'active' : ''}`}
                    onClick={() => this.setState({ currentPage: number })}
                  >
                    {number}
                  </button>
                ))}

                {currentPage < totalPages && (
                  <button className='btn' onClick={() => this.Pagination(1)}>
                    <i className='bi bi-arrow-right-circle'></i>
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>
        <Footer/>
      </div>
    )
  }
}

export default NewsIndex
