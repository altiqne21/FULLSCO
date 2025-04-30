import { Link } from 'wouter';
import { 
  GraduationCap, 
  MapPin, 
  BookOpen, 
  BarChart, 
  Users, 
  Calendar 
} from 'lucide-react';

const categories = [
  {
    title: 'حسب المستوى الدراسي',
    description: 'بكالوريوس، ماجستير، دكتوراه',
    icon: GraduationCap,
    link: '/scholarships?type=degree'
  },
  {
    title: 'حسب بلد الدراسة',
    description: 'أمريكا، بريطانيا، كندا، أستراليا، أوروبا',
    icon: MapPin,
    link: '/scholarships?type=destination'
  },
  {
    title: 'حسب التخصص',
    description: 'هندسة، طب، أعمال، فنون',
    icon: BookOpen,
    link: '/scholarships?type=field'
  },
  {
    title: 'حسب نوع التمويل',
    description: 'تمويل كامل، جزئي، منح بحثية',
    icon: BarChart,
    link: '/scholarships?type=funding'
  },
  {
    title: 'حسب شروط القبول',
    description: 'طلاب دوليين، جنسيات محددة',
    icon: Users,
    link: '/scholarships?type=eligibility'
  },
  {
    title: 'المواعيد القادمة',
    description: 'التقديم سينتهي قريبًا',
    icon: Calendar,
    link: '/scholarships?type=deadline'
  }
];

const ScholarshipCategories = () => {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl mb-4">تصفح المنح الدراسية حسب الفئة</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">ابحث عن فرص المنح الدراسية التي تناسب اهتماماتك الأكاديمية، البلد المضيف، أو المستوى الدراسي.</p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, index) => (
            <div key={index} className="group cursor-pointer" onClick={() => window.location.href = category.link}>
              <div className="flex items-center p-4 bg-white rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-all">
                <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-primary group-hover:bg-primary group-hover:text-white">
                  <category.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{category.title}</h3>
                  <p className="text-sm text-gray-600">{category.description}</p>
                </div>
                <ArrowRight className="ml-auto text-gray-400 group-hover:text-primary h-4 w-4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ArrowRight = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

export default ScholarshipCategories;
