import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../assets/login.css';
import Header from '../components/header';
import Footer from '../components/footer'

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const LoginVerify = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [checkPasswordError, setCheckPasswordError] = useState('');
    const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
    const [resetToken, setResetToken] = useState('');
    const [resetSuccess, setResetSuccess] = useState('');
    const [resetError, setResetError] = useState('');

    const { token } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (token) {
            setResetToken(token);
        }
    }, [token]);

    const handlePasswordToggle = (type) => {
        if (type === 'isNewPasswordVisible') {
            setIsNewPasswordVisible(prev => !prev);
        } else if (type === 'isConfirmPasswordVisible') {
            setIsConfirmPasswordVisible(prev => !prev);
        }
    };

    const NewPassword = (event) => {
        const newPassword = event.target.value;
        const passwordPattern = /^(?=.*[a-zA-Z])(?=.*[0-9]).{6,}$/;
        let passwordError = '';

        if (!newPassword.match(passwordPattern)) {
            passwordError = '<i className="bi bi-asterisk"></i> 請輸入正確的密碼格式: 含英數至少六個字元';
        } else if (!newPassword) {
            passwordError = '<i className="bi bi-asterisk"></i> 請輸入密碼';
        } else {
            passwordError = '';
        }

        setNewPassword(newPassword);
        setPasswordError(passwordError);
        CheckPassword();
    };

    const CheckPassword = () => {
        let checkPasswordError = '';

        if (confirmPassword && newPassword !== confirmPassword) {
            checkPasswordError = '<i className="bi bi-asterisk"></i> 密碼不吻合';
        } else if (confirmPassword && newPassword === confirmPassword) {
            checkPasswordError = '密碼吻合';
        } else {
            checkPasswordError = '';
        }

        setCheckPasswordError(checkPasswordError);
    };

    const handleConfirmPasswordChange = (event) => {
        const confirmPassword = event.target.value;
        setConfirmPassword(confirmPassword);
        CheckPassword();
    };

    const resetPassword = async () => {
        try {
            if (!newPassword || !resetToken) {
                throw new Error('新密码或重置令牌缺失');
            }

            const response = await axios.post(
                `http://localhost:3000/riverflow/reset-password/${resetToken}`,
                { newSecret: newPassword }
            );
            MySwal.fire({
                title: "密碼重置成功",
                text: "密碼已開通，請登入會員！",
                width: "300px",
                background: "var(--bk2)",
                color: "var(--gr1)",
                confirmButtonColor: "var(--main)",
                confirmButtonText: "OK",
                customClass: {
                    title: 'custom-title',  // 標題的class
                    htmlContainer: 'custom-text',  // 內文的class
                    confirmButton: 'swal2-confirm' // 按鈕的樣式
                },
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location = "/Login/Index";
                }
            });
        } catch (error) {
            console.error('Error resetting password:', error);
            setResetError('密码重置失败，请稍后再试。');
            setResetSuccess('');
        }
    };

    return (
        <div>
            <Header />
            <section className="verify">
                <div className="form">
                    <h4>修改密碼</h4>
                    <div className="input-text input-password">
                        <label>新密碼</label>
                        <input
                            type={isNewPasswordVisible ? 'text' : 'password'}
                            name="newPassword"
                            id="newPassword"
                            value={newPassword}
                            placeholder="Enter new password"
                            autoComplete="new-password"
                            required
                            onChange={NewPassword}
                        />
                        <div>
                            <i
                                className={`bi ${isNewPasswordVisible ? 'bi-eye-fill' : 'bi-eye-slash-fill'}`}
                                onClick={() => handlePasswordToggle('isNewPasswordVisible')}
                            ></i>
                        </div>
                    </div>
                    <span className="tips" dangerouslySetInnerHTML={{ __html: passwordError || '含英數至少六個字元' }}></span>
                    <br />

                    <div className="input-text input-password">
                        <label>確認密碼</label>
                        <input
                            type={isConfirmPasswordVisible ? 'text' : 'password'}
                            name="confirmPassword"
                            id="checkPassword"
                            value={confirmPassword}
                            placeholder="Enter password"
                            autoComplete="new-password"
                            onChange={handleConfirmPasswordChange}
                        />
                        <div>
                            <i
                                className={`bi ${isConfirmPasswordVisible ? 'bi-eye-fill' : 'bi-eye-slash-fill'}`}
                                onClick={() => handlePasswordToggle('isConfirmPasswordVisible')}
                            ></i>
                        </div>
                    </div>
                    <span className="tips" dangerouslySetInnerHTML={{ __html: checkPasswordError }}></span>
                    <br />

                    <input
                        type="button"
                        className="btn"
                        onClick={resetPassword}
                        value="確認"
                    />

                    {resetSuccess && <p className="success-message">{resetSuccess}</p>}
                    {resetError && <p className="error-message">{resetError}</p>}
                </div>
            </section>
            <Footer/>
        </div>
    );
};

export default LoginVerify;
