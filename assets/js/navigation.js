/**
 * Enhanced Navigation System for HTML5 UP Template
 * Overrides default template behavior to allow direct section switching
 */

(function($) {
    'use strict';

    // Global navigation localization
    var NavigationLocalization = {
        // Detect current page language
        detectLanguage: function() {
            // Check if current page is Chinese
            if (window.location.pathname.includes('index-zh.html') || 
                window.location.pathname.includes('curve/') && 
                (document.referrer.includes('index-zh.html') || 
                 new URLSearchParams(window.location.search).get('lang') === 'zh')) {
                return 'zh';
            }
            // Check if coming from English page to curve
            if (window.location.pathname.includes('curve/')) {
                const urlParams = new URLSearchParams(window.location.search);
                const langParam = urlParams.get('lang');
                if (langParam === 'en') {
                    return 'en';
                } else if (langParam === 'zh') {
                    return 'zh';
                }
                // Check referrer if no URL parameter
                if (document.referrer.includes('index.html') && !document.referrer.includes('index-zh.html')) {
                    return 'en';
                } else if (document.referrer.includes('index-zh.html')) {
                    return 'zh';
                }
                // Default to Chinese
                return 'zh';
            }
            // Check for login/register pages - check URL parameter first
            if (window.location.pathname.includes('login.html') || 
                window.location.pathname.includes('register.html')) {
                const urlParams = new URLSearchParams(window.location.search);
                const langParam = urlParams.get('lang');
                if (langParam === 'en') {
                    return 'en';
                } else if (langParam === 'zh') {
                    return 'zh';
                }
                // If no lang parameter, check referrer
                if (document.referrer.includes('index.html') && !document.referrer.includes('index-zh.html')) {
                    return 'en';
                } else if (document.referrer.includes('index-zh.html')) {
                    return 'zh';
                }
                // Default to Chinese only if no other indication
                return 'zh';
            }
            // Default based on filename
            return window.location.pathname.includes('index-zh.html') ? 'zh' : 'en';
        },

        // Update navigation bar based on language
        updateNavigation: function(language) {
            const isEnglish = language === 'en';
            const isCurvePage = window.location.pathname.includes('curve/');
            
            // Update login/signup buttons
            const loginBtn = document.querySelector('.login-btn');
            const signupBtn = document.querySelector('.signup-btn');
            const langBtn = document.querySelector('.lang-btn');
            
            if (loginBtn) {
                loginBtn.textContent = isEnglish ? 'SIGN IN' : '登录';
                // Update login link with language parameter
                if (isCurvePage) {
                    loginBtn.href = isEnglish ? '../login.html?lang=en' : '../login.html?lang=zh';
                } else {
                    loginBtn.href = isEnglish ? 'login.html?lang=en' : 'login.html?lang=zh';
                }
            }
            if (signupBtn) {
                signupBtn.textContent = isEnglish ? 'SIGN UP' : '注册';
                // Update signup link with language parameter
                if (isCurvePage) {
                    signupBtn.href = isEnglish ? '../register.html?lang=en' : '../register.html?lang=zh';
                } else {
                    signupBtn.href = isEnglish ? 'register.html?lang=en' : 'register.html?lang=zh';
                }
            }
            
            // Update language button
            if (langBtn) {
                langBtn.textContent = isEnglish ? '中文' : 'ENG';
                const isLoginRegisterPage = window.location.pathname.includes('login.html') || 
                                          window.location.pathname.includes('register.html');
                
                if (isCurvePage) {
                    langBtn.href = isEnglish ? '../index-zh.html' : '../index.html';
                    langBtn.onclick = function(e) {
                        e.preventDefault();
                        sessionStorage.setItem('returnFromEnergy', 'true');
                        window.location.href = isEnglish ? '../index-zh.html' : '../index.html';
                    };
                } else if (isLoginRegisterPage) {
                    // For login/register pages, switch language but stay on same page type
                    const currentPage = window.location.pathname.includes('login.html') ? 'login.html' : 'register.html';
                    langBtn.href = isEnglish ? `${currentPage}?lang=zh` : `${currentPage}?lang=en`;
                } else {
                    langBtn.href = isEnglish ? 'index-zh.html' : 'index.html';
                }
            }
            
            // Update navigation menu items
            const navItems = document.querySelectorAll('.nav-item');
            if (navItems.length >= 4) {
                if (isEnglish) {
                    navItems[0].textContent = 'Introduction';
                    navItems[1].textContent = 'Event Timing';
                    navItems[2].textContent = 'Energy Curve';
                    navItems[3].textContent = 'Contact';
                } else {
                    navItems[0].textContent = '简介';
                    navItems[1].textContent = '事件择时';
                    navItems[2].textContent = '能量曲线';
                    navItems[3].textContent = '联系我们';
                }
            }
            
            // Update curve page content if needed
            if (isCurvePage && isEnglish) {
                this.updateCurvePageContent();
            }
            
            // Update login/register page content if needed
            const isLoginRegisterPage = window.location.pathname.includes('login.html') || 
                                      window.location.pathname.includes('register.html');
            if (isLoginRegisterPage && isEnglish) {
                this.updateLoginRegisterPageContent();
            }
        },

        // Update curve page content for English
        updateCurvePageContent: function() {
            const title = document.querySelector('h2.major');
            if (title) title.textContent = 'Energy Curve';
            
            const subtitle = document.querySelector('.subtitle');
            if (subtitle) subtitle.textContent = 'Enter your information to generate your personalized energy curve';
            
            const labels = document.querySelectorAll('label');
            if (labels.length >= 4) {
                labels[0].textContent = 'Name';
                labels[1].textContent = 'Birth Date & Time';
                labels[2].textContent = 'Gender';
                labels[3].textContent = 'Birth Place';
            }
            
            const inputs = document.querySelectorAll('input');
            if (inputs.length >= 3) {
                inputs[0].placeholder = 'Please enter your name';
                inputs[1].placeholder = 'MM/DD/YYYY XX:XX AM';
                inputs[2].placeholder = 'Please enter birth city';
            }
            
            // Update gender select options
            const genderSelect = document.querySelector('.gender-select');
            if (genderSelect) {
                genderSelect.innerHTML = `
                    <option value="">Please select gender</option>
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                `;
            }
            
            const submitBtn = document.querySelector('.submit-btn .btn-text');
            if (submitBtn) submitBtn.textContent = 'Calculate';
            
            const legendItems = document.querySelectorAll('.legend-item span:not(.legend-color)');
            if (legendItems.length >= 3) {
                legendItems[0].textContent = 'Health';
                legendItems[1].textContent = 'Career';
                legendItems[2].textContent = 'Love';
            }
            
            const closeBtn = document.querySelector('.close');
            if (closeBtn) closeBtn.textContent = 'Close';
        },

        // Update login/register page content for English
        updateLoginRegisterPageContent: function() {
            // Update navigation menu items for login/register pages
            const navItems = document.querySelectorAll('.nav-item');
            if (navItems.length >= 4) {
                navItems[0].textContent = 'Introduction';
                navItems[1].textContent = 'Event Timing';
                navItems[2].textContent = 'Energy Curve';
                navItems[3].textContent = 'Contact';
            }
            
            // Update page title and meta content if needed
            const title = document.querySelector('title');
            if (title && window.location.pathname.includes('login.html')) {
                title.textContent = 'Login - SparkingTiming';
            } else if (title && window.location.pathname.includes('register.html')) {
                title.textContent = 'Sign Up - SparkingTiming';
            }
        },

        // Initialize localization
        init: function() {
            const language = this.detectLanguage();
            this.updateNavigation(language);
        }
    };

    // Navigation controller object
    var Navigation = {
        
        // Initialize the navigation system
        init: function() {
            this.removeDefaultHandlers();
            this.setupCustomNavigation();
            this.handleInitialLoad();
            this.handleEnergyPageReturn();
            
            // Initialize localization
            NavigationLocalization.init();
        },

        // Remove problematic default handlers from HTML5 UP template
        removeDefaultHandlers: function() {
            $('body').off('click');
            $(window).off('hashchange');
        },

        // Setup our custom navigation system
        setupCustomNavigation: function() {
            var self = this;
            
            // Handle navigation clicks
            $('nav a[href^="#"], .nav-item[href^="#"]').off('click').on('click', function(e) {
                self.handleNavClick.call(this, e);
            });
            
            // Handle close buttons
            $('#main article .close').off('click').on('click', function(e) {
                self.handleCloseClick(e);
            });
            
            // Handle body clicks (close when clicking outside)
            $('body').on('click', function(e) {
                self.handleBodyClick(e);
            });
            
            // Handle ESC key
            $(window).on('keyup', function(e) {
                self.handleKeyUp(e);
            });
        },

        // Navigate to a specific section
        navigateToSection: function(sectionId) {
            if (!sectionId || !$('#' + sectionId).length) return;
            
            // If we're already showing an article, switch directly
            if ($('body').hasClass('is-article-visible')) {
                // Hide current article
                $('#main article.active').removeClass('active').hide();
                // Show target article
                $('#' + sectionId).show().addClass('active');
            } else {
                // Show from homepage
                $('body').addClass('is-article-visible');
                $('#header').hide();
                $('#footer').hide();
                $('#main').show();
                $('#' + sectionId).show().addClass('active');
            }
            
            // Update navigation highlighting
            this.updateNavigationHighlight(sectionId);
            
            // Update URL
            history.replaceState(null, null, '#' + sectionId);
        },

        // Return to homepage
        returnToHome: function() {
            $('#main article').removeClass('active').hide();
            $('#main').hide();
            $('body').removeClass('is-article-visible');
            $('#header').show();
            $('#footer').show();
            
            // Clear navigation highlighting
            this.updateNavigationHighlight('');
            
            history.replaceState(null, null, '#');
        },

        // Update navigation highlighting based on current section
        updateNavigationHighlight: function(sectionId) {
            // Remove active class from all navigation items
            $('.nav-item').removeClass('active');
            
            // If we're on homepage, don't highlight anything
            if (!sectionId) return;
            
            // Map section IDs to navigation item indices
            const sectionMap = {
                'intro': 0,
                'work': 1,
                'contact': 3  // Skip index 2 which is energy curve
            };
            
            // Find the corresponding navigation item and add active class
            const navIndex = sectionMap[sectionId];
            if (navIndex !== undefined) {
                $('.nav-item').eq(navIndex).addClass('active');
            }
        },

        // Handle navigation link clicks
        handleNavClick: function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            var href = $(this).attr('href');
            
            // Check if we're on login/register page
            var isLoginRegisterPage = window.location.pathname.includes('login.html') || 
                                    window.location.pathname.includes('register.html');
            
            if (!href || href === '#') {
                // Check if this is the energy curve navigation item
                var navItemIndex = $(this).index();
                if (navItemIndex === 2) {
                    // Navigate to energy curve page
                    var currentLanguage = NavigationLocalization.detectLanguage();
                    var curvePage = currentLanguage === 'zh' ? 'curve/index_curve.html?lang=zh' : 'curve/index_curve.html?lang=en';
                    window.location.href = curvePage;
                }
                return;
            }
            
            // If on login/register page, navigate to main page with section
            if (isLoginRegisterPage) {
                var currentLanguage = NavigationLocalization.detectLanguage();
                var mainPage = currentLanguage === 'zh' ? 'index-zh.html' : 'index.html';
                window.location.href = mainPage + href;
                return;
            }
            
            var sectionId = href.substring(1);
            Navigation.navigateToSection(sectionId);
        },

        // Handle close button clicks
        handleCloseClick: function(e) {
            e.preventDefault();
            Navigation.returnToHome();
        },

        // Handle body clicks (close when clicking outside)
        handleBodyClick: function(e) {
            // Only hide if we're not clicking on navigation or inside an article
            if ($('body').hasClass('is-article-visible') && 
                !$(e.target).closest('#main article').length && 
                !$(e.target).closest('nav').length &&
                !$(e.target).hasClass('nav-item')) {
                
                Navigation.returnToHome();
            }
        },

        // Handle ESC key
        handleKeyUp: function(e) {
            if (e.keyCode === 27 && $('body').hasClass('is-article-visible')) {
                Navigation.returnToHome();
            }
        },

        // Handle initial page load with hash
        handleInitialLoad: function() {
            if (window.location.hash && window.location.hash !== '#') {
                var initialSection = window.location.hash.substring(1);
                var self = this;
                setTimeout(function() {
                    self.navigateToSection(initialSection);
                }, 100);
            } else {
                // If no hash, ensure no navigation items are highlighted
                this.updateNavigationHighlight('');
            }
        },

        // Handle return from energy curve page
        handleEnergyPageReturn: function() {
            if (sessionStorage.getItem('returnFromEnergy') === 'true') {
                sessionStorage.removeItem('returnFromEnergy');
                $('body').removeClass('is-preload');
            }
        },

        // Handle logo click to return to homepage
        goToHomePage: function() {
            // Check if we're on login/register page
            var isLoginRegisterPage = window.location.pathname.includes('login.html') || 
                                    window.location.pathname.includes('register.html');
            
            if (isLoginRegisterPage) {
                var currentLanguage = NavigationLocalization.detectLanguage();
                var mainPage = currentLanguage === 'zh' ? 'index-zh.html' : 'index.html';
                window.location.href = mainPage;
                return;
            }
            
            // If we're currently viewing an article, return to homepage
            if ($('body').hasClass('is-article-visible')) {
                this.returnToHome();
            }
            // If we're already on homepage, do nothing (or could scroll to top)
            else {
                // Optionally scroll to top
                $('html, body').animate({ scrollTop: 0 }, 'smooth');
            }
        }
    };

    // Initialize when document is ready
    $(document).ready(function() {
        Navigation.init();
    });

    // Make goToHomePage globally available
    window.goToHomePage = function() {
        Navigation.goToHomePage();
    };

    // Energy curve page specific functionality
    if (window.location.pathname.includes('curve/')) {
        $(document).ready(function() {
            const currentLanguage = NavigationLocalization.detectLanguage();
            const homePage = currentLanguage === 'en' ? '../index.html' : '../index-zh.html';
            
            // Setup navigation links to return to main page
            document.querySelectorAll('.nav-item').forEach(function(item, index) {
                if (index < 4) { // Only for the first 4 navigation items
                    item.addEventListener('click', function(e) {
                        e.preventDefault();
                        var sections = ['#intro', '#work', '', '#contact'];
                        if (index === 2) {
                            // Energy Curve is current page - do nothing but keep it highlighted
                            return;
                        }
                        sessionStorage.setItem('returnFromEnergy', 'true');
                        window.location.href = homePage + sections[index];
                    });
                }
            });
            
            // Ensure energy curve navigation item stays highlighted
            document.querySelectorAll('.nav-item').forEach(function(item, index) {
                if (index === 2) {
                    item.classList.add('active');
                }
            });
            
            // Setup close button
            const closeBtn = document.querySelector('.close');
            if (closeBtn) {
                closeBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    sessionStorage.setItem('returnFromEnergy', 'true');
                    window.location.href = homePage;
                });
            }
            
            // Override goToHomePage for energy curve page
            window.goToHomePage = function() {
                sessionStorage.setItem('returnFromEnergy', 'true');
                window.location.href = homePage;
            };
        });
    }

    // Export for global access if needed
    window.Navigation = Navigation;

})(jQuery); 