import express from 'express';
import fs from 'fs';
import compression from 'compression'; // compresses requests
import session from 'express-session';
import bodyParser from 'body-parser';
import lusca from 'lusca';
import mongo from 'connect-mongo';
import flash from 'express-flash';
import path from 'path';
import passport from 'passport';
import bluebird from 'bluebird';
import { MONGODB_URI, SESSION_SECRET } from './util/secrets';
import apiRoutes from './api-routes';

// Create Express server
const app = express();

// Express configuration
app.set('port', process.env.PORT || 3000);
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

/**
 * Primary app routes.
 */

app.get('/', async (req, res, next) => {
  const getApiVersion = res => {
    fs.readFile(path.resolve(__dirname, '../package.json'), (err, data) => {
      if (err) throw err;
      const packageJson = JSON.parse(data.toString());
      const { version } = packageJson;
      res.status(200).send(`Api Version - ${version}`);
    });
  };
  getApiVersion(res);
});

app.use('/api', apiRoutes);

export default app;
