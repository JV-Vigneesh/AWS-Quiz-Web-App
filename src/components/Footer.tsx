import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="w-full border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 mt-auto">
      <div className="container px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-3 text-foreground">QuizApp</h3>
            <p className="text-sm text-muted-foreground">
              Test your knowledge with our interactive quiz platform. 
              Challenge yourself and track your progress.
            </p>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-3 text-foreground">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/features" className="text-muted-foreground hover:text-primary transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-muted-foreground hover:text-primary transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-3 text-foreground">Contact</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Have questions? Reach out to us!
            </p>
            <Link to="/contact" className="text-sm text-primary hover:text-primary/80 transition-colors">
              Contact Us →
            </Link>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-border/40 text-center text-sm text-muted-foreground">
          <p>© 2025 QuizApp. Made by JV Vigneesh</p>
        </div>
      </div>
    </footer>
  );
};
