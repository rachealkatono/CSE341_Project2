require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const cors = require('cors');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const { initDb, getDb } = require('./data/database');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Session config
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key-here',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000
  }
}));

app.use(passport.initialize());
app.use(passport.session());

// GitHub OAuth Strategy
const getCallbackURL = () => {
  if (process.env.GITHUB_CALLBACK_URL) return process.env.GITHUB_CALLBACK_URL;
  if (process.env.NODE_ENV === 'production') {
    return 'https://cse341-project2-z10v.onrender.com/auth/github/callback';
  }
  return `http://localhost:${port}/auth/github/callback`;
};

passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: getCallbackURL()
}, (accessToken, refreshToken, profile, done) => {
  console.log('✅ GitHub OAuth success:', profile.username);
  return done(null, profile);
}));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// Swagger API Docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Debug route
app.get('/debug/data', async (req, res) => {
  try {
    const db = getDb();
    const collections = await db.listCollections().toArray();
    res.json({
      dbConnected: true,
      dbName: db.databaseName,
      collections: collections.map(c => c.name)
    });
  } catch (error) {
    console.error('🔍 Debug error:', error);
    res.status(500).json({
      dbConnected: false,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Routes
app.use('/', require('./routes/index.js'));

// Error handler
app.use((err, req, res, next) => {
  console.error('❌ Error occurred:', err);

  if (req.originalUrl.startsWith('/auth/github')) {
    return res.redirect('/?error=internal_error');
  }

  res.status(500).send(`
    <h1>Internal Server Error</h1>
    <p style="color:red;">${err.message || 'Something went wrong.'}</p>
    <a href="/">Go back to Home</a>
  `);
});

// Async server init
if (require.main === module) {
  (async () => {
    try {
      await initDb();
      app.listen(port, () => {
        console.log(`🚀 Server running on http://localhost:${port}`);
        console.log(`✅ GitHub Callback URL: ${getCallbackURL()}`);
        console.log(`📘 Swagger Docs: http://localhost:${port}/api-docs`);
      });
    } catch (err) {
      console.error('❌ Failed to start server:', err);
      process.exit(1);
    }
  })();
}

// Export app for testing
module.exports = app;
