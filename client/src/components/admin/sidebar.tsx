import { Link, useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { 
  LayoutDashboard, 
  GraduationCap, 
  FileText, 
  Users, 
  Settings, 
  Search, 
  BarChart, 
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

const navItems: NavItem[] = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/scholarships', label: 'Scholarships', icon: GraduationCap },
  { href: '/admin/posts', label: 'Blog Posts', icon: FileText },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
  { href: '/admin/seo', label: 'SEO', icon: Search },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart },
];

const Sidebar = () => {
  const [location] = useLocation();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const isActive = (path: string) => location === path;

  return (
    <div className="w-64 bg-sidebar h-screen flex flex-col border-r border-sidebar-border">
      <div className="p-6">
        <Link href="/admin" className="flex items-center">
          <span className="text-xl font-bold text-sidebar-foreground">
            FULL<span className="text-sidebar-accent">SCO</span>
          </span>
          <span className="text-xs text-sidebar-foreground/60 ml-1">Admin</span>
        </Link>
      </div>
      
      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <a
              className={cn(
                "flex items-center px-3 py-2 text-sm rounded-md transition-colors",
                isActive(item.href)
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent/10 hover:text-sidebar-foreground"
              )}
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.label}
            </a>
          </Link>
        ))}
      </nav>
      
      <div className="p-4 border-t border-sidebar-border mt-auto">
        <Button 
          variant="outline" 
          className="w-full justify-start text-sidebar-foreground border-sidebar-border hover:bg-sidebar-accent/10 hover:text-sidebar-foreground"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
