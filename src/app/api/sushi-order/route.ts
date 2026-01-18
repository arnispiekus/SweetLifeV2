import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { validateSushiOrder, type SushiOrderFormData } from '@/lib/sushiValidation';
import { getSizeByPieces } from '@/data/sushiData';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const orderData: SushiOrderFormData = {
      fullName: body.fullName,
      phone: body.phone,
      email: body.email,
      pickupDateTime: body.pickupDateTime,
      specialRequests: body.specialRequests || '',
      variation: body.variation,
      pieces: body.pieces,
      price: body.price,
    };

    // Server-side validation
    const errors = validateSushiOrder(orderData);
    if (errors.length > 0) {
      return NextResponse.json(
        { success: false, error: errors.join(' ') },
        { status: 400 }
      );
    }

    // Format pickup datetime for display
    const pickupDate = new Date(orderData.pickupDateTime);
    const formattedPickup = pickupDate.toLocaleString('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    // Get payment link
    const sizeInfo = getSizeByPieces(orderData.pieces);
    const paymentLink = sizeInfo?.paymentLink || '';

    // Send email notification to cafe owner
    const { error: emailError } = await resend.emails.send({
      from: 'Sweet Life Sushi <orders@sweetlifecafe.co.uk>',
      to: ['info@sweetlifecafe.co.uk'],
      replyTo: orderData.email,
      subject: `New Sushi Pre-Order: ${orderData.pieces} pieces - ${orderData.variation}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #F79D28; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #fff; border: 1px solid #ddd; padding: 20px; border-radius: 0 0 8px 8px; }
            .order-details { background: #f9f9f9; padding: 15px; border-radius: 6px; margin: 15px 0; }
            .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
            .detail-row:last-child { border-bottom: none; }
            .label { font-weight: bold; color: #666; }
            .value { color: #333; }
            .price { font-size: 1.2em; color: #F79D28; font-weight: bold; }
            .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #666; font-size: 0.9em; }
            .special-requests { background: #fff3cd; padding: 15px; border-radius: 6px; margin: 15px 0; border-left: 4px solid #ffc107; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">🍣 New Sushi Pre-Order</h1>
            </div>
            <div class="content">
              <h2 style="color: #F79D28; margin-top: 0;">Order Details</h2>

              <div class="order-details">
                <div class="detail-row">
                  <span class="label">Quantity:</span>
                  <span class="value">${orderData.pieces} pieces</span>
                </div>
                <div class="detail-row">
                  <span class="label">Variation:</span>
                  <span class="value">${orderData.variation}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Price:</span>
                  <span class="value price">£${orderData.price}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Pickup:</span>
                  <span class="value">${formattedPickup}</span>
                </div>
              </div>

              <h2 style="color: #F79D28;">Customer Information</h2>

              <div class="order-details">
                <div class="detail-row">
                  <span class="label">Name:</span>
                  <span class="value">${orderData.fullName}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Phone:</span>
                  <span class="value"><a href="tel:${orderData.phone}">${orderData.phone}</a></span>
                </div>
                <div class="detail-row">
                  <span class="label">Email:</span>
                  <span class="value"><a href="mailto:${orderData.email}">${orderData.email}</a></span>
                </div>
              </div>

              ${orderData.specialRequests ? `
              <h2 style="color: #F79D28;">Special Requests</h2>
              <div class="special-requests">
                <p style="margin: 0;">${orderData.specialRequests}</p>
              </div>
              ` : ''}

              <div class="footer">
                <p><strong>Payment Link:</strong><br>
                <a href="${paymentLink}" style="color: #F79D28;">${paymentLink}</a></p>
                <p>Please contact the customer to confirm their order and pickup time.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (emailError) {
      console.error('Resend email error:', emailError);
      // Don't fail the request if email fails - the order was still placed
      // Log for debugging but continue with success response
    }

    return NextResponse.json({
      success: true,
      message: 'Order submitted successfully',
      paymentLink,
    });
  } catch (error) {
    console.error('Sushi order API error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
