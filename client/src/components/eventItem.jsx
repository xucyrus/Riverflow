// Author: zhier1114
import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const EventItem = ({ event, onStatusChange, handleDelete, adminToken }) => {
  const navigate = useNavigate()

  const [status, setStatus] = useState(event.launchStatus)
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    setStatus(event.launchStatus)
  }, [event.launchStatus])

  const updateStatus = useCallback(
    async (eventStatus) => {
      setIsUpdating(true)
      try {
        const endpoint = eventStatus === 1 ? 'launch' : 'remove'
        await axios({
          method: 'put',
          url: `http://localhost:3000/riverflow/admin/events/${event.eventId}/${endpoint}`,
          headers: {
            Authorization: `Bearer ${adminToken}`,
            'Content-Type': 'application/json'
          },
          withCredentials: true
        })
        setStatus(eventStatus)
        onStatusChange(event.eventId, eventStatus)
      } catch (error) {
        console.error('狀態更新失敗:', error)
      } finally {
        setIsUpdating(false)
      }
    },
    [event.eventId, onStatusChange, adminToken]
  )

  const removeStatus = () => updateStatus(0)
  const launchStatus = () => updateStatus(1)

  const handleEdit = () => {
    navigate(`/admin/eventList/edit/${event.eventId}`)
  }

  const handleView = () => {
    window.open(`http://localhost:3001/event/detail/${event.eventId}`, { withCredentials: true }, '_blank')
  }

  const saleDateFull = `${event.saleDate}`
  const saleDate = saleDateFull.slice(0, 10)
  const saleTime = saleDateFull.slice(11)

  const eventDateFull = `${event.eventDate}`
  const eventDate = eventDateFull.slice(0, 10)
  const eventTime = eventDateFull.slice(11)

  return (
    <tr className='item'>
      <td className='eventSort'>
        <div className='sort'>{event.eventType}</div>
        <br />
      </td>
      <td className='eventTitle'>{event.eventName}</td>
      <td className='time'>
        {saleDate}
        <br />
        {saleTime}
      </td>
      <td className='time'>
        {eventDate}
        <br />
        {eventTime}
      </td>
      <td className='eventAddress'>{event.location}</td>
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
          <button onClick={() => handleDelete(event.eventId)} className='btn itemOpr inline-flex'>
            <i className='fa-solid fa-trash' />
            刪除
          </button>
        </div>
      </td>
    </tr>
  )
}

export default EventItem
