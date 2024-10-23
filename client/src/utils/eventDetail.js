import $ from 'jquery';
$(document).ready(function () {
    $(window).on('scroll', function () {
      var scrollPosition = $(window).scrollTop()

      $('.eventBar a').each(function () {
        var currentLink = $(this)
        var refElement = $(currentLink.attr('href'))

        if (
          refElement.position().top <= scrollPosition + 110 &&
          refElement.position().top + refElement.height() > scrollPosition
        ) {
          $('.eventBar a').removeClass('active')
          currentLink.addClass('active')
        }
      })
    })
  })