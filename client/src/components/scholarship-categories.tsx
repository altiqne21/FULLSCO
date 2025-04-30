import { Link } from 'wouter';
import { 
  GraduationCap, 
  MapPin, 
  BookOpen, 
  BarChart, 
  Users, 
  Calendar, 
  ArrowLeft // Added ArrowLeft for RTL
} from 'lucide-react';

const categories = [
  {
    title: 'حسب المستوى الدراسي',
    description: 'بكالوريوس، ماجستير، دكتوراه',
    icon: GraduationCap,
    link: '/scholarships?type=degree'
  },
  {
    title: 'حسب الوجهة',
    description: 'أمريكا، بريطانيا، كندا، أستراليا، أوروبا',
    icon: MapPin,
    link: '/scholarships?type=destination'
  },
  {
    title: 'حسب التخصص',
    description: 'الهندسة، الطب، إدارة الأعمال، الفنون',
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
    title: 'حسب الأهلية',
    description: 'الطلاب الدوليون، جنسيات محددة',
    icon: Users,
    link: '/scholarships?type=eligibility'
  },
  {
    title: 'المواعيد النهائية القادمة',
    description: 'التقديم سيغلق قريباً',
    icon: Calendar,
    link: '/scholarships?type=deadline'
  }
];

const ScholarshipCategories = () => {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl mb-4">تصفح المنح الدراسية حسب الفئة</h2> {/* Translated */}
          <p className="text-gray-600 max-w-2xl mx-auto">ابحث عن فرص المنح الدراسية التي تتناسب مع اهتماماتك الأكاديمية، بلد الوجهة، أو المستوى الدراسي.</p> {/* Translated */}
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, index) => (
            <Link key={index} href={category.link}>
              <a className="group flex items-center p-4 bg-white rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-all">
                <div className="ml-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-primary group-hover:bg-primary group-hover:text-white"> {/* Changed mr-4 to ml-4 */} 
                  <category.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{category.title}</h3>
                  <p className="text-sm text-gray-600">{category.description}</p>
                </div>
                <ArrowLeft className="mr-auto text-gray-400 group-hover:text-primary h-4 w-4" /> {/* Changed ml-auto to mr-auto and used ArrowLeft */} 
              </a>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ScholarshipCategories;

