const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const routes = require('./src/routes');
const { database } = require('./src/config');
const app = express();

// routes
const { authMiddleware } = require('./src/middlewares');
const indexRoute = require('./src/routes');
const authRoute = require('./src/routes/auth.route');
const companyRoute = require('./src/routes/company.route');
const userRoute = require('./src/routes/user.route');
const moduleRoute = require('./src/routes/module.route');

// view engine setup
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Use the consolidated routes
app.use('*', authMiddleware.tokenVerification);
app.use('/', indexRoute);
app.use('/api', authRoute);
app.use('/api/company', companyRoute);
app.use('/api/user', userRoute);
app.use('/api/module', moduleRoute);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  database.sequelize.sync()
    .then(() => {
      console.log('Database synced');
    })
    .catch(err => {
      console.error('Database sync failed:', err);
    });
});

