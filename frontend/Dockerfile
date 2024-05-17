FROM node

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

EXPOSE 3000

ENV SERVER_ADDRESS=http://localhost

CMD ["npm", "start"]