# Supabase Setup Guide for Nexa

**Complete configuration guide for Supabase backend**

**Created**: 2025-11-12
**Project ID**: picfkoucbnaoiuhpegba
**Project URL**: https://picfkoucbnaoiuhpegba.supabase.co

---

## Quick Start

### 1. Access Supabase Dashboard

1. Go to https://supabase.com/dashboard
2. Log in to your account
3. Select project: **picfkoucbnaoiuhpegba**

### 2. Run Database Schema

**Method 1: SQL Editor (Recommended)**

1. In Supabase Dashboard, go to **SQL Editor**
2. Click **New query**
3. Copy the entire contents of `supabase/schema.sql`
4. Paste into the SQL editor
5. Click **Run** (or press Cmd/Ctrl + Enter)
6. Wait for confirmation: "Success. No rows returned"

**Method 2: Supabase CLI**

```bash
# Install Supabase CLI (if not already installed)
npm install -g supabase

# Login to Supabase
supabase login

# Link to project
supabase link --project-ref picfkoucbnaoiuhpegba

# Run migrations
supabase db push
```

### 3. Verify Schema Installation

Run this query in SQL Editor to verify tables were created:

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

**Expected tables**:
- profiles
- tasks
- mood_entries
- journal_entries
- exercise_sessions
- caregiver_relationships
- invite_codes
- notifications
- location_updates
- subscriptions
- schema_version

---

## Database Schema Overview

### Core Tables

#### 1. `profiles`
**Purpose**: User profile information (extends auth.users)

**Columns**:
- `id` (UUID, FK to auth.users)
- `email` (TEXT)
- `full_name` (TEXT)
- `avatar_url` (TEXT)
- `role` (TEXT: 'patient' | 'caregiver')
- `created_at`, `updated_at` (TIMESTAMPTZ)

**RLS Policies**:
- Users can view, update, and insert their own profile
- Auto-created on user signup via trigger

---

#### 2. `tasks`
**Purpose**: Task management for ADHD/cognitive support

**Columns**:
- `id` (UUID, PK)
- `user_id` (UUID, FK to auth.users)
- `title`, `description` (TEXT)
- `due_date` (TIMESTAMPTZ)
- `priority` ('low', 'medium', 'high', 'urgent')
- `status` ('pending', 'in_progress', 'completed', 'cancelled')
- `category`, `tags` (TEXT[])
- `completed_at`, `created_at`, `updated_at` (TIMESTAMPTZ)

**RLS Policies**:
- Full CRUD for own tasks only

**Indexes**:
- `tasks_user_id_idx` - Fast user filtering
- `tasks_status_idx` - Status queries
- `tasks_due_date_idx` - Due date sorting

---

#### 3. `mood_entries`
**Purpose**: Mood tracking (1-5 scale with emojis)

**Columns**:
- `id` (UUID, PK)
- `user_id` (UUID, FK)
- `mood_value` (INTEGER 1-5)
- `mood_label` ('very_sad', 'sad', 'neutral', 'happy', 'very_happy')
- `notes` (TEXT)
- `activities`, `triggers` (TEXT[])
- `created_at` (TIMESTAMPTZ)

**RLS Policies**:
- Full CRUD for own mood entries only

---

#### 4. `journal_entries`
**Purpose**: Therapeutic journaling with encryption support

**Columns**:
- `id` (UUID, PK)
- `user_id` (UUID, FK)
- `title`, `content` (TEXT)
- `mood_value` (INTEGER 1-5)
- `tags` (TEXT[])
- `is_encrypted` (BOOLEAN)
- `created_at`, `updated_at` (TIMESTAMPTZ)

**RLS Policies**:
- Full CRUD for own journal entries only

**Note**: Encryption is client-side. The `is_encrypted` flag indicates encrypted content.

---

#### 5. `exercise_sessions`
**Purpose**: Track wellness exercises (breathing, meditation, finger trace)

**Columns**:
- `id` (UUID, PK)
- `user_id` (UUID, FK)
- `exercise_type` ('breathing', 'meditation', 'finger_trace', 'memory')
- `exercise_name` (TEXT)
- `duration_seconds` (INTEGER)
- `completed` (BOOLEAN)
- `notes` (TEXT)
- `metadata` (JSONB) - Flexible storage for exercise-specific data
- `created_at` (TIMESTAMPTZ)

