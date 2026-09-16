import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { fetchDestinationsAPI } from '../services/api';
import { 
  Search, 
  MapPin, 
  Star, 
  Sparkles, 
  Calendar, 
  Coins, 
  Sun, 
  Building, 
  Compass, 
  X, 
  ArrowRight,
  CheckCircle
} from 'lucide-react';

const Explore = () => {
  const navigate = useNavigate();
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModalDest, setActiveModalDest] = useState(null);

  const categories = ['All', 'Beaches', 'Mountains', 'Heritage', 'Adventure'];

  useEffect(() => {
    loadDestinations();
  }, [selectedCategory]);

  const loadDestinations = async () => {
    setLoading(true);
    try {
      const data = await fetchDestinationsAPI(selectedCategory, searchQuery);
      setDestinations(data);
    } catch (err) {
      console.error('Error fetching destinations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadDestinations();
  };

  const handlePlanWithAI = (destName) => {
    navigate(`/assistant?prompt=${encodeURIComponent(`Plan a 5-day trip to ${destName} for 2 people under ₹40,000`)}`);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}>
      <Navbar />

      <main style={{ maxWidth: '1240px', margin: '0 auto', padding: '2.5rem 1.5rem', width: '100%', boxSizing: 'border-box' }}>
        {/* Header Title */}
        <div style={{ marginBottom: '2rem' }}>
          <span style={{ color: '#06b6d4', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Destination Catalog
          </span>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#f8fafc', margin: '4px 0 8px 0' }}>
            Explore Iconic Travel Escapes
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '1rem', margin: 0 }}>
            Discover top-rated destinations, local highlights, boutique accommodations, and launch personalized AI planning.
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          {/* Category Pills */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '20px',
                    border: isActive ? '1px solid #06b6d4' : '1px solid rgba(255, 255, 255, 0.08)',
                    background: isActive ? 'rgba(6, 182, 212, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                    color: isActive ? '#38bdf8' : '#cbd5e1',
                    fontSize: '0.86rem',
                    fontWeight: isActive ? 700 : 500,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '8px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '10px',
              padding: '8px 14px',
              width: '260px'
            }}>
              <Search size={16} color="#64748b" />
              <input
                type="text"
                placeholder="Search places or state..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#fff',
                  fontSize: '0.88rem',
                  outline: 'none',
                  width: '100%'
                }}
              />
            </div>
            <button
              type="submit"
              style={{
                padding: '8px 16px',
                borderRadius: '10px',
                border: 'none',
                background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
                color: '#fff',
                fontSize: '0.88rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Search
            </button>
          </form>
        </div>

        {/* Destinations Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: '#94a3b8' }}>
            <div className="spinner" style={{ margin: '0 auto 1rem auto' }}></div>
            <p>Loading curated destinations...</p>
          </div>
        ) : destinations.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: '#64748b' }}>
            <p>No destinations found matching your criteria.</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '1.75rem'
          }}>
            {destinations.map((dest) => (
              <div
                key={dest._id}
                style={{
                  background: 'rgba(15, 23, 42, 0.75)',
                  borderRadius: '18px',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.45)',
                  transition: 'transform 0.2s ease, border-color 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.borderColor = 'rgba(6, 182, 212, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                }}
              >
                <div style={{ position: 'relative', height: '210px' }}>
                  <img
                    src={dest.heroImage}
                    alt={dest.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    background: 'rgba(0, 0, 0, 0.7)',
                    backdropFilter: 'blur(8px)',
                    padding: '4px 10px',
                    borderRadius: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    color: '#fbbf24',
                    fontSize: '0.82rem',
                    fontWeight: 700
                  }}>
                    <Star size={13} fill="#fbbf24" />
                    <span>{dest.rating}</span>
                  </div>

                  <div style={{
                    position: 'absolute',
                    bottom: '12px',
                    left: '12px',
                    background: 'rgba(6, 182, 212, 0.9)',
                    padding: '3px 9px',
                    borderRadius: '6px',
                    color: '#ffffff',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    textTransform: 'uppercase'
                  }}>
                    {dest.category}
                  </div>
                </div>

                <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                    <h3 style={{ margin: 0, fontSize: '1.3rem', color: '#f8fafc', fontWeight: 700 }}>
                      {dest.name}
                    </h3>
                    <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                      {dest.state}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.85rem', color: '#38bdf8', margin: '0 0 8px 0', fontStyle: 'italic' }}>
                    "{dest.tagline}"
                  </p>

                  <p style={{
                    fontSize: '0.86rem',
                    color: '#94a3b8',
                    lineHeight: 1.45,
                    margin: '0 0 1rem 0',
                    flex: 1,
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {dest.description}
                  </p>

                  {/* Highlights pills */}
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '0.75rem', color: '#cbd5e1', background: 'rgba(255, 255, 255, 0.04)', padding: '2px 8px', borderRadius: '4px' }}>
                      🗓️ {dest.bestTimeToVisit}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#cbd5e1', background: 'rgba(255, 255, 255, 0.04)', padding: '2px 8px', borderRadius: '4px' }}>
                      💰 ~₹{dest.avgCostPerDay}/day
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div style={{
                    display: 'flex',
                    gap: '10px',
                    paddingTop: '1rem',
                    borderTop: '1px solid rgba(255, 255, 255, 0.08)'
                  }}>
                    <button
                      onClick={() => setActiveModalDest(dest)}
                      style={{
                        flex: 1,
                        padding: '9px 12px',
                        borderRadius: '8px',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        background: 'rgba(255, 255, 255, 0.04)',
                        color: '#cbd5e1',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      View Details
                    </button>

                    <button
                      onClick={() => handlePlanWithAI(dest.name)}
                      style={{
                        flex: 1.2,
                        padding: '9px 12px',
                        borderRadius: '8px',
                        border: 'none',
                        background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
                        color: '#ffffff',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '5px'
                      }}
                    >
                      <Sparkles size={14} />
                      <span>Plan with AI</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Destination Details Modal */}
      {activeModalDest && (
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
            maxWidth: '800px',
            width: '100%',
            maxHeight: '88vh',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)'
          }}>
            {/* Modal Image Header */}
            <div style={{ position: 'relative', height: '220px', flexShrink: 0 }}>
              <img
                src={activeModalDest.heroImage}
                alt={activeModalDest.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.2) 0%, rgba(11, 21, 40, 0.95) 100%)'
              }}></div>

              <button
                onClick={() => setActiveModalDest(null)}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: 'rgba(0, 0, 0, 0.6)',
                  border: 'none',
                  color: '#ffffff',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <X size={18} />
              </button>

              <div style={{ position: 'absolute', bottom: '16px', left: '20px' }}>
                <span style={{ fontSize: '0.8rem', color: '#06b6d4', fontWeight: 700, textTransform: 'uppercase' }}>
                  {activeModalDest.category} • {activeModalDest.state}
                </span>
                <h2 style={{ margin: '2px 0 0 0', fontSize: '1.8rem', color: '#ffffff', fontWeight: 800 }}>
                  {activeModalDest.name}
                </h2>
              </div>
            </div>

            {/* Modal Body */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <p style={{ margin: 0, color: '#cbd5e1', lineHeight: 1.6, fontSize: '0.94rem' }}>
                {activeModalDest.description}
              </p>

              {/* Popular Attractions */}
              <div>
                <h4 style={{ margin: '0 0 10px 0', fontSize: '1.05rem', color: '#f8fafc', fontWeight: 700 }}>
                  Top Sights & Attractions
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '8px' }}>
                  {activeModalDest.popularAttractions && activeModalDest.popularAttractions.map((att, i) => (
                    <div key={i} style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                      <div style={{ fontWeight: 600, color: '#e2e8f0', fontSize: '0.88rem' }}>{att.name}</div>
                      <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{att.category} • {att.typicalCost > 0 ? `₹${att.typicalCost}` : 'Free'}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hotels */}
              <div>
                <h4 style={{ margin: '0 0 10px 0', fontSize: '1.05rem', color: '#f8fafc', fontWeight: 700 }}>
                  Recommended Accommodations
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '8px' }}>
                  {activeModalDest.hotels && activeModalDest.hotels.map((h, i) => (
                    <div key={i} style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                      <div style={{ fontWeight: 600, color: '#e2e8f0', fontSize: '0.88rem' }}>{h.name} ({h.rating}★)</div>
                      <div style={{ fontSize: '0.78rem', color: '#38bdf8' }}>₹{h.pricePerNight} / night</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{
              padding: '1rem 1.5rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px'
            }}>
              <button
                onClick={() => setActiveModalDest(null)}
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
                onClick={() => {
                  const name = activeModalDest.name;
                  setActiveModalDest(null);
                  handlePlanWithAI(name);
                }}
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
                <Sparkles size={16} />
                <span>Plan this trip with AI</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Explore;
