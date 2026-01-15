-- ============================================
-- PHASE 1: Reports Table for Content Moderation
-- ============================================

-- Create reports table for content moderation
CREATE TABLE public.reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reporter_id UUID NOT NULL,
    content_type TEXT NOT NULL CHECK (content_type IN ('post', 'comment', 'profile', 'audio')),
    content_id UUID NOT NULL,
    reason TEXT NOT NULL CHECK (reason IN ('spam', 'inappropriate', 'harassment', 'copyright', 'misinformation', 'other')),
    description TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed')),
    reviewed_by UUID,
    reviewer_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    resolved_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable RLS on reports
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Create trigger for updated_at
CREATE TRIGGER update_reports_updated_at
    BEFORE UPDATE ON public.reports
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- RLS Policies for reports table

-- Users can create reports (authenticated)
CREATE POLICY "Authenticated users can create reports"
ON public.reports FOR INSERT TO authenticated
WITH CHECK (reporter_id = auth.uid());

-- Users can view their own reports
CREATE POLICY "Users can view their own reports"
ON public.reports FOR SELECT TO authenticated
USING (reporter_id = auth.uid());

-- Admins and moderators can view all reports
CREATE POLICY "Admins can view all reports"
ON public.reports FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'moderator'));

-- Admins and moderators can update reports (for review)
CREATE POLICY "Admins can update reports"
ON public.reports FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'moderator'));

-- Admins can delete reports
CREATE POLICY "Admins can delete reports"
ON public.reports FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Create index for faster queries
CREATE INDEX idx_reports_status ON public.reports(status);
CREATE INDEX idx_reports_content ON public.reports(content_type, content_id);
CREATE INDEX idx_reports_reporter ON public.reports(reporter_id);