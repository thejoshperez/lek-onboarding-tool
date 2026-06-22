import { createClient } from '@supabase/supabase-js'

export type OffboardingSubmission = {
  id?: string
  created_at?: string
  company_name: string
  employee_first_name: string
  employee_last_name: string
  work_email: string
  job_title: string
  department: string
  last_day: string
  manager_name: string
  manager_email: string
  license_action: string
  reassign_license_to: string
  mailbox_action: string
  forward_email_to: string
  equipment_to_return: string
  notes: string
  status?: string
  archived?: boolean
}

export type OnboardingSubmission = {
  id?: string
  created_at?: string
  company_name: string
  employee_first_name: string
  employee_last_name: string
  personal_email: string
  work_email: string
  job_title: string
  department: string
  start_date: string
  birthday: string
  manager_name: string
  manager_email: string
  microsoft_license: string
  phone_number: string
  notes: string
  status?: string
  archived?: boolean
}

export function getAnonClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key || url === 'your_supabase_project_url') {
    throw new Error('Supabase environment variables are not configured. Please update .env.local')
  }
  return createClient(url, key)
}

export function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceKey || url === 'your_supabase_project_url') {
    throw new Error('Supabase environment variables are not configured. Please update .env.local')
  }
  return createClient(url, serviceKey)
}
