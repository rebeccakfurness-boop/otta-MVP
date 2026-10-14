// "Apply now" on the product pages: brokers go to the broker portal, everyone
// else can fill in the proposal form on the website.
export const applyCopy = {
  title: (product: string) => `Apply for ${product}`,
  intro: "Choose how you would like to apply. Either way, your application goes straight to the Otta team.",
  broker: {
    heading: "I'm a broker",
    body: "Sign in to the Otta Broker Portal to complete the proposal for your client, or send them a link to fill it in.",
    button: "Go to the broker portal",
  },
  direct: {
    heading: "Apply directly",
    body: (form: string) => `Fill in the ${form} online. It takes about 10 minutes, and you can download a PDF copy at any time.`,
    button: "Start the application",
  },
  noForm: {
    heading: "Talk to us",
    body: "An online proposal for this product is coming soon. In the meantime, contact the team and we'll help you apply.",
    button: "Contact us",
  },
  formIntro: (team: string) =>
    `Please answer every question below. When you submit, your application goes straight to ${team}, who will be in touch. You can download a PDF copy at any time.`,
};
