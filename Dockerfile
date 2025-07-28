FROM node:20.13

WORKDIR /var/app/current

ENV NODE_ENV=development

COPY package*.json ./
RUN npm install --include=dev

COPY . .

RUN npm run db-generate

EXPOSE 3000

CMD ["npm", "run", "dev"]
