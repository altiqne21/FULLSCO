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
              دليلك الشامل لفرص المنح الدراسية حول العالم. نساعد الطلاب في العثور على المنح الدراسية والتقديم عليها لتحقيق أحلامهم الأكاديمية.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">روابط سريعة</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/">
                  <a className="text-gray-400 hover:text-white">الرئيسية</a>
                </Link>
              </li>
              <li>
                <Link href="/scholarships">
                  <a className="text-gray-400 hover:text-white">المنح الدراسية</a>
                </Link>
              </li>
              <li>
                <Link href="/articles">
                  <a className="text-gray-400 hover:text-white">المدونة</a>
                </Link>
              </li>
              <li>
                <Link href="/success-stories">
                  <a className="text-gray-400 hover:text-white">قصص نجاح</a>
                </Link>
              </li>
              <li>
                <Link href="/about">
                  <a className="text-gray-400 hover:text-white">عن الموقع</a>
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <a className="text-gray-400 hover:text-white">اتصل بنا</a>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">المنح الدراسية</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/scholarships?level=bachelor">
                  <a className="text-gray-400 hover:text-white">بكالوريوس</a>
                </Link>
              </li>
              <li>
                <Link href="/scholarships?level=masters">
                  <a className="text-gray-400 hover:text-white">ماجستير</a>
                </Link>
              </li>
              <li>
                <Link href="/scholarships?level=phd">
                  <a className="text-gray-400 hover:text-white">دكتوراه</a>
                </Link>
              </li>
              <li>
                <Link href="/scholarships?funded=true">
                  <a className="text-gray-400 hover:text-white">تمويل كامل</a>
                </Link>
              </li>
              <li>
                <Link href="/scholarships">
                  <a className="text-gray-400 hover:text-white">حسب الدولة</a>
                </Link>
              </li>
              <li>
                <Link href="/scholarships?field=all">
                  <a className="text-gray-400 hover:text-white">حسب التخصص</a>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">اتصل بنا</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <Mail className="ml-2 mt-1 h-4 w-4 text-primary" /> {/* Changed mr-2 to ml-2 for RTL */} 
                <span className="text-gray-400">info@fullsco.com</span>
              </li>
              <li className="flex items-start">
                <Phone className="ml-2 mt-1 h-4 w-4 text-primary" /> {/* Changed mr-2 to ml-2 for RTL */} 
                <span className="text-gray-400">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-start">
                <MapPin className="ml-2 mt-1 h-4 w-4 text-primary" /> {/* Changed mr-2 to ml-2 for RTL */} 
                <span className="text-gray-400">123 Education Lane, Academic City, CA 90210</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-6">
          <div className="flex flex-col md:flex-row md:justify-between items-center">
            <p className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} FULLSCO. جميع الحقوق محفوظة.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link href="/privacy">
                <a className="text-sm text-gray-400 hover:text-white">سياسة الخصوصية</a>
              </Link>
              <Link href="/terms">
                <a className="text-sm text-gray-400 hover:text-white">شروط الخدمة</a>
              </Link>
              <Link href="/cookies">
                <a className="text-sm text-gray-400 hover:text-white">سياسة ملفات الارتباط</a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

