FROM node:20.13

WORKDIR /var/app/current

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run db-generate

EXPOSE 3000

CMD ["npm", "run", "dev"]
