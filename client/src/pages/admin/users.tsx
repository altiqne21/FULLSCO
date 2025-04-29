import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useIsMobile } from '@/hooks/use-mobile';
import Sidebar from '@/components/admin/sidebar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Menu } from 'lucide-react';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { User } from '@shared/schema';

export default function AdminUsers() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();
  const [searchQuery, setSearchQuery] = useState('');
  
  const { data: users = [], isLoading } = useQuery<User[]>({
    queryKey: ['/api/users'],
  });
  
  // تصفية المستخدمين بناءً على البحث
  const filteredUsers = users.filter(user => 
    user.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleSidebar = () => {
    console.log('Users: toggling sidebar');
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    console.log('Users: closing sidebar');
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <div className="flex flex-col md:flex-row">
        {/* Sidebar for desktop */}
        {!isMobile && <Sidebar isMobileOpen={false} onClose={() => {}} />}
        
        {/* Mobile Sidebar - always render but control visibility via props */}
        <Sidebar isMobileOpen={sidebarOpen} onClose={closeSidebar} />
        
        {/* Main Content */}
        <main className={`flex-1 p-4 md:p-6 ${!isMobile ? 'md:mr-64' : ''}`}>
          {/* Top Navigation */}
          <div className="flex items-center justify-between mb-6">
            {isMobile && (
              <Button 
                size="icon" 
                variant="ghost" 
                onClick={toggleSidebar} 
                className="text-muted-foreground"
              >
                <Menu className="h-6 w-6" />
              </Button>
            )}
            <h1 className="text-xl md:text-2xl font-bold">إدارة المستخدمين</h1>
          </div>
          
          {/* Search & Controls */}
          <Card className="mb-6">
            <CardHeader className="py-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <CardTitle className="text-lg">المستخدمين</CardTitle>
                <div className="relative w-full sm:w-64">
                  <Input
                    type="text"
                    placeholder="بحث عن مستخدم..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>
            </CardHeader>
          </Card>
          
          {/* Users Table */}
          <Card>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="p-8 text-center text-muted-foreground">جاري تحميل البيانات...</div>
              ) : filteredUsers.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  {searchQuery ? 'لا توجد نتائج مطابقة لبحثك' : 'لا يوجد مستخدمين حتى الآن'}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="whitespace-nowrap">الاسم الكامل</TableHead>
                        <TableHead className="whitespace-nowrap">اسم المستخدم</TableHead>
                        <TableHead className="whitespace-nowrap hidden md:table-cell">البريد الإلكتروني</TableHead>
                        <TableHead className="whitespace-nowrap">الدور</TableHead>
                        <TableHead className="whitespace-nowrap hidden md:table-cell">تاريخ الإنشاء</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.fullName || 'غير محدد'}</TableCell>
                          <TableCell>{user.username}</TableCell>
                          <TableCell className="hidden md:table-cell">{user.email}</TableCell>
                          <TableCell>
                            <Badge variant={user.role === 'admin' ? 'secondary' : 'outline'}>
                              {user.role === 'admin' ? 'مدير' : 'مستخدم'}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {new Date(user.createdAt || '').toLocaleDateString('ar-EG')}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Mobile View Summary */}
          <div className="mt-6 block md:hidden">
            <h2 className="text-lg font-semibold mb-3">ملخص البيانات</h2>
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <h3 className="text-sm text-muted-foreground mb-1">إجمالي المستخدمين</h3>
                  <p className="text-2xl font-bold">{filteredUsers.length}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <h3 className="text-sm text-muted-foreground mb-1">المدراء</h3>
                  <p className="text-2xl font-bold">
                    {filteredUsers.filter(user => user.role === 'admin').length}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}