// Authentication System for SparkingTiming
class AuthSystem {
    constructor() {
        this.API_BASE_URL = 'https://api.sparkingtiming.com';
        this.API_VERSION = '/v1';
        this.TIMEOUT = 10000;
        this.currentLanguage = 'zh';
        this.verificationCodeSent = false;
        this.verificationCodeTimer = null;
        this.verificationCodeCountdown = 0;
        this.init();
    }
    
    init() {
        this.detectLanguage();
        this.bindEventListeners();
    }
    
    detectLanguage() {
        const urlParams = new URLSearchParams(window.location.search);
        const langParam = urlParams.get('lang');
        
        if (langParam === 'en') {
            this.currentLanguage = 'en';
        } else if (langParam === 'zh') {
            this.currentLanguage = 'zh';
        }
    }
    
    bindEventListeners() {
        if (document.getElementById('registerForm')) {
            this.bindRegisterEvents();
        }
        if (document.getElementById('loginForm')) {
            this.bindLoginEvents();
        }
    }
    
    bindRegisterEvents() {
        const sendVerificationBtn = document.querySelector('.verification-resend');
        if (sendVerificationBtn) {
            sendVerificationBtn.addEventListener('click', () => this.sendVerificationCode());
        }
        
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => this.handleRegister(e));
        }
    }
    
    bindLoginEvents() {
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }
    }
    
    async sendVerificationCode() {
        const emailInput = document.getElementById('email');
        const email = emailInput?.value?.trim();
        
        if (!email) {
            this.showMessage(this.getMessage('pleaseEnterEmail'), 'error');
            return;
        }
        
        if (!this.isValidEmail(email)) {
            this.showMessage(this.getMessage('invalidEmail'), 'error');
            return;
        }
        
        try {
            this.showLoading(true);
            
            // Use server validation to send verification code
            const result = await window.serverValidation.sendVerificationCode(email);
            
            if (result.success) {
                this.showMessage(this.getMessage('verificationCodeSent'), 'success');
                this.startVerificationCountdown();
                this.verificationCodeSent = true;
            } else {
                throw new Error(result.message);
            }
            
        } catch (error) {
            this.showMessage(window.serverValidation?.handleAPIError(error) || error.message, 'error');
            console.error('Verification code error:', error);
        } finally {
            this.showLoading(false);
        }
    }
    
    async handleRegister(event) {
        event.preventDefault();
        
        const formData = this.getRegisterFormData();
        const validation = this.validateRegisterForm(formData);
        
        if (!validation.isValid) {
            this.showMessage(validation.message, 'error');
            return;
        }
        
        try {
            this.showLoading(true);
            
            // Use server validation to register user
            const result = await window.serverValidation.registerUser(formData);
            
            if (result.success) {
                this.showMessage(this.getMessage('registerSuccess'), 'success');
                localStorage.setItem('userRegistered', 'true');
                localStorage.setItem('userInfo', JSON.stringify({
                    name: formData.name,
                    email: formData.email
                }));
                
                setTimeout(() => {
                    window.location.href = this.currentLanguage === 'zh' ? 'index-zh.html' : 'index.html';
                }, 2000);
            } else {
                throw new Error(result.message);
            }
            
        } catch (error) {
            this.showMessage(window.serverValidation?.handleAPIError(error) || error.message, 'error');
            console.error('Registration error:', error);
        } finally {
            this.showLoading(false);
        }
    }
    
    async handleLogin(event) {
        event.preventDefault();
        
        const email = document.getElementById('username')?.value?.trim();
        const password = document.getElementById('password')?.value;
        const remember = document.getElementById('remember')?.checked;
        
        if (!email || !password) {
            this.showMessage(this.getMessage('pleaseEnterEmailPassword'), 'error');
            return;
        }
        
        try {
            this.showLoading(true);
            
            // Use server validation to login user
            const result = await window.serverValidation.loginUser({ email, password, remember });
            
            if (result.success) {
                this.showMessage(this.getMessage('loginSuccess'), 'success');
                localStorage.setItem('userRegistered', 'true');
                localStorage.setItem('userInfo', JSON.stringify({ email: email }));
                
                // Store auth token if provided
                if (result.token) {
                    localStorage.setItem('authToken', result.token);
                }
                
                setTimeout(() => {
                    window.location.href = this.currentLanguage === 'zh' ? 'index-zh.html' : 'index.html';
                }, 1500);
            } else {
                throw new Error(result.message);
            }
            
        } catch (error) {
            this.showMessage(window.serverValidation?.handleAPIError(error) || error.message, 'error');
            console.error('Login error:', error);
        } finally {
            this.showLoading(false);
        }
    }
    
    getRegisterFormData() {
        return {
            name: document.getElementById('name')?.value?.trim(),
            email: document.getElementById('email')?.value?.trim(),
            verificationCode: document.getElementById('verification')?.value?.trim(),
            password: document.getElementById('password')?.value,
            confirmPassword: document.getElementById('confirmPassword')?.value,
            agreeToTerms: document.getElementById('agree')?.checked
        };
    }
    
    validateRegisterForm(data) {
        if (!data.name) {
            return { isValid: false, message: this.getMessage('nameRequired') };
        }
        
        if (!data.email || !this.isValidEmail(data.email)) {
            return { isValid: false, message: this.getMessage('validEmailRequired') };
        }
        
        if (!data.verificationCode) {
            return { isValid: false, message: this.getMessage('verificationCodeRequired') };
        }
        
        if (!data.password || data.password.length < 6) {
            return { isValid: false, message: this.getMessage('passwordMinLength') };
        }
        
        if (data.password !== data.confirmPassword) {
            return { isValid: false, message: this.getMessage('passwordMismatch') };
        }
        
        if (!data.agreeToTerms) {
            return { isValid: false, message: this.getMessage('agreeToTermsRequired') };
        }
        
        return { isValid: true };
    }
    
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    startVerificationCountdown() {
        const resendBtn = document.querySelector('.verification-resend');
        if (!resendBtn) return;
        
        this.verificationCodeCountdown = 60;
        resendBtn.style.pointerEvents = 'none';
        resendBtn.style.opacity = '0.5';
        
        this.verificationCodeTimer = setInterval(() => {
            this.verificationCodeCountdown--;
            resendBtn.textContent = `${this.verificationCodeCountdown}s`;
            
            if (this.verificationCodeCountdown <= 0) {
                clearInterval(this.verificationCodeTimer);
                resendBtn.textContent = this.getMessage('resendCode');
                resendBtn.style.pointerEvents = 'auto';
                resendBtn.style.opacity = '1';
            }
        }, 1000);
    }
    
    showLoading(show) {
        const submitButton = document.querySelector('button[type="submit"]') || 
                           document.querySelector('.form-register-btn');
        
        if (submitButton) {
            if (show) {
                submitButton.disabled = true;
                submitButton.style.opacity = '0.6';
                const originalText = submitButton.textContent;
                submitButton.setAttribute('data-original-text', originalText);
                submitButton.textContent = this.getMessage('loading');
            } else {
                submitButton.disabled = false;
                submitButton.style.opacity = '1';
                const originalText = submitButton.getAttribute('data-original-text');
                if (originalText) {
                    submitButton.textContent = originalText;
                }
            }
        }
    }
    
    showMessage(message, type = 'info') {
        const messageDiv = document.createElement('div');
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            max-width: 300px;
            word-wrap: break-word;
            transition: all 0.3s ease;
            transform: translateX(400px);
        `;
        
        switch (type) {
            case 'success':
                messageDiv.style.background = 'linear-gradient(45deg, #4CAF50, #45a049)';
                break;
            case 'error':
                messageDiv.style.background = 'linear-gradient(45deg, #f44336, #da190b)';
                break;
            default:
                messageDiv.style.background = 'linear-gradient(45deg, #2196F3, #0b7dda)';
        }
        
        messageDiv.textContent = message;
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            messageDiv.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            messageDiv.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (document.body.contains(messageDiv)) {
                    document.body.removeChild(messageDiv);
                }
            }, 300);
        }, 4000);
    }
    
    getMessage(key) {
        const messages = {
            zh: {
                pleaseEnterEmail: '请输入邮箱地址',
                invalidEmail: '请输入有效的邮箱地址',
                verificationCodeSent: '验证码已发送，请查收邮件',
                nameRequired: '请输入姓名',
                validEmailRequired: '请输入有效的邮箱地址',
                verificationCodeRequired: '请输入邮箱验证码',
                passwordMinLength: '密码至少需要6个字符',
                passwordMismatch: '两次输入的密码不一致',
                agreeToTermsRequired: '请同意服务条款',
                registerSuccess: '注册成功！正在跳转...',
                registerFailed: '注册失败，请重试',
                pleaseEnterEmailPassword: '请输入邮箱和密码',
                loginSuccess: '登录成功！正在跳转...',
                loginFailed: '登录失败，请检查邮箱和密码',
                loading: '处理中...',
                resendCode: '重新发送'
            },
            en: {
                pleaseEnterEmail: 'Please enter email address',
                invalidEmail: 'Please enter a valid email address',
                verificationCodeSent: 'Verification code sent, please check your email',
                nameRequired: 'Please enter your name',
                validEmailRequired: 'Please enter a valid email address',
                verificationCodeRequired: 'Please enter email verification code',
                passwordMinLength: 'Password must be at least 6 characters',
                passwordMismatch: 'Passwords do not match',
                agreeToTermsRequired: 'Please agree to the terms of service',
                registerSuccess: 'Registration successful! Redirecting...',
                registerFailed: 'Registration failed, please try again',
                pleaseEnterEmailPassword: 'Please enter email and password',
                loginSuccess: 'Login successful! Redirecting...',
                loginFailed: 'Login failed, please check email and password',
                loading: 'Processing...',
                resendCode: 'Resend'
            }
        };
        
        return messages[this.currentLanguage]?.[key] || messages.zh[key] || key;
    }
}

// 全局实例
window.authSystem = new AuthSystem();
