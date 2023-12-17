# Бэкенд Mesto. Каркас API Mesto

## Описание
&nbsp;&nbsp;Небольшой проект представляет собой REST API сервер, разработанный на Node.js с использованием фреймворка Express. Этот сервер предназначен для работы с проектом [Mesto](https://github.com/MADeit0/mesto-project.git) - веб-сервисом, который позволяет пользователям делиться фотографиями своих любимых мест.

---
## Технологии

&nbsp;&nbsp;Проект использует следующие технологии и инструменты:

- **Node.js**: среда выполнения для серверной части приложения.
- **Express**: фреймворк для разработки веб-сервиса.
- **TypeScript**: основной язык проекта, обеспечивающий статическую типизацию.
- **MongoDB**: нереляционная СУБД для хранения данных пользователей.
- **Mongoose**: ODM (Object Data Modeling) для работы с MongoDB.
- **celebrate**: библиотека для валидации входных данных.
- **bcryptjs**: модуль для хеширования паролей пользователей.
- **jsonwebtoken**: пакет для создания и проверки jwt-токенов.
- **winston**: модуль для логирования запросов и ошибок
- **helmet**: пакет, обеспечивающий базовую защиту сервера
- **express-rate-limit**: модуль для ограничения количества запросов от одного IP

---
## Реализовано
- Создание пользователя, авторизация пользователя
- Валидация запросов
- Хеширование пароля
- Создание jwt-токена при авторизации пользователя
- Выполнение действий пользователя (удаление карточки данных, изменение профиля, добавление/удаление лайков в карточках)
- Централизованный обработчик ошибок
- Логирование запросов и ошибок.

---
## Установка
- Склонируйте репозиторий:  
  `git clone git@github.com:MADeit0/mesto-backend.git`
- Установите npm пакеты. В терминале: `npm install`
- Создайте в корне проекта .env файл с ключами:
  ```
  PORT="your port"
  NODE_ENV="production"
  DATABASE="your DB"
  JWT_SECRET="your jwt secret key"
  ```

- Запустите проект. В терминале: `npm run dev` 
