FROM node:19.9.0-alpine3.16
WORKDIR /app
COPY package.json .
COPY package-lock.json .
RUN npm install
COPY . .
EXPOSE 2323
ENV PORT 2323
RUN chown -R node /app
CMD ["npm", "run", "start"]