import React, { useState, useEffect } from 'react'
// 引入 Swiper 相關樣式和功能，這是用於製作圖片輪播效果的套件
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import Swiper from 'swiper/bundle'
import 'swiper/css/bundle'
// 引入重置樣式表和產品列表的樣式表，這些用來調整頁面的基本樣式
import resetStyles from '../assets/reset.module.css'
import '../assets/ProductAll.css'
// 引入 Header 和 Footer 組件，這些是頁面的頭部和尾部
import Header from '../components/header'
// 用於進行 HTTP 請求的庫
import axios from 'axios'
// 用於導航的 React Router 庫
import { Link } from 'react-router-dom'
import Footer from '../components/footer'

// Banner 組件：負責顯示輪播圖（商品或廣告）
const Banner = () => {
  useEffect(() => {
    // 初始化 Swiper，設定輪播自動播放間隔時間為 4000 毫秒
    const swiper = new Swiper('.swiper', {
      autoplay: { delay: 4000, loop: true },
      pagination: { el: '.swiper-pagination' }, // 分頁導航
      scrollbar: { el: '.swiper-scrollbar' } // 添加滾動條
    })

    // 返回一個清除函數，當組件卸載時銷毀 swiper 實例
    return () => swiper.destroy()
  }, []) // 空依賴陣列，意味著這個 effect 只在組件第一次渲染時運行

  // 返回 JSX 結構，用於展示 Swiper 內容
  return (
    <div className='swiper'>
      <div className='swiper-wrapper'>
        {/* 每個 section 表示一個輪播項目 */}
        <section className='swiper-slide'>
          <img
            src='https://vibrancefestival-live-83932ec24f1845258-f0d579e.divio-media.com/images/PXL_20210325_221726325.fddd6140.fill-900x420.jpg'
            alt='塗鴉'
          />
          <div className='swiper-text'>
            <h1>絕對塗鴉行</h1>
            <p>
              絕對塗鴉行是專為塗鴉藝術家、街頭藝術愛好者和創意達人打造的專業噴漆用品商店。無論你是初學者還是資深塗鴉藝術家，這裡都有你需要的一切。
            </p>
          </div>
        </section>
        {/* 這是輪播中的第二個項目 */}
        <section className='swiper-slide'>
          <img
            src='https://cdn.shopify.com/s/files/1/0530/0695/8744/t/22/assets/skate-shops-1683383358868.jpg?v=1683383359'
            alt='skate'
          />
          <div className='swiper-text'>
            <h1>自由滑行</h1>
            <p>
              自由滑行是滑板愛好者的天堂，無論你是初學者還是資深滑板玩家，這裡都能滿足你的需求。我們致力於提供最優質的滑板、配件及裝備，助你在滑行中展現最佳狀態。
            </p>
          </div>
        </section>
        {/* 以下項目類似，依次展示不同的內容 */}
        <section className='swiper-slide'>
          <img src='https://web.cheers.com.tw/event/2019fwf/assets/img/article/009.jpg' alt='DJ' />
          <div className='swiper-text'>
            <h1>唱片騎師</h1>
            <p>
              DJ，即唱片騎師，是派對和音樂節的靈魂。他們掌握著音樂的節奏，創造獨特的聽覺體驗，點燃現場的每一個角落。
            </p>
          </div>
        </section>
        <section className='swiper-slide'>
          <img
            src='https://media.gq.com.tw/photos/5dbcbd532551d400086a9647/master/w_1600%2Cc_limit/2015052266764869.jpg'
            alt='RAP'
          />
          <div className='swiper-text'>
            <h1>Beans & Beats Records</h1>
            <p>
              身為嘻哈音樂廠牌的顏社，在實體唱片逐漸沒落情況下，還放膽在咖啡店樓下成立一間唱片行「Beans & Beats
              Records」，以嘻哈音樂為主。
            </p>
          </div>
        </section>
        <section className='swiper-slide'>
          <img
            src='https://d1j71ui15yt4f9.cloudfront.net/wp-content/uploads/2023/07/18203055/71004a-20230718141533714-0.jpg'
            alt='Street Dance'
          />
          <div className='swiper-text'>
            <h1>街舞</h1>
            <p>
              街舞是一種充滿能量和創意的舞蹈形式，起源於嘻哈文化。街舞不僅是一種表演藝術，更是一種文化象徵，代表了年輕人的自由和活力。
            </p>
          </div>
        </section>
      </div>
      <div className='swiper-scrollbar'></div> {/* 添加一個滾動條 */}
    </div>
  )
}

