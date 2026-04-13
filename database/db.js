import pkg from 'pg';
const { Pool } = pkg;

const isProduction = !!process.env.DATABASE_URL;

const pool = new Pool(
  isProduction
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
      }
    : {
        user: 'ernur',
        host: 'localhost',
        database: 'music_reviewer',
        password: '',
        port: 5432
      }
);

export default pool;