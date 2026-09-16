const BASE_URL = 'http://localhost:5000/api';

const getHeaders = (token = null) => {
  const headers = { 'Content-Type': 'application/json' };
  const authToken = token || localStorage.getItem('token');
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }
  return headers;
};

// --- AUTH APIS ---
export const registerUserAPI = async (userData) => {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Registration failed');
  return data;
};

export const loginUserAPI = async (credentials) => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Login failed');
  return data;
};

export const fetchUserProfileAPI = async (token) => {
  const res = await fetch(`${BASE_URL}/auth/me`, {
    method: 'GET',
    headers: getHeaders(token),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch user profile');
  return data;
};

// --- DESTINATIONS APIS ---
export const fetchDestinationsAPI = async (category = null, search = null) => {
  const params = new URLSearchParams();
  if (category && category !== 'All') params.append('category', category);
  if (search) params.append('search', search);

  const res = await fetch(`${BASE_URL}/destinations?${params.toString()}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch destinations');
  return data.destinations || [];
};

export const fetchDestinationByNameAPI = async (name) => {
  const res = await fetch(`${BASE_URL}/destinations/${encodeURIComponent(name)}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch destination');
  return data.destination;
};

// --- AI ASSISTANT APIS ---
export const sendAIChatAPI = async ({ sessionId, message, token }) => {
  const res = await fetch(`${BASE_URL}/ai/chat`, {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify({ sessionId, message }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'AI Assistant request failed');
  return data;
};

export const fetchChatSessionAPI = async (sessionId) => {
  const res = await fetch(`${BASE_URL}/ai/session/${sessionId}`);
  const data = await res.json();
  if (!res.ok) return null;
  return data.session;
};

export const predictBudgetAPI = async (features) => {
  const res = await fetch(`${BASE_URL}/ai/predict-budget`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(features),
  });
  return await res.json();
};

// --- TRIP APIS ---
export const fetchUserTripsAPI = async (token) => {
  const res = await fetch(`${BASE_URL}/trips`, {
    method: 'GET',
    headers: getHeaders(token),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch trips');
  return data.trips || [];
};

export const fetchTripByIdAPI = async (id) => {
  const res = await fetch(`${BASE_URL}/trips/${id}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch trip details');
  return data.trip;
};

export const createTripAPI = async (tripData, token) => {
  const res = await fetch(`${BASE_URL}/trips`, {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify(tripData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to create trip');
  return data.trip;
};

export const updateTripAPI = async (id, tripData, token) => {
  const res = await fetch(`${BASE_URL}/trips/${id}`, {
    method: 'PUT',
    headers: getHeaders(token),
    body: JSON.stringify(tripData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to update trip');
  return data.trip;
};

export const deleteTripAPI = async (id, token) => {
  const res = await fetch(`${BASE_URL}/trips/${id}`, {
    method: 'DELETE',
    headers: getHeaders(token),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to delete trip');
  return data;
};

export const getTripPdfUrl = (tripId) => `${BASE_URL}/trips/${tripId}/pdf`;

// --- BOOKINGS APIS ---
export const searchBookingsAPI = async (params) => {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${BASE_URL}/bookings/search?${query}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Search bookings failed');
  return data.results || [];
};

export const createBookingAPI = async (bookingData, token) => {
  const res = await fetch(`${BASE_URL}/bookings`, {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify(bookingData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to create booking');
  return data.booking;
};

export const fetchUserBookingsAPI = async (token) => {
  const res = await fetch(`${BASE_URL}/bookings`, {
    method: 'GET',
    headers: getHeaders(token),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch bookings');
  return data.bookings || [];
};
