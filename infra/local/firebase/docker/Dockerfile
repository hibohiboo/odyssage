FROM ubuntu:24.04

RUN apt update && \
apt --no-install-recommends install -y curl openjdk-17-jdk && \
curl --proto "=https" --tlsv1.2 -L -fsSL https://deb.nodesource.com/setup_22.x | bash - && \
apt --no-install-recommends install -y nodejs && \
apt clean && \
npm install --ignore-scripts -g firebase-tools

# ヘルスチェック用スクリプトの追加
COPY ./firebase_isready.sh /usr/local/bin/firebase_isready
RUN chmod +x /usr/local/bin/firebase_isready

COPY ./firebase_ci.json /opt/firebase/firebase.json
COPY ./.firebaserc_ci /opt/firebase/.firebaserc

HEALTHCHECK --interval=10s --timeout=5s --start-period=30s --retries=5 CMD ["firebase_isready"]