// Filter 組件：用於商品篩選功能，包括商品名稱搜索和類別篩選
const Filter = ({ onFilterChange, selectedCategory, setSearchQuery }) => (
  <aside className='shop-filter'>
    <div className='filter-text'>
      <h3>商品搜尋欄</h3>
      {/* 商品名稱搜尋欄，當輸入值改變時，更新 searchQuery 狀態 */}
      <input
        type='text'
        id='searchInput'
        placeholder='請輸入商品名稱'
        onChange={(e) => setSearchQuery(e.target.value)} // 將輸入的值設置為搜尋欄的查詢條件
      />
    </div>
    <ul id='categoryFilter'>
      {/* 以下項目用於篩選商品類別 */}
      <li className='shop-filter-item'>
        <a
          href='#'
          onClick={(e) => {
            e.preventDefault()
            onFilterChange('all') // 點擊後將篩選條件設置為 "全部"
          }}
          className={selectedCategory === 'all' ? 'selected' : ''} // 根據是否選中設置不同的樣式
        >
          全部類別
        </a>
      </li>
      <li className='shop-filter-item'>
        <a
          href='#'
          onClick={(e) => {
            e.preventDefault()
            onFilterChange('刷碟') // 篩選類別為 "刷碟"
          }}
          className={selectedCategory === '刷碟' ? 'selected' : ''}
        >
          DJ | Disc Jockey
        </a>
      </li>
      <li className='shop-filter-item'>
        <a
          href='#'
          onClick={(e) => {
            e.preventDefault()
            onFilterChange('街舞') // 篩選類別為 "街舞"
          }}
          className={selectedCategory === '街舞' ? 'selected' : ''}
        >
          街舞 | Street Dance
        </a>
      </li>
      <li className='shop-filter-item'>
        <a
          href='#'
          onClick={(e) => {
            e.preventDefault()
            onFilterChange('饒舌') // 篩選類別為 "饒舌"
          }}
          className={selectedCategory === '饒舌' ? 'selected' : ''}
        >
          饒舌 | Rap
        </a>
      </li>
      <li className='shop-filter-item'>
        <a
          href='#'
          onClick={(e) => {
            e.preventDefault()
            onFilterChange('塗鴉') // 篩選類別為 "塗鴉"
          }}
          className={selectedCategory === '塗鴉' ? 'selected' : ''}
        >
          塗鴉 | Graffiti
        </a>
      </li>
      <li className='shop-filter-item'>
        <a
          href='#'
          onClick={(e) => {
            e.preventDefault()
            onFilterChange('滑板') // 篩選類別為 "滑板"
          }}
          className={selectedCategory === '滑板' ? 'selected' : ''}
        >
          滑板 | Skate
        </a>
      </li>
      <br />
      <li className='shop-filter-item'>
        <a
          href='#'
          onClick={(e) => {
            e.preventDefault()
            onFilterChange('new') // 篩選類別為 "新品"
          }}
          className={selectedCategory === 'new' ? 'selected' : ''}
        >
          新品 | New
        </a>
      </li>
      <li className='shop-filter-item'>
        <a
          href='#'
          onClick={(e) => {
            e.preventDefault()
            onFilterChange('sale') // 篩選類別為 "優惠"
          }}
          className={selectedCategory === 'sale' ? 'selected' : ''}
        >
          優惠 | On Sale
        </a>
      </li>
    </ul>
  </aside>
)

// RwdFilter 組件：針對 RWD 設計的篩選欄位，結構和 Filter 相似但適應不同裝置
const RwdFilter = ({ onFilterChange, selectedCategory }) => (
  <aside className='RWD-shop-filter'>
    <ul id='categoryFilter'>
      <li className='shop-filter-item'>
        <a
          href='#'
          onClick={(e) => {
            e.preventDefault()
            onFilterChange('all') // 篩選 "全部"
          }}
          className={selectedCategory === 'all' ? 'selected' : ''}
        >
          全部
        </a>
      </li>
      <li className='shop-filter-item'>
        <a
          href='#'
          onClick={(e) => {
            e.preventDefault()
            onFilterChange('刷碟') // 篩選 "刷碟"
          }}
          className={selectedCategory === '刷碟' ? 'selected' : ''}
        >
          刷碟 Disc Jockey (DJ)
        </a>
      </li>
      <li className='shop-filter-item'>
        <a
          href='#'
          onClick={(e) => {
            e.preventDefault()
            onFilterChange('街舞') // 篩選 "街舞"
          }}
          className={selectedCategory === '街舞' ? 'selected' : ''}
        >
          街舞 Street Dance
        </a>
      </li>
      <li className='shop-filter-item'>
        <a
          href='#'
          onClick={(e) => {
            e.preventDefault()
            onFilterChange('饒舌') // 篩選 "饒舌"
          }}
          className={selectedCategory === '饒舌' ? 'selected' : ''}
        >
          饒舌 Rap
        </a>
      </li>
      <li className='shop-filter-item'>
        <a
          href='#'
          onClick={(e) => {
            e.preventDefault()
            onFilterChange('塗鴉') // 篩選 "塗鴉"
          }}
          className={selectedCategory === '塗鴉' ? 'selected' : ''}
        >
          塗鴉 Graffiti
        </a>
      </li>
      <li className='shop-filter-item'>
        <a
          href='#'
          onClick={(e) => {
            e.preventDefault()
            onFilterChange('滑板') // 篩選 "滑板"
          }}
          className={selectedCategory === '滑板' ? 'selected' : ''}
        >
          滑板 Skate
        </a>
      </li>
    </ul>
  </aside>
)

