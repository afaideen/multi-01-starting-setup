FROM node

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

EXPOSE 80

ENV MONGODB_USERNAME=root
ENV MONGODB_PASSWORD=root1
#ENV SERVER_ADDRESS=http://localhost:3000
### CMD ["node", "app.js"]
CMD ["npm", "start"]