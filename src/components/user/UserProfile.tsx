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
    <div className="min-h-screen w-full flex items-center justify-center overflow-hidden">
      <Button
        variant="ghost"
        onClick={() => window.history.back()}
        className="absolute top-4 left-4 z-50 p-2"
      >
        <ArrowLeft className="h-6 w-6" />
      </Button>
      
      <div className="flex flex-col items-center justify-center p-4 max-w-sm w-full mx-4">
        <Avatar className="h-24 w-24 ring-2 ring-white dark:ring-slate-700 mb-4 shadow-lg">
          <AvatarImage src={user.image} alt={user.name} />
          <AvatarFallback className="text-xl bg-gradient-to-br from-indigo-500 to-purple-500 text-white">
            {user.name[0]}
          </AvatarFallback>
        </Avatar>
        
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-gray-100 mb-2">
          {user.name}
        </h2>
        
        <p className="text-gray-600 dark:text-gray-300 text-center text-base mb-4">
          {user.email}
        </p>
        
        <div className="flex flex-wrap justify-center gap-2 mb-4">
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
          <div className="mb-6 text-center">
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Member since {new Date(user.joinedAt).toLocaleDateString()}
            </p>
          </div>
        )}
        
        <div className="flex flex-col gap-3 w-full md:flex-row">
          <Button
            variant="outline"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="rounded-full w-full px-6 py-2"
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
            className="rounded-full w-full px-6 py-2"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
