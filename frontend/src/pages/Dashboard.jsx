import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Compass, 
  Map, 
  Globe, 
  Coins, 
  CloudSun, 
  Briefcase, 
  Plane, 
  LogOut, 
  Home, 
  PlaneTakeoff, 
  Heart,
  User
} from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const modules = [
    {
      id: 'plan-trip',
      title: 'Plan My Trip',
      description: 'Create a personalized travel itinerary with the help of artificial intelligence tailored to your travel style.',
      icon: <Map size={24} />,
    },
    {
      id: 'explore',
      title: 'Explore Destinations',
      description: 'Discover curated travel destinations globally based on your personal interests, activities, and budget.',
      icon: <Globe size={24} />,
    },
    {
      id: 'budget',
      title: 'Budget Planner',
      description: 'Estimate your complete travel expenses and get optimizations to save on hotels, flights, and food.',
      icon: <Coins size={24} />,
    },
    {
      id: 'weather',
      title: 'Weather & Travel Assistant',
      description: 'Get weather forecasts and intelligent clothing/travel suggestions for your specific destination days ahead.',
      icon: <CloudSun size={24} />,
    },
    {
      id: 'packing',
      title: 'Smart Packing',
      description: 'Generate a personalized packing checklist dynamically configured for your destination weather and activities.',
      icon: <Briefcase size={24} />,
    },
    {
      id: 'booking',
      title: 'Flights & Hotels',
      description: 'Seamlessly search, compare prices, and manage all your flight and hotel bookings directly within TravelAI.',
      icon: <Plane size={24} />,
    },
  ];

  return (
    <div className="dashboard-wrapper">
      <div className="glow-orb orb-1"></div>
      <div className="glow-orb orb-2"></div>

      {/* Navigation Header */}
      <nav className="navbar">
        <div className="navbar-container">
          <div className="logo-container" style={{ margin: 0 }}>
            <Compass size={26} color="#06b6d4" />
            <span>TravelAI</span>
          </div>
          
          <ul className="nav-links">
            <li><a href="#home" className="nav-link active">Home</a></li>
            <li><a href="#trips" className="nav-link">My Trips</a></li>
            <li><a href="#explore" className="nav-link">Explore</a></li>
            <li><a href="#profile" className="nav-link">Profile</a></li>
            <li>
              <button 
                onClick={handleLogout} 
                className="nav-link nav-link-logout btn-logout"
                id="logout-button"
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </li>
          </ul>
        </div>
      </nav>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Welcome Section */}
        <section className="welcome-section">
          <h1 className="welcome-title" id="welcome-message">
            Welcome to TravelAI, {user ? user.name : 'Explorer'}!
          </h1>
          <p className="welcome-subtitle">Plan smarter. Travel better.</p>
        </section>

        {/* Modules Grid */}
        <section>
          <h2 className="section-title">Smart Travel Suite</h2>
          <div className="modules-grid">
            {modules.map((module) => (
              <div key={module.id} className="module-card">
                <div className="card-header-icon">
                  {module.icon}
                </div>
                <h3 className="module-title">{module.title}</h3>
                <p className="module-desc">{module.description}</p>
                <div className="card-footer">
                  <span className="badge badge-coming-soon">Coming Soon</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