**RLS Policies**:
- Insert and view own exercise sessions only

---

#### 6. `caregiver_relationships`
**Purpose**: Link caregivers to patients with permissions

**Columns**:
- `id` (UUID, PK)
- `caregiver_id`, `patient_id` (UUID, FK to auth.users)
- `relationship_type` ('family', 'professional', 'friend', 'other')
- `status` ('pending', 'active', 'inactive')
- `permissions` (JSONB) - Granular permissions:
  ```json
  {
    "view_mood": true,
    "view_tasks": true,
    "view_location": false
  }
  ```
- `created_at`, `updated_at` (TIMESTAMPTZ)

**RLS Policies**:
- Caregivers can create relationships
- Both participants can view and update relationships

**Unique Constraint**: One relationship per caregiver-patient pair

---

#### 7. `invite_codes`
**Purpose**: Generate invite codes for caregiver-patient linking

**Columns**:
- `id` (UUID, PK)
- `code` (TEXT UNIQUE) - 6-character alphanumeric code
- `patient_id` (UUID, FK)
- `uses_remaining` (INTEGER, default 1)
- `expires_at` (TIMESTAMPTZ)
- `created_at` (TIMESTAMPTZ)

**RLS Policies**:
- Patients can create and view their own codes
- Anyone can view valid codes (to redeem)

**Usage**: Generate in app, caregiver redeems to create relationship

---

#### 8. `notifications`
**Purpose**: In-app notification system

**Columns**:
- `id` (UUID, PK)
- `user_id` (UUID, FK)
- `title`, `body` (TEXT)
- `type` ('alert', 'reminder', 'achievement', 'system')
- `data` (JSONB) - Additional notification data
- `read` (BOOLEAN, default false)
- `created_at` (TIMESTAMPTZ)

**RLS Policies**:
- Users can view and update their own notifications
- System can create notifications for any user

---

#### 9. `location_updates`
**Purpose**: GPS tracking for dementia/wandering support

**Columns**:
- `id` (UUID, PK)
- `user_id` (UUID, FK)
- `latitude`, `longitude`, `accuracy` (DOUBLE PRECISION)
- `address` (TEXT) - Reverse geocoded address
- `created_at` (TIMESTAMPTZ)

**RLS Policies**:
- Users can create and view their own location updates
- **Caregivers can view patient locations** if:
  - Relationship status is 'active'
  - Permission `view_location` is enabled

**Privacy**: Location sharing requires explicit patient consent

---

#### 10. `subscriptions`
**Purpose**: Track RevenueCat subscriptions

**Columns**:
- `id` (UUID, PK)
- `user_id` (UUID, FK)
- `revenuecat_user_id` (TEXT)
- `product_id` (TEXT) - e.g., 'premium_monthly'
- `entitlement` (TEXT, default 'premium')
- `status` ('trial', 'active', 'expired', 'cancelled')
- `expires_at` (TIMESTAMPTZ)
- `purchase_platform` ('ios', 'android')
- `created_at`, `updated_at` (TIMESTAMPTZ)

**RLS Policies**:
- Users can view their own subscriptions
- System/backend can manage all subscriptions

---

## Storage Buckets

### Required Buckets

#### 1. `avatars` (Public)
**Purpose**: User profile pictures

**Configuration**:
```sql
-- Create bucket (run in Supabase Dashboard → Storage)
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true);
```

**RLS Policies** (apply in Storage → Policies):

```sql
-- Allow authenticated users to upload their own avatar
CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow anyone to view avatars (public)
CREATE POLICY "Public avatar access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'avatars');

-- Allow users to update their own avatar
CREATE POLICY "Users can update their own avatar"
ON storage.objects FOR UPDATE
TO authenticated
USING ((storage.foldername(name))[1] = auth.uid()::text);
```

**File Structure**: `avatars/{user_id}/{filename}.jpg`

---

#### 2. `journal-images` (Private)
**Purpose**: Images attached to journal entries

**Configuration**:
```sql
INSERT INTO storage.buckets (id, name, public)
VALUES ('journal-images', 'journal-images', false);
```

**RLS Policies**:

