import { useEffect, useRef } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useParams, Link } from 'wouter';
import { queryClient } from '@/lib/queryClient';
import { Helmet } from 'react-helmet';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Eye, 
  Share2, 
  Bookmark, 
  MessageSquare, 
  Facebook, 
  Twitter, 
  Linkedin, 
  UserCircle 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import Newsletter from '@/components/newsletter';
import { formatDate, getInitials } from '@/lib/utils';
import { Post, User } from '@shared/schema';

const ArticleDetail = () => {
  const { slug } = useParams();
  const contentRef = useRef<HTMLDivElement>(null);
  
  const { data: post, isLoading, error } = useQuery<Post>({
    queryKey: [`/api/posts/slug/${slug}`],
  });

  const { data: users } = useQuery<User[]>({
    queryKey: ['/api/users'],
  });

  const { data: relatedPosts } = useQuery<Post[]>({
    queryKey: ['/api/posts', { limit: 3 }],
    enabled: !!post,
  });

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);
  
  // Set page metadata
  useEffect(() => {
    if (post) {
      // Scroll to top when post data loads
      window.scrollTo(0, 0);
    }
  }, [post]);

  const getAuthorName = (authorId?: number) => {
    if (!authorId || !users) return 'FULLSCO Team';
    const author = users.find(u => u.id === authorId);
    return author?.fullName || 'FULLSCO Team';
  };

  const getReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.trim().split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);
    return readingTime;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="animate-pulse">
          <div className="h-8 w-64 bg-gray-200 rounded mb-4"></div>
          <div className="h-6 w-40 bg-gray-200 rounded mb-8"></div>
          <div className="h-64 bg-gray-200 rounded-lg mb-8"></div>
          <div className="h-4 w-full bg-gray-200 rounded mb-2"></div>
          <div className="h-4 w-full bg-gray-200 rounded mb-2"></div>
          <div className="h-4 w-3/4 bg-gray-200 rounded mb-8"></div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-4xl text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Article Not Found</h1>
        <p className="text-gray-600 mb-8">We couldn't find the article you're looking for.</p>
        <Link href="/articles">
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Articles
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <main className="bg-gray-50 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="mb-6">
          <Link href="/articles">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Articles
            </Button>
          </Link>
          
          <Badge variant="secondary" className="mb-4">Guide</Badge>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{post.title}</h1>
          
          <div className="flex flex-wrap items-center text-sm text-gray-600 mb-8">
            <div className="flex items-center mr-4 mb-2">
              <Calendar className="h-4 w-4 mr-1" /> {formatDate(post.createdAt)}
            </div>
            <div className="flex items-center mr-4 mb-2">
              <Clock className="h-4 w-4 mr-1" /> {getReadingTime(post.content)} min read
            </div>
            <div className="flex items-center mb-2">
              <Eye className="h-4 w-4 mr-1" /> {post.views || 0} views
            </div>
          </div>
          
          {/* Author */}
          <div className="flex items-center mb-8">
            <Avatar className="h-10 w-10 mr-3">
              <AvatarImage src="https://randomuser.me/api/portraits/men/1.jpg" alt={getAuthorName(post.authorId)} />
              <AvatarFallback>{getInitials(getAuthorName(post.authorId))}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{getAuthorName(post.authorId)}</div>
              <div className="text-sm text-gray-500">Scholarship Expert</div>
            </div>
          </div>
        </div>
        
        {/* Featured image */}
        <div className="rounded-lg overflow-hidden mb-8">
          <img 
            src={post.imageUrl || "https://images.unsplash.com/photo-1517486808906-6ca8b3f8e1c1"}
            alt={post.title}
            className="w-full h-auto object-cover"
          />
        </div>
        
        {/* Article content */}
        <Card className="mb-8">
          <CardContent className="p-6 sm:p-8">
            <div className="prose max-w-none">
              {post.content.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-4">{paragraph}</p>
              ))}
            </div>
            
            {/* Share and save buttons */}
            <div className="flex flex-wrap gap-4 mt-8 pt-6 border-t border-gray-200">
              <Button variant="outline" size="sm" className="flex items-center">
                <Share2 className="h-4 w-4 mr-2" /> Share
              </Button>
              <Button variant="outline" size="sm" className="flex items-center">
                <Bookmark className="h-4 w-4 mr-2" /> Save
              </Button>
              <div className="flex items-center ml-auto space-x-2">
                <Button variant="outline" size="icon" className="rounded-full h-8 w-8 p-0">
                  <Facebook className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full h-8 w-8 p-0">
                  <Twitter className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full h-8 w-8 p-0">
                  <Linkedin className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Related articles */}
        {relatedPosts && relatedPosts.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts
                .filter(p => p.id !== post.id)
                .slice(0, 3)
                .map(relatedPost => (
                  <Card key={relatedPost.id} className="overflow-hidden">
                    <img 
                      src={relatedPost.imageUrl || "https://images.unsplash.com/photo-1517486808906-6ca8b3f8e1c1"}
                      alt={relatedPost.title}
                      className="h-40 w-full object-cover"
                    />
                    <CardContent className="p-4">
                      <h3 className="text-lg font-bold text-gray-900 hover:text-primary mb-2">
                        <Link href={`/articles/${relatedPost.slug}`}>
                          <a>{relatedPost.title}</a>
                        </Link>
                      </h3>
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-3 w-3 mr-1" /> {formatDate(relatedPost.createdAt)}
                        <span className="mx-2">•</span>
                        <UserCircle className="h-3 w-3 mr-1" /> {getAuthorName(relatedPost.authorId)}
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        )}
        
        {/* Newsletter */}
        <Newsletter />
      </div>
    </main>
  );
};

export default ArticleDetail;
