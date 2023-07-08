FROM node:16.17.0-bullseye-slim
RUN apt-get update && apt-get install -y --no-install-recommends dumb-init

ENV NODE_ENV production

WORKDIR /usr/src/app

COPY --chown=node:node . .

RUN npm ci --only=production

USER node

EXPOSE 3000

CMD [ "dumb-init", "npm", "start" ]
