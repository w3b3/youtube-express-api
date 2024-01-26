# https://docs.docker.com/engine/reference/builder/
FROM node:lts-alpine

WORKDIR /usr/src/app

COPY ./package*.json ./
RUN npm ci
#CMD: ["npm", "start"]
#EXPOSE 1235
#ADD . /api
COPY ./src .
# WORKDIR .
ENTRYPOINT ["npm", "start"]
