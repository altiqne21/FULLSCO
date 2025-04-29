import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Search, GraduationCap, BookOpen, Building, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Hero = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [, navigate] = useLocation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/scholarships?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <section className="bg-gradient-to-br from-primary-600 to-primary-800 py-12 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="mb-4 text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
            Find Your Perfect Scholarship Opportunity
          </h1>
          <p className="mb-8 text-lg text-primary-100">
            Discover thousands of scholarships worldwide and get guidance on how to apply successfully.
          </p>
          <div className="mx-auto max-w-lg">
            <form onSubmit={handleSearch} className="flex flex-wrap gap-2">
              <div className="relative flex-grow">
                <Input
                  type="text"
                  placeholder="Search scholarships by keyword, country, or field..."
                  className="w-full rounded-l-md border-0 py-3 pl-4 pr-10 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
              </div>
              <Button type="submit" className="rounded-r-md bg-accent px-4 py-3 font-medium text-white hover:bg-accent-600">
                Search
              </Button>
            </form>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <span className="inline-flex items-center rounded-full bg-white/20 px-3 py-1 text-sm text-white">
                <GraduationCap className="mr-1 h-4 w-4" /> PhD
              </span>
              <span className="inline-flex items-center rounded-full bg-white/20 px-3 py-1 text-sm text-white">
                <BookOpen className="mr-1 h-4 w-4" /> Masters
              </span>
              <span className="inline-flex items-center rounded-full bg-white/20 px-3 py-1 text-sm text-white">
                <Building className="mr-1 h-4 w-4" /> Undergraduate
              </span>
              <span className="inline-flex items-center rounded-full bg-white/20 px-3 py-1 text-sm text-white">
                <DollarSign className="mr-1 h-4 w-4" /> Full Funding
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
