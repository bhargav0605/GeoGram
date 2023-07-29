FROM node:18.17-alpine

WORKDIR /app

COPY ./package*.json ./

ENV DB_URL="Your URL"

RUN npm install

COPY . .

EXPOSE 3000

CMD [ "node", "app.js" ]