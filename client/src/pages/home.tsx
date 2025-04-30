import { Helmet } from 'react-helmet'; // Import Helmet
import Hero from '@/components/hero';
import FeaturedScholarships from '@/components/featured-scholarships';
import ScholarshipCategories from '@/components/scholarship-categories';
import LatestArticles from '@/components/latest-articles';
import SuccessStories from '@/components/success-stories';
import Newsletter from '@/components/newsletter';
import AdminPreview from '@/components/admin-preview';

const Home = () => {
  // Removed useEffect for metadata, using Helmet instead

  return (
    <>
      <Helmet>
        <title>FULLSCO - ابحث عن فرصة المنحة الدراسية المثالية لك</title>
        <meta name="description" content="اكتشف آلاف المنح الدراسية حول العالم واحصل على إرشادات حول كيفية التقديم بنجاح." />
        <meta name="keywords" content="منح دراسية, منح مجانية, الدراسة في الخارج, قبول جامعي, FULLSCO" />
        <meta property="og:title" content="FULLSCO - ابحث عن فرصة المنحة الدراسية المثالية لك" />
        <meta property="og:description" content="اكتشف آلاف المنح الدراسية حول العالم واحصل على إرشادات حول كيفية التقديم بنجاح." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://fullsco.com/" /> {/* Assuming main domain */}
        <link rel="canonical" href="https://fullsco.com/" /> {/* Assuming main domain */}
      </Helmet>
      <main>
        <Hero />
        <FeaturedScholarships />
        <ScholarshipCategories />
        <LatestArticles />
        <SuccessStories />
        <Newsletter />
        <AdminPreview />
      </main>
    </>
  );
};

export default Home;

