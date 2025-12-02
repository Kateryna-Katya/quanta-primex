document.addEventListener('DOMContentLoaded', () => {
    
    /* -----------------------------------------------------------------
       1. ИНИЦИАЛИЗАЦИЯ ИКОНОК (Lucide)
    ----------------------------------------------------------------- */
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    /* -----------------------------------------------------------------
       2. МОБИЛЬНОЕ МЕНЮ
    ----------------------------------------------------------------- */
    const burgerBtn = document.getElementById('burger-btn');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.header__link');

    if (burgerBtn && navMenu) {
        burgerBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            // Опционально: можно менять иконку меню при клике
        });

        // Закрываем меню при клике на ссылку
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
            });
        });
    }

    /* -----------------------------------------------------------------
       3. АНИМАЦИИ GSAP (Hero Section)
    ----------------------------------------------------------------- */
    if (typeof gsap !== 'undefined' && typeof SplitType !== 'undefined') {
        
        // Разбиваем текст на слова для анимации
        // Проверяем, существует ли элемент, чтобы избежать ошибок на других страницах
        const heroTitle = document.querySelector('.hero__title');
        
        if (heroTitle) {
            const title = new SplitType('.hero__title', { types: 'lines, words' });
            
            const tl = gsap.timeline();

            // 1. Бейдж
            tl.from('.hero__badge', {
                y: -20,
                opacity: 0,
                duration: 0.6,
                ease: 'power2.out'
            })
            // 2. Заголовок (по словам)
            .from(title.words, {
                y: 50,
                opacity: 0,
                duration: 0.8,
                stagger: 0.05,
                ease: 'back.out(1.7)'
            }, "-=0.2")
            // 3. Описание и кнопки
            .from('.hero__desc, .hero__actions', {
                y: 30,
                opacity: 0,
                duration: 0.6,
                stagger: 0.1,
                ease: 'power2.out'
            }, "-=0.4")
            // 4. Визуал (карточки)
            .from('.hero__visual', {
                x: 50,
                opacity: 0,
                duration: 1,
                ease: 'power2.out'
            }, "-=0.6");
        }
    }

    /* -----------------------------------------------------------------
       4. ЛОГИКА КВИЗА (Quiz)
    ----------------------------------------------------------------- */
    const quizData = [
        {
            question: "Какова ваша главная цель?",
            options: [
                { text: "Автоматизировать рутину (экономия времени)", type: "automation" },
                { text: "Увеличить продажи и заявки", type: "bot" },
                { text: "Анализировать данные клиентов", type: "analytics" }
            ]
        },
        {
            question: "Какой объем входящих сообщений у вас сейчас?",
            options: [
                { text: "До 50 в день", type: "bot" },
                { text: "50–200 в день", type: "automation" },
                { text: "Более 500 (нужен масштаб)", type: "analytics" }
            ]
        },
        {
            question: "Есть ли у вас уже опыт использования AI?",
            options: [
                { text: "Нет, я новичок", type: "bot" },
                { text: "Да, пробовали простые решения", type: "automation" },
                { text: "Да, нужна сложная интеграция", type: "analytics" }
            ]
        }
    ];

    // Элементы DOM
    const quizStart = document.getElementById('quizStart');
    const quizQuestion = document.getElementById('quizQuestion');
    const quizResult = document.getElementById('quizResult');
    const questionText = document.getElementById('questionText');
    const quizOptions = document.getElementById('quizOptions');
    const progressFill = document.getElementById('progressFill');
    const resultTitleEl = document.getElementById('resultTitle');
    const resultDescEl = document.getElementById('resultDesc');

    // Состояние
    let currentStep = 0;
    let scores = { bot: 0, automation: 0, analytics: 0 };

    // Контент результатов
    const resultsContent = {
        bot: {
            title: "Умный AI Чат-бот",
            desc: "Вам идеально подойдет чат-бот для первой линии поддержки. Он возьмет на себя общение с клиентами, ответы на частые вопросы и сбор заявок 24/7."
        },
        automation: {
            title: "Комплексная автоматизация",
            desc: "Ваш бизнес готов к оптимизации процессов. Мы создадим систему, которая свяжет ваши заявки, CRM и уведомления в единый автоматический механизм."
        },
        analytics: {
            title: "AI Аналитика данных",
            desc: "Вам нужны глубокие инсайты. Наше решение поможет анализировать большие объемы данных для прогнозирования спроса и поведения клиентов."
        }
    };

    // Функции Квиза (делаем глобальными или привязываем внутри)
    window.startQuiz = function() {
        if(!quizStart) return;
        quizStart.classList.add('hidden');
        quizQuestion.classList.remove('hidden');
        currentStep = 0;
        scores = { bot: 0, automation: 0, analytics: 0 };
        renderQuestion();
    };

    function renderQuestion() {
        const q = quizData[currentStep];
        questionText.textContent = q.question;
        quizOptions.innerHTML = '';

        // Прогресс
        const progress = ((currentStep) / quizData.length) * 100;
        progressFill.style.width = `${progress}%`;

        q.options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'quiz-option-btn';
            btn.textContent = opt.text;
            btn.onclick = () => handleAnswer(opt.type);
            quizOptions.appendChild(btn);
        });
    }

    function handleAnswer(type) {
        scores[type]++;
        currentStep++;

        if (currentStep < quizData.length) {
            quizOptions.style.opacity = '0.5';
            setTimeout(() => {
                renderQuestion();
                quizOptions.style.opacity = '1';
            }, 300);
        } else {
            showResult();
        }
    }

    function showResult() {
        quizQuestion.classList.add('hidden');
        quizResult.classList.remove('hidden');
        progressFill.style.width = '100%';

        // Определяем победителя
        const winner = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
        
        resultTitleEl.textContent = resultsContent[winner].title;
        resultDescEl.textContent = resultsContent[winner].desc;
    }

    window.restartQuiz = function() {
        quizResult.classList.add('hidden');
        quizStart.classList.remove('hidden');
    };

    window.fillContactSubject = function() {
        // Опционально: можно скроллить плавнее
        document.querySelector('#contact').scrollIntoView({ behavior: 'smooth' });
    };

    /* -----------------------------------------------------------------
       5. КОНТАКТНАЯ ФОРМА & КАПЧА
    ----------------------------------------------------------------- */
    const contactForm = document.getElementById('contactForm');
    const captchaLabel = document.getElementById('captchaLabel');
    const captchaInput = document.getElementById('captchaInput');
    const formMessage = document.getElementById('formMessage');

    let num1 = Math.floor(Math.random() * 10);
    let num2 = Math.floor(Math.random() * 10);
    let captchaResult = num1 + num2;

    if (captchaLabel) {
        captchaLabel.textContent = `Сколько будет ${num1} + ${num2}?`;
    }

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const userCaptcha = parseInt(captchaInput.value);

            // Проверка капчи
            if (userCaptcha !== captchaResult) {
                formMessage.textContent = 'Ошибка: неверный результат примера.';
                formMessage.className = 'form-message error';
                return;
            }

            // Имитация отправки
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Отправка...';
            submitBtn.disabled = true;

            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                
                // Успех
                formMessage.textContent = 'Спасибо! Ваше сообщение отправлено.';
                formMessage.className = 'form-message success';
                contactForm.reset();
                
                // Новая капча
                num1 = Math.floor(Math.random() * 10);
                num2 = Math.floor(Math.random() * 10);
                captchaResult = num1 + num2;
                captchaLabel.textContent = `Сколько будет ${num1} + ${num2}?`;
                
                setTimeout(() => {
                    formMessage.textContent = '';
                    formMessage.className = 'form-message';
                }, 5000);

            }, 1500);
        });
    }

    /* -----------------------------------------------------------------
       6. COOKIE POPUP
    ----------------------------------------------------------------- */
    const cookiePopup = document.getElementById('cookiePopup');
    const acceptCookiesBtn = document.getElementById('acceptCookies');

    if (cookiePopup && acceptCookiesBtn) {
        if (!localStorage.getItem('cookiesAccepted')) {
            setTimeout(() => {
                cookiePopup.classList.add('show');
            }, 2000);
        }

        acceptCookiesBtn.addEventListener('click', () => {
            localStorage.setItem('cookiesAccepted', 'true');
            cookiePopup.classList.remove('show');
        });
    }

    /* -----------------------------------------------------------------
       7. SCROLL REVEAL (Анимация появления секций)
    ----------------------------------------------------------------- */
    const sections = document.querySelectorAll('.section');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
                // Перестаем следить после появления
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    sections.forEach(sec => {
        sec.style.opacity = 0;
        sec.style.transform = 'translateY(30px)';
        sec.style.transition = 'all 0.8s ease-out';
        observer.observe(sec);
    });

});