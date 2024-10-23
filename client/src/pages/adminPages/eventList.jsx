// Author: zhier1114
import React, { useReducer, useState, useEffect, useCallback } from 'react'
// import $ from 'jquery'
import { Link, useMatch, useNavigate } from 'react-router-dom'
import axios from 'axios'
import EventItem from '../../components/eventItem'

const initialState = {
  events: [],
  loading: true,
  error: null,
  currentPage: 1,
  searchTerm: '',
  eventsPerPage: 5
}

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_EVENTS':
      return { ...state, events: action.payload, loading: false }
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false }
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'UPDATE_EVENT':
      return {
        ...state,
        events: state.events.map((event) =>
          event.eventId === action.payload.eventId ? { ...event, ...action.payload } : event
        )
      }
    case 'DELETE_EVENT':
      return {
        ...state,
        events: state.events.filter((event) => event.eventId !== action.payload)
      }
    case 'SET_SEARCH_TERM':
      return { ...state, searchTerm: action.payload, currentPage: 1 }
    case 'SET_CURRENT_PAGE':
      return { ...state, currentPage: action.payload }
    default:
      return state
  }
}

const EventList = () => {
  useMatch('/admin/eventList/*')
  const navigate = useNavigate()

  const [state, dispatch] = useReducer(reducer, initialState)
  const { events, loading, error, currentPage, searchTerm, eventsPerPage } = state
  const [adminToken, setAdminToken] = useState(null)

  useEffect(() => {
    const cookies = document.cookie.split(';')
    const adminTokenCookie = cookies.find((cookie) => cookie.trim().startsWith('adminToken='))
    if (adminTokenCookie) {
      const token = adminTokenCookie.split('=')[1]
      setAdminToken(token)
    }
  }, [])

  const fetchEvents = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      const response = await axios.get('http://localhost:3000/riverflow/admin/events', {
        withCredentials: true,
        headers: { Authorization: `Bearer ${adminToken}` }
      })

      dispatch({ type: 'SET_EVENTS', payload: response.data })
    } catch (err) {
      console.error('獲取活動數據錯誤：', err)
      dispatch({ type: 'SET_ERROR', payload: '獲取活動數據時出錯' })
    }
  }, [adminToken])

  useEffect(() => {
    fetchEvents()
  }, [fetchEvents])

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
  }, [events, currentPage])

  const reloadEventItem = useCallback(async (eventId, newStatus) => {
    try {
      const response = await axios.get(`http://localhost:3000/riverflow/admin/events/${eventId}`, {
        withCredentials: true
      })
      dispatch({ type: 'UPDATE_EVENT', payload: response.data })
    } catch (err) {
      console.error('重新加載活動資料錯誤：', err)
    }
  }, [])

  const handleEdit = useCallback(
    (eventId) => {
      navigate(`/admin/eventList/edit/${eventId}`)
    },
    [navigate]
  )

  const handleDelete = useCallback(async (eventId) => {
    if (window.confirm('確定要刪除這個活動嗎？')) {
      try {
        await axios.delete(`http://localhost:3000/riverflow/admin/events/${eventId}`, {
          withCredentials: true
        })
        dispatch({ type: 'DELETE_EVENT', payload: eventId })
      } catch (err) {
        console.error('刪除活動錯誤：', err)
      }
    }
  }, [])

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
  }

  const indexOfLastEvent = currentPage * eventsPerPage
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage
  const currentEvents = events.slice(indexOfFirstEvent, indexOfLastEvent)
  const totalPages = Math.ceil(events.length / eventsPerPage)

  const paginate = (pageNumber) => dispatch({ type: 'SET_CURRENT_PAGE', payload: pageNumber })

  const handleSearch = useCallback(
    async (e) => {
      e.preventDefault()
      const keyword = e.target.eventSearch.value || ''
      dispatch({ type: 'SET_SEARCH_TERM', payload: keyword })
      dispatch({ type: 'SET_LOADING', payload: true })
      try {
        if (keyword === '' || undefined) {
          await fetchEvents()
        } else {
          const response = await axios.get(`http://localhost:3000/riverflow/admin/events/search?keyword=${keyword}`, {
            withCredentials: true
          })
          dispatch({ type: 'SET_EVENTS', payload: response.data })
        }
      } catch (err) {
        console.error('搜尋活動錯誤：', err)
        dispatch({ type: 'SET_ERROR', payload: '搜尋活動錯誤' })
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false })
      }
    },
    [fetchEvents]
  )

  if (loading) return <div>加載中...</div>
  if (error) return <div>{error}</div>

  return (
    <div className='main adminEventList'>
      <div className='pageTitle'>活動列表</div>
      <div className='flex'>
        <Link to='create' className='divided'>
          <button className='btn'>新增活動</button>
        </Link>
        <div className='flex'>
          <form onSubmit={handleSearch} className='flex'>
            <input type='text' name='eventSearch' id='pdtSearch' className='search' placeholder='活動搜尋' />
            <input type='submit' value='搜尋' />
          </form>
        </div>
      </div>
      <table className='listTable'>
        <thead>
          <tr>
            <td>類別</td>
            <td>活動名稱</td>
            <td>開賣時間</td>
            <td>開始時間</td>
            <td>場地</td>
            <td>狀態</td>
            <td>操作</td>
          </tr>
        </thead>

        {events.length === 0 ? (
          <tbody>
            <tr>
              <td colSpan='7'>沒有找到相關活動</td>
            </tr>
          </tbody>
        ) : (
          <tbody>
            {currentEvents.map((event) => (
              <EventItem
                key={event.eventId}
                event={{ ...event, saleDate: formatDate(event.saleDate), eventDate: formatDate(event.eventDate) }}
                onStatusChange={reloadEventItem}
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

export default EventList
