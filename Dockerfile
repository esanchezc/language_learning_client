FROM node:18

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Copy app code
COPY . .

# Expose port and start command
EXPOSE 3000
CMD ["npm", "start", "--public-url", "/"]