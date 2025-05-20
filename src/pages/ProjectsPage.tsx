import { useState } from 'react';
import { Building2, MapPin, Calendar, DollarSign } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  location: string;
  type: 'Commercial' | 'Infrastructure' | 'Residential' | 'Industrial';
  description: string;
  budget: string;
  completionDate: string;
  client: string;
  image: string;
}

const ProjectsPage = () => {
  const [filter, setFilter] = useState<string>('all');
  
  const projects: Project[] = [
    {
      id: '1',
      title: 'Downtown Office Complex',
      location: 'Bangalore, Karnataka',
      type: 'Commercial',
      description: 'A state-of-the-art office complex featuring modern amenities, eco-friendly design, and smart building technology. The project included 3 towers with a total of 150,000 square feet of office space.',
      budget: '₹250 Crores',
      completionDate: 'January 2023',
      client: 'TechSpace Developers Ltd.',
      image: 'https://images.pexels.com/photos/323705/pexels-photo-323705.jpeg'
    },
    {
      id: '2',
      title: 'Metro Rail Extension Project',
      location: 'Chennai, Tamil Nadu',
      type: 'Infrastructure',
      description: 'Extended the city\'s metro line by 12 kilometers, including 8 new stations with modern design and accessibility features. The project improved transportation for over 100,000 daily commuters.',
      budget: '₹750 Crores',
      completionDate: 'March 2022',
      client: 'Chennai Metro Rail Corporation',
      image: 'https://images.pexels.com/photos/2255355/pexels-photo-2255355.jpeg'
    },
    {
      id: '3',
      title: 'Urban Housing Development',
      location: 'Hyderabad, Telangana',
      type: 'Residential',
      description: 'Constructed 500 residential units across 10 apartment buildings, complete with community amenities, green spaces, and sustainable infrastructure solutions.',
      budget: '₹175 Crores',
      completionDate: 'October 2022',
      client: 'Urban Living Developers',
      image: 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg'
    },
    {
      id: '4',
      title: 'Highway Expansion Project',
      location: 'Mumbai-Pune Expressway',
      type: 'Infrastructure',
      description: 'Widened and reconstructed 45 kilometers of national highway, including 3 new bridges and 5 interchanges to reduce congestion and improve safety standards.',
      budget: '₹420 Crores',
      completionDate: 'December 2021',
      client: 'National Highways Authority of India',
      image: 'https://images.pexels.com/photos/681335/pexels-photo-681335.jpeg'
    }
  ];

  const filteredProjects = filter === 'all' 
    ? projects 
    : projects.filter(project => project.type.toLowerCase() === filter.toLowerCase());

  return (
    <div className="pt-20 pb-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-primary-dark mb-4">Our Projects Portfolio</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our successful infrastructure projects across India, showcasing our expertise, innovation,
            and commitment to excellence.
          </p>
        </div>

        <div className="flex justify-center mb-8 space-x-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-md transition-colors ${
              filter === 'all' 
                ? 'bg-primary text-white' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('Commercial')}
            className={`px-4 py-2 rounded-md transition-colors ${
              filter === 'Commercial' 
                ? 'bg-primary text-white' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            Commercial
          </button>
          <button
            onClick={() => setFilter('Infrastructure')}
            className={`px-4 py-2 rounded-md transition-colors ${
              filter === 'Infrastructure' 
                ? 'bg-primary text-white' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            Infrastructure
          </button>
          <button
            onClick={() => setFilter('Residential')}
            className={`px-4 py-2 rounded-md transition-colors ${
              filter === 'Residential' 
                ? 'bg-primary text-white' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            Residential
          </button>
          <button
            onClick={() => setFilter('Industrial')}
            className={`px-4 py-2 rounded-md transition-colors ${
              filter === 'Industrial' 
                ? 'bg-primary text-white' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            Industrial
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
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
                    <Building2 size={16} className="mr-2" />
                    <span>{project.type}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <DollarSign size={16} className="mr-2" />
                    <span>{project.budget}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Calendar size={16} className="mr-2" />
                    <span>{project.completionDate}</span>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">{project.description}</p>
                <div className="text-sm text-gray-500">Client: {project.client}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;