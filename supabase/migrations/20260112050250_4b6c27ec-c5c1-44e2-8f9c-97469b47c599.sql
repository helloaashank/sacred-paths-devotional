-- Remove old policies that don't require authentication properly
DROP POLICY IF EXISTS "Authenticated users can view followers" ON public.followers;

-- Fix likes policy to be privacy-first (default deny)
DROP POLICY IF EXISTS "Post owners can view likes respecting privacy" ON public.likes;

CREATE POLICY "Users can view likes with privacy"
ON public.likes
FOR SELECT
TO authenticated
USING (
  -- User can always see their own likes
  auth.uid() = user_id
  OR (
    -- Post owner can see likes only if liker explicitly allows it (default deny)
    EXISTS (
      SELECT 1 FROM public.posts
      WHERE posts.id = likes.post_id
      AND posts.user_id = auth.uid()
    )
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.user_id = likes.user_id
      AND COALESCE((profiles.privacy_settings->>'likes_visible')::boolean, false) = true
    )
  )
);