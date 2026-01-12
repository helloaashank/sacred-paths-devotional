import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { FiArrowLeft, FiCamera, FiSave, FiShield, FiChevronRight } from "react-icons/fi";

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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditProfile;