```sql
-- Allow users to upload to their own folder
CREATE POLICY "Users can upload journal images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'journal-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to view only their own images
CREATE POLICY "Users can view their own journal images"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'journal-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to delete their own images
CREATE POLICY "Users can delete their own journal images"
ON storage.objects FOR DELETE
TO authenticated
USING ((storage.foldername(name))[1] = auth.uid()::text);
```

**File Structure**: `journal-images/{user_id}/{entry_id}/{filename}.jpg`

---

## Real-Time Subscriptions

Enable real-time for tables that need instant updates:

### Enable via Dashboard

1. Go to **Database** → **Replication**
2. Find **supabase_realtime** publication
3. Add tables:
   - `tasks`
   - `mood_entries`
   - `notifications`
   - `location_updates`

### Enable via SQL

```sql
ALTER PUBLICATION supabase_realtime ADD TABLE public.tasks;
ALTER PUBLICATION supabase_realtime ADD TABLE public.mood_entries;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.location_updates;
```

---

## Testing & Validation

### 1. Verify Schema

```sql
-- Check all tables exist
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- Check RLS is enabled on all tables
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';
```

### 2. Test Authentication

```typescript
// In app code
import { supabaseService } from '@/services/backend/SupabaseService';

// Sign in anonymously
const { data, error } = await supabaseService.signInAnonymously();
console.log('User:', data?.user);
```

### 3. Test CRUD Operations

```typescript
// Create a task
const { data, error } = await supabaseService.getClient()
  ?.from('tasks')
  .insert({
    title: 'Test Task',
    description: 'Testing Supabase integration',
    priority: 'medium',
    status: 'pending'
  });

// Fetch user's tasks
const { data: tasks } = await supabaseService.getClient()
  ?.from('tasks')
  .select('*')
  .order('created_at', { ascending: false });
```

### 4. Test Real-Time

```typescript
const channel = supabaseService.getClient()
  ?.channel('tasks')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'tasks'
    },
    (payload) => {
      console.log('Task changed:', payload);
    }
  )
  .subscribe();
```

---

## Security Best Practices

### Row Level Security (RLS)

✅ **Enabled on all tables** - Users can only access their own data

### Data Encryption

- ✅ All data encrypted in transit (HTTPS/TLS)
- ✅ All data encrypted at rest (Supabase default)
- ✅ JWT tokens for authentication
- ⚠️ Client-side encryption recommended for journal entries

### API Key Security

- ✅ Anon key configured (safe to expose in client)
- ⚠️ Never expose Service Role key in client code
- ⚠️ Use environment variables for all keys

### Production Checklist

- [ ] Review all RLS policies
- [ ] Test with multiple users
- [ ] Verify caregiver permissions work correctly
- [ ] Test location sharing privacy controls
- [ ] Audit storage bucket policies
- [ ] Enable database backups (automatic in Supabase)
- [ ] Set up monitoring and alerts

---

## Troubleshooting

### Common Issues

#### RLS Blocking Queries

**Problem**: Queries return empty results even with data

**Solution**: Check RLS policies match your auth context

```sql
-- Test as authenticated user
SELECT * FROM tasks WHERE user_id = auth.uid();

-- If empty, check RLS policy:
SELECT * FROM pg_policies WHERE tablename = 'tasks';
```

#### Real-Time Not Working

**Problem**: Subscriptions don't receive updates

**Solutions**:
1. Verify table is added to `supabase_realtime` publication
2. Check RLS policies allow SELECT for the user
3. Verify WebSocket connection in Network tab

#### Storage Upload Fails

**Problem**: File upload returns 403 Forbidden

**Solutions**:
1. Check bucket exists and is properly configured
2. Verify RLS policies on `storage.objects`
3. Ensure file path matches policy pattern

---

## Next Steps

After running this schema:

1. ✅ Verify all tables created successfully
2. ✅ Create storage buckets (avatars, journal-images)
3. ✅ Enable real-time for required tables
4. ✅ Test authentication flow
5. ✅ Test CRUD operations
6. ✅ Test caregiver-patient relationship flow
7. ✅ Test location sharing with permissions

---

## Support & Resources

- **Supabase Docs**: https://supabase.com/docs
- **Row Level Security**: https://supabase.com/docs/guides/auth/row-level-security
- **Storage**: https://supabase.com/docs/guides/storage
- **Real-time**: https://supabase.com/docs/guides/realtime

---

**Schema Version**: 1.0.0
**Last Updated**: 2025-11-12