// ProductItem 組件：每個商品項目的展示樣式，包括圖片、名稱、價格、是否售完等資訊
const ProductItem = ({ product, toggleFavorite }) => (
  <div className={`product-item ${product.isSoldOut ? 'sold-out-card' : ''}`} data-category={`${product.categoryName}`}>
    <div className='product-img'>
      {/* 顯示商品圖片 */}
      <img src={`/images/products/${product.image}`} alt={product.alt} />
      {/* 加入或取消收藏按鈕 */}
      <a
        href='#'
        className={`favorite ${product.isFavorited ? 'selected' : ''}`}
        onClick={(e) => {
          e.preventDefault()
          toggleFavorite(product) // 呼叫父組件傳遞的切換收藏功能
        }}
      >
        <i className={`fa-regular fa-heart ${product.isFavorited ? 'selected' : ''}`}></i>
      </a>
      {/* 售罄標籤 */}
      {product.isSoldOut && <div className='sold-out'>SOLD OUT</div>}
    </div>
    <div className='labels'>
      <span className='label'>{product.categoryName}</span>
      {/* 如果是新品或有優惠，顯示相應的標籤 */}
      {product.label !== 'normal' && (
        <span className={`label ${product.label === '新品' ? 'new' : ''} ${product.label === '優惠' ? 'sale' : ''}`}>
          {product.label}
        </span>
      )}
    </div>
    <div className='product-info'>
      <h4>{product.title}</h4>
      <div className='product-text'>
        {/* 如果有折扣價格，則顯示原價和折扣價 */}
        {product.oldPrice && <p style={{ textDecoration: 'line-through' }}>{product.oldPrice}</p>}
        <p className={product.oldPrice ? 'discount-price' : ''}>{product.price}</p>
        {/* 點擊進入商品詳情頁面 */}
        <Link to={`/Product/Detail/${product.productId}`} className='look-btn'>
          查看商品
        </Link>
      </div>
    </div>
  </div>
)

// ProductList 組件：負責展示所有商品，並進行篩選與搜尋操作
const ProductList = ({ filterCategory, searchQuery, favoriteProducts, setFavoriteProducts }) => {
  const [products, setProducts] = useState([]) // 用來存所有商品的狀態

  // 使用 useEffect 來獲取所有商品資料
  useEffect(() => {
    axios
      .get('http://localhost:3000/riverflow/products') // 發送請求到後端 API 獲取商品列表
      .then((response) => {
        const allProducts = response.data.getAllProductInfo.map((product) => {
          const productImages = response.data.getAllProductImg.filter((img) => img.productId === product.productId)
          const isFavorited = favoriteProducts.some((favProduct) => favProduct.productId === product.productId)

          const isNewProduct = product.productStatus === 'New'

          return {
            productId: product.productId,
            image: productImages.length > 0 ? productImages[0].productImg : '',
            alt: product.productName,
            categoryName: product.categoryName,
            label: product.discount > 0 ? '優惠' : isNewProduct ? '新品' : 'normal',
            title: product.productName,
            price: `NT$${product.productPrice}`,
            oldPrice: product.discount > 0 ? `NT$${product.productPrice * (1 + product.discountRate)}` : '',
            isSoldOut: product.productStatus === 'Out of Stock',
            isFavorited: isFavorited
          }
        })
        setProducts(allProducts) // 設置商品狀態
      })
      .catch((error) => {
        console.error('錯誤喔:', error) // 錯誤處理
      })
  }, [favoriteProducts]) // 每次 favoriteProducts 改變時重新加載商品

  // 切換收藏狀態
  const toggleFavorite = async (product) => {
    try {
      const url = `http://localhost:3000/riverflow/user/favorites/${product.productId}`

      let response
      if (product.isFavorited) {
        // 如果已收藏則刪除收藏
        response = await axios.delete(url, { withCredentials: true })
      } else {
        // 如果未收藏則新增收藏
        response = await axios.post(url, {}, { withCredentials: true })
      }

      // 更新收藏狀態
      setFavoriteProducts((prev) =>
        product.isFavorited
          ? prev.filter((item) => item.productId !== product.productId)
          : [...prev, { productId: product.productId }]
      )

      setProducts((prevProducts) =>
        prevProducts.map((p) => (p.productId === product.productId ? { ...p, isFavorited: !p.isFavorited } : p))
      )
    } catch (error) {
      console.error('更新收藏狀態時出錯:', error) // 錯誤處理
    }
  }

  // 根據篩選條件過濾商品
  const filteredProducts = products
    .filter((product) => {
      if (filterCategory === 'all') return true
      if (filterCategory === 'new') return product.label === '新品'
      if (filterCategory === 'sale') return product.label === '優惠'
      return product.categoryName === filterCategory // 按商品類別篩選
    })
    .filter((product) => product.title.toLowerCase().includes(searchQuery.toLowerCase())) // 按商品名稱搜尋

  return (
    <main className='product-list'>
      {filteredProducts.map((product, index) => (
        <ProductItem key={index} product={product} toggleFavorite={toggleFavorite} /> // 渲染每個商品
      ))}
    </main>
  )
}

