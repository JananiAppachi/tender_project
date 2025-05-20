import { Building2, Loader as Road, Home, Factory, PenTool as Tool } from 'lucide-react';
import { Link } from 'react-router-dom';

const ServicesSection = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary-dark mb-4">Our Services</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We offer comprehensive infrastructure solutions tailored to meet diverse project requirements.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="bg-primary-light/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Building2 className="text-primary w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Commercial Construction</h3>
            <p className="text-gray-600 mb-4">
              Modern office complexes, retail spaces, and commercial buildings with state-of-the-art amenities.
            </p>
            <ul className="text-gray-600 space-y-2">
              <li>• Office Buildings</li>
              <li>• Shopping Centers</li>
              <li>• Hotels & Hospitality</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="bg-primary-light/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Road className="text-primary w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Infrastructure Development</h3>
            <p className="text-gray-600 mb-4">
              Critical infrastructure projects that connect communities and drive economic growth.
            </p>
            <ul className="text-gray-600 space-y-2">
              <li>• Roads & Highways</li>
              <li>• Bridges & Flyovers</li>
              <li>• Urban Development</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="bg-primary-light/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Home className="text-primary w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Residential Projects</h3>
            <p className="text-gray-600 mb-4">
              Quality housing solutions from individual homes to large residential complexes.
            </p>
            <ul className="text-gray-600 space-y-2">
              <li>• Apartment Complexes</li>
              <li>• Township Projects</li>
              <li>• Luxury Villas</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="bg-primary-light/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Factory className="text-primary w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Industrial Construction</h3>
            <p className="text-gray-600 mb-4">
              Specialized facilities for manufacturing, warehousing, and industrial operations.
            </p>
            <ul className="text-gray-600 space-y-2">
              <li>• Manufacturing Plants</li>
              <li>• Warehouses</li>
              <li>• Industrial Parks</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="bg-primary-light/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Tool className="text-primary w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Renovation & Restoration</h3>
            <p className="text-gray-600 mb-4">
              Modernization and restoration of existing structures with minimal disruption.
            </p>
            <ul className="text-gray-600 space-y-2">
              <li>• Building Upgrades</li>
              <li>• Heritage Restoration</li>
              <li>• Facility Modernization</li>
            </ul>
          </div>

          <div className="bg-primary p-6 rounded-lg shadow-md text-white">
            <h3 className="text-xl font-semibold mb-4">Ready to Start Your Project?</h3>
            <p className="mb-6">
              Let's discuss how we can help bring your infrastructure vision to life.
            </p>
            <Link to="/request-tender" className="inline-block bg-white text-primary font-semibold px-6 py-2 rounded-lg hover:bg-gray-100 transition-colors">
              Request a Tender
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;