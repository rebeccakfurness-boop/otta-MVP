// Broker onboarding and sign-in link wording: the pages and the emails.

export const onboarding = {
  join: {
    title: "Request access",
    intro: "Tell us about you and your brokerage. The Otta team checks every request, usually within one working day.",
    roles: ["Broker", "Account manager", "Broker support", "Principal or director", "Other"],
    done: {
      title: "Thanks, we've got your request",
      matched: (brokerage: string) =>
        `It looks like you're from ${brokerage}, which already uses the portal. We'll add you to their account and email you a link to get started.`,
      fresh: "We'll check your details and email you a link to set up your account. If we need anything else, we'll be in touch.",
    },
    existing: "You already have a portal account with that email.",
  },
  link: {
    title: "Email me a sign-in link",
    intro: "Enter the email address you use for the portal. We'll email you a link that signs you straight in. It works once, for 20 minutes.",
    done: (email: string) =>
      `If ${email} has a portal account, a sign-in link is on its way. Check your inbox (and junk folder). The link works once, for 20 minutes.`,
  },
  welcome: {
    title: "Welcome to Otta",
    intro: (name: string, brokerage: string) => `Kia ora ${name.split(" ")[0]}. Set a password for your ${brokerage} account to get started.`,
    sso: "Prefer to sign in with your brokerage's Microsoft or Google account? You can do that from the sign-in page once your account is set up.",
    expired: "This welcome link has expired or has already been used. Email yourself a sign-in link instead, or ask the Otta team to resend your invite.",
  },
  account: {
    resetPrompt: "You're signed in with an emailed link. Set a new password below so you can sign in with it next time.",
  },
  emails: {
    magic: (o: { name: string; url: string }) => ({
      subject: "Your Otta Broker Portal sign-in link",
      text: [
        `Kia ora ${o.name.split(" ")[0]},`,
        ``,
        `Here's your link to sign in to the Otta Broker Portal:`,
        o.url,
        ``,
        `It works once, for the next 20 minutes. Once you're in, you can set a new password from Your account.`,
        ``,
        `If you didn't ask for this, you can ignore this email.`,
        ``,
        `The Otta team`,
      ].join("\n"),
    }),
    invite: (o: { name: string; brokerage: string; url: string }) => ({
      subject: "Welcome to the Otta Broker Portal",
      text: [
        `Kia ora ${o.name.split(" ")[0]},`,
        ``,
        `Your Otta Broker Portal account for ${o.brokerage} is ready. Set your password here:`,
        o.url,
        ``,
        `The link works for 7 days. In the portal you can track quote requests and policies, download documents, and complete or send our proposal forms.`,
        ``,
        `The Otta team`,
      ].join("\n"),
    }),
    received: (o: { name: string }) => ({
      subject: "We've received your Otta Broker Portal request",
      text: [
        `Kia ora ${o.name.split(" ")[0]},`,
        ``,
        `Thanks for asking for access to the Otta Broker Portal. We check every request, usually within one working day, and will email you a link to set up your account.`,
        ``,
        `The Otta team`,
      ].join("\n"),
    }),
    toOtta: (o: { name: string; email: string; phone: string; role: string; brokerage: string; fsp?: string; message?: string; matched?: string; url: string }) => ({
      subject: `Broker portal access request: ${o.name}, ${o.brokerage}`,
      text: [
        `${o.name} has asked for access to the Otta Broker Portal.`,
        ``,
        `Name: ${o.name}`,
        `Email: ${o.email}`,
        `Phone: ${o.phone}`,
        `Role: ${o.role}`,
        `Brokerage: ${o.brokerage}${o.fsp ? ` (FSP ${o.fsp})` : ""}`,
        o.matched ? `Matches existing brokerage: ${o.matched}` : `New brokerage (no match on email domain)`,
        o.message ? `\nMessage: ${o.message}` : ``,
        ``,
        `Approve or decline in the admin portal: ${o.url}`,
      ].join("\n"),
    }),
    declined: (o: { name: string }) => ({
      subject: "Your Otta Broker Portal request",
      text: [
        `Kia ora ${o.name.split(" ")[0]},`,
        ``,
        `Thanks for your interest in the Otta Broker Portal. We aren't able to set up an account for you at the moment. If you think this is a mistake, reply to this email and we'll take another look.`,
        ``,
        `The Otta team`,
      ].join("\n"),
    }),
  },
};
