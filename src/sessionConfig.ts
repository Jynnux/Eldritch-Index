import connectPgSimple from 'connect-pg-simple';
import session from 'express-session';
import { Pool } from 'pg';

const PostgresStore = connectPgSimple(session);

const isProduction = process.env.NODE_ENV === 'production';

// NOTE TO CHRIS: hello. i was having some huge issues with my database
// when trying to set up my site. with the end of the semester, we've
// both been really busy so the changes you are gonna see here are, unfortunately,
// primarily suggested to me through AI. i wont lie; i am not entirely certain
// what concepts it used to generate these. however, i did my best to get a vague
// grasp on what was suggested to me so that i could try and implement it
// properly.

// i had to get rid of the conString and utilize a Pool instead. for whatever reason,
// conStrings were acting very mean in the connection between my DB and my droplet.
// i learned about pools and quickly implemented what you see below in a rather
// desperate attempt to get my site working properly and lo and behold, it fixed it
// perfectly. i am only so verbose in explaining my changes because i was under
// the assumption that we weren't really supposed to touch this file so i hope it's
// fine that i did what i had to do in order to get my project working.

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  ssl: {
    rejectUnauthorized: false,
  },
});

const sessionStorage = new PostgresStore({
  pool,
  createTableIfMissing: true,
});

const sessionMiddleware = session({
  store: sessionStorage,

  secret: process.env.COOKIE_SECRET as string,

  name: 'session',

  resave: false,
  saveUninitialized: false,

  cookie: {
    maxAge: 8 * 60 * 60 * 1000,
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
  },
});

export { sessionMiddleware };
