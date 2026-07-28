import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

// AWS SES client - picks up credentials from env vars automatically:
// AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION
const sesClient = new SESClient({
  region: process.env.AWS_REGION || 'us-east-1',
});

const FROM_EMAIL = process.env.SES_FROM_EMAIL || 'no-reply@example.com';

export interface SendResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export async function sendEmailViaSES(
  toEmail: string,
  subject: string,
  htmlBody: string
): Promise<SendResult> {
  // Guard: if SES isn't configured, don't attempt a real send (useful in dev/demo)
  if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
    return { success: false, error: 'AWS SES credentials not configured' };
  }

  try {
    const command = new SendEmailCommand({
      Source: FROM_EMAIL,
      Destination: { ToAddresses: [toEmail] },
      Message: {
        Subject: { Data: subject, Charset: 'UTF-8' },
        Body: {
          Html: { Data: htmlBody, Charset: 'UTF-8' },
        },
      },
    });

    const response = await sesClient.send(command);
    return { success: true, messageId: response.MessageId };
  } catch (err: any) {
    return { success: false, error: err.message || 'Unknown SES error' };
  }
}
