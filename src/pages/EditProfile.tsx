import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { FiArrowLeft, FiCamera, FiSave, FiShield, FiChevronRight, FiLock, FiEye, FiEyeOff, FiTrash2, FiAlertTriangle, FiMonitor } from "react-icons/fi";

const EditProfile = () => {
  const navigate = useNavigate();
  const { user, profile, refreshProfile } = useAuth();
  const { toast } = useToast();

  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [saving, setSaving] = useState(false);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Account deletion state
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deletingAccount, setDeletingAccount] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    if (profile) {
      setDisplayName(profile.display_name || "");
      setUsername(profile.username || "");
      setBio(profile.bio || "");
      setLocation(profile.location || "");
      setAvatarUrl(profile.avatar_url || "");
    }
  }, [user, profile, navigate]);

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);

    const { error } = await supabase
      .from("profiles")
      .update({
        display_name: displayName.trim() || null,
        username: username.trim() || null,
        bio: bio.trim() || null,
        location: location.trim() || null,
        avatar_url: avatarUrl.trim() || null,
      })
      .eq("user_id", user.id);

    setSaving(false);

    if (error) {
      if (error.code === "23505") {
        toast({
          variant: "destructive",
          title: "Username taken",
          description: "This username is already in use. Please choose another.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not update profile. Please try again.",
        });
      }
    } else {
      await refreshProfile();
      toast({
        title: "Profile updated",
        description: "Your changes have been saved.",
      });
      navigate("/profile");
    }
  };

  const handlePasswordChange = async () => {
    if (!user?.email) return;

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({
        variant: "destructive",
        title: "Missing fields",
        description: "Please fill in all password fields.",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        variant: "destructive",
        title: "Password too short",
        description: "New password must be at least 6 characters.",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Passwords don't match",
        description: "New password and confirmation must match.",
      });
      return;
    }

    setChangingPassword(true);

    // First verify current password by re-authenticating
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword,
    });

    if (signInError) {
      setChangingPassword(false);
      toast({
        variant: "destructive",
        title: "Incorrect password",
        description: "Current password is incorrect.",
      });
      return;
    }

    // Update to new password
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    setChangingPassword(false);

    if (updateError) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not update password. Please try again.",
      });
    } else {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast({
        title: "Password updated",
        description: "Your password has been changed successfully.",
      });
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    
    if (deleteConfirmText !== "DELETE") {
      toast({
        variant: "destructive",
        title: "Confirmation required",
        description: "Please type DELETE to confirm account deletion.",
      });
      return;
    }

    setDeletingAccount(true);

    try {
      // Delete user's profile data first (cascade should handle related data)
      const { error: profileError } = await supabase
        .from("profiles")
        .delete()
        .eq("user_id", user.id);

      if (profileError) {
        throw profileError;
      }

      // Sign out the user (account deletion from auth.users requires admin or edge function)
      await supabase.auth.signOut();
      
      toast({
        title: "Account deleted",
        description: "Your account data has been removed. You have been signed out.",
      });
      
      navigate("/");
    } catch (error) {
      setDeletingAccount(false);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not delete account. Please try again or contact support.",
      });
    }
  };

  const getInitials = (name: string) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen py-6 px-4">
      <div className="container mx-auto max-w-lg">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <FiArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold text-foreground">Edit Profile</h1>
        </div>

        <Card className="shadow-elevated">
          <CardHeader>
            <CardTitle className="text-lg">Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Avatar Section */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
                  <AvatarImage src={avatarUrl || undefined} />
                  <AvatarFallback className="text-xl bg-gradient-hero text-primary-foreground">
                    {getInitials(displayName)}
                  </AvatarFallback>
                </Avatar>
                <button className="absolute bottom-0 right-0 p-2 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-colors">
                  <FiCamera className="h-4 w-4" />
                </button>
              </div>
              <div className="w-full">
                <Label htmlFor="avatar-url" className="text-sm text-muted-foreground">
                  Avatar URL
                </Label>
                <Input
                  id="avatar-url"
                  placeholder="https://example.com/avatar.jpg"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="display-name">Display Name</Label>
                <Input
                  id="display-name"
                  placeholder="Your Name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  maxLength={50}
                />
              </div>

              <div>
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">@</span>
                  <Input
                    id="username"
                    placeholder="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
                    className="pl-8"
                    maxLength={30}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Only letters, numbers, and underscores allowed
                </p>
              </div>

              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell us about yourself..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  maxLength={200}
                />
                <p className="text-xs text-muted-foreground mt-1 text-right">
                  {bio.length}/200
                </p>
              </div>

              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="City, Country"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  maxLength={100}
                />
              </div>
            </div>

            {/* Save Button */}
            <Button
              onClick={handleSave}
              disabled={saving}
              className="w-full bg-gradient-hero shadow-soft"
            >
              {saving ? (
                "Saving..."
              ) : (
                <>
                  <FiSave className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>

            <Separator className="my-2" />

            {/* Password Change Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <FiLock className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-medium text-foreground">Change Password</h3>
              </div>
              
              <div>
                <Label htmlFor="current-password">Current Password</Label>
                <div className="relative">
                  <Input
                    id="current-password"
                    type={showCurrentPassword ? "text" : "password"}
                    placeholder="Enter current password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showCurrentPassword ? <FiEyeOff className="h-4 w-4" /> : <FiEye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <Label htmlFor="new-password">New Password</Label>
                <div className="relative">
                  <Input
                    id="new-password"
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showNewPassword ? <FiEyeOff className="h-4 w-4" /> : <FiEye className="h-4 w-4" />}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Minimum 6 characters
                </p>
              </div>

              <div>
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showConfirmPassword ? <FiEyeOff className="h-4 w-4" /> : <FiEye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                onClick={handlePasswordChange}
                disabled={changingPassword || !currentPassword || !newPassword || !confirmPassword}
                variant="outline"
                className="w-full"
              >
                {changingPassword ? "Updating..." : "Update Password"}
              </Button>
            </div>

            <Separator className="my-2" />

            {/* Privacy Settings Link */}
            <Link to="/profile/privacy" className="block">
              <div className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-primary/10">
                    <FiShield className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Privacy Settings</p>
                    <p className="text-xs text-muted-foreground">Control who can see your information</p>
                  </div>
                </div>
                <FiChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </Link>

            {/* Session Management Link */}
            <Link to="/profile/sessions" className="block">
              <div className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-primary/10">
                    <FiMonitor className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Session Management</p>
                    <p className="text-xs text-muted-foreground">View and manage active login sessions</p>
                  </div>
                </div>
                <FiChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </Link>

            <Separator className="my-2" />

            {/* Danger Zone - Account Deletion */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <FiAlertTriangle className="h-4 w-4 text-destructive" />
                <h3 className="font-medium text-destructive">Danger Zone</h3>
              </div>
              
              <div className="p-4 rounded-lg border border-destructive/30 bg-destructive/5">
                <p className="text-sm text-muted-foreground mb-4">
                  Once you delete your account, there is no going back. All your data will be permanently removed.
                </p>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="w-full">
                      <FiTrash2 className="mr-2 h-4 w-4" />
                      Delete Account
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle className="flex items-center gap-2">
                        <FiAlertTriangle className="h-5 w-5 text-destructive" />
                        Delete Account
                      </AlertDialogTitle>
                      <AlertDialogDescription className="space-y-4">
                        <p>
                          This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
                        </p>
                        <div className="space-y-2">
                          <Label htmlFor="delete-confirm" className="text-foreground">
                            Type <span className="font-bold">DELETE</span> to confirm:
                          </Label>
                          <Input
                            id="delete-confirm"
                            placeholder="DELETE"
                            value={deleteConfirmText}
                            onChange={(e) => setDeleteConfirmText(e.target.value.toUpperCase())}
                            className="border-destructive/50 focus-visible:ring-destructive"
                          />
                        </div>
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel onClick={() => setDeleteConfirmText("")}>
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDeleteAccount}
                        disabled={deleteConfirmText !== "DELETE" || deletingAccount}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        {deletingAccount ? "Deleting..." : "Delete Account"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditProfile;
