FROM node:lts
WORKDIR /app
COPY package.json .
COPY . .

RUN npm install
EXPOSE 8080

CMD node server.js 