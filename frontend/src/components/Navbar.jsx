import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isVerySmall, setIsVerySmall] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 769);
      setIsVerySmall(window.innerWidth < 500);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_FETCH_API}/api/bookings/search?q=${encodeURIComponent(searchQuery)}`);
      if (!response.ok) {
        throw new Error('Search failed');
      }
      const results = await response.json();
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleResultClick = (bookingId) => {
    setSearchQuery('');
    setSearchResults([]);
    navigate(`/${bookingId}`);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand" onClick={clearSearch}>
          Car Wash
        </Link>

        <div className="navbar-content">
          <div className="search-container">
            {isMobile && (
              <div className="search-icon" title="Click to search">
                <img src="/src/assets/search.png" alt="Search" className="icon-img" />
              </div>
            )}
            <form onSubmit={handleSearch} className="search-form">
              <input
                type="text"
                placeholder="Search by car or customer name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              <button type="submit" className={`search-button ${isMobile ? 'icon-link' : ''}`} disabled={isSearching} title="Search">
                {isSearching ? '...' : (isMobile ? <img src="/src/assets/search.png" alt="Search" className="icon-img" /> : 'Search')}
              </button>
            </form>
          </div>

          <ul className="navbar-menu">
            {!isVerySmall && (
              <li>
                <Link to="/" className={`navbar-link ${isMobile ? 'icon-link' : ''}`} onClick={clearSearch} title="Home">
                  {isMobile ? '🏠' : 'Home'}
                </Link>
              </li>
            )}
            <li>
              <Link to="/all-bookings" className={`navbar-link ${isMobile ? 'icon-link' : ''}`} onClick={clearSearch} title="All Bookings">
                {isMobile ? <img src="/src/assets/appointment.png" alt="All Bookings" className="icon-img" /> : 'All Bookings'}
              </Link>
            </li>
          </ul>

          {searchResults.length > 0 && (
            <div className="search-results">
              {searchResults.map(booking => (
                <div
                  key={booking._id}
                  className="search-result-item"
                  onClick={() => handleResultClick(booking._id)}
                >
                  <div className="search-result-info">
                    <span className="search-result-name">{booking.customerName}</span>
                    <span className="search-result-car">{booking.carName} {booking.carModel}</span>
                  </div>
                  <span className="search-result-status">{booking.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
