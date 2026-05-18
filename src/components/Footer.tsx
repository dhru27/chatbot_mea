import { Link } from 'react-router-dom';
import { Instagram, Youtube, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import MEALogo from './MEALogo';

const Footer = () => {
  return (
    <footer className="bg-mea-darkblue text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and About */}
          <div className="md:col-span-1">
            <div className="flex items-center mb-4">
              <MEALogo className="h-10 w-10 text-mea-gold" />
              <h3 className="ml-2 text-xl font-heading font-bold">MEA IIT Bombay</h3>
            </div>
            <p className="text-gray-300 mb-4">
              The Mechanical Engineering Association (MEA) is the bridge that brings the entire Mechanical family together—students, faculty, and alumni.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.instagram.com/mea_iitb/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-mea-gold transition-colors">
                <Instagram size={20} />
              </a>
              <a href="https://youtube.com/@meaiitbombay?si=598O6mEUT0n6QOju" target="_blank" rel="noopener noreferrer" className="text-white hover:text-mea-gold transition-colors">
                <Youtube size={20} />
              </a>
              <a href="https://www.linkedin.com/company/mea-iit-bombay-linked/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-mea-gold transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-1">
            <h3 className="text-lg font-heading font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/events" className="hover:text-mea-gold transition-colors">Events</Link></li>
              <li><Link to="/resources" className="hover:text-mea-gold transition-colors">Resources</Link></li>
              <li><Link to="/editorial" className="hover:text-mea-gold transition-colors">Editorial</Link></li>
              <li><Link to="/team" className="hover:text-mea-gold transition-colors">Team</Link></li>
              <li><Link to="/gallery" className="hover:text-mea-gold transition-colors">Gallery</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="md:col-span-1">
            <h3 className="text-lg font-heading font-semibold mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <Mail size={18} className="mr-2 mt-1" />
                <a href="mailto:gsec@me.iitb.ac.in" className="hover:text-mea-gold transition-colors">gsec@me.iitb.ac.in</a>
              </div>
              <div className="flex items-start">
                <Phone size={18} className="mr-2 mt-1" />
                <div>
                  <p className="font-medium">Tanmay Kulkarni</p>
                  <p className="text-sm text-gray-300">Department General Secretary</p>
                  <a href="tel:+918380983079" className="hover:text-mea-gold transition-colors">+91 83809 83079</a>
                </div>
              </div>
              <a href="https://www.google.com/maps/place/Department+of+Mechanical+Engineering/data=!4m2!3m1!1s0x0:0x900c3067fb8a0e4d?sa=X&ved=1t:2428&ictx=111" target="_blank" rel="noopener noreferrer" className="flex items-start hover:text-mea-gold transition-colors">
                <MapPin size={18} className="mr-2 mt-1 flex-shrink-0" />
                <span>Department of Mechanical Engineering, IIT Bombay, Powai, Mumbai - 400076</span>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-300 text-sm">
          <p>&copy; {new Date().getFullYear()} Mechanical Engineering Association, IIT Bombay.  </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
