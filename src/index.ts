import connectPgSimple from 'connect-pg-simple';
import 'dotenv/config';
import express, { Express } from 'express';
import session from 'express-session';
import { characterController } from './controllers/characterController.js';
import { userController } from './controllers/userController.js';
import { sessionMiddleware } from './sessionConfig.js';

const app: Express = express();
const { PORT, COOKIE_SECRET } = process.env;
const PostgresStore = connectPgSimple(session);

app.use(sessionMiddleware); // Setup session management middleware
app.use(express.json()); // Setup JSON body parsing middleware
app.use(express.urlencoded({ extended: false })); // Setup urlencoded (HTML Forms) body parsing middleware

// Setup static resource file middleware
// This allows the client to access any file inside the `public` directory
// Only put file that you actually want to be publicly accessibly in the `public` folder
app.use(express.static('public', { extensions: ['html'] }));
app.use(express.json());
app.use(
  session({
    store: new PostgresStore({ createTableIfMissing: true }),
    secret: COOKIE_SECRET,
    cookie: { maxAge: 8 * 60 * 60 * 1000 },
    name: 'session',
    resave: false,
    saveUninitialized: false,
  }),
);

// -- Routes --------------------------------------------------
// Register your routes below this line

// #### USER ROUTES #### //
app.post('/users', userController.registerUser);
app.post('/login', userController.logIn);
app.delete('/sessions', userController.logOut);
app.get('/users/me', userController.getUserProfile);
app.delete('/users/me', userController.deleteUser);
app.put('/users/me', userController.changeDisplayName);
// #### CHARACTER CREATOR ROUTES #### //
app.post('/characters', characterController.createCharacter);
app.get('/characters/:id', characterController.getCharacter);
app.delete('/characters/:id', characterController.deleteCharacter);

app.listen(process.env.PORT, () => {
  console.log(`Server listening on http://localhost:${process.env.PORT}`);
});
