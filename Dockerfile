FROM node
EXPOSE 8081
WORKDIR /root

ADD server.js package.json /root/
RUN ["npm", "install"]

CMD ["node", "/root/server.js"]

# development: docker run -idt -v $PWD:$PWD -w $PWD -p 8081:80 -P 