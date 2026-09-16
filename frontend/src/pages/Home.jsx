import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { fetchDestinationsAPI } from '../services/api';
import { 
  Sparkles, 
  Search, 
  MapPin, 
  ArrowRight, 
  CloudSun, 
  TrendingUp, 
  ShieldCheck, 
  Coins, 
  Bot, 
  Calendar, 
  FileText,
  Compass,
  Star,
  CheckCircle2
} from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const [promptInput, setPromptInput] = useState('');
  const [destinations, setDestinations] = useState([]);
  const [loadingDestinations, setLoadingDestinations] = useState(true);

  useEffect(() => {
    const loadDestinations = async () => {
      try {
        const list = await fetchDestinationsAPI();
        setDestinations(list);
      } catch (err) {
        console.error('Failed to load destinations:', err);
      } finally {
        setLoadingDestinations(false);
      }
    };
    loadDestinations();
  }, []);

  const handlePlanTrip = (customPrompt = null) => {
    const promptToUse = customPrompt || promptInput.trim() || 'Plan a 5-day trip to Goa for 2 people under ₹40,000';
    navigate(`/assistant?prompt=${encodeURIComponent(promptToUse)}`);
  };

  const samplePrompts = [
    'Plan a 5-day trip to Goa for 2 people under ₹40,000',
    '6-day Manali snow & adventure tour for ₹35,000',
    'Romantic 4-day Kerala backwaters getaway for couples',
    '3-day royal heritage & palace trip to Jaipur under ₹25,000'
  ];

  const features = [
    {
      icon: <Bot size={28} color="#06b6d4" />,
      title: 'Conversational Travel Agent',
      desc: 'Plan, modify, and optimize your trip entirely through intuitive natural language dialogue with contextual chat memory.'
    },
    {
      icon: <Coins size={28} color="#10b981" />,
      title: 'ML Budget Regressor',
      desc: 'Trained Random Forest Machine Learning model accurately estimates flight, stay, and daily travel expenses.'
    },
    {
      icon: <CloudSun size={28} color="#3b82f6" />,
      title: 'Weather-Aware Itineraries',
      desc: 'Live meteorological intelligence prioritizes indoor cultural sights during rain and outdoor beaches when sunny.'
    },
    {
      icon: <FileText size={28} color="#a855f7" />,
      title: '1-Click PDF Export',
      desc: 'Download high-definition, beautifully styled PDF travel vouchers complete with packing checklists and schedules.'
    }
  ];

  const steps = [
    { step: '01', title: 'Describe Your Dream Trip', desc: 'Tell the assistant your destination, duration, budget, and travel companions in plain words.' },
    { step: '02', title: 'AI Orchestrates Tools', desc: 'Our AI agent invokes Weather, Travel, and Trip MCP servers to synthesize live options.' },
    { step: '03', title: 'ML Budget & Weather Align', desc: 'Random Forest model predicts expenses while meteorological data optimizes daily timing.' },
    { step: '04', title: 'Modify, Save & Download', desc: 'Swap activities, adapt constraints on the fly, and download your travel PDF itinerary.' }
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}>
      <Navbar />

      {/* Hero Section */}
      <section style={{
        position: 'relative',
        padding: '5rem 1.5rem 4rem 1.5rem',
        textAlign: 'center',
        overflow: 'hidden',
        background: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(6, 182, 212, 0.25), rgba(3, 7, 18, 0))'
      }}>
        {/* Subtle Ambient Glows */}
        <div style={{
          position: 'absolute',
          top: '10%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '600px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)',
          filter: 'blur(80px)',
          zIndex: 0,
          pointerEvents: 'none'
        }}></div>

        <div style={{ maxWidth: '960px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(6, 182, 212, 0.12)',
            border: '1px solid rgba(6, 182, 212, 0.3)',
            padding: '6px 16px',
            borderRadius: '30px',
            color: '#38bdf8',
            fontSize: '0.85rem',
            fontWeight: 600,
            marginBottom: '1.5rem'
          }}>
            <Sparkles size={16} />
            <span>Next-Generation AI Travel Orchestration</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(2.5rem, 5.5vw, 4.2rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            color: '#ffffff',
            letterSpacing: '-0.03em',
            marginBottom: '1.25rem'
          }}>
            Plan Your Perfect Trip <br />
            <span style={{
              background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 50%, #818cf8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              With Conversational AI
            </span>
          </h1>

          <p style={{
            fontSize: 'clamp(1.05rem, 2vw, 1.25rem)',
            color: '#94a3b8',
            maxWidth: '680px',
            margin: '0 auto 2.5rem auto',
            lineHeight: 1.6
          }}>
            Experience intelligent travel planning powered by Model Context Protocol (MCP), live weather forecasts, machine learning budget prediction, and instant PDF itineraries.
          </p>

          {/* Large Conversational Input Bar */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.85)',
            border: '1px solid rgba(6, 182, 212, 0.4)',
            borderRadius: '20px',
            padding: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            maxWidth: '780px',
            margin: '0 auto',
            boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.6), 0 0 25px rgba(6, 182, 212, 0.25)',
            backdropFilter: 'blur(12px)'
          }}>
            <div style={{ paddingLeft: '14px', display: 'flex', alignItems: 'center' }}>
              <Compass size={22} color="#06b6d4" />
            </div>

            <input
              type="text"
              placeholder="Plan a 5-day trip to Goa for 2 people under ₹40,000"
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handlePlanTrip()}
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                color: '#ffffff',
                fontSize: '1.05rem',
                padding: '12px 6px',
                outline: 'none'
              }}
            />

            <button
              onClick={() => handlePlanTrip()}
              style={{
                background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
                border: 'none',
                color: '#ffffff',
                padding: '14px 26px',
                borderRadius: '14px',
                fontSize: '1rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                whiteSpace: 'nowrap',
                boxShadow: '0 4px 15px rgba(6, 182, 212, 0.4)',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <Sparkles size={18} />
              <span>✨ Plan My Trip</span>
            </button>
          </div>

          {/* Quick Prompt Pills */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '8px',
            marginTop: '1.25rem'
          }}>
            <span style={{ fontSize: '0.8rem', color: '#64748b', alignSelf: 'center' }}>Popular queries:</span>
            {samplePrompts.map((p, i) => (
              <button
                key={i}
                onClick={() => handlePlanTrip(p)}
                style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  color: '#cbd5e1',
                  padding: '5px 12px',
                  borderRadius: '20px',
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(6, 182, 212, 0.15)';
                  e.target.style.borderColor = 'rgba(6, 182, 212, 0.4)';
                  e.target.style.color = '#38bdf8';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.04)';
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                  e.target.style.color = '#cbd5e1';
                }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured / Popular Destinations Section */}
      <section style={{ padding: '4rem 1.5rem', maxWidth: '1240px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span style={{ color: '#06b6d4', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Handpicked Destinations
            </span>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#f8fafc', margin: '4px 0 0 0' }}>
              Explore Trending Travel Spots
            </h2>
          </div>

          <button
            onClick={() => navigate('/explore')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'transparent',
              border: 'none',
              color: '#38bdf8',
              fontSize: '0.92rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <span>View All Destinations</span>
            <ArrowRight size={16} />
          </button>
        </div>

        {/* Destination Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem'
        }}>
          {destinations.slice(0, 4).map((dest) => (
            <div
              key={dest._id}
              style={{
                background: 'rgba(15, 23, 42, 0.7)',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.4)',
                transition: 'transform 0.25s ease, border-color 0.25s ease'
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
              <div style={{ position: 'relative', height: '180px', overflow: 'hidden' }}>
                <img
                  src={dest.heroImage}
                  alt={dest.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  background: 'rgba(0, 0, 0, 0.65)',
                  backdropFilter: 'blur(6px)',
                  padding: '4px 10px',
                  borderRadius: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  color: '#fbbf24',
                  fontSize: '0.8rem',
                  fontWeight: 700
                }}>
                  <Star size={13} fill="#fbbf24" />
                  <span>{dest.rating}</span>
                </div>
                <div style={{
                  position: 'absolute',
                  bottom: '12px',
                  left: '12px',
                  background: 'rgba(6, 182, 212, 0.85)',
                  padding: '3px 8px',
                  borderRadius: '6px',
                  color: '#ffffff',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  textTransform: 'uppercase'
                }}>
                  {dest.category}
                </div>
              </div>

              <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ margin: '0 0 6px 0', fontSize: '1.2rem', color: '#f8fafc' }}>
                  {dest.name}
                </h3>
                <p style={{
                  fontSize: '0.85rem',
                  color: '#94a3b8',
                  lineHeight: 1.4,
                  margin: '0 0 1rem 0',
                  flex: 1,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {dest.description}
                </p>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: '0.85rem',
                  borderTop: '1px solid rgba(255, 255, 255, 0.08)'
                }}>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block' }}>Avg. Cost</span>
                    <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#38bdf8' }}>
                      ₹{dest.avgCostPerDay} / day
                    </span>
                  </div>

                  <button
                    onClick={() => handlePlanTrip(`Plan a 5-day trip to ${dest.name} for 2 people under ₹40,000`)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '8px 14px',
                      borderRadius: '8px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
                      color: '#fff',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      cursor: 'pointer'
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
      </section>

      {/* Features of Smart Travel AI Section */}
      <section style={{
        padding: '4rem 1.5rem',
        background: 'rgba(11, 21, 40, 0.5)',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
      }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span style={{ color: '#06b6d4', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Intelligent Core Capabilities
            </span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#f8fafc', margin: '6px 0 0 0' }}>
              Why Smart Travel AI Outperforms Traditional Portals
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
            {features.map((feat, idx) => (
              <div
                key={idx}
                style={{
                  background: 'rgba(15, 23, 42, 0.7)',
                  borderRadius: '16px',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  padding: '1.75rem',
                  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)'
                }}
              >
                <div style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  width: '54px',
                  height: '54px',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem'
                }}>
                  {feat.icon}
                </div>
                <h3 style={{ fontSize: '1.15rem', color: '#f8fafc', margin: '0 0 8px 0', fontWeight: 700 }}>
                  {feat.title}
                </h3>
                <p style={{ fontSize: '0.88rem', color: '#94a3b8', lineHeight: 1.5, margin: 0 }}>
                  {feat.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Timeline Section */}
      <section style={{ padding: '4.5rem 1.5rem', maxWidth: '1240px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span style={{ color: '#06b6d4', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Seamless 4-Step Workflow
          </span>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#f8fafc', margin: '6px 0 0 0' }}>
            How Smart Travel AI Builds Your Trip
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
          {steps.map((st, idx) => (
            <div
              key={idx}
              style={{
                position: 'relative',
                background: 'rgba(15, 23, 42, 0.5)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: '16px',
                padding: '1.5rem',
                overflow: 'hidden'
              }}
            >
              <div style={{
                fontSize: '3rem',
                fontWeight: 900,
                color: 'rgba(6, 182, 212, 0.12)',
                position: 'absolute',
                top: '10px',
                right: '16px',
                lineHeight: 1
              }}>
                {st.step}
              </div>
              <h3 style={{ fontSize: '1.1rem', color: '#38bdf8', margin: '0 0 10px 0', fontWeight: 700 }}>
                {st.title}
              </h3>
              <p style={{ fontSize: '0.86rem', color: '#94a3b8', lineHeight: 1.5, margin: 0 }}>
                {st.desc}
              </p>
            </div>
          ))}
        </div>

        {/* CTA Card Banner */}
        <div style={{
          marginTop: '4rem',
          background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.15) 0%, rgba(59, 130, 246, 0.2) 100%)',
          border: '1px solid rgba(6, 182, 212, 0.35)',
          borderRadius: '24px',
          padding: '2.5rem 2rem',
          textAlign: 'center',
          boxShadow: '0 15px 35px rgba(6, 182, 212, 0.15)'
        }}>
          <h2 style={{ fontSize: '1.9rem', fontWeight: 800, color: '#f8fafc', margin: '0 0 8px 0' }}>
            Ready to plan your next vacation in under 60 seconds?
          </h2>
          <p style={{ color: '#cbd5e1', fontSize: '1rem', maxWidth: '600px', margin: '0 auto 1.5rem auto' }}>
            Let our AI assistant manage itineraries, hotel choices, weather risks, and budget estimations.
          </p>
          <button
            onClick={() => handlePlanTrip()}
            style={{
              background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
              border: 'none',
              color: '#ffffff',
              padding: '14px 30px',
              borderRadius: '12px',
              fontSize: '1rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 18px rgba(6, 182, 212, 0.4)'
            }}
          >
            <Sparkles size={18} />
            <span>Launch AI Travel Assistant</span>
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        marginTop: 'auto',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '2rem 1.5rem',
        textAlign: 'center',
        color: '#64748b',
        fontSize: '0.85rem'
      }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#cbd5e1', fontWeight: 600 }}>
            <Compass size={18} color="#06b6d4" />
            <span>Smart Travel AI Platform</span>
          </div>
          <div>
            Built with Model Context Protocol (MCP), Google Gemini AI, Random Forest ML, and React.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
