import pool from '../database/db.js';

async function findAll() {
    const result = await pool.query('SELECT id, name, genre, release_year, artistid AS "artistId" FROM albums');
    return result.rows;
}

async function findById(id) {
    const result = await pool.query(
        `SELECT id, name, genre, release_year, artistid AS "artistId"
        FROM albums
        WHERE id = $1`,
        [id]
    );

    return result.rows[0] || null;
}

async function saveAlbum(album) {
    if (!album.artistId || !album.name) {
        throw new Error('Invalid album object');
    }

    const artistCheck = await pool.query(
        'SELECT * FROM artists WHERE id = $1',
        [album.artistId]
    );

    if (artistCheck.rowCount === 0) {
        throw new Error('Artist does not exist');
    }

    const result = await pool.query(
        `INSERT INTO albums (name, genre, release_year, artistid)
         VALUES ($1, $2, $3, $4)
         RETURNING id, name, genre, release_year, artistid AS "artistId"`,
        [album.name, album.genre ?? null, album.release_year ?? null, album.artistId]
    );

    return result.rows[0];
}

async function deleteByAlbumId(id) {
    const result = await pool.query(
        "DELETE FROM albums WHERE id = $1 RETURNING *",
        [id]
    );

    return result.rowCount > 0;
}

export default {
  findAll,
  findById,
  saveAlbum,
  deleteByAlbumId
};