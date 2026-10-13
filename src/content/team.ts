// Team members shown on /about-us/our-team. Add a photo to public/team/
// (square, about 900px) and reference it here.
export type TeamMember = { name: string; role: string; photo?: string };

export const team: TeamMember[] = [
  { name: "Craig Furness", role: "CEO & Director", photo: "/team/craig-furness.jpg" },
  // TODO(stage 2): remaining team members.
  ...Array.from({ length: 5 }, (_, i) => ({ name: `Team member ${i + 2}`, role: "Role title" })),
];
