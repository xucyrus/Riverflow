// Author: zhier1114
import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const BlogItem = ({ blog, onStatusChange, handleDelete, adminToken }) => {
  const navigate = useNavigate()

  const [status, setStatus] = useState(blog.newsStatus)
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    setStatus(blog.newsStatus)
  }, [blog.newsStatus])

  const updateStatus = useCallback(
    async (newsStatus) => {
      setIsUpdating(true)
      try {
        const endpoint = newsStatus === 1 ? 'launch' : 'remove'
        await axios({
          method: 'put',
          url: `http://localhost:3000/riverflow/admin/news/${blog.newsId}/${endpoint}`,
          headers: {
            Authorization: `Bearer ${adminToken}`,
            'Content-Type': 'application/json'
          },
          withCredentials: true
        })
        setStatus(newsStatus)
        onStatusChange(blog.newsId, newsStatus)
      } catch (error) {
        console.error('狀態更新失敗:', error)
      } finally {
        setIsUpdating(false)
      }
    },
    [blog.newsId, onStatusChange, adminToken]
  )

  const removeStatus = () => updateStatus(0)
  const launchStatus = () => updateStatus(1)

  const handleEdit = () => {
    navigate(`/admin/blogList/edit/${blog.newsId}`)
  }

  const handleView = () => {
    window.open(`http://localhost:3001/news/article/${blog.newsId}`, '_blank')
  }

  return (
    <tr className='item'>
      <td className='blogSort'>
        <div className='sort'>{blog.newsType}</div>
      </td>
      <td className='blogTitle'>{blog.newsTitle}</td>
      <td className='blogAuthor'>{blog.newsAuthor}</td>
      <td className='time'>{blog.createdAt}</td>
      <td className='Status'>{status === 1 ? '上架' : '下架'}</td>
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
          {status === 0 ? (
            <button onClick={launchStatus} className='btn itemOpr inline-flex' disabled={isUpdating}>
              <i className='fa-solid fa-arrow-up' />
              {isUpdating ? '更新中...' : '上架'}
            </button>
          ) : (
            <button onClick={removeStatus} className='btn itemOpr inline-flex' disabled={isUpdating}>
              <i className='fa-solid fa-arrow-down' />
              {isUpdating ? '更新中...' : '下架'}
            </button>
          )}
          <button onClick={() => handleDelete(blog.newsId)} className='btn itemOpr inline-flex'>
            <i className='fa-solid fa-trash' />
            刪除
          </button>
        </div>
      </td>
    </tr>
  )
}

export default BlogItem
