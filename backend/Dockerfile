FROM node:18-alpine

WORKDIR /app

# Copy package.json first to utilize Docker cache
COPY package*.json ./

RUN yarn install

# Copy the rest of the application code after installing dependencies
COPY . .

# Copy Prisma files after the dependencies have been installed
COPY ./src/prisma ./src/prisma

# Check if upload directories exists, create them if they don't and give permissions

RUN yarn prisma:all

RUN yarn build

EXPOSE 5058

CMD ["yarn", "dev"]
