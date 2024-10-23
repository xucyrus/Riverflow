// Author: zhier1114
import React, { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
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

export default function AddBlog() {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  // 儲存的資料格式
  const [formData, setFormData] = useState({
    newsType: 'dj',
    newsTitle: '',
    coverImg: null,
    newsContent: '',
    newsAuthor: '',
    newsStatus: 1
  })

  // 封面圖片處理
  const [fileName, setFileName] = useState('未選擇任何檔案')
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFileName(file.name)
      setFormData((prevState) => ({
        ...prevState,
        coverImg: file
      }))
    }
  }

  // 發布時間處理
  const [minDateTime, setMinDateTime] = useState('')
  useEffect(() => {
    const now = new Date()
    const offset = now.getTimezoneOffset()
    now.setMinutes(now.getMinutes() - offset)
    setMinDateTime(now.toISOString().slice(0, 16))
  }, [])

  // 輸入框處理
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: value
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

        const uploadResponse = await axios.post('http://localhost:3000/riverflow/admin/news/imgUpload', formData, {
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
        newsContent: data
      }))

      debouncedCheckForImages(data)
    },
    [debouncedCheckForImages]
  )

  // 送出資料儲存
  const handleSubmit = async (e) => {
    e.preventDefault()
    const postData = new FormData()
    for (const key in formData) {
      postData.append(key, formData[key])
    }

    try {
      const response = await axios.post('http://localhost:3000/riverflow/admin/news/create', postData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        maxContentLength: Infinity, // 不限制请求体大小
        maxRedirects: 0, // 不允许重定向,
        withCredentials: true
      })
      navigate(-1)
    } catch (error) {
      console.error('創建部落格文章時出錯:', error)
    }
  }

  return (
    <div className='main'>
      <div className='pageTitle'>新增專欄</div>
      <form onSubmit={handleSubmit}>
        <div className='tabs'>
          <ul className='tabBtnList'>
            <li>
              <a href='#infoBlog' id='defaultOpen' className='tabBtn active'>
                專欄資訊
              </a>
            </li>
          </ul>

          <div id='infoBlog' className='tabContent'>
            <div className='infoItem'>
              <label htmlFor='newsTitle' className='editTitle'>
                文章標題：
              </label>
              <input
                id='newsTitle'
                name='newsTitle'
                type='text'
                required
                value={formData.newsTitle}
                onChange={handleInputChange}
              />
              <span className='required'>※此欄位為必填</span>
            </div>
            <div className='infoItem'>
              <label className='editTitle'>主要圖片：</label>
              <div className='picItem'>
                <label htmlFor='coverImg' className='custUpload'>
                  <i className='fa-solid fa-upload' /> 上傳圖片
                </label>
                <input
                  id='coverImg'
                  name='coverImg'
                  type='file'
                  required
                  accept='image/png, image/jpeg'
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
                <span id='fileChosen'>{fileName}</span>
              </div>
            </div>
            <div className='infoItem'>
              <label htmlFor='newsType' className='editTitle'>
                文章分類：
              </label>
              <select name='newsType' id='newsType' required value={formData.newsType} onChange={handleInputChange}>
                <option value='DJ'>刷碟 Disc Jockey</option>
                <option value='塗鴉'>塗鴉 Graffiti</option>
                <option value='饒舌'>饒舌 Rap</option>
                <option value='街舞'>街舞 Street Dance</option>
                <option value='滑板'>滑板 Skate</option>
              </select>
            </div>
            <div className='infoItem'>
              <label htmlFor='newsAuthor' className='editTitle'>
                文章作者：
              </label>
              <input
                id='newsAuthor'
                name='newsAuthor'
                type='text'
                required
                value={formData.newsAuthor}
                onChange={handleInputChange}
              />
            </div>
            <div className='introItem'>
              <label htmlFor='newsContent' className='editTitle'>
                專欄內文：
              </label>
              <div className='itemInfo main-container'>
                <div className='editor-container editor-container_classic-editor' ref={editorContainerRef}>
                  <div className='editor-container__editor'>
                    <div ref={editorRef}>
                      {isLayoutReady && (
                        <CKEditor
                          editor={ClassicEditor}
                          config={editorConfig}
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
            <div className='infoItem'>
              <label htmlFor='pubTime' className='editTitle'>
                發布時間：
              </label>
              <input
                id='pubTime'
                name='pubTime'
                type='datetime-local'
                onChange={handleInputChange}
                min={minDateTime}
                value={formData.pubTime}
                step='1' // 這允許秒數的輸入
              />
            </div>
          </div>
        </div>
        <div className='btnList flex'>
          <button className='btn' type='button' onClick={() => navigate(-1)}>
            <i className='fa-solid fa-angle-left' /> 返回
          </button>
          <button className='btn' type='submit'>
            <i className='fa-solid fa-floppy-disk' /> 新增
          </button>
        </div>
      </form>
    </div>
  )
}
