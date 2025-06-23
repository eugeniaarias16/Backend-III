# Usar imagen oficial de Node.js LTS (Long Term Support)
FROM node:18-alpine

# Establecer directorio de trabajo en el contenedor
WORKDIR /app

# Copiar archivos de dependencias primero (para optimizar cache de Docker)
COPY package*.json ./

# Instalar dependencias de producción
RUN npm ci --only=production

# Copiar el código fuente de la aplicación
COPY src/ ./src/
COPY docs/ ./docs/

# Crear usuario no-root para ejecutar la aplicación (seguridad)
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Cambiar ownership de los archivos al usuario nodejs
RUN chown -R nodejs:nodejs /app
USER nodejs

# Exponer el puerto que usa la aplicación
EXPOSE 8080

# Variables de entorno por defecto
ENV NODE_ENV=production
ENV PORT=8080

# Comando para ejecutar la aplicación
CMD ["npm", "start"]

# Healthcheck para verificar que la app esté funcionando
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8080/api/mocks/mockingusers', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"