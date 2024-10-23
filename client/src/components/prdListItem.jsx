import React, { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import axios from 'axios'

const PrdListItem = ({ product, onProductUpdate, onProductDelete, adminToken }) => {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const statusMap = {
    Available: { 
      text: '上架', 
      color: 'var(--side)',
      buttonText: '下架',
      buttonIcon: 'fa-arrow-down',
      nextStatus: 'Discontinued',
      action: 'discontinue'
    },
    Discontinued: { 
      text: '下架',
      color: 'var(--err)',
      buttonText: '上架',
      buttonIcon: 'fa-arrow-up',
      nextStatus: 'Available',
      action: 'activate'    
    },
    'Out of Stock': { 
      text: '售完',
      color: 'var(--cancel)',
      buttonText: '售完',
      buttonIcon: 'fa-ban',
      nextStatus: null,
      action: null
    }
  }

  function getStatusInfo(status) {
    return statusMap[status] || statusMap['Discontinued'];
  }

  const statusInfo = getStatusInfo(product.productStatus)

  const handleStatusChange = async () => {
    if (statusInfo.nextStatus === null) {
      alert('請先補充庫存後再重新上架商品')
      return
    }

    setIsLoading(true)
    try {
      let response;
      if (statusInfo.action === 'activate') {
        response = await axios({
          method: 'put',
          url: `http://localhost:3000/riverflow/admin/products/${product.productId}/launch`,
          headers: {
            Authorization: `Bearer ${adminToken}`,
            'Content-Type': 'application/json'
          },
          withCredentials: true
        })
      } else if (statusInfo.action === 'discontinue') {
        response = await axios({
          method: 'put',
          url: `http://localhost:3000/riverflow/admin/products/${product.productId}/remove`,
          headers: {
            Authorization: `Bearer ${adminToken}`,
            'Content-Type': 'application/json'
          },
          withCredentials: true
        })
      } else {
        throw new Error('未知的產品狀態更新動作');
      }

      // 調用父組件的回調函數，更新父組件中的狀態
      onProductUpdate(response.data);
    } catch (error) {
      console.error('更新商品狀態時出錯:', error);
    } finally {
      setIsLoading(false);
    }
    // try {
    //   await onProductUpdate({
    //     ...product,
    //     status: statusInfo.nextStatus,
    //     action: statusInfo.action
    //   })
    // } catch (error) {
    //   console.error('更新狀態時出錯', error)
    // } finally {
    //   setIsLoading(false)
    // }
  }

  const handleDelete = async () => {
    if (window.confirm('確定要刪除此商品嗎？')) {
      setIsLoading(true);
      try {
        await axios({
          method: 'delete',
          url: `http://localhost:3000/riverflow/admin/products/${product.productId}/delete`,
          headers: {
            Authorization: `Bearer ${adminToken}`,
            'Content-Type': 'application/json'
          },
          withCredentials: true
        })
        // 調用父組件的回調函數，從父組件中刪除該產品
        onProductDelete(product.productId);
      } catch (error) {
        console.error('刪除商品時出錯:', error);
        // 可以在這裡添加錯誤處理邏輯
      } finally {
        setIsLoading(false);
      }
    }
  };

  // 編輯
  const handleEdit = () => {
    navigate(`/admin/prdList/edit/${product.productId}`)
  }

  // 檢視
  const handleView = () => {
    window.open(`http://localhost:3001/product/detail/${product.productId}`, '_blank')
  }

  const imagePath = `${process.env.PUBLIC_URL}/images/products/${product.productImg}`

  return (
    <tr className='item'>
      <td>
        <img src={imagePath} alt={product.productName} className='prdImgPre' />
      </td>
      <td className='prdSort'>
        {product.categories.map((category, index, array) => (
          <React.Fragment key={index}>
            <div className='sort'>{category}</div>
            {index < array.length - 1 && <br />}
          </React.Fragment>
        ))}
      </td>
      <td className='prdId'>{product.productId}</td>
      <td className='prdName'>{product.productName}</td>
      <td className='prdPrice'>
        <span>NT$</span>{product.productPrice}
      </td>
      <td className='prdStock'>{product.totalStock}</td>
      <td className='Status' style={{color: statusInfo.color}}>
        {statusInfo.text}
      </td>
      <td className='itemOpt'>
        <div className='flex'>
          <button onClick={handleEdit} id='btnEdit' className='btn itemOpr inline-flex'>
            <i className='fa-solid fa-pen' />
            編輯
          </button>
          <button onClick={handleView} id='btnView' className='btn itemOpr inline-flex'>
            <i className='fa-solid fa-eye' />
            檢視
          </button>
        </div>
        <div className='flex'>
          <button
            onClick={handleStatusChange}
            className='btn btnSta itemOpr inline-flex'
            disabled={isLoading || statusInfo.action === null}
          >
            <i className={`fa-solid ${statusInfo.buttonIcon}`} />
            {statusInfo.buttonText}
          </button>
          <button onClick={handleDelete} className='btn itemOpr inline-flex'>
            <i className='fa-solid fa-trash'></i>刪除
          </button>
        </div>
      </td>
    </tr>
  )
}

export default PrdListItem
