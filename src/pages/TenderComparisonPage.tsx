import { useState, useEffect, useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ScatterChart,
  Scatter,
  ZAxis,
  PieChart,
  Pie,
  Cell,
  ComposedChart,
  Area
} from 'recharts';
import { Filter, Search, Star, ChevronDown, ChevronUp, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';

interface Tender {
  id: string;
  projectName: string;
  year: number;
  type: 'Residential' | 'Commercial' | 'Infrastructure' | 'Industrial';
  area: {
    value: number;
    unit: string;
  };
  cost: number;
  duration: number;
  labor: number;
  materialsUsed: string[];
  efficiency: number;
  location: string;
}

const COLORS = ['#4F46E5', '#2563EB', '#7C3AED', '#EC4899', '#F59E0B', '#10B981'];

const TenderComparisonPage = () => {
  const [filters, setFilters] = useState({
    type: '',
    location: '',
    year: '',
    searchQuery: ''
  });

  const [selectedTenders, setSelectedTenders] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Sample data with useState for future API integration
  const [tenders, setTenders] = useState<Tender[]>([]);

  // Fetch tenders data
  useEffect(() => {
    const loadTenders = () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Using sample data for now
        setTenders([
          {
            id: '1',
            projectName: 'Dhiya Mall',
            year: 2018,
            type: 'Commercial',
            area: { value: 45000, unit: 'sq.ft' },
            cost: 62000000,
            duration: 12,
            labor: 120,
            materialsUsed: ['Cement', 'Steel'],
            efficiency: 3,
            location: 'Coimbatore'
          },
          {
            id: '2',
            projectName: 'Urban Greens',
            year: 2020,
            type: 'Residential',
            area: { value: 60000, unit: 'sq.ft' },
            cost: 84000000,
            duration: 10,
            labor: 150,
            materialsUsed: ['RCC', 'Glass'],
            efficiency: 4,
            location: 'Chennai'
          },
          {
            id: '3',
            projectName: 'Skyline Flyover',
            year: 2022,
            type: 'Infrastructure',
            area: { value: 1.2, unit: 'km' },
            cost: 145000000,
            duration: 16,
            labor: 200,
            materialsUsed: ['Steel', 'Asphalt'],
            efficiency: 3,
            location: 'Coimbatore'
          },
          {
            id: '4',
            projectName: 'Phoenix Heights',
            year: 2024,
            type: 'Residential',
            area: { value: 80000, unit: 'sq.ft' },
            cost: 120000000,
            duration: 9,
            labor: 180,
            materialsUsed: ['Eco Cement', 'Steel', 'Glass'],
            efficiency: 4,
            location: 'Bangalore'
          }
        ]);
        setIsLoading(false);
      } catch (err) {
        console.error('Error loading tenders:', err);
        setError('Failed to load tenders data');
        setIsLoading(false);
      }
    };

    loadTenders();
  }, []);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-red-500 text-xl mb-4">⚠️ {error}</div>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
        >
          Retry
        </button>
      </div>
    );
  }

  const filteredTenders = tenders.filter(tender => {
    const matchesType = !filters.type || tender.type === filters.type;
    const matchesLocation = !filters.location || tender.location === filters.location;
    const matchesYear = !filters.year || tender.year.toString() === filters.year;
    const matchesSearch = !filters.searchQuery || 
      tender.projectName.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      tender.type.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      tender.location.toLowerCase().includes(filters.searchQuery.toLowerCase());

    return matchesType && matchesLocation && matchesYear && matchesSearch;
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const toggleTenderSelection = (tenderId: string) => {
    setSelectedTenders(prev => {
      if (prev.includes(tenderId)) {
        return prev.filter(id => id !== tenderId);
      }
      return [...prev, tenderId];
    });
  };

  const formatCurrency = (amount: number) => {
    const crore = amount / 10000000;
    return `₹${crore.toFixed(2)} Cr`;
  };

  const renderEfficiencyStars = (efficiency: number) => {
    return Array(5).fill(0).map((_, index) => (
      <Star
        key={index}
        size={16}
        className={`inline ${index < efficiency ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  const getInsights = () => {
    const sortedByYear = [...tenders].sort((a, b) => a.year - b.year);
    const insights = [];

    // Cost per sqft trend
    const oldestProject = sortedByYear[0];
    const latestProject = sortedByYear[sortedByYear.length - 1];
    const oldCostPerSqft = oldestProject.cost / oldestProject.area.value;
    const newCostPerSqft = latestProject.cost / latestProject.area.value;
    const costChange = ((newCostPerSqft - oldCostPerSqft) / oldCostPerSqft) * 100;

    insights.push({
      type: costChange > 0 ? 'negative' : 'positive',
      text: `Cost per sq.ft. has ${costChange > 0 ? 'increased' : 'reduced'} by ${Math.abs(costChange).toFixed(1)}% from ${oldestProject.year} to ${latestProject.year}.`
    });

    // Labor trend
    const avgLaborOld = sortedByYear.slice(0, 2).reduce((acc, curr) => acc + curr.labor, 0) / 2;
    const avgLaborNew = sortedByYear.slice(-2).reduce((acc, curr) => acc + curr.labor, 0) / 2;
    const laborChange = ((avgLaborNew - avgLaborOld) / avgLaborOld) * 100;

    insights.push({
      type: laborChange > 15 ? 'negative' : 'positive',
      text: `Average labor per tender has ${laborChange > 0 ? 'increased' : 'decreased'} by ${Math.abs(laborChange).toFixed(1)}%.`
    });

    // Timeline efficiency
    const avgDurationOld = sortedByYear.slice(0, 2).reduce((acc, curr) => acc + curr.duration, 0) / 2;
    const avgDurationNew = sortedByYear.slice(-2).reduce((acc, curr) => acc + curr.duration, 0) / 2;
    const durationChange = ((avgDurationNew - avgDurationOld) / avgDurationOld) * 100;

    insights.push({
      type: durationChange > 0 ? 'negative' : 'positive',
      text: `Project timelines have ${durationChange > 0 ? 'increased' : 'improved'} by ${Math.abs(durationChange).toFixed(1)}%.`
    });

    return insights;
  };

  // Enhanced comparison data function
  const getComparisonData = () => {
    const selectedTenderData = tenders.filter(t => selectedTenders.includes(t.id));
    
    // Cost per area unit
    const costPerUnit = selectedTenderData.map(t => ({
      name: t.projectName,
      value: t.cost / t.area.value,
      year: t.year
    }));

    // Efficiency metrics
    const efficiencyData = selectedTenderData.map(t => ({
      name: t.projectName,
      efficiency: t.efficiency,
      laborEfficiency: t.labor / t.duration,
      costEfficiency: t.cost / (t.duration * t.labor),
      year: t.year
    }));

    // Timeline analysis
    const timelineData = selectedTenderData.map(t => ({
      name: t.projectName,
      duration: t.duration,
      labor: t.labor,
      cost: t.cost,
      year: t.year
    }));

    // Material distribution
    const materialsData = selectedTenderData.reduce((acc, tender) => {
      tender.materialsUsed.forEach(material => {
        acc[material] = (acc[material] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);

    const materialsPieData = Object.entries(materialsData).map(([name, value]) => ({
      name,
      value
    }));

    // Cost breakdown with type assertions
    const costBreakdown = selectedTenderData.map(t => {
      const laborCost: number = (t.labor as number) * 30000;
      const materialCost: number = (t.cost as number) * 0.6;
      const otherCost: number = (t.cost as number) * 0.4 - laborCost;
      
      return {
        name: t.projectName,
        laborCost,
        materialCost,
        otherCost,
        totalCost: t.cost as number
      };
    });

    // Efficiency trends
    const efficiencyTrends = selectedTenderData.map(t => ({
      name: t.projectName,
      costPerLaborer: t.cost / t.labor,
      timeEfficiency: t.area.value / t.duration,
      laborUtilization: t.labor / t.duration
    }));

    return {
      costPerUnit,
      efficiencyData,
      timelineData,
      materialsPieData,
      costBreakdown,
      efficiencyTrends
    };
  };

  // Calculate performance scores
  const getPerformanceScores = (tender: Tender) => {
    const costScore = Math.min(100, (1 - (tender.cost / tender.area.value) / 2000) * 100);
    const timeScore = Math.min(100, (1 - tender.duration / 24) * 100);
    const laborScore = Math.min(100, (1 - tender.labor / 300) * 100);
    const efficiencyScore = (tender.efficiency / 5) * 100;

    return {
      overall: (costScore + timeScore + laborScore + efficiencyScore) / 4,
      metrics: {
        costScore,
        timeScore,
        laborScore,
        efficiencyScore
      }
    };
  };

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Tender Insights & Comparisons</h1>
          <p className="text-gray-600">Compare and analyze tender data across different projects</p>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-4 border-b flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Filter size={20} className="text-gray-500" />
              <h2 className="text-lg font-semibold">Filters & Search</h2>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="text-gray-500 hover:text-gray-700"
            >
              {showFilters ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
          </div>
          
          {showFilters && (
            <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Type
                </label>
                <select
                  className="input-field"
                  value={filters.type}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                >
                  <option value="">All Types</option>
                  <option value="Residential">Residential</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Infrastructure">Infrastructure</option>
                  <option value="Industrial">Industrial</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <select
                  className="input-field"
                  value={filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                >
                  <option value="">All Locations</option>
                  {Array.from(new Set(tenders.map(t => t.location))).map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Year
                </label>
                <select
                  className="input-field"
                  value={filters.year}
                  onChange={(e) => handleFilterChange('year', e.target.value)}
                >
                  <option value="">All Years</option>
                  {Array.from(new Set(tenders.map(t => t.year))).sort().map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Search
                </label>
                <div className="relative">
                  <input
                    type="text"
                    className="input-field pl-10"
                    placeholder="Search projects..."
                    value={filters.searchQuery}
                    onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
                  />
                  <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Tender History Table */}
        <div className="bg-white rounded-lg shadow mb-6 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Select
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Project Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Year
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Area
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cost
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Labor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Efficiency
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTenders.map((tender) => (
                <tr key={tender.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedTenders.includes(tender.id)}
                      onChange={() => toggleTenderSelection(tender.id)}
                      className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{tender.projectName}</div>
                    <div className="text-sm text-gray-500">{tender.location}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {tender.year}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {tender.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {tender.area.value} {tender.area.unit}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatCurrency(tender.cost)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {tender.duration} months
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {tender.labor}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {renderEfficiencyStars(tender.efficiency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Comparison Section */}
        {selectedTenders.length > 0 && (
          <div className="bg-white rounded-lg shadow mb-6 p-6">
            <h2 className="text-xl font-semibold mb-4">Selected Projects Comparison</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {selectedTenders.map(tenderId => {
                const tender = tenders.find(t => t.id === tenderId)!;
                return (
                  <div key={tender.id} className="border rounded-lg p-4">
                    <h3 className="font-semibold text-lg mb-2">{tender.projectName}</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Area:</span>
                        <span>{tender.area.value} {tender.area.unit}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Cost:</span>
                        <span>{formatCurrency(tender.cost)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Duration:</span>
                        <span>{tender.duration} months</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Labor:</span>
                        <span>{tender.labor}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Efficiency:</span>
                        <span>{renderEfficiencyStars(tender.efficiency)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Materials:</span>
                        <span className="text-right">{tender.materialsUsed.join(', ')}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Enhanced Visualization Section */}
        <div className="bg-white rounded-lg shadow mb-6 p-6">
          <h2 className="text-xl font-semibold mb-4">Advanced Analytics</h2>
          
          {selectedTenders.length > 0 ? (
            <div className="space-y-8">
              {/* Performance Overview */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {selectedTenders.map(tenderId => {
                  const tender = tenders.find(t => t.id === tenderId)!;
                  const scores = getPerformanceScores(tender);
                  return (
                    <div key={tender.id} className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg p-6">
                      <h3 className="font-semibold text-lg mb-4">{tender.projectName}</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span>Overall Score</span>
                          <span className="text-2xl font-bold text-indigo-600">
                            {scores.overall.toFixed(1)}%
                          </span>
                        </div>
                        <div className="space-y-2">
                          {Object.entries(scores.metrics).map(([key, value]) => (
                            <div key={key} className="relative pt-1">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-600">
                                  {key.replace('Score', '')}
                                </span>
                                <span className="text-sm font-medium text-indigo-600">
                                  {value.toFixed(1)}%
                                </span>
                              </div>
                              <div className="overflow-hidden h-2 text-xs flex rounded bg-indigo-100">
                                <div
                                  className="bg-indigo-500"
                                  style={{ width: `${value}%` }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Materials Distribution */}
                <div className="h-80">
                  <h3 className="text-lg font-medium mb-4">Materials Distribution</h3>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={getComparisonData().materialsPieData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label
                      >
                        {getComparisonData().materialsPieData.map((entry, index) => (
                          <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Cost Breakdown */}
                <div className="h-80">
                  <h3 className="text-lg font-medium mb-4">Cost Breakdown Analysis</h3>
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart
                      data={getComparisonData().costBreakdown}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis tickFormatter={(value) => `₹${(value/10000000).toFixed(1)}Cr`} />
                      <Tooltip formatter={(value) => `₹${(value/10000000).toFixed(2)}Cr`} />
                      <Legend />
                      <Bar dataKey="laborCost" stackId="a" fill="#4F46E5" name="Labor Cost" />
                      <Bar dataKey="materialCost" stackId="a" fill="#2563EB" name="Material Cost" />
                      <Bar dataKey="otherCost" stackId="a" fill="#7C3AED" name="Other Costs" />
                      <Line type="monotone" dataKey="totalCost" stroke="#F59E0B" name="Total Cost" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Efficiency Trends */}
                <div className="h-80">
                  <h3 className="text-lg font-medium mb-4">Efficiency Metrics Comparison</h3>
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart
                      data={getComparisonData().efficiencyTrends}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="costPerLaborer" fill="#4F46E5" name="Cost per Laborer" />
                      <Line type="monotone" dataKey="timeEfficiency" stroke="#F59E0B" name="Time Efficiency" />
                      <Area type="monotone" dataKey="laborUtilization" fill="#10B981" stroke="#059669" name="Labor Utilization" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>

                {/* Existing Radar Chart with enhanced styling */}
                <div className="h-80">
                  <h3 className="text-lg font-medium mb-4">Project Performance Matrix</h3>
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={getComparisonData().efficiencyData}>
                      <PolarGrid gridType="circle" />
                      <PolarAngleAxis dataKey="name" />
                      <PolarRadiusAxis angle={30} domain={[0, 'auto']} />
                      <Radar name="Efficiency Score" dataKey="efficiency" stroke="#4F46E5" fill="#4F46E5" fillOpacity={0.6} />
                      <Radar name="Labor Efficiency" dataKey="laborEfficiency" stroke="#2563EB" fill="#2563EB" fillOpacity={0.6} />
                      <Radar name="Cost Efficiency" dataKey="costEfficiency" stroke="#7C3AED" fill="#7C3AED" fillOpacity={0.6} />
                      <Legend />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Enhanced Insights Section */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium mb-4">Advanced Insights</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedTenders.map(tenderId => {
                    const tender = tenders.find(t => t.id === tenderId)!;
                    const scores = getPerformanceScores(tender);
                    return (
                      <div key={tender.id} className="bg-white p-4 rounded-lg shadow-sm">
                        <h4 className="font-medium text-indigo-600 mb-2">{tender.projectName}</h4>
                        <ul className="space-y-2">
                          <li className="flex items-center text-sm">
                            {scores.metrics.costScore > 70 ? (
                              <TrendingDown className="text-green-500 mr-2" size={16} />
                            ) : (
                              <TrendingUp className="text-red-500 mr-2" size={16} />
                            )}
                            Cost Efficiency: {scores.metrics.costScore.toFixed(1)}% optimal
                          </li>
                          <li className="flex items-center text-sm">
                            {tender.duration < 12 ? (
                              <TrendingDown className="text-green-500 mr-2" size={16} />
                            ) : (
                              <TrendingUp className="text-red-500 mr-2" size={16} />
                            )}
                            Timeline: {tender.duration} months ({tender.duration < 12 ? 'On track' : 'Extended'})
                          </li>
                          <li className="flex items-center text-sm">
                            {scores.metrics.laborScore > 70 ? (
                              <TrendingDown className="text-green-500 mr-2" size={16} />
                            ) : (
                              <TrendingUp className="text-red-500 mr-2" size={16} />
                            )}
                            Resource Utilization: {scores.metrics.laborScore.toFixed(1)}% efficient
                          </li>
                        </ul>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              Select projects from the table above to view detailed comparisons
            </div>
          )}
        </div>

        {/* Insights Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Key Insights</h2>
          <div className="space-y-4">
            {getInsights().map((insight, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg ${
                  insight.type === 'positive' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                }`}
              >
                {insight.text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenderComparisonPage; 