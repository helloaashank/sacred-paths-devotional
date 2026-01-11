-- Fix SECURITY DEFINER view issue by dropping it and using regular view with invoker security
DROP VIEW IF EXISTS public.public_profiles;

-- Create a regular view (uses invoker's permissions by default)
CREATE VIEW public.public_profiles 
WITH (security_invoker = true)
AS
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
FROM public.profiles;

-- Grant access to the view for authenticated users
GRANT SELECT ON public.public_profiles TO authenticated;