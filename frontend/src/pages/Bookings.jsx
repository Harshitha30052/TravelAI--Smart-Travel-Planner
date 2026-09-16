import React, { useState, useEffect, useContext } from 'react';
import Navbar from '../components/Navbar';
import { AuthContext } from '../context/AuthContext';
import { searchBookingsAPI, createBookingAPI, fetchUserBookingsAPI } from '../services/api';
import { 
  Plane, 
  Building, 
  Car, 
  CheckCircle2, 
  Calendar, 
  Users, 
  Clock, 
  ArrowRight, 
  Search,
  Shield,
  CreditCard,
  X
} from 'lucide-react';

const Bookings = () => {
  const { user, token } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('flights'); // 'flights' | 'hotels' | 'transport' | 'history'

  // Search parameters
  const [origin, setOrigin] = useState('New Delhi');
  const [destination, setDestination] = useState('Goa');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [travelers, setTravelers] = useState(2);

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [confirmationModal, setConfirmationModal] = useState(null);

  useEffect(() => {
    if (activeTab === 'history') {
      loadHistory();
    } else {
      handleSearch();
    }
  }, [activeTab]);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const data = await fetchUserBookingsAPI(token);
      setHistory(data);
    } catch (err) {
      console.error('Failed to load bookings history:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const type = activeTab === 'hotels' ? 'hotel' : activeTab === 'transport' ? 'transport' : 'flight';
      const items = await searchBookingsAPI({
        type,
        origin,
        destination,
        date,
        travelers
      });
      setResults(items);
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBookItem = async (item) => {
    try {
      const type = activeTab === 'hotels' ? 'hotel' : activeTab === 'transport' ? 'transport' : 'flight';
      const bookingPayload = {
        bookingType: type,
        destination,
        provider: item.provider || 'Partner Airline / Hotel',
        title: item.flightNumber || item.name || item.type,
        details: item,
        startDate: date,
        travelers: parseInt(travelers, 10) || 1,
        totalPrice: item.totalPrice || item.price || 4200
      };

      const created = await createBookingAPI(bookingPayload, token);
      setConfirmationModal(created);
    } catch (err) {
      alert('Booking simulation failed. Please retry.');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}>
      <Navbar />

      <main style={{ maxWidth: '1240px', margin: '0 auto', padding: '2.5rem 1.5rem', width: '100%', boxSizing: 'border-box' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <span style={{ color: '#06b6d4', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Direct Travel Services
          </span>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#f8fafc', margin: '4px 0 8px 0' }}>
            Bookings & Reservations
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '1rem', margin: 0 }}>
            Browse and reserve flights, hotels, and intercity transit with transparent pricing and mock booking integration.
          </p>
        </div>

        {/* Tab Navigation */}
        <div style={{
          display: 'flex',
          gap: '10px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          paddingBottom: '1rem',
          marginBottom: '2rem',
          overflowX: 'auto'
        }}>
          {[
            { id: 'flights', label: 'Flights', icon: <Plane size={18} /> },
            { id: 'hotels', label: 'Hotels', icon: <Building size={18} /> },
            { id: 'transport', label: 'Transportation', icon: <Car size={18} /> },
            { id: 'history', label: 'My Bookings', icon: <Clock size={18} /> }
          ].map((tab) => {
            const isCurrent = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 18px',
                  borderRadius: '10px',
                  border: isCurrent ? '1px solid #06b6d4' : '1px solid rgba(255, 255, 255, 0.08)',
                  background: isCurrent ? 'rgba(6, 182, 212, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                  color: isCurrent ? '#38bdf8' : '#cbd5e1',
                  fontWeight: isCurrent ? 700 : 500,
                  fontSize: '0.92rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search Filter Form for active tab */}
        {activeTab !== 'history' && (
          <form
            onSubmit={handleSearch}
            style={{
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              padding: '1.25rem',
              marginBottom: '2rem',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '12px',
              alignItems: 'flex-end',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)'
            }}
          >
            {activeTab === 'flights' && (
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px' }}>
                  Departure City
                </label>
                <input
                  type="text"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    color: '#fff',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px' }}>
                Destination
              </label>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#fff',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px' }}>
                Travel Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#fff',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px' }}>
                Travelers / Guests
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={travelers}
                onChange={(e) => setTravelers(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#fff',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '11px',
                  borderRadius: '8px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  cursor: 'pointer'
                }}
              >
                Search Options
              </button>
            </div>
          </form>
        )}

        {/* Results Stream */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: '#94a3b8' }}>
            <div className="spinner" style={{ margin: '0 auto 1rem auto' }}></div>
            <p>Searching verified travel inventory...</p>
          </div>
        ) : activeTab === 'history' ? (
          /* Bookings History Tab */
          <div>
            {history.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem 0', color: '#64748b' }}>
                <p>No confirmed bookings yet. Search and reserve your flights or hotels above!</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {history.map((bk) => (
                  <div
                    key={bk._id}
                    style={{
                      background: 'rgba(15, 23, 42, 0.8)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '14px',
                      padding: '1.25rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '1rem'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span style={{
                          background: 'rgba(16, 185, 129, 0.15)',
                          color: '#10b981',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: '12px',
                          textTransform: 'uppercase'
                        }}>
                          {bk.bookingReference}
                        </span>
                        <span style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'capitalize' }}>
                          {bk.bookingType} Booking
                        </span>
                      </div>
                      <h3 style={{ margin: '0 0 4px 0', fontSize: '1.15rem', color: '#f8fafc' }}>
                        {bk.title}
                      </h3>
                      <div style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
                        Destination: <strong>{bk.destination}</strong> • Date: {bk.startDate} • {bk.travelers} Traveler{bk.travelers > 1 ? 's' : ''}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block' }}>Total Paid</span>
                      <span style={{ fontSize: '1.3rem', fontWeight: 800, color: '#10b981' }}>
                        ₹{(bk.totalPrice || 0).toLocaleString('en-IN')}
                      </span>
                      <div style={{
                        marginTop: '4px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.75rem',
                        color: '#10b981'
                      }}>
                        <CheckCircle2 size={13} />
                        <span>Confirmed</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Search Results */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ fontSize: '0.88rem', color: '#94a3b8', marginBottom: '0.5rem' }}>
              Showing verified options for <strong>{destination}</strong> ({travelers} traveler{travelers > 1 ? 's' : ''}):
            </div>

            {results.map((res, i) => (
              <div
                key={res.id || i}
                style={{
                  background: 'rgba(15, 23, 42, 0.75)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '14px',
                  padding: '1.25rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1.25rem',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)'
                }}
              >
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 700, textTransform: 'uppercase' }}>
                    {res.provider || 'Verified Partner'}
                  </span>
                  <h3 style={{ margin: '4px 0 6px 0', fontSize: '1.2rem', color: '#f8fafc' }}>
                    {res.flightNumber || res.name || res.type}
                  </h3>

                  {activeTab === 'flights' ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#cbd5e1', fontSize: '0.85rem' }}>
                      <span><strong>{res.departureTime}</strong> ({res.from})</span>
                      <ArrowRight size={14} color="#64748b" />
                      <span><strong>{res.arrivalTime}</strong> ({res.to})</span>
                      <span style={{ color: '#64748b' }}>• {res.duration} • {res.stops}</span>
                    </div>
                  ) : (
                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8' }}>
                      {res.description || res.location || `${res.capacity || 'All standard amenities included'}`}
                    </p>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block' }}>Total Price</span>
                    <span style={{ fontSize: '1.35rem', fontWeight: 800, color: '#f8fafc' }}>
                      ₹{(res.totalPrice || res.price || res.pricePerNight || 3200).toLocaleString('en-IN')}
                    </span>
                  </div>

                  <button
                    onClick={() => handleBookItem(res)}
                    style={{
                      padding: '10px 18px',
                      borderRadius: '8px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
                      color: '#fff',
                      fontSize: '0.88rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {activeTab === 'hotels' ? 'Reserve Room' : activeTab === 'transport' ? 'Book Ride' : 'Book Flight'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Booking Confirmation Modal */}
      {confirmationModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(8px)',
          zIndex: 999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.25rem'
        }}>
          <div style={{
            background: 'var(--bg-secondary)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '20px',
            maxWidth: '520px',
            width: '100%',
            padding: '2rem',
            textAlign: 'center',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem auto'
            }}>
              <CheckCircle2 size={36} color="#10b981" />
            </div>

            <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 700, textTransform: 'uppercase' }}>
              Booking Confirmed
            </span>
            <h2 style={{ fontSize: '1.6rem', color: '#f8fafc', margin: '4px 0 8px 0' }}>
              {confirmationModal.title}
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.88rem', margin: '0 0 1.25rem 0' }}>
              Simulated reservation created successfully. Your booking voucher is linked to reference:
            </p>

            <div style={{
              background: 'rgba(0, 0, 0, 0.3)',
              padding: '12px',
              borderRadius: '10px',
              fontWeight: 800,
              fontSize: '1.2rem',
              color: '#38bdf8',
              letterSpacing: '0.08em',
              marginBottom: '1.5rem'
            }}>
              {confirmationModal.bookingReference}
            </div>

            <button
              onClick={() => {
                setConfirmationModal(null);
                setActiveTab('history');
              }}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                border: 'none',
                background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
                color: '#fff',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              View My Bookings
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bookings;
