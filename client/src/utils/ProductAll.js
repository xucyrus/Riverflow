// src/utils/ProductAll.js

import $ from 'jquery'
import Swiper from 'swiper/bundle'
import 'swiper/css/bundle'

$(document).ready(function () {
  // 初始化 Swiper
  const swiper = new Swiper('.swiper', {
    autoplay: {
      delay: 4000,
      loop: true
    },
    pagination: {
      el: '.swiper-pagination'
    },
    scrollbar: {
      el: '.swiper-scrollbar'
    }
  })

  // ----- 我的最愛標籤 -----
  $('.favorite').on('click', function (event) {
    event.preventDefault()
    $(this).find('i').toggleClass('selected')
    // 在這更新數據庫
  })

  //----- 商品篩選 -----
  $('#searchInput').on('keyup', function () {
    // 文字也轉小寫去做搜尋
    var value = $(this).val().toLowerCase()
    // 所有商品篩選
    $('.product-item').filter(function () {
      // 輸入框的值來顯示或著隱藏
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    })
  })

  // -----這邊會跟著上面的class類別 category 內的名字-----
  $('#categoryFilter a').on('click', function (e) {
    e.preventDefault()
    var category = $(this).data('filter')
    // 選擇全部就會全部顯示
    if (category == 'all') {
      $('.product-item').show()
    } else {
      // 這邊隱藏所有商品
      $('.product-item').hide()
      // 顯示符合條件商品
      $('.product-item[data-category*="' + category + '"]').show()
    }
  })

  //----- 左邊篩選點選有顏色 -----
  $('.shop-filter-item').on('click', function () {
    $('.shop-filter-item a').removeClass('selected')
    $(this).find('a').addClass('selected')
  })
})
