import React from 'react';
import { Sun, CloudRain, Cloud, CloudSun, Wind, Droplets, CheckCircle2, AlertTriangle } from 'lucide-react';

const WeatherCard = ({ weather }) => {
  if (!weather) return null;

  const temp = typeof weather.temp === 'string' ? weather.temp : `${weather.temp}°C`;
  const condition = weather.condition || 'Pleasant';
  const rainChance = weather.rainChance || '10%';
  const humidity = weather.humidity || '60%';

  const getWeatherIcon = () => {
    const c = condition.toLowerCase();
    if (c.includes('rain') || c.includes('shower')) return <CloudRain size={28} color="#38bdf8" />;
    if (c.includes('cloud') && c.includes('sun')) return <CloudSun size={28} color="#f59e0b" />;
    if (c.includes('cloud')) return <Cloud size={28} color="#94a3b8" />;
    return <Sun size={28} color="#f59e0b" />;
  };

  return (
    <div style={{
      background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.85) 0%, rgba(14, 28, 48, 0.9) 100%)',
      border: '1px solid rgba(56, 189, 248, 0.25)',
      borderRadius: '16px',
      padding: '1.1rem',
      marginBottom: '1rem',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.35)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            background: 'rgba(56, 189, 248, 0.15)',
            color: '#38bdf8',
            fontSize: '0.75rem',
            fontWeight: 700,
            padding: '2px 8px',
            borderRadius: '20px',
            textTransform: 'uppercase'
          }}>
            Weather Intelligence
          </span>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          color: '#10b981',
          fontSize: '0.75rem',
          fontWeight: 600
        }}>
          <CheckCircle2 size={13} />
          <span>Itinerary Weather-Aligned</span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '15px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '10px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {getWeatherIcon()}
          </div>
          <div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f8fafc', lineHeight: 1.1 }}>
              {temp}
            </div>
            <div style={{ fontSize: '0.85rem', color: '#94a3b8', textTransform: 'capitalize' }}>
              {condition}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1.2rem', background: 'rgba(255, 255, 255, 0.03)', padding: '8px 14px', borderRadius: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#cbd5e1' }}>
            <CloudRain size={15} color="#38bdf8" />
            <span>Rain: <strong>{rainChance}</strong></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#cbd5e1' }}>
            <Droplets size={15} color="#06b6d4" />
            <span>Humidity: <strong>{humidity}</strong></span>
          </div>
        </div>
      </div>

      {weather.advice && (
        <div style={{
          marginTop: '0.85rem',
          padding: '8px 12px',
          background: 'rgba(6, 182, 212, 0.08)',
          borderLeft: '3px solid #06b6d4',
          borderRadius: '4px',
          fontSize: '0.8rem',
          color: '#e2e8f0'
        }}>
          💡 <em>{weather.advice}</em>
        </div>
      )}
    </div>
  );
};

export default WeatherCard;
