import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  LayoutDashboard, 
  GraduationCap, 
  FileText, 
  User, 
  Settings, 
  Search, 
  BarChart,
  Plus, 
  Edit,
  UserPlus,
  PieChart,
  Lock
} from 'lucide-react';

const AdminPreview = () => {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center mb-10">
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl mb-4">لوحة تحكم قوية للمسؤول</h2> {/* Translated */}
          <p className="text-gray-600 max-w-2xl mx-auto">تجعل لوحة التحكم الشاملة الخاصة بنا إدارة المنح الدراسية والمحتوى وتحسين محركات البحث أمراً سهلاً.</p> {/* Translated */}
        </div>
        
        <div className="relative mx-auto max-w-4xl rounded-lg border border-gray-200 shadow-lg overflow-hidden">
          {/* Admin Dashboard Preview */}
          <div className="h-[500px] bg-gray-50 overflow-hidden">
            <div className="flex h-full">
              {/* Sidebar */}
              <div className="w-56 bg-gray-900 text-white p-4 hidden md:block">
                <div className="mb-6">
                  <span className="text-xl font-bold">FULL<span className="text-accent">SCO</span></span>
                  <span className="text-xs text-gray-400 mr-1">مسؤول</span> {/* Translated & RTL adjusted */}
                </div>
                
                <nav className="space-y-1">
                  <a href="#" className="flex items-center px-3 py-2 text-sm rounded-md bg-primary text-white font-medium">
                    <LayoutDashboard className="ml-2 h-4 w-4" /> لوحة التحكم {/* Translated & RTL adjusted */}
                  </a>
                  <a href="#" className="flex items-center px-3 py-2 text-sm rounded-md text-gray-300 hover:bg-gray-800">
                    <GraduationCap className="ml-2 h-4 w-4" /> المنح الدراسية {/* Translated & RTL adjusted */}
                  </a>
                  <a href="#" className="flex items-center px-3 py-2 text-sm rounded-md text-gray-300 hover:bg-gray-800">
                    <FileText className="ml-2 h-4 w-4" /> المقالات {/* Translated & RTL adjusted */}
                  </a>
                  <a href="#" className="flex items-center px-3 py-2 text-sm rounded-md text-gray-300 hover:bg-gray-800">
                    <User className="ml-2 h-4 w-4" /> المستخدمون {/* Translated & RTL adjusted */}
                  </a>
                  <a href="#" className="flex items-center px-3 py-2 text-sm rounded-md text-gray-300 hover:bg-gray-800">
                    <Settings className="ml-2 h-4 w-4" /> الإعدادات {/* Translated & RTL adjusted */}
                  </a>
                  <a href="#" className="flex items-center px-3 py-2 text-sm rounded-md text-gray-300 hover:bg-gray-800">
                    <Search className="ml-2 h-4 w-4" /> تحسين محركات البحث {/* Translated & RTL adjusted */}
                  </a>
                  <a href="#" className="flex items-center px-3 py-2 text-sm rounded-md text-gray-300 hover:bg-gray-800">
                    <BarChart className="ml-2 h-4 w-4" /> التحليلات {/* Translated & RTL adjusted */}
                  </a>
                </nav>
              </div>
              
              {/* Main Content */}
              <div className="flex-1 p-6 overflow-auto">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">نظرة عامة على لوحة التحكم</h3> {/* Translated */}
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">مرحباً، مسؤول</span> {/* Translated */}
                    <img 
                      src="https://randomuser.me/api/portraits/men/1.jpg" 
                      alt="Admin"
                      className="h-8 w-8 rounded-full"
                    />
                  </div>
                </div>
                
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center">
                        <div className="p-3 rounded-full bg-primary-100 text-primary ml-4"> {/* RTL adjusted */}
                          <GraduationCap className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">إجمالي المنح</p> {/* Translated */}
                          <p className="text-2xl font-semibold">1,250</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center">
                        <div className="p-3 rounded-full bg-accent-100 text-accent ml-4"> {/* RTL adjusted */}
                          <User className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">المستخدمون المسجلون</p> {/* Translated */}
                          <p className="text-2xl font-semibold">8,540</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center">
                        <div className="p-3 rounded-full bg-secondary-100 text-secondary-500 ml-4"> {/* RTL adjusted */}
                          <BarChart className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">إجمالي مشاهدات الصفحة</p> {/* Translated */}
                          <p className="text-2xl font-semibold">245,689</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Recent Activity */}
                <Card className="mb-6">
                  <CardContent className="p-4">
                    <h4 className="text-md font-semibold mb-4">النشاط الأخير</h4> {/* Translated */}
                    <div className="space-y-3">
                      <div className="flex items-center p-2 rounded-md hover:bg-gray-50">
                        <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary ml-3"> {/* RTL adjusted */}
                          <Plus className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm">تمت إضافة منحة جديدة: <span className="font-medium">منحة غيتس كامبريدج</span></p> {/* Translated */}
                          <p className="text-xs text-gray-500">منذ ساعتين</p> {/* Translated */}
                        </div>
                      </div>
                      
                      <div className="flex items-center p-2 rounded-md hover:bg-gray-50">
                        <div className="w-8 h-8 rounded-full bg-secondary-100 flex items-center justify-center text-secondary-500 ml-3"> {/* RTL adjusted */}
                          <Edit className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm">تم تحديث المقال: <span className="font-medium">نصائح لمقابلات المنح الدراسية</span></p> {/* Translated */}
                          <p className="text-xs text-gray-500">منذ 5 ساعات</p> {/* Translated */}
                        </div>
                      </div>
                      
                      <div className="flex items-center p-2 rounded-md hover:bg-gray-50">
                        <div className="w-8 h-8 rounded-full bg-accent-100 flex items-center justify-center text-accent ml-3"> {/* RTL adjusted */}
                          <UserPlus className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm">تسجيل مستخدم جديد: <span className="font-medium">جون سميث</span></p> {/* Translated */}
                          <p className="text-xs text-gray-500">بالأمس</p> {/* Translated */}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Quick Actions */}
                <Card>
                  <CardContent className="p-4">
                    <h4 className="text-md font-semibold mb-4">إجراءات سريعة</h4> {/* Translated */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <button className="p-3 flex flex-col items-center justify-center rounded-md border border-gray-200 hover:bg-gray-50 text-gray-700">
                        <Plus className="h-5 w-5 mb-1 text-primary" />
                        <span className="text-xs">إضافة منحة</span> {/* Translated */}
                      </button>
                      
                      <button className="p-3 flex flex-col items-center justify-center rounded-md border border-gray-200 hover:bg-gray-50 text-gray-700">
                        <FileText className="h-5 w-5 mb-1 text-primary" />
                        <span className="text-xs">إنشاء مقال</span> {/* Translated */}
                      </button>
                      
                      <button className="p-3 flex flex-col items-center justify-center rounded-md border border-gray-200 hover:bg-gray-50 text-gray-700">
                        <PieChart className="h-5 w-5 mb-1 text-primary" />
                        <span className="text-xs">عرض التقارير</span> {/* Translated */}
                      </button>
                      
                      <button className="p-3 flex flex-col items-center justify-center rounded-md border border-gray-200 hover:bg-gray-50 text-gray-700">
                        <Settings className="h-5 w-5 mb-1 text-primary" />
                        <span className="text-xs">الإعدادات</span> {/* Translated */}
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gray-900 bg-opacity-70 flex items-center justify-center">
            <div className="text-center p-6">
              <span className="inline-block mb-4 p-3 rounded-full bg-white/10">
                <Lock className="h-8 w-8 text-white" />
              </span>
              <h3 className="text-xl font-bold text-white mb-2">لوحة تحكم المسؤول</h3> {/* Translated */}
              <p className="text-white/80 mb-4 max-w-md">أدر المنح الدراسية والمحتوى وإعدادات تحسين محركات البحث باستخدام أدوات الإدارة القوية لدينا.</p> {/* Translated */}
              <Link href="/admin/login">
                <Button variant="accent">
                  اعرف المزيد {/* Translated */}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminPreview;

