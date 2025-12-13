
# Sonnik Server

Серверная часть приложения **Sonnik** — backend-сервис, реализующий бизнес-логику, авторизацию, работу с базой данных, интеграцию платёжной системы и LLM-сервиса.

Проект разработан как API для клиентского приложения и ориентирован на дальнейшее масштабирование.

## Функциональность
- Авторизация пользователей
- Приём и сохранение данных в базе данных
- Мок-интеграция с платёжной системой **Robokassa**
- LLM-сервис для интеграции ИИ (обработка запросов, генерация ответов)
- REST API для клиентского приложения
- Валидация входящих данных

## Технологии
- **NestJS**
- **TypeScript**
- **PostgreSQL**
- **TypeORM**
- **Robokassa (mock integration)**
- **LLM service**
- REST API

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```


```bash
$ npm install -g @nestjs/mau
$ mau deploy
```


