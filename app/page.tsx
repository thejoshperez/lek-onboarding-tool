import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <Image src="/lek-logo.png" alt="LEK Technology" width={120} height={50} className="object-contain" />
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16">
        <div className="text-center mb-10 max-w-xl">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Employee Management Portal</h1>
          <p className="text-gray-500">
            Submit a request to the LEK Technology team for employee onboarding or offboarding. We&apos;ll handle the rest.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full max-w-2xl">
          {/* Onboarding Card */}
          <Link href="/onboarding" className="group bg-white border border-gray-200 rounded-2xl shadow-sm p-8 hover:border-[#8B2236] hover:shadow-md transition-all flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#8B2236]/10 flex items-center justify-center mb-5 group-hover:bg-[#8B2236]/15 transition-colors">
              <svg className="w-8 h-8 text-[#8B2236]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-gray-800 mb-2">New Employee Onboarding</h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              Set up a new employee with a Microsoft 365 account, email address, and any required software or access.
            </p>
            <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[#8B2236] group-hover:gap-2.5 transition-all">
              Start Request
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </Link>

          {/* Offboarding Card */}
          <Link href="/offboarding" className="group bg-white border border-gray-200 rounded-2xl shadow-sm p-8 hover:border-[#8B2236] hover:shadow-md transition-all flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-5 group-hover:bg-gray-200 transition-colors">
              <svg className="w-8 h-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM21 12h-6" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-gray-800 mb-2">Employee Offboarding</h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              Remove a departing employee&apos;s access, handle their Microsoft license, mailbox, and equipment return.
            </p>
            <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-gray-600 group-hover:gap-2.5 transition-all">
              Start Request
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </Link>
        </div>

        <p className="mt-10 text-xs text-gray-400">
          Managed by LEK Technology &bull; Est. 1993
        </p>
      </main>
    </div>
  )
}
