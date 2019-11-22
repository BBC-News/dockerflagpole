FROM node:10.16.3-jessie

WORKDIR /usr/src/app

ADD src .
ADD public .
ADD routes .

ADD ./src/* ./src/
ADD ./public/* ./public/
ADD ./routes/* ./routes/

ADD ./config.yaml ./
ADD ./package.json ./

EXPOSE 3000

RUN npm install --production

CMD [ "npm", "run", "start" ]