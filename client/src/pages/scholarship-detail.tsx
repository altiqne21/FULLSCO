import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'wouter';
import { 
  ArrowRight, // Changed ArrowLeft to ArrowRight for RTL
  Calendar, 
  DollarSign, 
  Globe, 
  GraduationCap, 
  FileText, 
  ExternalLink 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import Newsletter from '@/components/newsletter';
import { Scholarship, Level, Country, Category } from '@shared/schema';
import { Helmet } from 'react-helmet'; // Import Helmet

// Helper function to generate JSON-LD structured data
const generateScholarshipSchema = (scholarship: Scholarship, countryName: string, levelName: string) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "EducationalOccupationalProgram",
    "name": scholarship.title,
    "description": scholarship.description,
    "url": `https://fullsco.com/scholarships/${scholarship.slug}`, // Replace with actual domain
    "provider": {
      "@type": "Organization",
      "name": "FULLSCO" // Placeholder - Ideally the actual scholarship provider
    },
    "educationalLevel": levelName,
    "programType": "Scholarship",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD" // Assuming USD, adjust if needed
    },
    "areaServed": {
      "@type": "Country",
      "name": countryName
    }
  };

  // Add deadline if it's a valid date
  if (scholarship.deadline && scholarship.deadline !== 'مستمر') {
    try {
      // Attempt to parse the deadline - This might need a robust date parsing library
      // For now, assuming a simple YYYY-MM-DD format might be present in the data
      const date = new Date(scholarship.deadline);
      if (!isNaN(date.getTime())) {
        // @ts-ignore
        schema.applicationDeadline = date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
      }
    } catch (e) {
      console.warn("Could not parse scholarship deadline for schema: ", scholarship.deadline);
    }
  }

  if (scholarship.imageUrl) {
    // @ts-ignore
    schema.image = scholarship.imageUrl;
  }

  return JSON.stringify(schema);
};

