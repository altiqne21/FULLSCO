import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { ArrowLeft } from 'lucide-react'; // Changed ArrowRight to ArrowLeft for RTL
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SuccessStory } from '@shared/schema';

const SuccessStories = () => {
  const { data: stories, isLoading, error } = useQuery<SuccessStory[]>({
    queryKey: ['/api/success-stories'],
  });

  if (isLoading) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl mb-4">قصص نجاح</h2> {/* Translated */}
            <p className="text-gray-600 max-w-2xl mx-auto">اقرأ كيف نجح طلاب آخرون في الحصول على منح دراسية ومتابعة أحلامهم الأكاديمية.</p> {/* Translated */}
          </div>
          <div className="grid gap-8 md:grid-cols-2">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 flex flex-col md:flex-row animate-pulse">
                <div className="md:w-2/5 bg-gray-200 h-64"></div>
                <div className="p-6 md:w-3/5">
                  <div className="h-4 w-24 bg-gray-200 mb-2 rounded"></div>
                  <div className="h-6 w-48 bg-gray-200 mb-2 rounded"></div>
                  <div className="h-4 w-40 bg-gray-200 mb-3 rounded"></div>
                  <div className="h-24 bg-gray-200 mb-4 rounded"></div>
                  <div className="h-4 w-32 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error || !stories || stories.length === 0) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl mb-4">قصص نجاح</h2> {/* Translated */}
            <p className="text-gray-600 max-w-2xl mx-auto mb-4">اقرأ كيف نجح طلاب آخرون في الحصول على منح دراسية ومتابعة أحلامهم الأكاديمية.</p> {/* Translated */}
            {error && <p className="text-red-500">فشل تحميل قصص النجاح. يرجى المحاولة مرة أخرى لاحقاً.</p>} {/* Translated */}
            {!error && (!stories || stories.length === 0) && <p className="text-gray-500">لا توجد قصص نجاح لعرضها حالياً.</p>} {/* Added message for no stories */}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl mb-4">قصص نجاح</h2> {/* Translated */}
          <p className="text-gray-600 max-w-2xl mx-auto">اقرأ كيف نجح طلاب آخرون في الحصول على منح دراسية ومتابعة أحلامهم الأكاديمية.</p> {/* Translated */}
        </div>
        
        <div className="grid gap-8 md:grid-cols-2">
          {stories.slice(0, 2).map((story) => (
            <div key={story.id} className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 flex flex-col md:flex-row">
              <div className="md:w-2/5">
                <img 
                  src={story.imageUrl || "https://randomuser.me/api/portraits/men/75.jpg"} // Fallback image
                  alt={story.name || 'صورة قصة نجاح'} // Translated fallback alt text
                  className="h-64 w-full object-cover md:h-full success-story-image"
                />
              </div>
              <div className="p-6 md:w-3/5">
                <Badge variant="primary" className="inline-block mb-2 rounded-full bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-800">
                  {story.scholarshipName} {/* Dynamic content - assumed to be in Arabic from API */}
                </Badge>
                <h3 className="text-xl font-bold mb-2">{story.name}</h3> {/* Dynamic content - assumed to be in Arabic from API */}
                <p className="text-sm text-gray-500 mb-3">{story.title}</p> {/* Dynamic content - assumed to be in Arabic from API */}
                <p className="text-gray-600 mb-4 line-clamp-4">
                  {story.content} {/* Dynamic content - assumed to be in Arabic from API */}
                </p>
                <Link href={`/success-stories/${story.slug}`}>
                  <a className="text-primary hover:text-primary-700 font-medium flex items-center text-sm">
                    اقرأ القصة كاملة <ArrowLeft className="mr-1 h-4 w-4" /> {/* Translated & RTL adjusted */}
                  </a>
                </Link>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 text-center">
          <Link href="/success-stories">
            <Button>
              عرض المزيد من قصص النجاح {/* Translated */}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SuccessStories;

