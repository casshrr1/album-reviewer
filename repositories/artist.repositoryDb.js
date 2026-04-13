import pool from '../database/db.js';

async function findAll() {
    const result = await pool.query("SELECT * FROM artists");
    return result.rows;
}

async function findById(id) {
    const result = await pool.query(
        "SELECT * FROM artists WHERE id = $1",
        [id]
    );

    return result.rows[0] || null;
}

async function saveArtist(newArtist) {
    if (!newArtist.name || newArtist.name.trim() === "") {
        throw new Error("Invalid artist name");
    }

    try {
        const result = await pool.query(
            "INSERT INTO artists (name, genre, debut_year) VALUES ($1, $2, $3) RETURNING *",
            [newArtist.name, newArtist.genre ?? null, newArtist.debut_year ?? null]
        );

        return result.rows[0];

    } catch (err) {
        if (err.code === "23505") {
            throw new Error("Artist already exists");
        }

        throw err;
    }
}

async function deleteByArtistId(id) {
    const result = await pool.query(
        "DELETE FROM artists WHERE id = $1 RETURNING *",
        [id]
    );

    return result.rowCount > 0;
}

export default {
  findAll,
  findById,
  saveArtist,
  deleteByArtistId
};