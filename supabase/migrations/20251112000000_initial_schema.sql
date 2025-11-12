-- ============================================================================
-- Nexa Cognitive Support App - Supabase Database Schema
-- ============================================================================
-- Created: 2025-11-12
-- Purpose: Complete database schema for Nexa app with RLS policies
-- ============================================================================

-- Enable UUID extension

-- ============================================================================
-- USERS & PROFILES
-- ============================================================================

-- User profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    full_name TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'patient' CHECK (role IN ('patient', 'caregiver')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- ============================================================================
-- TASKS MANAGEMENT
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    due_date TIMESTAMP WITH TIME ZONE,
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
    category TEXT,
    tags TEXT[],
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Enable RLS
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- RLS Policies for tasks
CREATE POLICY "Users can view their own tasks"
    ON public.tasks FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own tasks"
    ON public.tasks FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tasks"
    ON public.tasks FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tasks"
    ON public.tasks FOR DELETE
    USING (auth.uid() = user_id);

-- Index for performance
CREATE INDEX IF NOT EXISTS tasks_user_id_idx ON public.tasks(user_id);
CREATE INDEX IF NOT EXISTS tasks_status_idx ON public.tasks(status);
CREATE INDEX IF NOT EXISTS tasks_due_date_idx ON public.tasks(due_date);

-- ============================================================================
-- MOOD TRACKING
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.mood_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    mood_value INTEGER NOT NULL CHECK (mood_value >= 1 AND mood_value <= 5),
    mood_label TEXT CHECK (mood_label IN ('very_sad', 'sad', 'neutral', 'happy', 'very_happy')),
    notes TEXT,
    activities TEXT[],
    triggers TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Enable RLS
ALTER TABLE public.mood_entries ENABLE ROW LEVEL SECURITY;

-- RLS Policies for mood entries
CREATE POLICY "Users can view their own mood entries"
    ON public.mood_entries FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own mood entries"
    ON public.mood_entries FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own mood entries"
    ON public.mood_entries FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own mood entries"
    ON public.mood_entries FOR DELETE
    USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX IF NOT EXISTS mood_entries_user_id_idx ON public.mood_entries(user_id);
CREATE INDEX IF NOT EXISTS mood_entries_created_at_idx ON public.mood_entries(created_at DESC);

-- ============================================================================
-- JOURNAL ENTRIES
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.journal_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT,
    content TEXT NOT NULL,
    mood_value INTEGER CHECK (mood_value >= 1 AND mood_value <= 5),
    tags TEXT[],
    is_encrypted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Enable RLS
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;

-- RLS Policies for journal entries
CREATE POLICY "Users can view their own journal entries"
    ON public.journal_entries FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own journal entries"
    ON public.journal_entries FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own journal entries"
    ON public.journal_entries FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own journal entries"
    ON public.journal_entries FOR DELETE
    USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX IF NOT EXISTS journal_entries_user_id_idx ON public.journal_entries(user_id);
CREATE INDEX IF NOT EXISTS journal_entries_created_at_idx ON public.journal_entries(created_at DESC);

-- ============================================================================
-- EXERCISE SESSIONS (Breathing, Meditation, Finger Trace)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.exercise_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    exercise_type TEXT NOT NULL CHECK (exercise_type IN ('breathing', 'meditation', 'finger_trace', 'memory')),
    exercise_name TEXT,
    duration_seconds INTEGER,
    completed BOOLEAN DEFAULT TRUE,
    notes TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Enable RLS
ALTER TABLE public.exercise_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for exercise sessions
CREATE POLICY "Users can view their own exercise sessions"
    ON public.exercise_sessions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own exercise sessions"
    ON public.exercise_sessions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Indexes
CREATE INDEX IF NOT EXISTS exercise_sessions_user_id_idx ON public.exercise_sessions(user_id);
CREATE INDEX IF NOT EXISTS exercise_sessions_type_idx ON public.exercise_sessions(exercise_type);
CREATE INDEX IF NOT EXISTS exercise_sessions_created_at_idx ON public.exercise_sessions(created_at DESC);

-- ============================================================================
-- CAREGIVER-PATIENT RELATIONSHIPS
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.caregiver_relationships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    caregiver_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    relationship_type TEXT CHECK (relationship_type IN ('family', 'professional', 'friend', 'other')),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'inactive')),
    permissions JSONB DEFAULT '{"view_mood": true, "view_tasks": true, "view_location": false}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    UNIQUE(caregiver_id, patient_id)
);

-- Enable RLS
ALTER TABLE public.caregiver_relationships ENABLE ROW LEVEL SECURITY;

-- RLS Policies for caregiver relationships
CREATE POLICY "Caregivers can view their relationships"
    ON public.caregiver_relationships FOR SELECT
    USING (auth.uid() = caregiver_id OR auth.uid() = patient_id);

CREATE POLICY "Caregivers can create relationships"
    ON public.caregiver_relationships FOR INSERT
    WITH CHECK (auth.uid() = caregiver_id);

CREATE POLICY "Participants can update relationships"
    ON public.caregiver_relationships FOR UPDATE
    USING (auth.uid() = caregiver_id OR auth.uid() = patient_id);

