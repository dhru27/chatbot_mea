import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MenuIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MEALogo from '@/components/MEALogo';
import { DarkModeToggle } from './DarkModeToggle';
import { AppDownloadButton } from './AppDownloadButton';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  
  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Events', path: '/events' },
    { name: 'Editorial', path: '/editorial' },
    { name: 'Docs', path: '/docs' },
    { name: 'Team', path: '/team' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Resources', path: '/resources' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <MEALogo className="h-10 w-10" />
              <span className="ml-2 text-xl font-heading font-bold dark:text-white">MEA</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`nav-link ${location.pathname === item.path ? 'active' : ''} dark:text-gray-200 dark:hover:text-mea-gold`}
              >
                {item.name}
              </Link>
            ))}
            <div className="ml-2 border-l border-gray-200 dark:border-gray-700 pl-2 flex items-center gap-2">
              <AppDownloadButton />
              <DarkModeToggle />
            </div>
          </div>

          {/* Mobile Navigation Button */}
          <div className="md:hidden flex items-center space-x-2">
            <AppDownloadButton />
            <DarkModeToggle />
            <button
              type="button"
              className="p-2 rounded-md"
              onClick={() => setIsOpen(!isOpen)}
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div className={`${isOpen ? 'block' : 'hidden'} md:hidden bg-white dark:bg-gray-900 shadow-lg`} id="mobile-menu">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                location.pathname === item.path 
                  ? 'bg-mea-gold/10 text-mea-gold' 
                  : 'text-foreground dark:text-gray-200 hover:bg-mea-gold/10 hover:text-mea-gold dark:hover:text-mea-gold'
              }`}
              onClick={() => setIsOpen(false)}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
