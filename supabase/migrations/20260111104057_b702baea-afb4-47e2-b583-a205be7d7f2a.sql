-- Drop the view entirely - views don't support RLS and aren't needed
-- We'll handle field filtering in the application layer instead
DROP VIEW IF EXISTS public.public_profiles;