import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useLocation } from 'wouter';
import { Eye, Calendar, UserCircle, Tag } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import SearchBar from '@/components/search-bar';
import { formatDate } from '@/lib/utils';
import { Post, User } from '@shared/schema';

const Articles = () => {
  const [location] = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Parse query parameters
  useEffect(() => {
    const searchParams = new URLSearchParams(location.split('?')[1]);
    const search = searchParams.get('search');
    if (search) setSearchTerm(search);
    
    document.title = "FULLSCO - Resources & Guides";
  }, [location]);

  // Fetch articles
  const { data: posts, isLoading } = useQuery<Post[]>({
    queryKey: ['/api/posts'],
  });

  // Fetch users (authors)
  const { data: users } = useQuery<User[]>({
    queryKey: ['/api/users'],
  });

  const getAuthorName = (authorId?: number) => {
    if (!authorId || !users) return 'FULLSCO Team';
    const author = users.find(u => u.id === authorId);
    return author?.fullName || 'FULLSCO Team';
  };
  
  // Filter posts based on search term
  const filteredPosts = posts?.filter(post => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      post.title.toLowerCase().includes(search) ||
      post.content.toLowerCase().includes(search) ||
      (post.excerpt && post.excerpt.toLowerCase().includes(search))
    );
  });

  return (
    <main className="bg-gray-50 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Articles & Resources</h1>
          <p className="text-gray-600 max-w-3xl">
            Explore our collection of guides, tips, and resources to help you navigate the scholarship application process successfully.
          </p>
        </div>

        {/* Search */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8 border border-gray-200">
          <SearchBar 
            placeholder="Search articles..." 
            fullWidth 
            buttonText="Search"
            className="max-w-xl"
          />
        </div>

        {/* Featured Articles */}
        {posts?.filter(post => post.isFeatured).length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {posts
                .filter(post => post.isFeatured)
                .slice(0, 2)
                .map(post => (
                  <Card key={post.id} className="overflow-hidden flex flex-col md:flex-row">
                    <div className="md:w-2/5">
                      <img 
                        src={post.imageUrl || "https://images.unsplash.com/photo-1517486808906-6ca8b3f8e1c1"}
                        alt={post.title}
                        className="h-48 md:h-full w-full object-cover"
                      />
                    </div>
                    <CardContent className="p-6 md:w-3/5">
                      <div className="mb-2 flex items-center">
                        <Badge variant="secondary" className="rounded-full">Featured</Badge>
                        <span className="mx-2 text-xs text-gray-500 flex items-center">
                          <Calendar className="mr-1 h-3 w-3" /> {formatDate(post.createdAt)}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        <Link href={`/articles/${post.slug}`}>
                          <a className="hover:text-primary">{post.title}</a>
                        </Link>
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {post.excerpt || post.content}
                      </p>
                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center">
                          <UserCircle className="h-4 w-4 mr-1 text-gray-500" />
                          <span className="text-sm text-gray-700">{getAuthorName(post.authorId)}</span>
                        </div>
                        <div className="flex items-center text-gray-500 text-sm">
                          <Eye className="h-4 w-4 mr-1" /> {post.views || 0} views
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        )}

        {/* All Articles */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">All Articles</h2>
            {searchTerm && (
              <p className="text-gray-600">
                Showing results for: <span className="font-medium">"{searchTerm}"</span>
              </p>
            )}
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-48 bg-gray-200"></div>
                  <CardContent className="p-5">
                    <div className="h-4 w-20 bg-gray-200 mb-2 rounded"></div>
                    <div className="h-6 w-3/4 bg-gray-200 mb-2 rounded"></div>
                    <div className="h-20 bg-gray-200 mb-4 rounded"></div>
                    <div className="flex justify-between">
                      <div className="h-4 w-24 bg-gray-200 rounded"></div>
                      <div className="h-4 w-16 bg-gray-200 rounded"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredPosts && filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map(post => (
                <Card key={post.id} className="overflow-hidden transition-all hover:shadow-md">
                  <img 
                    src={post.imageUrl || "https://images.unsplash.com/photo-1517486808906-6ca8b3f8e1c1"}
                    alt={post.title}
                    className="h-48 w-full object-cover article-card-image"
                  />
                  <CardContent className="p-5">
                    <div className="mb-2 flex items-center">
                      <Badge variant="secondary" className="rounded-full">Guide</Badge>
                      <span className="mx-2 text-xs text-gray-500 flex items-center">
                        <Calendar className="mr-1 h-3 w-3" /> {formatDate(post.createdAt)}
                      </span>
                      <span className="text-xs text-gray-500 flex items-center ml-auto">
                        <Eye className="mr-1 h-3 w-3" /> {post.views || 0}
                      </span>
                    </div>
                    <h3 className="mb-2 text-xl font-bold text-gray-900">
                      <Link href={`/articles/${post.slug}`}>
                        <a className="hover:text-primary">{post.title}</a>
                      </Link>
                    </h3>
                    <p className="mb-4 text-sm text-gray-600 line-clamp-3">
                      {post.excerpt || post.content}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700 flex items-center">
                        <UserCircle className="mr-1 h-4 w-4 text-gray-500" />
                        {getAuthorName(post.authorId)}
                      </span>
                      <Link href={`/articles/${post.slug}`}>
                        <Button variant="ghost" size="sm" className="text-primary hover:text-primary-700">
                          Read More
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
              <p className="text-gray-600 mb-6">We couldn't find any articles matching your search criteria.</p>
              {searchTerm && (
                <Button onClick={() => setSearchTerm('')}>
                  Clear Search
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Article Categories */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse by Category</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/articles?category=application-tips">
              <Button variant="outline" className="rounded-full">
                <Tag className="mr-2 h-4 w-4" /> Application Tips
              </Button>
            </Link>
            <Link href="/articles?category=essay-writing">
              <Button variant="outline" className="rounded-full">
                <Tag className="mr-2 h-4 w-4" /> Essay Writing
              </Button>
            </Link>
            <Link href="/articles?category=interviews">
              <Button variant="outline" className="rounded-full">
                <Tag className="mr-2 h-4 w-4" /> Interviews
              </Button>
            </Link>
            <Link href="/articles?category=financial-aid">
              <Button variant="outline" className="rounded-full">
                <Tag className="mr-2 h-4 w-4" /> Financial Aid
              </Button>
            </Link>
            <Link href="/articles?category=studying-abroad">
              <Button variant="outline" className="rounded-full">
                <Tag className="mr-2 h-4 w-4" /> Studying Abroad
              </Button>
            </Link>
            <Link href="/articles?category=research">
              <Button variant="outline" className="rounded-full">
                <Tag className="mr-2 h-4 w-4" /> Research
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Articles;
