// Author: zhier1114
import React, { useReducer, useState, useEffect, useCallback } from 'react'
import { Link, useMatch, useNavigate } from 'react-router-dom'
import BlogItem from '../../components/blogItem'
import axios from 'axios'

const initialState = {
  blogs: [],
  loading: true,
  error: null,
  currentPage: 1,
  searchTerm: '',
  blogsPerPage: 5
}

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_BLOGS':
      return { ...state, blogs: action.payload, loading: false }
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false }
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'UPDATE_BLOG':
      return {
        ...state,
        blogs: state.blogs.map((blog) =>
          blog.newsId === action.payload.newsId ? { ...blog, ...action.payload } : blog
        )
      }
    case 'DELETE_BLOG':
      return {
        ...state,
        blogs: state.blogs.filter((blog) => blog.newsId !== action.payload)
      }
    case 'SET_SEARCH_TERM':
      return { ...state, searchTerm: action.payload, currentPage: 1 }
    case 'SET_CURRENT_PAGE':
      return { ...state, currentPage: action.payload }
    default:
      return state
  }
}

const BlogList = () => {
  useMatch('/admin/blogList/*')
  const navigate = useNavigate()

  const [state, dispatch] = useReducer(reducer, initialState)
  const { blogs, loading, error, currentPage, searchTerm, blogsPerPage } = state
  const [adminToken, setAdminToken] = useState(null)

  useEffect(() => {
    const cookies = document.cookie.split(';')
    const adminTokenCookie = cookies.find((cookie) => cookie.trim().startsWith('adminToken='))
    if (adminTokenCookie) {
      const token = adminTokenCookie.split('=')[1]
      setAdminToken(token)
    }
  }, [])

  const fetchBlogs = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      const response = await axios.get('http://localhost:3000/riverflow/admin/news', {
        withCredentials: true
      })
      dispatch({ type: 'SET_BLOGS', payload: response.data })
    } catch (err) {
      console.error('獲取文章數據錯誤：', err)
      dispatch({ type: 'SET_ERROR', payload: '獲取文章數據時出錯' })
    }
  }, [adminToken])

  useEffect(() => {
    fetchBlogs()
  }, [fetchBlogs])

  useEffect(() => {
    const updateStatusColors = () => {
      document.querySelectorAll('.Status').forEach((elem) => {
        if (elem.innerText === '上架') {
          elem.style.color = 'var(--side)'
        } else if (elem.innerText === '下架') {
          elem.style.color = 'var(--err)'
        }
      })
    }
    updateStatusColors()
  }, [blogs, currentPage])

  const reloadBlogItem = useCallback(async (blogId, newStatus) => {
    try {
      const response = await axios.get(`http://localhost:3000/riverflow/admin/news/${blogId}`, {
        withCredentials: true
      })
      dispatch({ type: 'UPDATE_BLOG', payload: response.data })
    } catch (err) {
      console.error('重新加載文章數據錯誤：', err)
    }
  }, [])

  const handleEdit = useCallback(
    (blogId) => {
      navigate(`/admin/blogList/edit/${blogId}`)
    },
    [navigate]
  )

  const handleDelete = useCallback(async (blogId) => {
    if (window.confirm('確定要刪除這篇文章嗎？')) {
      try {
        await axios.delete(`http://localhost:3000/riverflow/admin/news/${blogId}`, {
          withCredentials: true
        })
        dispatch({ type: 'DELETE_BLOG', payload: blogId })
      } catch (err) {
        console.error('刪除文章錯誤：', err)
      }
    }
  }, [])

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date
      .toLocaleString('zh-TW', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      })
      .replace(/\//g, '-')
  }

  const indexOfLastBlog = currentPage * blogsPerPage
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage
  const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog)
  const totalPages = Math.ceil(blogs.length / blogsPerPage)

  const paginate = (pageNumber) => dispatch({ type: 'SET_CURRENT_PAGE', payload: pageNumber })

  const handleSearch = useCallback(
    async (e) => {
      e.preventDefault()
      const keyword = e.target.blogSearch.value || ''
      dispatch({ type: 'SET_SEARCH_TERM', payload: keyword })
      dispatch({ type: 'SET_LOADING', payload: true })
      try {
        if (keyword === '' || undefined) {
          await fetchBlogs()
        } else {
          const response = await axios.get(`http://localhost:3000/riverflow/admin/news/search?keyword=${keyword}`, {
            withCredentials: true
          })
          dispatch({ type: 'SET_BLOGS', payload: response.data })
        }
      } catch (err) {
        console.error('搜尋文章錯誤：', err)
        dispatch({ type: 'SET_ERROR', payload: '搜尋文章錯誤' })
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false })
      }
    },
    [fetchBlogs]
  )

  if (loading) return <div>加載中...</div>
  if (error) return <div>{error}</div>

  return (
    <div className='main'>
      <div className='pageTitle'>文章列表</div>
      <div className='flex'>
        <Link to='create' className='divided'>
          <button className='btn'>新增文章</button>
        </Link>
        <form onSubmit={handleSearch} className='flex'>
          <input type='text' name='blogSearch' id='blogSearch' className='search' placeholder='文章搜尋' />
          <input type='submit' value='搜尋' />
        </form>
      </div>

      <table className='listTable'>
        <thead>
          <tr>
            <td>文章分類</td>
            <td>文章標題</td>
            <td>作者</td>
            <td>建立時間</td>
            <td>狀態</td>
            <td>操作</td>
          </tr>
        </thead>
        {blogs.length === 0 ? (
          <tbody>
            <tr>
              <td colSpan='6'>沒有找到相關文章</td>
            </tr>
          </tbody>
        ) : (
          <tbody>
            {currentBlogs.map((blog) => (
              <BlogItem
                key={blog.newsId}
                blog={{ ...blog, createdAt: formatDate(blog.createdAt) }}
                onStatusChange={reloadBlogItem}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                adminToken={adminToken}
              />
            ))}
          </tbody>
        )}
      </table>
      <div className='pagination'>
        {Array.from({ length: totalPages }, (_, i) => (
          <button key={i} onClick={() => paginate(i + 1)} className={currentPage === i + 1 ? 'active' : ''}>
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  )
}

export default BlogList
