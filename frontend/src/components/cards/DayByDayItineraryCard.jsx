import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Tag, Compass, Sparkles, AlertCircle, Sun, CloudRain } from 'lucide-react';

const DayByDayItineraryCard = ({ itinerary, onQuickModify }) => {
  if (!itinerary || itinerary.length === 0) return null;

  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const activeDay = itinerary[activeDayIndex] || itinerary[0];

  const getCategoryColor = (category) => {
    switch ((category || '').toLowerCase()) {
      case 'adventure': return '#f59e0b';
      case 'culture': return '#8b5cf6';
      case 'food': return '#ec4899';
      case 'relaxation': return '#10b981';
      default: return '#06b6d4';
    }
  };

  return (
    <div style={{
      background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.92) 0%, rgba(11, 21, 40, 0.96) 100%)',
      border: '1px solid rgba(59, 130, 246, 0.3)',
      borderRadius: '16px',
      padding: '1.25rem',
      marginBottom: '1rem',
      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            background: 'rgba(59, 130, 246, 0.15)',
            color: '#60a5fa',
            fontSize: '0.75rem',
            fontWeight: 700,
            padding: '2px 8px',
            borderRadius: '20px',
            textTransform: 'uppercase'
          }}>
            Day-by-Day Itinerary
          </span>
          <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
            {itinerary.length} Days Planned
          </span>
        </div>
      </div>

      {/* Day Selector Tabs */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        overflowX: 'auto',
        paddingBottom: '0.5rem',
        marginBottom: '1rem',
        scrollbarWidth: 'thin'
      }}>
        {itinerary.map((day, idx) => {
          const isSelected = idx === activeDayIndex;
          return (
            <button
              key={idx}
              onClick={() => setActiveDayIndex(idx)}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                border: isSelected ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.08)',
                background: isSelected ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                color: isSelected ? '#38bdf8' : '#94a3b8',
                fontWeight: isSelected ? 700 : 500,
                fontSize: '0.82rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease'
              }}
            >
              Day {day.dayNumber}
            </button>
          );
        })}
      </div>

      {/* Active Day Title & Theme Banner */}
      <div style={{
        background: 'rgba(59, 130, 246, 0.08)',
        borderLeft: '4px solid #3b82f6',
        padding: '10px 14px',
        borderRadius: '8px',
        marginBottom: '1.25rem'
      }}>
        <div style={{ fontSize: '0.75rem', color: '#93c5fd', textTransform: 'uppercase', fontWeight: 600 }}>
          Day {activeDay.dayNumber} Theme
        </div>
        <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc' }}>
          {activeDay.theme || activeDay.title}
        </div>
      </div>

      {/* Timeline of Activities */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {activeDay.activities && activeDay.activities.map((activity, actIdx) => {
          const catColor = getCategoryColor(activity.category);
          return (
            <div
              key={activity.id || actIdx}
              style={{
                display: 'flex',
                gap: '12px',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: '12px',
                padding: '12px',
                transition: 'transform 0.2s ease, border-color 0.2s ease'
              }}
            >
              {/* Time Column */}
              <div style={{
                minWidth: '75px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                paddingTop: '2px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#38bdf8', fontWeight: 600 }}>
                  <Clock size={12} />
                  <span>{activity.time || '10:00 AM'}</span>
                </div>
                <div style={{
                  width: '2px',
                  height: '100%',
                  minHeight: '25px',
                  background: 'rgba(56, 189, 248, 0.2)',
                  marginTop: '6px'
                }}></div>
              </div>

              {/* Activity Details */}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc' }}>
                      {activity.title}
                    </h4>
                    <span style={{
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      color: catColor,
                      background: `${catColor}1a`,
                      border: `1px solid ${catColor}40`,
                      padding: '1px 6px',
                      borderRadius: '4px',
                      textTransform: 'uppercase'
                    }}>
                      {activity.category}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      color: activity.estimatedCost > 0 ? '#10b981' : '#94a3b8'
                    }}>
                      {activity.estimatedCost > 0 ? `₹${activity.estimatedCost.toLocaleString('en-IN')}` : 'Free / Included'}
                    </span>
                  </div>
                </div>

                <p style={{ margin: '4px 0 6px 0', fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.4 }}>
                  {activity.description}
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: '#64748b' }}>
                  {activity.location && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={12} />
                      <span>{activity.location}</span>
                    </div>
                  )}

                  {/* Quick prompt modification button */}
                  {onQuickModify && (
                    <button
                      onClick={() => onQuickModify(`Remove "${activity.title}" on day ${activeDay.dayNumber}`)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#64748b',
                        fontSize: '0.72rem',
                        cursor: 'pointer',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        transition: 'color 0.2s'
                      }}
                      onMouseEnter={(e) => e.target.style.color = '#ef4444'}
                      onMouseLeave={(e) => e.target.style.color = '#64748b'}
                      title="Quick prompt to remove activity"
                    >
                      Remove Activity
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DayByDayItineraryCard;
