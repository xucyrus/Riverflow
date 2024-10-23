import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';

const PaymentSuccess = () => {
  const [paymentStatus, setPaymentStatus] = useState('processing');
  const location = useLocation();
  const navigate = useNavigate();
  const processedRef = useRef(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const sessionId = urlParams.get('session_id');
    const isEventPayment = urlParams.get('event') === 'true';
    const token = Cookies.get('token');

    if (sessionId && !processedRef.current) {
      processedRef.current = true;
      const endpoint = isEventPayment
        ? `http://localhost:3000/riverflow/events/Tobuy/event-payment-success`
        : `http://localhost:3000/riverflow/pay/payment-success`;

      Swal.fire({
        title: '處理中',
        text: '正在處理您的付款...',
        icon: 'info',
        allowOutsideClick: false,
        showConfirmButton: false,
        willOpen: () => {
          Swal.showLoading();
        }
      });

      fetch(`${endpoint}?session_id=${sessionId}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
        .then(response => {
          if (!response.ok) {
            return response.text().then(text => {
              throw new Error(`網絡回應不正常 (${response.status}): ${text}`);
            });
          }
          return response.json();
        })
        .then(data => {
          setPaymentStatus('success');
          Swal.fire({
            title: '付款成功！',
            text: '您的訂單已成功處理。5秒後將自動跳轉到會員頁。',
            icon: 'success',
            timer: 5000,
            timerProgressBar: true,
            showConfirmButton: false
          }).then(() => {
            navigate('/Member/Index');
          });
        })
        .catch(error => {
          console.error('錯誤:', error);
          setPaymentStatus('error');
          Swal.fire({
            title: '付款錯誤',
            text: error.message || '處理您的付款時發生錯誤。',
            icon: 'error',
            confirmButtonText: '確定'
          });
        });
    }
  }, [location, navigate]);

  return null; // 組件不需要渲染任何內容，因為 SweetAlert 會處理所有的 UI
};

export default PaymentSuccess;