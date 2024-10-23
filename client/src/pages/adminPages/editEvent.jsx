// Author: zhier1114
import React, { useState, useRef, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import debounce from 'lodash/debounce'
// CKEditor套件
import { CKEditor } from '@ckeditor/ckeditor5-react'
import {
  ClassicEditor,
  AccessibilityHelp,
  Alignment,
  Autoformat,
  AutoImage,
  AutoLink,
  Autosave,
  BalloonToolbar,
  Base64UploadAdapter,
  BlockQuote,
  Bold,
  CloudServices,
  Code,
  CodeBlock,
  Essentials,
  FindAndReplace,
  FontBackgroundColor,
  FontColor,
  FontFamily,
  FontSize,
  Heading,
  Highlight,
  HorizontalLine,
  HtmlEmbed,
  Image,
  ImageBlock,
  ImageCaption,
  ImageInline,
  ImageInsert,
  ImageInsertViaUrl,
  ImageResize,
  ImageStyle,
  ImageTextAlternative,
  ImageToolbar,
  ImageUpload,
  Indent,
  IndentBlock,
  Italic,
  Link,
  LinkImage,
  List,
  ListProperties,
  MediaEmbed,
  Paragraph,
  PasteFromOffice,
  RemoveFormat,
  SelectAll,
  SpecialCharacters,
  SpecialCharactersArrows,
  SpecialCharactersCurrency,
  SpecialCharactersEssentials,
  SpecialCharactersLatin,
  SpecialCharactersMathematical,
  SpecialCharactersText,
  Strikethrough,
  Table,
  TableCellProperties,
  TableProperties,
  TableToolbar,
  TextTransformation,
  TodoList,
  Underline,
  Undo
} from 'ckeditor5'
import 'ckeditor5/ckeditor5.css'
import translations from 'ckeditor5/translations/zh.js'

export default function AddEvent() {
  const { id } = useParams()
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  // 儲存的資料格式
  const [fileName, setFileName] = useState('未選擇任何檔案')
  const [isLoading, setIsLoading] = useState(true)
  const [formData, setFormData] = useState({
    eventType: 'dj',
    eventName: '',
    coverImg: null,
    eventAnoc: '',
    eventDesc: '',
    eventDate: '',
    location: '',
    seat: '1', // 預設為室內-對號入座
    ticketType: [],
    launchDate: '',
    launchStatus: 1,
    saleDate: ''
  })

  const [originalData, setOriginalData] = useState({
    seat: '1',
    ticketType: []
  })

  // 獲取資料數據
  const fetchEventData = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await axios.get(`http://localhost:3000/riverflow/admin/events/${id}`, {
        withCredentials: true
      })
      const eventData = response.data[0]

      // 處理時間格式
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
      // 處理票種json格式
      let ticketType = []
      if (typeof eventData.ticketType === 'string') {
        try {
          ticketType = JSON.parse(eventData.ticketType)
        } catch (error) {
          console.error('解析 ticketType 時出錯:', error)
        }
      } else if (Array.isArray(eventData.ticketType)) {
        ticketType = eventData.ticketType
      }

      // 確保 ticketType 是一個數組
      if (!Array.isArray(ticketType)) {
        ticketType = []
      }

      const newFormData = {
        eventType: eventData.eventType || '',
        eventName: eventData.eventName || '',
        coverImg: eventData.coverImg || '',
        eventAnoc: eventData.eventAnoc || '',
        eventDesc: eventData.eventDesc || '',
        eventDate: formatDate(eventData.eventDate),
        location: eventData.location || '',
        seat: eventData.seat.toString(),
        ticketType: ticketType || [],
        launchDate: formatDate(eventData.launchDate),
        launchStatus: eventData.launchStatus || 1,
        saleDate: formatDate(eventData.saleDate)
      }

      setFormData(newFormData)
      setFileName(eventData.coverImg)
      setOriginalData({
        seat: newFormData.seat,
        ticketType: [...newFormData.ticketType]
      })
    } catch (error) {
      console.error('獲取數據時出錯:', error)
    } finally {
      setIsLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchEventData()
  }, [fetchEventData])

  // 封面圖片處理
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData((prevState) => ({
        ...prevState,
        coverImg: file
      }))
      setFileName(file.name)
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current.click()
  }

  // 輸入框處理
  const handleInputChange = (e) => {
    const { name, value } = e.target
    if (name === 'seat') {
      setFormData((prevState) => {
        let newTicketType
        if (value === originalData.seat) {
          // 如果切換回原始 seat 值，恢復原始 ticketType 數據
          newTicketType = [...originalData.ticketType]
        } else {
          // 否則，使用默認的 ticketType 結構
          newTicketType =
            value === '1'
              ? [
                  { type: '1F搖滾區', price: 0, stock: 0 },
                  { type: '2F坐席區', price: 0, stock: 0 },
                  { type: '2F站席區', price: 0, stock: 0 },
                  { type: '1F身障區', price: 0, stock: 0 }
                ]
              : [
                  { type: '一般票', price: 0, stock: 0 },
                  { type: '愛心票', price: 0, stock: 0 }
                ]
        }
        return {
          ...prevState,
          [name]: value,
          ticketType: newTicketType
        }
      })
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value
      }))
    }
  }

  const handleTicketTypeChange = (index, field, value) => {
    setFormData((prevState) => ({
      ...prevState,
      ticketType: prevState.ticketType.map((ticket, i) =>
        i === index ? { ...ticket, [field]: Number(value) } : ticket
      )
    }))
  }

  // CKEditor 相關設定
  const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
  const editorConfig = {
    toolbar: {
      items: [
        'undo',
        'redo',
        '|',
        'heading',
        '|',
        'fontSize',
        'fontFamily',
        'fontColor',
        'fontBackgroundColor',
        '|',
        'bold',
        'italic',
        'underline',
        '|',
        'link',
        'insertImage',
        'insertTable',
        'highlight',
        'blockQuote',
        'codeBlock',
        '|',
        'alignment',
        '|',
        'bulletedList',
        'numberedList',
        'todoList',
        'outdent',
        'indent'
      ],
      shouldNotGroupWhenFull: false
    },
    plugins: [
      AccessibilityHelp,
      Alignment,
      Autoformat,
      AutoImage,
      AutoLink,
      Autosave,
      BalloonToolbar,
      Base64UploadAdapter,
      BlockQuote,
      Bold,
      CloudServices,
      Code,
      CodeBlock,
      Essentials,
      FindAndReplace,
      FontBackgroundColor,
      FontColor,
      FontFamily,
      FontSize,
      Heading,
      Highlight,
      HorizontalLine,
      HtmlEmbed,
      Image,
      ImageBlock,
      ImageCaption,
      ImageInline,
      ImageInsert,
      ImageInsertViaUrl,
      ImageResize,
      ImageStyle,
      ImageTextAlternative,
      ImageToolbar,
      ImageUpload,
      Indent,
      IndentBlock,
      Italic,
      Link,
      LinkImage,
      List,
      ListProperties,
      MediaEmbed,
      Paragraph,
      PasteFromOffice,
      RemoveFormat,
      SelectAll,
      SpecialCharacters,
      SpecialCharactersArrows,
      SpecialCharactersCurrency,
      SpecialCharactersEssentials,
      SpecialCharactersLatin,
      SpecialCharactersMathematical,
      SpecialCharactersText,
      Strikethrough,
      Table,
      TableCellProperties,
      TableProperties,
      TableToolbar,
      TextTransformation,
      TodoList,
      Underline,
      Undo
    ],
    balloonToolbar: ['bold', 'italic', '|', 'link', 'insertImage', '|', 'bulletedList', 'numberedList'],
    fontFamily: {
      supportAllValues: true
    },
    fontSize: {
      options: [10, 12, 14, 'default', 18, 20, 22],
      supportAllValues: true
    },
    heading: {
      options: [
        {
          model: 'paragraph',
          title: 'Paragraph',
          class: 'ck-heading_paragraph'
        },
        {
          model: 'heading1',
          view: 'h1',
          title: 'Heading 1',
          class: 'ck-heading_heading1'
        },
        {
          model: 'heading2',
          view: 'h2',
          title: 'Heading 2',
          class: 'ck-heading_heading2'
        },
        {
          model: 'heading3',
          view: 'h3',
          title: 'Heading 3',
          class: 'ck-heading_heading3'
        },
        {
          model: 'heading4',
          view: 'h4',
          title: 'Heading 4',
          class: 'ck-heading_heading4'
        },
        {
          model: 'heading5',
          view: 'h5',
          title: 'Heading 5',
          class: 'ck-heading_heading5'
        },
        {
          model: 'heading6',
          view: 'h6',
          title: 'Heading 6',
          class: 'ck-heading_heading6'
        }
      ]
    },
    image: {
      upload: {
        types: ['jpeg', 'png', 'gif', 'bmp', 'webp', 'tiff']
      },
      toolbar: [
        'toggleImageCaption',
        'imageTextAlternative',
        '|',
        'imageStyle:inline',
        'imageStyle:wrapText',
        'imageStyle:breakText',
        '|',
        'resizeImage'
      ]
    },
    // initialData:
    //   '<h2>Congratulations on setting up CKEditor 5! </h2>\n<p>\n    You\'ve successfully created a CKEditor 5 project. This powerful text editor will enhance your application, enabling rich text editing\n    capabilities that are customizable and easy to use.\n</p>\n<h3>What\'s next?</h3>\n<ol>\n    <li>\n        <strong>Integrate into your app</strong>: time to bring the editing into your application. Take the code you created and add to your\n        application.\n    </li>\n    <li>\n        <strong>Explore features:</strong> Experiment with different plugins and toolbar options to discover what works best for your needs.\n    </li>\n    <li>\n        <strong>Customize your editor:</strong> Tailor the editor\'s configuration to match your application\'s style and requirements. Or even\n        write your plugin!\n    </li>\n</ol>\n<p>\n    Keep experimenting, and don\'t hesitate to push the boundaries of what you can achieve with CKEditor 5. Your feedback is invaluable to us\n    as we strive to improve and evolve. Happy editing!\n</p>\n<h3>Helpful resources</h3>\n<ul>\n    <li><a href="https://orders.ckeditor.com/trial/premium-features">Trial sign up</a>,</li>\n    <li><a href="https://ckeditor.com/docs/ckeditor5/latest/installation/index.html">Documentation</a>,</li>\n    <li><a href="https://github.com/ckeditor/ckeditor5">GitHub</a> (star us if you can!),</li>\n    <li><a href="https://ckeditor.com">CKEditor Homepage</a>,</li>\n    <li><a href="https://ckeditor.com/ckeditor-5/demo/">CKEditor 5 Demos</a>,</li>\n</ul>\n<h3>Need help?</h3>\n<p>\n    See this text, but the editor is not starting up? Check the browser\'s console for clues and guidance. It may be related to an incorrect\n    license key if you use premium features or another feature-related requirement. If you cannot make it work, file a GitHub issue, and we\n    will help as soon as possible!\n</p>\n',
    language: 'zh',
    link: {
      addTargetToExternalLinks: true,
      defaultProtocol: 'https://',
      decorators: {
        toggleDownloadable: {
          mode: 'manual',
          label: 'Downloadable',
          attributes: {
            download: 'file'
          }
        }
      }
    },
    list: {
      properties: {
        styles: true,
        startIndex: true,
        reversed: true
      }
    },
    menuBar: {
      isVisible: true
    },
    placeholder: 'Type or paste your content here!',
    table: {
      contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells', 'tableProperties', 'tableCellProperties']
    },
    translations: [translations]
  }
  // 編輯器開啟
  const editorContainerRef = useRef(null)
  const editorRef = useRef(null)
  const [editor, setEditor] = useState(null)
  const [isLayoutReady, setIsLayoutReady] = useState(false)

  useEffect(() => {
    if (editor) {
      editor.model.document.on('change:data', () => {
        const data = editor.getData()
        checkForImages(data)
      })
    }
  }, [editor])

  useEffect(() => {
    setIsLayoutReady(true)
    return () => setIsLayoutReady(false)
  }, [])

  // 圖片處理
  const uploadingImages = useRef(new Map())
  const uploadImage = useCallback(
    async (base64String) => {
      if (uploadingImages.current.get(base64String)) return

      uploadingImages.current.set(base64String, true)

      try {
        const base64Data = base64String.split(',')[1]
        const blob = b64toBlob(base64Data)

        if (blob.size > MAX_FILE_SIZE) {
          throw new Error('檔案大小超過 10MB 限制')
        }

        const formData = new FormData()
        formData.append('upload', blob, 'image.jpg')

        const uploadResponse = await axios.post('http://localhost:3000/riverflow/admin/events/imgUpload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          maxContentLength: Infinity,
          maxRedirects: 0,
          withCredentials: true
        })

        if (editor) {
          const newContent = editor.getData().replace(base64String, uploadResponse.data.url)
          editor.setData(newContent)
        }
      } catch (error) {
        console.error('圖片上傳失敗:', error.message)
        if (error.message === '檔案大小超過 10MB 限制') {
          alert('圖片大小超過 10MB，無法上傳。請選擇較小的圖片。')
          // 從編輯器中移除超過大小限制的圖片
          if (editor) {
            const newContent = editor.getData().replace(`<img src="${base64String}">`, '')
            editor.setData(newContent)
          }
        }
      } finally {
        uploadingImages.current.delete(base64String)
      }
    },
    [editor]
  )
  const checkForImages = useCallback(
    (content) => {
      const parser = new DOMParser()
      const doc = parser.parseFromString(content, 'text/html')
      const images = doc.getElementsByTagName('img')

      Array.from(images).forEach((img) => {
        if (img.src.startsWith('data:image') && !uploadingImages.current.has(img.src)) {
          uploadImage(img.src)
        }
      })
    },
    [uploadImage]
  )
  // base64轉blob
  function b64toBlob(b64Data, contentType = 'image/jpeg', sliceSize = 512) {
    const byteCharacters = atob(b64Data)
    const byteArrays = []

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize)
      const byteNumbers = new Array(slice.length)
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i)
      }
      const byteArray = new Uint8Array(byteNumbers)
      byteArrays.push(byteArray)
    }

    return new Blob(byteArrays, { type: contentType })
  }

  // 內容改變偵測
  const [editorContent, setEditorContent] = useState('')
  const debouncedCheckForImages = useCallback(debounce(checkForImages, 300), [checkForImages])
  const handleEditorChange = useCallback(
    (event, editor) => {
      const data = editor.getData()
      setEditorContent(data)
      setFormData((prevState) => ({
        ...prevState,
        eventDesc: data
      }))

      debouncedCheckForImages(data)
    },
    [debouncedCheckForImages]
  )

  // 時間處理
  function formatDateForMySQL(date) {
    if (!(date instanceof Date) || isNaN(date)) {
      console.error('Invalid date:', date)
      return null
    }
    return date.toISOString().slice(0, 19).replace('T', ' ')
  }

  // 送出資料更新
  const handleSubmit = async (e) => {
    e.preventDefault()
    const postData = new FormData()
    // for (const key in formData) {
    //   if (key === 'ticketType') {
    //     postData.append(key, JSON.stringify(formData[key]))
    //   } else if (key === 'coverImg') {
    //     postData.append(key, formData[key], formData[key].name)
    //   } else {
    //     postData.append(key, formData[key])
    //   }
    // }
    Object.keys(formData).forEach((key) => {
      if (key === 'eventDate' || key === 'launchDate' || key === 'saleDate') {
        const formattedDate = formatDateForMySQL(new Date(formData[key]))
        if (formattedDate) {
          postData.append(key, formattedDate)
        } else {
          console.error(`Invalid date for ${key}`)
        }
      } else if (key === 'ticketType') {
        postData.append(key, JSON.stringify(formData[key]))
      } else if (key === 'coverImg' && formData[key] instanceof File) {
        postData.append(key, formData[key], formData[key].name)
      } else {
        postData.append(key, formData[key])
      }
    })

    try {
      const response = await axios.put(`http://localhost:3000/riverflow/admin/events/${id}`, postData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        maxContentLength: Infinity,
        maxRedirects: 0,
        withCredentials: true
      })
      navigate(-1)
    } catch (error) {
      console.error('更新活動時出錯:', error)
    }
  }

  const [activeTab, setActiveTab] = useState('eventIntro')
  const handleTabChange = (tabId) => {
    setActiveTab(tabId)
  }

  return (
    <div className='main'>
      <div className='pageTitle'>活動編輯</div>
      <form onSubmit={handleSubmit} id='eventForm' encType='multipart/form-data'>
        <div className='tabs'>
          <ul className='tabBtnList'>
            <li>
              <button
                type='button'
                onClick={() => handleTabChange('eventIntro')}
                id='defaultOpen'
                className={`tabBtn ${activeTab === 'eventIntro' ? 'active' : ''}`}
              >
                活動資訊
              </button>
            </li>
            <li>
              <button
                type='button'
                onClick={() => handleTabChange('eventInfo')}
                className={`tabBtn ${activeTab === 'eventInfo' ? 'active' : ''}`}
              >
                活動介紹
              </button>
            </li>
          </ul>

          {/* tabContent 商品資訊 */}
          <div id='eventIntro' className={`tabContent ${activeTab === 'eventIntro' ? '' : 'hidden'}`}>
            <div className='infoItem'>
              <label htmlFor='eventName' className='editTitle'>
                活動名稱：
              </label>
              <input
                onChange={handleInputChange}
                value={formData.eventName}
                id='eventName'
                name='eventName'
                type='text'
                required
              />
            </div>
            <div className='infoItem'>
              <label className='editTitle'>主要圖片：</label>
              <div className='picItem'>
                <input
                  ref={fileInputRef}
                  type='file'
                  accept='image/*'
                  style={{ display: 'none' }}
                  className='fileInput'
                  name='coverImg'
                  onChange={handleFileChange}
                />
                <button type='button' onClick={handleUploadClick} className='custUpload'>
                  <i className='fa-solid fa-upload' /> 上傳圖片
                </button>
                <span id='fileChosen'>{fileName}</span>
              </div>
            </div>
            <div className='infoItem'>
              <label htmlFor='eventSort' className='editTitle'>
                商品分類：
              </label>
              <select onChange={handleInputChange} value={formData.eventType} name='eventSort' id='eventSort'>
                <option value='dj'>刷碟 Disc Jockey</option>
                <option value='graffiti'>塗鴉 Graffiti</option>
                <option value='rap'>饒舌 Rap</option>
                <option value='streetDance'>街舞 Street Dance</option>
                <option value='skate'>滑板 Skate</option>
              </select>
            </div>
            <div className='infoItem'>
              <label htmlFor='launchDate' className='editTitle'>
                活動上架時間：
              </label>
              <input
                onChange={handleInputChange}
                id='launchDate'
                name='launchDate'
                type='datetime-local'
                value={formData.launchDate}
                step={1}
                required
              />
            </div>
            <div className='infoItem itemflexList'>
              <div>
                <label htmlFor='eventSell' className='editTitle'>
                  活動開賣時間：
                </label>
                <input
                  onChange={handleInputChange}
                  id='eventSell'
                  name='saleDate'
                  type='datetime-local'
                  value={formData.saleDate}
                  step={1}
                  required
                />
              </div>
              <div>
                <label htmlFor='eventStart' className='editTitle'>
                  活動開始時間：
                </label>
                <input
                  onChange={handleInputChange}
                  id='eventStart'
                  name='eventDate'
                  type='datetime-local'
                  value={formData.eventDate}
                  step={1}
                  required
                />
              </div>
              <div>
                <label htmlFor='location' className='editTitle'>
                  活動地點：
                </label>
                <input
                  onChange={handleInputChange}
                  value={formData.location}
                  id='location'
                  name='location'
                  type='text'
                  required
                />
              </div>
            </div>
            <div className='infoItem'>
              <label className='editTitle'>活動場館：</label>
              <select value={formData.seat} onChange={handleInputChange} name='seat' id='eventPlace'>
                <option value='1'>室內-對號入座</option>
                <option value='0'>戶外-自由座</option>
              </select>
            </div>

            <div id='ticketTypeInputs'>
              {formData.ticketType.map((ticket, index) => (
                <div key={index} className='ticketTypeItem flex multiSect'>
                  <label className='editTitle'>{ticket.type}：</label>
                  <div className='itemPrice'>
                    <span className='priceMark event'>NT$</span>
                    <input
                      type='number'
                      min='0'
                      value={ticket.price}
                      onChange={(e) => handleTicketTypeChange(index, 'price', e.target.value)}
                      required
                    />
                  </div>
                  <div className='itemStock'>
                    <label>庫存：</label>
                    <input
                      type='number'
                      min='0'
                      value={ticket.stock}
                      onChange={(e) => handleTicketTypeChange(index, 'stock', e.target.value)}
                      required
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* tabContent 活動介紹 */}
          <div id='eventInfo' className={`tabContent ${activeTab === 'eventInfo' ? '' : 'hidden'}`}>
            <div className='introItem'>
              <label className='editTitle'>最新公告：</label>
              <div className='itemInfo'>
                <textarea
                  onChange={handleInputChange}
                  name='eventAnoc'
                  id='eventAnoc'
                  value={formData.eventAnoc}
                  placeholder='最新公告'
                ></textarea>
              </div>
            </div>
            <div className='introItem'>
              <label className='editTitle'>活動介紹：</label>
              <div className='itemInfo main-container'>
                <div className='editor-container editor-container_classic-editor' ref={editorContainerRef}>
                  <div className='editor-container__editor'>
                    <div ref={editorRef}>
                      {isLayoutReady && (
                        <CKEditor
                          editor={ClassicEditor}
                          config={editorConfig}
                          data={formData.eventDesc}
                          onReady={(editorInstance) => {
                            setEditor(editorInstance)
                          }}
                          onChange={handleEditorChange}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='btnList flex'>
          <button type='button' className='btn' onClick={() => navigate(-1)}>
            <i className='fa-solid fa-angle-left'></i> 返回
          </button>
          <button className='btn' type='submit'>
            <i className='fa-solid fa-floppy-disk'></i> 更新
          </button>
        </div>
      </form>
    </div>
  )
}