-- Indexes
CREATE INDEX IF NOT EXISTS caregiver_relationships_caregiver_idx ON public.caregiver_relationships(caregiver_id);
CREATE INDEX IF NOT EXISTS caregiver_relationships_patient_idx ON public.caregiver_relationships(patient_id);
CREATE INDEX IF NOT EXISTS caregiver_relationships_status_idx ON public.caregiver_relationships(status);

-- ============================================================================
-- INVITE CODES (for caregiver-patient linking)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.invite_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    patient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    uses_remaining INTEGER DEFAULT 1,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Enable RLS
ALTER TABLE public.invite_codes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for invite codes
CREATE POLICY "Patients can create their own invite codes"
    ON public.invite_codes FOR INSERT
    WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Patients can view their own invite codes"
    ON public.invite_codes FOR SELECT
    USING (auth.uid() = patient_id);

CREATE POLICY "Anyone can view valid invite codes to redeem"
    ON public.invite_codes FOR SELECT
    USING (uses_remaining > 0 AND expires_at > NOW());

-- Index
CREATE INDEX IF NOT EXISTS invite_codes_code_idx ON public.invite_codes(code);
CREATE INDEX IF NOT EXISTS invite_codes_patient_id_idx ON public.invite_codes(patient_id);

-- ============================================================================
-- NOTIFICATIONS
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    type TEXT CHECK (type IN ('alert', 'reminder', 'achievement', 'system')),
    data JSONB,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for notifications
CREATE POLICY "Users can view their own notifications"
    ON public.notifications FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "System can create notifications"
    ON public.notifications FOR INSERT
    WITH CHECK (TRUE);

CREATE POLICY "Users can update their own notifications"
    ON public.notifications FOR UPDATE
    USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX IF NOT EXISTS notifications_user_id_idx ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS notifications_read_idx ON public.notifications(read);
CREATE INDEX IF NOT EXISTS notifications_created_at_idx ON public.notifications(created_at DESC);

-- ============================================================================
-- LOCATION TRACKING (for dementia support)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.location_updates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    accuracy DOUBLE PRECISION,
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Enable RLS
ALTER TABLE public.location_updates ENABLE ROW LEVEL SECURITY;

-- RLS Policies for location updates
CREATE POLICY "Users can create their own location updates"
    ON public.location_updates FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own location updates"
    ON public.location_updates FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Caregivers can view patient location updates"
    ON public.location_updates FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.caregiver_relationships cr
            WHERE cr.patient_id = user_id
            AND cr.caregiver_id = auth.uid()
            AND cr.status = 'active'
            AND (cr.permissions->>'view_location')::boolean = true
        )
    );

-- Indexes
CREATE INDEX IF NOT EXISTS location_updates_user_id_idx ON public.location_updates(user_id);
CREATE INDEX IF NOT EXISTS location_updates_created_at_idx ON public.location_updates(created_at DESC);

-- ============================================================================
-- SUBSCRIPTIONS TRACKING (RevenueCat integration)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    revenuecat_user_id TEXT,
    product_id TEXT NOT NULL,
    entitlement TEXT DEFAULT 'premium',
    status TEXT DEFAULT 'trial' CHECK (status IN ('trial', 'active', 'expired', 'cancelled')),
    expires_at TIMESTAMP WITH TIME ZONE,
    purchase_platform TEXT CHECK (purchase_platform IN ('ios', 'android')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Enable RLS
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for subscriptions
CREATE POLICY "Users can view their own subscriptions"
    ON public.subscriptions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "System can manage subscriptions"
    ON public.subscriptions FOR ALL
    USING (TRUE);

-- Indexes
CREATE INDEX IF NOT EXISTS subscriptions_user_id_idx ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS subscriptions_status_idx ON public.subscriptions(status);
CREATE INDEX IF NOT EXISTS subscriptions_revenuecat_id_idx ON public.subscriptions(revenuecat_user_id);

-- ============================================================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers to tables with updated_at
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.tasks
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.journal_entries
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.caregiver_relationships
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'full_name'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- STORAGE BUCKETS
-- ============================================================================

-- Note: Storage buckets must be created via Supabase Dashboard or API
-- The following SQL is for reference only

-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('avatars', 'avatars', true);

-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('journal-images', 'journal-images', false);

-- Storage RLS policies (apply in Supabase Dashboard):
--
-- Avatars bucket:
-- - Allow authenticated users to upload their own avatar
-- - Allow public read access
--
-- Journal images bucket:
-- - Allow authenticated users to upload to their own folder
-- - Allow users to read only their own images

-- ============================================================================
-- REAL-TIME SUBSCRIPTIONS
-- ============================================================================

-- Enable real-time for specific tables (run in Supabase Dashboard)
-- ALTER PUBLICATION supabase_realtime ADD TABLE public.tasks;
-- ALTER PUBLICATION supabase_realtime ADD TABLE public.mood_entries;
-- ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
-- ALTER PUBLICATION supabase_realtime ADD TABLE public.location_updates;

-- ============================================================================
-- SCHEMA VERSION
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.schema_version (
    version TEXT PRIMARY KEY,
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

INSERT INTO public.schema_version (version) VALUES ('1.0.0');

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================
