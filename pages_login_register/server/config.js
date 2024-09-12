require('dotenv').config();

module.exports = {
  mongodbUri: process.env.MONGODB_URI,
  adminUsername: process.env.ADMIN_USERNAME,
  adminPassword: process.env.ADMIN_PASSWORD,
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
  frontendOrigin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173',
  port: process.env.PORT || 3001
};