import { Link, useLocation } from 'react-router-dom';
import { GraduationCap, Github, Twitter, Linkedin } from 'lucide-react';

export function Footer() {
  const location = useLocation();

  // Hide footer on auth pages
  if (location.pathname === '/signin' || location.pathname === '/signup') {
    return null;
  }

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <GraduationCap className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold">PlacementPrep</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Helping students ace their campus placements with company-specific preparation guides.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Platform</h3>
            <div className="space-y-2">
              <Link to="/companies" className="block text-sm text-muted-foreground hover:text-primary">
                Companies
              </Link>
              <Link to="/skill-mapper" className="block text-sm text-muted-foreground hover:text-primary">
                Skill Mapper
              </Link>
              <Link to="/mock-interview" className="block text-sm text-muted-foreground hover:text-primary">
                Mock Interview
              </Link>
              <Link to="/dashboard" className="block text-sm text-muted-foreground hover:text-primary">
                Dashboard
              </Link>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <div className="space-y-2">
              <a href="#" className="block text-sm text-muted-foreground hover:text-primary">
                Interview Tips
              </a>
              <a href="#" className="block text-sm text-muted-foreground hover:text-primary">
                Resume Builder
              </a>
              <a href="#" className="block text-sm text-muted-foreground hover:text-primary">
                Coding Practice
              </a>
              <a href="#" className="block text-sm text-muted-foreground hover:text-primary">
                Study Groups
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Connect</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 PlacementPrep. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}