const ScholarshipDetail = () => {
  const { slug } = useParams();
  
  const { data: scholarship, isLoading, error } = useQuery<Scholarship>({
    queryKey: [`/api/scholarships/slug/${slug}`],
  });

  const { data: countries } = useQuery<Country[]>({
    queryKey: ['/api/countries'],
  });

  const { data: levels } = useQuery<Level[]>({
    queryKey: ['/api/levels'],
  });

  const { data: categories } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  const { data: relatedScholarships } = useQuery<Scholarship[]>({
    queryKey: ['/api/scholarships', { limit: 4 }], // Fetch 4 to ensure 3 related ones excluding current
    enabled: !!scholarship,
  });

  // Set page metadata (Legacy - kept for potential fallback, but Helmet is primary)
  useEffect(() => {
    if (scholarship) {
      document.title = `${scholarship.title} - منحة FULLSCO`; // Translated
      
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', scholarship.description);
      } else {
        const meta = document.createElement('meta');
        meta.name = 'description';
        meta.content = scholarship.description;
        document.head.appendChild(meta);
      }
    }
  }, [scholarship]);

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

  const getCategoryName = (categoryId?: number) => {
    if (!categoryId || !categories) return '';
    const category = categories.find(c => c.id === categoryId);
    return category?.name || '';
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="animate-pulse">
          <div className="h-8 w-64 bg-gray-200 rounded mb-4"></div>
          <div className="h-6 w-40 bg-gray-200 rounded mb-8"></div>
          <div className="h-64 bg-gray-200 rounded-lg mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="h-24 bg-gray-200 rounded"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
          </div>
          <div className="h-6 w-48 bg-gray-200 rounded mb-4"></div>
          <div className="h-32 bg-gray-200 rounded mb-8"></div>
        </div>
      </div>
    );
  }

  if (error || !scholarship) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-4xl text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">لم يتم العثور على المنحة</h1> {/* Translated */}
        <p className="text-gray-600 mb-8">لم نتمكن من العثور على المنحة التي تبحث عنها.</p> {/* Translated */}
        <Link href="/scholarships">
          <Button>
            <ArrowRight className="ml-2 h-4 w-4" /> العودة إلى المنح الدراسية {/* Translated & RTL adjusted */}
          </Button>
        </Link>
      </div>
    );
  }

  // Prepare data for schema
  const countryName = getCountryName(scholarship.countryId);
  const levelName = getLevelName(scholarship.levelId);
  const scholarshipSchema = generateScholarshipSchema(scholarship, countryName, levelName);

  return (
    <main className="bg-gray-50 py-12">
      {/* Add Helmet for SEO and Structured Data */}
      <Helmet>
        <title>{`${scholarship.title} | منحة دراسية | FULLSCO`}</title>
        <meta name="description" content={scholarship.description} />
        <meta name="keywords" content={`${scholarship.title}, منحة دراسية, ${countryName}, ${levelName}, ${getCategoryName(scholarship.categoryId)}, FULLSCO`} />
        <meta property="og:title" content={`${scholarship.title} | منحة دراسية | FULLSCO`} />
        <meta property="og:description" content={scholarship.description} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://fullsco.com/scholarships/${scholarship.slug}`} />
        {scholarship.imageUrl && <meta property="og:image" content={scholarship.imageUrl} />}
        <link rel="canonical" href={`https://fullsco.com/scholarships/${scholarship.slug}`} />
        {/* Inject JSON-LD Structured Data */}
        <script type="application/ld+json">
          {scholarshipSchema}
        </script>
      </Helmet>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link href="/scholarships">
            <Button variant="outline" className="mb-4">
              <ArrowRight className="ml-2 h-4 w-4" /> العودة إلى المنح الدراسية {/* Translated & RTL adjusted */}
            </Button>
          </Link>
          
          <div className="flex flex-wrap items-center mb-2">
            <Badge variant="country" className="ml-2 mb-2">{countryName}</Badge> {/* RTL adjusted */}
            <Badge variant="secondary" className="ml-2 mb-2">{levelName}</Badge> {/* RTL adjusted */}
            {scholarship.isFullyFunded && (
              <Badge variant="success" className="ml-2 mb-2">تمويل كامل</Badge> /* Translated & RTL adjusted */
            )}
            <Badge variant="outline" className="mb-2">{getCategoryName(scholarship.categoryId)}</Badge>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{scholarship.title}</h1>
        </div>
        
        {/* Hero image */}
        <div className="relative rounded-lg overflow-hidden mb-8 h-72">
          <img 
            src={scholarship.imageUrl || "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3"}
            alt={scholarship.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute bottom-4 right-4"> {/* RTL adjusted */}
            <span className="bg-primary text-white px-4 py-2 rounded-full text-sm font-semibold">
              الموعد النهائي: {scholarship.deadline || 'مستمر'} {/* Translated */}
            </span>
          </div>
        </div>
        
        {/* Key information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center mb-2">
                <Globe className="h-5 w-5 text-primary ml-2" /> {/* RTL adjusted */}
                <h3 className="font-semibold">الدولة المضيفة</h3> {/* Translated */}
              </div>
              <p>{countryName}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center mb-2">
                <GraduationCap className="h-5 w-5 text-primary ml-2" /> {/* RTL adjusted */}
                <h3 className="font-semibold">المستوى الدراسي</h3> {/* Translated */}
              </div>
              <p>{levelName}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center mb-2">
                <DollarSign className="h-5 w-5 text-primary ml-2" /> {/* RTL adjusted */}
                <h3 className="font-semibold">التمويل</h3> {/* Translated */}
              </div>
              <p>{scholarship.amount || 'متغير'}</p> {/* Translated */}
            </CardContent>
          </Card>
        </div>
        
        {/* Scholarship details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">الوصف</h2> {/* Translated */}
                <div className="prose max-w-none">
                  <p className="mb-6">{scholarship.description}</p>
                  
                  {scholarship.requirements && (
                    <>
                      <h3 className="text-xl font-bold mb-3">المتطلبات</h3> {/* Translated */}
                      <p className="mb-6">{scholarship.requirements}</p>
                    </>
                  )}
                  
                  <div className="mt-8">
                    <a 
                      href={scholarship.applicationLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex"
                    >
                      <Button className="ml-4" size="lg"> {/* RTL adjusted */}
                        قدم الآن <ExternalLink className="mr-2 h-4 w-4" /> {/* Translated & RTL adjusted */}
                      </Button>
                    </a>
                    
                    <Button variant="outline" size="lg">
                      <Calendar className="ml-2 h-4 w-4" /> أضف إلى التقويم {/* Translated & RTL adjusted */}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card className="mb-6">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-4">تواريخ هامة</h3> {/* Translated */}
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">الموعد النهائي للتقديم:</span> {/* Translated */}
                    <span className="font-medium">{scholarship.deadline || 'مستمر'}</span> {/* Translated */}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-4">شارك هذه المنحة</h3> {/* Translated */}
                <div className="flex space-x-3">
                  <Button variant="outline" size="sm" className="flex-1">
                    فيسبوك {/* Translated */}
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    تويتر {/* Translated */}
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    بريد إلكتروني {/* Translated */}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Related scholarships */}
        {relatedScholarships && relatedScholarships.length > 1 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">منح دراسية ذات صلة</h2> {/* Translated */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedScholarships
                .filter(s => s.id !== scholarship.id)
                .slice(0, 3)
                .map(relatedScholarship => (
                  <Card key={relatedScholarship.id} className="group overflow-hidden">
                    <div className="relative">
                      <img 
                        src={relatedScholarship.imageUrl || "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3"}
                        alt={relatedScholarship.title}
                        className="h-40 w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary mb-2">
                        <Link href={`/scholarships/${relatedScholarship.slug}`}>
                          <a>{relatedScholarship.title}</a>
                        </Link>
                      </h3>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">{getCountryName(relatedScholarship.countryId)}</Badge>
                        <Link href={`/scholarships/${relatedScholarship.slug}`}>
                          <a className="text-sm font-medium text-primary hover:text-primary-700">
                            التفاصيل {/* Translated */}
                          </a>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        )}
        
        {/* Application Resources */}
        <div className="mb-12">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start mb-4">
                <FileText className="h-6 w-6 text-primary ml-3 mt-1" /> {/* RTL adjusted */}
                <div>
                  <h3 className="text-lg font-bold mb-1">مصادر التقديم</h3> {/* Translated */}
                  <p className="text-gray-600">اطلع على أدلتنا حول كيفية التقديم على المنح الدراسية بنجاح.</p> {/* Translated */}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                <Link href="/articles/how-to-write-winning-scholarship-essay">
                  <Button variant="outline" className="w-full justify-start">
                    كتابة مقال منحة فائز {/* Translated */}
                  </Button>
                </Link>
                <Link href="/articles/common-scholarship-application-mistakes">
                  <Button variant="outlin
(Content truncated due to size limit. Use line ranges to read in chunks)