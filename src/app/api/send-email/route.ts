import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { to, amount, businessId } = body;

  const userSubject = 'Withdrawal Initialized Successfully';
  const userText = `
Hello,

Your withdrawal has been initialized successfully.

Amount: ${amount}
Business ID: ${businessId}

Thank you for using InXource.
  `.trim();

  const adminSubject = 'Withdrawal Requested';
  const adminText = `
Notice:

A new withdrawal has been requested.

Recipient Email: ${to}
Amount: ${amount}
Business ID: ${businessId}

Please review and process accordingly.
  `.trim();

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    // 1. Send to user
    await transporter.sendMail({
      from: `"InXource" <${process.env.SMTP_USER}>`,
      to,
      subject: userSubject,
      text: userText,
    });

    // 2. Send to admin/internal email
    await transporter.sendMail({
      from: `"InXource" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER, // replace with your actual admin email
      subject: adminSubject,
      text: adminText,
    });

    return NextResponse.json({ message: 'Emails sent successfully' });
  } catch (err: any) {
    console.error('Send email error:', err);
    return NextResponse.json({ message: 'Failed to send email', error: err.message }, { status: 500 });
  }
}
