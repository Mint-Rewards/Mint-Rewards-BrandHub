import { Settings } from "lucide-react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

const SettingsTab: React.FC<{
  name: string;
  category: string;
  contactEmail: string;
  contactPhone: string;
}> = ({ name, category, contactEmail, contactPhone }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Brand Settings</CardTitle>
        <CardDescription>
          Manage your brand profile and preferences
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Brand Name
              </p>
              <p className="text-lg">{name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Category
              </p>
              <p className="text-lg">{category}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Contact Email
              </p>
              <p className="text-lg">{contactEmail}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Contact Phone
              </p>
              <p className="text-lg">{contactPhone}</p>
            </div>
          </div>
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SettingsTab;
