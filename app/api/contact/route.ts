import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Initialize Resend only if API key is available
let resend: Resend | null = null;
if (process.env.RESEND_API_KEY) {
  resend = new Resend(process.env.RESEND_API_KEY);
}

export async function POST(request: Request) {
  try {
    const { name, email, subject, message } = await request.json();

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const emailSubject = subject || 'New message from portfolio website';
    const timestamp = new Date().toISOString();

    // Try to send real email if Resend is configured
    if (resend && process.env.RESEND_FROM && process.env.RESEND_TO) {
      try {
        const { data, error } = await resend.emails.send({
          from: process.env.RESEND_FROM,
          to: process.env.RESEND_TO,
          subject: `[Portfolio] ${emailSubject}`,
          html: `
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${emailSubject}</p>
            <p><strong>Message:</strong></p>
            <div style="padding: 15px; background-color: #f5f5f5; border-left: 4px solid #007bff; margin: 10px 0;">
              ${message.replace(/\n/g, '<br>')}
            </div>
            <p><strong>Timestamp:</strong> ${timestamp}</p>
            <hr>
            <p style="color: #666; font-size: 12px;">This email was sent from your portfolio website contact form.</p>
          `,
          text: `
New Contact Form Submission

Name: ${name}
Email: ${email}
Subject: ${emailSubject}
Message: ${message}
Timestamp: ${timestamp}
          `
        });

        if (error) {
          console.error('Resend API error:', error);
          throw new Error('Failed to send email via Resend');
        }

        console.log('Email sent successfully via Resend:', data);
        return NextResponse.json({
          success: true,
          message: 'Email sent successfully!',
          data: {
            name,
            email,
            subject: emailSubject,
            timestamp,
            emailId: data?.id
          }
        });

      } catch (emailError) {
        console.error('Error sending email with Resend:', emailError);
        // Fall through to demo mode
      }
    }

    // Demo mode: Log the submission and return success
    const submissionData = {
      name,
      email,
      subject: emailSubject,
      message,
      timestamp
    };

    console.log('Demo contact form submission:', submissionData);

    return NextResponse.json({
      success: true,
      message: 'Message received! This is demo mode - no actual email was sent.',
      data: submissionData
    });

  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: 'Failed to process contact form submission'
      },
      { status: 500 }
    );
  }
}