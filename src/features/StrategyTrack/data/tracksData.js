/**
 * tracksData.js
 * Static content for all three strategy tracks.
 * Each track: id, name, pill, heroTitle, heroSub, learnIntro, learnItems[], stages[], nudges[]
 * Each stage: id, title, desc, badge, actions[], tradeoffs[], warnings[], glossary[], example
 *
 * nudges[]: { id, condition(metrics, ctx) → bool, message, severity: "warn"|"good"|"info" }
 * Nudge conditions are pure functions — evaluated by useNudges against live slider state.
 */

export const TRACKS = {
  firstProperty: {
    id: "firstProperty",
    pill: "Track — Property",
    heroTitle: ["First Property", "Builder"],
    heroSub:
      "A structured path for professionals working toward home ownership. Track your deposit, credit score, and five key milestones — updating live as you adjust your inputs.",
    heroStats: [
      { val: "6", label: "Stages" },
      { val: "18–36", label: "Months" },
      { val: "SA", label: "Specific" },
    ],
    learnIntro:
      "The First Property Builder is built on a simple insight: the gap between renting and owning is mostly a savings and credit discipline problem, not an income problem. Most young professionals earn enough to eventually qualify for a bond — they just haven't optimised the inputs yet.",
    learnItems: [
      {
        title: "Why Deposit Size Matters",
        body: "A 10% deposit meets the minimum. A 20% deposit typically saves R200–400K in total interest by reducing the loan principal and often unlocking a better rate.",
      },
      {
        title: "The Credit Score Lever",
        body: "Your credit score is often more impactful than your income. Moving from 620 to 720 can be the difference between prime+2% and prime−0.5% — thousands per month.",
      },
      {
        title: "Compound Savings",
        body: "Consistent monthly contributions into a high-yield TFSA compound meaningfully over 3–5 years. A R3 500/month contribution at 8.5% p.a. grows to R200K+ in under 4 years.",
      },
      {
        title: "The Trade-Offs",
        body: "Higher deposit means lower risk but a longer timeline. Better credit means lower interest but requires time and discipline. This track helps you find your optimal path.",
      },
    ],
    stages: [
      {
        id: 1,
        icon: "🏁",
        title: "Build Your Financial Foundation",
        desc: "Emergency fund in place, budget tracked monthly, short-term debt under control.",
        badge: "Foundation",
        actions: [
          "Open a dedicated savings account labelled 'Deposit Fund' — ring-fencing is essential.",
          "Build a 3-month emergency fund (monthly expenses × 3) before accelerating deposit savings.",
          "List all short-term debt (store cards, vehicle finance, personal loans) and create a payoff plan.",
          "Set up a monthly budget — track every rand using a spreadsheet or an app like 22seven.",
          "Cancel subscriptions you don't use; redirect that money directly to your deposit fund.",
        ],
        tradeoffs: [
          { pro: "Emergency fund prevents you touching deposit savings in a crisis.", con: "Takes 1–3 months before deposit savings can accelerate." },
          { pro: "Clearing high-interest debt frees up more cash for saving later.", con: "Progress feels slow before the foundation is set." },
        ],
        warnings: [
          "Do not skip the emergency fund. Without it, one car repair can wipe months of deposit savings.",
          "Avoid taking on any new debt during this phase — it directly damages your credit score.",
        ],
        glossary: [
          { term: "Emergency fund", def: "3 months of living expenses held in a liquid account, separate from savings. Protects your deposit from unexpected costs." },
          { term: "Debt-to-income ratio", def: "Your total monthly debt repayments as a percentage of gross income. Banks use this to assess affordability. Keep it below 35%." },
        ],
        example: "Thandi earns R28 000/month. Her expenses are R18 000, so she needs R54 000 in her emergency fund. She redirected a R2 000 gym membership and R800 in streaming services — and was fully funded in 4 months.",
        requirement: (s) => s.creditScore >= 580 && s.savings >= 10000,
      },
      {
        id: 2,
        icon: "📈",
        title: "Crack the Credit Score",
        desc: "Achieve 670+ for standard bond approval. Pay every account on time for 12+ consecutive months.",
        badge: "Credit Ready",
        actions: [
          "Pull your free credit report from TransUnion or Experian (once a year — you're entitled to it).",
          "Dispute any errors in your credit record — incorrect listings are common and removable.",
          "Pay every account on time, every month, for 12 consecutive months minimum.",
          "Keep credit utilisation below 30% on credit cards.",
          "Do not apply for new credit during this phase — every hard enquiry dips your score.",
          "Consider closing store accounts you no longer use after clearing them.",
        ],
        tradeoffs: [
          { pro: "670+ score means most major banks will consider your bond application.", con: "Building credit takes time — there are no shortcuts." },
          { pro: "750+ score can unlock rates 0.5–1% lower, saving R80 000+ over a 20-year bond.", con: "Closing old accounts reduces your credit history length." },
        ],
        warnings: [
          "Missing even one payment resets your 12-month streak. Set up debit orders for every account.",
          "Do not let anyone do a hard enquiry on your credit unless you are serious about applying.",
        ],
        glossary: [
          { term: "Credit score", def: "A number (300–999) summarising your creditworthiness. Based on payment history, utilisation, account age, and recent applications." },
          { term: "Credit utilisation", def: "How much of your available credit you're using. 30% or below is ideal — e.g. R2 500 on a R10 000 limit." },
          { term: "Hard enquiry", def: "When a lender formally checks your credit for a loan application. Each one temporarily reduces your score." },
        ],
        example: "Sipho had a score of 598 due to a missed payment in 2021. He set up debit orders for every account and reduced his credit card utilisation from 70% to 20%. He reached 672 within 9 months — qualifying for standard bond approval.",
        requirement: (s) => s.creditScore >= 670,
      },
      {
        id: 3,
        icon: "💰",
        title: "Save Your Deposit",
        desc: "Target 10–20% of property value in a TFSA to maximise after-tax returns.",
        badge: "Deposit Building",
        actions: [
          "Open a Tax-Free Savings Account (TFSA) — interest and growth are tax-free up to R500 000 lifetime.",
          "Automate a monthly debit order into your TFSA on payday — pay yourself first.",
          "Use the TFSA for unit trusts, not just money market — unit trusts yield 8–10% vs 7% on call accounts.",
          "Track your deposit progress monthly using the simulator on this page.",
          "When you receive a bonus or tax refund, add it directly to your deposit fund.",
          "Avoid withdrawing from the TFSA — withdrawals permanently use up your annual contribution limit.",
        ],
        tradeoffs: [
          { pro: "TFSA returns are tax-free, giving you an effective 1–2% advantage over taxable savings.", con: "TFSA annual contribution limit is R36 000 — savings above this need a regular investment account." },
          { pro: "20% deposit reduces monthly repayments and total interest paid significantly.", con: "Saving 20% takes longer — you may wait an extra 12–18 months." },
        ],
        warnings: [
          "Don't keep your deposit in a low-yield cheque account. A TFSA unit trust at 9% vs 3% makes a material difference over 3 years.",
          "TFSA withdrawals permanently reduce your R500 000 lifetime limit. Only withdraw when you're ready to buy.",
        ],
        glossary: [
          { term: "TFSA", def: "Tax-Free Savings Account. Interest, dividends, and capital gains are completely tax-free. Annual limit: R36 000. Lifetime limit: R500 000." },
          { term: "Unit trust", def: "A pooled investment fund that invests in shares, bonds, or money market instruments. Available inside a TFSA at most SA banks." },
          { term: "LTV", def: "Loan-to-Value. The size of your bond as a percentage of the property value. A 20% deposit = 80% LTV — which typically unlocks lower interest rates." },
        ],
        example: "Kagiso targets a R1.8M property. A 10% deposit is R180 000; a 20% deposit is R360 000. The 20% option reduces his monthly repayment by R1 800 and saves R432 000 in interest over 20 years.",
        requirement: (s) => s.savings >= s.targetDeposit * 0.5,
      },
      {
        id: 4,
        icon: "🏆",
        title: "Bond Pre-Approval",
        desc: "Know your exact borrowing capacity before you start property hunting.",
        badge: "Pre-Qualified",
        actions: [
          "Gather your documents: last 3 months' payslips, 6 months' bank statements, ID, proof of address.",
          "Apply for pre-qualification through a bond originator like ooba or BetterBond — it's free.",
          "Bond originators submit to multiple banks simultaneously, counting as one credit enquiry.",
          "Review your pre-qualification certificate — it shows your maximum bond amount and estimated rate.",
          "Understand your affordability: banks typically lend up to 30% of gross monthly income.",
        ],
        tradeoffs: [
          { pro: "Bond originators submit to multiple banks simultaneously — better rate competition.", con: "Pre-qualification is not a guarantee — final approval depends on the specific property." },
          { pro: "Knowing your budget prevents emotional decisions on overpriced properties.", con: "Pre-approval expires after 90 days — time your search accordingly." },
        ],
        warnings: [
          "Never change jobs or take on new debt between pre-approval and final application — banks re-check everything.",
          "Pre-qualification is informal. Sellers take formal pre-approval letters more seriously.",
        ],
        glossary: [
          { term: "Bond originator", def: "A free service (ooba, BetterBond) that submits your application to multiple banks simultaneously." },
          { term: "Affordability assessment", def: "Banks assess whether you can service the monthly repayment. Typically capped at 30% of gross income." },
          { term: "Prime rate", def: "The SARB's benchmark lending rate. Bond rates are expressed as prime +/- a margin (e.g. prime minus 0.5%)." },
        ],
        example: "Lerato used ooba to submit to 5 banks at once. FNB offered prime + 0.5%, Absa offered prime, and Nedbank offered prime minus 0.25%. That 0.75% difference saved her R112 000 over 20 years on a R1.2M bond.",
        requirement: (s) => s.savings >= s.targetDeposit && s.creditScore >= 670,
      },
      {
        id: 5,
        icon: "🔑",
        title: "Property Search",
        desc: "Research, due diligence, and making a watertight offer.",
        badge: "Searching",
        actions: [
          "Research your target area on Lightstone or PropStats for price trends and recent sales.",
          "View at least 10–15 properties before making any offer — calibrate your instincts first.",
          "Factor all costs into your budget: transfer duty, bond registration, legal fees, rates, and levies.",
          "Make any offer subject to bond approval — never waive this clause.",
          "Appoint your own conveyancing attorney for independent advice.",
        ],
        tradeoffs: [
          { pro: "Buying in an emerging area can yield better capital appreciation.", con: "Emerging areas carry more risk — research infrastructure and development plans thoroughly." },
          { pro: "A motivated seller gives negotiating room on price.", con: "A property sold below market value may have hidden defects — always commission an inspection." },
        ],
        warnings: [
          "Never drop the 'subject to bond approval' clause. If your bond is declined, you could lose your deposit.",
          "Sectional title properties have levies and special levies. Request the last 3 years of body corporate financials.",
        ],
        glossary: [
          { term: "Transfer duty", def: "Government tax paid by the buyer. Properties under R1.1M (2024) are exempt. Above that, rates scale from 3% to 13%." },
          { term: "Sectional title", def: "You own a unit and share ownership of common property, governed by a body corporate with monthly levies." },
        ],
        example: "Nomsa found a townhouse listed at R1.45M. Comparable sales showed R1.35M. She offered R1.38M subject to bond approval and negotiated down to R1.41M — saving R40 000 on the purchase price.",
        requirement: (s) => s.savings >= s.targetDeposit && s.creditScore >= 700,
      },
      {
        id: 6,
        icon: "🏠",
        title: "Bond Application & Transfer",
        desc: "Formal application, legal transfer, and collecting your keys.",
        badge: "Apply Now",
        actions: [
          "Formally apply for the bond at your chosen bank — submit all documents within 24 hours of any request.",
          "Your conveyancing attorney will prepare transfer documents — sign them quickly and accurately.",
          "Pay the required deposits: transfer duty to SARS, bond registration costs, and legal fees.",
          "Arrange homeowner's insurance — banks require this as a bond condition.",
          "Do a final walk-through of the property before signing transfer documents.",
        ],
        tradeoffs: [
          { pro: "Fixed-rate bond gives certainty on repayments for 1–5 years.", con: "Fixed rate is usually higher than variable at the time of fixing." },
          { pro: "Variable rate tracks prime — if rates drop, so do your repayments.", con: "Variable rate risk: if prime rises, repayments increase." },
        ],
        warnings: [
          "Do not change jobs or take on new debt while the bond is being processed. Banks re-verify everything before registration.",
          "Budget for the full cost of transfer: bond + transfer duty + legal fees typically add R60 000–R120 000+ on a R1.5M property.",
        ],
        glossary: [
          { term: "Bond registration", def: "The legal process of registering the bank's security interest over your property at the Deeds Office. Typically 6–8 weeks." },
          { term: "Deeds Office", def: "The government office where all SA property transfers and bonds are registered." },
          { term: "Homeowner's insurance", def: "Covers the structure of your property against fire, flood, and other damage. Required by all SA banks as a bond condition." },
        ],
        example: "David applied on 3 March. The bank approved in 5 working days. Transfer documents were signed on 14 March. Registration completed 24 April — 52 days from offer accepted to keys in hand.",
        requirement: (s) => s.savings >= s.targetDeposit && s.creditScore >= 700,
      },
    ],
    // Contextual nudges — evaluated by useNudges. Dismissed state is persisted per-user per-track.
    nudges: [
      {
        id: "fp_low_savings_rate",
        severity: "warn",
        message: "Your savings rate is below 15%. Try redirecting one recurring expense to your deposit fund — even R500/month compounds significantly.",
        condition: (m) => m.savingsRate < 15,
      },
      {
        id: "fp_low_credit",
        severity: "warn",
        message: "A credit score below 600 is a red flag for bond approval. Focus on clearing missed payments and reducing credit card utilisation below 30% before increasing savings.",
        condition: (m) => m.creditScore < 600,
      },
      {
        id: "fp_credit_gap",
        severity: "info",
        message: "You're 80 points from unlocking the best bond rates (750+). A lower rate on a R1.5M bond can save you R80 000+ over 20 years — worth prioritising before applying.",
        condition: (m) => m.creditScore >= 670 && m.creditScore < 750,
      },
      {
        id: "fp_deposit_ready",
        severity: "good",
        message: "You've hit your deposit target! Consider locking it in a fixed-term account while you prepare your bond pre-approval documents.",
        condition: (m) => m.depositPct >= 100,
      },
      {
        id: "fp_halfway",
        severity: "good",
        message: "Halfway to your deposit target — consistency is the hardest part and you're proving it. Consider increasing contributions by R500/month to shave months off your timeline.",
        condition: (m) => m.depositPct >= 50 && m.depositPct < 100,
      },
      {
        id: "fp_long_timeline",
        severity: "info",
        message: "Your current timeline extends beyond 4 years. A R1 000/month increase in contributions would shave meaningful time off — check if a subscription or discretionary spend can fund it.",
        condition: (m) => m.months > 48 && m.months < 360,
      },
    ],
  },

  balancedLifestyle: {
    id: "balancedLifestyle",
    pill: "Track — Lifestyle",
    heroTitle: ["Balanced Lifestyle", "& Investing"],
    heroSub:
      "A practical framework for building long-term wealth without sacrificing quality of life. Structured savings, tax efficiency, and diversified growth — working together.",
    heroStats: [
      { val: "5", label: "Stages" },
      { val: "12–24", label: "Months" },
      { val: "All", label: "Income Levels" },
    ],
    learnIntro:
      "The Balanced Lifestyle track rejects the false choice between enjoying your income today and building wealth for tomorrow. With the right structure — budget first, automate second, invest third — you can do both without sacrificing either.",
    learnItems: [
      {
        title: "The 50/30/20 Starting Point",
        body: "50% to needs, 30% to wants, 20% to savings and investing. Not every month will be perfect — but this ratio is a calibration tool, not a rule to follow rigidly.",
      },
      {
        title: "Why Automate Everything",
        body: "Behavioural research consistently shows that automated savings outperform manual ones. Removing the decision removes the temptation. Pay yourself before you see the money.",
      },
      {
        title: "Tax Efficiency Compounds",
        body: "The TFSA annual limit is R36 000. Used consistently over 10 years, it shelters R360 000 in contributions and all growth from tax — a meaningful structural advantage.",
      },
      {
        title: "Lifestyle Inflation is the Enemy",
        body: "Every income increase is a fork in the road: spend more or invest more. The Balanced track aims to split the difference — lifestyle improvements are allowed, but so is a proportional savings increase.",
      },
    ],
    stages: [],
    nudges: [],
  },

  aggressiveGlobal: {
    id: "aggressiveGlobal",
    pill: "Track — Investing",
    heroTitle: ["Aggressive Global", "Investor"],
    heroSub:
      "Maximum wealth building for high-income earners. TFSA maximisation, offshore allocation, ETF strategy, and advanced tax optimisation.",
    heroStats: [
      { val: "6", label: "Stages" },
      { val: "36–60", label: "Months" },
      { val: "High", label: "Income" },
    ],
    learnIntro:
      "The Aggressive Global Investor track is designed for professionals who have their basics sorted and want to deploy capital strategically: offshore diversification, tax-efficient structures, and compounding returns over a 10–20 year horizon.",
    learnItems: [],
    stages: [],
    nudges: [],
  },
};