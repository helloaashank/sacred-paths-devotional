-- Update likes policy to respect privacy settings
DROP POLICY IF EXISTS "Post owners can view likes on their posts" ON public.likes;

-- Post owners can see likes only if the liker has allowed visible likes
CREATE POLICY "Post owners can view likes respecting privacy"
ON public.likes
FOR SELECT
TO authenticated
USING (
  -- User can always see their own likes
  auth.uid() = user_id
  OR (
    -- Post owner can see likes only if liker allows it
    EXISTS (
      SELECT 1 FROM public.posts
      WHERE posts.id = likes.post_id
      AND posts.user_id = auth.uid()
    )
    AND (
      -- Check if the liker allows their likes to be visible
      NOT EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.user_id = likes.user_id
        AND (profiles.privacy_settings->>'likes_visible')::boolean = false
      )
    )
  )
);

-- Drop the old "Users can view their own likes" since it's now combined
DROP POLICY IF EXISTS "Users can view their own likes" ON public.likes;