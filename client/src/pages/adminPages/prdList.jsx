import React, { useState, useEffect } from 'react'
import $ from 'jquery'
import { Link, useMatch } from 'react-router-dom'
import axios from 'axios'
import PrdListItem from '../../components/prdListItem'
// import Pic from '../../assets/images/products/product1_1.jpeg'

export default function PrdList() {
  useMatch('/admin/prdList/*')
  const [products, setProducts] = useState([])
  const [adminToken, setAdminToken] = useState(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const cookies = document.cookie.split(';')
    const adminTokenCookie = cookies.find((cookie) => cookie.trim().startsWith('adminToken='))
    if (adminTokenCookie) {
      const token = adminTokenCookie.split('=')[1]
      setAdminToken(token)
    }
  }, [])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:3000/riverflow/admin/', {
          withCredentials: true
        })
        setProducts(response.data)
        // console.log('測試:', response.data)
      } catch (error) {
        console.error('error')
      }
    }

    fetchProducts()
  }, [adminToken, refreshTrigger])

  // 狀態修改
  // const handleProductUpdate = async (updatedProduct) => {
  //   console.log(typeof updatedProduct.productId)
  //   try {
  //     let response
  //     if (updatedProduct.action === 'activate') {
  //       response = await axios({
  //         method: 'put',
  //         url: `http://localhost:3000/riverflow/admin/products/${updatedProduct.productId}/launch`,
  //         headers: {
  //           Authorization: `Bearer ${adminToken}`,
  //           'Content-Type': 'application/json'
  //         },
  //         withCredentials: true
  //       })
  //       // .put(`http://localhost:3000/riverflow/admin/products/${products.productId}/launch`, {
  //       //   withCredentials: true
  //       // })
  //     } else if (updatedProduct.action === 'discontinue') {
  //       response = await axios({
  //         method: 'put',
  //         url: `http://localhost:3000/riverflow/admin/products/${updatedProduct.productId}/remove`,
  //         headers: {
  //           Authorization: `Bearer ${adminToken}`,
  //           'Content-Type': 'application/json'
  //         },
  //         withCredentials: true
  //       })
  //       // response = await axios.put(`http://localhost:3000/riverflow/admin/products/${products.productId}/remove`, {
  //       //   withCredentials: true
  //       // })
  //     } else {
  //       throw new Error('未知的產品狀態更新動作')
  //     }

  //     setProducts(products.map(p =>
  //       p.productId === updatedProduct.productId ? response.data : p
  //     ))
  //   } catch (error) {
  //     console.error('更新狀態時出錯:', error)
  //   }
  // }

  const onProductUpdate = (updatedProduct) => {
    setProducts(prevProducts => 
      prevProducts.map(product => 
        product.productId === updatedProduct.productId ? updatedProduct : product
      )
    );

    // 觸發重新獲取
    setRefreshTrigger(prev => prev + 1);
  };

  const onProductDelete = (productId) => {
    setProducts(prevProducts => prevProducts.filter(product => product.productId !== productId));
  };

  $(function () {
    $('.prdStock').each(function (index, elem) {
      if (elem.innerText == 0) {
        $(this).css('color', 'red')
      }
    })
  })

  return (
    <div className='main'>
      <div className='pageTitle'>商品列表</div>
      <div className='flex'>
        <Link to='create' className='divided'>
          <button className='btn'>新增商品</button>
        </Link>
        <div className='flex'>
          <input type='text' name='' id='pdtSearch' className='search' placeholder='商品搜尋' />
          <input type='submit' value='搜尋' />
        </div>
      </div>
      <table page='1' itemshowing='5' className='listTable'>
        <thead>
          <tr>
            <td>圖片</td>
            <td>分類</td>
            <td>商品編號</td>
            <td>商品名稱</td>
            <td>價格</td>
            <td>總庫存</td>
            <td>狀態</td>
            <td>操作</td>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <PrdListItem
              key={product.productId}
              product={product}
              onProductUpdate={onProductUpdate}
              onProductDelete={onProductDelete}
              adminToken={adminToken}
            />
          ))}
          {/* <tr prdid='01' className='item'>
            <td>
              <img src='../assets/images/products/product1_1.jpeg' alt='' className='prdImgPre' />
            </td>
            <td className='prdSort'>
              <div className='sort'>饒舌</div>
              <br />
              <div className='sort'>新品</div>
            </td>
            <td className='prdId'>2407081029</td>
            <td className='prdName'>王以太聯名短袖T恤</td>
            <td className='prdPrice'>
              <span>$</span>1480
            </td>
            <td className='prdStock'>60</td>
            <td className='Status' status='Available'>
              上架
            </td>
            <td className='itemOpt'>
              <div className='flex'>
                <a href='addPrd.html'>
                  <button id='btnEdit' className='btn itemOpr inline-flex'>
                    <i className='fa-solid fa-pen' />編輯
                  </button>
                </a>
                <a href='#'>
                  <button id='btnView' className='btn itemOpr inline-flex'>
                    <i className='fa-solid fa-eye' />檢視
                  </button>
                </a>
              </div>
              <div className='flex'>
                <button className='btn btnSta itemOpr inline-flex'>
                  <i className='fa-solid fa-arrow-down' />下架
                </button>
                <button className='btn itemOpr inline-flex'>
                  <i className='fa-solid fa-trash'></i>刪除
                </button>
              </div>
            </td>
          </tr>
          <tr className='item'>
            <td>
              <img src='../../assets/images/memberCollection.png' alt='' className='prdImgPre' />
            </td>
            <td className='prdSort'>
              <div className='sort'>饒舌</div>
              <br />
            </td>
            <td className='prdId'>2407081028</td>
            <td className='prdName'>王以太 演說家 幸存者 專輯</td>
            <td className='prdPrice'>
              <span>$</span>880
            </td>
            <td className='prdStock'>105</td>
            <td className='Status' status='Available'>
              上架
            </td>
            <td className='itemOpt'>
              <div className='flex'>
                <a href='addPrd.html'>
                  <button id='btnEdit' className='btn itemOpr inline-flex'>
                    <i className='fa-solid fa-pen'></i>編輯
                  </button>
                </a>
                <a href='#'>
                  <button id='btnView' className='btn itemOpr inline-flex'>
                    <i className='fa-solid fa-eye'></i>檢視
                  </button>
                </a>
              </div>
              <div className='flex'>
                <button className='btn btnSta itemOpr inline-flex'>
                  <i className='fa-solid fa-arrow-down'></i>下架
                </button>
                <button className='btn itemOpr inline-flex'>
                  <i className='fa-solid fa-trash'></i>刪除
                </button>
              </div>
            </td>
          </tr>
          <tr className='item'>
            <td>
              <img src='../../assets/images/eventPrd01.jpg' alt='' className='prdImgPre' />
            </td>
            <td className='prdSort'>
              <div className='sort'>饒舌</div>
              <br />
              <div className='sort'>新品</div>
            </td>
            <td className='prdId'>2407081027</td>
            <td className='prdName'>王以太聯名夾棉外套</td>
            <td className='prdPrice'>
              <span>$</span>2580
            </td>
            <td className='prdStock'>60</td>
            <td className='Status' status='Available'>
              上架
            </td>
            <td className='itemOpt'>
              <div className='flex'>
                <a href='#'>
                  <button id='btnEdit' className='btn itemOpr inline-flex'>
                    <i className='fa-solid fa-pen'></i>編輯
                  </button>
                </a>
                <a href='#'>
                  <button id='btnView' className='btn itemOpr inline-flex'>
                    <i className='fa-solid fa-eye'></i>檢視
                  </button>
                </a>
              </div>
              <div className='flex'>
                <button className='btn btnSta itemOpr inline-flex'>
                  <i className='fa-solid fa-arrow-down'></i>下架
                </button>
                <button className='btn itemOpr inline-flex'>
                  <i className='fa-solid fa-trash'></i>刪除
                </button>
              </div>
            </td>
          </tr>
          <tr className='item'>
            <td>
              <img
                src='https://images.goodsmile.info/cgm/images/product/20220502/12665/98719/large/d870c31d5f264155ac6e3e359b7d34bc.jpg'
                alt=''
                className='prdImgPre'
              />
            </td>
            <td className='prdSort'>
              <div className='sort'>滑板</div>
              <br />
              <div className='sort'>新品</div>
            </td>
            <td className='prdId'>2407081026</td>
            <td className='prdName'>美式拼貼滑板</td>
            <td className='prdPrice'>
              <span>$</span>3683
            </td>
            <td className='prdStock'>24</td>
            <td className='Status' status='Available'>
              下架
            </td>
            <td className='itemOpt'>
              <div className='flex'>
                <a href='#'>
                  <button id='btnEdit' className='btn itemOpr inline-flex'>
                    <i className='fa-solid fa-pen'></i>編輯
                  </button>
                </a>
                <a href='#'>
                  <button id='btnView' className='btn itemOpr inline-flex'>
                    <i className='fa-solid fa-eye'></i>檢視
                  </button>
                </a>
              </div>
              <div className='flex'>
                <button className='btn btnSta itemOpr inline-flex'>
                  <i className='fa-solid fa-arrow-down'></i>下架
                </button>
                <button className='btn itemOpr inline-flex'>
                  <i className='fa-solid fa-trash'></i>刪除
                </button>
              </div>
            </td>
          </tr> */}
        </tbody>
      </table>
    </div>
  )
}
