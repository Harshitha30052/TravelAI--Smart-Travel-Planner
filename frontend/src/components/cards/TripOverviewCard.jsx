import React from 'react';
import { MapPin, Calendar, Users, IndianRupee, Sparkles, Building } from 'lucide-react';

const TripOverviewCard = ({ trip }) => {
  if (!trip) return null;

  return (
    <div style={{
      background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.9) 0%, rgba(11, 21, 40, 0.95) 100%)',
      border: '1px solid rgba(6, 182, 212, 0.3)',
      borderRadius: '16px',
      padding: '1.25rem',
      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4), 0 0 15px rgba(6, 182, 212, 0.1)',
      marginBottom: '1rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Glow highlight */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '4px',
        background: 'linear-gradient(90deg, #06b6d4, #3b82f6, #10b981)'
      }}></div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{
              background: 'rgba(6, 182, 212, 0.15)',
              color: '#38bdf8',
              fontSize: '0.75rem',
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: '20px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              Trip Overview
            </span>
            <span style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              color: '#10b981',
              fontSize: '0.8rem',
              fontWeight: 600
            }}>
              <Sparkles size={13} /> AI Planned
            </span>
          </div>
          <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>
            {trip.title || `${trip.durationDays}-Day Trip to ${trip.destination}`}
          </h3>
        </div>

        <div style={{
          background: 'rgba(6, 182, 212, 0.1)',
          border: '1px solid rgba(6, 182, 212, 0.25)',
          padding: '6px 12px',
          borderRadius: '10px',
          textAlign: 'right'
        }}>
          <span style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block', textTransform: 'uppercase' }}>ML Estimated Budget</span>
          <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#38bdf8' }}>
            ₹{(trip.estimatedBudget || trip.budget || 0).toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* Meta Pills Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
        gap: '0.75rem',
        marginTop: '1rem',
        paddingTop: '0.85rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#cbd5e1', fontSize: '0.85rem' }}>
          <MapPin size={16} color="#06b6d4" />
          <span><strong>{trip.destination}</strong></span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#cbd5e1', fontSize: '0.85rem' }}>
          <Calendar size={16} color="#3b82f6" />
          <span>{trip.durationDays} Days</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#cbd5e1', fontSize: '0.85rem' }}>
          <Users size={16} color="#10b981" />
          <span>{trip.travelers} Traveler{trip.travelers > 1 ? 's' : ''}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#cbd5e1', fontSize: '0.85rem' }}>
          <Building size={16} color="#f59e0b" />
          <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
            {trip.hotel?.name || '3★ Resort'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TripOverviewCard;
