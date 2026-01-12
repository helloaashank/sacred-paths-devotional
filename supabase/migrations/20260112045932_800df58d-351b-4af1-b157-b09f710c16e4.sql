-- Create index for rate limiting queries (using just created_at)
CREATE INDEX IF NOT EXISTS idx_likes_user_created ON public.likes(user_id, created_at);

-- Create function to check daily like limit (anti-scraping)
CREATE OR REPLACE FUNCTION public.check_daily_like_limit()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  daily_count integer;
  max_daily_likes constant integer := 100;
BEGIN
  SELECT COUNT(*) INTO daily_count
  FROM public.likes
  WHERE user_id = NEW.user_id
  AND created_at >= CURRENT_DATE
  AND created_at < CURRENT_DATE + interval '1 day';
  
  IF daily_count >= max_daily_likes THEN
    RAISE EXCEPTION 'Daily like limit reached. Please try again tomorrow.';
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for rate limiting
DROP TRIGGER IF EXISTS enforce_like_limit ON public.likes;
CREATE TRIGGER enforce_like_limit
BEFORE INSERT ON public.likes
FOR EACH ROW
EXECUTE FUNCTION public.check_daily_like_limit();