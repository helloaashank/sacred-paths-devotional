-- Fix followers policy to check both parties' privacy settings
DROP POLICY IF EXISTS "Users can view relevant followers" ON public.followers;

-- Followers: More restrictive - only show own relationships  
-- or where BOTH parties allow visibility
CREATE POLICY "Users can view followers with privacy"
ON public.followers
FOR SELECT
TO authenticated
USING (
  -- Always allow viewing own relationships (as follower or being followed)
  auth.uid() = follower_id 
  OR auth.uid() = following_id
  -- For other relationships, both parties must have followers visible
  OR (
    -- Following user allows their followers to be visible
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.user_id = followers.following_id
      AND COALESCE((profiles.privacy_settings->>'followers_visible')::boolean, true) = true
    )
    -- AND follower allows their following list to be visible  
    AND EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.user_id = followers.follower_id
      AND COALESCE((profiles.privacy_settings->>'followers_visible')::boolean, true) = true
    )
  )
);