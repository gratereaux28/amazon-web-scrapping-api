FROM node:latest as deps
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --frozen-lockfile


FROM node:latest as builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules

COPY . .
RUN npm run build


FROM node:latest as runner
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --prod
COPY --from=builder /app/dist ./dist

RUN apt-get install -y wget
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \ 
    && echo "deb http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list
RUN apt-get update && apt-get -y install google-chrome-stable

ENV APP_LISTEN_PORT=22006
ENV AMAZON_URL_DOMAIN='https://www.amazon.com/'
EXPOSE 22006

CMD [ "node","dist/main" ]