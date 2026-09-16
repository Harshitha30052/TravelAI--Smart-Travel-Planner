import React, { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  Compass, 
  Sparkles, 
  MapPin, 
  Calendar, 
  Plane, 
  User, 
  LogOut, 
  LogIn,
  Layers
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Explore', path: '/explore' },
    { label: 'My Trips', path: '/trips' },
    { label: 'Bookings', path: '/bookings' },
    { 
      label: 'AI Travel Assistant', 
      path: '/assistant', 
      isAI: true 
    },
    { label: 'Profile', path: '/profile' }
  ];

  return (
    <nav className="navbar" style={{ position: 'sticky', top: 0, zIndex: 100 }}>
      <div className="navbar-container" style={{ maxWidth: '1240px', margin: '0 auto' }}>
        {/* Brand Logo */}
        <Link to="/" className="logo-container" style={{ margin: 0, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
            padding: '7px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(6, 182, 212, 0.4)'
          }}>
            <Compass size={22} color="#ffffff" />
          </div>
          <span style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.02em', color: '#f8fafc' }}>
            Smart<span style={{ color: '#06b6d4' }}>Travel</span> AI
          </span>
        </Link>

        {/* Navigation Links */}
        <ul className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: '1rem', listStyle: 'none' }}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`nav-link ${isActive ? 'active' : ''}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '0.92rem',
                    fontWeight: isActive || item.isAI ? 600 : 500,
                    color: item.isAI ? '#38bdf8' : (isActive ? '#06b6d4' : '#cbd5e1'),
                    background: item.isAI 
                      ? 'linear-gradient(135deg, rgba(6, 182, 212, 0.15), rgba(59, 130, 246, 0.15))' 
                      : (isActive ? 'rgba(255, 255, 255, 0.06)' : 'transparent'),
                    border: item.isAI ? '1px solid rgba(56, 189, 248, 0.35)' : '1px solid transparent',
                    boxShadow: item.isAI ? '0 0 12px rgba(6, 182, 212, 0.2)' : 'none',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {item.isAI && <Sparkles size={15} color="#38bdf8" />}
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}

          {/* User Auth controls */}
          <li style={{ marginLeft: '0.75rem', display: 'flex', alignItems: 'center' }}>
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Link 
                  to="/profile" 
                  title={user.name}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '7px',
                    padding: '4px 10px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '20px',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <div style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #06b6d4, #6366f1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    color: '#fff'
                  }}>
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span style={{ fontSize: '0.88rem', color: '#e2e8f0', maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user.name.split(' ')[0]}
                  </span>
                </Link>
                <button
                  onClick={handleLogout}
                  title="Logout"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '6px',
                    borderRadius: '6px',
                    transition: 'color 0.2s'
                  }}
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 14px',
                  background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
                  color: '#fff',
                  borderRadius: '8px',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  boxShadow: '0 2px 10px rgba(6, 182, 212, 0.3)'
                }}
              >
                <LogIn size={15} />
                <span>Login</span>
              </Link>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
