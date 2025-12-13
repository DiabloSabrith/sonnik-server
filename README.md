# Sonnik Server

The **Sonnik Server** is the backend service of the Sonnik application, implementing business logic, user authentication, database operations, payment system integration, and an LLM service.

## Features
- User authentication
- Receiving and storing data in the database
- Mock integration with the **Robokassa** payment system
- LLM service for AI integration (request processing, response generation)
- REST API for the client application
- Validation of incoming data

## Technologies
- **NestJS**
- **TypeScript**
- **PostgreSQL**
- **TypeORM**
- **Robokassa (mock integration)**
- **LLM service**
- REST API

## Installation and Running

```bash
npm install

##Development
npm run start
npm run start:dev

##Production
npm run start:prod

##Testing
# unit tests
npm run test

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
