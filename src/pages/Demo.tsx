import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Demo = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-4xl font-bold mb-4">Try Mint Rewards</h1>
      <p className="text-lg text-muted-foreground mb-6 max-w-md">
        Ready to see how Mint Rewards works? Register your brand and start earning rewards today.
      </p>
      <Button size="lg" onClick={() => navigate("/register")}>
        Get Started
      </Button>
    </div>
  );
};

export default Demo;
