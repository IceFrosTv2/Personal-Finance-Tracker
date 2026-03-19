# Lumincash — Личный финансовый трекер

Одностраничное приложение для учёта личных доходов и расходов. Позволяет управлять категориями, просматривать транзакции и анализировать бюджет через графики.

> [English documentation](./README.md)

---

## Стек технологий

- **HTML5** — разметка шаблонов
- **SCSS** — стилизация (с разбивкой на партиалы)
- **JavaScript (ES6+)** — логика приложения, роутинг, компоненты
- **Vite** — сборщик
- **npm** — менеджер пакетов
- **Bootstrap 5** + **Bootstrap Icons** — UI-компоненты и иконки
- **Chart.js** — графики доходов и расходов
- **Choices.js** — кастомные select-элементы
- **Tempus Dominus** — датапикер

---

## Установка и запуск

```bash
# Клонировать репозиторий
git clone https://github.com/IceFrosTv2/Personal-Finance-Tracker.git
cd frontend

# Установить зависимости
npm install
```

### Переменные окружения

В корне проекта необходимо разместить файл `.env` следующего содержания:

```env
VITE_HOST="http://localhost:3000"
```

`VITE_HOST` — базовый URL сервера бэкенда.

```bash
# Запустить в режиме разработки
npm run dev

# Собрать для продакшена
npm run build
```

---

## Структура проекта

```
frontend/
├── public/
│   └── templates/
│       ├── layout.html                  # Основной layout с сайдбаром
│       └── pages/
│           ├── auth/
│           │   ├── login.html
│           │   └── register.html
│           ├── dashboard.html
│           ├── 404.html
│           ├── operations/
│           │   ├── operations-list.html
│           │   ├── operations-create.html
│           │   └── operations-edit.html
│           ├── incomes/
│           │   ├── income-categories.html
│           │   ├── income-create.html
│           │   └── income-edit.html
│           └── expenses/
│               ├── expense-categories.html
│               ├── expense-create.html
│               └── expense-edit.html
├── src/
│   ├── main.js                          # Точка входа
│   ├── router.js                        # Клиентский роутер
│   ├── config/
│   │   └── config.js                    # Конфигурация приложения (API, маршруты)
│   ├── services/
│   │   └── auth-service.js              # API-запросы авторизации (login, register, logout)
│   ├── components/
│   │   ├── layout.js                    # Логика сайдбара и меню
│   │   └── pages/
│   │       ├── auth/
│   │       │   ├── login.js
│   │       │   └── register.js
│   │       ├── dashboard.js
│   │       ├── operations/
│   │       │   ├── operations-list.js
│   │       │   ├── operations-create.js
│   │       │   └── operations-edit.js
│   │       ├── base-categories.js       # Базовый класс для страниц категорий
│   │       ├── incomes/
│   │       │   ├── income-categories.js
│   │       │   ├── income-create.js
│   │       │   └── income-edit.js
│   │       └── expenses/
│   │           ├── expense-categories.js
│   │           ├── expense-create.js
│   │           └── expense-edit.js
│   ├── utils/
│   │   ├── tokens-utils.js               # Хранение токенов и логика обновления
│   │   ├── http-utils.js               # HTTP-обёртка с авторизацией
│   │   ├── validator-form.js           # Универсальный валидатор форм
│   │   ├── date-picker.js              # Инициализация датапикера
│   │   └── select-period.js            # Фильтр периода (неделя/месяц/год/всё)
│   └── styles/
│       ├── styles.scss                  # Точка входа стилей
│       ├── _auth.scss
│       ├── _layout.scss
│       ├── _dashboard.scss
│       └── _operations.scss
└── index.html
```

---

## Функциональность

- Регистрация и авторизация с клиентской валидацией форм
- Просмотр баланса и сводки на дашборде
- Управление категориями доходов и расходов (создание, редактирование, удаление с подтверждением через модальное окно)
- Список транзакций с фильтрацией по периоду (неделя / месяц / год / всё время / произвольный диапазон)
- Создание и редактирование транзакций
- Визуализация доходов и расходов через круговые графики (Chart.js)
- Клиентский роутинг без перезагрузки страницы
- Адаптивная вёрстка: сворачиваемый сайдбар на десктопе, выдвижное меню с оверлеем на мобиле (< 650px)

---

## Планы по доработке

- Реализовать постраничную навигацию в списке транзакций
- Добавить экспорт данных в CSV/Excel
- Добавить тёмную тему

---

## Лицензия

[MIT](./LICENSE)

---

## Автор

**Frontend Developer** — Andrei
GitHub: [@IceFrosTv2](https://github.com/icefrostv2)
