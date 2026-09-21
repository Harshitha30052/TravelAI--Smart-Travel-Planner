import React, { useState, useEffect, useRef, useContext } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { sendAIChatAPI, getTripPdfUrl } from '../services/api';
import Navbar from '../components/Navbar';
import TripOverviewCard from '../components/cards/TripOverviewCard';
import WeatherCard from '../components/cards/WeatherCard';
import BudgetCard from '../components/cards/BudgetCard';
import DayByDayItineraryCard from '../components/cards/DayByDayItineraryCard';
import PackingCard from '../components/cards/PackingCard';
import ActionButtonsBar from '../components/cards/ActionButtonsBar';
import RecommendationsCard from '../components/cards/RecommendationsCard';
import { 
  Send, 
  Sparkles, 
  Compass, 
  MapPin, 
  Calendar, 
  Users, 
  Download, 
  Info,
  ChevronRight,
  Bot,
  User as UserIcon,
  X
} from 'lucide-react';

const AIAssistant = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, token } = useContext(AuthContext);

  const [sessionId] = useState(() => 'sess-' + Math.random().toString(36).substring(2, 9));
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I am your **Smart Travel AI Assistant**. I can plan complete itineraries, predict budgets with machine learning, align activities with live weather forecasts, and adaptively modify your trip in real time.\n\nTry asking me: *"Plan a 5-day Goa trip for 2 people under ₹40,000"*',
      richData: null
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentTrip, setCurrentTrip] = useState(null);
  const [fullItineraryModal, setFullItineraryModal] = useState(false);

  const messagesEndRef = useRef(null);

  const quickPills = [
    'Recommend destinations for me',
    'Plan a 5-day Goa trip for 2 people under ₹40,000',
    'Remove the museum on day 2.',
    'Replace it with an adventure activity under ₹1,500.',
    'Now keep the entire trip below ₹35,000.',
    'Give me the final plan.',
    'Download it.'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Handle URL query prompt if passed from Home or Explore page
  useEffect(() => {
    const promptQuery = searchParams.get('prompt');
    if (promptQuery && messages.length === 1) {
      sendMessage(promptQuery);
    }
  }, [searchParams]);

  const sendMessage = async (textToSend) => {
    const text = (textToSend || inputValue).trim();
    if (!text || loading) return;

    setInputValue('');
    // Append user message immediately
    const userMsg = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const response = await sendAIChatAPI({
        sessionId,
        message: text,
        token
      });

      if (response && response.success) {
        setMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            content: response.reply,
            richData: response.richData
          }
        ]);

        if (response.tripState) {
          setCurrentTrip(response.tripState);
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: "I'm having trouble connecting right now, but I can still assist you with general trip planning. Please retry your request.",
          richData: null
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleQuickPill = (pillText) => {
    sendMessage(pillText);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}>
      <Navbar />

      <div style={{
        flex: 1,
        display: 'flex',
        maxWidth: '1380px',
        width: '100%',
        margin: '0 auto',
        padding: '1.25rem',
        gap: '1.25rem',
        boxSizing: 'border-box'
      }}>
        {/* Main Chat Stream Container */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          background: 'rgba(15, 23, 42, 0.65)',
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.5)',
          overflow: 'hidden',
          minHeight: '78vh'
        }}>
          {/* Chat Header */}
          <div style={{
            padding: '1rem 1.5rem',
            background: 'rgba(11, 21, 40, 0.85)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 15px rgba(6, 182, 212, 0.4)'
              }}>
                <Bot size={20} color="#fff" />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc' }}>
                  TravelAI Assistant
                </h3>
                <span style={{ fontSize: '0.78rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }}></span>
                  Online • MCP Tools & ML Connected
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {user && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '20px',
                  padding: '4px 12px',
                  fontSize: '0.78rem',
                  color: '#cbd5e1'
                }}>
                  <span style={{ color: '#38bdf8', fontWeight: 600 }}>👤 {user.name}</span>
                  <span style={{ color: 'rgba(255, 255, 255, 0.2)' }}>•</span>
                  <span>{user.preferences?.travelStyle || 'Moderate'}</span>
                  <span style={{ color: 'rgba(255, 255, 255, 0.2)' }}>•</span>
                  <span>{user.preferences?.foodPreference || 'Any Food'}</span>
                  <button
                    onClick={() => navigate('/profile')}
                    title="Edit Preferences in Profile"
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#06b6d4',
                      cursor: 'pointer',
                      fontSize: '0.75rem',
                      textDecoration: 'underline',
                      padding: 0,
                      marginLeft: '2px'
                    }}
                  >
                    Edit
                  </button>
                </div>
              )}

              {currentTrip && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '0.85rem', color: '#38bdf8', fontWeight: 600 }}>
                    📍 {currentTrip.destination} ({currentTrip.durationDays}D)
                  </span>
                  <button
                    onClick={() => setFullItineraryModal(true)}
                    style={{
                      background: 'rgba(6, 182, 212, 0.15)',
                      border: '1px solid rgba(6, 182, 212, 0.3)',
                      color: '#38bdf8',
                      padding: '5px 12px',
                      borderRadius: '8px',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Itinerary View
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Messages Area */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem'
          }}>
            {messages.map((msg, index) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    flexDirection: isUser ? 'row-reverse' : 'row',
                    gap: '12px',
                    alignItems: 'flex-start'
                  }}
                >
                  {/* Avatar */}
                  <div style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '10px',
                    background: isUser 
                      ? 'linear-gradient(135deg, #6366f1, #a855f7)' 
                      : 'linear-gradient(135deg, #06b6d4, #3b82f6)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    boxShadow: isUser ? '0 0 10px rgba(99, 102, 241, 0.3)' : '0 0 10px rgba(6, 182, 212, 0.3)'
                  }}>
                    {isUser ? <UserIcon size={18} color="#fff" /> : <Bot size={18} color="#fff" />}
                  </div>

                  {/* Message Bubble & Content */}
                  <div style={{
                    maxWidth: isUser ? '80%' : '90%',
                    display: 'flex',
                    flexDirection: 'column'
                  }}>
                    <div style={{
                      padding: '12px 18px',
                      borderRadius: isUser ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
                      background: isUser 
                        ? 'linear-gradient(135deg, #2563eb, #1d4ed8)' 
                        : 'rgba(30, 41, 59, 0.7)',
                      border: isUser ? 'none' : '1px solid rgba(255, 255, 255, 0.08)',
                      color: '#f8fafc',
                      fontSize: '0.94rem',
                      lineHeight: 1.55,
                      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.25)',
                      whiteSpace: 'pre-line'
                    }}>
                      {msg.content}
                    </div>

                    {/* Rich Cards Section if Assistant returned structured travel payload */}
                    {!isUser && msg.richData && (
                      <div style={{ marginTop: '0.85rem', width: '100%' }}>
                        {/* 0. Destination Recommendations Card */}
                        {(msg.richData.cardType === 'DESTINATION_RECOMMENDATIONS' || msg.richData.recommendations) && (
                          <RecommendationsCard
                            recommendations={msg.richData.recommendations}
                            onSelectDestination={(prompt) => sendMessage(prompt)}
                          />
                        )}

                        {/* 1. Trip Overview Card */}
                        {msg.richData.trip && (
                          <TripOverviewCard trip={msg.richData.trip} />
                        )}

                        {/* 2. Weather Intelligence Card */}
                        {msg.richData.weather && (
                          <WeatherCard weather={msg.richData.weather} />
                        )}

                        {/* 3. ML Budget Prediction Card */}
                        {msg.richData.budget && (
                          <BudgetCard budget={msg.richData.budget} />
                        )}

                        {/* 4. Day-by-Day Itinerary Card */}
                        {msg.richData.itinerary && (
                          <DayByDayItineraryCard 
                            itinerary={msg.richData.itinerary} 
                            onQuickModify={(prompt) => sendMessage(prompt)} 
                          />
                        )}

                        {/* 5. Smart Weather Packing List */}
                        {msg.richData.packingList && (
                          <PackingCard packingList={msg.richData.packingList} />
                        )}

                        {/* 6. Action Buttons Bar */}
                        {(msg.richData.actions || msg.richData.trip) && (
                          <ActionButtonsBar
                            trip={msg.richData.trip || currentTrip}
                            tripId={msg.richData.tripId}
                            onModifyClick={() => {
                              setInputValue('Modify the itinerary to ');
                            }}
                            onViewItineraryClick={() => setFullItineraryModal(true)}
                          />
                        )}

                        {/* 7. Suggested Quick Prompts Pills (from Greeting, Clarify, Help) */}
                        {msg.richData.suggestions && Array.isArray(msg.richData.suggestions) && (
                          <div style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '8px',
                            marginTop: '0.75rem'
                          }}>
                            {msg.richData.suggestions.map((sug, sIdx) => (
                              <button
                                key={sIdx}
                                onClick={() => sendMessage(sug)}
                                style={{
                                  background: 'rgba(6, 182, 212, 0.12)',
                                  border: '1px solid rgba(6, 182, 212, 0.3)',
                                  color: '#38bdf8',
                                  borderRadius: '16px',
                                  padding: '6px 14px',
                                  fontSize: '0.8rem',
                                  cursor: 'pointer',
                                  fontWeight: 500,
                                  transition: 'all 0.15s ease'
                                }}
                                onMouseEnter={(e) => {
                                  e.target.style.background = 'rgba(6, 182, 212, 0.25)';
                                  e.target.style.borderColor = 'rgba(6, 182, 212, 0.6)';
                                }}
                                onMouseLeave={(e) => {
                                  e.target.style.background = 'rgba(6, 182, 212, 0.12)';
                                  e.target.style.borderColor = 'rgba(6, 182, 212, 0.3)';
                                }}
                              >
                                💡 {sug}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {loading && (
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Bot size={18} color="#fff" />
                </div>
                <div style={{
                  padding: '12px 18px',
                  borderRadius: '4px 16px 16px 16px',
                  background: 'rgba(30, 41, 59, 0.7)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#94a3b8',
                  fontSize: '0.88rem'
                }}>
                  <Sparkles size={16} color="#06b6d4" className="animate-spin" />
                  <span>Orchestrating travel MCP tools & predicting budget...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Action Suggestion Pills */}
          <div style={{
            padding: '8px 1.5rem',
            background: 'rgba(11, 21, 40, 0.6)',
            borderTop: '1px solid rgba(255, 255, 255, 0.05)',
            display: 'flex',
            gap: '8px',
            overflowX: 'auto',
            scrollbarWidth: 'none'
          }}>
            <span style={{ fontSize: '0.78rem', color: '#64748b', alignSelf: 'center', whiteSpace: 'nowrap' }}>
              Suggested prompts:
            </span>
            {quickPills.map((pill, idx) => (
              <button
                key={idx}
                onClick={() => handleQuickPill(pill)}
                style={{
                  padding: '5px 12px',
                  borderRadius: '20px',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  color: '#cbd5e1',
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease'
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
                {pill}
              </button>
            ))}
          </div>

          {/* Conversational Input Bar */}
          <div style={{
            padding: '1rem 1.5rem',
            background: 'rgba(11, 21, 40, 0.95)',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            gap: '12px',
            alignItems: 'center'
          }}>
            <input
              type="text"
              placeholder="Ask anything, plan a trip, or modify activities (e.g. 'Remove museum on Day 2')..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
              style={{
                flex: 1,
                padding: '12px 16px',
                borderRadius: '12px',
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#f8fafc',
                fontSize: '0.92rem',
                outline: 'none',
                boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.3)',
                transition: 'border-color 0.2s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = '#06b6d4'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.12)'}
            />

            <button
              onClick={() => sendMessage()}
              disabled={!inputValue.trim() || loading}
              style={{
                padding: '12px 20px',
                borderRadius: '12px',
                border: 'none',
                background: !inputValue.trim() || loading 
                  ? 'rgba(255, 255, 255, 0.08)' 
                  : 'linear-gradient(135deg, #06b6d4, #3b82f6)',
                color: '#ffffff',
                fontWeight: 600,
                fontSize: '0.92rem',
                cursor: !inputValue.trim() || loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: !inputValue.trim() || loading ? 'none' : '0 4px 15px rgba(6, 182, 212, 0.4)',
                transition: 'all 0.2s ease'
              }}
            >
              <span>Send</span>
              <Send size={16} />
            </button>
          </div>
        </div>

        {/* Right Sidebar: Active Trip Workspace */}
        {currentTrip && (
          <div style={{
            width: '320px',
            background: 'rgba(15, 23, 42, 0.65)',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
            height: 'fit-content'
          }}>
            <div>
              <span style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Active Trip Context
              </span>
              <h4 style={{ margin: '4px 0 0 0', fontSize: '1.2rem', color: '#f8fafc', fontWeight: 700 }}>
                {currentTrip.destination}
              </h4>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '12px',
              padding: '12px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: '#94a3b8' }}>Duration:</span>
                <span style={{ color: '#f8fafc', fontWeight: 600 }}>{currentTrip.durationDays} Days</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: '#94a3b8' }}>Travelers:</span>
                <span style={{ color: '#f8fafc', fontWeight: 600 }}>{currentTrip.travelers} Persons</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: '#94a3b8' }}>ML Budget:</span>
                <span style={{ color: '#10b981', fontWeight: 700 }}>
                  ₹{(currentTrip.estimatedBudget || currentTrip.budget).toLocaleString('en-IN')}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: '#94a3b8' }}>Hotel:</span>
                <span style={{ color: '#f8fafc', fontWeight: 600, maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {currentTrip.hotel?.name || '3★ Resort'}
                </span>
              </div>
            </div>

            {/* Quick Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                onClick={() => setFullItineraryModal(true)}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '10px',
                  border: '1px solid rgba(6, 182, 212, 0.3)',
                  background: 'rgba(6, 182, 212, 0.1)',
                  color: '#38bdf8',
                  fontWeight: 600,
                  fontSize: '0.86rem',
                  cursor: 'pointer'
                }}
              >
                View Full Itinerary
              </button>

              <button
                onClick={() => {
                  const id = currentTrip._id;
                  if (id) {
                    window.open(getTripPdfUrl(id), '_blank');
                  } else {
                    alert('Please ask assistant to download PDF');
                  }
                }}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '10px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.86rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <Download size={15} />
                <span>Download PDF</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Full Itinerary Modal */}
      {fullItineraryModal && currentTrip && (
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
          padding: '1rem'
        }}>
          <div style={{
            background: 'var(--bg-secondary)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '20px',
            maxWidth: '850px',
            width: '100%',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)'
          }}>
            <div style={{
              padding: '1.25rem 1.5rem',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#f8fafc' }}>
                  {currentTrip.title}
                </h3>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                  Complete Day-by-Day Travel Schedule
                </span>
              </div>
              <button
                onClick={() => setFullItineraryModal(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  padding: '6px'
                }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
              <DayByDayItineraryCard itinerary={currentTrip.itinerary} />
            </div>

            <div style={{
              padding: '1rem 1.5rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '10px'
            }}>
              <button
                onClick={() => setFullItineraryModal(false)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: 'none',
                  color: '#e2e8f0',
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
              <button
                onClick={() => {
                  if (currentTrip._id) {
                    window.open(getTripPdfUrl(currentTrip._id), '_blank');
                  }
                }}
                style={{
                  padding: '8px 18px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
                  border: 'none',
                  color: '#fff',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Download size={15} />
                <span>Download PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAssistant;
