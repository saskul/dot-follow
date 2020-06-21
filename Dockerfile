FROM ubuntu
ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get -y update
RUN apt-get install -y npm nodejs g++ build-essential
RUN npm cache clean -f
RUN npm install -g n
COPY . /opt/dot-follow
WORKDIR /opt/dot-follow/bmp2json
RUN npm install && npm run build
WORKDIR /opt/dot-follow
RUN npm install
ENTRYPOINT npm run build && npm start
