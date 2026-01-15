import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  FiArrowLeft, 
  FiHeart, 
  FiMessageCircle, 
  FiShare2, 
  FiSend,
  FiTrash2,
  FiMoreHorizontal
} from "react-icons/fi";
import { GiMeditation } from "react-icons/gi";

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  author: {
    display_name: string | null;
    username: string | null;
    avatar_url: string | null;
  } | null;
}

interface PostData {
  id: string;
  user_id: string;
  content_type: string;
  caption: string | null;
  media_url: string | null;
  thumbnail_url: string | null;
  likes_count: number;
  comments_count: number;
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

const PostDetail = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [post, setPost] = useState<PostData | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);

  useEffect(() => {
    if (postId) {
      fetchPost();
      fetchComments();
    }
  }, [postId]);

  const fetchPost = async () => {
    if (!postId) return;

    try {
      const { data: postData, error } = await supabase
        .from("posts")
        .select("*")
        .eq("id", postId)
        .single();

      if (error) throw error;

      // Fetch author
      const { data: authorData } = await supabase
        .from("profiles")
        .select("display_name, username, avatar_url, is_priest, priest_status")
        .eq("user_id", postData.user_id)
        .single();

      // Check if user has liked
      let hasLiked = false;
      if (user) {
        const { data: likeData } = await supabase
          .from("likes")
          .select("id")
          .eq("user_id", user.id)
          .eq("post_id", postId)
          .maybeSingle();
        hasLiked = !!likeData;
      }

      setPost({
        ...postData,
        likes_count: postData.likes_count || 0,
        comments_count: postData.comments_count || 0,
        author: authorData,
        hasLiked,
      });
    } catch (error) {
      console.error("Error fetching post:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not load post",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    if (!postId) return;

    try {
      const { data: commentsData, error } = await supabase
        .from("comments")
        .select("id, content, created_at, user_id")
        .eq("post_id", postId)
        .eq("is_active", true)
        .order("created_at", { ascending: true });

      if (error) throw error;

      if (!commentsData || commentsData.length === 0) {
        setComments([]);
        return;
      }

      // Fetch authors
      const userIds = [...new Set(commentsData.map((c) => c.user_id))];
      const { data: profilesData } = await supabase
        .from("profiles")
        .select("user_id, display_name, username, avatar_url")
        .in("user_id", userIds);

      const enrichedComments: Comment[] = commentsData.map((comment) => ({
        ...comment,
        author: profilesData?.find((p) => p.user_id === comment.user_id) || null,
      }));

      setComments(enrichedComments);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handleLike = async () => {
    if (!user) {
      navigate("/auth");
      return;
    }

    if (!post || likeLoading) return;

    setLikeLoading(true);

    try {
      if (post.hasLiked) {
        await supabase
          .from("likes")
          .delete()
          .eq("user_id", user.id)
          .eq("post_id", post.id);

        setPost((prev) =>
          prev
            ? { ...prev, hasLiked: false, likes_count: Math.max(0, prev.likes_count - 1) }
            : null
        );
      } else {
        await supabase
          .from("likes")
          .insert({ user_id: user.id, post_id: post.id });

        setPost((prev) =>
          prev
            ? { ...prev, hasLiked: true, likes_count: prev.likes_count + 1 }
            : null
        );
      }
    } catch (error) {
      console.error("Error liking post:", error);
    } finally {
      setLikeLoading(false);
    }
  };

  const handleSubmitComment = async () => {
    if (!user) {
      navigate("/auth");
      return;
    }

    if (!postId || !newComment.trim()) return;

    setSubmittingComment(true);

    try {
      const { error } = await supabase.from("comments").insert({
        post_id: postId,
        user_id: user.id,
        content: newComment.trim(),
      });

      if (error) throw error;

      setNewComment("");
      fetchComments();
      
      // Update comment count
      setPost((prev) =>
        prev ? { ...prev, comments_count: prev.comments_count + 1 } : null
      );

      toast({
        title: "Comment added",
        description: "Your comment has been posted",
      });
    } catch (error: any) {
      console.error("Error adding comment:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Could not add comment",
      });
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("comments")
        .delete()
        .eq("id", commentId)
        .eq("user_id", user.id);

      if (error) throw error;

      setComments((prev) => prev.filter((c) => c.id !== commentId));
      setPost((prev) =>
        prev ? { ...prev, comments_count: Math.max(0, prev.comments_count - 1) } : null
      );

      toast({
        title: "Comment deleted",
      });
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
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

  if (!post) {
    return (
      <div className="flex flex-col items-center justify-center h-64 px-4">
        <GiMeditation className="text-5xl text-muted-foreground mb-3" />
        <h2 className="text-lg font-semibold text-foreground mb-1">Post not found</h2>
        <p className="text-sm text-muted-foreground mb-4">
          This post may have been deleted
        </p>
        <Button onClick={() => navigate("/feed")}>Back to Feed</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-lg border-b border-border">
        <div className="flex items-center justify-between px-4 h-14">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 text-foreground hover:text-primary"
          >
            <FiArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="font-semibold text-foreground">Post</h1>
          <button className="p-2 -mr-2 text-muted-foreground">
            <FiMoreHorizontal className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Post Content */}
      <article className="border-b border-border">
        {/* Author */}
        <div className="flex items-center gap-3 p-4">
          <Link to={`/profile/${post.user_id}`}>
            <Avatar className="h-10 w-10">
              <AvatarImage src={post.author?.avatar_url || undefined} />
              <AvatarFallback className="text-sm bg-primary/10 text-primary">
                {getInitials(post.author?.display_name)}
              </AvatarFallback>
            </Avatar>
          </Link>
          <div className="flex-1">
            <Link
              to={`/profile/${post.user_id}`}
              className="flex items-center gap-2"
            >
              <span className="font-semibold text-foreground">
                {post.author?.display_name || "Anonymous"}
              </span>
              {post.author?.is_priest && post.author?.priest_status === "approved" && (
                <span className="px-1.5 py-0.5 text-[9px] font-medium rounded bg-primary/10 text-primary">
                  Priest
                </span>
              )}
            </Link>
            <span className="text-xs text-muted-foreground">
              {new Date(post.created_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
        </div>

        {/* Media */}
        {post.media_url && (
          <div className="bg-muted">
            {post.content_type === "video" ? (
              <video
                src={post.media_url}
                poster={post.thumbnail_url || undefined}
                controls
                playsInline
                className="w-full max-h-[70vh] object-contain"
              />
            ) : post.content_type === "image" ? (
              <img
                src={post.media_url}
                alt={post.caption || "Post"}
                className="w-full max-h-[70vh] object-contain"
              />
            ) : post.content_type === "audio" ? (
              <div className="p-6 flex flex-col items-center gap-4 bg-gradient-card">
                <GiMeditation className="h-16 w-16 text-primary/50" />
                <audio src={post.media_url} controls className="w-full max-w-md" />
              </div>
            ) : null}
          </div>
        )}

        {/* Caption */}
        {post.caption && (
          <div className="p-4 pt-3">
            <p className="text-foreground">{post.caption}</p>
          </div>
        )}

        {/* Actions */}
        <div className="px-4 py-3 border-t border-border">
          <div className="flex items-center gap-6">
            <button
              onClick={handleLike}
              disabled={likeLoading}
              className={`flex items-center gap-2 ${
                post.hasLiked ? "text-destructive" : "text-foreground"
              }`}
            >
              <FiHeart className={`h-5 w-5 ${post.hasLiked ? "fill-current" : ""}`} />
              <span className="text-sm font-medium">{post.likes_count}</span>
            </button>

            <div className="flex items-center gap-2 text-foreground">
              <FiMessageCircle className="h-5 w-5" />
              <span className="text-sm font-medium">{post.comments_count}</span>
            </div>

            <button className="text-foreground">
              <FiShare2 className="h-5 w-5" />
            </button>
          </div>
        </div>
      </article>

      {/* Comments Section */}
      <div className="p-4">
        <h2 className="text-sm font-semibold text-foreground mb-4">
          Comments ({comments.length})
        </h2>

        {/* Comment Input */}
        {user && (
          <div className="flex gap-3 mb-6">
            <Textarea
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-[60px] resize-none flex-1"
            />
            <Button
              size="icon"
              onClick={handleSubmitComment}
              disabled={!newComment.trim() || submittingComment}
              className="bg-gradient-hero h-10 w-10"
            >
              {submittingComment ? (
                <div className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
              ) : (
                <FiSend className="h-4 w-4" />
              )}
            </Button>
          </div>
        )}

        {/* Comments List */}
        {comments.length === 0 ? (
          <div className="text-center py-8">
            <FiMessageCircle className="mx-auto h-8 w-8 text-muted-foreground/30 mb-2" />
            <p className="text-sm text-muted-foreground">No comments yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="flex gap-3">
                <Link to={`/profile/${comment.user_id}`}>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={comment.author?.avatar_url || undefined} />
                    <AvatarFallback className="text-xs bg-muted text-muted-foreground">
                      {getInitials(comment.author?.display_name)}
                    </AvatarFallback>
                  </Avatar>
                </Link>
                <div className="flex-1">
                  <div className="bg-muted rounded-lg p-3">
                    <Link
                      to={`/profile/${comment.user_id}`}
                      className="text-sm font-semibold text-foreground"
                    >
                      {comment.author?.display_name || "Anonymous"}
                    </Link>
                    <p className="text-sm text-foreground mt-1">{comment.content}</p>
                  </div>
                  <div className="flex items-center gap-4 mt-1 px-1">
                    <span className="text-[10px] text-muted-foreground">
                      {new Date(comment.created_at).toLocaleDateString()}
                    </span>
                    {user?.id === comment.user_id && (
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="text-[10px] text-destructive hover:underline"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PostDetail;
