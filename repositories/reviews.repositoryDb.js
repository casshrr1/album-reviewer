import pool from '../database/db.js';

function mapReviewRow(row) {
    if (!row) return null;
    return {
        ...row,
        id: Number(row.id),
        albumId: Number(row.albumId),
        rating: Number(row.rating)
    };
}

async function findAll() {
    const result = await pool.query(`
        SELECT id, albumid AS "albumId", rating, comment, date
        FROM reviews
    `);
    return result.rows.map(mapReviewRow);
}

async function findById(id) {
    const result = await pool.query(`
        SELECT id, albumid AS "albumId", rating, comment, date
        FROM reviews
        WHERE id = $1
    `, [id]);

    return mapReviewRow(result.rows[0]) || null;
}

async function findByAlbumId(albumId) {
    const result = await pool.query(`
        SELECT id, albumid AS "albumId", rating, comment, date
        FROM reviews
        WHERE albumid = $1
    `, [albumId]);

    return result.rows.map(mapReviewRow);
}

async function saveReview(review) {
    if (!review.albumId || review.rating == null || !review.comment || !review.date) {
        throw new Error("Invalid review object");
    }

    const albumCheck = await pool.query(
        `SELECT * FROM albums WHERE id = $1`,
        [review.albumId]
    );

    if (albumCheck.rowCount === 0) {
        throw new Error("Album does not exist");
    }

    const result = await pool.query(`
        INSERT INTO reviews (albumid, rating, comment, date)
        VALUES ($1, $2, $3, $4)
        RETURNING id, albumid AS "albumId", rating, comment, date
    `, [
        review.albumId,
        review.rating,
        review.comment,
        review.date
    ]);

    return mapReviewRow(result.rows[0]);
}

async function updateReview(id, updatedReview) {
    const result = await pool.query(`
        UPDATE reviews
        SET rating = $1, comment = $2, date = $3
        WHERE id = $4
        RETURNING id, albumid AS "albumId", rating, comment, date
    `, [
        updatedReview.rating,
        updatedReview.comment,
        updatedReview.date,
        id
    ]);

    return mapReviewRow(result.rows[0]) || null;
}

async function deleteByReviewId(id) {
    const result = await pool.query(
        'DELETE FROM reviews WHERE id = $1 RETURNING *',
        [id]
    );

    return result.rowCount > 0;
}

export default {
    findAll,
    findById,
    findByAlbumId,
    saveReview,
    updateReview,
    deleteByReviewId
};