import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { type UserProfile } from "@/types/auth";
import { getUserProfileData } from "@/services/auth/profile";
import { Logout } from "@/services/auth/logout.service";
import { toast } from "sonner";

const UserProfilePage: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [editName, setEditName] = useState("");
  const [editUsername, setEditUsername] = useState("");
  const [editEmail, setEditEmail] = useState("");

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userData = await getUserProfileData();
        setUser(userData);
        setEditName(`${userData.first_name} ${userData.last_name}`);
        setEditUsername(userData.username);
        setEditEmail(userData.email);
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      }
    };
    fetchUserProfile();
  }, []);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen w-full bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
        <p className="text-muted-foreground">Loading profile...</p>
      </div>
    );
  }

  const fullName =
    (user.first_name + " " + (user.last_name || "")).trim() || user.username;

  const joinedDate = user.date_joined
    ? new Date(user.date_joined).toLocaleDateString("en-GB", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;

  const handleSave = () => {
    setUser(
      (prev) =>
        prev && {
          ...prev,
          first_name: editName.split(" ")[0] || "",
          last_name: editName.split(" ")[1] || "",
          username: editUsername,
          email: editEmail,
        }
    );
    toast.success("Profile updated!");
  };

  const handleLogout = async () => {
    await Logout();
  };

  const handleDelete = () => {
    toast.error("Account deleted!");
    // Implement actual delete logic
  };

  return (
    <div className="flex flex-col items-center min-h-screen w-full bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 px-4 py-12">
      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white dark:bg-gray-900 shadow-2xl rounded-3xl p-8 w-full max-w-md flex flex-col items-center border border-gray-100 dark:border-gray-800"
      >
        {/* Avatar */}
        <Avatar className="w-28 h-28 mb-6 ring-4 ring-indigo-400/40 dark:ring-indigo-500/50">
          {user.profile_picture_url ? (
            <AvatarImage src={user.profile_picture_url} alt={fullName} />
          ) : (
            <AvatarFallback className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
              {fullName.charAt(0).toUpperCase()}
            </AvatarFallback>
          )}
        </Avatar>

        {/* Name & Username */}
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-1">
          {fullName}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          @{user.username}
        </p>

        {/* Badge */}
        {user.has_active_premium ? (
          <Badge className="rounded-full px-4 py-1 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white mb-6 shadow-md">
            Premium Member
          </Badge>
        ) : (
          <Badge className="rounded-full px-4 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 mb-6 shadow-inner">
            Free Plan
          </Badge>
        )}

        <Separator className="my-4 w-full border-gray-200 dark:border-gray-700" />

        {/* Info Section */}
        <div className="w-full flex flex-col space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">Email</span>
            <span className="font-medium break-words text-gray-900 dark:text-white">
              {user.email}
            </span>
          </div>
          {joinedDate && (
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Member Since</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {joinedDate}
              </span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8 w-full">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="flex-1 border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900 transition-colors">
                Edit Profile
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Edit Profile</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <input
                  type="text"
                  className="input input-bordered w-full"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Full Name"
                />
                <input
                  type="text"
                  className="input input-bordered w-full"
                  value={editUsername}
                  onChange={(e) => setEditUsername(e.target.value)}
                  placeholder="Username"
                />
                <input
                  type="email"
                  className="input input-bordered w-full"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  placeholder="Email"
                />
              </div>
              <DialogFooter>
                <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                  Save Changes
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button
            className="flex-1 bg-red-500 hover:bg-red-600 text-white"
            onClick={handleDelete}
          >
            Delete Account
          </Button>

          <Button
            className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default UserProfilePage;
