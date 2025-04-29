import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Sidebar from '@/components/admin/sidebar';
import { 
  BarChart2, 
  Users, 
  GraduationCap, 
  FileText, 
  PlusCircle, 
  Edit, 
  UserPlus,
  Eye,
  Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Link } from 'wouter';
import { formatNumber } from '@/lib/utils';

const AdminDashboard = () => {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/admin/login');
    }
  }, [authLoading, isAuthenticated, navigate]);

  // Fetch statistics
  const { data: scholarships } = useQuery({
    queryKey: ['/api/scholarships'],
    enabled: isAuthenticated,
  });

  const { data: posts } = useQuery({
    queryKey: ['/api/posts'],
    enabled: isAuthenticated,
  });

  const { data: users } = useQuery({
    queryKey: ['/api/users'],
    enabled: isAuthenticated,
  });

  const { data: subscribers } = useQuery({
    queryKey: ['/api/subscribers'],
    enabled: isAuthenticated,
  });

  if (authLoading || !isAuthenticated) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-100">Loading...</div>;
  }

  const stats = [
    {
      title: "Total Scholarships",
      value: scholarships?.length || 0,
      icon: GraduationCap,
      color: "bg-primary-100 text-primary"
    },
    {
      title: "Registered Users",
      value: users?.length || 0,
      icon: Users,
      color: "bg-accent-100 text-accent"
    },
    {
      title: "Blog Posts",
      value: posts?.length || 0,
      icon: FileText,
      color: "bg-secondary-100 text-secondary-500"
    },
    {
      title: "Subscribers",
      value: subscribers?.length || 0,
      icon: Users,
      color: "bg-green-100 text-green-600"
    }
  ];

  const recentActivity = [
    {
      type: "add",
      entity: "scholarship",
      title: "Gates Cambridge Scholarship",
      time: "2 hours ago",
      icon: PlusCircle,
      color: "bg-primary-100 text-primary"
    },
    {
      type: "edit",
      entity: "post",
      title: "Tips for Scholarship Interviews",
      time: "5 hours ago",
      icon: Edit,
      color: "bg-secondary-100 text-secondary-500"
    },
    {
      type: "add",
      entity: "user",
      title: "John Smith",
      time: "Yesterday",
      icon: UserPlus,
      color: "bg-accent-100 text-accent"
    },
    {
      type: "view",
      entity: "post",
      title: "How to Write a Winning Scholarship Essay",
      time: "2 days ago",
      icon: Eye,
      color: "bg-purple-100 text-purple-600"
    }
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      <Sidebar />
      
      <div className="flex-1 overflow-y-auto">
        <main className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
            <div className="flex items-center">
              <span className="text-sm text-gray-600 mr-3">Welcome, {user?.fullName || user?.username}</span>
              <Avatar>
                <AvatarImage src="https://randomuser.me/api/portraits/men/1.jpg" alt={user?.username} />
                <AvatarFallback>{user?.username?.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
            </div>
          </div>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className={`p-3 rounded-full ${stat.color} mr-4`}>
                      <stat.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{stat.title}</p>
                      <p className="text-2xl font-semibold">{formatNumber(stat.value)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Activity Feed */}
            <Card className="lg:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex p-2 rounded-md hover:bg-gray-50 transition-colors">
                      <div className={`w-10 h-10 rounded-full ${activity.color} flex items-center justify-center mr-3 shrink-0`}>
                        <activity.icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm">
                          <span className="font-medium">
                            {activity.type === 'add' && 'New'}
                            {activity.type === 'edit' && 'Updated'}
                            {activity.type === 'view' && 'Popular'}
                          </span>
                          {' '}
                          {activity.entity}: <span className="font-medium">{activity.title}</span>
                        </p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Quick Actions */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Link href="/admin/scholarships/create">
                    <Button className="w-full justify-start" variant="outline">
                      <PlusCircle className="mr-2 h-4 w-4" /> Add Scholarship
                    </Button>
                  </Link>
                  <Link href="/admin/posts/create">
                    <Button className="w-full justify-start" variant="outline">
                      <PlusCircle className="mr-2 h-4 w-4" /> Create Blog Post
                    </Button>
                  </Link>
                  <Link href="/admin/analytics">
                    <Button className="w-full justify-start" variant="outline">
                      <Activity className="mr-2 h-4 w-4" /> View Analytics
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Site Overview Chart */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Site Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center bg-gray-50 rounded-md border border-dashed border-gray-300">
                <div className="text-center">
                  <BarChart2 className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                  <p className="text-gray-600">Analytics data will be displayed here</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
