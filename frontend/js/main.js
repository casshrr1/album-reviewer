import * as api from './api.js';

const artistsSection = document.getElementById('artists-section');
const albumsSection = document.getElementById('albums-section');
const reviewsSection = document.getElementById('reviews-section');

const artistsList = document.getElementById('artists-list');
const albumsList = document.getElementById('albums-list');
const reviewsList = document.getElementById('reviews-list');

const artistNameHeading = document.getElementById('artist-name-heading');
const albumNameHeading = document.getElementById('album-name-heading');

let selectedArtist = null;
let selectedAlbum = null;

document.getElementById('retry-btn')?.addEventListener('click', async () => {
  try {
    await loadArtists();
  } catch {
  }
});

// ------------------ ARTISTS -------------------
async function loadArtists() {
  let artists;
  try {
    artists = await api.getArtists();
  } catch {
    return;
  }

  artistsList.innerHTML = '';
  artists.forEach(a => {
  const li = document.createElement('li');

  const nameSpan = document.createElement('span');
  nameSpan.textContent = a.name;
  nameSpan.onclick = () => showAlbums(a);

  const delBtn = document.createElement('button');
  delBtn.textContent = 'Delete';
  delBtn.onclick = async (e) => {
    e.stopPropagation(); // ⬅️ important
    await api.deleteArtist(a.id);
    loadArtists();
  };

  li.appendChild(nameSpan);
  li.appendChild(delBtn);
  artistsList.appendChild(li);
});

}


document.getElementById('add-artist-form').onsubmit = async (e) => {
  e.preventDefault();
  const name = document.getElementById('artist-name').value.trim();
  const genre = document.getElementById('artist-genre').value.trim();
  const debut_year = parseInt(document.getElementById('artist-debut-year').value);
  if (!name || !genre || isNaN(debut_year)) return alert('Please fill all fields');
  await api.addArtist({ name, genre, debut_year });
  document.getElementById('artist-name').value = '';
  document.getElementById('artist-genre').value = '';
  document.getElementById('artist-debut-year').value = '';
  loadArtists();
};


// ------------------ ALBUMS -------------------
async function showAlbums(artist) {
  selectedArtist = artist;
  artistNameHeading.textContent = artist.name;

  // Display artist info
  document.getElementById('artist-genre-display').textContent = artist.genre || 'N/A';
  document.getElementById('artist-debut-year-display').textContent = artist.debut_year || 'N/A';

  artistsSection.classList.add('hidden');
  albumsSection.classList.remove('hidden');

  // Clear album form
  document.getElementById('album-name').value = '';
  document.getElementById('album-genre').value = '';
  document.getElementById('album-year').value = '';

  const albums = await api.getAlbumsByArtist(artist.id);
  albumsList.innerHTML = '';
  albums.forEach(album => {
    const li = document.createElement('li');
    li.textContent = `${album.name} - Genre: ${album.genre}, Year: ${album.release_year}`;
    li.onclick = () => showReviews(album);

    const delBtn = document.createElement('button');
    delBtn.textContent = 'Delete';
    delBtn.onclick = (e) => {
      e.stopPropagation();
      api.deleteAlbum(album.id).then(() => showAlbums(selectedArtist));
    };
    li.appendChild(delBtn);
    albumsList.appendChild(li);
  });
}


document.getElementById('add-album-form').onsubmit = async (e) => {
  e.preventDefault();
  if (!selectedArtist) return alert('No artist selected');

  const name = document.getElementById('album-name').value.trim();
  const genre = document.getElementById('album-genre').value.trim();
  const release_year = parseInt(document.getElementById('album-year').value);

  if (!name || !genre || isNaN(release_year)) {
    return alert('Please fill all fields with valid data');
  }

  try {
    await api.addAlbum({ name, genre, release_year, artistId: selectedArtist.id });

    document.getElementById('album-name').value = '';
    document.getElementById('album-genre').value = '';
    document.getElementById('album-year').value = '';

    await showAlbums(selectedArtist);
  } catch (err) {
    alert(`Error adding album: ${err.message}`);
    console.error(err);
  }
};

document.getElementById('back-to-artists').onclick = () => {
  albumsSection.classList.add('hidden');
  artistsSection.classList.remove('hidden');
};

// ------------------ REVIEWS -------------------
async function showReviews(album) {
  selectedAlbum = album;
  albumNameHeading.textContent = album.name;
  albumsSection.classList.add('hidden');
  reviewsSection.classList.remove('hidden');

  const reviews = await api.getReviewsByAlbum(album.id);
  reviewsList.innerHTML = '';

  const avgRating = (reviews.reduce((sum,r) => sum+r.rating,0)/reviews.length || 0).toFixed(1);
  const avgLi = document.createElement('li');
  avgLi.textContent = `Reviews (Average Rating: ${avgRating})`;
  reviewsList.appendChild(avgLi);

reviews.forEach(r => {
  const li = document.createElement('li');
  li.innerHTML = `<span>"${r.review}"<br>Rating: ${r.rating}<br>${r.date}</span>`;

  const buttonsDiv = document.createElement('div');
  buttonsDiv.classList.add('review-buttons');

  const editBtn = document.createElement('button');
  editBtn.textContent = 'Edit';
  editBtn.onclick = async () => {
    const newRating = prompt('New rating', r.rating);
    const newComment = prompt('New comment', r.review);
    if(newRating && newComment) {
      await api.editReview(r.id, { rating: parseFloat(newRating), review: newComment, albumId: selectedAlbum.id });
      showReviews(selectedAlbum);
    }
  };

  const delBtn = document.createElement('button');
  delBtn.textContent = 'Delete';
  delBtn.onclick = async () => {
    await api.deleteReview(r.id);
    showReviews(selectedAlbum);
  };

  buttonsDiv.appendChild(editBtn);
  buttonsDiv.appendChild(delBtn);
  li.appendChild(buttonsDiv);
  reviewsList.appendChild(li);
});

}

document.getElementById('add-review-form').onsubmit = async (e) => {
  e.preventDefault();
  const rating = parseFloat(document.getElementById('review-rating').value);
  const review = document.getElementById('review-comment').value;
  await api.addReview({ rating, review, albumId: selectedAlbum.id });
  document.getElementById('review-rating').value = '';
  document.getElementById('review-comment').value = '';
  showReviews(selectedAlbum);
};

document.getElementById('back-to-albums').onclick = () => {
  reviewsSection.classList.add('hidden');
  showAlbums(selectedArtist);
};

// ------------------ INITIAL LOAD -------------------
loadArtists();
