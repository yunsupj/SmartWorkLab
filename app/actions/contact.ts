'use server';

import { Resend } from 'resend';

// Initializing the server-side environment parameters for secure B2B comms
const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

export async function sendContactEmail(formData: FormData) {
  const name = formData.get('name')?.toString();
  const email = formData.get('email')?.toString();
  const brief = formData.get('brief')?.toString();

  if (!name || !email || !brief) {
    return { success: false, error: 'Missing required configuration fields.' };
  }

  if (!resend) {
    console.warn('[DEV MODE] Simulated Mail Payload:', { name, email, brief });
    // Soft fallback for development environments mapping without local .env payloads
    return { success: true, message: 'Simulated Successfully' };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'SmartWorkLab Contact <onboarding@resend.dev>', // Adjust to verfied production domain subsequently
      to: ['yuun@yuunchloe.com'],
      subject: `[SmartWorkLab] New Inquiry from ${name}`,
      text: `Client Name: ${name}\nClient Email: ${email}\n\nProject Brief / Architectural Context:\n${brief}`,
      replyTo: email,
    });

    if (error) {
      console.error('Resend Network API Error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error: any) {
    console.error('Contact Email System Failure:', error);
    return { success: false, error: error.message || 'Unknown Server Network Error' };
  }
}
