import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { AuthContext } from '../context/AuthContext';
import { fetchUserTripsAPI, deleteTripAPI, getTripPdfUrl } from '../services/api';
import DayByDayItineraryCard from '../components/cards/DayByDayItineraryCard';
import { 
  MapPin, 
  Calendar, 
  Users, 
  IndianRupee, 
  Download, 
  Trash2, 
  Edit, 
  Eye, 
  Sparkles, 
  PlusCircle,
  X,
  Compass
} from 'lucide-react';

const MyTrips = () => {
  const navigate = useNavigate();
  const { user, token } = useContext(AuthContext);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTripModal, setSelectedTripModal] = useState(null);

  useEffect(() => {
    loadTrips();
  }, [token]);

  const loadTrips = async () => {
    setLoading(true);
    try {
      const data = await fetchUserTripsAPI(token);
      setTrips(data);
    } catch (err) {
      console.error('Failed to load trips:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTrip = async (id) => {
    if (!window.confirm('Are you sure you want to delete this trip itinerary?')) return;
    try {
      await deleteTripAPI(id, token);
      setTrips(prev => prev.filter(t => t._id !== id));
    } catch (err) {
      alert('Failed to delete trip.');
    }
  };

  const handleContinuePlanning = (trip) => {
    // Navigate to assistant with a prompt referencing this trip
    navigate(`/assistant?prompt=${encodeURIComponent(`Continue planning my trip to ${trip.destination}`)}`);
  };

  const handleModifyTrip = (trip) => {
    navigate(`/assistant?prompt=${encodeURIComponent(`Modify my ${trip.durationDays}-day trip to ${trip.destination}`)}`);
  };

  const handleDownloadPDF = (tripId) => {
    window.open(getTripPdfUrl(tripId), '_blank');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}>
      <Navbar />

      <main style={{ maxWidth: '1240px', margin: '0 auto', padding: '2.5rem 1.5rem', width: '100%', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span style={{ color: '#06b6d4', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Travel Dashboard
            </span>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#f8fafc', margin: '4px 0 0 0' }}>
              My Saved Itineraries
            </h1>
          </div>

          <button
            onClick={() => navigate('/assistant')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              borderRadius: '10px',
              border: 'none',
              background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
              color: '#fff',
              fontSize: '0.9rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(6, 182, 212, 0.3)'
            }}
          >
            <Sparkles size={16} />
            <span>Plan New Trip with AI</span>
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: '#94a3b8' }}>
            <div className="spinner" style={{ margin: '0 auto 1rem auto' }}></div>
            <p>Loading your saved trips...</p>
          </div>
        ) : trips.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '4rem 2rem',
            background: 'rgba(15, 23, 42, 0.5)',
            border: '1px dashed rgba(255, 255, 255, 0.15)',
            borderRadius: '20px'
          }}>
            <Compass size={48} color="#06b6d4" style={{ margin: '0 auto 1rem auto' }} />
            <h3 style={{ fontSize: '1.4rem', color: '#f8fafc', margin: '0 0 8px 0' }}>
              No trips planned yet!
            </h3>
            <p style={{ color: '#94a3b8', maxWidth: '450px', margin: '0 auto 1.5rem auto' }}>
              Launch our AI assistant to plan your first weather-aware, ML-budgeted vacation in seconds.
            </p>
            <button
              onClick={() => navigate('/assistant?prompt=Plan%20a%205-day%20trip%20to%20Goa%20for%202%20people%20under%20%E2%82%B940%2C000')}
              style={{
                padding: '12px 24px',
                borderRadius: '10px',
                border: 'none',
                background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
                color: '#fff',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Plan a Trip to Goa Now
            </button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '1.5rem'
          }}>
            {trips.map((trip) => (
              <div
                key={trip._id}
                style={{
                  background: 'rgba(15, 23, 42, 0.8)',
                  borderRadius: '18px',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.4)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: '#06b6d4',
                      background: 'rgba(6, 182, 212, 0.15)',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      textTransform: 'uppercase'
                    }}>
                      {trip.destination}
                    </span>
                    <h3 style={{ margin: '6px 0 0 0', fontSize: '1.25rem', color: '#f8fafc', fontWeight: 700 }}>
                      {trip.title}
                    </h3>
                  </div>

                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: trip.status === 'confirmed' ? '#10b981' : '#f59e0b',
                    background: trip.status === 'confirmed' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                    border: `1px solid ${trip.status === 'confirmed' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)'}`,
                    padding: '3px 9px',
                    borderRadius: '20px',
                    textTransform: 'capitalize'
                  }}>
                    {trip.status || 'Planning'}
                  </span>
                </div>

                {/* Details Pills */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '8px',
                  background: 'rgba(255, 255, 255, 0.02)',
                  padding: '10px 12px',
                  borderRadius: '10px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: '#cbd5e1' }}>
                    <Calendar size={14} color="#38bdf8" />
                    <span>{trip.durationDays} Days</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: '#cbd5e1' }}>
                    <Users size={14} color="#3b82f6" />
                    <span>{trip.travelers} Persons</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: '#cbd5e1' }}>
                    <IndianRupee size={14} color="#10b981" />
                    <span>Target: ₹{(trip.budget || 0).toLocaleString('en-IN')}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: '#10b981', fontWeight: 700 }}>
                    <span>ML: ₹{(trip.estimatedBudget || trip.budget || 0).toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Card Action Buttons: [View] [Continue Planning] [Modify] [Download PDF] [Delete] */}
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '6px',
                  paddingTop: '0.75rem',
                  borderTop: '1px solid rgba(255, 255, 255, 0.06)'
                }}>
                  <button
                    onClick={() => setSelectedTripModal(trip)}
                    title="View Full Itinerary"
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px',
                      padding: '7px 10px',
                      borderRadius: '6px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      background: 'rgba(255, 255, 255, 0.03)',
                      color: '#cbd5e1',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    <Eye size={13} />
                    <span>View</span>
                  </button>

                  <button
                    onClick={() => handleContinuePlanning(trip)}
                    title="Continue Planning with AI"
                    style={{
                      flex: 1.2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px',
                      padding: '7px 10px',
                      borderRadius: '6px',
                      border: '1px solid rgba(6, 182, 212, 0.3)',
                      background: 'rgba(6, 182, 212, 0.1)',
                      color: '#38bdf8',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    <Sparkles size={13} />
                    <span>Continue</span>
                  </button>

                  <button
                    onClick={() => handleModifyTrip(trip)}
                    title="Modify with AI"
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px',
                      padding: '7px 10px',
                      borderRadius: '6px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      background: 'rgba(255, 255, 255, 0.03)',
                      color: '#cbd5e1',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    <Edit size={13} />
                    <span>Modify</span>
                  </button>

                  <button
                    onClick={() => handleDownloadPDF(trip._id)}
                    title="Download PDF"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '7px 10px',
                      borderRadius: '6px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
                      color: '#ffffff',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    <Download size={13} />
                  </button>

                  <button
                    onClick={() => handleDeleteTrip(trip._id)}
                    title="Delete Trip"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '7px 10px',
                      borderRadius: '6px',
                      border: '1px solid rgba(239, 68, 68, 0.2)',
                      background: 'rgba(239, 68, 68, 0.08)',
                      color: '#ef4444',
                      fontSize: '0.78rem',
                      cursor: 'pointer'
                    }}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal for viewing trip details */}
      {selectedTripModal && (
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
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '20px',
            maxWidth: '850px',
            width: '100%',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            <div style={{
              padding: '1.25rem 1.5rem',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.3rem', color: '#f8fafc' }}>
                  {selectedTripModal.title}
                </h3>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                  Estimated Cost: ₹{(selectedTripModal.estimatedBudget || selectedTripModal.budget).toLocaleString('en-IN')}
                </span>
              </div>
              <button
                onClick={() => setSelectedTripModal(null)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  padding: '6px'
                }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
              <DayByDayItineraryCard itinerary={selectedTripModal.itinerary} />
            </div>

            <div style={{
              padding: '1rem 1.5rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px'
            }}>
              <button
                onClick={() => setSelectedTripModal(null)}
                style={{
                  padding: '9px 16px',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: 'none',
                  color: '#cbd5e1',
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
              <button
                onClick={() => handleDownloadPDF(selectedTripModal._id)}
                style={{
                  padding: '9px 20px',
                  borderRadius: '8px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Download size={15} />
                <span>Download PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyTrips;
