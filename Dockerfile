# Basis-Image
FROM node:20-alpine

# Arbeitsverzeichnis setzen
WORKDIR /app

# Abhängigkeiten kopieren und installieren
COPY package.json package-lock.json* ./
RUN npm install --production

# Quellcode kopieren
COPY . .

# Port für Vite/React-App
EXPOSE 5173

# Startbefehl
CMD ["npm", "run", "dev", "--", "--host", "--port", "5173"]
