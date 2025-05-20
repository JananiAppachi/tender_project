import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <div 
      className="relative h-screen bg-center bg-cover bg-no-repeat pt-16"
      style={{ 
        backgroundImage: 'linear-gradient(rgba(15, 23, 42, 0.6), rgba(15, 23, 42, 0.6)), url(https://images.pexels.com/photos/1117452/pexels-photo-1117452.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1)'
      }}
    >
      <div className="absolute inset-0 flex items-center">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Building Tomorrow's<br />Infrastructure Today
          </h1>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto mb-8">
            We deliver innovative and sustainable infrastructure solutions across India with precision and excellence.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/request-tender" 
              className="btn-primary bg-primary text-white py-3 px-8 text-lg"
            >
              Request a Tender
            </Link>
            <Link 
              to="/projects" 
              className="btn-secondary border-white text-white hover:bg-white hover:text-primary py-3 px-8 text-lg"
            >
              Explore Projects
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;