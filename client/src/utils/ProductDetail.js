import React, { useState, useEffect } from 'react'
import Swal from 'sweetalert2'
import '../utils/ProductDetail.js'

const ProductDetail = () => {
  const [selectedSize, setSelectedSize] = useState('')
  const [quantity, setQuantity] = useState(1)
  const unitPrice = 100

  const updateTotalPrice = () => {
    const price = parseInt(product.price.replace('NT$', '').replace(',', ''))
    return `NT$${price * quantity}`
  }

  const handleSizeClick = (size) => {
    setSelectedSize(size)
  }

  const handleQuantityChange = (delta) => {
    setQuantity((prevQuantity) => Math.max(1, prevQuantity + delta))
  }

  const handleAddToCart = () => {
    if (selectedSize === '') {
      Swal.fire({
        icon: 'error',
        title: '請選擇尺寸規格',
        confirmButtonColor: 'red'
      })
      return
    }

    Swal.fire({
      icon: 'success',
      title: '已成功加入購物車',
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true
    })
  }

  useEffect(() => {
    const lightbox = window.lightbox
    if (lightbox) {
      lightbox.option({
        resizeDuration: 200,
        wrapAround: true
      })
    }
  }, [])

  return (
    <div>
      <div className="product-images">
        {/* Lightbox images */}
        <a href="image1.jpg" data-lightbox="product">
          <img src="thumbnail1.jpg" alt="Product Image 1" />
        </a>
        <a href="image2.jpg" data-lightbox="product">
          <img src="thumbnail2.jpg" alt="Product Image 2" />
        </a>
      </div>

      <div className="product-details">
        <h1>Product Name</h1>
        <p id="price">${updateTotalPrice()}</p>

        <div className="size-options">
          <button
            className={`size-option ${selectedSize === 'S' ? 'selected' : ''}`}
            onClick={() => handleSizeClick('S')}
          >
            S
          </button>
          <button
            className={`size-option ${selectedSize === 'M' ? 'selected' : ''}`}
            onClick={() => handleSizeClick('M')}
          >
            M
          </button>
          <button
            className={`size-option ${selectedSize === 'L' ? 'selected' : ''}`}
            onClick={() => handleSizeClick('L')}
          >
            L
          </button>
        </div>

        <div className="quantity-controls">
          <button onClick={() => handleQuantityChange(-1)}>-</button>
          <input type="text" value={quantity} readOnly />
          <button onClick={() => handleQuantityChange(1)}>+</button>
        </div>

        <button className="add-to-cart" onClick={handleAddToCart}>
          加入購物車
        </button>
      </div>
    </div>
  )
}

export default ProductDetail
