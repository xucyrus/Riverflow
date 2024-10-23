import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import $, { data } from 'jquery'
import 'jquery-ui/ui/widgets/tabs'
import MultiSelectDropdown from '../../components/MultiSelectDropdown'
import PrdImgUploader from '../../components/prdImgUploader'
import axios from 'axios'

export default function AddPrd() {
  const navigate = useNavigate()
  const [imageFields, setImageFields] = useState([{ id: 0, file: null, fileName: '', preview: '' }])
  const [selectedOptions, setSelectedOptions] = useState([])
  const [specItems, setSpecItems] = useState([{ id: 1, title: '', isInitial: true }])
  const [tableItems, setTableItems] = useState([{ id: 1, name: '', stock: 0, isInitial: true }])
  const [isDisChecked, setIsDisChecked] = useState(false)
  const [formData, setFormData] = useState({
    productName: '',
    productSpec1: '',
    productSpec2: '',
    productDesc: '',
    productPrice: '',
    discount: false,
    discountRate: '',
    discountStart: '',
    discountEnd: '',
    productRating: null,
    productStatus: 'Discontinued',
    launchDate: null,
    removeDate: null
  })

  // tab
  $(function () {
    $('.tabs').tabs()
    $('.tabBtn').on('click', function () {
      // console.log(this)
      $('.tabBtn').removeClass('active')
      $(this).addClass('active')
    })
  })

  // 圖片上傳抓取檔名
  $('#prdPic').on('change', function () {
    // console.log($(this).prop('files'))
    $('#fileChosen').text($(this).prop('files')[0].name)
  })

  // 圖片走Multer
  // const handleImageChange = async (id, event) => {
  //   const file = event.target.files[0];
  //   if (file) {
  //     try {
  //       const formData = new FormData();
  //       formData.append('image', file);

  //       const response = await axios.post('http://localhost:3000/riverflow/admin/products/imgUpload', formData, {
  //         headers: {
  //           'Content-Type': 'multipart/form-data'
  //         },
  //         withCredentials: true
  //       });

  //       setImageFields(prevFields => prevFields.map(field => {
  //         if (field.id === id) {
  //           return { 
  //             ...field, 
  //             fileName: response.data.fileName,
  //             preview: response.data.url
  //           };
  //         }
  //         return field;
  //       }));

  //     } catch (error) {
  //       console.error('Error processing image:', error);
  //       // 處理錯誤
  //     }
  //   }
  // }
  // 圖片沒走multer
  const handleImageChange = (id, event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const newImageFields = imageFields.map((field) => {
          if (field.id === id) {
            return { ...field, file: file, fileName: file.name, preview: reader.result }
          }
          return field
        })
        setImageFields(newImageFields)
      }
      reader.readAsDataURL(file)
    }
  }

  const addImageField = () => {
    const newId = imageFields.length > 0 ? Math.max(...imageFields.map((f) => f.id)) + 1 : 0
    setImageFields([...imageFields, { id: newId, file: null, fileName: '', preview: '' }])
  }

  const removeImageField = (id) => {
    setImageFields(imageFields.filter((field) => field.id !== id))
  }

  // input
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prevState) => {
      const newState = {
        ...prevState,
        [name]: value
      }
      // console.log('Updated FormData', newState)
      return newState
    })
  }

  // 新增規格
  const addItem = () => {
    const newItemId = specItems.length + 1
    setSpecItems([
      ...specItems,
      {
        id: newItemId,
        title: '',
        isInitial: false
      }
    ])
    setTableItems([
      ...tableItems,
      {
        id: newItemId,
        name: '',
        stock: 0,
        isInitial: false
      }
    ])
  }

  // 規格回傳
  const generateProductOpt = () => {
    return specItems
      .map((item, index) => {
        const stock = tableItems[index]?.stock || 0
        return {
          name: item.title,
          stock: stock,
          status: stock > 0 ? 'Available' : 'Out of Stock'
        }
      })
      .filter((item) => item.name)
  }

  // 分類選項
  const handleChange = (selected) => {
    setSelectedOptions(selected)
  }

  // 送出
  const handleSubmit = async () => {
    console.log('提交開始formData', formData)

    const selectedCategories = selectedOptions.map((option) => option.value)

    // const productImgs = imageFields.filter((field) => field.preview).map((field) => field.preview)
    // console.log('productImg : ', productImgs)

    const productOpt = generateProductOpt()

    const formDataToSend = new FormData()

    // 添加基本字段
    Object.keys(formData).forEach((key) => {
      if (key === 'productPrice') {
        formDataToSend.append(key, formData[key] ? parseInt(formData[key]) : '')
      } else if (key === 'discountRate') {
        formDataToSend.append(key, formData[key] ? parseFloat(formData[key]) : '')
      } else {
        formDataToSend.append(key, formData[key])
      }
    })

    // 添加類別和選項
    selectedCategories.forEach((category) => {
      formDataToSend.append('productCategories', category)
    })

    // 處理圖片
    const productImgs = imageFields.map(field => field.fileName).filter(Boolean)
    // 單獨添加每個圖片
    productImgs.forEach((fileName, index) => {
      formDataToSend.append(`productImgs[${index}]`, fileName)
    })
    // formDataToSend.append('productImgs', JSON.stringify(productImgs))

    // productImgs.forEach((dataUrl, index) => {
    //   formDataToSend.append(`productImgs[${index}]`, dataUrl)
    // })

    // const base64ToBlob = async (dataUrl) => {
    //   const response = await fetch(dataUrl)
    //   const blob = await response.blob()
    //   return blob
    // }

    // // 處理圖片
    // for (let i = 0; i < imageFields.length; i++) {
    //   if (imageFields[i].preview) {
    //     try {
    //       const blob = await base64ToBlob(imageFields[i].preview)
    //       formDataToSend.append(`productImgs`, blob, `image${i}.jpg`)
    //     } catch (error) {
    //       console.error('將圖片轉換為 Blob 時發生錯誤:', error)
    //     }
    //   }
    // }

    formDataToSend.append('productOpt', JSON.stringify(productOpt))
    // formDataToSend.append('productOpt', productOpt)

    console.log('FormData contents:')
    for (let [key, value] of formDataToSend.entries()) {
      console.log(`key: ${key}, value: ${value}, type: ${typeof value}`)
    }

    try {
      const response = await axios.post('http://localhost:3000/riverflow/admin/products/create', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
      })
      console.log('提交成功:', response.data)
      navigate(-1)
    } catch (error) {
      console.error('提交失敗', error)
    }
  }

  return (
    <div className='main'>
      <div className='pageTitle'>新增商品</div>
      <form action='' id='prdForm' enctype='multipart/form-data'>
        <div className='tabs'>
          <ul className='tabBtnList'>
            <li>
              <a href='#infoDesc' id='defaultOpen' className='tabBtn active'>
                商品基本資訊
              </a>
            </li>
            <li>
              <a href='#infoSpec' className='tabBtn'>
                商品規格
              </a>
            </li>
            <li>
              <a href='#prdDiscount' className='tabBtn'>
                商品優惠
              </a>
            </li>
          </ul>

          {/* tabContent 商品資訊 */}
          <div id='infoDesc' className='tabContent'>
            <div className='infoItem'>
              <label htmlFor='productName' className='editTitle'>
                商品名稱：
              </label>
              <input
                id='productName'
                name='productName'
                type='text'
                required
                value={formData.productName}
                onChange={handleInputChange}
              />
            </div>
            <PrdImgUploader
              imageFields={imageFields}
              handleImageChange={handleImageChange}
              addImageField={addImageField}
              removeImageField={removeImageField}
            />
            <MultiSelectDropdown selectedOptions={selectedOptions} onChange={handleChange} />
            <div className='infoItem'>
              <label htmlFor='productPrice' className='editTitle'>
                商品售價：
              </label>
              <div className='itemPrice'>
                <span className='priceMark event'>NT$</span>
                <input
                  id='productPrice'
                  name='productPrice'
                  type='number'
                  min='0'
                  required
                  value={formData.productPrice}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className='infoItem itemList'>
              <span className='editTitle'>商品特性：</span>
              <div className='descInfo'>
                <div className='descItem'>
                  <label htmlFor='productDesc' className='editTitle'>
                    說明：
                  </label>
                  <input
                    id='productDesc'
                    name='productDesc'
                    type='text'
                    required
                    value={formData.productDesc}
                    onChange={handleInputChange}
                  />
                </div>
                <div className='descItem'>
                  <label htmlFor='productSpec1' className='editTitle'>
                    適用：
                  </label>
                  <input
                    id='productSpec1'
                    name='productSpec1'
                    type='text'
                    required
                    value={formData.productSpec1}
                    onChange={handleInputChange}
                  />
                </div>
                <div className='descItem'>
                  <label htmlFor='productSpec2' className='editTitle'>
                    材質：
                  </label>
                  <input
                    id='productSpec2'
                    name='productSpec2'
                    type='text'
                    required
                    value={formData.productSpec2}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* tabContent 商品規格 */}
          <div id='infoSpec' className='tabContent'>
            <div className='specEdit'>
              <span className='editTitle'>規格選項：</span>
              <div className='specInfo'>
                {specItems.map((item, index) => (
                  <div key={item.id} className='specItem' spec-id={item.id}>
                    <label htmlFor={`prdSpec${item.id}`}>規格{item.id}名稱：</label>
                    <input
                      id={`prdSpec${item.id}`}
                      name={`prdSpec${item.id}`}
                      value={item.title}
                      type='text'
                      className='specTitle'
                      required
                      onChange={(e) => {
                        const newItems = [...specItems]
                        newItems[index].title = e.target.value
                        setSpecItems(newItems)

                        const newTableItems = [...tableItems]
                        newTableItems[index].name = e.target.value
                        setTableItems(newTableItems)
                      }}
                    />
                    <button onClick={addItem} className='addItem'>
                      <i className='bi bi-plus-circle' />
                    </button>
                    {!item.isInitial && (
                      <button
                        onClick={() => {
                          const newSpecItems = specItems.filter((_, i) => i !== index)
                          setSpecItems(newSpecItems)

                          const newTableItems = tableItems.filter((_, i) => i !== index)
                          setTableItems(newTableItems)
                        }}
                        className='delItem'
                      >
                        <i className='bi bi-dash-circle' />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <hr />
            <div>
              <table className='specSum'>
                <thead>
                  <tr>
                    <td>規格</td>
                    <td>庫存</td>
                  </tr>
                </thead>
                <tbody>
                  {tableItems.map((item, index) => (
                    <tr key={item.id} className='specItemInfo' spec-id={item.id}>
                      <td>
                        <span id={`specName${item.id}`} className='itemTitle'>
                          {item.name}
                        </span>
                      </td>
                      <td>
                        <input
                          type='number'
                          name={`specStock${item.id}`}
                          id={`specStock${item.id}`}
                          min='0'
                          step='1'
                          value={item.stock}
                          onChange={(e) => {
                            const newTableItems = [...tableItems]
                            newTableItems[index].stock = parseInt(e.target.value) || 0
                            setTableItems(newTableItems)
                          }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* tabContent 商品優惠 */}
          <div id='prdDiscount' className='tabContent'>
            <div className='infoItem'>
              <span>商品優惠：</span>
              <input
                type='checkbox'
                name='disCheck'
                id='disCheck'
                className='prdDisCheck'
                checked={isDisChecked}
                onChange={(e) => setIsDisChecked(e.target.checked)}
              />
              <label htmlFor='disCheck' className='checkmark'>
                {' '}
              </label>
            </div>
            <div className={`ifHasDis ${isDisChecked ? '' : 'hidden'}`}>
              <div className='infoItem itemflexList'>
                <div>
                  <label htmlFor='discountStart' className='editTitle'>
                    優惠開始時間：
                  </label>
                  <input
                    id='discountStart'
                    type='datetime-local'
                    name='discountStart'
                    value={formData.discountStart}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label htmlFor='discountEnd' className='editTitle'>
                    優惠結束時間：
                  </label>
                  <input
                    id='discountEnd'
                    type='datetime-local'
                    name='discountEnd'
                    value={formData.discountEnd}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className='infoItem'>
                <label htmlFor='discountRate' className='editTitle'>
                  優惠方式：
                </label>
                <input
                  id='discountRate'
                  name='discountRate'
                  className='discountWay'
                  type='number'
                  min='0'
                  max='1'
                  step='0.01'
                  placeholder='輸入0～1之間的數字'
                  value={formData.discountRate}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
        </div>
        <div className='btnList flex'>
          <a>
            <button className='btn' onClick={() => navigate(-1)}>
              <i className='fa-solid fa-angle-left' /> 返回
            </button>
          </a>
          <button
            onClick={(e) => {
              e.preventDefault()
              handleSubmit()
            }}
            className='btn'
          >
            <i className='fa-solid fa-floppy-disk' /> 儲存
          </button>
        </div>
      </form>
    </div>
  )
}
