FROM node:18 as build


RUN apt update -qq
RUN curl -sL https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
RUN curl -sL https://deb.nodesource.com/setup_14.x | bash -
 
RUN apt update -qq && apt install -y openjdk-17-jdk maven yarn  && yarn global add lerna

WORKDIR /cloudbeaver
COPY . .
RUN cd deploy && ./build.sh


FROM arm64v8/eclipse-temurin:11-jre as deploy

COPY --from=build /cloudbeaver/deploy/cloudbeaver /opt/cloudbeaver
WORKDIR /opt/cloudbeaver/

EXPOSE 8978
ENTRYPOINT ["./run-server.sh"]