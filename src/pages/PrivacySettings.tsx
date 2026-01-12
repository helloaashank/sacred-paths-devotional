import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { FiShield, FiEye, FiUsers, FiHeart, FiLock, FiGlobe, FiUserCheck } from "react-icons/fi";

interface PrivacySettings {
  profile_visibility: 'public' | 'followers_only' | 'private';
  followers_visible: boolean;
  likes_visible: boolean;
}

const DEFAULT_PRIVACY: PrivacySettings = {
  profile_visibility: 'public',
  followers_visible: true,
  likes_visible: false,
};

const PrivacySettingsPage = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();

  const [settings, setSettings] = useState<PrivacySettings>(DEFAULT_PRIVACY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
      return;
    }

    if (user) {
      fetchPrivacySettings();
    }
  }, [user, authLoading]);

  const fetchPrivacySettings = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("profiles")
      .select("privacy_settings")
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) {
      console.error("Error fetching privacy settings:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not load privacy settings",
      });
    } else if (data?.privacy_settings) {
      const ps = data.privacy_settings as unknown as PrivacySettings;
      setSettings({
        profile_visibility: ps.profile_visibility || DEFAULT_PRIVACY.profile_visibility,
        followers_visible: ps.followers_visible ?? DEFAULT_PRIVACY.followers_visible,
        likes_visible: ps.likes_visible ?? DEFAULT_PRIVACY.likes_visible,
      });
    }

    setLoading(false);
  };

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);

    const privacyData = {
      profile_visibility: settings.profile_visibility,
      followers_visible: settings.followers_visible,
      likes_visible: settings.likes_visible,
    };

    const { error } = await supabase
      .from("profiles")
      .update({ privacy_settings: privacyData })
      .eq("user_id", user.id);

    setSaving(false);

    if (error) {
      console.error("Error saving privacy settings:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not save privacy settings",
      });
    } else {
      toast({
        title: "Settings saved",
        description: "Your privacy preferences have been updated.",
      });
      navigate("/profile");
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="px-4 py-4 pb-8 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-full bg-primary/10">
          <FiShield className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">Privacy Settings</h1>
          <p className="text-sm text-muted-foreground">Control who can see your information</p>
        </div>
      </div>

      {/* Profile Visibility */}
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <FiEye className="h-4 w-4 text-primary" />
            Profile Visibility
          </CardTitle>
          <CardDescription className="text-xs">
            Choose who can view your profile information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={settings.profile_visibility}
            onValueChange={(value) => 
              setSettings({ ...settings, profile_visibility: value as PrivacySettings['profile_visibility'] })
            }
            className="space-y-3"
          >
            <div className="flex items-start space-x-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
              <RadioGroupItem value="public" id="public" className="mt-0.5" />
              <Label htmlFor="public" className="flex-1 cursor-pointer">
                <div className="flex items-center gap-2 mb-1">
                  <FiGlobe className="h-4 w-4 text-green-500" />
                  <span className="font-medium">Public</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Anyone can see your profile, bio, and public posts
                </p>
              </Label>
            </div>

            <div className="flex items-start space-x-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
              <RadioGroupItem value="followers_only" id="followers_only" className="mt-0.5" />
              <Label htmlFor="followers_only" className="flex-1 cursor-pointer">
                <div className="flex items-center gap-2 mb-1">
                  <FiUserCheck className="h-4 w-4 text-blue-500" />
                  <span className="font-medium">Followers Only</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Only your followers can see your full profile
                </p>
              </Label>
            </div>

            <div className="flex items-start space-x-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
              <RadioGroupItem value="private" id="private" className="mt-0.5" />
              <Label htmlFor="private" className="flex-1 cursor-pointer">
                <div className="flex items-center gap-2 mb-1">
                  <FiLock className="h-4 w-4 text-orange-500" />
                  <span className="font-medium">Private</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Only you can see your full profile details
                </p>
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Followers Visibility */}
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <FiUsers className="h-4 w-4 text-primary" />
            Followers & Following
          </CardTitle>
          <CardDescription className="text-xs">
            Control who can see your connections
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-3 rounded-lg border border-border">
            <div className="flex-1 pr-4">
              <Label htmlFor="followers-visible" className="font-medium cursor-pointer">
                Show followers list
              </Label>
              <p className="text-xs text-muted-foreground mt-1">
                Allow others to see who follows you and who you follow
              </p>
            </div>
            <Switch
              id="followers-visible"
              checked={settings.followers_visible}
              onCheckedChange={(checked) => 
                setSettings({ ...settings, followers_visible: checked })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Likes Visibility */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <FiHeart className="h-4 w-4 text-primary" />
            Like Activity
          </CardTitle>
          <CardDescription className="text-xs">
            Control who can see your likes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-3 rounded-lg border border-border">
            <div className="flex-1 pr-4">
              <Label htmlFor="likes-visible" className="font-medium cursor-pointer">
                Show my likes
              </Label>
              <p className="text-xs text-muted-foreground mt-1">
                Allow post owners to see when you like their content
              </p>
            </div>
            <Switch
              id="likes-visible"
              checked={settings.likes_visible}
              onCheckedChange={(checked) => 
                setSettings({ ...settings, likes_visible: checked })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <Button
        onClick={handleSave}
        disabled={saving}
        className="w-full bg-gradient-hero"
      >
        {saving ? "Saving..." : "Save Privacy Settings"}
      </Button>

      {/* Info Notice */}
      <p className="text-xs text-muted-foreground text-center mt-4 px-4">
        Your privacy is important to us. These settings help protect your personal information.
      </p>
    </div>
  );
};

export default PrivacySettingsPage;