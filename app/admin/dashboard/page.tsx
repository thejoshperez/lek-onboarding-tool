'use client'

import { Suspense, useEffect, useState, useCallback } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import type { OnboardingSubmission, OffboardingSubmission } from '@/lib/supabase'

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  in_progress: 'bg-blue-100 text-blue-800 border-blue-200',
  completed: 'bg-green-100 text-green-800 border-green-200',
}

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  in_progress: 'In Progress',
  completed: 'Completed',
}

type Tab = 'onboarding' | 'offboarding'

function AdminDashboard() {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('onboarding')
  const [onboarding, setOnboarding] = useState<OnboardingSubmission[]>([])
  const [offboarding, setOffboarding] = useState<OffboardingSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedOnboard, setSelectedOnboard] = useState<OnboardingSubmission | null>(null)
  const [selectedOffboard, setSelectedOffboard] = useState<OffboardingSubmission | null>(null)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  const fetchAll = useCallback(async () => {
    setLoading(true)
    try {
      const [onboardRes, offboardRes] = await Promise.all([
        fetch('/api/submissions'),
        fetch('/api/offboarding-submissions'),
      ])

      if (onboardRes.status === 401 || offboardRes.status === 401) {
        router.push('/admin')
        return
      }

      const onboardData = await onboardRes.json()
      const offboardData = await offboardRes.json()
      if (!onboardRes.ok) throw new Error(onboardData.error)
      if (!offboardRes.ok) throw new Error(offboardData.error)
      setOnboarding(onboardData.submissions)
      setOffboarding(offboardData.submissions)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load submissions')
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => { fetchAll() }, [fetchAll])

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin')
  }

  const updateStatus = async (id: string, status: string, type: Tab) => {
    const endpoint = type === 'onboarding' ? '/api/submissions' : '/api/offboarding-submissions'
    await fetch(endpoint, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    })
    if (type === 'onboarding') {
      setOnboarding(prev => prev.map(s => s.id === id ? { ...s, status } : s))
      if (selectedOnboard?.id === id) setSelectedOnboard(prev => prev ? { ...prev, status } : null)
    } else {
      setOffboarding(prev => prev.map(s => s.id === id ? { ...s, status } : s))
      if (selectedOffboard?.id === id) setSelectedOffboard(prev => prev ? { ...prev, status } : null)
    }
  }

  const activeList = tab === 'onboarding' ? onboarding : offboarding

  const filtered = activeList.filter(s => {
    const matchesFilter = filter === 'all' || s.status === filter
    const q = search.toLowerCase()
    const matchesSearch = !q || [s.employee_first_name, s.employee_last_name, s.company_name, s.work_email].some(f => f?.toLowerCase().includes(q))
    return matchesFilter && matchesSearch
  })

  const counts = (list: typeof activeList) => ({
    all: list.length,
    pending: list.filter(s => s.status === 'pending').length,
    in_progress: list.filter(s => s.status === 'in_progress').length,
    completed: list.filter(s => s.status === 'completed').length,
  })

  const currentCounts = counts(activeList)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#8B2236] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Loading submissions...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow p-8 max-w-md text-center">
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      </div>
    )
  }

  const selectedItem = tab === 'onboarding' ? selectedOnboard : selectedOffboard

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Image src="/lek-logo.png" alt="LEK Technology" width={100} height={40} className="object-contain" />
            <div className="border-l border-gray-300 pl-4">
              <p className="text-sm font-semibold text-gray-800">Admin Dashboard</p>
              <p className="text-xs text-gray-400">Employee Requests</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={fetchAll} className="text-xs text-[#8B2236] font-medium hover:underline">
              Refresh
            </button>
            <button
              onClick={handleLogout}
              className="text-xs text-gray-400 hover:text-gray-600 font-medium transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6 w-full flex-1 flex flex-col gap-4">

        {/* Tabs */}
        <div className="flex gap-1 bg-white border border-gray-200 rounded-xl p-1 w-fit shadow-sm">
          <button
            onClick={() => { setTab('onboarding'); setFilter('all'); setSearch('') }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === 'onboarding' ? 'bg-[#8B2236] text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            Onboarding
            <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${tab === 'onboarding' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`}>
              {onboarding.length}
            </span>
          </button>
          <button
            onClick={() => { setTab('offboarding'); setFilter('all'); setSearch('') }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === 'offboarding' ? 'bg-[#8B2236] text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM21 12h-6" />
            </svg>
            Offboarding
            <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${tab === 'offboarding' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`}>
              {offboarding.length}
            </span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {(['all', 'pending', 'in_progress', 'completed'] as const).map(key => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`bg-white rounded-xl border p-4 text-left transition-all ${filter === key ? 'border-[#8B2236] ring-1 ring-[#8B2236]/20' : 'border-gray-200 hover:border-gray-300'}`}
            >
              <p className="text-2xl font-bold text-gray-800">{currentCounts[key]}</p>
              <p className="text-xs text-gray-400 mt-0.5">{key === 'in_progress' ? 'In Progress' : key === 'all' ? 'Total' : STATUS_LABELS[key]}</p>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={`Search ${tab} requests...`}
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8B2236]/20 focus:border-[#8B2236] bg-white"
          />
        </div>

        {/* Main content */}
        <div className="flex gap-4 flex-1 min-h-0">
          {/* List */}
          <div className="flex-1 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
            {filtered.length === 0 ? (
              <div className="flex-1 flex items-center justify-center p-8 text-center">
                <p className="text-gray-400 text-sm">No {tab} requests found</p>
              </div>
            ) : (
              <div className="overflow-y-auto">
                {filtered.map(sub => {
                  const isSelected = selectedItem?.id === sub.id
                  const dateLabel = tab === 'onboarding'
                    ? `Start: ${(sub as OnboardingSubmission).start_date || ''}`
                    : `Last day: ${(sub as OffboardingSubmission).last_day || ''}`
                  return (
                    <button
                      key={sub.id}
                      onClick={() => tab === 'onboarding' ? setSelectedOnboard(sub as OnboardingSubmission) : setSelectedOffboard(sub as OffboardingSubmission)}
                      className={`w-full text-left px-5 py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${isSelected ? 'bg-[#8B2236]/5 border-l-2 border-l-[#8B2236]' : ''}`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-semibold text-gray-800 text-sm">{sub.employee_first_name} {sub.employee_last_name}</p>
                          <p className="text-xs text-gray-500">{sub.company_name}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{dateLabel}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1.5 shrink-0">
                          <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${STATUS_COLORS[sub.status || 'pending']}`}>
                            {STATUS_LABELS[sub.status || 'pending']}
                          </span>
                          <span className="text-xs text-gray-400">
                            {sub.created_at ? new Date(sub.created_at).toLocaleDateString() : ''}
                          </span>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* Detail panel */}
          {selectedItem ? (
            <div className="w-96 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col overflow-hidden">
              <div className={`px-5 py-4 flex items-center justify-between ${tab === 'onboarding' ? 'bg-[#8B2236]' : 'bg-gray-700'}`}>
                <div>
                  <p className="text-white font-semibold">{selectedItem.employee_first_name} {selectedItem.employee_last_name}</p>
                  <p className="text-white/70 text-xs">{selectedItem.company_name} &bull; {tab === 'onboarding' ? 'Onboarding' : 'Offboarding'}</p>
                </div>
                <button onClick={() => tab === 'onboarding' ? setSelectedOnboard(null) : setSelectedOffboard(null)} className="text-white/70 hover:text-white">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Status control */}
              <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-2">
                <span className="text-xs text-gray-500 font-medium">Status:</span>
                {(['pending', 'in_progress', 'completed'] as const).map(s => (
                  <button
                    key={s}
                    onClick={() => updateStatus(selectedItem.id!, s, tab)}
                    className={`text-xs px-2.5 py-1 rounded-full border font-medium transition-all ${selectedItem.status === s ? STATUS_COLORS[s] : 'text-gray-400 border-gray-200 hover:border-gray-300'}`}
                  >
                    {STATUS_LABELS[s]}
                  </button>
                ))}
              </div>

              <div className="overflow-y-auto flex-1 p-5 space-y-3">
                {tab === 'onboarding' ? (
                  <OnboardingDetail sub={selectedOnboard!} />
                ) : (
                  <OffboardingDetail sub={selectedOffboard!} />
                )}
                <DetailRow label="Submitted" value={selectedItem.created_at ? new Date(selectedItem.created_at).toLocaleString() : ''} />
              </div>
            </div>
          ) : (
            <div className="w-96 bg-white rounded-xl border border-gray-200 shadow-sm flex items-center justify-center text-center p-8">
              <div>
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <p className="text-gray-400 text-sm">Select a request to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function OnboardingDetail({ sub }: { sub: OnboardingSubmission }) {
  return (
    <>
      <DetailRow label="Work Email" value={sub.work_email} />
      <DetailRow label="Personal Email" value={sub.personal_email} />
      <DetailRow label="Job Title" value={sub.job_title} />
      <DetailRow label="Department" value={sub.department} />
      <DetailRow label="Start Date" value={sub.start_date} highlight />
      <DetailRow label="Birthday" value={sub.birthday} />
      <DetailRow label="Phone" value={sub.phone_number} />
      <DetailRow label="Manager" value={sub.manager_name} />
      <DetailRow label="Manager Email" value={sub.manager_email} />
      <DetailRow label="Microsoft License" value={sub.microsoft_license} highlight />
      {sub.notes && (
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Notes</p>
          <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">{sub.notes}</p>
        </div>
      )}
    </>
  )
}

function OffboardingDetail({ sub }: { sub: OffboardingSubmission }) {
  return (
    <>
      <DetailRow label="Work Email" value={sub.work_email} />
      <DetailRow label="Job Title" value={sub.job_title} />
      <DetailRow label="Department" value={sub.department} />
      <DetailRow label="Last Day" value={sub.last_day} highlight />
      <DetailRow label="Manager" value={sub.manager_name} />
      <DetailRow label="Manager Email" value={sub.manager_email} />
      <DetailRow label="License Action" value={sub.license_action} highlight />
      <DetailRow label="Reassign License To" value={sub.reassign_license_to} />
      <DetailRow label="Mailbox Action" value={sub.mailbox_action} highlight />
      <DetailRow label="Forward Email To" value={sub.forward_email_to} />
      {sub.equipment_to_return && (
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Equipment to Return</p>
          <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">{sub.equipment_to_return}</p>
        </div>
      )}
      {sub.notes && (
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Notes</p>
          <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">{sub.notes}</p>
        </div>
      )}
    </>
  )
}

function DetailRow({ label, value, highlight }: { label: string; value?: string; highlight?: boolean }) {
  if (!value) return null
  return (
    <div>
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">{label}</p>
      <p className={`text-sm ${highlight ? 'text-[#8B2236] font-semibold' : 'text-gray-700'}`}>{value}</p>
    </div>
  )
}

export default function AdminDashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#8B2236] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <AdminDashboard />
    </Suspense>
  )
}
