import $ from 'jquery';


$(document).ready(function () {
    // 數量增加
    $('.increment').on("click", function () {
        var target = $(this).data('target');
        var quantityValue = parseInt($(target).text());
        if (quantityValue < 4) {
            $(target).text(quantityValue + 1);
        }

        buttonState();



    })

    //數量減少
    $('.decrement').on("click", function () {
        var target = $(this).data('target');
        var quantityValue = parseInt($(target).text());
        if (quantityValue > 0) {
            $(target).text(quantityValue - 1);
        }

        buttonState();
    })

    // 要有數量才能按下一步


    function buttonState() {

        // 宣告全部票數累積
        var totalQuantity = 0;
        $('[id^="quantity"]').each(function () {
            totalQuantity += parseInt($(this).text()) || 0;
            // ||0 安全措施，怕返回的不是數值
        });

        var $button = $('#nextBtn');
        if (totalQuantity === 0) {
            $($button).addClass('link-disabled');
        } else {
            $($button).removeClass('link-disabled');
        }
    }
    buttonState();

})