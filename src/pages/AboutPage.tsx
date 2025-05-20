import { Shield, Users, Target, Award } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="pt-20 pb-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-primary-dark mb-4">About Dhiya Infrastructure</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Building the future with innovative infrastructure solutions for more than 15 years.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Journey of Excellence</h2>
            <p className="text-gray-600 mb-4">
              Since our inception in 2008, Dhiya Infrastructure has been at the forefront of infrastructure 
              development across India. We've successfully delivered numerous projects that have transformed 
              urban landscapes and improved lives.
            </p>
            <p className="text-gray-600 mb-4">
              Our company specializes in large-scale infrastructure projects, from commercial buildings and 
              residential complexes to public infrastructure and industrial facilities. We combine technical 
              expertise with innovative solutions to create sustainable and impactful developments.
            </p>
            <p className="text-gray-600">
              With a team of experienced professionals and state-of-the-art technology, we ensure every 
              project meets the highest standards of quality and safety while delivering exceptional value 
              to our clients.
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
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

        <div className="bg-gray-50 rounded-lg p-8 mb-16">
          <h2 className="text-2xl font-semibold text-center mb-8">Our Timeline</h2>
          <div className="max-w-3xl mx-auto">
            <div className="relative pl-8 pb-8 border-l-2 border-primary">
              <div className="absolute left-[-8px] top-0 w-4 h-4 bg-primary rounded-full"></div>
              <div className="mb-4">
                <h3 className="text-lg font-semibold">Company Founded</h3>
                <p className="text-gray-600">2008</p>
                <p className="text-gray-600 mt-2">
                  Dhiya Infrastructure was established with a vision to transform India's infrastructure landscape.
                </p>
              </div>
            </div>
            <div className="relative pl-8 pb-8 border-l-2 border-primary">
              <div className="absolute left-[-8px] top-0 w-4 h-4 bg-primary rounded-full"></div>
              <div className="mb-4">
                <h3 className="text-lg font-semibold">First Major Project</h3>
                <p className="text-gray-600">2010</p>
                <p className="text-gray-600 mt-2">
                  Successfully completed our first large-scale commercial project in Bangalore.
                </p>
              </div>
            </div>
            <div className="relative pl-8 pb-8 border-l-2 border-primary">
              <div className="absolute left-[-8px] top-0 w-4 h-4 bg-primary rounded-full"></div>
              <div className="mb-4">
                <h3 className="text-lg font-semibold">Expansion Phase</h3>
                <p className="text-gray-600">2015</p>
                <p className="text-gray-600 mt-2">
                  Expanded operations to multiple cities across India and diversified our project portfolio.
                </p>
              </div>
            </div>
            <div className="relative pl-8">
              <div className="absolute left-[-8px] top-0 w-4 h-4 bg-primary rounded-full"></div>
              <div>
                <h3 className="text-lg font-semibold">Present Day</h3>
                <p className="text-gray-600">2025</p>
                <p className="text-gray-600 mt-2">
                  Leading infrastructure development company with over 100+ successful projects.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Ready to Start Your Project?</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Whether you need a commercial building, residential complex, or infrastructure development,
            our expert team is ready to bring your vision to life.
          </p>
          <a 
            href="/request-tender" 
            className="btn-primary inline-block"
          >
            Request a Tender
          </a>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;