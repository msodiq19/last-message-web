import { Resend } from "resend";

let _resend: Resend | null = null;
function getResend(): Resend {
  if (!_resend) {
    _resend = new Resend(process.env.RESEND_API_KEY);
  }
  return _resend;
}

const FROM_EMAIL = process.env.FROM_EMAIL || "Last Message <onboarding@resend.dev>";

const TRUST_FOOTER = `
---
We rely on your check-ins, not email delivery.
Email reminders are a convenience, not a guarantee.
If reminders fail and you don't check in, the message will be released.
`.trim();

/**
 * Send a check-in reminder to the message creator.
 */
export async function sendReminderEmail(
  to: string,
  daysLeft: number,
  checkinUrl: string
): Promise<{ success: boolean; hardBounce?: boolean }> {
  try {
    const { error } = await getResend().emails.send({
      from: FROM_EMAIL,
      to,
      subject: `Last Message: ${daysLeft} day${daysLeft === 1 ? "" : "s"} until your message is released`,
      text: `Your message will be released in ${daysLeft} day${daysLeft === 1 ? "" : "s"} unless you check in.

Check in now: ${checkinUrl}

${TRUST_FOOTER}`,
    });

    if (error) {
      console.error("Resend reminder error:", JSON.stringify(error));
      // Check for hard bounce indicators
      const errorMsg = JSON.stringify(error).toLowerCase();
      const isHardBounce =
        errorMsg.includes("bounce") ||
        errorMsg.includes("invalid") ||
        errorMsg.includes("not found") ||
        errorMsg.includes("rejected");

      return { success: false, hardBounce: isHardBounce };
    }

    return { success: true };
  } catch (err) {
    console.error("Resend reminder exception:", err);
    return { success: false, hardBounce: false };
  }
}

/**
 * Send the release notification to the recipient.
 */
export async function sendReleaseEmail(
  to: string,
  readUrl: string
): Promise<{ success: boolean }> {
  try {
    const { data, error } = await getResend().emails.send({
      from: FROM_EMAIL,
      to,
      subject: "Someone left you a message",
      text: `Someone set up a Last Message for you.

Last Message is a dead man's switch. The person who wrote this message
set it to be delivered to you if they stopped checking in for 14 days.

They have not checked in. The message has been released.

Read your message: ${readUrl}

You will need the encryption key (a .key file) that the sender kept.
If you don't have it, the message cannot be decrypted.

This is not spam. This is not marketing. Someone chose you.`,
    });

    if (error) {
      console.error("Resend release error:", JSON.stringify(error));
    } else {
      console.log("Resend release sent:", JSON.stringify(data));
    }

    return { success: !error };
  } catch (err) {
    console.error("Resend release exception:", err);
    return { success: false };
  }
}
