import React from 'react';
import { IndianRupee, PieChart, TrendingDown, CheckCircle2, Plane, Home, Utensils, Compass, Shield } from 'lucide-react';

const BudgetCard = ({ budget }) => {
  if (!budget) return null;

  const target = budget.target || 40000;
  const estimated = budget.estimated || 35000;
  const breakdown = budget.breakdown || {};
  const isWithinBudget = estimated <= target;

  const percentage = Math.min(Math.round((estimated / target) * 100), 120);

  const breakdownItems = [
    { label: 'Transport & Flights', amount: breakdown.transport || Math.round(estimated * 0.32), icon: <Plane size={14} color="#38bdf8" /> },
    { label: 'Hotel & Stays', amount: breakdown.accommodation || Math.round(estimated * 0.38), icon: <Home size={14} color="#818cf8" /> },
    { label: 'Dining & Food', amount: breakdown.food_and_dining || Math.round(estimated * 0.15), icon: <Utensils size={14} color="#f59e0b" /> },
    { label: 'Activities & Sightseeing', amount: breakdown.activities || Math.round(estimated * 0.10), icon: <Compass size={14} color="#10b981" /> },
    { label: 'Local Transit & Misc', amount: breakdown.contingency_and_local || Math.round(estimated * 0.05), icon: <Shield size={14} color="#ec4899" /> }
  ];

  return (
    <div style={{
      background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.9) 0%, rgba(13, 27, 42, 0.95) 100%)',
      border: '1px solid rgba(16, 185, 129, 0.3)',
      borderRadius: '16px',
      padding: '1.25rem',
      marginBottom: '1rem',
      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            background: 'rgba(16, 185, 129, 0.15)',
            color: '#10b981',
            fontSize: '0.75rem',
            fontWeight: 700,
            padding: '2px 8px',
            borderRadius: '20px',
            textTransform: 'uppercase'
          }}>
            ML Budget Prediction
          </span>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Random Forest Regression</span>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          color: isWithinBudget ? '#10b981' : '#f59e0b',
          fontSize: '0.8rem',
          fontWeight: 600
        }}>
          {isWithinBudget ? <CheckCircle2 size={14} /> : <TrendingDown size={14} />}
          <span>{isWithinBudget ? 'Within Target' : 'Slight Variance'}</span>
        </div>
      </div>

      {/* Target vs Prediction Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        background: 'rgba(255, 255, 255, 0.03)',
        padding: '10px 14px',
        borderRadius: '12px',
        marginBottom: '1rem'
      }}>
        <div>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block' }}>Target Budget</span>
          <span style={{ fontSize: '1.1rem', fontWeight: 600, color: '#e2e8f0' }}>
            ₹{target.toLocaleString('en-IN')}
          </span>
        </div>

        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block' }}>ML Estimated Cost</span>
          <span style={{ fontSize: '1.45rem', fontWeight: 800, color: isWithinBudget ? '#10b981' : '#f59e0b' }}>
            ₹{estimated.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{ marginBottom: '1.1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '5px' }}>
          <span>Budget Utilization</span>
          <span><strong>{percentage}%</strong> of target</span>
        </div>
        <div style={{
          width: '100%',
          height: '8px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '4px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${Math.min(percentage, 100)}%`,
            height: '100%',
            background: isWithinBudget 
              ? 'linear-gradient(90deg, #06b6d4, #10b981)' 
              : 'linear-gradient(90deg, #f59e0b, #ef4444)',
            borderRadius: '4px',
            transition: 'width 0.6s ease'
          }}></div>
        </div>
      </div>

      {/* Itemized Categories */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '0.6rem',
        background: 'rgba(0, 0, 0, 0.2)',
        padding: '10px',
        borderRadius: '10px'
      }}>
        {breakdownItems.map((item, idx) => (
          <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', padding: '4px 6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#cbd5e1' }}>
              {item.icon}
              <span>{item.label}</span>
            </div>
            <span style={{ fontWeight: 700, color: '#f8fafc' }}>
              ₹{(item.amount || 0).toLocaleString('en-IN')}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BudgetCard;
