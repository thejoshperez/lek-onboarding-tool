import { NextRequest, NextResponse } from 'next/server'
import { getServiceClient } from '@/lib/supabase'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const raw = await request.json()

    // Convert empty strings to null for optional fields
    const body = {
      ...raw,
      job_title: raw.job_title || null,
      department: raw.department || null,
      manager_name: raw.manager_name || null,
      manager_email: raw.manager_email || null,
      reassign_license_to: raw.reassign_license_to || null,
      forward_email_to: raw.forward_email_to || null,
      equipment_to_return: raw.equipment_to_return || null,
      notes: raw.notes || null,
    }

    const supabase = getServiceClient()
    const { data, error } = await supabase
      .from('employee_offboarding')
      .insert([body])
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Failed to save submission' }, { status: 500 })
    }

    if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 'your_resend_api_key') {
      try {
        await resend.emails.send({
          from: 'LEK Onboarding <onboarding@lektechnology.com>',
          to: process.env.NOTIFICATION_EMAIL || 'admin@lektechnology.com',
          subject: `Offboarding Request: ${body.employee_first_name} ${body.employee_last_name} — ${body.company_name}`,
          html: buildEmailHtml(body),
        })
      } catch (emailError) {
        console.error('Email send error:', emailError)
      }
    }

    return NextResponse.json({ success: true, id: data.id })
  } catch (err) {
    console.error('Offboard submit error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function buildEmailHtml(data: Record<string, string>) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #8B2236; padding: 24px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 22px;">Employee Offboarding Request</h1>
      </div>
      <div style="padding: 24px; background: #f9f9f9;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr style="background: white;">
            <td style="padding: 12px; font-weight: bold; color: #555; width: 40%;">Client Company</td>
            <td style="padding: 12px;">${data.company_name}</td>
          </tr>
          <tr style="background: #f4f4f4;">
            <td style="padding: 12px; font-weight: bold; color: #555;">Employee Name</td>
            <td style="padding: 12px;">${data.employee_first_name} ${data.employee_last_name}</td>
          </tr>
          <tr style="background: white;">
            <td style="padding: 12px; font-weight: bold; color: #555;">Work Email</td>
            <td style="padding: 12px;">${data.work_email}</td>
          </tr>
          <tr style="background: #f4f4f4;">
            <td style="padding: 12px; font-weight: bold; color: #555;">Job Title</td>
            <td style="padding: 12px;">${data.job_title || '—'}</td>
          </tr>
          <tr style="background: white;">
            <td style="padding: 12px; font-weight: bold; color: #555;">Last Day</td>
            <td style="padding: 12px; color: #c0392b; font-weight: bold;">${data.last_day}</td>
          </tr>
          <tr style="background: #f4f4f4;">
            <td style="padding: 12px; font-weight: bold; color: #555;">Manager</td>
            <td style="padding: 12px;">${data.manager_name || '—'} ${data.manager_email ? `(${data.manager_email})` : ''}</td>
          </tr>
          <tr style="background: white;">
            <td style="padding: 12px; font-weight: bold; color: #555;">License Action</td>
            <td style="padding: 12px;">${data.license_action}</td>
          </tr>
          <tr style="background: #f4f4f4;">
            <td style="padding: 12px; font-weight: bold; color: #555;">Reassign License To</td>
            <td style="padding: 12px;">${data.reassign_license_to || '—'}</td>
          </tr>
          <tr style="background: white;">
            <td style="padding: 12px; font-weight: bold; color: #555;">Mailbox Action</td>
            <td style="padding: 12px;">${data.mailbox_action}</td>
          </tr>
          <tr style="background: #f4f4f4;">
            <td style="padding: 12px; font-weight: bold; color: #555;">Forward Email To</td>
            <td style="padding: 12px;">${data.forward_email_to || '—'}</td>
          </tr>
          <tr style="background: white;">
            <td style="padding: 12px; font-weight: bold; color: #555;">Equipment to Return</td>
            <td style="padding: 12px;">${data.equipment_to_return || '—'}</td>
          </tr>
          <tr style="background: #f4f4f4;">
            <td style="padding: 12px; font-weight: bold; color: #555;">Notes</td>
            <td style="padding: 12px;">${data.notes || '—'}</td>
          </tr>
        </table>
      </div>
      <div style="background: #8B2236; padding: 16px; text-align: center;">
        <p style="color: white; margin: 0; font-size: 13px;">LEK Technology — Employee Offboarding System</p>
      </div>
    </div>
  `
}
