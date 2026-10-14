import "server-only";
import { getForm } from "@/content/forms";
import { getRecord, putRecord } from "@/lib/db/records";
import { keyName, type Answers } from "@/lib/forms/application";
import { saveAccessRequest } from "@/lib/portal/accounts";
import { saveApplication, saveLink, type Application, type ApplicationSource } from "./store";

// Demo data for showing the portals: a spread of applications across every
// online form, client links and broker access requests. Loaded once, the first
// time the applications are read while the portals are in demo mode
// (PORTAL_DEMO_LOGIN not "false"). Everything here is fictional.

const SEEDED = "seeded-v1";
let seeding: Promise<void> | null = null;

export function ensureDemoData() {
  seeding ??= seed().catch((error) => {
    seeding = null;
    console.error("[demo] could not load demo data", error);
  });
  return seeding;
}

const brokers = {
  alex: { brokerageId: "brk-harbour", brokerName: "Alex Morgan", brokerEmail: "demo@harbourbrokers.co.nz" },
  priya: { brokerageId: "brk-harbour", brokerName: "Priya Shah", brokerEmail: "priya@harbourbrokers.co.nz" },
  tom: { brokerageId: "brk-southern", brokerName: "Tom Ngata", brokerEmail: "tom@southernalpsbrokers.co.nz" },
  mere: { brokerageId: "brk-kowhai", brokerName: "Mere Tipene", brokerEmail: "mere@kowhaipm.co.nz" },
};

const codes: Record<string, string> = {
  building: "BA", "corporate-travel": "CT", "landlord-protect": "LP", "no-claims-declaration": "ND", "professional-indemnity": "PI", "pa-group": "PG", "pa-individual": "PA", "pa-health": "HD", "pa-claim": "CL", "travel-claim": "TC", accountants: "AQ", "pi-renewal": "PR",
};

const iso = (d: Date) => d.toISOString().slice(0, 10);

/** A complete building application, with the answers that differ. */
const building = (a: Answers): Answers => ({
  dateOfBirth: "1971-06-14",
  mailingAddress: "PO Box 4120, Shortland Street, Auckland",
  postCode: "1140",
  phone: "021 445 0912",
  levels: "1",
  selfContainedUnits: "1",
  externalSqm: "24",
  recreational: "no",
  retainingWalls: "no",
  mortgage: "yes",
  mortgagee: "ASB Bank Limited",
  convictions: "no",
  bankrupt: "no",
  chattelsValue: "20000",
  inspections: "yes",
  inspectionRecords: "yes",
  insuranceHistory: "no",
  structurallySound: "yes",
  naturalHazards: "no",
  losses: "no",
  isMultiUnit: "no",
  isSocialHousing: "no",
  isMortgageeSale: "no",
  declarationConfirmed: "yes",
  ...a,
});

