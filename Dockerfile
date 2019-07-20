FROM node:alpine

MAINTAINER Frend "https://github.com/FrendEr"

COPY . /data

WORKDIR /data
RUN npm install --production

EXPOSE 3420

CMD ["node", "server.js"]
