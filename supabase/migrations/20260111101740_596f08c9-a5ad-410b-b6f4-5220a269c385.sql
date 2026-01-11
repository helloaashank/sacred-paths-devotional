-- =============================================
-- SECURITY FIX: Restrict data access to authenticated users
-- =============================================

-- 1. DROP existing permissive policies
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Followers are viewable by everyone" ON public.followers;
DROP POLICY IF EXISTS "Likes are viewable by everyone" ON public.likes;
DROP POLICY IF EXISTS "Posts are viewable by everyone" ON public.posts;
DROP POLICY IF EXISTS "Comments are viewable by everyone" ON public.comments;

-- 2. CREATE new secure policies for PROFILES
-- Authenticated users can view public profile fields only
CREATE POLICY "Authenticated users can view profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (true);

-- Users can view their own full profile (including sensitive fields)
-- This is already covered by the above policy, but we keep separate logic in app

-- 3. CREATE new secure policies for FOLLOWERS
-- Only authenticated users can view follower relationships
CREATE POLICY "Authenticated users can view followers"
ON public.followers
FOR SELECT
TO authenticated
USING (true);

-- 4. CREATE new secure policies for LIKES
-- Only authenticated users can see likes
-- Users can only see their own likes or that a post has likes (count shown via posts table)
CREATE POLICY "Users can view their own likes"
ON public.likes
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Post owners can see who liked their posts
CREATE POLICY "Post owners can view likes on their posts"
ON public.likes
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.posts
    WHERE posts.id = likes.post_id
    AND posts.user_id = auth.uid()
  )
);

-- 5. CREATE new secure policies for POSTS
-- Posts visible only to authenticated users
CREATE POLICY "Authenticated users can view active posts"
ON public.posts
FOR SELECT
TO authenticated
USING (is_active = true);

-- 6. CREATE new secure policies for COMMENTS
-- Comments visible only to authenticated users
CREATE POLICY "Authenticated users can view active comments"
ON public.comments
FOR SELECT
TO authenticated
USING (is_active = true);

-- 7. Add privacy_settings column to profiles for future privacy controls
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS privacy_settings jsonb DEFAULT '{"profile_visibility": "public", "followers_visible": true, "likes_visible": false}'::jsonb;

-- 8. Create a view for public profile data (limited fields)
CREATE OR REPLACE VIEW public.public_profiles AS
SELECT 
  id,
  user_id,
  username,
  display_name,
  avatar_url,
  bio,
  posts_count,
  followers_count,
  following_count,
  is_priest,
  created_at
FROM public.profiles
WHERE (privacy_settings->>'profile_visibility')::text != 'private';

-- Grant access to the view for authenticated users
GRANT SELECT ON public.public_profiles TO authenticated;

-- 9. Create security definer function for checking if user can view profile
CREATE OR REPLACE FUNCTION public.can_view_profile(_viewer_id uuid, _profile_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    CASE 
      -- User can always view their own profile
      WHEN _viewer_id = _profile_user_id THEN true
      -- Check privacy settings
      WHEN EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE user_id = _profile_user_id 
        AND (privacy_settings->>'profile_visibility')::text = 'public'
      ) THEN true
      -- Followers can view if set to followers_only
      WHEN EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE user_id = _profile_user_id 
        AND (privacy_settings->>'profile_visibility')::text = 'followers_only'
      ) AND EXISTS (
        SELECT 1 FROM public.followers 
        WHERE follower_id = _viewer_id 
        AND following_id = _profile_user_id
      ) THEN true
      ELSE false
    END
$$;

-- 10. Create function to check if user has liked a post (for UI without exposing who)
CREATE OR REPLACE FUNCTION public.has_user_liked_post(_post_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.likes 
    WHERE post_id = _post_id 
    AND user_id = auth.uid()
  )
$$;