async function seed() {
  if (await getRecord("demo", SEEDED)) return;
  await putRecord("demo", SEEDED, { at: new Date().toISOString() });

  const now = Date.now();
  const ago = (hours: number) => new Date(now - hours * 3_600_000);
  const inDays = (days: number) => iso(new Date(now + days * 86_400_000));

  type Demo = { form: string; hoursAgo: number; source?: ApplicationSource; broker: keyof typeof brokers; client?: { name: string; email: string }; answers: Answers };
  const demos: Demo[] = [
    {
      form: "no-claims-declaration",
      hoursAgo: 240,
      broker: "tom",
      answers: { company: "Queenstown Lakes Rentals Ltd", policyNumber: "OTT-PR-24-0912", proposalDate: iso(ago(250)), signature: "Hamish Reid", signatoryName: "Hamish Reid", signedDate: iso(ago(240)) },
    },
    {
      form: "professional-indemnity",
      hoursAgo: 216,
      broker: "alex",
      answers: {
        namedInsured: "Meridian Structural Consultants Ltd",
        yearEstablished: "2009",
        subsidiaries: "None",
        principalAddress: "Level 3, 110 Customs Street West, Auckland Central, Auckland 1010",
        postalAddress: "PO Box 90311, Victoria Street West, Auckland 1142",
        website: "meridianstructural.co.nz",
        nameChanged: "no",
        professionalBusiness: "Structural engineering design and peer review for residential and light commercial buildings.",
        "activities.0.details": "Structural design, residential",
        "activities.0.percentage": "55",
        "activities.1.details": "Structural design, light commercial",
        "activities.1.percentage": "30",
        "activities.2.details": "Peer review and producer statements",
        "activities.2.percentage": "15",
        "income.nz.last": "2850000",
        "income.nz.current": "3100000",
        "income.nz.next": "3300000",
        "income.australia.last": "120000",
        "income.australia.current": "150000",
        "income.australia.next": "180000",
        subcontractedPercent: "10",
        subcontractedWork: "Geotechnical investigations, subcontracted to a specialist firm with its own PI cover.",
        largeClient: "no",
        "largestContracts.0.principal": "Kainga Homes Ltd",
        "largestContracts.0.details": "Structural design for 48 townhouses, 14 months",
        "largestContracts.0.fees": "310000",
        "staff.principals.number": "3",
        "staff.professionals.number": "9",
        "staff.technical.number": "4",
        "principals.0.name": "Anna Lowe",
        "principals.0.qualifications": "BE (Hons) Civil, CPEng",
        "principals.0.qualified": "2004",
        "principals.0.years": "16",
        "principals.1.name": "Rawiri Paki",
        "principals.1.qualifications": "ME Structural, CPEng",
        "principals.1.qualified": "2008",
        "principals.1.years": "11",
        standardClientContract: "yes",
        guarantees: "no",
        consultantAgreement: "yes",
        consultantInsurance: "yes",
        declined: "no",
        currentCover: "yes",
        currentInsurer: "QBE Insurance",
        currentExpiry: inDays(28),
        currentLimit: "2000000",
        currentExcess: "10000",
        currentPremium: "18400",
        disciplinary: "no",
        negligenceClaims: "no",
        circumstances: "no",
        limit: "$2M",
        excess: "$10,000",
        signature: "Anna Lowe",
        signatoryName: "Anna Lowe",
        position: "Director",
        signedDate: iso(ago(216)),
      },
    },
    {
      form: "pa-group",
      hoursAgo: 170,
      broker: "priya",
      answers: {
        policyOwner: "Kahu Construction Ltd",
        address: "14 Vestey Drive, Mount Wellington, Auckland 1060",
        phone: "09 573 2210",
        email: "office@kahuconstruction.co.nz",
        relationship: "Employer",
        offWork: "yes",
        offWorkDetails: "One site worker off for 3 weeks in August 2025 after a fall from a ladder (sprained wrist). Full recovery.",
        hasIncidentLog: "yes",
        "insureds.0.name": "Wiremu Kahu", "insureds.0.dob": "12/03/1978", "insureds.0.jobTitle": "Managing director", "insureds.0.jobType": "Admin", "insureds.0.annualIncome": "185000", "insureds.0.weeklyBenefit": "2650", "insureds.0.standDown": "7 days", "insureds.0.lumpSum": "500000",
        "insureds.1.name": "Sione Fifita", "insureds.1.dob": "02/11/1985", "insureds.1.jobTitle": "Site foreman", "insureds.1.jobType": "Manual", "insureds.1.annualIncome": "98000", "insureds.1.weeklyBenefit": "1400", "insureds.1.standDown": "14 days", "insureds.1.lumpSum": "250000",
        "insureds.2.name": "Ella Matthews", "insureds.2.dob": "19/07/1992", "insureds.2.jobTitle": "Quantity surveyor", "insureds.2.jobType": "Admin", "insureds.2.annualIncome": "112000", "insureds.2.weeklyBenefit": "1600", "insureds.2.standDown": "7 days", "insureds.2.lumpSum": "300000",
        "insureds.3.name": "Jack Turei", "insureds.3.dob": "25/01/1999", "insureds.3.jobTitle": "Carpenter", "insureds.3.jobType": "Manual", "insureds.3.annualIncome": "76000", "insureds.3.weeklyBenefit": "1090", "insureds.3.standDown": "14 days", "insureds.3.lumpSum": "200000",
        signature: "Wiremu Kahu",
        signatoryName: "Wiremu Kahu",
        position: "Managing director",
        signedDate: iso(ago(170)),
      },
    },
    {
      form: "corporate-travel",
      hoursAgo: 145,
      broker: "tom",
      answers: {
        namedInsured: "Alpine Engineering Ltd",
        inceptionDate: inDays(21),
        address: "22 Gorge Road, Queenstown 9300",
        businessName: "Alpine Engineering",
        businessActivities: "Civil engineering consultancy for ski field and hydro infrastructure. Staff travel to project sites in New Zealand and to conferences and suppliers in Australia, Europe and Canada, carrying survey equipment (about $45,000).",
        "travelDays.internal.businessLastYear": "210", "travelDays.internal.businessForecast": "240", "travelDays.internal.leisureLastYear": "20", "travelDays.internal.leisureForecast": "20",
        "travelDays.australiaPacific.businessLastYear": "45", "travelDays.australiaPacific.businessForecast": "60", "travelDays.australiaPacific.leisureLastYear": "10", "travelDays.australiaPacific.leisureForecast": "12",
        "travelDays.europe.businessLastYear": "18", "travelDays.europe.businessForecast": "24", "travelDays.europe.leisureLastYear": "6", "travelDays.europe.leisureForecast": "6",
        "travelDays.usaCanada.businessLastYear": "12", "travelDays.usaCanada.businessForecast": "15", "travelDays.usaCanada.leisureLastYear": "0", "travelDays.usaCanada.leisureForecast": "5",
        over75: "no",
        highRiskActivities: "yes",
        nonScheduledFlights: "yes",
        "aircraft.helicopter.flights": "14", "aircraft.helicopter.avgPeople": "3", "aircraft.helicopter.maxPeople": "5",
        flightRoutes: "Queenstown to remote hydro and ski field sites in Otago and Southland.",
        doNotTravel: "no",
        largeGroups: "no",
        underground: "no",
        heights: "yes",
        toxic: "no",
        machinery: "no",
        security: "no",
        riskDetails: "Engineers ski between ski field inspection sites in winter, and inspect towers and dams at heights with full fall protection.",
        claims: "no",
        signature: "Grace Murray",
        signatoryName: "Grace Murray",
        position: "Operations manager",
        signedDate: iso(ago(145)),
      },
    },
    {
      form: "landlord-protect",
      hoursAgo: 98,
      broker: "alex",
      answers: {
        shortTermRental: "no",
        firstName: "Sarah",
        surname: "Chen",
        mobile: "027 318 4470",
        companyOrTrust: "Chen Family Trust",
        postalAddress: "9 Seaview Terrace, Devonport, Auckland",
        postCode: "0624",
        email: "sarah.chen@example.co.nz",
        broker: "Alex Morgan, Harbour Insurance Brokers",
        inceptionDate: inDays(12),
        "properties.0.address": "18 Kowhai Road, Mairangi Bay, Auckland 0630",
        "properties.0.weeklyRent": "780",
        "properties.1.address": "4/11 Anzac Street, Takapuna, Auckland 0622",
        "properties.1.weeklyRent": "560",
        coverOption: "Protect +",
        paymentOption: "Yearly, by direct credit",
        lossHistory: "no",
        insuranceHistory: "no",
        otherInformation: "no",
        methContamination: "no",
        signature: "Sarah Chen",
        signedDate: iso(ago(98)),
      },
    },
    {
      form: "building",
      hoursAgo: 75,
      broker: "priya",
      answers: building({
        insuredName: "Villa Lane Trust",
        email: "trustees@villalane.co.nz",
        propertyManager: "Ponsonby Property Management",
        inceptionDate: inDays(18),
        propertyAddress: "27 Jervois Road, Ponsonby, Auckland 1011",
        propertyType: "Free standing house",
        sumInsured: "1450000",
        internalSqm: "265",
        yearBuilt: "1912",
        rewired: "no",
        plumbing: "yes",
        pilings: "yes",
        scrim: "yes",
        heritage: "yes",
        reroofed: "yes",
        losses: "yes",
        lossesDetails: "Burst pipe under the kitchen in March 2025, claim paid $14,800. Pipe replaced.",
        signature: "Helen Brooks",
        signatoryName: "Helen Brooks",
        signedDate: iso(ago(75)),
      }),
    },
    {
      form: "building",
      hoursAgo: 49,
      broker: "alex",
      answers: building({
        insuredName: "Rata Street Holdings Ltd",
        email: "accounts@ratastreet.co.nz",
        inceptionDate: inDays(9),
        propertyAddress: "12 Rata Street, Mount Eden, Auckland 1024",
        propertyType: "Free standing house",
        sumInsured: "780000",
        internalSqm: "168",
        yearBuilt: "1968",
        signature: "Daniel Fox",
        signatoryName: "Daniel Fox",
        signedDate: iso(ago(49)),
      }),
    },
    {
      form: "pa-claim",
      hoursAgo: 30,
      broker: "priya",
      answers: {
        insuredName: "Sione Fifita",
        dateOfBirth: "1985-11-02",
        address: "31 Te Irirangi Drive, Flat Bush, Auckland 2019",
        occupation: "Site foreman, Kahu Construction Ltd",
        email: "sione.f@example.co.nz",
        phone: "022 418 7731",
        claimType: "An accident",
        accidentDate: iso(ago(30 + 24 * 9)),
        accidentTime: "10:15 am",
        accidentPlace: "Building site, 6 Harris Road, East Tamaki",
        whatHappened: "Stepped onto a loose scaffold plank while checking formwork. The plank shifted and I fell about 1.5 metres onto the concrete slab.",
        injuries: "Fractured left wrist and bruising to the left hip.",
        freeFromDisease: "yes",
        witnesses: "Jack Turei, carpenter, 021 556 0098",
        firstAdvice: iso(ago(30 + 24 * 9)),
        ceasedWork: iso(ago(30 + 24 * 9)),
        doctorAttending: "yes",
        doctorDetails: "Dr Amelia Ross, Botany Medical Centre, 588 Chapel Road, Botany",
        confinedToHouse: "no",
        usualOccupation: "Light office duties only, no site work.",
        resumeDate: inDays(35),
        otherCompensation: "yes",
        otherCompensationDetails: "ACC claim lodged, weekly compensation approved.",
        drName: "Dr Amelia Ross",
        drAddress: "Botany Medical Centre, 588 Chapel Road, Botany, Auckland 2016",
        drNature: "Distal radius fracture, left wrist, from a fall at work.",
        drAware: iso(ago(30 + 24 * 9)),
        drAdvice: iso(ago(30 + 24 * 9)),
        drCeased: iso(ago(30 + 24 * 9)),
        drBefore: "no",
        drPartial: inDays(14),
        drFull: inDays(35),
        drPrognosis: "Cast for 6 weeks, then physiotherapy. Full recovery expected.",
        drSignature: "Amelia Ross",
        drDate: iso(ago(40)),
        signature: "Sione Fifita",
        signedDate: iso(ago(30)),
      },
    },
    {
      form: "building",
      hoursAgo: 20,
      source: "client",
      broker: "tom",
      client: { name: "Ngaio Parata", email: "ngaio@otautahihousing.org.nz" },
      answers: building({
        insuredName: "Ōtautahi Community Housing Trust",
        email: "ngaio@otautahihousing.org.nz",
        mailingAddress: "PO Box 13 220, Armagh, Christchurch",
        postCode: "8141",
        inceptionDate: inDays(25),
        propertyAddress: "45 Riccarton Road, Riccarton, Christchurch 8041",
        propertyType: "Block of units",
        levels: "2",
        selfContainedUnits: "6",
        sumInsured: "2400000",
        internalSqm: "540",
        yearBuilt: "1998",
        mortgage: "no",
        isMultiUnit: "yes",
        unitsTotal: "6",
        unitsSumInsured: "2400000",
        ...Object.fromEntries(
          Array.from({ length: 6 }, (_, i) => [
            [`units.${i}.unit`, `Unit ${i + 1}`],
            [`units.${i}.sumInsured`, "400000"],
            [`units.${i}.sqm`, "90"],
          ]).flat(),
        ),
        smokeDetectors: "yes",
        fireWalls: "yes",
        stackedUnits: "yes",
        isSocialHousing: "yes",
        shortTenancy: "no",
        housingNature: "Long-term social housing for families referred by the Ministry of Social Development.",
        lengthOfStay: "2 years or more",
        housingProvider: "Ōtautahi Community Housing Trust",
        pastoralCare: "A tenancy manager visits monthly, with a 24 hour support line.",
        signature: "Ngaio Parata",
        signatoryName: "Ngaio Parata",
        signedDate: iso(ago(20)),
      }),
    },
    {
      form: "building",
      hoursAgo: 5,
      broker: "mere",
      answers: building({
        insuredName: "Tui Investments Ltd",
        email: "admin@tuiinvestments.co.nz",
        inceptionDate: inDays(3),
        propertyAddress: "8 Kauri Street, Naenae, Lower Hutt 5011",
        propertyType: "Free standing house",
        sumInsured: "520000",
        internalSqm: "120",
        yearBuilt: "1956",
        mortgage: "no",
        isMortgageeSale: "yes",
        contentious: "Forced sale. The former owner is still living in the house and has said they won't leave.",
        purchaserInspected: "no",
        accessObtained: "Viewed from the road only",
        auctionDayInspection: "no",
        auctionAgreement: "Risk transfers at the fall of the hammer",
        settlementPeriod: "4 weeks",
        possession: "Purchaser needs to evict the occupier",
        transactionType: "Business transaction",
        inspections: "no",
        signature: "Paul Tan",
        signatoryName: "Paul Tan",
        signedDate: iso(ago(5)),
      }),
    },
  ];

  for (const d of demos) {
    const form = getForm(d.form)!;
    const created = ago(d.hoursAgo);
    const broker = brokers[d.broker];
    const stamp = iso(created).slice(2).replace(/-/g, "");
    const id = `app_demo${String(demos.indexOf(d)).padStart(2, "0")}${d.form.replace(/[^a-z]/g, "").slice(0, 6)}`;
    const app: Application = {
      id,
      form: form.id,
      reference: `OTT-${codes[form.id] ?? "AP"}-${stamp}-${id.slice(-4).toUpperCase()}`,
      ...broker,
      source: d.source ?? "broker",
      submittedBy: d.client?.name ?? broker.brokerName,
      submittedByEmail: d.client?.email ?? broker.brokerEmail,
      insuredName: keyName(form, d.answers),
      propertyAddress: d.answers[form.keyFields.detail] ?? "",
      answers: d.answers,
      createdAt: created.toISOString(),
    };
    if (d.client) {
      const linkId = `lnk_demo${id.slice(-6)}`;
      app.linkId = linkId;
      await saveLink({
        id: linkId,
        form: form.id,
        ...broker,
        clientName: d.client.name,
        clientEmail: d.client.email,
        createdAt: ago(d.hoursAgo + 50).toISOString(),
        expiresAt: new Date(ago(d.hoursAgo + 50).getTime() + 14 * 86_400_000).toISOString(),
        completedAt: created.toISOString(),
        applicationId: id,
      });
    }
    await saveApplication(app);
  }

  // A link a broker has sent that the client hasn't completed yet.
  await saveLink({
    id: "lnk_demo_pending",
    form: "building",
    ...brokers.alex,
    clientName: "Aroha Williams",
    clientEmail: "aroha.williams@example.co.nz",
    createdAt: ago(28).toISOString(),
    expiresAt: new Date(ago(28).getTime() + 14 * 86_400_000).toISOString(),
  });

  // Brokers waiting for portal access.
  await saveAccessRequest({
    id: "req-demo-jess",
    name: "Jess Taylor",
    email: "jess@harbourbrokers.co.nz",
    phone: "021 774 3310",
    role: "Account manager",
    brokerageName: "Harbour Insurance Brokers",
    matchedBrokerageId: "brk-harbour",
    status: "pending",
    createdAt: ago(7).toISOString(),
  });
  await saveAccessRequest({
    id: "req-demo-liam",
    name: "Liam O'Connor",
    email: "liam@coastalinsure.co.nz",
    phone: "027 902 1145",
    role: "Principal or director",
    brokerageName: "Coastal Insurance Brokers",
    fspNumber: "FSP345678",
    message: "We place a lot of rental and social housing property in Tauranga and the Bay of Plenty and would like to use Otta.",
    status: "pending",
    createdAt: ago(26).toISOString(),
  });
}
