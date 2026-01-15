import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { MediaUploader, MediaType } from "@/components/MediaUploader";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { FiArrowLeft, FiImage, FiVideo, FiMusic, FiFileText, FiSend } from "react-icons/fi";
import { GiMeditation } from "react-icons/gi";

type ContentType = "text" | "image" | "video" | "audio";

const CreatePost = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [contentType, setContentType] = useState<ContentType>("image");
  const [caption, setCaption] = useState("");
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Redirect if not logged in
  if (!user) {
    navigate("/auth");
    return null;
  }

  const extractHashtags = (text: string): string[] => {
    const hashtagRegex = /#(\w+)/g;
    const matches = text.match(hashtagRegex);
    return matches ? matches.map((tag) => tag.slice(1).toLowerCase()) : [];
  };

  const handleUploadComplete = (url: string, thumb?: string) => {
    setMediaUrl(url);
    if (thumb) {
      setThumbnailUrl(thumb);
    }
    setIsUploading(false);
  };

  const handleSubmit = async () => {
    // Validation
    if (contentType === "text" && !caption.trim()) {
      toast({
        variant: "destructive",
        title: "Empty post",
        description: "Please write something to share",
      });
      return;
    }

    if (contentType !== "text" && !mediaUrl) {
      toast({
        variant: "destructive",
        title: "No media",
        description: `Please upload ${contentType === "audio" ? "an audio file" : `a ${contentType}`}`,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const hashtags = extractHashtags(caption);

      const { error } = await supabase.from("posts").insert({
        user_id: user.id,
        content_type: contentType,
        caption: caption.trim() || null,
        media_url: mediaUrl,
        thumbnail_url: thumbnailUrl,
        hashtags: hashtags.length > 0 ? hashtags : null,
      });

      if (error) throw error;

      toast({
        title: "Post created!",
        description: "Your post has been shared with the community",
      });

      navigate("/profile");
    } catch (error: any) {
      console.error("Error creating post:", error);
      toast({
        variant: "destructive",
        title: "Failed to create post",
        description: error.message || "Please try again",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getBucket = (): string => {
    switch (contentType) {
      case "audio":
        return "audio-uploads";
      default:
        return "posts-media";
    }
  };

  const getMediaType = (): MediaType => {
    switch (contentType) {
      case "image":
        return "image";
      case "video":
        return "video";
      case "audio":
        return "audio";
      default:
        return "image";
    }
  };

  const canSubmit = contentType === "text" 
    ? caption.trim().length > 0 
    : mediaUrl !== null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-lg border-b border-border">
        <div className="flex items-center justify-between px-4 h-14">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 text-foreground hover:text-primary"
          >
            <FiArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="font-semibold text-foreground">Create Post</h1>
          <Button
            size="sm"
            onClick={handleSubmit}
            disabled={!canSubmit || isSubmitting || isUploading}
            className="bg-gradient-hero"
          >
            {isSubmitting ? (
              <div className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <FiSend className="mr-1 h-4 w-4" />
                Share
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="p-4 pb-24 space-y-6">
        {/* Spiritual Header */}
        <div className="text-center py-4">
          <GiMeditation className="mx-auto h-10 w-10 text-primary mb-2" />
          <p className="text-sm text-muted-foreground">
            Share your devotional thoughts with the community
          </p>
        </div>
        {/* Content Type Tabs */}
        <Tabs
          value={contentType}
          onValueChange={(v) => {
            setContentType(v as ContentType);
            setMediaUrl(null);
            setThumbnailUrl(null);
          }}
        >
          <TabsList className="grid grid-cols-4 h-12">
            <TabsTrigger value="image" className="flex flex-col gap-0.5 py-1.5">
              <FiImage className="h-4 w-4" />
              <span className="text-[10px]">Image</span>
            </TabsTrigger>
            <TabsTrigger value="video" className="flex flex-col gap-0.5 py-1.5">
              <FiVideo className="h-4 w-4" />
              <span className="text-[10px]">Reel</span>
            </TabsTrigger>
            <TabsTrigger value="audio" className="flex flex-col gap-0.5 py-1.5">
              <FiMusic className="h-4 w-4" />
              <span className="text-[10px]">Bhajan</span>
            </TabsTrigger>
            <TabsTrigger value="text" className="flex flex-col gap-0.5 py-1.5">
              <FiFileText className="h-4 w-4" />
              <span className="text-[10px]">Text</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="image" className="mt-4">
            <Card className="p-4">
              <MediaUploader
                bucket={getBucket()}
                mediaType="image"
                maxSizeMB={10}
                onUploadComplete={handleUploadComplete}
                onUploadStart={() => setIsUploading(true)}
              />
            </Card>
          </TabsContent>

          <TabsContent value="video" className="mt-4">
            <Card className="p-4">
              <MediaUploader
                bucket={getBucket()}
                mediaType="video"
                maxSizeMB={100}
                onUploadComplete={handleUploadComplete}
                onUploadStart={() => setIsUploading(true)}
              />
              <p className="text-xs text-muted-foreground mt-3 text-center">
                Vertical videos work best for reels
              </p>
            </Card>
          </TabsContent>

          <TabsContent value="audio" className="mt-4">
            <Card className="p-4">
              <MediaUploader
                bucket={getBucket()}
                mediaType="audio"
                maxSizeMB={50}
                onUploadComplete={handleUploadComplete}
                onUploadStart={() => setIsUploading(true)}
              />
              <p className="text-xs text-muted-foreground mt-3 text-center">
                Share bhajans, mantras, and devotional audio
              </p>
            </Card>
          </TabsContent>

          <TabsContent value="text" className="mt-4">
            <Card className="p-4">
              <div className="text-center text-muted-foreground py-6">
                <FiFileText className="mx-auto h-8 w-8 mb-2" />
                <p className="text-sm">Share a thought, prayer, or mantra</p>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Caption Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            {contentType === "text" ? "Your message" : "Caption"}
          </label>
          <Textarea
            placeholder={
              contentType === "text"
                ? "Share your thoughts, prayers, or mantras..."
                : "Add a caption... Use #hashtags for discovery"
            }
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="min-h-[120px] resize-none"
            maxLength={2000}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>
              {extractHashtags(caption).length > 0 && (
                <>Hashtags: {extractHashtags(caption).join(", ")}</>
              )}
            </span>
            <span>{caption.length}/2000</span>
          </div>
        </div>

        {/* Upload Status */}
        {mediaUrl && (
          <div className="flex items-center gap-2 p-3 bg-primary/10 rounded-lg">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm text-primary font-medium">
              Media uploaded successfully
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatePost;
