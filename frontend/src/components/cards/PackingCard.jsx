import React, { useState } from 'react';
import { CheckSquare, Square, Briefcase, Sparkles, CheckCircle2 } from 'lucide-react';

const PackingCard = ({ packingList }) => {
  if (!packingList || packingList.length === 0) return null;

  // Track checked states locally for interactive packing
  const [checkedItems, setCheckedItems] = useState({});

  const toggleItem = (categoryIndex, itemIndex) => {
    const key = `${categoryIndex}-${itemIndex}`;
    setCheckedItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const totalItems = packingList.reduce((acc, cat) => acc + (cat.items?.length || 0), 0);
  const checkedCount = Object.values(checkedItems).filter(Boolean).length;

  return (
    <div style={{
      background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.9) 0%, rgba(13, 23, 38, 0.95) 100%)',
      border: '1px solid rgba(168, 85, 247, 0.25)',
      borderRadius: '16px',
      padding: '1.25rem',
      marginBottom: '1rem',
      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            background: 'rgba(168, 85, 247, 0.15)',
            color: '#c084fc',
            fontSize: '0.75rem',
            fontWeight: 700,
            padding: '2px 8px',
            borderRadius: '20px',
            textTransform: 'uppercase'
          }}>
            Smart Packing List
          </span>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Weather & Activity Aware</span>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          color: checkedCount === totalItems ? '#10b981' : '#cbd5e1',
          fontSize: '0.8rem',
          fontWeight: 600
        }}>
          <span>{checkedCount} / {totalItems} Packed</span>
        </div>
      </div>

      {/* Categorized Items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {packingList.map((category, catIdx) => (
          <div key={catIdx} style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '10px 12px', borderRadius: '10px' }}>
            <h5 style={{ margin: '0 0 8px 0', fontSize: '0.85rem', fontWeight: 700, color: '#e2e8f0', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {category.category}
            </h5>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '6px' }}>
              {category.items && category.items.map((item, itemIdx) => {
                const isChecked = !!checkedItems[`${catIdx}-${itemIdx}`];
                return (
                  <div
                    key={itemIdx}
                    onClick={() => toggleItem(catIdx, itemIdx)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '6px 8px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      background: isChecked ? 'rgba(16, 185, 129, 0.08)' : 'transparent',
                      transition: 'background 0.15s ease'
                    }}
                  >
                    {isChecked ? (
                      <CheckSquare size={16} color="#10b981" />
                    ) : (
                      <Square size={16} color="#64748b" />
                    )}
                    <span style={{
                      fontSize: '0.82rem',
                      color: isChecked ? '#94a3b8' : '#cbd5e1',
                      textDecoration: isChecked ? 'line-through' : 'none',
                      userSelect: 'none'
                    }}>
                      {item.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PackingCard;
