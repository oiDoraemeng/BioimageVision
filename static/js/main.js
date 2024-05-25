document.addEventListener('DOMContentLoaded', () => {// 监听 DOM 内容加载完成事件
    "use strict";

    /**
     * Preloader
     */
        // 获取 preloader 元素
    const preloader = document.querySelector('#preloader');
    // 如果 preloader 存在，则在加载完成后移除 preloader
    if (preloader) {
        window.addEventListener('load', () => {
            preloader.remove();
        });
    }

    /**
     * Sticky Header on Scroll
     */
    const selectHeader = document.querySelector('#header');
    if (selectHeader) {
        let headerOffset = selectHeader.offsetTop;
        let nextElement = selectHeader.nextElementSibling;

        // 定义 headerFixed 函数
        const headerFixed = () => {
            // 如果滚动距离大于等于 headerOffset，则添加 stucked 类，并添加 stucked-header-offset 类给下一个元素
            if ((headerOffset - window.scrollY) <= 0) {
                selectHeader.classList.add('sticked');
                if (nextElement) nextElement.classList.add('sticked-header-offset');
            } else {
                // 否则移除 stucked 类，并移除 stucked-header-offset 类
                selectHeader.classList.remove('sticked');
                if (nextElement) nextElement.classList.remove('sticked-header-offset');
            }
        }
        // 在加载完成后调用 headerFixed 函数
        window.addEventListener('load', headerFixed);
        // 在滚动时调用 headerFixed 函数
        document.addEventListener('scroll', headerFixed);
    }

    const scrollTop2 = document.querySelector('#header');
    if (scrollTop2) {
        const togglescrollTop = function () {
            window.scrollY > 100 ? scrollTop2.classList.add('stikcy-menu') : scrollTop2.classList.remove('stikcy-menu');
        }
        window.addEventListener('load', togglescrollTop);
        document.addEventListener('scroll', togglescrollTop);
        scrollTop2.addEventListener('click', window.scrollTo({
            top: 0,
            behavior: 'smooth'
        }));
    }
    /**
     * Navbar links active state on scroll
     */
        // 获取 navbar 中的所有链接
    let navbarlinks = document.querySelectorAll('#navbar a');

    function navbarlinksActive() {
        // 遍历 navbarlinks，为每个链接添加 active 类
        navbarlinks.forEach(navbarlink => {

            if (!navbarlink.hash) return;

            let section = document.querySelector(navbarlink.hash);
            if (!section) return;

            let position = window.scrollY + 200;

            if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
                navbarlink.classList.add('active');
            } else {
                navbarlink.classList.remove('active');
            }
        })
    }

    window.addEventListener('load', navbarlinksActive);
    document.addEventListener('scroll', navbarlinksActive);


    /**
     * Initiate glightbox
     */
    const glightbox = GLightbox({
        selector: '.glightbox'
    });


    /**
     * Mobile nav toggle
     */
    const mobileNavShow = document.querySelector('.mobile-nav-show');
    const mobileNavHide = document.querySelector('.mobile-nav-hide');

    document.querySelectorAll('.mobile-nav-toggle').forEach(el => {
        el.addEventListener('click', function (event) {
            event.preventDefault();
            mobileNavToogle();
        })
    });

    function mobileNavToogle() {
        document.querySelector('body').classList.toggle('mobile-nav-active');
        mobileNavShow.classList.toggle('d-none');
        mobileNavHide.classList.toggle('d-none');
    }

    /**
     * Hide mobile nav on same-page/hash links
     */
    document.querySelectorAll('#navbar a').forEach(navbarlink => {

        if (!navbarlink.hash) return;

        let section = document.querySelector(navbarlink.hash);
        if (!section) return;

        navbarlink.addEventListener('click', () => {
            if (document.querySelector('.mobile-nav-active')) {
                mobileNavToogle();
            }
        });

    });

    /**
     * Toggle mobile nav dropdowns
     */
    const navDropdowns = document.querySelectorAll('.navbar .dropdown > a');

    navDropdowns.forEach(el => {
        el.addEventListener('click', function (event) {
            if (document.querySelector('.mobile-nav-active')) {
                event.preventDefault();
                this.classList.toggle('active');
                this.nextElementSibling.classList.toggle('dropdown-active');

                let dropDownIndicator = this.querySelector('.dropdown-indicator');
                dropDownIndicator.classList.toggle('bi-chevron-up');
                dropDownIndicator.classList.toggle('bi-chevron-down');
            }
        })
    });

    /**
     * Scroll top button
     */
    const scrollTop = document.querySelector('.scroll-top');
    if (scrollTop) {
        const togglescrollTop = function () {
            window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
        }
        window.addEventListener('load', togglescrollTop);
        document.addEventListener('scroll', togglescrollTop);
        scrollTop.addEventListener('click', window.scrollTo({
            top: 0,
            behavior: 'smooth'
        }));
    }

    /**
     * Clients Slider
     */
    new Swiper('.clients-slider', {
        speed: 400,
        loop: true,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false
        },
        slidesPerView: 'auto',
        pagination: {
            el: '.swiper-pagination',
            type: 'bullets',
            clickable: true
        },
        breakpoints: {
            320: {
                slidesPerView: 2,
                spaceBetween: 40
            },
            480: {
                slidesPerView: 3,
                spaceBetween: 60
            },
            640: {
                slidesPerView: 3,
                spaceBetween: 80
            },
            992: {
                slidesPerView: 5,
                spaceBetween: 120
            }
        }
    });

    /**
     * Init swiper slider with 1 slide at once in desktop view
     */
    const swiper = new Swiper('.slides-1', {
        speed: 600,// 切换速度
        loop: true,// 循环
        autoplay: {
            delay: 5000,// 切换时间间隔
            disableOnInteraction: false// 禁止用户操作后自动切换
        },
        slidesPerView: 'auto',
        pagination: {// 显示分页器
            el: '.swiper-pagination',
            type: 'bullets',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        }
    });
    // 鼠标悬停时停止自动播放
    const slide_analysis = document.querySelector('.slides-1');
    if (slide_analysis) {
        slide_analysis.addEventListener('mouseenter', () => {
            swiper.autoplay.stop(); // 鼠标悬停时停止自动播放
        });

        slide_analysis.addEventListener('mouseleave', () => {
            swiper.autoplay.start(); // 鼠标移开时启动自动播放
        });
    }
    /**
     * Init swiper slider with 3 slides at once in desktop view
     */
    new Swiper('.slides-3', {
        speed: 600,
        loop: true,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false
        },
        slidesPerView: 'auto',
        pagination: {
            el: '.swiper-pagination',
            type: 'bullets',
            clickable: true
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        breakpoints: {
            320: {
                slidesPerView: 1,
                spaceBetween: 40
            },

            1200: {
                slidesPerView: 2,
            }
        }
    });

    /**
     * Porfolio isotope and filter
     */
        // 获取.portfolio-isotope元素
    let portfolionIsotope = document.querySelector('.portfolio-isotope');

    if (portfolionIsotope) {

        // 获取data-portfolio-filter属性值，如果没有则默认为*
        let portfolioFilter = portfolionIsotope.getAttribute('data-portfolio-filter') ? portfolionIsotope.getAttribute('data-portfolio-filter') : '*';
        let portfolioLayout = portfolionIsotope.getAttribute('data-portfolio-layout') ? portfolionIsotope.getAttribute('data-portfolio-layout') : 'masonry';
        let portfolioSort = portfolionIsotope.getAttribute('data-portfolio-sort') ? portfolionIsotope.getAttribute('data-portfolio-sort') : 'original-order';

        // 当页面加载完成后，初始化Isotope
        window.addEventListener('load', () => {
            // 初始化Isotope
            let portfolioIsotope = new Isotope(document.querySelector('.portfolio-container'), {
                itemSelector: '.portfolio-item',
                layoutMode: portfolioLayout,
                filter: portfolioFilter,
                sortBy: portfolioSort
            });

            // 获取.portfolio-isotope元素下的.portfolio-flters li元素
            let menuFilters = document.querySelectorAll('.portfolio-isotope .portfolio-flters li');
            menuFilters.forEach(function (el) {// 遍历.portfolio-flters li元素
                el.addEventListener('click', function () {// 为li元素添加点击事件
                    // 移除当前的filter-active类,为当前li元素添加filter-active类
                    document.querySelector('.portfolio-isotope .portfolio-flters .filter-active').classList.remove('filter-active');
                    this.classList.add('filter-active');
                    portfolioIsotope.arrange({ // 根据当前li元素的data-filter属性值重新排列Isotope
                        filter: this.getAttribute('data-filter')
                    });
                    if (typeof aos_init === 'function') { // 如果aos_init函数存在，则调用该函数
                        aos_init();
                    }
                }, false);
            });

        });

    }

    /**
     * Animation on scroll function and init
     */
    //AOS是一个用于在网页上创建动画效果的库，它可以实现元素在页面加载时、滚动时或者点击时等不同状态下进行动画效果
    function aos_init() {
        AOS.init({
            duration: 1000, // 动画持续时间
            easing: 'ease-in-out', // 动画缓动函数
            once: true, // 是否只执行一次
            mirror: false // 是否使用镜像模式
        });
    }

    window.addEventListener('load', () => {
        // 当页面加载完成后执行 aos_init 函数
        aos_init();
    });

    /**
     * Gradual text animation
     */
        // 获取 data-aos="gradual-text" 属性的元素
    const elements = document.querySelectorAll('[data-aos="gradual-text"]');
    // 遍历元素，为每个元素添加动画效果
    const animateText = (element) => {
        const textContent = element.textContent;// 获取元素的文本内容
        element.textContent = '';

        // 遍历文本内容，为每个字母添加 span 元素,并设置动画延迟
        textContent.split('').forEach((letter, index) => {
            const span = document.createElement('span');
            span.textContent = letter;
            span.classList.add('letter');
            span.style.transitionDelay = `${index * 0.1}s`;
            element.appendChild(span);
        });
        // 等待所有字母动画结束后，添加 show 类
        const letters = element.querySelectorAll('.letter');
        setTimeout(() => {
            letters.forEach(letter => letter.classList.add('show'));
        }, 500);
    };
    // 监听元素的进入视窗事件
    const observer = new IntersectionObserver((entries) => {
        // 遍历进入视窗的元素
        entries.forEach(entry => {// 判断元素是否进入视窗
            if (entry.isIntersecting) {
                animateText(entry.target);// 调用 animateText 函数
                observer.unobserve(entry.target); // 确保动画只触发一次
            }
        });
    }, {threshold: 0.1}); // 设定阈值，可以根据需要调整

    // 遍历 data-aos="gradual-text" 属性的元素，并将其添加到观察者中
    elements.forEach(element => {
        observer.observe(element);
    });

});