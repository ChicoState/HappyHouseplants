The readme for HappyHouseplants

[![Build Status](https://travis-ci.org/ChicoState/HappyHouseplants.svg?branch=main)](https://travis-ci.org/ChicoState/HappyHouseplants)

# Getting Started
## Frameworks and tools:
- React-Native
- Node.js
- ESLint - AirBnB Styleguide
- Travis-CI


# Contributions
## Software needed:
- Docker
- Node / npm
- Android Studio
- Watchman [optional]


## Setup
- Make a fork of ChicoState/HappyHouseplants
- Create a new branch for the feature you are working on
- Create two .env files with the values below
    - note: 
        - .env files should not be committed to GitHub
        - Secret values have been changed to serve as an example
        - DB_USER is a secret
        - DB_PASSWORD is a secret
        - EXPO_HOSTNAME is the hostname, or IP address, of the machine that is running the backend

`/backend/.env`
```
CONNECT_URL=mongodb://localhost:27017/
CONTAINER_URL=mongodb://happyplant-db:27017/
DB_NAME=happyplants
DB_USER=SOMEUSER
DB_PASSWORD=SOMEPASSWORD
```
`/frontend/.env`
```
EXPO_HOSTNAME=SOMEHOSTNAME
```

### To run a local instance of the database and API:
- Change directory to HappyHousePlants repository

`cd HappyHousePlants`

- Run one of the commands below:
    
    ```
    ./start.sh
    ```
    
    OR
    
    ```
    cd backend && docker-compose build && docker-compose up -d
    ```
    
    OR
    ```
    cd backend
    docker-compose build
    docker-compose up -d
    ```

- Submit a pull request to the main branch when it is polished and ready to review, if the pull request is not ready for review but requires attention, please submit it as a draft.
