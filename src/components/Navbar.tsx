import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, Settings, ChevronDown } from 'lucide-react';
import Logo from './Logo';
import { useAuth } from '../contexts/AuthContext';
import { API_BASE_URL } from '../config/api';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showLoginDropdown, setShowLoginDropdown] = useState(false);
  const [imageError, setImageError] = useState(false);
  const location = useLocation();
  const { user, logout, isLoading } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    if (showProfileDropdown) setShowProfileDropdown(false);
    if (showLoginDropdown) setShowLoginDropdown(false);
  };
  
  const closeMenu = () => {
    setIsOpen(false);
    setShowProfileDropdown(false);
    setShowLoginDropdown(false);
  };
  
  const toggleProfileDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowProfileDropdown(!showProfileDropdown);
    if (showLoginDropdown) setShowLoginDropdown(false);
  };

  const toggleLoginDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowLoginDropdown(!showLoginDropdown);
    if (showProfileDropdown) setShowProfileDropdown(false);
  };
  
  const closeProfileDropdown = () => setShowProfileDropdown(false);
  const closeLoginDropdown = () => setShowLoginDropdown(false);

  const handleLogout = () => {
    logout();
    closeMenu();
    navigate('/');
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    closeMenu();
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.profile-dropdown') && !target.closest('.login-dropdown')) {
        closeProfileDropdown();
        closeLoginDropdown();
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const getProfileImageUrl = (imagePath: string | null) => {
    if (!imagePath) return undefined;
    return imagePath.startsWith('http') ? imagePath : `${API_BASE_URL}${imagePath}`;
  };

  if (isLoading) {
    return (
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-2' : 'bg-white/90 backdrop-blur-md py-4'
      }`}>
        <div className="container mx-auto px-4">
          <nav className="flex justify-between items-center">
            <Link to="/" className="z-10">
              <Logo />
            </Link>
            <div className="animate-pulse h-8 w-32 bg-gray-200 rounded"></div>
          </nav>
        </div>
      </header>
    );
  }

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white shadow-md py-2' 
          : 'bg-white/90 backdrop-blur-md py-4 shadow-lg shadow-primary/5'
      }`}
    >
      <div className="container mx-auto px-4">
        <nav className="flex justify-between items-center">
          <Link to="/" className="z-10">
            <Logo />
          </Link>
          
          <div className="hidden md:flex space-x-6 items-center">
            <NavLink to="/" label="Home" currentPath={location.pathname} onClick={closeMenu} />
            <NavLink to="/projects" label="Projects" currentPath={location.pathname} onClick={closeMenu} />
            <NavLink to="/tenders" label="Our Tenders" currentPath={location.pathname} onClick={closeMenu} />
            <NavLink to="/tender-comparison" label="Tender Insights" currentPath={location.pathname} onClick={closeMenu} />
            <NavLink to="/about" label="About" currentPath={location.pathname} onClick={closeMenu} />
            <NavLink to="/contact" label="Contact" currentPath={location.pathname} onClick={closeMenu} />
            
            {user ? (
              <div className="flex items-center space-x-4 profile-dropdown relative">
                <button 
                  onClick={toggleProfileDropdown}
                  className="flex items-center space-x-2 focus:outline-none"
                  aria-label="Toggle profile menu"
                >
                  {user.profileImage && !imageError ? (
                    <img 
                      src={getProfileImageUrl(user.profileImage)} 
                      alt={user.username} 
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-primary/20"
                      onError={() => setImageError(true)}
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center ring-2 ring-primary/20">
                      <User size={20} />
                    </div>
                  )}
                  <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${showProfileDropdown ? 'transform rotate-180' : ''}`} />
                </button>

                {showProfileDropdown && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50 border border-gray-100">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900 truncate">{user.username}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    {user.role === 'admin' && (
                      <Link 
                        to="/admin/dashboard"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={closeProfileDropdown}
                      >
                        <Settings className="inline-block w-4 h-4 mr-2" />
                        Dashboard
                      </Link>
                    )}
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="inline-block w-4 h-4 mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <div className="login-dropdown relative">
                  <button
                    onClick={toggleLoginDropdown}
                    className="flex items-center space-x-2 text-gray-700 hover:text-primary transition-colors focus:outline-none"
                  >
                    <span>Login/Signup</span>
                    <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${showLoginDropdown ? 'transform rotate-180' : ''}`} />
                  </button>

                  {showLoginDropdown && (
                    <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50 border border-gray-100">
                      <Link 
                        to="/user/login" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={closeLoginDropdown}
                      >
                        User Login
                      </Link>
                      <Link 
                        to="/admin/login" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={closeLoginDropdown}
                      >
                        Admin Login
                      </Link>
                    </div>
                  )}
                </div>
                <Link 
                  to="/request-tender" 
                  className="btn-primary shadow-md hover:shadow-lg transition-all duration-200"
                >
                  Request a Tender
                </Link>
              </div>
            )}
          </div>
          
          <button 
            className="md:hidden z-50 focus:outline-none text-gray-700" 
            onClick={toggleMenu}
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
          
          {/* Mobile menu */}
          {isOpen && (
            <div className="md:hidden fixed inset-0 bg-white z-40 pt-20">
              <div className="flex flex-col items-center space-y-6 py-10">
                <MobileNavLink to="/" label="Home" currentPath={location.pathname} onClick={closeMenu} />
                <MobileNavLink to="/projects" label="Projects" currentPath={location.pathname} onClick={closeMenu} />
                <MobileNavLink to="/tenders" label="Our Tenders" currentPath={location.pathname} onClick={closeMenu} />
                <MobileNavLink to="/tender-comparison" label="Tender Insights" currentPath={location.pathname} onClick={closeMenu} />
                <MobileNavLink to="/about" label="About" currentPath={location.pathname} onClick={closeMenu} />
                <MobileNavLink to="/contact" label="Contact" currentPath={location.pathname} onClick={closeMenu} />
                
                {user ? (
                  <>
                    <div className="flex flex-col items-center">
                      {user.profileImage && !imageError ? (
                        <img 
                          src={getProfileImageUrl(user.profileImage)} 
                          alt={user.username} 
                          className="w-16 h-16 rounded-full object-cover mb-2 ring-4 ring-primary/20"
                          onError={() => setImageError(true)}
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center mb-2 ring-4 ring-primary/20">
                          <User size={32} />
                        </div>
                      )}
                      <p className="text-sm font-medium text-gray-900">{user.username}</p>
                      <p className="text-xs text-gray-500 mb-4">{user.email}</p>
                    </div>
                    {user.role === 'admin' && (
                      <Link 
                        to="/admin/dashboard" 
                        className="btn-primary w-4/5 mx-auto text-center shadow-md hover:shadow-lg transition-all duration-200"
                        onClick={closeMenu}
                      >
                        Dashboard
                      </Link>
                    )}
                    <button 
                      onClick={handleLogout}
                      className="text-red-600 hover:text-red-800 transition-colors font-medium"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <div className="flex flex-col items-center space-y-4">
                      <Link 
                        to="/user/login" 
                        className="text-gray-700 hover:text-primary transition-colors font-medium"
                        onClick={closeMenu}
                      >
                        User Login
                      </Link>
                      <Link 
                        to="/admin/login" 
                        className="text-gray-700 hover:text-primary transition-colors font-medium"
                        onClick={closeMenu}
                      >
                        Admin Login
                      </Link>
                    </div>
                    <Link 
                      to="/request-tender" 
                      className="btn-primary w-4/5 mx-auto text-center shadow-md hover:shadow-lg transition-all duration-200"
                      onClick={closeMenu}
                    >
                      Request a Tender
                    </Link>
                  </>
                )}
              </div>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

interface NavLinkProps {
  to: string;
  label: string;
  currentPath: string;
  onClick: () => void;
}

const NavLink = ({ to, label, currentPath, onClick }: NavLinkProps) => {
  const isActive = to === '/' ? currentPath === to : currentPath.startsWith(to);
  
  return (
    <Link
      to={to}
      className={`relative font-medium transition-colors group ${
        isActive ? 'text-primary' : 'text-gray-700 hover:text-primary'
      }`}
      onClick={onClick}
    >
      {label}
      <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-200 group-hover:w-full ${
        isActive ? 'w-full' : ''
      }`} />
    </Link>
  );
};

interface MobileNavLinkProps {
  to: string;
  label: string;
  currentPath: string;
  onClick: () => void;
}

const MobileNavLink = ({ to, label, currentPath, onClick }: MobileNavLinkProps) => {
  const isActive = to === '/' ? currentPath === to : currentPath.startsWith(to);
  
  return (
    <Link
      to={to}
      className={`text-xl font-medium transition-colors ${
        isActive ? 'text-primary' : 'text-gray-700 hover:text-primary'
      }`}
      onClick={onClick}
    >
      {label}
    </Link>
  );
};

export default Navbar;