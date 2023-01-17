FROM node:16

WORKDIR /usr/src/app

COPY --chown=node:node . .

# npm ci gave me Missing & Invalid in package-lock.json
RUN npm install
RUN npm run tsc

USER node

CMD npm start
