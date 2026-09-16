import React, { useState } from 'react';
import { Download, Edit3, Bookmark, Eye, Check, Loader2 } from 'lucide-react';
import { getTripPdfUrl, createTripAPI } from '../../services/api';

const ActionButtonsBar = ({ trip, tripId, onModifyClick, onViewItineraryClick }) => {
  const [downloading, setDownloading] = useState(false);
  const [saved, setSaved] = useState(false);

  const activeTripId = tripId || trip?._id;

  const handleDownloadPDF = async () => {
    if (!activeTripId) {
      alert('Please save the trip before downloading PDF.');
      return;
    }
    setDownloading(true);
    try {
      const url = getTripPdfUrl(activeTripId);
      // Trigger browser download
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Itinerary_${trip?.destination || 'Trip'}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('PDF download error:', err);
      alert('Failed to download PDF.');
    } finally {
      setDownloading(false);
    }
  };

  const handleSaveTrip = async () => {
    if (saved) return;
    try {
      const token = localStorage.getItem('token');
      if (trip && !trip._id) {
        await createTripAPI(trip, token);
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3500);
    } catch (err) {
      console.error('Save trip error:', err);
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: '0.6rem',
      marginTop: '0.75rem',
      marginBottom: '1rem',
      padding: '8px 0'
    }}>
      {/* View Full Itinerary */}
      <button
        onClick={onViewItineraryClick}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '8px 14px',
          borderRadius: '8px',
          border: '1px solid rgba(6, 182, 212, 0.4)',
          background: 'rgba(6, 182, 212, 0.1)',
          color: '#38bdf8',
          fontSize: '0.84rem',
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'all 0.2s ease'
        }}
      >
        <Eye size={15} />
        <span>View Full Itinerary</span>
      </button>

      {/* Modify Trip */}
      <button
        onClick={onModifyClick}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '8px 14px',
          borderRadius: '8px',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          background: 'rgba(255, 255, 255, 0.05)',
          color: '#e2e8f0',
          fontSize: '0.84rem',
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'all 0.2s ease'
        }}
      >
        <Edit3 size={15} />
        <span>Modify Trip</span>
      </button>

      {/* Download PDF */}
      <button
        onClick={handleDownloadPDF}
        disabled={downloading}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '8px 16px',
          borderRadius: '8px',
          border: 'none',
          background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
          color: '#ffffff',
          fontSize: '0.84rem',
          fontWeight: 700,
          cursor: downloading ? 'wait' : 'pointer',
          boxShadow: '0 4px 15px rgba(6, 182, 212, 0.3)',
          transition: 'all 0.2s ease'
        }}
      >
        {downloading ? <Loader2 size={15} className="animate-spin" /> : <Download size={15} />}
        <span>{downloading ? 'Generating PDF...' : 'Download PDF'}</span>
      </button>

      {/* Save Trip */}
      <button
        onClick={handleSaveTrip}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '8px 14px',
          borderRadius: '8px',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          background: saved ? 'rgba(16, 185, 129, 0.25)' : 'rgba(16, 185, 129, 0.1)',
          color: '#10b981',
          fontSize: '0.84rem',
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'all 0.2s ease'
        }}
      >
        {saved ? <Check size={15} /> : <Bookmark size={15} />}
        <span>{saved ? 'Saved to My Trips!' : 'Save Trip'}</span>
      </button>
    </div>
  );
};

export default ActionButtonsBar;
