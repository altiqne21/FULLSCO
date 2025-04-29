import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { ArrowRight, Filter, DollarSign } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import SearchBar from '@/components/search-bar';
import { Scholarship, Level, Country, Category } from '@shared/schema';

const Scholarships = () => {
  const [location] = useLocation();
  const [filters, setFilters] = useState({
    country: '',
    level: '',
    category: '',
    funded: ''
  });

  // Parse query parameters
  useEffect(() => {
    const searchParams = new URLSearchParams(location.split('?')[1]);
    const countryParam = searchParams.get('country');
    const levelParam = searchParams.get('level');
    const categoryParam = searchParams.get('category');
    const fundedParam = searchParams.get('funded');
    
    setFilters({
      country: countryParam || '',
      level: levelParam || '',
      category: categoryParam || '',
      funded: fundedParam || ''
    });
    
    document.title = "FULLSCO - Browse Scholarships";
  }, [location]);

  // Fetch scholarships with filters
  const { data: scholarships, isLoading: isLoadingScholarships } = useQuery<Scholarship[]>({
    queryKey: ['/api/scholarships', filters],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      if (filters.country) queryParams.append('country', filters.country);
      if (filters.level) queryParams.append('level', filters.level);
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.funded === 'true') queryParams.append('funded', 'true');
      
      const response = await fetch(`/api/scholarships?${queryParams.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch scholarships');
      return response.json();
    }
  });

  // Fetch filter options
  const { data: countries } = useQuery<Country[]>({
    queryKey: ['/api/countries']
  });

  const { data: levels } = useQuery<Level[]>({
    queryKey: ['/api/levels']
  });

  const { data: categories } = useQuery<Category[]>({
    queryKey: ['/api/categories']
  });

  const getCountryName = (countryId?: number) => {
    if (!countryId || !countries) return '';
    const country = countries.find(c => c.id === countryId);
    return country?.name || '';
  };

  const getLevelName = (levelId?: number) => {
    if (!levelId || !levels) return '';
    const level = levels.find(l => l.id === levelId);
    return level?.name || '';
  };

  return (
    <main className="bg-gray-50 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Scholarships</h1>
          <p className="text-gray-600 max-w-3xl">
            Browse through our extensive collection of scholarships from around the world. Use the filters to find opportunities that match your profile and academic aspirations.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8 border border-gray-200">
          <div className="mb-6">
            <SearchBar placeholder="Search scholarships by keyword..." fullWidth buttonText="Search" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
              <Select 
                value={filters.country} 
                onValueChange={(value) => setFilters({...filters, country: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Countries" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Countries</SelectItem>
                  {countries?.map(country => (
                    <SelectItem key={country.id} value={country.id.toString()}>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Degree Level</label>
              <Select 
                value={filters.level} 
                onValueChange={(value) => setFilters({...filters, level: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Levels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Levels</SelectItem>
                  {levels?.map(level => (
                    <SelectItem key={level.id} value={level.id.toString()}>
                      {level.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <Select 
                value={filters.category} 
                onValueChange={(value) => setFilters({...filters, category: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Categories</SelectItem>
                  {categories?.map(category => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Funding</label>
              <Select 
                value={filters.funded} 
                onValueChange={(value) => setFilters({...filters, funded: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Any Funding" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any Funding</SelectItem>
                  <SelectItem value="true">Fully Funded Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="mt-4 flex justify-end">
            <Button variant="outline" className="mr-2" onClick={() => setFilters({ country: '', level: '', category: '', funded: '' })}>
              Reset Filters
            </Button>
            <Button className="flex items-center">
              <Filter className="mr-2 h-4 w-4" /> Apply Filters
            </Button>
          </div>
        </div>

        {/* Scholarships Grid */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {isLoadingScholarships ? 'Loading scholarships...' : `${scholarships?.length || 0} Scholarships Found`}
          </h2>
          
          {isLoadingScholarships ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-48 bg-gray-200"></div>
                  <CardContent className="p-5">
                    <div className="h-4 w-20 bg-gray-200 mb-2 rounded"></div>
                    <div className="h-6 w-3/4 bg-gray-200 mb-2 rounded"></div>
                    <div className="h-20 bg-gray-200 mb-4 rounded"></div>
                    <div className="flex justify-between">
                      <div className="h-4 w-24 bg-gray-200 rounded"></div>
                      <div className="h-4 w-24 bg-gray-200 rounded"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : scholarships && scholarships.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {scholarships.map((scholarship) => (
                <Card key={scholarship.id} className="group overflow-hidden">
                  <div className="relative">
                    <img 
                      src={scholarship.imageUrl || "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3"}
                      alt={scholarship.title}
                      className="h-48 w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <span className="absolute bottom-3 left-3 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">
                      Deadline: {scholarship.deadline || 'Ongoing'}
                    </span>
                    {scholarship.isFullyFunded && (
                      <span className="absolute right-3 top-3 rounded-full bg-secondary-500 px-3 py-1 text-xs font-semibold text-white">
                        Full Funding
                      </span>
                    )}
                  </div>
                  <CardContent className="p-5">
                    <div className="mb-2 flex items-center">
                      <Badge variant="country">{getCountryName(scholarship.countryId)}</Badge>
                      <span className="mx-2 h-1 w-1 rounded-full bg-gray-300"></span>
                      <Badge variant="secondary">{getLevelName(scholarship.levelId)}</Badge>
                    </div>
                    <h3 className="mb-2 text-xl font-bold text-gray-900 group-hover:text-primary">
                      <a href={`/scholarships/${scholarship.slug}`}>{scholarship.title}</a>
                    </h3>
                    <p className="mb-4 text-sm text-gray-600 line-clamp-2">
                      {scholarship.description}
                    </p>
                    <div className="mt-auto flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        <DollarSign className="mr-1 h-4 w-4 inline text-secondary-500" /> {scholarship.amount || 'Varies'}
                      </span>
                      <a href={`/scholarships/${scholarship.slug}`} className="flex items-center text-sm font-medium text-primary hover:text-primary-700">
                        Learn more <ArrowRight className="ml-1 h-4 w-4" />
                      </a>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No scholarships found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your filters or search criteria.</p>
              <Button onClick={() => setFilters({ country: '', level: '', category: '', funded: '' })}>
                Reset All Filters
              </Button>
            </div>
          )}
        </div>

        {/* Pagination (if needed) */}
        {scholarships && scholarships.length > 0 && (
          <div className="flex justify-center mt-8">
            <Button variant="outline" className="mx-1">Previous</Button>
            <Button variant="outline" className="mx-1 bg-primary text-white">1</Button>
            <Button variant="outline" className="mx-1">2</Button>
            <Button variant="outline" className="mx-1">3</Button>
            <Button variant="outline" className="mx-1">Next</Button>
          </div>
        )}
      </div>
    </main>
  );
};

export default Scholarships;
