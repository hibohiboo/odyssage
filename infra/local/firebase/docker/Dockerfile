FROM ubuntu:22.04

RUN apt update && \
apt --no-install-recommends install -y curl openjdk-17-jdk && \
curl --proto "=https" --tlsv1.2 -L -fsSL https://deb.nodesource.com/setup_22.x | bash - && \
apt --no-install-recommends install -y nodejs && \
apt clean && \
npm install --ignore-scripts -g firebase-tools
