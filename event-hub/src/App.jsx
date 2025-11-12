import React, { useState, useEffect } from 'react';
import { authAPI, eventAPI, userAPI } from './services/api';

// --- SVG Icon Components ---
const MapPinIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const CalendarIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
    <line x1="16" x2="16" y1="2" y2="6" />
    <line x1="8" x2="8" y1="2" y2="6" />
    <line x1="3" x2="21" y1="10" y2="10" />
  </svg>
);

const ClockIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const SearchIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" x2="16.65" y1="21" y2="16.65" />
  </svg>
);

const XIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" x2="6" y1="6" y2="18" />
    <line x1="6" x2="18" y1="6" y2="18" />
  </svg>
);

// Simple Logo Component
const Logo = () => (
  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
    <span className="text-white font-bold text-lg">E</span>
  </div>
);

// --- Mock Data ---
const initialEvents = [
  { 
    id: 1, 
    title: 'Indie Night', 
    category: 'Indie', 
    date: 'Apr 23, 2024', 
    time: '9:00 PM',
    location: 'The Echo, Los Angeles', 
    organizer: 'Music Productions Inc.',
    imageUrl: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=600&fit=crop',
    description: 'A night of emerging indie artists showcasing their latest sounds.',
    programInfo: 'Featuring 5 amazing indie bands with special guest performances. Doors open at 8:00 PM. Full bar available.',
    createdBy: 'demo@example.com'
  },
  { 
    id: 2, 
    title: 'DJ Set', 
    category: 'Electronic', 
    date: 'Apr 25, 2024', 
    time: '11:00 PM',
    location: 'Club Space, New York', 
    organizer: 'Night Vibes Events',
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=600&fit=crop',
    description: 'Electronic beats and dance vibes all night long.',
    programInfo: 'Top international DJs spinning the latest electronic tracks. VIP sections available. Age 21+.',
    createdBy: 'demo@example.com'
  },
  { 
    id: 3, 
    title: 'Rock Festival', 
    category: 'Rock', 
    date: 'May 1, 2024', 
    time: '7:00 PM',
    location: 'Madison Square Garden, NYC', 
    organizer: 'Rock On Productions',
    imageUrl: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&h=600&fit=crop',
    description: 'The biggest rock bands live on one stage.',
    programInfo: '8 bands performing across 2 stages. Food trucks and merchandise available. Gates open at 5:00 PM.',
    createdBy: 'demo@example.com'
  },
  { 
    id: 4, 
    title: 'Jazz Evening', 
    category: 'Jazz', 
    date: 'May 5, 2024', 
    time: '8:30 PM',
    location: 'Blue Note, Chicago', 
    organizer: 'Jazz Society',
    imageUrl: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=800&h=600&fit=crop',
    description: 'Smooth jazz performances in an intimate setting.',
    programInfo: 'An intimate evening featuring renowned jazz musicians. Limited seating. Dinner service available.',
    createdBy: 'demo@example.com'
  },
  { 
    id: 5, 
    title: 'Hip Hop Night', 
    category: 'Hip Hop', 
    date: 'May 10, 2024', 
    time: '10:00 PM',
    location: 'The Roxy, LA', 
    organizer: 'Urban Beats',
    imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop',
    description: 'The hottest hip hop artists performing live.',
    programInfo: 'Live performances from top hip hop artists. DJ sets between performances. Age 18+.',
    createdBy: 'demo@example.com'
  },
  { 
    id: 6, 
    title: 'Classical Concert', 
    category: 'Classical', 
    date: 'May 15, 2024', 
    time: '7:30 PM',
    location: 'Carnegie Hall, NYC', 
    organizer: 'Symphony Orchestra',
    imageUrl: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=800&h=600&fit=crop',
    description: 'An evening of timeless classical masterpieces.',
    programInfo: 'Featuring works by Mozart, Beethoven, and Tchaikovsky. Symphony orchestra with 80+ musicians.',
    createdBy: 'demo@example.com'
  },
];

const categories = ['All', 'Indie', 'Electronic', 'Rock', 'Jazz', 'Hip Hop', 'Classical', 'Pop', 'Country'];

