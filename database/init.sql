CREATE TABLE IF NOT EXISTS artists (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  genre TEXT,
  debut_year INTEGER
);

CREATE TABLE IF NOT EXISTS albums (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  genre TEXT,
  release_year INTEGER NOT NULL,
  artistId INTEGER REFERENCES artists(id),
  UNIQUE (artistId, name)
);

CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  albumId INTEGER REFERENCES albums(id),
  rating NUMERIC(3,1) NOT NULL,
  comment TEXT,
  date TEXT
);