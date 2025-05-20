import { Link } from 'react-router-dom';
import Hero from '../components/home/Hero';
import AboutSection from '../components/home/AboutSection';
import ServicesSection from '../components/home/ServicesSection';
import ProjectsSection from '../components/home/ProjectsSection';
import TestimonialsSection from '../components/home/TestimonialsSection';
import StatsSection from '../components/home/StatsSection';


const HomePage = () => {
  return (
    <div>
      <Hero />
      <AboutSection />
      <ServicesSection />
      <ProjectsSection />
      <TestimonialsSection />
      <StatsSection />
      <div className="py-16 bg-primary-dark text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to Start Your Infrastructure Project?</h2>
          <p className="max-w-2xl mx-auto mb-8 text-gray-300">
            Whether you need a commercial building, residential complex, or infrastructure development, 
            our expert team is ready to bring your vision to life.
          </p>
          <Link to="/request-tender" className="inline-block bg-white text-primary font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors">
            Request a Tender
          </Link>
        </div>
      </div>
     
    </div>
  );
};

export default HomePage;