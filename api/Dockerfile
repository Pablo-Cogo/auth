FROM node:20-alpine

WORKDIR /api

COPY ./auth/api /api

RUN cd /api
RUN yarn install

EXPOSE 5001

CMD ["yarn", "start"]