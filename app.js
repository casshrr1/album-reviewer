import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware to parse JSON requests
app.use(express.json());

// Import routers
import artistRouter from './routes/artist.routes.js';
import albumRouter from './routes/album.routes.js';
import reviewRouter from './routes/review.routes.js';

// Mount routers
app.use('/artists', artistRouter);
app.use('/albums', albumRouter);
app.use('/reviews', reviewRouter);
app.use(express.static(path.join(__dirname, 'frontend')));

app.get('/', (req, res) => {
    res.json({ message: 'Music Reviewer API running' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

export default app; // export app for testing with Jest/Supertest