import { Link } from 'react-router-dom';
import { MapPin, Calendar, DollarSign } from 'lucide-react';

const ProjectsSection = () => {
  const featuredProjects = [
    {
      id: 1,
      title: 'Downtown Office Complex',
      location: 'Bangalore, Karnataka',
      image: 'https://images.pexels.com/photos/323705/pexels-photo-323705.jpeg',
      description: 'A state-of-the-art office complex featuring modern amenities and eco-friendly design.',
      budget: '₹250 Crores',
      completion: 'January 2023'
    },
    {
      id: 2,
      title: 'Metro Rail Extension',
      location: 'Chennai, Tamil Nadu',
      image: 'https://images.pexels.com/photos/2255355/pexels-photo-2255355.jpeg',
      description: 'Extension of metro rail line with 8 new stations and modern accessibility features.',
      budget: '₹750 Crores',
      completion: 'March 2022'
    },
    {
      id: 3,
      title: 'Urban Housing Development',
      location: 'Hyderabad, Telangana',
      image: 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg',
      description: 'Residential complex with 500 units and comprehensive community amenities.',
      budget: '₹175 Crores',
      completion: 'October 2022'
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary-dark mb-4">Featured Projects</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our successful infrastructure projects across India, showcasing our expertise and commitment to excellence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {featuredProjects.map(project => (
            <div key={project.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 overflow-hidden">
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{project.title}</h3>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-600">
                    <MapPin size={16} className="mr-2" />
                    <span>{project.location}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <DollarSign size={16} className="mr-2" />
                    <span>{project.budget}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Calendar size={16} className="mr-2" />
                    <span>{project.completion}</span>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">{project.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link to="/projects" className="btn-primary">
            View All Projects
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;