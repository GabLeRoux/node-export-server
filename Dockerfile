FROM node:boron

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
ENV ACCEPT_HIGHCHARTS_LICENSE YES
ENV HIGHCHARTS_VERSION latest

# Install app dependencies
COPY package.json /usr/src/app/
RUN npm install
RUN npm link highcharts-export-server

# Bundle app source
COPY . /usr/src/app

EXPOSE 8080
CMD [ "highcharts-export-server", "-host", "0.0.0.0", "-enableServer", "1", "-port", "8080"]
