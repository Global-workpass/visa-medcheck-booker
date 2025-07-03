
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, Search, Shield, Calendar } from "lucide-react";

const Navigation = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white shadow-md border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <Calendar className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">VisaMedCheck</span>
          </div>
          
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button 
                variant={isActive("/") ? "default" : "ghost"}
                className="flex items-center gap-2"
              >
                <Home className="w-4 h-4" />
                Book Appointment
              </Button>
            </Link>
            
            <Link to="/status">
              <Button 
                variant={isActive("/status") ? "default" : "ghost"}
                className="flex items-center gap-2"
              >
                <Search className="w-4 h-4" />
                Check Status
              </Button>
            </Link>
            
            <Link to="/admin">
              <Button 
                variant={isActive("/admin") ? "default" : "ghost"}
                className="flex items-center gap-2"
              >
                <Shield className="w-4 h-4" />
                Admin
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
