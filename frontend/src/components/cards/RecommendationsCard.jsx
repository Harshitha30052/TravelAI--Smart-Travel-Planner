import React from 'react';
import { MapPin, Star, Sparkles, ArrowRight } from 'lucide-react';

const RecommendationsCard = ({ recommendations, onSelectDestination }) => {
  if (!recommendations || recommendations.length === 0) return null;

  return (
    <div style={{
      marginTop: '1rem',
      marginBottom: '1rem',
      width: '100%'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '0.85rem'
      }}>
        <Sparkles size={16} color="#06b6d4" />
        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Personalized Recommendations
        </span>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1rem'
      }}>
        {recommendations.map((dest) => (
          <div
            key={dest.id || dest._id || dest.name}
            style={{
              background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.9) 0%, rgba(11, 21, 40, 0.95) 100%)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '14px',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.35)',
              transition: 'transform 0.2s ease, border-color 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.borderColor = 'rgba(6, 182, 212, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            }}
          >
            {/* Image Header */}
            <div style={{ position: 'relative', height: '120px', width: '100%', overflow: 'hidden' }}>
              <img
                src={dest.image || 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600'}
                alt={dest.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600';
                }}
              />
              <div style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                background: 'rgba(0, 0, 0, 0.65)',
                backdropFilter: 'blur(4px)',
                padding: '3px 8px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                color: '#facc15',
                fontSize: '0.75rem',
                fontWeight: 700
              }}>
                <Star size={12} fill="#facc15" color="#facc15" />
                <span>{dest.rating || 4.7}</span>
              </div>

              {dest.category && (
                <div style={{
                  position: 'absolute',
                  bottom: '8px',
                  left: '8px',
                  background: 'rgba(6, 182, 212, 0.85)',
                  backdropFilter: 'blur(4px)',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  color: '#ffffff',
                  fontSize: '0.72rem',
                  fontWeight: 600
                }}>
                  {dest.category}
                </div>
              )}
            </div>

            {/* Content Body */}
            <div style={{ padding: '0.85rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc' }}>
                  {dest.name}
                </h4>
                {dest.state && (
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                    {dest.state}
                  </span>
                )}
              </div>

              <p style={{
                fontSize: '0.8rem',
                color: '#94a3b8',
                margin: '4px 0 8px 0',
                lineHeight: 1.4,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}>
                {dest.description || dest.title}
              </p>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '6px',
                borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                marginTop: 'auto',
                fontSize: '0.78rem'
              }}>
                <span style={{ color: '#cbd5e1' }}>
                  Avg: <strong style={{ color: '#10b981' }}>₹{dest.avgBudgetPerDay?.toLocaleString('en-IN') || '4,000'}/day</strong>
                </span>

                <button
                  onClick={() => onSelectDestination && onSelectDestination(`Plan a 5-day trip to ${dest.name} for 2 people`)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
                    border: 'none',
                    color: '#fff',
                    borderRadius: '8px',
                    padding: '5px 10px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(6, 182, 212, 0.3)'
                  }}
                >
                  <span>Plan</span>
                  <ArrowRight size={12} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendationsCard;
