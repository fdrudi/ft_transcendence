FROM node:18-alpine

ENV NODE_ENV=development

WORKDIR /app

# COPY ["package.json", "yarn.lock", ".eslintrc.json", "tsconfig.json", "./"]

# RUN yarn add eslint-plugin-prettier --dev
# RUN yarn add prettier

# RUN yarn install

COPY . .

CMD [ "sh", "/app/config.sh" ]
