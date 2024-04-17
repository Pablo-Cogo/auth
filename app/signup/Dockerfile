FROM node:20-alpine

WORKDIR /app

COPY ./auth/app/signup /app

RUN cd /app
RUN yarn install

EXPOSE 8501

CMD ["yarn", "start"]