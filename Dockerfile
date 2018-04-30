FROM node:6.9.1
# replace this with your application's default port
WORKDIR /appls
COPY ./package.json .
COPY ./src ./src
COPY ./config ./config
#RUN ls -la ./node_modules/
RUN npm i --unsafe-perm

EXPOSE 80
VOLUME /content
ENV NODE_ENV=production

CMD node src/index.js