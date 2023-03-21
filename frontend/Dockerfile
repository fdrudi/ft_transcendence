FROM node:14

ENV NODE_ENV=dev

WORKDIR /app

COPY ["package.json", "yarn.lock", ".eslintrc.json", "tsconfig.json", "./"]

RUN yarn add eslint-plugin-prettier --dev
RUN yarn add prettier

RUN yarn install

COPY . .

# RUN cd ./src

CMD [ "yarn", "start" ]
