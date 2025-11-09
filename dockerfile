FROM node:20-alpine

# Instalar postgresql-client para usar pg_isready
RUN apk add --no-cache postgresql-client

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

COPY . .

EXPOSE 3030

CMD ["node", "index.js" , "&&", "npm", "run", "migrate", "up"]