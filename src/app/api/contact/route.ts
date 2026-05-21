import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { validateContactForm, type ContactFormData } from '@/lib/contactValidation';

// Initialize Resend lazily to avoid build-time errors when API key is not set
function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn('RESEND_API_KEY is not configured. Email notifications will be skipped.');
    return null;
  }
  return new Resend(apiKey);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const formData: ContactFormData = {
      name: body.name || '',
      email: body.email || '',
      subject: body.subject || '',
      message: body.message || '',
    };

    // Server-side validation
    const errors = validateContactForm(formData);
    if (errors.length > 0) {
      return NextResponse.json(
        { success: false, error: errors.join(' ') },
        { status: 400 }
      );
    }

    // Send email notification
    const resend = getResendClient();
    let emailError: Error | null = null;

    if (resend) {
      const emailSubject = formData.subject
        ? `[Website Inquiry] ${formData.subject}`
        : '[Website Inquiry] New Contact Form Submission';

      const result = await resend.emails.send({
        from: 'Sweet Life Website <noreply@sweetlife.cafe>',
        to: ['info@sweetlife.cafe'],
        replyTo: formData.email,
        subject: emailSubject,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #F79D28; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { background: #fff; border: 1px solid #ddd; padding: 20px; border-radius: 0 0 8px 8px; }
              .info-section { background: #f9f9f9; padding: 15px; border-radius: 6px; margin: 15px 0; }
              .detail-row { padding: 8px 0; border-bottom: 1px solid #eee; }
              .detail-row:last-child { border-bottom: none; }
              .label { font-weight: bold; color: #666; }
              .message-box { background: #fff; padding: 15px; border-radius: 6px; margin: 15px 0; border-left: 4px solid #F79D28; }
              .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #666; font-size: 0.9em; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0;">📧 New Website Inquiry</h1>
              </div>
              <div class="content">
                <h2 style="color: #F79D28; margin-top: 0;">Contact Details</h2>

                <div class="info-section">
                  <div class="detail-row">
                    <span class="label">Name:</span>
                    <span>${formData.name}</span>
                  </div>
                  <div class="detail-row">
                    <span class="label">Email:</span>
                    <span><a href="mailto:${formData.email}">${formData.email}</a></span>
                  </div>
                  ${formData.subject ? `
                  <div class="detail-row">
                    <span class="label">Subject:</span>
                    <span>${formData.subject}</span>
                  </div>
                  ` : ''}
                </div>

                <h2 style="color: #F79D28;">Message</h2>
                <div class="message-box">
                  <p style="margin: 0; white-space: pre-wrap;">${formData.message}</p>
                </div>

                <div class="footer">
                  <p>This message was sent via the Sweet Life website contact form.</p>
                  <p>You can reply directly to this email to respond to ${formData.name}.</p>
                </div>
              </div>
            </div>
          </body>
          </html>
        `,
      });
      emailError = result.error;
    }

    if (emailError) {
      console.error('Resend email error:', emailError);
      // Don't fail the request if email fails - log for debugging
      // In production, you might want to handle this differently
    }

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully',
    });
  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
