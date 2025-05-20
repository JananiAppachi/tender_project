import { Link } from 'react-router-dom';
import Logo from './Logo';
import { Building2, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-secondary text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="mb-4">
              <Building2 size={32} className="text-primary-light" />
              <h3 className="text-xl font-bold text-white mt-2">Dhiya Infrastructure</h3>
            </div>
            <p className="text-gray-300 mb-4">
              Building the future with innovative infrastructure solutions for more than 15 years.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-primary-light transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/tenders" className="text-gray-300 hover:text-primary-light transition-colors">
                  Our Tenders
                </Link>
              </li>
              <li>
                <Link to="/request-tender" className="text-gray-300 hover:text-primary-light transition-colors">
                  Tender Request
                </Link>
              </li>
            </ul>
          </div>

          {/* Our Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Our Services</h4>
            <ul className="space-y-2">
              <li className="text-gray-300">Commercial Construction</li>
              <li className="text-gray-300">Infrastructure Development</li>
              <li className="text-gray-300">Residential Projects</li>
              <li className="text-gray-300">Industrial Construction</li>
              <li className="text-gray-300">Renovation & Restoration</li>
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-start">
                <MapPin size={18} className="text-primary-light mr-2 mt-1" />
                <p className="text-gray-300">
                  NO.9, Devanayaki Nagar 4th Street, Sanganoor Road, Coimbatore, Tamil Nadu, India - 641006
                </p>
              </div>
              <div className="flex items-center">
                <Phone size={18} className="text-primary-light mr-2" />
                <p className="text-gray-300">+91 8148170052</p>
              </div>
              <div className="flex items-center">
                <Mail size={18} className="text-primary-light mr-2" />
                <p className="text-gray-300">info@dhiyainfra.com</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Dhiya Infrastructure. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link to="/privacy-policy" className="text-gray-400 hover:text-primary-light text-sm">
              Privacy Policy
            </Link>
            <Link to="/terms-of-service" className="text-gray-400 hover:text-primary-light text-sm">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;