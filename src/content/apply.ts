// "Apply now" on the product pages. Only brokers submit applications, through
// the broker portal; anyone can download the blank proposal form.
export const applyCopy = {
  title: (product: string) => `Apply for ${product}`,
  intro: "Otta works through insurance brokers. Your broker completes the application with you and sends it to the Otta team through the Otta Broker Portal.",
  broker: {
    heading: "I'm a broker",
    body: "Sign in to the Otta Broker Portal to complete the proposal for your client, or send them a link to fill it in.",
    button: "Go to the broker portal",
  },
  download: {
    heading: "Download the proposal form",
    body: (form: string) => `Download the ${form} as a PDF to read through or fill in, then give it to your broker to send to us.`,
    button: "Download PDF",
  },
  noForm: {
    heading: "Talk to us",
    body: "A proposal form for this product is coming soon. In the meantime, contact the team and we'll help you or your broker apply.",
    button: "Contact us",
  },
};
