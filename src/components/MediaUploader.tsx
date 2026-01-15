import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { FiUpload, FiX, FiImage, FiVideo, FiMusic } from "react-icons/fi";
import { cn } from "@/lib/utils";

export type MediaType = "image" | "video" | "audio";

interface MediaUploaderProps {
  bucket: string;
  accept?: string;
  maxSizeMB?: number;
  mediaType: MediaType;
  onUploadComplete: (url: string, thumbnailUrl?: string) => void;
  onUploadStart?: () => void;
  className?: string;
}

export const MediaUploader = ({
  bucket,
  accept,
  maxSizeMB = 50,
  mediaType,
  onUploadComplete,
  onUploadStart,
  className,
}: MediaUploaderProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const getAcceptTypes = () => {
    if (accept) return accept;
    switch (mediaType) {
      case "image":
        return "image/jpeg,image/png,image/webp,image/gif";
      case "video":
        return "video/mp4,video/quicktime,video/webm";
      case "audio":
        return "audio/mpeg,audio/wav,audio/ogg,audio/m4a";
      default:
        return "*/*";
    }
  };

  const getIcon = () => {
    switch (mediaType) {
      case "image":
        return <FiImage className="h-8 w-8" />;
      case "video":
        return <FiVideo className="h-8 w-8" />;
      case "audio":
        return <FiMusic className="h-8 w-8" />;
      default:
        return <FiUpload className="h-8 w-8" />;
    }
  };

  const generateVideoThumbnail = useCallback((file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement("video");
      video.preload = "metadata";
      video.src = URL.createObjectURL(file);
      
      video.onloadeddata = () => {
        video.currentTime = 1; // Capture at 1 second
      };

      video.onseeked = () => {
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const thumbnailDataUrl = canvas.toDataURL("image/jpeg", 0.8);
          URL.revokeObjectURL(video.src);
          resolve(thumbnailDataUrl);
        } else {
          reject(new Error("Could not get canvas context"));
        }
      };

      video.onerror = () => {
        reject(new Error("Could not load video"));
      };
    });
  }, []);

  const dataURLtoBlob = (dataURL: string): Blob => {
    const arr = dataURL.split(",");
    const mime = arr[0].match(/:(.*?);/)?.[1] || "image/jpeg";
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSizeMB) {
      toast({
        variant: "destructive",
        title: "File too large",
        description: `Maximum file size is ${maxSizeMB}MB`,
      });
      return;
    }

    setSelectedFile(file);

    // Create preview
    if (mediaType === "image" || mediaType === "video") {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
    } else if (mediaType === "audio") {
      setPreview("audio");
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !user) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a file and ensure you're logged in",
      });
      return;
    }

    setUploading(true);
    setProgress(0);
    onUploadStart?.();

    try {
      const fileExt = selectedFile.name.split(".").pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 10, 90));
      }, 200);

      // Upload main file
      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, selectedFile, {
          cacheControl: "3600",
          upsert: false,
        });

      clearInterval(progressInterval);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

      let thumbnailUrl: string | undefined;

      // Generate and upload thumbnail for videos
      if (mediaType === "video") {
        try {
          const thumbnailDataUrl = await generateVideoThumbnail(selectedFile);
          const thumbnailBlob = dataURLtoBlob(thumbnailDataUrl);
          const thumbnailFileName = `${user.id}/${Date.now()}_thumb.jpg`;

          const { error: thumbError } = await supabase.storage
            .from("thumbnails")
            .upload(thumbnailFileName, thumbnailBlob, {
              contentType: "image/jpeg",
            });

          if (!thumbError) {
            const { data: thumbUrlData } = supabase.storage
              .from("thumbnails")
              .getPublicUrl(thumbnailFileName);
            thumbnailUrl = thumbUrlData.publicUrl;
          }
        } catch (thumbErr) {
          console.warn("Could not generate thumbnail:", thumbErr);
        }
      }

      setProgress(100);
      onUploadComplete(urlData.publicUrl, thumbnailUrl);

      toast({
        title: "Upload complete",
        description: "Your file has been uploaded successfully",
      });

      // Reset state
      setPreview(null);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error.message || "Could not upload file",
      });
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const handleClear = () => {
    setPreview(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      <input
        ref={fileInputRef}
        type="file"
        accept={getAcceptTypes()}
        onChange={handleFileSelect}
        className="hidden"
      />

      {!preview ? (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-full border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center gap-3 hover:border-primary/50 hover:bg-muted/50 transition-colors"
        >
          <div className="text-muted-foreground">{getIcon()}</div>
          <div className="text-center">
            <p className="text-sm font-medium text-foreground">
              Tap to select {mediaType}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Max {maxSizeMB}MB
            </p>
          </div>
        </button>
      ) : (
        <div className="relative rounded-xl overflow-hidden bg-muted">
          {mediaType === "image" && preview && (
            <img
              src={preview}
              alt="Preview"
              className="w-full max-h-80 object-contain"
            />
          )}
          {mediaType === "video" && preview && (
            <video
              ref={videoRef}
              src={preview}
              className="w-full max-h-80 object-contain"
              controls
            />
          )}
          {mediaType === "audio" && (
            <div className="p-6 flex flex-col items-center gap-4">
              <FiMusic className="h-12 w-12 text-primary" />
              <p className="text-sm font-medium text-foreground">
                {selectedFile?.name}
              </p>
              {selectedFile && (
                <audio
                  src={URL.createObjectURL(selectedFile)}
                  controls
                  className="w-full"
                />
              )}
            </div>
          )}

          <button
            type="button"
            onClick={handleClear}
            className="absolute top-2 right-2 p-1.5 rounded-full bg-background/80 hover:bg-background text-foreground"
          >
            <FiX className="h-4 w-4" />
          </button>
        </div>
      )}

      {uploading && (
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-muted-foreground text-center">
            Uploading... {progress}%
          </p>
        </div>
      )}

      {preview && !uploading && (
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleClear}
            className="flex-1"
          >
            Change
          </Button>
          <Button
            type="button"
            onClick={handleUpload}
            className="flex-1 bg-gradient-hero"
          >
            <FiUpload className="mr-2 h-4 w-4" />
            Upload
          </Button>
        </div>
      )}
    </div>
  );
};
