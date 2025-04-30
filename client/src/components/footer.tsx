import { Link } from "wouter";
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <div>
            <Link href="/" className="flex items-center mb-4">
              <span className="text-2xl font-bold">
                FULL<span className="text-accent">SCO</span>
              </span>
            </Link>
            <p className="text-gray-400 mb-4">
              دليلك الشامل لفرص المنح الدراسية حول العالم. نساعد الطلاب على إيجاد وتقديم طلبات المنح الدراسية لتحقيق أحلامهم الأكاديمية.
            </p>
            <div className="flex space-x-4">
              <div className="text-gray-400 hover:text-primary cursor-pointer">
                <Facebook className="h-5 w-5" />
              </div>
              <div className="text-gray-400 hover:text-primary cursor-pointer">
                <Twitter className="h-5 w-5" />
              </div>
              <div className="text-gray-400 hover:text-primary cursor-pointer">
                <Instagram className="h-5 w-5" />
              </div>
              <div className="text-gray-400 hover:text-primary cursor-pointer">
                <Linkedin className="h-5 w-5" />
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">روابط سريعة</h3>
            <ul className="space-y-2">
              <li>
                <div className="text-gray-400 hover:text-white cursor-pointer" onClick={() => window.location.href = '/'}>
                  الرئيسية
                </div>
              </li>
              <li>
                <div className="text-gray-400 hover:text-white cursor-pointer" onClick={() => window.location.href = '/scholarships'}>
                  المنح الدراسية
                </div>
              </li>
              <li>
                <div className="text-gray-400 hover:text-white cursor-pointer" onClick={() => window.location.href = '/articles'}>
                  المدونة
                </div>
              </li>
              <li>
                <div className="text-gray-400 hover:text-white cursor-pointer" onClick={() => window.location.href = '/success-stories'}>
                  قصص نجاح
                </div>
              </li>
              <li>
                <div className="text-gray-400 hover:text-white cursor-pointer" onClick={() => window.location.href = '/about'}>
                  من نحن
                </div>
              </li>
              <li>
                <div className="text-gray-400 hover:text-white cursor-pointer" onClick={() => window.location.href = '/contact'}>
                  اتصل بنا
                </div>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">المنح الدراسية</h3>
            <ul className="space-y-2">
              <li>
                <div className="text-gray-400 hover:text-white cursor-pointer" onClick={() => window.location.href = '/scholarships?level=bachelor'}>
                  المرحلة الجامعية
                </div>
              </li>
              <li>
                <div className="text-gray-400 hover:text-white cursor-pointer" onClick={() => window.location.href = '/scholarships?level=masters'}>
                  الماجستير
                </div>
              </li>
              <li>
                <div className="text-gray-400 hover:text-white cursor-pointer" onClick={() => window.location.href = '/scholarships?level=phd'}>
                  الدكتوراه
                </div>
              </li>
              <li>
                <div className="text-gray-400 hover:text-white cursor-pointer" onClick={() => window.location.href = '/scholarships?funded=true'}>
                  منح ممولة بالكامل
                </div>
              </li>
              <li>
                <div className="text-gray-400 hover:text-white cursor-pointer" onClick={() => window.location.href = '/scholarships'}>
                  حسب البلد
                </div>
              </li>
              <li>
                <div className="text-gray-400 hover:text-white cursor-pointer" onClick={() => window.location.href = '/scholarships?field=all'}>
                  حسب مجال الدراسة
                </div>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">اتصل بنا</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <Mail className="mr-2 mt-1 h-4 w-4 text-primary" />
                <span className="text-gray-400">info@fullsco.com</span>
              </li>
              <li className="flex items-start">
                <Phone className="mr-2 mt-1 h-4 w-4 text-primary" />
                <span className="text-gray-400">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-start">
                <MapPin className="mr-2 mt-1 h-4 w-4 text-primary" />
                <span className="text-gray-400">123 Education Lane, Academic City, CA 90210</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-6">
          <div className="flex flex-col md:flex-row md:justify-between items-center">
            <p className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} FULLSCO. All rights reserved.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <div 
                className="text-sm text-gray-400 hover:text-white cursor-pointer"
                onClick={() => window.location.href = '/privacy'}
              >
                سياسة الخصوصية
              </div>
              <div 
                className="text-sm text-gray-400 hover:text-white cursor-pointer"
                onClick={() => window.location.href = '/terms'}
              >
                شروط الاستخدام
              </div>
              <div 
                className="text-sm text-gray-400 hover:text-white cursor-pointer"
                onClick={() => window.location.href = '/cookies'}
              >
                سياسة ملفات تعريف الارتباط
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
