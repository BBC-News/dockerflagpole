FROM node:10.16.3-jessie

WORKDIR /usr/src/app

ADD ./src .
ADD ./public .
ADD ./routes .
ADD ./config.yaml .

COPY package.json .
RUN npm install --production

CMD [ "npm", "start-test" ]