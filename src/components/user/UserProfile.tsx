import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, LogOut, Moon, Sun } from "lucide-react";
import { useState, useEffect } from "react";

interface UserProfileProps {
  user: {
    name: string;
    email: string;
    image: string;
    provider: string;
    role?: string;
    joinedAt?: string;
  };
}

const UserProfile = ({ user }: UserProfileProps) => {
  const [theme, setTheme] = useState("light");
  
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <div className="min-h-screen w-full flex justify-center items-center">
      <Button
        variant="ghost"
        onClick={() => window.history.back()}
        className="absolute top-6 left-6 z-50 p-2"
      >
        <ArrowLeft className="h-12 w-12" />
      </Button>
      <Card className="w-full h-full border-none shadow-none bg-transparent flex justify-center items-center">
        <CardContent className="flex flex-col items-center justify-center p-8 max-w-md w-full">
          <Avatar className="h-32 w-32 ring-4 ring-white dark:ring-slate-700 mb-6 shadow-lg">
            <AvatarImage src={user.image} alt={user.name} />
            <AvatarFallback className="text-2xl bg-gradient-to-br from-indigo-500 to-purple-500 text-white">
              {user.name[0]}
            </AvatarFallback>
          </Avatar>
          
          <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-gray-100 mb-2">
            {user.name}
          </h2>
          
          <p className="text-gray-600 dark:text-gray-300 text-center text-lg mb-6">
            {user.email}
          </p>
          
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            <Badge variant="outline" className="capitalize text-sm px-3 py-1">
              {user.provider}
            </Badge>
            {user.role && (
              <Badge variant="secondary" className="capitalize text-sm px-3 py-1">
                {user.role}
              </Badge>
            )}
          </div>
          
          {user.joinedAt && (
            <div className="mb-8 text-center">
              <p className="text-gray-600 dark:text-gray-300">
                Member since {new Date(user.joinedAt).toLocaleDateString()}
              </p>
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-sm">
            <Button
              variant="outline"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="rounded-full w-full sm:w-auto px-6 py-3"
            >
              {theme === "light" ? (
                <Moon className="h-4 w-4 mr-2" />
              ) : (
                <Sun className="h-4 w-4 mr-2" />
              )}
              {theme === "light" ? "Dark Mode" : "Light Mode"}
            </Button>
            
            <Button
              variant="outline"
              onClick={() => console.log("Sign out clicked")}
              className="rounded-full w-full sm:w-auto px-6 py-3"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfile;
