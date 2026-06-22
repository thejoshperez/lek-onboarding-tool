'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

const LICENSE_ACTIONS = [
  'Remove license immediately',
  'Reassign license to another employee',
  'Keep active temporarily (specify in notes)',
]

const MAILBOX_ACTIONS = [
  'Forward emails to another employee',
  'Set auto-reply and disable account',
  'Convert to shared mailbox',
  'Archive and disable',
]

type FormData = {
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
}

const initialForm: FormData = {
  company_name: '',
  employee_first_name: '',
  employee_last_name: '',
  work_email: '',
  job_title: '',
  department: '',
  last_day: '',
  manager_name: '',
  manager_email: '',
  license_action: '',
  reassign_license_to: '',
  mailbox_action: '',
  forward_email_to: '',
  equipment_to_return: '',
  notes: '',
}

export default function OffboardingForm() {
  const [form, setForm] = useState<FormData>(initialForm)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      const res = await fetch('/api/offboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Something went wrong')
      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submission failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Request Submitted!</h2>
          <p className="text-gray-500 mb-6">
            The LEK Technology team has received the offboarding request for{' '}
            <span className="font-semibold text-gray-700">{form.employee_first_name} {form.employee_last_name}</span> and will begin the process shortly.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => { setSubmitted(false); setForm(initialForm) }}
              className="bg-[#8B2236] text-white px-5 py-2.5 rounded-lg font-medium hover:bg-[#701c2b] transition-colors text-sm"
            >
              Submit Another
            </button>
            <Link href="/" className="border border-gray-200 text-gray-600 px-5 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/">
            <Image src="/lek-logo.png" alt="LEK Technology" width={120} height={50} className="object-contain" />
          </Link>
          <div className="border-l border-gray-300 pl-4">
            <p className="text-sm text-gray-500 font-medium">Employee Offboarding</p>
            <p className="text-xs text-gray-400">Departure & Access Removal Request</p>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/" className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Employee Offboarding Request</h1>
            <p className="text-gray-500 mt-0.5 text-sm">
              Submit this form to remove a departing employee&apos;s accounts and access.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Client Info */}
          <Section title="Your Company" subtitle="Tell us which company this is for">
            <Field label="Company / Organization Name" required>
              <input name="company_name" value={form.company_name} onChange={handleChange} required placeholder="Acme Corp" className={inputClass} />
            </Field>
          </Section>

          {/* Employee Info */}
          <Section title="Departing Employee" subtitle="Who is leaving the company?">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="First Name" required>
                <input name="employee_first_name" value={form.employee_first_name} onChange={handleChange} required placeholder="Jane" className={inputClass} />
              </Field>
              <Field label="Last Name" required>
                <input name="employee_last_name" value={form.employee_last_name} onChange={handleChange} required placeholder="Smith" className={inputClass} />
              </Field>
            </div>
            <Field label="Work Email Address" required>
              <input name="work_email" type="email" value={form.work_email} onChange={handleChange} required placeholder="jane@yourcompany.com" className={inputClass} />
            </Field>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Job Title">
                <input name="job_title" value={form.job_title} onChange={handleChange} placeholder="Account Manager" className={inputClass} />
              </Field>
              <Field label="Department">
                <input name="department" value={form.department} onChange={handleChange} placeholder="Sales" className={inputClass} />
              </Field>
            </div>
            <Field label="Last Day of Employment" required>
              <input name="last_day" type="date" value={form.last_day} onChange={handleChange} required className={inputClass} />
            </Field>
          </Section>

          {/* Manager Info */}
          <Section title="Manager / Supervisor" subtitle="Who is authorizing this offboarding?">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Manager Full Name">
                <input name="manager_name" value={form.manager_name} onChange={handleChange} placeholder="John Doe" className={inputClass} />
              </Field>
              <Field label="Manager Email">
                <input name="manager_email" type="email" value={form.manager_email} onChange={handleChange} placeholder="john@yourcompany.com" className={inputClass} />
              </Field>
            </div>
          </Section>

          {/* Microsoft License */}
          <Section title="Microsoft 365 License" subtitle="What should happen to their Microsoft license?">
            <Field label="License Action" required>
              <select name="license_action" value={form.license_action} onChange={handleChange} required className={inputClass}>
                <option value="">— Select an action —</option>
                {LICENSE_ACTIONS.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </Field>
            {form.license_action === 'Reassign license to another employee' && (
              <Field label="Reassign To (Name or Email)" required>
                <input name="reassign_license_to" value={form.reassign_license_to} onChange={handleChange} required placeholder="New employee name or email" className={inputClass} />
              </Field>
            )}
          </Section>

          {/* Mailbox */}
          <Section title="Email Mailbox" subtitle="What should happen to their email account?">
            <Field label="Mailbox Action" required>
              <select name="mailbox_action" value={form.mailbox_action} onChange={handleChange} required className={inputClass}>
                <option value="">— Select an action —</option>
                {MAILBOX_ACTIONS.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </Field>
            {form.mailbox_action === 'Forward emails to another employee' && (
              <Field label="Forward To (Email Address)" required>
                <input name="forward_email_to" type="email" value={form.forward_email_to} onChange={handleChange} required placeholder="manager@yourcompany.com" className={inputClass} />
              </Field>
            )}
          </Section>

          {/* Equipment */}
          <Section title="Equipment Return" subtitle="List any company equipment that needs to be collected">
            <Field label="Equipment to Return" hint="e.g. laptop, phone, key fob, monitor...">
              <textarea
                name="equipment_to_return"
                value={form.equipment_to_return}
                onChange={handleChange}
                rows={3}
                placeholder="Laptop (Dell XPS 15), iPhone 13, building key fob..."
                className={inputClass + ' resize-none'}
              />
            </Field>
          </Section>

          {/* Notes */}
          <Section title="Additional Notes" subtitle="Any other access, accounts, or instructions?">
            <Field label="Notes">
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                rows={4}
                placeholder="e.g. Remove from Slack, revoke VPN access, cancel Adobe subscription..."
                className={inputClass + ' resize-none'}
              />
            </Field>
          </Section>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-[#8B2236] text-white py-3.5 px-6 rounded-xl font-semibold text-base hover:bg-[#701c2b] active:scale-[0.99] transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
          >
            {submitting ? 'Submitting...' : 'Submit Offboarding Request'}
          </button>

          <p className="text-center text-xs text-gray-400 pb-4">
            Your request will be received by the LEK Technology team immediately.
          </p>
        </form>
      </main>
    </div>
  )
}

const inputClass = 'w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#8B2236]/30 focus:border-[#8B2236] transition-colors placeholder:text-gray-400'

function Section({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="bg-gray-50 border-b border-gray-200 px-5 py-3.5">
        <h2 className="font-semibold text-gray-800 text-sm">{title}</h2>
        <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>
      </div>
      <div className="p-5 space-y-4">{children}</div>
    </div>
  )
}

function Field({ label, required, hint, children }: { label: string; required?: boolean; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
        {label} {required && <span className="text-[#8B2236]">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
  )
}