// ProductAll 組件：主頁面，包含篩選、搜索、商品列表和頁頭頁尾
const ProductAll = () => {
  const [filterCategory, setFilterCategory] = useState('all') // 篩選條件狀態
  const [searchQuery, setSearchQuery] = useState('') // 搜尋條件狀態
  const [userData, setUserData] = useState(null) // 用戶資料狀態
  const [favoriteProducts, setFavoriteProducts] = useState([]) // 收藏商品狀態
  const [isLoading, setIsLoading] = useState(true) // 是否正在加載狀態
  const [error, setError] = useState(null) // 錯誤狀態

  // 獲取當前登入用戶資料
  useEffect(() => { 
    const fetchUserData = async () => { 
      try { 
        const response = await axios.get('http://localhost:3000/riverflow/user', { 
          withCredentials: true // 保證請求帶上 Cookie
        })
        setUserData(response.data) // 設置用戶資料
        setIsLoading(false) // 加載結束
      } catch (error) {
        console.error('用戶資料載入失敗', error)
        localStorage.removeItem('token') // 如果獲取失敗則移除 token
        setIsLoading(false)
        setError('Failed to fetch user data. Please log in again.')
      }
    }

    fetchUserData() // 調用函數獲取資料
  }, []) // 空依賴數組，意即僅在組件加載時運行

  // 獲取收藏的商品 ID
  useEffect(() => {
    const fetchFavoritesData = async () => { 
      if (userData) { 
        // 只有在用戶登入後才獲取收藏資料 
        try { 
          const response = await axios.get('http://localhost:3000/riverflow/user/favorites', { 
            withCredentials: true 
          }) 
          setFavoriteProducts(response.data) // 設置收藏商品資料 
        } catch (error) { 
          console.error('Error fetching favorites data:', error) 
          setError('Failed to fetch favorites data.') 
        }
      }
    }

    fetchFavoritesData() // 調用函數獲取收藏商品資料
  }, [userData]) // 當 userData 改變時重新執行

  return (
    <>
      <Header /> {/* 頁頭 */}
      {isLoading ? ( 
        <p>Loading...</p> // 資料加載中顯示 Loading 
      ) : error ? ( 
        <p>{伺服器錯誤}</p> // 錯誤時顯示錯誤訊息 
      ) : (
        <>
          <section className={`wrap-f ${resetStyles.reset}`}>
            <div className='container-f'>
              <Banner /> {/* 顯示輪播圖 */}
            </div>
          </section>
          <section className={`AllWrap ${resetStyles.reset}`}>
            <div className='container'>
              <Filter
                onFilterChange={setFilterCategory}
                selectedCategory={filterCategory}
                setSearchQuery={setSearchQuery} // 傳遞篩選和搜尋狀態更新函數
              />
              <RwdFilter onFilterChange={setFilterCategory} selectedCategory={filterCategory} />
              <ProductList
                filterCategory={filterCategory}
                searchQuery={searchQuery}
                favoriteProducts={favoriteProducts}
                setFavoriteProducts={setFavoriteProducts} // 傳遞狀態和函數給商品列表
              />
            </div>
            <Footer /> {/* 頁尾 */}
          </section>
        </>
      )}
    </>
  )
}

export default ProductAll
