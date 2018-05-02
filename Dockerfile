FROM node:carbon


ENV CASSANDRA_HOST=172.17.0.2
ENV CASSANDRA_PORT=9042
ENV CASSANDRA_KEYSPACE=cchain
ENV ELASASSANDRA_PORT=9200

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
RUN npm install cassandra-driver
RUN npm install elasticsearch
RUN npm install moment
RUN npm install env-docker --save-dev

# If you are building your code for production
# RUN npm install --only=production

# Bundle app source
COPY . .


EXPOSE 8081
CMD [ "npm", "start" ]