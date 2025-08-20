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
        // Handle error appropriately in your UI
      }
    };

    fetchUserProfile();
  }, []);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen w-full bg-background">
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
    toast("Profile updated!");
  };

  const handleLogout = async () => {
    await Logout();
  };

  const handleDelete = () => {
    toast("Account deleted!");
    // Implement actual delete logic
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-background px-6 animate-fadeIn">
      {/* Avatar with animation */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Avatar className="w-28 h-28 mb-6">
          {user.profile_picture_url ? (
            <AvatarImage src={user.profile_picture_url} alt={fullName} />
          ) : (
            <AvatarFallback className="text-xl font-semibold">
              {fullName.charAt(0).toUpperCase()}
            </AvatarFallback>
          )}
        </Avatar>
      </motion.div>

      {/* Name + Username */}
      <motion.div
        className="text-center space-y-1 mb-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h1 className="text-3xl font-semibold">{fullName}</h1>
        <p className="text-sm text-muted-foreground">@{user.username}</p>
      </motion.div>

      {/* Badge */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        {user.has_active_premium ? (
          <Badge className="rounded-full px-3 py-1 bg-yellow-500/90 text-white">
            Premium Member
          </Badge>
        ) : (
          <Badge variant="secondary" className="rounded-full px-3 py-1">
            Free Plan
          </Badge>
        )}
      </motion.div>

      <Separator className="my-8 w-1/3" />

      {/* Info Section */}
      <div className="flex flex-col space-y-3 text-sm w-full max-w-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Email</span>
          <span className="font-medium">{user.email}</span>
        </div>
        {joinedDate && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Member Since</span>
            <span className="font-medium">{joinedDate}</span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-4 mt-8">
        {/* Edit Modal */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Edit Profile</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
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
              <Button onClick={handleSave}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Button variant="destructive" onClick={handleDelete}>
          Delete Account
        </Button>
        <Button variant="secondary" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </div>
  );
};

export default UserProfilePage;
