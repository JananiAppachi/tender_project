import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, MapPin, Calendar, DollarSign, Clock, FileText } from 'lucide-react';

interface Tender {
  id: string;
  title: string;
  location: string;
  type: string;
  budget: string;
  deadline: string;
  description: string;
  requirements: string[];
  status: 'open' | 'closing-soon' | 'closed';
}

const TendersPage = () => {
  const [filter, setFilter] = useState<'all' | 'open' | 'closing-soon' | 'closed'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const tenders: Tender[] = [
    {
      id: '1',
      title: 'Commercial Complex Development',
      location: 'Bangalore, Karnataka',
      type: 'Commercial Construction',
      budget: '₹50 Crores - ₹100 Crores',
      deadline: '2024-04-30',
      description: 'Development of a modern commercial complex with office spaces, retail outlets, and parking facilities.',
      requirements: [
        'Minimum 10 years of experience in commercial construction',
        'Proven track record of similar projects',
        'ISO 9001:2015 certification',
        'Strong financial capability'
      ],
      status: 'open'
    },
    {
      id: '2',
      title: 'Residential Township Project',
      location: 'Chennai, Tamil Nadu',
      type: 'Residential Construction',
      budget: '₹200 Crores - ₹300 Crores',
      deadline: '2024-03-25',
      description: 'Construction of a residential township including apartments, clubhouse, and other amenities.',
      requirements: [
        'Experience in large-scale residential projects',
        'Green building certification expertise',
        'In-house design capabilities',
        'Quality management systems'
      ],
      status: 'closing-soon'
    },
    {
      id: '3',
      title: 'Industrial Park Infrastructure',
      location: 'Pune, Maharashtra',
      type: 'Industrial Construction',
      budget: 'Above ₹500 Crores',
      deadline: '2024-02-28',
      description: 'Development of infrastructure facilities for a new industrial park including roads, power, and utilities.',
      requirements: [
        'Expertise in industrial infrastructure',
        'Heavy construction capabilities',
        'Environmental compliance track record',
        'Safety management systems'
      ],
      status: 'closed'
    }
  ];

  const getStatusBadge = (status: Tender['status']) => {
    switch (status) {
      case 'open':
        return <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">Open</span>;
      case 'closing-soon':
        return <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">Closing Soon</span>;
      case 'closed':
        return <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">Closed</span>;
    }
  };

  const filteredTenders = tenders
    .filter(tender => 
      filter === 'all' || tender.status === filter
    )
    .filter(tender =>
      tender.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tender.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tender.type.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div className="pt-20 pb-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-primary-dark mb-4">Current Tender Opportunities</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our active tender opportunities and submit your proposals to work with 
            Dhiya Infrastructure on transformative projects across India.
          </p>
        </div>

        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="w-full md:w-96">
              <input
                type="text"
                placeholder="Search tenders..."
                className="input-field"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
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
                onClick={() => setFilter('open')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  filter === 'open' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                Open
              </button>
              <button
                onClick={() => setFilter('closing-soon')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  filter === 'closing-soon' 
                    ? 'bg-yellow-600 text-white' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                Closing Soon
              </button>
              <button
                onClick={() => setFilter('closed')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  filter === 'closed' 
                    ? 'bg-red-600 text-white' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                Closed
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {filteredTenders.map((tender) => (
            <div key={tender.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">{tender.title}</h2>
                  <div className="flex items-center text-gray-600 mt-1">
                    <MapPin size={16} className="mr-1" />
                    <span>{tender.location}</span>
                  </div>
                </div>
                {getStatusBadge(tender.status)}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="flex items-center text-gray-600">
                  <Building2 size={16} className="mr-2" />
                  <span>{tender.type}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <DollarSign size={16} className="mr-2" />
                  <span>{tender.budget}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Calendar size={16} className="mr-2" />
                  <span>Deadline: {new Date(tender.deadline).toLocaleDateString()}</span>
                </div>
              </div>

              <p className="text-gray-600 mb-6">{tender.description}</p>

              <div className="mb-6">
                <h3 className="font-medium text-gray-800 mb-2">Key Requirements:</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  {tender.requirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center text-gray-500">
                  <Clock size={16} className="mr-1" />
                  <span className="text-sm">
                    {tender.status === 'closed' 
                      ? 'Tender closed'
                      : `Closes in ${Math.ceil((new Date(tender.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days`
                    }
                  </span>
                </div>
                {tender.status !== 'closed' && (
                  <Link 
                    to="/request-tender" 
                    className="btn-primary flex items-center"
                  >
                    <FileText size={16} className="mr-2" />
                    Submit Proposal
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-gray-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-semibold mb-4">How to Submit a Tender</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div>
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="font-medium text-lg mb-2">Review Requirements</h3>
              <p className="text-gray-600">
                Carefully review the tender requirements and ensure your company meets all criteria.
              </p>
            </div>
            <div>
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="font-medium text-lg mb-2">Prepare Documents</h3>
              <p className="text-gray-600">
                Gather all required documentation, including company profile, certifications, and financials.
              </p>
            </div>
            <div>
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="font-medium text-lg mb-2">Submit Proposal</h3>
              <p className="text-gray-600">
                Complete the tender request form with your proposal and submit before the deadline.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TendersPage;