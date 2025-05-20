import { Link } from 'react-router-dom';
import { Shield, Users, Target, Award } from 'lucide-react';

const AboutSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary-dark mb-4">About Dhiya Infrastructure</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Building the future with innovative infrastructure solutions for more than 15 years.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Our Journey of Excellence</h3>
            <p className="text-gray-600 mb-4">
              Since our inception in 2008, Dhiya Infrastructure has been at the forefront of infrastructure 
              development across India. We've successfully delivered numerous projects that have transformed 
              urban landscapes and improved lives.
            </p>
            <p className="text-gray-600">
              Our company specializes in large-scale infrastructure projects, from commercial buildings and 
              residential complexes to public infrastructure and industrial facilities. We combine technical 
              expertise with innovative solutions to create sustainable and impactful developments.
            </p>
          </div>
          <div className="relative">
            <img 
              src="https://images.pexels.com/photos/159306/construction-site-build-construction-work-159306.jpeg" 
              alt="Construction site" 
              className="rounded-lg shadow-lg w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="bg-primary-light/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="text-primary-light w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Quality Assurance</h3>
            <p className="text-gray-600">
              Rigorous quality control measures ensure excellence in every project we undertake.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-primary-light/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="text-primary-light w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Expert Team</h3>
            <p className="text-gray-600">
              Our skilled professionals bring years of experience and expertise to every project.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-primary-light/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="text-primary-light w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Innovation Focus</h3>
            <p className="text-gray-600">
              We embrace cutting-edge technology and innovative solutions in construction.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-primary-light/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="text-primary-light w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Proven Track Record</h3>
            <p className="text-gray-600">
              Our portfolio showcases successful completion of diverse infrastructure projects.
            </p>
          </div>
        </div>

        <div className="text-center mt-12">
          <Link to="/about" className="btn-primary">
            Learn More About Us
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;