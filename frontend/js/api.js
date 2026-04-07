const API_BASE = 'http://localhost:3000/';

let serverDown = false;

function showServerError() {
  document.getElementById('server-error')?.classList.remove('hidden');
}

function hideServerError() {
  document.getElementById('server-error')?.classList.add('hidden');
}

async function safeFetch(url, options = {}) {
  try {
    const res = await fetch(url, options);
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || 'Server error');
    }

    if (serverDown) {
      serverDown = false;
      hideServerError();
    }

    // DELETE requests usually return no body
    if (res.status === 204) return null;

    return await res.json();
  } catch (err) {
    serverDown = true;
    showServerError();
    throw err;
  }
}

// ------------------ ARTISTS -------------------
export async function getArtists() {
  return safeFetch(`${API_BASE}artists`);
}

export async function addArtist(artist) {
  return safeFetch(`${API_BASE}artists`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(artist),
  });
}

export async function deleteArtist(id) {
  return safeFetch(`${API_BASE}artists/${id}`, {
    method: 'DELETE',
  });
}

// ------------------ ALBUMS -------------------
export async function getAlbumsByArtist(artistId) {
  return safeFetch(`${API_BASE}albums/artist/${artistId}`);
}

export async function addAlbum(album) {
  return safeFetch(`${API_BASE}albums`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(album),
  });
}

export async function deleteAlbum(id) {
  return safeFetch(`${API_BASE}albums/${id}`, {
    method: 'DELETE',
  });
}

// ------------------ REVIEWS -------------------
export async function getReviewsByAlbum(albumId) {
  return safeFetch(`${API_BASE}reviews/album/${albumId}`);
}

export async function addReview(review) {
  return safeFetch(`${API_BASE}reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(review),
  });
}

export async function editReview(id, review) {
  return safeFetch(`${API_BASE}reviews/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(review),
  });
}

export async function deleteReview(id) {
  return safeFetch(`${API_BASE}reviews/${id}`, {
    method: 'DELETE',
  });
}
