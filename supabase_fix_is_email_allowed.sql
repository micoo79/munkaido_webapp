-- Fix: is_email_allowed() should also allow users who already exist in app.profiles
-- (pre-existing users created before the user_invites system was introduced)
--
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor > New Query)

CREATE OR REPLACE FUNCTION public.is_email_allowed(p_email TEXT)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT
    EXISTS(SELECT 1 FROM app.user_invites WHERE lower(email) = lower(p_email))
    OR
    EXISTS(SELECT 1 FROM app.profiles WHERE lower(email) = lower(p_email));
$$;
