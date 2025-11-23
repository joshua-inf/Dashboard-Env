// app/api/send-verification-code/route.ts
import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// In-memory store for verification codes (use Redis in production)
const verificationCodes = new Map();

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { email, purpose = 'password_reset' } = body;

    if (!email) {
        return NextResponse.json(
            { message: 'Email is required' },
            { status: 400 }
        );
    }

    // Generate 6-digit code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes expiry

    // Store code with expiry
    verificationCodes.set(email, {
        code: verificationCode,
        expiresAt,
        purpose,
        attempts: 0
    });

    // Email content based on purpose
    const emailTemplates = {
        password_reset: {
            subject: 'Password Reset Verification Code - Xinsource',
            html: `
<!DOCTYPE html>
<html>
<head>
    <style>
        .container { max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; color: white; }
        .content { padding: 30px; background: #f9f9f9; }
        .code { font-size: 32px; font-weight: bold; text-align: center; letter-spacing: 8px; color: #333; margin: 20px 0; }
        .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
        .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Xinsource</h1>
            <p>Password Reset Verification</p>
        </div>
        <div class="content">
            <h2>Hello,</h2>
            <p>You requested to reset your password. Use the verification code below to proceed:</p>
            <div class="code">${verificationCode}</div>
            <p>This code will expire in 15 minutes.</p>
            <div class="warning">
                <strong>Security Notice:</strong> If you didn't request this code, please ignore this email and ensure your account is secure.
            </div>
        </div>
        <div class="footer">
            <p>&copy; 2024 Xinsource. All rights reserved.</p>
            <p>This is an automated message, please do not reply to this email.</p>
        </div>
    </div>
</body>
</html>
      `.trim()
        },
        account_verification: {
            subject: 'Verify Your Account - Xinsource',
            html: `
<!DOCTYPE html>
<html>
<head>
    <style>
        .container { max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; color: white; }
        .content { padding: 30px; background: #f9f9f9; }
        .code { font-size: 32px; font-weight: bold; text-align: center; letter-spacing: 8px; color: #333; margin: 20px 0; }
        .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>InXource</h1>
            <p>Account Verification</p>
        </div>
        <div class="content">
            <h2>Welcome to InXource!</h2>
            <p>Thank you for creating an account. Use the verification code below to complete your registration:</p>
            <div class="code">${verificationCode}</div>
            <p>This code will expire in 15 minutes.</p>
        </div>
        <div class="footer">
            <p>&copy; 2024 InXource. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
      `.trim()
        },
        two_factor: {
            subject: 'Two-Factor Authentication Code - InXource',
            html: `
<!DOCTYPE html>
<html>
<head>
    <style>
        .container { max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; color: white; }
        .content { padding: 30px; background: #f9f9f9; }
        .code { font-size: 32px; font-weight: bold; text-align: center; letter-spacing: 8px; color: #333; margin: 20px 0; }
        .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>InXource</h1>
            <p>Two-Factor Authentication</p>
        </div>
        <div class="content">
            <h2>Security Verification</h2>
            <p>Your two-factor authentication code is:</p>
            <div class="code">${verificationCode}</div>
            <p>This code will expire in 15 minutes.</p>
            <p><strong>Note:</strong> If you didn't attempt to log in, please secure your account immediately.</p>
        </div>
        <div class="footer">
            <p>&copy; 2024 InXource. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
      `.trim()
        }
    };

    const template = emailTemplates[purpose as keyof typeof emailTemplates] || emailTemplates.password_reset;

    console.log("SMTP_USER:", process.env.SMTP_USER);
    console.log("SMTP_PASS:", process.env.SMTP_PASS);

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: false,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    try {
        await transporter.sendMail({
            from: `"InXource" <${process.env.SMTP_USER}>`,
            to: email,
            subject: template.subject,
            html: template.html,
            text: `Your verification code is: ${verificationCode}. This code expires in 15 minutes.`,
        });

        // Log the action (in production, you might want to store this in a database)
        console.log(`Verification code sent to ${email} for ${purpose}`);

        return NextResponse.json({
            message: 'Verification code sent successfully',
            expiresIn: '15 minutes'
        });
    } catch (err: any) {
        console.error('Send verification code error:', err);

        // Remove the code if email failed to send
        verificationCodes.delete(email);

        return NextResponse.json(
            {
                message: 'Failed to send verification code',
                error: err.message
            },
            { status: 500 }
        );
    }
}

// API to verify the code
export async function PUT(req: NextRequest) {
    const body = await req.json();
    const { email, code } = body;

    if (!email || !code) {
        return NextResponse.json(
            { message: 'Email and code are required' },
            { status: 400 }
        );
    }

    const storedData = verificationCodes.get(email);

    if (!storedData) {
        return NextResponse.json(
            { message: 'No verification code found for this email' },
            { status: 404 }
        );
    }

    // Check if code has expired
    if (Date.now() > storedData.expiresAt) {
        verificationCodes.delete(email);
        return NextResponse.json(
            { message: 'Verification code has expired' },
            { status: 410 }
        );
    }

    // Check attempt limit
    if (storedData.attempts >= 5) {
        verificationCodes.delete(email);
        return NextResponse.json(
            { message: 'Too many failed attempts. Please request a new code.' },
            { status: 429 }
        );
    }

    // Verify code
    if (storedData.code !== code) {
        storedData.attempts += 1;
        verificationCodes.set(email, storedData);

        return NextResponse.json(
            { message: 'Invalid verification code' },
            { status: 400 }
        );
    }

    // Code is valid - remove it to prevent reuse
    verificationCodes.delete(email);

    return NextResponse.json({
        message: 'Verification successful',
        valid: true
    });
}

// Optional: API to check if a code exists for an email
export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (!email) {
        return NextResponse.json(
            { message: 'Email is required' },
            { status: 400 }
        );
    }

    const storedData = verificationCodes.get(email);

    if (!storedData) {
        return NextResponse.json({ exists: false });
    }

    const expiresIn = Math.max(0, storedData.expiresAt - Date.now());

    return NextResponse.json({
        exists: true,
        expiresIn: Math.floor(expiresIn / 1000), // seconds
        purpose: storedData.purpose,
        attempts: storedData.attempts
    });
}