// --- Main App Component ---
export default function App() {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [events, setEvents] = useState([]);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [user, setUser] = useState(null);
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [joinedEvents, setJoinedEvents] = useState([]);
  const [showEventDetails, setShowEventDetails] = useState(null);
  const [showDashboard, setShowDashboard] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardJoinedEvents, setDashboardJoinedEvents] = useState([]);
  const [dashboardCreatedEvents, setDashboardCreatedEvents] = useState([]);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = authAPI.getCurrentUser();
    if (savedUser) {
      setUser(savedUser);
      loadUserData();
    }
    loadEvents();
  }, []);

  // Load events from API
  const loadEvents = async () => {
    try {
      setLoading(true);
      console.log('Loading events...');
      const response = await eventAPI.getAllEvents({
        category: selectedCategory !== 'All' ? selectedCategory : undefined,
        search: searchQuery || undefined
      });
      console.log('Events loaded:', response);
      setEvents(response.events || []);
      setError(null);
    } catch (err) {
      console.error('Error loading events:', err);
      console.error('Error details:', err.response?.data);
      setError(err.response?.data?.message || 'Failed to load events. Please check if the backend server is running.');
      setEvents([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  // Load user data (joined events)
  const loadUserData = async () => {
    try {
      console.log('Loading user data...');
      const joinedResponse = await userAPI.getJoinedEvents();
      console.log('User data loaded:', joinedResponse);
      const joinedIds = joinedResponse.events.map(e => e._id);
      setJoinedEvents(joinedIds);
      setDashboardJoinedEvents(joinedResponse.events);
    } catch (err) {
      console.error('Error loading user data:', err);
      console.error('Error details:', err.response?.data);
    }
  };

  // Load dashboard data
  const loadDashboardData = async () => {
    try {
      const [joinedResponse, createdResponse] = await Promise.all([
        userAPI.getJoinedEvents(),
        userAPI.getCreatedEvents()
      ]);
      setDashboardJoinedEvents(joinedResponse.events);
      setDashboardCreatedEvents(createdResponse.events);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    }
  };

  // Reload events when search or category changes
  useEffect(() => {
    const debounce = setTimeout(() => {
      loadEvents();
    }, 500);
    return () => clearTimeout(debounce);
  }, [searchQuery, selectedCategory]);

  // Handle authentication
  const handleAuth = async (email, password, name) => {
    try {
      console.log('Authenticating...', { email, mode: authMode });
      if (authMode === 'signup') {
        const response = await authAPI.register(name, email, password);
        console.log('Registration response:', response);
        setUser(response.user);
        alert('Registration successful!');
      } else {
        const response = await authAPI.login(email, password);
        console.log('Login response:', response);
        setUser(response.user);
        await loadUserData();
        alert('Login successful!');
      }
      setShowAuthModal(false);
    } catch (err) {
      console.error('Auth error:', err);
      console.error('Auth error details:', err.response?.data);
      const errorMessage = err.response?.data?.message || err.message || 'Authentication failed. Please try again.';
      alert(errorMessage);
    }
  };

  // Handle logout
  const handleLogout = () => {
    authAPI.logout();
    setUser(null);
    setJoinedEvents([]);
    setShowDashboard(false);
  };

  // Handle create event
  const handleCreateEvent = async (eventData) => {
    try {
      await eventAPI.createEvent(eventData);
      setShowCreateEvent(false);
      alert('Event created successfully!');
      await loadEvents();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create event. Please try again.');
      console.error('Create event error:', err);
    }
  };

  // Handle delete event
  const handleDeleteEvent = async (eventId) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    
    try {
      await eventAPI.deleteEvent(eventId);
      setShowEventDetails(null);
      alert('Event deleted successfully!');
      await loadEvents();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete event. Please try again.');
      console.error('Delete event error:', err);
    }
  };

  // Handle join event
  const handleJoinEvent = async (eventId) => {
    if (!user) {
      setShowAuthModal(true);
      setAuthMode('login');
      return;
    }
    
    try {
      await eventAPI.joinEvent(eventId);
      setJoinedEvents([...joinedEvents, eventId]);
      alert('Successfully joined the event!');
      await loadUserData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to join event. Please try again.');
      console.error('Join event error:', err);
    }
  };

  // Filter events (now just displays loaded events)
  const filteredEvents = events;

  return (
    <div className="min-h-screen bg-gray-950 font-sans text-white antialiased overflow-x-hidden">
      <style>
        {`
          @keyframes wave {
            0%, 100% { transform: scaleY(0.5); }
            50% { transform: scaleY(1.5); }
          }
          .animate-wave {
            animation: wave 1s ease-in-out infinite;
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          .animate-fade-in {
            animation: fadeIn 0.3s ease-out;
          }
          @keyframes slideUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-slideUp {
            animation: slideUp 0.4s ease-out;
          }
        `}
      </style>

      {/* --- Header Navigation --- */}
      <Header 
        user={user}
        onSignIn={() => { setAuthMode('login'); setShowAuthModal(true); }}
        onJoinNow={() => { setAuthMode('signup'); setShowAuthModal(true); }}
        onLogout={handleLogout}
        onShowDashboard={() => {
          setShowDashboard(true);
          loadDashboardData();
        }}
        onCreateEvent={() => {
          if (user) {
            setShowCreateEvent(true);
          } else {
            setAuthMode('login');
            setShowAuthModal(true);
          }
        }}
        onSearch={setSearchQuery}
        searchQuery={searchQuery}
      />

      {/* --- Main Content Area --- */}
      <main className="container mx-auto px-4 py-8">
        
        {/* --- Hero Section --- */}
        <section className="flex flex-col items-center justify-center text-center my-12 md:my-16 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Discover Events
          </h1>
          <p className="text-base md:text-lg text-gray-400 mb-8 max-w-xl">
            Find and join amazing events near you
          </p>
        </section>

        {/* --- Category Filter --- */}
        <section className="mb-8">
          <div className="flex flex-wrap justify-center gap-2 max-w-4xl mx-auto">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all ${
                  selectedCategory === category
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </section>

        {/* --- Event Grid Section --- */}
        <section className="mt-12">
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
              <p className="text-gray-400 text-lg mt-4">Loading events...</p>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-red-400 text-lg">{error}</p>
              <button 
                onClick={loadEvents}
                className="mt-4 px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-all"
              >
                Retry
              </button>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg">No events found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-7xl mx-auto">
              {filteredEvents.map(event => (
                <EventCard 
                  key={event._id} 
                  event={event} 
                  onJoin={() => handleJoinEvent(event._id)}
                  onSelect={() => setShowEventDetails(event)}
                  isJoined={joinedEvents.includes(event._id)}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* --- Event Details Modal --- */}
      {showEventDetails && (
        <EventDetailsModal 
          event={showEventDetails} 
          onClose={() => setShowEventDetails(null)}
          onJoin={() => handleJoinEvent(showEventDetails._id)}
          onDelete={handleDeleteEvent}
          isJoined={joinedEvents.includes(showEventDetails._id)}
          user={user}
        />
      )}

      {/* --- Authentication Modal --- */}
      {showAuthModal && (
        <AuthModal 
          mode={authMode}
          onClose={() => setShowAuthModal(false)}
          onAuth={handleAuth}
          onSwitchMode={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
        />
      )}

      {/* --- Create Event Modal --- */}
      {showCreateEvent && (
        <CreateEventModal 
          onClose={() => setShowCreateEvent(false)}
          onCreate={handleCreateEvent}
          categories={categories.slice(1)}
        />
      )}

      {/* --- User Dashboard Modal --- */}
      {showDashboard && user && (
        <DashboardModal
          user={user}
          createdEvents={dashboardCreatedEvents}
          joinedEvents={dashboardJoinedEvents}
          onClose={() => setShowDashboard(false)}
          onSelectEvent={(event) => {
            setShowDashboard(false);
            setShowEventDetails(event);
          }}
        />
      )}
    </div>
  );
}

// --- Header Component ---
function Header({ user, onSignIn, onJoinNow, onLogout, onShowDashboard, onCreateEvent, onSearch, searchQuery }) {
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <nav className="sticky top-0 z-40 w-full bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Logo />
            <h1 className="text-xl font-bold text-white">
              EventHub
            </h1>
          </div>
          
          {/* Search Bar */}
          <div className="hidden md:block flex-1 max-w-md mx-8">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => onSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Auth Buttons / User Menu */}
          <div className="flex items-center gap-3">
            {user && (
              <button 
                onClick={onCreateEvent}
                className="hidden sm:block px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-all"
              >
                Create Event
              </button>
            )}
            
            {user ? (
              <div className="relative">
                <button 
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-purple-600 flex items-center justify-center text-white font-medium text-sm">
                    {user.name[0].toUpperCase()}
                  </div>
                  <span className="text-white text-sm hidden sm:inline">{user.name}</span>
                </button>
                
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-xl border border-gray-700 overflow-hidden">
                    <div className="px-3 py-2 border-b border-gray-700">
                      <p className="text-sm font-medium text-white truncate">{user.name}</p>
                      <p className="text-xs text-gray-400 truncate">{user.email}</p>
                    </div>
                    <div className="py-1">
                      <button 
                        onClick={() => { onShowDashboard(); setShowUserMenu(false); }}
                        className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700"
                      >
                        Dashboard
                      </button>
                      <button 
                        onClick={() => { onCreateEvent(); setShowUserMenu(false); }}
                        className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 sm:hidden"
                      >
                        Create Event
                      </button>
                      <button 
                        onClick={() => { onLogout(); setShowUserMenu(false); }}
                        className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-gray-700"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button 
                  onClick={onSignIn}
                  className="px-4 py-2 text-gray-300 hover:text-white transition-colors text-sm font-medium"
                >
                  Sign In
                </button>
                <button 
                  onClick={onJoinNow}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-all"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

// --- Event Card Component ---
function EventCard({ event, onJoin, onSelect, isJoined }) {
  return (
    <div 
      onClick={onSelect}
      className="group bg-gray-900 rounded-xl overflow-hidden cursor-pointer hover:bg-gray-800 transition-all"
    >
      {/* Event Image */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={event.imageUrl} 
          alt={event.title} 
          className="w-full h-full object-cover" 
          onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&h=600&fit=crop'; }}
        />
        {isJoined && (
          <div className="absolute top-3 right-3 px-2 py-1 bg-green-500 text-white text-xs font-medium rounded">
            Joined
          </div>
        )}
      </div>
      
      {/* Event Details */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-purple-400 bg-purple-900/50 px-2 py-1 rounded">
            {event.category}
          </span>
        </div>
        
        <h3 className="text-lg font-semibold text-white mb-3 line-clamp-1">
          {event.title}
        </h3>
        
        <div className="space-y-1.5 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4" />
            <span>{event.date}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPinIcon className="w-4 h-4" />
            <span className="line-clamp-1">{event.location}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Authentication Modal Component ---
function AuthModal({ mode, onClose, onAuth, onSwitchMode }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    // Validation
    if (mode === 'signup' && !formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (mode === 'signup' && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onAuth(formData.email, formData.password, formData.name);
  };

  return (
    <div 
      className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-[#16161D] rounded-2xl shadow-2xl max-w-md w-full relative overflow-hidden border border-gray-800 animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-800 transition-colors z-10"
        >
          <XIcon className="w-5 h-5" />
        </button>
        
        <div className="p-8">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <Logo />
          </div>

          <h2 className="text-3xl font-bold text-white text-center mb-2">
            {mode === 'login' ? 'Welcome Back' : 'Join SHOWGO'}
          </h2>
          <p className="text-gray-400 text-center mb-8">
            {mode === 'login' 
              ? 'Sign in to discover amazing music events' 
              : 'Create an account to get started'
            }
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className={`w-full px-4 py-3 bg-[#0A0A0F] border ${errors.name ? 'border-red-500' : 'border-gray-700'} rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all`}
                  placeholder="John Doe"
                />
                {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className={`w-full px-4 py-3 bg-[#0A0A0F] border ${errors.email ? 'border-red-500' : 'border-gray-700'} rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all`}
                placeholder="you@example.com"
              />
              {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className={`w-full px-4 py-3 bg-[#0A0A0F] border ${errors.password ? 'border-red-500' : 'border-gray-700'} rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all`}
                placeholder="••••••••"
              />
              {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password}</p>}
            </div>

            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  className={`w-full px-4 py-3 bg-[#0A0A0F] border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-700'} rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all`}
                  placeholder="••••••••"
                />
                {errors.confirmPassword && <p className="text-red-400 text-sm mt-1">{errors.confirmPassword}</p>}
              </div>
            )}

            {mode === 'login' && (
              <div className="flex justify-end">
                <button type="button" className="text-sm text-purple-400 hover:text-purple-300 transition-colors">
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-purple-500/50 mt-6"
            >
              {mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
              <button 
                onClick={onSwitchMode}
                className="text-purple-400 hover:text-purple-300 font-semibold transition-colors"
              >
                {mode === 'login' ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>

          {mode === 'signup' && (
            <p className="text-xs text-gray-500 text-center mt-6">
              By signing up, you agree to our Terms of Service and Privacy Policy
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// --- Dashboard Modal Component ---
function DashboardModal({ user, createdEvents, joinedEvents, onClose, onSelectEvent }) {
  const [activeTab, setActiveTab] = useState('joined'); // 'joined' or 'created'

  const eventsToShow = activeTab === 'joined' ? joinedEvents : createdEvents;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn" onClick={onClose}>
      <div className="bg-[#16161D] rounded-2xl max-w-4xl w-full max-h-[85vh] flex flex-col animate-slideUp relative" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10">
          <XIcon className="w-6 h-6" />
        </button>
        
        {/* Header */}
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-3xl font-bold text-white">My Dashboard</h2>
          <p className="text-gray-400 mt-1">Manage your created and joined events</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-700 px-6">
          <button 
            onClick={() => setActiveTab('joined')}
            className={`px-6 py-3 font-semibold transition-all ${activeTab === 'joined' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-gray-400 hover:text-white'}`}
          >
            Joined Events ({joinedEvents.length})
          </button>
          <button 
            onClick={() => setActiveTab('created')}
            className={`px-6 py-3 font-semibold transition-all ${activeTab === 'created' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-gray-400 hover:text-white'}`}
          >
            Created Events ({createdEvents.length})
          </button>
        </div>

        {/* Event List */}
        <div className="flex-1 overflow-y-auto p-6">
          {eventsToShow.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg">You have no {activeTab} events yet.</p>
              <p className="text-gray-500 text-sm mt-2">
                {activeTab === 'joined' ? 'Start exploring and join events that interest you!' : 'Create your first event to get started!'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {eventsToShow.map(event => (
                <div 
                  key={event._id} 
                  onClick={() => onSelectEvent(event)}
                  className="flex items-center gap-4 p-4 bg-[#1F1F28] rounded-xl cursor-pointer hover:bg-purple-900/20 transition-all duration-300 border border-gray-800 hover:border-purple-500/30"
                >
                  <img 
                    src={event.imageUrl} 
                    alt={event.title} 
                    className="w-28 h-20 object-cover rounded-lg flex-shrink-0" 
                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&h=600&fit=crop'; }}
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-white text-lg truncate">{event.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                      <CalendarIcon className="w-4 h-4" />
                      <span>{event.date}</span>
                      <span className="text-gray-600">•</span>
                      <ClockIcon className="w-4 h-4" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                      <MapPinIcon className="w-4 h-4" />
                      <span className="truncate">{event.location}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-xs font-semibold px-3 py-1 bg-purple-900/50 text-purple-400 rounded-full">{event.category}</span>
                    {activeTab === 'created' && (
                      <span className="text-xs text-gray-500">Created by you</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// --- Event Details Modal Component ---
function EventDetailsModal({ event, user, onClose, onDelete, onJoin, isJoined }) {
  const [showProgramInfo, setShowProgramInfo] = useState(false);
  const canDelete = user && (user._id === event.createdBy?._id || user._id === event.createdBy);
  
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn" onClick={onClose}>
      <div className="bg-[#16161D] rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-slideUp relative" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        {/* Event Image */}
        <div className="relative h-80 overflow-hidden">
          <img 
            src={event.imageUrl} 
            alt={event.title} 
            className="w-full h-full object-cover" 
            onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&h=600&fit=crop'; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#16161D] to-transparent"></div>
        </div>
        
        {/* Content */}
        <div className="p-8">
          {/* Category Badge */}
          <span className="inline-block px-4 py-1.5 text-sm font-semibold text-purple-400 bg-purple-900/30 rounded-full border border-purple-500/30">
            {event.category}
          </span>
          
          {/* Event Title */}
          <h2 className="text-4xl font-bold mt-4 text-white">{event.title}</h2>
          
          {/* Organizer */}
          <p className="text-gray-400 mt-2">
            Organized by <span className="text-purple-400 font-semibold">{event.organizer}</span>
          </p>
          
          {/* Event Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-900/30 rounded-lg">
                <CalendarIcon className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Date</p>
                <p className="text-white font-semibold">{event.date}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-900/30 rounded-lg">
                <ClockIcon className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Time</p>
                <p className="text-white font-semibold">{event.time}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 md:col-span-2">
              <div className="p-3 bg-purple-900/30 rounded-lg">
                <MapPinIcon className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Location</p>
                <p className="text-white font-semibold">{event.location}</p>
              </div>
            </div>
          </div>
          
          {/* Description */}
          <div className="mt-8">
            <h3 className="text-xl font-bold text-white mb-3">About This Event</h3>
            <p className="text-gray-400 leading-relaxed">{event.description}</p>
          </div>
          
          {/* Program Info (Collapsible) */}
          {event.programInfo && (
            <div className="mt-6">
              <button 
                onClick={() => setShowProgramInfo(!showProgramInfo)}
                className="flex items-center justify-between w-full p-4 bg-[#0A0A0F] rounded-lg hover:bg-purple-900/20 transition-colors"
              >
                <span className="text-lg font-semibold text-white">Program Information</span>
                <svg 
                  className={`w-5 h-5 text-purple-400 transition-transform ${showProgramInfo ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {showProgramInfo && (
                <div className="mt-3 p-4 bg-[#0A0A0F] rounded-lg animate-slideUp">
                  <p className="text-gray-400 leading-relaxed whitespace-pre-line">{event.programInfo}</p>
                </div>
              )}
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="flex gap-4 mt-8">
            {user && !canDelete && (
              <button 
                onClick={isJoined ? () => {} : onJoin}
                disabled={isJoined}
                className={`flex-1 px-6 py-4 font-semibold rounded-lg transition-all duration-300 shadow-lg ${
                  isJoined 
                    ? 'bg-green-600 text-white cursor-default' 
                    : 'bg-purple-600 hover:bg-purple-700 text-white hover:shadow-purple-500/50'
                }`}
              >
                {isJoined ? '✓ Already Joined' : 'Join This Event'}
              </button>
            )}
            {!user && (
              <button 
                onClick={onJoin}
                className="flex-1 px-6 py-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-purple-500/50"
              >
                Login to Join Event
              </button>
            )}
            {canDelete && (
              <button 
                onClick={() => onDelete(event._id)}
                className="px-6 py-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-red-500/50"
              >
                Delete Event
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Create Event Modal Component ---
function CreateEventModal({ onClose, onCreate, categories }) {
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    organizer: '',
    category: categories[0] || 'Indie',
    imageUrl: '',
    description: '',
    programInfo: ''
  });
  
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    
    // Validation
    if (!formData.title.trim()) newErrors.title = 'Event title is required';
    if (!formData.date) newErrors.date = 'Event date is required';
    if (!formData.time) newErrors.time = 'Event time is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.organizer.trim()) newErrors.organizer = 'Organizer is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    onCreate(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn" onClick={onClose}>
      <div className="bg-[#16161D] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slideUp relative" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        {/* Header */}
        <div className="p-8 border-b border-gray-700">
          <h2 className="text-3xl font-bold text-white">Create New Event</h2>
          <p className="text-gray-400 mt-2">Fill in the details to create your event</p>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Event Title */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-2">
              <svg className="w-4 h-4 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/>
              </svg>
              Event Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-[#2A2A35] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
              placeholder="Enter event title"
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>
          
          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-2">
                <svg className="w-4 h-4 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                </svg>
                Event Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#2A2A35] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                placeholder="mm/dd/yyyy"
              />
              {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
            </div>
            
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-2">
                <svg className="w-4 h-4 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                </svg>
                Event Time <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#2A2A35] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                placeholder="--:-- --"
              />
              {errors.time && <p className="text-red-500 text-sm mt-1">{errors.time}</p>}
            </div>
          </div>
          
          {/* Location */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-2">
              <svg className="w-4 h-4 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
              </svg>
              Location <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-[#2A2A35] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
              placeholder="Enter venue name and address"
            />
            {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
          </div>
          
          {/* Organizer and Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-2">
                <svg className="w-4 h-4 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
                </svg>
                Organizer <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="organizer"
                value={formData.organizer}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#2A2A35] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                placeholder="Event organizer name"
              />
              {errors.organizer && <p className="text-red-500 text-sm mt-1">{errors.organizer}</p>}
            </div>
            
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-2">
                <svg className="w-4 h-4 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                </svg>
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#2A2A35] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat} className="bg-[#2A2A35]">{cat}</option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Event Image URL */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-2">
              <svg className="w-4 h-4 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd"/>
              </svg>
              Event Image URL
            </label>
            <input
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-[#2A2A35] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
              placeholder="https://example.com/event-image.jpg"
            />
            <p className="text-gray-500 text-xs mt-1">Leave empty for default image</p>
          </div>
          
          {/* Description */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-2">
              <svg className="w-4 h-4 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd"/>
              </svg>
              Event Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-3 bg-[#2A2A35] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors resize-none"
              placeholder="Describe your event..."
            />
          </div>
          
          {/* Program Information */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-2">
              <svg className="w-4 h-4 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
              </svg>
              Program Information (Optional)
            </label>
            <textarea
              name="programInfo"
              value={formData.programInfo}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-3 bg-[#2A2A35] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors resize-none"
              placeholder="Event schedule, lineup, etc."
            />
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-purple-500/50"
            >
              Create Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
