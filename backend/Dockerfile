FROM node:18-alpine

ENV NODE_ENV=dev

WORKDIR /app

COPY ["package.json", "package-lock.json", \
		"ormconfig.ts", "nest-cli.json", \
		".eslintrc.js", "tsconfig.json", "./"]

# RUN npm install eslint-plugin-prettier
# RUN npm install prettier


RUN npm i --save @nestjs/passport passport

RUN npm install typeorm --save

RUN npm install reflect-metadata --save

RUN npm install @types/node --save-dev


RUN npm install

COPY . .

CMD [ "npm", "run", "start:dev" ]
