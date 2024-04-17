FROM node:20-alpine

WORKDIR /app

COPY ./auth/app/signin /app

RUN cd /app
RUN yarn install

EXPOSE 8500

CMD ["yarn", "start"]