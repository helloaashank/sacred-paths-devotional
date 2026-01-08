import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { FiEdit2, FiMapPin, FiCalendar, FiGrid, FiHeart, FiSettings, FiUserPlus, FiUserCheck } from "react-icons/fi";
import { GiMeditation } from "react-icons/gi";

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
    
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", targetUserId)
      .maybeSingle();

    if (error) {
      console.error("Error fetching profile:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not load profile",
      });
    } else {
      setProfileData(data);
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
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <GiMeditation className="text-6xl text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold text-foreground mb-2">Profile not found</h2>
        <p className="text-muted-foreground mb-4">This user doesn't exist or has been removed.</p>
        <Link to="/">
          <Button>Go Home</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-8">
      {/* Profile Header */}
      <div className="bg-gradient-hero h-32 sm:h-40" />
      
      <div className="container mx-auto px-4 -mt-16">
        <Card className="shadow-elevated">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
              {/* Avatar */}
              <div className="flex justify-center sm:justify-start">
                <Avatar className="h-24 w-24 sm:h-32 sm:w-32 border-4 border-background shadow-lg">
                  <AvatarImage src={profileData.avatar_url || undefined} />
                  <AvatarFallback className="text-2xl bg-gradient-hero text-primary-foreground">
                    {getInitials(profileData.display_name)}
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* Info */}
              <div className="flex-1 text-center sm:text-left">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2">
                  <h1 className="text-xl sm:text-2xl font-bold text-foreground">
                    {profileData.display_name || "Anonymous"}
                  </h1>
                  {profileData.is_priest && profileData.priest_status === "approved" && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary">
                      <GiMeditation className="h-3 w-3" />
                      Verified Priest
                    </span>
                  )}
                </div>

                {profileData.username && (
                  <p className="text-sm text-muted-foreground mb-2">@{profileData.username}</p>
                )}

                {profileData.bio && (
                  <p className="text-sm text-foreground mb-3">{profileData.bio}</p>
                )}

                <div className="flex flex-wrap justify-center sm:justify-start gap-4 text-sm text-muted-foreground mb-4">
                  {profileData.location && (
                    <span className="flex items-center gap-1">
                      <FiMapPin className="h-4 w-4" />
                      {profileData.location}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <FiCalendar className="h-4 w-4" />
                    Joined {new Date(profileData.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                  </span>
                </div>

                {/* Stats */}
                <div className="flex justify-center sm:justify-start gap-6 mb-4">
                  <div className="text-center">
                    <p className="font-bold text-foreground">{profileData.posts_count}</p>
                    <p className="text-xs text-muted-foreground">Posts</p>
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-foreground">{profileData.followers_count}</p>
                    <p className="text-xs text-muted-foreground">Followers</p>
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-foreground">{profileData.following_count}</p>
                    <p className="text-xs text-muted-foreground">Following</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-center sm:justify-start gap-2">
                  {isOwnProfile ? (
                    <>
                      <Link to="/profile/edit">
                        <Button variant="outline" size="sm">
                          <FiEdit2 className="mr-2 h-4 w-4" />
                          Edit Profile
                        </Button>
                      </Link>
                      <Link to="/settings">
                        <Button variant="ghost" size="sm">
                          <FiSettings className="h-4 w-4" />
                        </Button>
                      </Link>
                    </>
                  ) : (
                    <Button
                      onClick={handleFollow}
                      disabled={followLoading}
                      variant={isFollowing ? "outline" : "default"}
                      className={isFollowing ? "" : "bg-gradient-hero"}
                    >
                      {isFollowing ? (
                        <>
                          <FiUserCheck className="mr-2 h-4 w-4" />
                          Following
                        </>
                      ) : (
                        <>
                          <FiUserPlus className="mr-2 h-4 w-4" />
                          Follow
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content Tabs */}
        <Tabs defaultValue="posts" className="mt-6">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="posts" className="flex items-center gap-2">
              <FiGrid className="h-4 w-4" />
              Posts
            </TabsTrigger>
            <TabsTrigger value="liked" className="flex items-center gap-2">
              <FiHeart className="h-4 w-4" />
              Liked
            </TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="mt-4">
            {posts.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <GiMeditation className="mx-auto text-4xl text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">No posts yet</p>
                  {isOwnProfile && (
                    <Link to="/create-post">
                      <Button className="mt-4 bg-gradient-hero">Create Your First Post</Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
                {posts.map((post) => (
                  <Link key={post.id} to={`/post/${post.id}`}>
                    <Card className="aspect-square overflow-hidden group cursor-pointer">
                      {post.thumbnail_url || post.media_url ? (
                        <img
                          src={post.thumbnail_url || post.media_url || ""}
                          alt={post.caption || "Post"}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-muted p-4">
                          <p className="text-sm text-muted-foreground line-clamp-4 text-center">
                            {post.caption || "Text post"}
                          </p>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 text-white">
                        <span className="flex items-center gap-1">
                          <FiHeart /> {post.likes_count}
                        </span>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="liked" className="mt-4">
            <Card>
              <CardContent className="p-8 text-center">
                <FiHeart className="mx-auto text-4xl text-muted-foreground mb-3" />
                <p className="text-muted-foreground">Liked posts will appear here</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
