FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install --frozen-lockfile

COPY . .
RUN npm run build
EXPOSE 3010
CMD ["npm", "run", "start"]
