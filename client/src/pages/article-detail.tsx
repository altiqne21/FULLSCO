import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'wouter';
import { 
  ArrowRight, // Changed ArrowLeft to ArrowRight for RTL
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
import { Helmet } from 'react-helmet'; // Import Helmet

// Helper function to generate JSON-LD structured data for Article
const generateArticleSchema = (post: Post, authorName: string) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting", // Or "Article"
    "headline": post.title,
    "description": post.excerpt || post.content.substring(0, 160),
    "image": post.imageUrl || "https://images.unsplash.com/photo-1517486808906-6ca8b3f8e1c1", // Default image if none
    "author": {
      "@type": "Person",
      "name": authorName
    },
    "publisher": {
      "@type": "Organization",
      "name": "FULLSCO",
      "logo": {
        "@type": "ImageObject",
        "url": "https://fullsco.com/logo.png" // Replace with actual logo URL
      }
    },
    "datePublished": post.createdAt ? new Date(post.createdAt).toISOString() : undefined,
    "dateModified": post.updatedAt ? new Date(post.updatedAt).toISOString() : undefined,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://fullsco.com/articles/${post.slug}` // Replace with actual domain
    }
  };
  return JSON.stringify(schema);
};

const ArticleDetail = () => {
  const { slug } = useParams();
  
  const { data: post, isLoading, error } = useQuery<Post>({
    queryKey: [`/api/posts/slug/${slug}`],
  });

  const { data: users } = useQuery<User[]>({
    queryKey: ['/api/users'],
  });

  const { data: relatedPosts } = useQuery<Post[]>({
    queryKey: ['/api/posts', { limit: 4 }], // Fetch 4 to ensure 3 related ones excluding current
    enabled: !!post,
  });

  // Increment view count (this happens automatically on the API side)
  useEffect(() => {
    // Set page metadata (Legacy - kept for potential fallback, but Helmet is primary)
    if (post) {
      document.title = `${post.title} - مدونة FULLSCO`; // Translated
      
      const metaDescription = document.querySelector('meta[name="description"]');
      const descriptionContent = post.excerpt || post.content.substring(0, 160);
      if (metaDescription) {
        metaDescription.setAttribute('content', descriptionContent);
      } else {
        const meta = document.createElement('meta');
        meta.name = 'description';
        meta.content = descriptionContent;
        document.head.appendChild(meta);
      }
    }
  }, [post]);

  const getAuthorName = (authorId?: number) => {
    if (!authorId || !users) return 'فريق FULLSCO'; // Translated
    const author = users.find(u => u.id === authorId);
    return author?.fullName || 'فريق FULLSCO'; // Translated
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
        <h1 className="text-2xl font-bold text-gray-900 mb-4">لم يتم العثور على المقال</h1> {/* Translated */}
        <p className="text-gray-600 mb-8">لم نتمكن من العثور على المقال الذي تبحث عنه.</p> {/* Translated */}
        <Link href="/articles">
          <Button>
            <ArrowRight className="ml-2 h-4 w-4" /> العودة إلى المقالات {/* Translated & RTL adjusted */}
          </Button>
        </Link>
      </div>
    );
  }

  // Prepare data for schema
  const authorName = getAuthorName(post.authorId);
  const articleSchema = generateArticleSchema(post, authorName);

  return (
    <main className="bg-gray-50 py-12">
      {/* Add Helmet for SEO and Structured Data */}
      <Helmet>
        <title>{`${post.title} | مقال | FULLSCO`}</title>
        <meta name="description" content={post.excerpt || post.content.substring(0, 160)} />
        <meta name="keywords" content={`${post.title}, مقال, مدونة, نصائح منح دراسية, FULLSCO`} />
        <meta property="og:title" content={`${post.title} | مقال | FULLSCO`} />
        <meta property="og:description" content={post.excerpt || post.content.substring(0, 160)} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://fullsco.com/articles/${post.slug}`} />
        {post.imageUrl && <meta property="og:image" content={post.imageUrl} />}
        <link rel="canonical" href={`https://fullsco.com/articles/${post.slug}`} />
        {/* Inject JSON-LD Structured Data */}
        <script type="application/ld+json">
          {articleSchema}
        </script>
      </Helmet>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="mb-6">
          <Link href="/articles">
            <Button variant="outline" className="mb-4">
              <ArrowRight className="ml-2 h-4 w-4" /> العودة إلى المقالات {/* Translated & RTL adjusted */}
            </Button>
          </Link>
          
          <Badge variant="secondary" className="mb-4">دليل</Badge> {/* Translated */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{post.title}</h1>
          
          <div className="flex flex-wrap items-center text-sm text-gray-600 mb-8">
            <div className="flex items-center ml-4 mb-2"> {/* RTL adjusted */}
              <Calendar className="h-4 w-4 ml-1" /> {formatDate(post.createdAt)} {/* RTL adjusted */}
            </div>
            <div className="flex items-center ml-4 mb-2"> {/* RTL adjusted */}
              <Clock className="h-4 w-4 ml-1" /> {getReadingTime(post.content)} دقيقة قراءة {/* Translated & RTL adjusted */}
            </div>
            <div className="flex items-center mb-2">
              <Eye className="h-4 w-4 ml-1" /> {post.views || 0} مشاهدة {/* Translated & RTL adjusted */}
            </div>
          </div>
          
          {/* Author */}
          <div className="flex items-center mb-8">
            <Avatar className="h-10 w-10 ml-3"> {/* RTL adjusted */}
              <AvatarImage src="https://randomuser.me/api/portraits/men/1.jpg" alt={authorName} />
              <AvatarFallback>{getInitials(authorName)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{authorName}</div>
              <div className="text-sm text-gray-500">خبير منح دراسية</div> {/* Translated */}
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
                <Share2 className="h-4 w-4 ml-2" /> مشاركة {/* Translated & RTL adjusted */}
              </Button>
              <Button variant="outline" size="sm" className="flex items-center">
                <Bookmark className="h-4 w-4 ml-2" /> حفظ {/* Translated & RTL adjusted */}
              </Button>
              <div className="flex items-center mr-auto space-x-2"> {/* RTL adjusted */}
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
        {relatedPosts && relatedPosts.length > 1 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">مقالات ذات صلة</h2> {/* Translated */}
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
                        <Calendar className="h-3 w-3 ml-1" /> {formatDate(relatedPost.createdAt)} {/* RTL adjusted */}
                        <span className="mx-2">•</span>
                        <UserCircle className="h-3 w-3 ml-1" /> {getAuthorName(relatedPost.authorId)} {/* RTL adjusted */}
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

