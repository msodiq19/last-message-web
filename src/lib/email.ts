import { Resend } from "resend";

let _resend: Resend | null = null;
function getResend(): Resend {
  if (!_resend) {
    _resend = new Resend(process.env.RESEND_API_KEY);
  }
  return _resend;
}

const FROM_EMAIL = process.env.FROM_EMAIL || "In Case <hello@incase.dmsodiq.xyz>";

/**
 * Send a check-in reminder to the message creator.
 */
export async function sendReminderEmail(
  to: string,
  daysLeft: number
): Promise<{ success: boolean; hardBounce?: boolean }> {
  try {
    const { error } = await getResend().emails.send({
      from: FROM_EMAIL,
      to,
      subject: daysLeft <= 1 ? `Check in - today is the last day` : `Check in - ${daysLeft} days left`,
      text: `Just a reminder to check in.

You have ${daysLeft} day${daysLeft === 1 ? "" : "s"} before your message is automatically delivered to your recipient${daysLeft === 1 ? ". Today is the last day" : ""}.

Log in to check in:
https://incase.dmsodiq.xyz/check-in

If you meant for this to happen, you don't need to do anything.

In Case`,
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
 * Send a handshake invitation to a recipient when a message is created for them.
 */
export async function sendHandshakeEmail(
  to: string,
  recipientName: string,
  senderName: string,
  handshakeUrl: string
): Promise<{ success: boolean }> {
  try {
    const { error } = await getResend().emails.send({
      from: FROM_EMAIL,
      to,
      subject: `${senderName} left something for you`,
      text: `Hi ${recipientName},

${senderName} has written something private and left it with you, to be delivered if they ever can't reach you themselves.

Before that can happen, you need to do one quick thing: set up your personal access. It takes about a minute, and it only needs to happen once.

${handshakeUrl}

You'll create a password during setup. Keep it somewhere safe. It's the only way to open the message if it ever comes to you. We don't store it, so we can't help you recover it.

If you're not sure why you're receiving this, it means ${senderName} trusts you enough to choose you. You don't have to do anything right now, but completing the setup means you'll be ready when it matters.

In Case`,
    });

    if (error) {
      console.error("Resend handshake error:", JSON.stringify(error));
      return { success: false };
    }
    return { success: true };
  } catch (err) {
    console.error("Resend handshake exception:", err);
    return { success: false };
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
      subject: `You have a message waiting`,
      text: `Someone left something for you.

A private message was written for you and kept safe until now. The person who wrote it set it to reach you if they went quiet, and they have.

Read it here:
${readUrl}

You'll need the Access Password you created when you accepted this. If you've forgotten it, we're sorry. It was never stored anywhere. That was on purpose.

In Case`,
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
