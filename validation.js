// Валидация формы консультации
document.addEventListener('DOMContentLoaded', function() {
    // Мобильное меню
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (mobileMenuToggle && mobileMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
        });
        
        // Закрытие меню при клике на ссылку
        const mobileMenuLinks = mobileMenu.querySelectorAll('a');
        mobileMenuLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
            });
        });
        
        // Закрытие меню при клике на кнопку
        const mobileMenuButton = mobileMenu.querySelector('button');
        if (mobileMenuButton) {
            mobileMenuButton.addEventListener('click', function() {
                mobileMenu.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
            });
        }
    }
    // Находим форму
    const form = document.querySelector('.form-container');

    if (form) {
        // Находим поля ввода
        const phoneInput = document.querySelector('.phone_input');
        const nameInput = document.querySelector('.name_input');

        // Добавляем обработчик на отправку формы
        form.addEventListener('submit', function(event) {
            // Проверяем валидность имени
            if (!validateName(nameInput.value)) {
                event.preventDefault(); // Отменяем отправку формы

                // Показываем сообщение об ошибке
                showNameError(nameInput, 'Пожалуйста, введите ваше имя');
                return;
            }

            // Проверяем валидность номера телефона
            if (!validatePhone(phoneInput.value)) {
                event.preventDefault(); // Отменяем отправку формы

                // Показываем сообщение об ошибке
                showPhoneError(phoneInput, 'Пожалуйста, введите корректный номер телефона в формате +7XXXXXXXXXX');
            } else {
                // Показываем индикатор загрузки
                const submitBtn = form.querySelector('.submit-btn');
                const originalText = submitBtn.textContent;

                submitBtn.textContent = 'Отправка...';
                submitBtn.disabled = true;
                submitBtn.style.opacity = '0.7';

                // Если по какой-то причине форма не отправилась (например, из-за ошибки), возвращаем кнопку в исходное состояние через 5 секунд
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    submitBtn.style.opacity = '1';
                }, 5000);
            }
        });

        // Добавляем обработчик на изменение поля имени
        nameInput.addEventListener('input', function() {
            // Запоминаем текущую позицию курсора
            let cursorPosition = this.selectionStart;

            // Получаем значение поля
            let nameValue = this.value;

            // Разделяем имя на слова
            const words = nameValue.split(/\s+/);

            // Преобразуем каждое слово: первая буква заглавная, остальные строчные
            const capitalizedWords = words.map(word => {
                if (word.length > 0) {
                    return word[0].toUpperCase() + word.slice(1).toLowerCase();
                }
                return word;
            });

            // Обновляем значение поля
            this.value = capitalizedWords.join(' ');

            // Восстанавливаем позицию курсора
            this.setSelectionRange(cursorPosition, cursorPosition);

            // Убираем сообщение об ошибке, если пользователь исправляет ввод
            hideNameError(this);
        });

        // Добавляем обработчик на фокус поля телефона
        phoneInput.addEventListener('focus', function() {
            // Если поле пустое, добавляем +7
            if (this.value === '') {
                this.value = '+7';
                // Устанавливаем курсор после +7
                this.setSelectionRange(2, 2);
            }
        });

        // Добавляем обработчик на изменение поля телефона
        phoneInput.addEventListener('input', function() {
            // Запоминаем текущую позицию курсора
            let cursorPosition = this.selectionStart;

            // Сохраняем предыдущее значение для сравнения
            const previousValue = this.value;

            // Удаляем все символы кроме цифр
            let phoneNumber = this.value.replace(/\D/g, '');

            // Убеждаемся, что номер начинается с 7
            if (phoneNumber.length > 0 && !phoneNumber.startsWith('7')) {
                phoneNumber = '7' + phoneNumber;
            }

            // Ограничиваем максимальную длину номера (11 цифр)
            if (phoneNumber.length > 11) {
                phoneNumber = phoneNumber.substring(0, 11);
            }

            // Форматируем номер: +7 (XXX) XXX-XX-XX
            let formattedNumber = '+7';
            if (phoneNumber.length > 1) {
                formattedNumber += ' (' + phoneNumber.substring(1, Math.min(4, phoneNumber.length));
            }
            if (phoneNumber.length > 4) {
                formattedNumber += ') ' + phoneNumber.substring(4, Math.min(7, phoneNumber.length));
            }
            if (phoneNumber.length > 7) {
                formattedNumber += '-' + phoneNumber.substring(7, Math.min(9, phoneNumber.length));
            }
            if (phoneNumber.length > 9) {
                formattedNumber += '-' + phoneNumber.substring(9, Math.min(11, phoneNumber.length));
            }

            // Обновляем значение поля
            this.value = formattedNumber;

            // Вычисляем разницу в длине между новым и старым значением
            const lengthDiff = formattedNumber.length - previousValue.length;

            // Корректируем позицию курсора с учетом форматирования
            if (lengthDiff > 0 && cursorPosition > 2) {
                cursorPosition += lengthDiff;
            } else if (lengthDiff < 0 && cursorPosition > 2) {
                cursorPosition = Math.max(2, cursorPosition + lengthDiff);
            }

            // Восстанавливаем позицию курсора
            this.setSelectionRange(cursorPosition, cursorPosition);

            // Убираем сообщение об ошибке, если пользователь исправляет ввод
            hidePhoneError(this);
        });
    }

    // Обработчик для кнопки опроса
    const surveyBtn = document.querySelector('.survey-btn');
    if (surveyBtn) {
        surveyBtn.addEventListener('click', function() {
            // Создаем модальное окно с опросом
            const surveyModal = document.createElement('div');
            surveyModal.className = 'survey-modal';
            surveyModal.style.position = 'fixed';
            surveyModal.style.top = '0';
            surveyModal.style.left = '0';
            surveyModal.style.width = '100%';
            surveyModal.style.height = '100%';
            surveyModal.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
            surveyModal.style.display = 'flex';
            surveyModal.style.justifyContent = 'center';
            surveyModal.style.alignItems = 'center';
            surveyModal.style.zIndex = '1000';

            // Создаем контент модального окна
            const modalContent = document.createElement('div');
            modalContent.style.backgroundColor = 'var(--color-background)';
            modalContent.style.padding = '30px';
            modalContent.style.borderRadius = '20px';
            modalContent.style.maxWidth = '600px';
            modalContent.style.width = '90%';
            modalContent.style.position = 'relative';

            // Заголовок опроса
            const surveyTitle = document.createElement('h2');
            surveyTitle.textContent = 'Опрос для лучшего понимания ваших целей';
            surveyTitle.style.color = 'var(--color-primary-green)';
            surveyTitle.style.marginBottom = '20px';
            surveyTitle.style.textAlign = 'center';

            // Кнопка закрытия
            const closeBtn = document.createElement('button');
            closeBtn.textContent = '×';
            closeBtn.style.position = 'absolute';
            closeBtn.style.top = '10px';
            closeBtn.style.right = '15px';
            closeBtn.style.fontSize = '24px';
            closeBtn.style.backgroundColor = 'transparent';
            closeBtn.style.border = 'none';
            closeBtn.style.cursor = 'pointer';
            closeBtn.style.color = 'var(--color-primary-green)';

            // Текст опроса
            const surveyText = document.createElement('p');
            surveyText.textContent = 'Спасибо за ваш интерес! В настоящее время опрос находится в разработке. Вы можете записаться на консультацию, и мы обсудим ваши цели лично.';
            surveyText.style.color = 'var(--color-primary-green)';
            surveyText.style.marginBottom = '20px';
            surveyText.style.lineHeight = '1.5';

            // Кнопка закрытия модального окна
            const closeModalBtn = document.createElement('button');
            closeModalBtn.textContent = 'Понятно';
            closeModalBtn.style.backgroundColor = 'var(--color-pink-light)';
            closeModalBtn.style.color = 'var(--color-white)';
            closeModalBtn.style.border = 'none';
            closeModalBtn.style.padding = '10px 20px';
            closeModalBtn.style.borderRadius = '10px';
            closeModalBtn.style.cursor = 'pointer';
            closeModalBtn.style.fontSize = '16px';
            closeModalBtn.style.display = 'block';
            closeModalBtn.style.margin = '0 auto';

            // Собираем модальное окно
            modalContent.appendChild(closeBtn);
            modalContent.appendChild(surveyTitle);
            modalContent.appendChild(surveyText);
            modalContent.appendChild(closeModalBtn);
            surveyModal.appendChild(modalContent);

            // Добавляем модальное окно на страницу
            document.body.appendChild(surveyModal);

            // Обработчики закрытия модального окна
            closeBtn.addEventListener('click', function() {
                document.body.removeChild(surveyModal);
            });

            closeModalBtn.addEventListener('click', function() {
                document.body.removeChild(surveyModal);
            });

            // Закрытие при клике вне модального окна
            surveyModal.addEventListener('click', function(event) {
                if (event.target === surveyModal) {
                    document.body.removeChild(surveyModal);
                }
            });
        });
    }

    // Функция валидации имени
    function validateName(name) {
        // Проверяем, что имя не пустое и содержит только буквы
        const nameRegex = /^[а-яА-ЯёЁa-zA-Z\s]+$/;
        return name.trim() !== '' && nameRegex.test(name);
    }

    // Функция валидации телефона
    function validatePhone(phone) {
        // Удаляем все символы кроме цифр
        const cleanPhone = phone.replace(/\D/g, '');

        // Проверяем, что номер начинается с 7 и имеет ровно 11 цифр
        // Это соответствует формату +7XXXXXXXXXX
        return cleanPhone.length === 11 && cleanPhone.startsWith('7');
    }

    // Функция показа ошибки
    function showPhoneError(input, message) {
        // Убираем предыдущее сообщение об ошибке, если есть
        hidePhoneError(input);

        // Создаем элемент для сообщения об ошибке
        const errorElement = document.createElement('div');
        errorElement.className = 'phone-error';
        errorElement.textContent = message;

        // Добавляем элемент ошибки после поля ввода
        input.parentNode.insertBefore(errorElement, input.nextSibling);

        // Добавляем класс ошибки для стилизации
        input.classList.add('error');
    }

    // Функция показа ошибки для имени
    function showNameError(input, message) {
        // Убираем предыдущее сообщение об ошибке, если есть
        hideNameError(input);

        // Создаем элемент для сообщения об ошибке
        const errorElement = document.createElement('div');
        errorElement.className = 'phone-error';
        errorElement.textContent = message;

        // Добавляем элемент ошибки после поля ввода
        input.parentNode.insertBefore(errorElement, input.nextSibling);

        // Добавляем класс ошибки для стилизации
        input.classList.add('error');
    }

    // Функция скрытия ошибки для имени
    function hideNameError(input) {
        // Находим и удаляем элемент ошибки
        const errorElement = input.parentNode.querySelector('.phone-error');
        if (errorElement) {
            errorElement.remove();
        }

        // Удаляем класс ошибки
        input.classList.remove('error');
    }

    // Функция скрытия ошибки
    function hidePhoneError(input) {
        // Находим и удаляем элемент ошибки
        const errorElement = input.parentNode.querySelector('.phone-error');
        if (errorElement) {
            errorElement.remove();
        }

        // Удаляем класс ошибки
        input.classList.remove('error');
    }
});