# Otta website design system

The visual rules the site follows, written so they can be reused on another
project. Values are the ones in the code (`src/app/globals.css`,
`src/components/Mockup.tsx`).

## Overall feel

Clean, flat and calm. White space does most of the work. No gradients, no
shadows on content, almost no rounded corners. Colour comes in full-width
blocks (a teal band, a blue panel) rather than decoration. Headings are bold
and tight; body text is light grey and airy.

## Colour

| Role | Hex | Use |
| --- | --- | --- |
| Teal (primary) | `#61b9ad` | Buttons, headings on white, accent rules, full-width bands |
| Light teal | `#85c6bd` | Large card backgrounds (Solutions, "Why choose") |
| Pale teal | `#e6f4f2` | Soft information bands ("This policy at a glance") |
| Deep blue | `#014c69` | Feature panel |
| Purple | `#5e008d` | Feature panel (used sparingly, one at a time) |
| Charcoal | `#303133` | Headings, nav, link text |
| Body grey | `#777777` | Paragraph text, secondary buttons |
| Off-white | `#f7f7f7` | Footer, grey panels, tab area |
| Rule grey | `#eaeaea` | Thin dividers and borders |
| Image placeholder | `#a3c7c2` | Soft muted teal stand-in for photography, labelled "placeholder image" in light italic |

Brand palette from the Otta guidelines (print values): Ocean `#76bab2`,
Cloud `#e9eae9`, Sunset `#713089`, Deep `#004988`. The website uses the
slightly stronger screen versions above.

Rules of thumb:
- White is the default background. Alternate white sections with one coloured
  band; avoid two coloured bands touching.
- Text on teal, blue or purple is always white.
- Teal is the only "action" colour. Grey buttons are for secondary actions.

## Typography

| Use | Font | Size | Weight | Notes |
| --- | --- | --- | --- | --- |
| Hero headline | Raleway | 50px (38 mobile) | 700 | Centred, white on video |
| Section heading | Raleway | 40px (32 mobile) | 700 | Tracking -0.03em, charcoal |
| Page heading (teal) | Raleway | 30px | 600 | Centred, teal, thin rule beneath |
| Card / column title | Raleway | 20 to 25px | 600 | Charcoal or teal |
| Body | Poppins | 16px | 400 | Line height 1.75, grey `#777` |
| Small body | Poppins | 14 to 15px | 400 | Panels, footer |
| Nav | Poppins | 15px | 400 | Letter spacing 0.05em |
| Button label | Poppins | 12px | 500 | UPPERCASE, letter spacing 0.12em |

- Two fonts only: Raleway for headings, Poppins for everything else.
- Headings are bold with slightly tight tracking; body text is regular, grey and
  generously spaced.
- Copy: no em dashes or en dashes. Use commas, colons or full stops.

## Spacing

- Content width: 1366px max container with ~16px side padding (20px on mobile).
  Text-only blocks narrow to 680 to 900px and centre.
- Section padding: about 100 to 120px top and bottom on desktop.
- Gap between columns or cards: 36px.
- Inside cards and panels: 36px padding.
- Heading to body: 24 to 40px. Body to button: 40px.
- Grids: 4 columns (home products), 3 columns (values, solutions, team),
  collapsing to 2 then 1.

## Shape and rounding

- Square corners almost everywhere: buttons, inputs, images, cards.
- Grey panels get a barely-there 2px radius.
- Exceptions: circular icon badges (82px teal outline with a tick), and the
  chat widget (pill launcher, 12px panel, rounded bubbles) which is meant to
  feel friendly and separate from the page.
- No drop shadows on page content. A light shadow only on floating UI (dropdown
  menu, chat).

## Buttons

| Type | Style |
| --- | --- |
| Primary small | Teal fill, white 12px uppercase label, 15px x 32px padding, square |
| Light small | White fill, charcoal label (on teal, blue or purple backgrounds) |
| Secondary small | Grey `#777` fill, white label (downloads, documents) |
| Large | Teal fill or white outline, 17px sentence-case label, 19px x 48px padding |
| Header login | 1px charcoal outline, uppercase, letter-spaced |

Hover: teal darkens to `#4fa99c`; white and grey buttons invert to charcoal.

## Signature patterns

- **Centred page intro:** teal heading, 226px thin grey rule, grey paragraph.
- **Teal rule:** 90px x 2px teal line under big charcoal headings.
- **Split hero:** image fills the left ~46%, text on white to the right.
- **Colour strip:** half-width teal intro beside two quarter-width blue and
  purple feature panels.
- **Tick cards:** white cards on light teal, each with a teal outline circle
  and tick.
- **Angled divider:** two pale teal wedges where a teal section meets white.
- **Tabs:** centred uppercase labels, teal underline on the active tab.
- **Header:** white, tall with a large logo at the top of the page, shrinking
  to a slim bar on scroll.

## Imagery

- Full-bleed photography or video for heroes; square or 3:2 crops elsewhere.
- Portraits on a flat teal background (see the team page).
- Placeholders are soft muted teal blocks labelled "placeholder image" until real photos arrive.
