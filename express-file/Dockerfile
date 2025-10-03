# ベースイメージ
FROM node:22-bullseye-slim

WORKDIR /app

# 依存ファイルを先にコピーして npm install
COPY package*.json ./
RUN npm install

# Backend 全体をコピー
COPY Projects/Backend/ ./

# Frontend もコピー
COPY Projects/Frontend/ ../Frontend/

CMD ["node", "NewServer.js"]

