// Strings shown in the Steve chat popup.
export const steveGreeting =
  "Kia ora, I'm Steve! I'm Otta's friendly otter. Ask me anything about our insurance, claims or how to get in touch.";

export const steveSuggestions = [
  "What insurance does Otta offer?",
  "How do I make a claim?",
  "Does Personal Accident cover illness?",
  "Who underwrites Otta's policies?",
];

/** "Contact an Otta team member": which team to email for each kind of query. */
export const contactTeams = [
  { label: "Travel", team: "travel team", email: "travel@ottainsurance.co.nz" },
  { label: "Property", team: "property team", email: "property@ottainsurance.co.nz" },
  { label: "Liability", team: "liability team", email: "liability@ottainsurance.co.nz" },
  { label: "Landlord cover", team: "landlord team", email: "real@ottainsurance.co.nz" },
  { label: "General", team: "team", email: "hello@ottainsurance.co.nz" },
];

/**
 * TEMPORARY: the chat offers two otters. Brad gives the normal answers;
 * Steve is at the pub and only ever replies with one of the lines below
 * (never calls the AI). Set `enabled: false` to go back to a single Steve.
 */
export const chatPersonas = {
  enabled: true,
  launcher: "Chat with Brad or Steve",
  chooserIntro: "Who would you like to talk to?",
  brad: {
    name: "Brad",
    tagline: "Otta's sensible otter",
    pitch: "Answers about our insurance, claims and how to get in touch.",
    greeting: "Kia ora, I'm Brad, Otta's otter. Ask me anything about our insurance, claims or how to get in touch.",
    disclaimer: "Brad is an AI assistant and gives general information only, not advice.",
  },
  steve: {
    name: "Steve",
    tagline: "Currently at the pub",
    pitch: "He's had a few. Don't expect much.",
    greeting: "Oi oi! Steve here. I'm down the pub, but go on, ask away.",
    disclaimer: "Steve is off duty. For real answers, switch to Brad or",
  },
  steveReplies: [
    "I'll answer tomorrow, I'm pissed at the pub.",
    "Nah, I can't be bothered answering that. I'd rather have a beer.",
    "Mate, it's my shout. Ask Brad, he's the sensible one.",
    "Hold that thought, the bartender's just poured me another.",
    "Can't hear ya, the band's too loud. Try Brad?",
    "Is it Friday? Feels like Friday. Ask me Monday.",
    "I've had three pints and a pie. Insurance can wait.",
    "Righto, I'll get back to you once I've finished this jug.",
    "Sorry, I'm on the dance floor. Brad's your otter for that one.",
    "Look, I'd love to help, but quiz night's about to start.",
  ],
};
