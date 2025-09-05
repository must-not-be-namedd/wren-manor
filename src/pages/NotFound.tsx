import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { ManorButton } from "@/components/ui/manor-button";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-manor">
      <div className="text-center space-y-6 p-8">
        <div className="text-8xl mb-6">👻</div>
        <h1 className="font-manor text-4xl font-bold text-foreground mb-4">Lost in the Manor</h1>
        <p className="text-xl text-muted-foreground mb-6 font-body">
          The shadows have led you astray. This room does not exist in Wren Manor.
        </p>
        <ManorButton 
          onClick={() => navigate('/')}
          className="inline-flex items-center px-6 py-3 bg-gradient-blood text-primary-foreground rounded-lg font-manor font-medium transition-manor hover:shadow-blood hover:scale-105"
        >
          Return to the Manor
        </ManorButton>
      </div>
    </div>
  );
};

export default NotFound;
