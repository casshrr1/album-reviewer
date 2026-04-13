import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  user: 'ernur',
  host: 'localhost',
  database: 'music_reviewer',
  password: '',
  port: 5432,
});

export default pool;