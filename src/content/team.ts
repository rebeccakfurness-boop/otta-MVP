// Team members shown on /about-us/our-team, in display order. Add a photo to
// public/team/ (square, about 900px) and reference it here.
export type TeamMember = { name: string; role: string; photo?: string };

export const team: TeamMember[] = [
  { name: "Craig Furness", role: "CEO & Director", photo: "/team/craig-furness.jpg" },
  { name: "Jonathon Gilham", role: "Director", photo: "/team/jonathon-gilham.jpg" },
  { name: "Katrina O'Connor", role: "Client Relationships Manager", photo: "/team/katrina-oconnor.jpg" },
  { name: "Rosanna Clements", role: "Broker Market Manager", photo: "/team/rosanna-clements.jpg" },
  { name: "Sam Furness", role: "Underwriter", photo: "/team/sam-furness.jpg" },
  { name: "Shabnam Sarang", role: "Finance and Operations Partner" },
  { name: "Michelle Smith", role: "Operations Manager" },
  { name: "Jemma Lee-Matson", role: "Claims Manager" },
  { name: "Gaby Cook", role: "People & Capability Partner" },
  { name: "Jen Whitcombe", role: "Operations" },
  { name: "Rebecca Furness", role: "Operations", photo: "/team/rebecca-furness.jpg" },
];
