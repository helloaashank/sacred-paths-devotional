import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  FiHeart, 
  FiMessageCircle, 
  FiShare2, 
  FiMoreHorizontal,
  FiPlay,
  FiPause,
  FiVolume2,
  FiVolumeX,
  FiFlag
} from "react-icons/fi";
import { GiMeditation } from "react-icons/gi";

interface PostWithAuthor {
  id: string;
  user_id: string;
  content_type: string;
  caption: string | null;
  media_url: string | null;
  thumbnail_url: string | null;
  likes_count: number;
  comments_count: number;
  views_count: number;
  created_at: string;
  author: {
    display_name: string | null;
    username: string | null;
    avatar_url: string | null;
    is_priest: boolean;
    priest_status: string | null;
  } | null;
  hasLiked: boolean;
}

type FilterType = "latest" | "popular" | "bhajans" | "priests";

const Feed = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const observerRef = useRef<IntersectionObserver | null>(null);
  const videoRefs = useRef<Map<string, HTMLVideoElement>>(new Map());

  const [posts, setPosts] = useState<PostWithAuthor[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>("latest");
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);
  const [mutedVideos, setMutedVideos] = useState<Set<string>>(new Set());
  const [likeLoading, setLikeLoading] = useState<Set<string>>(new Set());

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("posts")
        .select(`
          id, user_id, content_type, caption, media_url, thumbnail_url,
          likes_count, comments_count, views_count, created_at
        `)
        .eq("is_active", true);

      // Apply filters
      switch (filter) {
        case "popular":
          query = query.order("likes_count", { ascending: false });
          break;
        case "bhajans":
          query = query.eq("content_type", "audio");
          break;
        case "latest":
        default:
          query = query.order("created_at", { ascending: false });
      }

      query = query.limit(50);

      const { data: postsData, error: postsError } = await query;

      if (postsError) throw postsError;

      if (!postsData || postsData.length === 0) {
        setPosts([]);
        setLoading(false);
        return;
      }

      // Fetch authors for posts
      const userIds = [...new Set(postsData.map((p) => p.user_id))];
      
      const { data: profilesData } = await supabase
        .from("profiles")
        .select("user_id, display_name, username, avatar_url, is_priest, priest_status")
        .in("user_id", userIds);

      // If priests filter, filter posts by priest authors
      let filteredPosts = postsData;
      if (filter === "priests") {
        const priestUserIds = profilesData
          ?.filter((p) => p.is_priest && p.priest_status === "approved")
          .map((p) => p.user_id) || [];
        filteredPosts = postsData.filter((p) => priestUserIds.includes(p.user_id));
      }

      // Check which posts user has liked
      let likedPostIds: string[] = [];
      if (user) {
        const { data: likesData } = await supabase
          .from("likes")
          .select("post_id")
          .eq("user_id", user.id)
          .in("post_id", filteredPosts.map((p) => p.id));
        likedPostIds = likesData?.map((l) => l.post_id) || [];
      }

      // Combine data
      const enrichedPosts: PostWithAuthor[] = filteredPosts.map((post) => ({
        ...post,
        likes_count: post.likes_count || 0,
        comments_count: post.comments_count || 0,
        views_count: post.views_count || 0,
        author: profilesData?.find((p) => p.user_id === post.user_id) || null,
        hasLiked: likedPostIds.includes(post.id),
      }));

      setPosts(enrichedPosts);
    } catch (error) {
      console.error("Error fetching feed:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not load feed",
      });
    } finally {
      setLoading(false);
    }
  }, [filter, user, toast]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Video visibility observer
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target as HTMLVideoElement;
          const postId = video.dataset.postId;
          
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            video.play().catch(() => {});
            if (postId) setPlayingVideo(postId);
          } else {
            video.pause();
            if (postId === playingVideo) setPlayingVideo(null);
          }
        });
      },
      { threshold: 0.5 }
    );

    return () => observerRef.current?.disconnect();
  }, [playingVideo]);

  const handleLike = async (postId: string) => {
    if (!user) {
      navigate("/auth");
      return;
    }

    if (likeLoading.has(postId)) return;

    setLikeLoading((prev) => new Set(prev).add(postId));

    const post = posts.find((p) => p.id === postId);
    if (!post) return;

    try {
      if (post.hasLiked) {
        await supabase
          .from("likes")
          .delete()
          .eq("user_id", user.id)
          .eq("post_id", postId);

        setPosts((prev) =>
          prev.map((p) =>
            p.id === postId
              ? { ...p, hasLiked: false, likes_count: Math.max(0, p.likes_count - 1) }
              : p
          )
        );
      } else {
        await supabase
          .from("likes")
          .insert({ user_id: user.id, post_id: postId });

        setPosts((prev) =>
          prev.map((p) =>
            p.id === postId
              ? { ...p, hasLiked: true, likes_count: p.likes_count + 1 }
              : p
          )
        );
      }
    } catch (error) {
      console.error("Error liking post:", error);
    } finally {
      setLikeLoading((prev) => {
        const next = new Set(prev);
        next.delete(postId);
        return next;
      });
    }
  };

  const toggleMute = (postId: string) => {
    setMutedVideos((prev) => {
      const next = new Set(prev);
      if (next.has(postId)) {
        next.delete(postId);
      } else {
        next.add(postId);
      }
      return next;
    });
  };

  const formatCount = (count: number): string => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
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

  return (
    <div className="pb-20">
      {/* Header with Filters */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-lg border-b border-border">
        <div className="px-4 pt-3 pb-2">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <GiMeditation className="h-6 w-6 text-primary" />
              <h1 className="text-lg font-bold text-foreground">Feed</h1>
            </div>
          </div>
          
          <Tabs value={filter} onValueChange={(v) => setFilter(v as FilterType)}>
            <TabsList className="w-full grid grid-cols-4 h-9">
              <TabsTrigger value="latest" className="text-xs">Latest</TabsTrigger>
              <TabsTrigger value="popular" className="text-xs">Popular</TabsTrigger>
              <TabsTrigger value="bhajans" className="text-xs">Bhajans</TabsTrigger>
              <TabsTrigger value="priests" className="text-xs">Priests</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Posts */}
      {posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <GiMeditation className="h-16 w-16 text-muted-foreground/30 mb-4" />
          <h2 className="text-lg font-semibold text-foreground mb-2">No posts yet</h2>
          <p className="text-sm text-muted-foreground text-center mb-4">
            Be the first to share something with the community
          </p>
          <Link to="/create">
            <Button className="bg-gradient-hero">Create Post</Button>
          </Link>
        </div>
      ) : (
        <div className="divide-y divide-border">
          {posts.map((post) => (
            <article key={post.id} className="bg-card">
              {/* Author Header */}
              <div className="flex items-center justify-between p-3">
                <Link
                  to={`/profile/${post.user_id}`}
                  className="flex items-center gap-2"
                >
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={post.author?.avatar_url || undefined} />
                    <AvatarFallback className="text-xs bg-primary/10 text-primary">
                      {getInitials(post.author?.display_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-semibold text-foreground">
                        {post.author?.display_name || "Anonymous"}
                      </span>
                      {post.author?.is_priest && post.author?.priest_status === "approved" && (
                        <span className="px-1.5 py-0.5 text-[9px] font-medium rounded bg-primary/10 text-primary">
                          Priest
                        </span>
                      )}
                    </div>
                    {post.author?.username && (
                      <span className="text-xs text-muted-foreground">
                        @{post.author.username}
                      </span>
                    )}
                  </div>
                </Link>
                <button className="p-2 text-muted-foreground hover:text-foreground">
                  <FiMoreHorizontal className="h-5 w-5" />
                </button>
              </div>

              {/* Media Content */}
              {post.media_url && (
                <div className="relative bg-muted">
                  {post.content_type === "video" ? (
                    <div className="relative">
                      <video
                        ref={(el) => {
                          if (el) {
                            videoRefs.current.set(post.id, el);
                            observerRef.current?.observe(el);
                          }
                        }}
                        data-post-id={post.id}
                        src={post.media_url}
                        poster={post.thumbnail_url || undefined}
                        loop
                        playsInline
                        muted={mutedVideos.has(post.id)}
                        className="w-full max-h-[70vh] object-contain"
                      />
                      <button
                        onClick={() => toggleMute(post.id)}
                        className="absolute bottom-3 right-3 p-2 rounded-full bg-background/60 text-foreground"
                      >
                        {mutedVideos.has(post.id) ? (
                          <FiVolumeX className="h-4 w-4" />
                        ) : (
                          <FiVolume2 className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  ) : post.content_type === "image" ? (
                    <img
                      src={post.media_url}
                      alt={post.caption || "Post"}
                      className="w-full max-h-[70vh] object-contain"
                      loading="lazy"
                    />
                  ) : post.content_type === "audio" ? (
                    <div className="p-6 flex flex-col items-center gap-4 bg-gradient-card">
                      <GiMeditation className="h-16 w-16 text-primary/50" />
                      <audio
                        src={post.media_url}
                        controls
                        className="w-full max-w-md"
                      />
                    </div>
                  ) : null}
                </div>
              )}

              {/* Actions */}
              <div className="px-3 py-2">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleLike(post.id)}
                    disabled={likeLoading.has(post.id)}
                    className={`flex items-center gap-1.5 ${
                      post.hasLiked ? "text-destructive" : "text-foreground"
                    }`}
                  >
                    <FiHeart
                      className={`h-6 w-6 ${post.hasLiked ? "fill-current" : ""}`}
                    />
                    {post.likes_count > 0 && (
                      <span className="text-sm font-medium">
                        {formatCount(post.likes_count)}
                      </span>
                    )}
                  </button>

                  <Link
                    to={`/post/${post.id}`}
                    className="flex items-center gap-1.5 text-foreground"
                  >
                    <FiMessageCircle className="h-6 w-6" />
                    {post.comments_count > 0 && (
                      <span className="text-sm font-medium">
                        {formatCount(post.comments_count)}
                      </span>
                    )}
                  </Link>

                  <button className="text-foreground">
                    <FiShare2 className="h-5 w-5" />
                  </button>

                  <button className="ml-auto text-muted-foreground hover:text-destructive">
                    <FiFlag className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Caption */}
              {post.caption && (
                <div className="px-3 pb-3">
                  <p className="text-sm text-foreground">
                    <Link
                      to={`/profile/${post.user_id}`}
                      className="font-semibold mr-1"
                    >
                      {post.author?.display_name || "Anonymous"}
                    </Link>
                    {post.caption}
                  </p>
                </div>
              )}

              {/* Timestamp */}
              <div className="px-3 pb-3">
                <span className="text-[10px] text-muted-foreground uppercase">
                  {new Date(post.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default Feed;
