import React, { useContext, useState } from 'react';
import Navbar from '../components/Navbar';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Calendar, 
  MapPin, 
  Compass, 
  Sliders, 
  Sparkles, 
  LogOut,
  Award,
  Check
} from 'lucide-react';

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [travelStyle, setTravelStyle] = useState('Moderate');
  const [foodPreference, setFoodPreference] = useState('Non-Veg');
  const [pace, setPace] = useState('Balanced');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSavePreferences = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}>
      <Navbar />

      <main style={{ maxWidth: '1080px', margin: '0 auto', padding: '2.5rem 1.5rem', width: '100%', boxSizing: 'border-box' }}>
        <div style={{ marginBottom: '2rem' }}>
          <span style={{ color: '#06b6d4', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Account & Settings
          </span>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#f8fafc', margin: '4px 0 0 0' }}>
            Traveler Profile
          </h1>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {/* User Card */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '20px',
            padding: '1.75rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.4)'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #06b6d4, #6366f1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              fontWeight: 800,
              color: '#ffffff',
              boxShadow: '0 0 25px rgba(6, 182, 212, 0.4)',
              marginBottom: '1rem'
            }}>
              {user ? user.name.charAt(0).toUpperCase() : 'E'}
            </div>

            <h2 style={{ fontSize: '1.4rem', color: '#f8fafc', margin: '0 0 4px 0', fontWeight: 700 }}>
              {user ? user.name : 'Explorer Guest'}
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: '0 0 1.5rem 0' }}>
              {user ? user.email : 'guest@travelai.com'}
            </p>

            {/* Travel Stats Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '10px',
              width: '100%',
              background: 'rgba(255, 255, 255, 0.03)',
              padding: '14px',
              borderRadius: '12px',
              marginBottom: '1.5rem'
            }}>
              <div>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#38bdf8' }}>5</div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Trips Planned</div>
              </div>
              <div>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#10b981' }}>12</div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Places Saved</div>
              </div>
              <div>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f59e0b' }}>3</div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Bookings</div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                background: 'rgba(239, 68, 68, 0.1)',
                color: '#ef4444',
                fontWeight: 600,
                fontSize: '0.88rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <LogOut size={16} />
              <span>Log Out</span>
            </button>
          </div>

          {/* AI Travel Preferences Form */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '20px',
            padding: '1.75rem',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.4)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
              <Sliders size={20} color="#06b6d4" />
              <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#f8fafc', fontWeight: 700 }}>
                AI Recommendation Tuning
              </h3>
            </div>

            <form onSubmit={handleSavePreferences} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '6px', fontWeight: 600 }}>
                  Travel Style
                </label>
                <select
                  value={travelStyle}
                  onChange={(e) => setTravelStyle(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    color: '#fff',
                    outline: 'none'
                  }}
                >
                  <option value="Budget" style={{ background: '#0b1528' }}>Budget (Backpacker, Hostels, Public Transit)</option>
                  <option value="Moderate" style={{ background: '#0b1528' }}>Moderate (3-Star Hotels, Balanced Comfort)</option>
                  <option value="Luxury" style={{ background: '#0b1528' }}>Luxury (5-Star Resorts, Private Chauffeurs)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '6px', fontWeight: 600 }}>
                  Dietary / Food Preference
                </label>
                <select
                  value={foodPreference}
                  onChange={(e) => setFoodPreference(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    color: '#fff',
                    outline: 'none'
                  }}
                >
                  <option value="Vegetarian" style={{ background: '#0b1528' }}>Pure Vegetarian</option>
                  <option value="Non-Veg" style={{ background: '#0b1528' }}>Non-Vegetarian & Seafood</option>
                  <option value="Street Food" style={{ background: '#0b1528' }}>Local Street Gastronomy</option>
                  <option value="Fine Dining" style={{ background: '#0b1528' }}>Fine Dining & Michelin Experience</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '6px', fontWeight: 600 }}>
                  Itinerary Pace
                </label>
                <select
                  value={pace}
                  onChange={(e) => setPace(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    color: '#fff',
                    outline: 'none'
                  }}
                >
                  <option value="Relaxed" style={{ background: '#0b1528' }}>Relaxed (1-2 sights daily, late mornings)</option>
                  <option value="Balanced" style={{ background: '#0b1528' }}>Balanced (3-4 sights daily, comfortable pace)</option>
                  <option value="Fast" style={{ background: '#0b1528' }}>Action-Packed (Cover maximum sights daily)</option>
                </select>
              </div>

              <button
                type="submit"
                style={{
                  marginTop: '0.5rem',
                  padding: '12px',
                  borderRadius: '10px',
                  border: 'none',
                  background: savedSuccess ? '#10b981' : 'linear-gradient(135deg, #06b6d4, #3b82f6)',
                  color: '#fff',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  transition: 'background 0.2s'
                }}
              >
                {savedSuccess ? <Check size={18} /> : <Sparkles size={18} />}
                <span>{savedSuccess ? 'Preferences Saved!' : 'Save Travel Preferences'}</span>
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
