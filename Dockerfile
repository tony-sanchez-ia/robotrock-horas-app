FROM node:22-bookworm-slim

# Directorio de trabajo
WORKDIR /app

# Instalar dependencias del sistema necesarias para compilar SQLite (better-sqlite3)
RUN apt-get update && apt-get install -y python3 make g++ sqlite3 openssl && rm -rf /var/lib/apt/lists/*

# Copiar archivos de dependencias
COPY package.json package-lock.json ./

# Instalar dependencias puras para re-sincronizar el package-lock si es necesario
RUN npm install

# Copiar todo el código (el .dockerignore evita que pase node_modules local o la DB de dev)
COPY . .

# Construir el frontend y generar el Cliente Prisma ESM
RUN npm run build

# Exponer el puerto
EXPOSE 3000

# Comando de inicio: Migra/Sincroniza la base de datos de producción y arranca
CMD ["sh", "-c", "npx prisma db push --accept-data-loss && npm start"]
