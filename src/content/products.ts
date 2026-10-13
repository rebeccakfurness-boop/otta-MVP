// Product copy for the Our Solutions pages. Source: "Product Summaries – Website".
// "Hummi" and "TAI" in the source copy have been replaced with "Otta".

export type Product = {
  slug: string;
  name: string;
  /** Short name used in "Why choose Otta for …" and cards. */
  shortName: string;
  category: "accident-travel" | "property" | "liability";
  summary: string;
  /** Card text on the Our Solutions page. */
  overview: string;
  /** Paragraphs; an array of strings renders as a bullet list. */
  intro: (string | string[])[];
  atAGlance: { label: string; value: string }[];
  statements: [string, string, string];
  /** Supporting text under each statement (draft, drawn from the product copy). */
  statementDetails: [string, string, string];
  coverageTagline: string;
  coverage: { title: string; items: string[] }[];
  keyExclusions: string[];
  claim: {
    paragraphs: string[];
    /** Show the standard form / phone / email options. */
    showContactOptions: boolean;
    emergencyPhone?: string;
  };
};

const standardClaim = {
  paragraphs: [
    "For non-emergency claims please contact your broker to discuss the process. You can also:",
  ],
  showContactOptions: true,
};

export const products: Product[] = [
  {
    slug: "corporate-travel-insurance",
    name: "Corporate Travel Insurance",
    shortName: "Corporate Travel Insurance",
    category: "accident-travel",
    summary:
      "Financial protection and peace of mind for businesses and their people when travelling.",
    overview:
      "Travel insurance is a crucial form of coverage that provides financial protection and peace of mind to both businesses and individuals when travelling. Whether it's for business or personal trips, travel insurance safeguards against unexpected events and emergencies that can occur during travel.",
    intro: [
      "Travel insurance is a crucial form of coverage that provides financial protection and peace of mind to both businesses and individuals when travelling. Whether it's for business or personal trips, travel insurance safeguards against unexpected events and emergencies that can occur during travel.",
      "Otta's insurance policies typically cover a range of risks, including trip cancellation or interruption, medical expenses, lost or delayed baggage, and emergency medical evacuation.",
    ],
    atAGlance: [
      { label: "Product", value: "Corporate Travel" },
      {
        label: "Underwriter",
        value: "Certain Underwriters at Lloyd's of London. Lead syndicate – Canopius 4444",
      },
      { label: "Target Market", value: "Commercial entities" },
      { label: "Policy Term", value: "Annual" },
    ],
    statements: [
      "Otta has a broad appetite to cover all risks – whether mainstream or complex",
      "Quick turnaround and access to the underwriter – talk directly to us to help us make the complex simple",
      "Comprehensive coverage backed by global strength and certainty delivered through Lloyd's of London",
    ],
    statementDetails: [
      "Medical, baggage, cancellation and curtailment are covered as standard, and we have appetite for the unusual and high-risk \u2013 including specialist cover for athletes and sportspeople.",
      "Talk directly to the underwriter who can make the decision. Most risks can be underwritten and included \u2013 if you're not sure, just ask.",
      "Your cover is placed with Certain Underwriters at Lloyd's of London, with Canopius 4444 as lead syndicate.",
    ],
    coverageTagline: "Smart organisations don't leave home without Otta onboard.",
    coverage: [
      {
        title: "What's covered?",
        items: [
          "Medical, baggage, cancellation and curtailment",
          "Pre-existing conditions covered unless travelling against medical advice",
          "Appetite for the unusual and high-risk – talk to us if you're not sure",
        ],
      },
      { title: "Age limits", items: ["Up to 80", "Individual consideration above age 80"] },
      {
        title: "Underwriting approach",
        items: ["Appetite for all risks – genuine underwriting based on the data and facts"],
      },
      {
        title: "Optional extras",
        items: [
          "Accompanying Personal Accident cover",
          "Specialist cover options for athletes and sportspeople including cover whilst training and competing",
          "Cover for sporting equipment while in transit",
        ],
      },
      {
        title: "Leisure travel",
        items: ["Leisure travel included for senior management and their families"],
      },
      {
        title: "Other",
        items: [
          "Travel to sanctioned countries and territories is excluded.",
          "Most other risks can be underwritten and included – if you're not sure, talk directly to the underwriter who can make the decision",
        ],
      },
    ],
    keyExclusions: ["Travel to sanctioned countries and territories"],
    claim: {
      paragraphs: [
        "For non-emergency claims please contact your broker to discuss the process. You will need to complete a claim form and provide the relevant supporting documents such as receipts, medical reports or police reports which are outlined in the claim form.",
      ],
      showContactOptions: false,
      emergencyPhone: "+61 2 9312 5168",
    },
  },
  {
    slug: "landlord-insurance",
    name: "Landlord Insurance",
    shortName: "Landlord Insurance",
    category: "property",
    summary:
      "Specialist cover protecting landlords from losses associated with the tenancy of their property.",
    overview:
      "Owning a rental property comes with significant financial opportunities, but it also carries unique risks. Landlord insurance is designed to protect property investors from the unexpected, offering cover that goes beyond standard home insurance.",
    intro: [
      "Owning a rental property comes with significant financial opportunities, but it also carries unique risks. Landlord insurance is designed to protect property investors from the unexpected, offering cover that goes beyond standard home insurance. From damage caused by tenants to loss of rental income, landlord insurance provides a safety net that ensures your investment continues to generate returns even when unforeseen challenges arise. It's an essential tool for any property owner looking to protect their assets and reduce the stress of managing a rental.",
      "Our comprehensive landlord insurance solutions include cover for accidental or intentional damage, loss of rent due to tenant default or uninhabitable conditions, legal liability, and protection against natural disasters. Our policies also extend to cover landlord-owned contents, fixtures, and, in our Premier solution, issues like methamphetamine contamination.",
      "With flexible options tailored to the needs of property investors, landlord insurance offers peace of mind that your rental property is safeguarded, allowing you to focus on building long-term wealth with confidence.",
    ],
    atAGlance: [
      {
        label: "Product",
        value:
          "Landlord Insurance – cover for landlords protecting them from losses associated with the tenancy of their property",
      },
      {
        label: "Underwriter",
        value: "Certain Underwriters at Lloyd's of London – lead syndicate Beazley 2623",
      },
      { label: "Target Market", value: "Commercial entities" },
      { label: "Policy Term", value: "Annual" },
      {
        label: "Other",
        value: "Usually put in place alongside a comprehensive property insurance policy",
      },
    ],
    statements: [
      "Protect your rental income with cover for loss of rent if tenants default or your property becomes uninhabitable.",
      "Gain peace of mind with specialist insurance designed specifically for landlords and their unique needs.",
      "Comprehensive coverage backed by global strength and certainty delivered through Lloyd's of London.",
    ],
    statementDetails: [
      "Cover for loss of rental income when tenants default or the property can't be lived in, alongside intentional or accidental damage, pet damage and legal liability.",
      "Policies and claims are handled by a team who understand tenancy issues, making the process smoother and more empathetic for landlords.",
      "Your cover is placed with Certain Underwriters at Lloyd's of London, with Beazley 2623 as lead syndicate.",
    ],
    coverageTagline: "Keep your investment property in tune with Otta risk protection",
    coverage: [
      {
        title: "What's covered?",
        items: [
          "Loss of rental income",
          "Landlord's contents",
          "Intentional or accidental damage",
          "Legal liability",
          "Pet damage",
        ],
      },
      {
        title: "Excesses",
        items: [
          "Attractive low excesses",
          "Avoidance of multiple excesses for different types of damage found in a single inspection",
        ],
      },
      {
        title: "Underwriting approach",
        items: [
          "Efficient, transparent and risk-aware underwriting approach designed to give certainty to Property Managers and Landlords.",
        ],
      },
      {
        title: "Specialist support",
        items: [
          "Policies and claims are handled by a team who understand tenancy issues, making the process smoother and more empathetic for landlords",
        ],
      },
      { title: "Key exclusions", items: [
      "Holiday or short-term rentals",
      "Coverage is only available for properties that are professionally managed by an Approved Property Management Company.",
      "Owner occupied properties",
    ] },
    ],
    keyExclusions: [
      "Holiday or short-term rentals",
      "Coverage is only available for properties that are professionally managed by an Approved Property Management Company.",
      "Owner occupied properties",
    ],
    claim: {
      paragraphs: [
        "To lodge a claim, contact your property manager, who will complete and submit the claim form on your behalf to Otta. You'll need to provide relevant details such as the tenant's information, tenancy agreement, rent records, and evidence of any damage or loss (e.g. photos, invoices, inspection reports). The property manager will work directly with us throughout the process, ensuring claims are handled efficiently and in line with policy requirements.",
      ],
      showContactOptions: false,
    },
  },
  {
    slug: "rental-property-insurance",
    name: "Rental Property Insurance",
    shortName: "Rental Property Insurance",
    category: "property",
    summary:
      "Comprehensive property cover for residential rental properties, designed for landlords.",
    overview:
      "Otta's Rental Property insurance is specifically designed to give landlords peace of mind. It includes the standard covers such as for the building and natural disasters, and adds in additional cover specific to rental properties. These include intentional damage and methamphetamine contamination.",
    intro: [
      "Rental housing plays a prominent role in the New Zealand housing landscape. Approximately one in three Kiwi households—around 33%—are renters, marking a notable increase over recent decades and highlighting the growing importance of effective landlord insurance strategies. Given this substantial portion of the population relies on renting, landlords face unique risks, from natural disasters and tenant-related incidents to potential gaps in coverage that traditional homeowner insurance simply doesn't address.",
      "Otta's Rental Property insurance is specifically designed to give landlords peace of mind. It includes the standard covers such as for the building and natural disasters, and adds in additional cover specific to rental properties. These include intentional damage and methamphetamine contamination.",
      "The policy can be paired with a comprehensive Landlord policy providing even more protection from tenant related risks such as absconding tenants and pet damage.",
    ],
    atAGlance: [
      { label: "Product", value: "Property cover for residential rental properties" },
      {
        label: "Underwriter",
        value: "Certain Underwriters at Lloyd's of London – lead syndicate Beazley 2623",
      },
      { label: "Target Market", value: "Residential rental properties" },
      { label: "Policy Term", value: "Annual" },
    ],
    statements: [
      "Comprehensive cover for landlords to protect their investment",
      "Cover specifically designed to address key risks that not all insurers cover, including intentional damage by tenants and methamphetamine contamination",
      "Comprehensive coverage backed by global strength and certainty delivered through Lloyd's of London",
    ],
    statementDetails: [
      "Full replacement cover, natural hazards and property owner's liability, with appetite for rental properties up to $5,000,000 site sum insured.",
      "Intentional damage and methamphetamine or hazardous substance damage are each covered to $100,000.",
      "Your cover is placed with Certain Underwriters at Lloyd's of London, with Beazley 2623 as lead syndicate.",
    ],
    coverageTagline: "Safeguard your rental property with Otta risk protection",
    coverage: [
      {
        title: "What's covered?",
        items: [
          "Comprehensive property insurance product",
          "Full replacement cover",
          "Intentional damage to $100,000",
          "Cover for methamphetamine and hazardous substance damage to $100,000",
          "Natural hazards",
          "Property owner's liability",
        ],
      },
      { title: "Excesses", items: ["From $1000"] },
      {
        title: "Underwriting approach",
        items: ["Appetite for all rental properties up to $5,000,000 site sum insured"],
      },
      {
        title: "Extra inclusions",
        items: [
          "Cover for loss of rent",
          "Landlord's chattels that are provided with the tenancy",
          "Gradual damage to $5000",
        ],
      },
      {
        title: "Landlord's obligations",
        items: [
          "Carry out internal and external property inspections at least every six months.",
          "Conduct inspections whenever there is a change of tenancy.",
          "Keep written records of each inspection and any issues identified.",
        ],
      },
      {
        title: "Package with",
        items: ["Landlord Classic or Premiere to cover additional tenant related risks"],
      },
      { title: "Key exclusions", items: ["Short-term tenancies", "AirBnB and similar", "Owner occupied properties"] },
    ],
    keyExclusions: ["Short-term tenancies", "AirBnB and similar", "Owner occupied properties"],
    claim: standardClaim,
  },
  {
    slug: "social-and-community-housing-insurance",
    name: "Social and Community Housing Insurance",
    shortName: "Social and Community Housing",
    category: "property",
    summary:
      "Tailored property cover for social and community housing providers and the communities they serve.",
    overview:
      "Social and community housing is an essential part of New Zealand's housing landscape, providing secure, affordable homes for individuals and families who may otherwise struggle to access the private market.",
    intro: [
      "Social and community housing is an essential part of New Zealand's housing landscape, providing secure, affordable homes for individuals and families who may otherwise struggle to access the private market. These properties, managed by government agencies, iwi organisations, and community housing providers, are more than just buildings - they are a cornerstone of social stability, wellbeing, and inclusion. Yet, the very nature of this sector presents a unique set of risks, from higher tenant support needs to properties located in areas more exposed to natural disasters or social challenges.",
      "While insurance is a vital safeguard for any property owner, standard policies are often ill-equipped to handle the complexities of social and community housing. Otta fills this gap by delivering tailored cover, responsive claims handling, and risk management support designed specifically for the sector's realities. This not only protects the physical assets but also ensures housing providers can continue their mission - maintaining continuity of service and safeguarding vulnerable communities when unforeseen events occur.",
    ],
    atAGlance: [
      {
        label: "Product",
        value: "Property cover for Social and Community Housing properties",
      },
      {
        label: "Underwriter",
        value: "Certain Underwriters at Lloyd's of London. Lead syndicate – Beazley 2623",
      },
      {
        label: "Target Market",
        value: "Rented properties in social or community housing programmes",
      },
      { label: "Policy Term", value: "Annual" },
    ],
    statements: [
      "Specialist cover recognising the multi-party relationship of owner, community housing provider and tenant",
      "Tailored cover to address unique sector risks such as intentional damage and methamphetamine contamination",
      "Comprehensive coverage backed by global strength and certainty delivered through Lloyd's of London",
    ],
    statementDetails: [
      "Cover designed around the relationship between property owner, community housing provider and tenant.",
      "Intentional damage and methamphetamine or hazardous substance damage are each covered to $100,000, with loss of rent included.",
      "Your cover is placed with Certain Underwriters at Lloyd's of London, with Beazley 2623 as lead syndicate.",
    ],
    coverageTagline: "Otta specialises in tailoring solutions for complex multi-party tenancies",
    coverage: [
      {
        title: "What's covered?",
        items: [
          "Comprehensive property insurance product",
          "Full replacement cover",
          "Intentional damage to $100,000",
          "Cover for methamphetamine and hazardous substance damage to $100,000",
          "Natural hazards",
          "Property owner's liability",
        ],
      },
      { title: "Excesses", items: ["From $1000"] },
      {
        title: "Underwriting approach",
        items: [
          "Appetite for all social and community housing risks that are owned for rental purposes",
        ],
      },
      {
        title: "Extra inclusions",
        items: [
          "Cover for loss of rent",
          "Landlord's chattels that are provided with the tenancy",
          "Gradual damage to $5000",
        ],
      },
      {
        title: "Landlord's obligations",
        items: [
          "Carry out internal and external property inspections at least every six months.",
          "Conduct inspections whenever there is a change of tenancy.",
          "Keep written records of each inspection and any issues identified.",
        ],
      },
      { title: "Key exclusions", items: ["Short-term tenancies", "AirBnB and similar", "Owner occupied properties"] },
    ],
    keyExclusions: ["Short-term tenancies", "AirBnB and similar", "Owner occupied properties"],
    claim: standardClaim,
  },
  {
    slug: "personal-accident-insurance",
    name: "Personal Accident Insurance",
    shortName: "Personal Accident Insurance",
    category: "accident-travel",
    summary:
      "Agreed value accident and illness cover that tops up ACC and fills the gaps it leaves.",
    overview:
      "Personal Accident insurance provides financial protection in the event of accidental injury, disability, or death. It is designed to offer individuals and their families peace of mind by providing financial support during challenging times.",
    intro: [
      "Personal Accident insurance provides financial protection in the event of accidental injury, disability, or death. It is designed to offer individuals and their families peace of mind by providing financial support during challenging times. This insurance policy typically covers a wide range of accidents, including those that occur at home, work, or during leisure activities.",
      "About a third of medical issues that prevent people from working are accident related, with the remainder due to illness.",
      "This policy goes beyond the cover that ACC provides as it often:",
      [
        "includes cover for serious illness",
        "cover if ACC does not respond",
        "tops up ACC payments from 80% to 100% of pre-accident income",
      ],
      "Accidents or illness can happen to anyone, regardless of age or occupation, and the financial consequences can be significant. Otta's agreed value Personal Accident and Illness insurance solutions provide a safety net, ensuring that individuals and their loved ones are protected financially in the event of an accident or illness, allowing them to focus on recovery and rebuilding their lives.",
      "Otta has appetite for unusual or difficult to place risks and occupations. Recent examples include pilots, professional athletes and sports teams, and forestry contractors.",
    ],
    atAGlance: [
      { label: "Product", value: "Personal Accident and Illness" },
      {
        label: "Underwriter",
        value: "Certain Underwriters at Lloyd's of London – lead syndicate Canopius 4444",
      },
      { label: "Target Market", value: "Sole traders and commercial entities" },
      { label: "Policy Term", value: "Annual" },
    ],
    statements: [
      "Personal accident and illness insurance provides a financial lifeline if injury or illness prevents you from working, ensuring you can keep meeting everyday expenses",
      "ACC in New Zealand covers accidents, but not illness—this insurance fills the gap, protecting your income when health challenges strike",
      "With cover in place, you can focus on recovery, not financial stress",
    ],
    statementDetails: [
      "Weekly benefits of up to 75% of income for up to 2 years if accident or illness stops you working, plus lump sum payments for serious injury or death.",
      "About a third of medical issues that prevent people from working are accident related \u2013 the rest are illness, which ACC does not cover.",
      "Agreed value cover with a broad appetite for all occupations, including pilots, forestry workers, miners and athletes.",
    ],
    coverageTagline: "Don't leave home without Otta onboard.",
    coverage: [
      {
        title: "What's covered?",
        items: [
          "Weekly benefits of up to 75% of income for 2 years if you cannot work due to accident or illness",
          "Lump sum payments for serious injury or death",
        ],
      },
      {
        title: "Age limits",
        items: [
          "Up to age 60 without restrictions",
          "Cover for illness up to age 70",
          "Cover for accident only for those over 70 years old",
        ],
      },
      {
        title: "Underwriting approach",
        items: [
          "Broad appetite for all occupations, including high risk",
          "Ability to insure pilots, forestry workers, miners and athletes",
        ],
      },
      {
        title: "Other information",
        items: [
          "Stand down period from 7 days to 56 days",
          "Benefit period up to 2 years",
          "Up to $2,500 per week benefit",
          "Up to $250,000 lump sum benefits",
        ],
      },
      { title: "Key exclusions", items: [
      "Pre-existing medical conditions",
      "Other insuring clause so if ACC is paying then this cover tops up rather than pays in addition to ACC",
    ] },
    ],
    keyExclusions: [
      "Pre-existing medical conditions",
      "Other insuring clause so if ACC is paying then this cover tops up rather than pays in addition to ACC",
    ],
    claim: standardClaim,
  },
  {
    slug: "liability-insurance",
    name: "Liability Insurance",
    shortName: "Liability Insurance",
    category: "liability",
    summary:
      "Professional Indemnity, Public, Statutory and Employers Liability cover for New Zealand businesses.",
    overview:
      "Liability insurance protects individuals and businesses from financial losses resulting from legal claims or lawsuits. It provides coverage for the costs associated with legal defence, settlements, and judgments that may arise if the insured party is found legally responsible for causing harm or damage to another person or their property.",
    intro: [
      "Liability insurance protects individuals and businesses from financial losses resulting from legal claims or lawsuits. It provides coverage for the costs associated with legal defence, settlements, and judgments that may arise if the insured party is found legally responsible for causing harm or damage to another person or their property.",
      "Liability insurance is crucial for businesses, as it shields them from the financial burden of legal claims that could otherwise jeopardise their operations or assets.",
      "This form of cover not only provides financial protection but also offers peace of mind to individuals and businesses, allowing them to focus on their core activities without the constant worry of potential legal liabilities. Our solutions put customers in touch with experts to guide them through any potential claim.",
      "Policies can be tailored to specific industries or professions, ensuring that the coverage meets the unique needs and risks of each insured party.",
    ],
    atAGlance: [
      {
        label: "Product",
        value:
          "Professional Indemnity, Public Liability, Statutory Liability and Employers Liability",
      },
      {
        label: "Underwriter",
        value: "Certain Underwriters at Lloyd's of London – lead syndicate MS Amlin",
      },
      { label: "Target Market", value: "Commercial entities" },
      { label: "Policy Term", value: "Annual" },
    ],
    statements: [
      "Professional indemnity insurance protects New Zealand businesses from the financial fallout of claims alleging professional mistakes, negligence, or breaches of duty.",
      "Your reputation is your most valuable asset. Professional indemnity insurance helps safeguard it by covering legal defence costs and settlement expenses.",
      "Professional indemnity insurance provides certainty in an uncertain world—so you can concentrate on growth, not risk.",
    ],
    statementDetails: [
      "Cover for legal liability arising out of professional mistakes, negligence or breach of duty, including investigations by regulators or industry bodies.",
      "Defence costs are provided in addition to the policy limit, and a costs exclusive excess means legal costs are covered from the first dollar.",
      "A comprehensive policy wording with few exclusions and a broad appetite for most professions.",
    ],
    coverageTagline: "Give your organisation the security of added protection.",
    coverage: [
      {
        title: "What's covered?",
        items: [
          "Legal liability arising out of professional mistakes, negligence or breach of duty",
          "Defence costs provided in addition to the policy limit",
          "Cover for investigations by regulators or industry bodies",
        ],
      },
      {
        title: "Underwriting approach",
        items: [
          "Broad appetite for most professions",
          "Comprehensive policy wording with few exclusions",
          "Costs exclusive excess as standard meaning legal costs are covered from the first dollar",
        ],
      },
      {
        title: "Optional extras",
        items: [
          "Public Liability, Statutory Liability and Employers Liability policies are available to round out the liability protection",
        ],
      },
      { title: "Key exclusions", items: [
      "The policy has very few exclusions, some may be added during the underwriting process",
    ] },
    ],
    keyExclusions: [
      "The policy has very few exclusions, some may be added during the underwriting process",
    ],
    claim: standardClaim,
  },
];

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}

export const productCategories = [
  {
    key: "accident-travel",
    title: "Accident and Travel Insurance",
    blurb:
      "Protection for your people – at home, at work and on the road – with appetite for the unusual and high-risk.",
  },
  {
    key: "property",
    title: "Property Insurance",
    blurb:
      "Specialist cover for landlords, rental properties and social and community housing providers.",
  },
  {
    key: "liability",
    title: "Liability Insurance",
    blurb:
      "Professional Indemnity, Public, Statutory and Employers Liability to protect your reputation and balance sheet.",
  },
] as const;
