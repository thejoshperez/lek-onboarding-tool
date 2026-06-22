-- Run this in your Supabase SQL Editor to create both tables
-- Go to: https://supabase.com/dashboard → your project → SQL Editor → New query

CREATE TABLE IF NOT EXISTS employee_onboarding (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Client info
  company_name TEXT NOT NULL,

  -- Employee info
  employee_first_name TEXT NOT NULL,
  employee_last_name TEXT NOT NULL,
  personal_email TEXT NOT NULL,
  work_email TEXT NOT NULL,
  job_title TEXT NOT NULL,
  department TEXT DEFAULT '',
  start_date DATE NOT NULL,
  birthday DATE,

  -- Manager info
  manager_name TEXT DEFAULT '',
  manager_email TEXT DEFAULT '',

  -- Microsoft
  microsoft_license TEXT NOT NULL,

  -- Additional
  phone_number TEXT DEFAULT '',
  notes TEXT DEFAULT '',

  -- Status tracking
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed'))
);

-- Enable Row Level Security
ALTER TABLE employee_onboarding ENABLE ROW LEVEL SECURITY;

-- Allow anyone to INSERT (submit the form)
CREATE POLICY "Anyone can submit onboarding" ON employee_onboarding
  FOR INSERT WITH CHECK (true);

-- Only service role can SELECT (admin dashboard uses service key)
CREATE POLICY "Service role can view all" ON employee_onboarding
  FOR SELECT USING (auth.role() = 'service_role');

-- Only service role can UPDATE (for status changes)
CREATE POLICY "Service role can update" ON employee_onboarding
  FOR UPDATE USING (auth.role() = 'service_role');

-- ============================================================
-- OFFBOARDING TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS employee_offboarding (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Client info
  company_name TEXT NOT NULL,

  -- Employee info
  employee_first_name TEXT NOT NULL,
  employee_last_name TEXT NOT NULL,
  work_email TEXT NOT NULL,
  job_title TEXT DEFAULT '',
  department TEXT DEFAULT '',
  last_day DATE NOT NULL,

  -- Manager info
  manager_name TEXT DEFAULT '',
  manager_email TEXT DEFAULT '',

  -- Microsoft license
  license_action TEXT NOT NULL,
  reassign_license_to TEXT DEFAULT '',

  -- Mailbox
  mailbox_action TEXT NOT NULL,
  forward_email_to TEXT DEFAULT '',

  -- Equipment & notes
  equipment_to_return TEXT DEFAULT '',
  notes TEXT DEFAULT '',

  -- Status tracking
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed'))
);

-- Enable Row Level Security
ALTER TABLE employee_offboarding ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit offboarding" ON employee_offboarding
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Service role can view offboarding" ON employee_offboarding
  FOR SELECT USING (auth.role() = 'service_role');

CREATE POLICY "Service role can update offboarding" ON employee_offboarding
  FOR UPDATE USING (auth.role() = 'service_role');
