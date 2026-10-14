// Wording for the admin controls over what each broker portal login can see.
// Brokers never see these labels: their portal simply shows the right records.
export const access = {
  levels: {
    own: "Their own clients only",
    brokerage: "Whole brokerage",
  },
  levelHelp:
    "Controls what this person sees in the broker portal. They aren't told their level: the portal just shows them the right quotes, policies and claims.",
  network: "Broker network",
  noNetwork: "Not in a network",
  networkHelp: "People at the network see this brokerage's business too.",
  save: "Save",
  saved: "Saved",
  orgs: {
    title: "Networks and coverholders",
    intro:
      "Logins above brokerage level. A network sees the business of its member brokerages; a coverholder sees all business on the products it writes. Both are view only: they can't fill in forms, create client links or bind.",
    networks: "Broker networks",
    coverholders: "Coverholders",
    members: "Member brokerages",
    noMembers: "No member brokerages yet. Add brokerages to the network from their page under Brokers.",
    products: "Products they see",
    productsHint: "Products they see (coverholders only)",
    people: "People",
    noPeople: "No one yet.",
    addPerson: "Add a person",
    addPersonHelp: "They get a welcome email with a link to set their password.",
    create: "Add a network or coverholder",
    name: "Name",
    kind: "Type",
    kinds: { network: "Broker network", coverholder: "Coverholder" },
    createButton: "Add",
  },
};
