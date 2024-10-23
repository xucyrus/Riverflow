import React from 'react'

const PrdImgUploader = ({ imageFields, handleImageChange, addImageField, removeImageField }) => {
  return (
    <div className='infoItem imgInfoItem'>
      {imageFields.map((field, index) => (
        <div key={field.id} className='picItem'>
          <label className='editTitle'>{index === 0 ? '主要圖片：' : '商品圖片：'}</label>
          <label htmlFor={`productImgs-${field.id}`} className='custUpload'>
            <i className='fa-solid fa-upload' /> 上傳圖片
          </label>
          <input
            id={`productImgs-${field.id}`}
            name={`productImgs-${field.id}`}
            type='file'
            required
            accept='image/png, image/jpeg'
            onChange={(e) => handleImageChange(field.id, e)}
          />
          <span id={`fileChosen-${field.id}`}>{field.file ? field.file.name : '未選擇任何檔案'}</span>
          {index === imageFields.length - 1 && (
            <button type='button' className='addItem' onClick={addImageField}>
              <i className='bi bi-plus-circle' />
            </button>
          )}
          {index > 0 && (
            <button type='button' className='delItem' onClick={() => removeImageField(field.id)}>
              <i className='bi bi-dash-circle' />
            </button>
          )}
          {field.preview && (
            <img src={field.preview} alt="Preview" style={{width: '100px', height: 'auto'}} />
          )}
        </div>
      ))}
    </div>
  )
}

export default PrdImgUploader
