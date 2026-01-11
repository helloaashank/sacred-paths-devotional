import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { FiEdit2, FiMapPin, FiCalendar, FiGrid, FiHeart, FiUserPlus, FiUserCheck } from "react-icons/fi";
import { GiMeditation } from "react-icons/gi";

interface PrivacySettings {
  profile_visibility: 'public' | 'followers_only' | 'private';
  followers_visible: boolean;
  likes_visible: boolean;
}

interface ProfileData {
  id: string;
  user_id: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  location: string | null;
  is_priest: boolean;
  priest_status: string;
  followers_count: number;
  following_count: number;
  posts_count: number;
  created_at: string;
  privacy_settings?: PrivacySettings | null;
}

interface Post {
  id: string;
  content_type: string;
  caption: string | null;
  media_url: string | null;
  thumbnail_url: string | null;
  likes_count: number;
  comments_count: number;
  created_at: string;
}

const Profile = () => {
  const { userId } = useParams<{ userId?: string }>();
  const navigate = useNavigate();
  const { user, profile: currentUserProfile } = useAuth();
  const { toast } = useToast();

  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [followLoading, setFollowLoading] = useState(false);

  const isOwnProfile = !userId || userId === user?.id;
  const targetUserId = userId || user?.id;

  useEffect(() => {
    if (!targetUserId) {
      navigate("/auth");
      return;
    }
    fetchProfileData();
    fetchPosts();
    if (user && !isOwnProfile) {
      checkFollowStatus();
    }
  }, [targetUserId, user]);

  const fetchProfileData = async () => {
    if (!targetUserId) return;
    
    // Check authentication - profiles require auth now
    if (!user) {
      setLoading(false);
      return;
    }
    
    const { data, error } = await supabase
      .from("profiles")
      .select("id, user_id, username, display_name, avatar_url, bio, location, is_priest, priest_status, followers_count, following_count, posts_count, created_at, privacy_settings")
      .eq("user_id", targetUserId)
      .maybeSingle();

    if (error) {
      console.error("Error fetching profile:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not load profile",
      });
    } else if (data) {
      // Cast privacy_settings from JSON
      const privacySettings = data.privacy_settings as unknown as PrivacySettings | null;
      
      // Filter sensitive data for non-owners based on privacy settings
      const filteredData: ProfileData = {
        ...data,
        privacy_settings: privacySettings,
        // Only show location if it's the user's own profile
        location: isOwnProfile ? data.location : null,
      };
      
      setProfileData(filteredData);
    }
    setLoading(false);
  };

  const fetchPosts = async () => {
    if (!targetUserId) return;

    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("user_id", targetUserId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching posts:", error);
    } else {
      setPosts(data || []);
    }
  };

  const checkFollowStatus = async () => {
    if (!user || !targetUserId) return;

    const { data } = await supabase
      .from("followers")
      .select("id")
      .eq("follower_id", user.id)
      .eq("following_id", targetUserId)
      .maybeSingle();

    setIsFollowing(!!data);
  };

  const handleFollow = async () => {
    if (!user || !targetUserId) {
      navigate("/auth");
      return;
    }

    setFollowLoading(true);

    if (isFollowing) {
      const { error } = await supabase
        .from("followers")
        .delete()
        .eq("follower_id", user.id)
        .eq("following_id", targetUserId);

      if (error) {
        toast({ variant: "destructive", title: "Error", description: "Could not unfollow" });
      } else {
        setIsFollowing(false);
        setProfileData((prev) =>
          prev ? { ...prev, followers_count: prev.followers_count - 1 } : null
        );
      }
    } else {
      const { error } = await supabase
        .from("followers")
        .insert({ follower_id: user.id, following_id: targetUserId });

      if (error) {
        toast({ variant: "destructive", title: "Error", description: "Could not follow" });
      } else {
        setIsFollowing(true);
        setProfileData((prev) =>
          prev ? { ...prev, followers_count: prev.followers_count + 1 } : null
        );
      }
    }

    setFollowLoading(false);
  };

  const getInitials = (name: string | null) => {
    if (!name) return "?";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="flex flex-col items-center justify-center h-64 px-4">
        <GiMeditation className="text-5xl text-muted-foreground mb-3" />
        <h2 className="text-lg font-semibold text-foreground mb-1">Profile not found</h2>
        <p className="text-sm text-muted-foreground mb-4">This user doesn't exist.</p>
        <Link to="/">
          <Button size="sm">Go Home</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="pb-4">
      {/* Profile Header - Compact */}
      <div className="px-4 pt-4">
        <div className="flex items-start gap-4 mb-4">
          {/* Avatar */}
          <Avatar className="h-20 w-20 border-2 border-primary/20">
            <AvatarImage src={profileData.avatar_url || undefined} />
            <AvatarFallback className="text-xl bg-gradient-hero text-primary-foreground">
              {getInitials(profileData.display_name)}
            </AvatarFallback>
          </Avatar>

          {/* Stats Row */}
          <div className="flex-1 pt-2">
            <div className="flex justify-around text-center">
              <div>
                <p className="font-bold text-lg text-foreground">{profileData.posts_count}</p>
                <p className="text-[10px] text-muted-foreground uppercase">Posts</p>
              </div>
              <div>
                <p className="font-bold text-lg text-foreground">{profileData.followers_count}</p>
                <p className="text-[10px] text-muted-foreground uppercase">Followers</p>
              </div>
              <div>
                <p className="font-bold text-lg text-foreground">{profileData.following_count}</p>
                <p className="text-[10px] text-muted-foreground uppercase">Following</p>
              </div>
            </div>
          </div>
        </div>

        {/* Name & Bio */}
        <div className="mb-3">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-foreground">
              {profileData.display_name || "Anonymous"}
            </h1>
            {profileData.is_priest && profileData.priest_status === "approved" && (
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-medium rounded-full bg-primary/10 text-primary">
                <GiMeditation className="h-2.5 w-2.5" />
                Priest
              </span>
            )}
          </div>

          {profileData.username && (
            <p className="text-xs text-muted-foreground">@{profileData.username}</p>
          )}

          {profileData.bio && (
            <p className="text-sm text-foreground mt-2">{profileData.bio}</p>
          )}

          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mt-2">
            {profileData.location && (
              <span className="flex items-center gap-1">
                <FiMapPin className="h-3 w-3" />
                {profileData.location}
              </span>
            )}
            <span className="flex items-center gap-1">
              <FiCalendar className="h-3 w-3" />
              Joined {new Date(profileData.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
            </span>
          </div>
        </div>

        {/* Action Button */}
        {isOwnProfile ? (
          <Link to="/profile/edit" className="block">
            <Button variant="outline" className="w-full h-9 text-sm">
              <FiEdit2 className="mr-2 h-3.5 w-3.5" />
              Edit Profile
            </Button>
          </Link>
        ) : (
          <Button
            onClick={handleFollow}
            disabled={followLoading}
            className={`w-full h-9 text-sm ${isFollowing ? "" : "bg-gradient-hero"}`}
            variant={isFollowing ? "outline" : "default"}
          >
            {isFollowing ? (
              <>
                <FiUserCheck className="mr-2 h-3.5 w-3.5" />
                Following
              </>
            ) : (
              <>
                <FiUserPlus className="mr-2 h-3.5 w-3.5" />
                Follow
              </>
            )}
          </Button>
        )}
      </div>

      {/* Content Tabs */}
      <Tabs defaultValue="posts" className="mt-4">
        <TabsList className="w-full grid grid-cols-2 h-11 rounded-none border-b border-border bg-transparent">
          <TabsTrigger 
            value="posts" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none"
          >
            <FiGrid className="h-5 w-5" />
          </TabsTrigger>
          <TabsTrigger 
            value="liked"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none"
          >
            <FiHeart className="h-5 w-5" />
          </TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="mt-0">
          {posts.length === 0 ? (
            <div className="p-8 text-center">
              <GiMeditation className="mx-auto text-4xl text-muted-foreground/30 mb-3" />
              <p className="text-sm text-muted-foreground">No posts yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-0.5">
              {posts.map((post) => (
                <Link key={post.id} to={`/post/${post.id}`}>
                  <div className="aspect-square overflow-hidden bg-muted relative">
                    {post.thumbnail_url || post.media_url ? (
                      <img
                        src={post.thumbnail_url || post.media_url || ""}
                        alt={post.caption || "Post"}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center p-2">
                        <p className="text-[10px] text-muted-foreground line-clamp-3 text-center">
                          {post.caption || "Post"}
                        </p>
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="liked" className="mt-0">
          <div className="p-8 text-center">
            <FiHeart className="mx-auto text-4xl text-muted-foreground/30 mb-3" />
            <p className="text-sm text-muted-foreground">Liked posts will appear here</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
