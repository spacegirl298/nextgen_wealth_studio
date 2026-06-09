/**
 * tracksData.js
 * Static content for all strategy tracks.
 * Each track: id, name, tagline, description, difficulty, timeHorizon, whoIsItFor,
 *             rationale, nudgeDefs[], stages[]
 * Each stage: id, title, description, actionItems[], tradeoffs[], warnings[],
 *             educationalContent, glossaryTerms[], requirement(snapshotState)
 */

// ─── SHARED NUDGE HELPERS ────────────────────────────────────────────
export const SEVERITY = { DANGER: "danger", WARNING: "warning", INFO: "info" };

// ─── TRACKS ──────────────────────────────────────────────────────────
export const TRACKS = [
  {
    id: "property",
    name: "First Property Builder",
    tagline: "From renter to owner — structured, step by step.",
    description:
      "A structured journey for young professionals working toward their first home. Focuses on deposit saving, credit health, and bond readiness.",
    difficulty: "Beginner–Intermediate",
    timeHorizon: "2–5 years",
    whoIsItFor:
      "Renters earning a stable income who want to own their first property within the next 3–5 years.",
    rationale:
      "The gap between renting and owning is mostly a savings and credit discipline problem, not an income problem. Most young professionals earn enough to eventually qualify for a bond — they just haven't optimised the inputs yet. This track gives you the structure to do exactly that.",
    nudgeDefs: [
      {
        id: "prop_savings_low",
        condition: (m) => m.savingsRate < 15,
        message:
          "💡 Your savings rate is below 15%. Aim for at least 20% of take-home to hit your deposit target on time.",
        severity: SEVERITY.WARNING,
      },
      {
        id: "prop_emergency_low",
        condition: (m) => m.emergencyMonths < 3,
        message:
          "🚨 You need at least 3 months of expenses in an emergency fund before aggressively saving for a deposit.",
        severity: SEVERITY.DANGER,
      },
      {
        id: "prop_dti_high",
        condition: (m) => m.dti > 40,
        message:
          "⚠️ Your debt-to-income ratio is above 40%. Reduce existing debt before applying for a bond.",
        severity: SEVERITY.DANGER,
      },
      {
        id: "prop_on_track",
        condition: (m) => m.savingsRate >= 20 && m.emergencyMonths >= 3,
        message:
          "✅ You're building solid habits. Keep your savings automated and review your credit score quarterly.",
        severity: SEVERITY.INFO,
      },
    ],
    stages: [
      {
        id: 1,
        title: "Build Your Financial Foundation",
        description:
          "Before saving for a deposit, your financial base must be solid. That means a working budget, a 3-month emergency fund, and all short-term debt under control.",
        actionItems: [
          "Build a monthly budget that accounts for every rand of take-home pay",
          "Open a separate high-yield savings account for your emergency fund",
          "Clear any clothing accounts, short-term loans, or overdue accounts",
          "Set up a R500–R1,000/month automatic debit order into your emergency fund",
          "Get your free annual credit report from TransUnion or Experian",
        ],
        tradeoffs: [
          {
            pro: "A solid foundation means you won't need to dip into deposit savings for emergencies",
            con: "Delaying deposit saving by a few months while you build your emergency fund",
          },
          {
            pro: "Clearing short-term debt improves your credit score and reduces monthly obligations",
            con: "Requires redirecting money that could otherwise go to deposit saving",
          },
        ],
        warnings: [
          "Do not skip the emergency fund. One unexpected expense without a buffer will derail your deposit progress.",
          "Avoid taking on any new credit while building this foundation — every new inquiry affects your score.",
        ],
        educationalContent:
          "South African banks assess your full financial picture when evaluating a bond application. Your debt-to-income ratio (total monthly debt payments ÷ gross income) must typically be below 35–40%. Starting with a clean financial base also means you'll have room to increase your deposit savings as your income grows.",
        glossaryTerms: [
          { term: "Debt-to-Income Ratio (DTI)", definition: "Your total monthly debt repayments divided by your gross monthly income, expressed as a percentage. Banks use this to determine how much additional debt you can service. Below 36% is considered healthy." },
          { term: "Emergency Fund", definition: "3–6 months of living expenses set aside in a liquid account. Prevents you from disrupting long-term savings goals when unexpected costs arise." },
        ],
        requirement: (s) => s.emergencyMonths >= 3 && s.dti < 50,
      },
      {
        id: 2,
        title: "Crack the Credit Score",
        description:
          "Your credit score can cost or save you hundreds of thousands of rands over the life of a bond. This stage focuses on achieving 670+ for standard approval and 750+ for the best rates.",
        actionItems: [
          "Pay every account on time — even the minimum — for 12+ consecutive months",
          "Keep credit card balances below 30% of their limit",
          "Dispute any incorrect information on your credit report",
          "Avoid applying for new credit unless essential",
          "Check your score monthly via ClearScore (free) or your bank's app",
        ],
        tradeoffs: [
          {
            pro: "A 750+ score can unlock prime minus rates — potentially R2,000–R4,000 less per month on a R1.5M bond",
            con: "Building credit takes 12–24 months of consistent behaviour — there are no shortcuts",
          },
          {
            pro: "Strong credit history gives banks confidence in your reliability",
            con: "Some credit accounts must remain open and active to maintain score — which means ongoing management",
          },
        ],
        warnings: [
          "Missing a single payment can drop your score by 40–80 points and stays on record for 2 years.",
          "Do not close old accounts in good standing — account age is a positive factor in your score.",
        ],
        educationalContent:
          "South African credit scores range from 300–999. Most major banks (ABSA, Standard Bank, FNB, Nedbank) require a minimum of 600 for bond approval. To access competitive rates (prime or below), you typically need 700+. The difference between a 620 and 720 score on a R1.5M bond over 20 years can exceed R500,000 in total interest.",
        glossaryTerms: [
          { term: "Prime Rate", definition: "The benchmark interest rate set by South African banks, currently linked to the SARB repo rate. Bonds are priced as prime plus or prime minus a margin depending on your credit risk profile." },
          { term: "Credit Utilisation", definition: "The percentage of your available revolving credit that you are currently using. Keeping this below 30% signals financial discipline to lenders." },
        ],
        requirement: (s) => s.creditScore >= 670,
      },
      {
        id: 3,
        title: "Save Your Deposit",
        description:
          "With your foundation set and credit improving, this stage is about aggressively accumulating your deposit through disciplined saving, compound interest, and smart savings vehicles.",
        actionItems: [
          "Open a Tax-Free Savings Account (TFSA) and contribute R3,000/month toward your deposit",
          "Automate your savings on payday — pay yourself first",
          "Compare TFSA interest rates across FNB, Nedbank, ABSA, and Standard Bank quarterly",
          "Increase contributions by 5–10% every time you receive a salary increase",
          "Track your deposit progress monthly — seeing growth is motivating",
        ],
        tradeoffs: [
          {
            pro: "A 20% deposit avoids mortgage insurance and significantly reduces total interest paid",
            con: "A larger deposit target means a longer timeline before you can buy",
          },
          {
            pro: "TFSA growth is completely tax-free — all interest earned is yours to keep",
            con: "TFSA is capped at R36,000/year — excess must go into a regular savings or investment account",
          },
        ],
        warnings: [
          "Do not invest your deposit in volatile assets (shares, crypto). You need this money on a specific timeline.",
          "Avoid using your deposit savings as a spending buffer. Keep it in a separate account you don't see daily.",
        ],
        educationalContent:
          "SA banks require a minimum 10% deposit, but a 20% deposit is strongly recommended. On a R2M property, that's the difference between a R200K and R400K deposit — but it saves you roughly R300–500K in interest over the bond term. A TFSA earning 8.5% p.a. compounds meaningfully: R3,500/month grows to over R200K in under 4 years.",
        glossaryTerms: [
          { term: "Tax-Free Savings Account (TFSA)", definition: "A SARS-approved investment account where all growth — interest, dividends, and capital gains — is completely exempt from tax. Annual limit: R36,000. Lifetime limit: R500,000." },
          { term: "Compound Interest", definition: "Interest calculated on both the initial principal and the accumulated interest from previous periods. The longer money stays invested, the more dramatically it grows." },
        ],
        requirement: (s) => s.savings >= s.targetDeposit * 0.5,
      },
      {
        id: 4,
        title: "Get Bond Pre-Approval",
        description:
          "Pre-approval gives you clarity on your budget, signals to sellers that you're serious, and uncovers any issues before you fall in love with a property.",
        actionItems: [
          "Submit pre-qualification applications to at least 3 banks (use ooba or BetterBond to do this in one step)",
          "Gather supporting documents: 3 months payslips, 3 months bank statements, ID, proof of address",
          "Confirm your deposit is in a liquid account and accessible",
          "Understand the full cost of buying: transfer duties, conveyancing fees, and moving costs",
          "Set a realistic purchase price based on your pre-approval amount — not the maximum",
        ],
        tradeoffs: [
          {
            pro: "Pre-approval defines your true budget and prevents over-commitment",
            con: "Pre-approval is not a final guarantee — final approval depends on the specific property",
          },
          {
            pro: "Multiple bank applications through a bond originator don't each count as a separate credit inquiry",
            con: "Getting pre-approved may tempt you to buy before you're fully ready",
          },
        ],
        warnings: [
          "Do not make any large purchases or change jobs after applying for pre-approval — banks re-verify before final approval.",
          "Transfer duties on properties above R1.1M can be significant — budget for this separately, not from your deposit.",
        ],
        educationalContent:
          "Bond originators like ooba and BetterBond submit your application to multiple banks simultaneously and negotiate on your behalf — at no cost to you. They often secure rates that individuals cannot get when applying directly. Transfer duty (a government tax) applies on properties above R1,100,000: 3% from R1.1M to R1.512M, 6% to R2.117M, and so on. Budget at least R30,000–R60,000 for closing costs on a R1.5–2M purchase.",
        glossaryTerms: [
          { term: "Bond Originator", definition: "A free service that submits your home loan application to multiple banks on your behalf, comparing offers and negotiating rates. ooba and BetterBond are the two largest in South Africa." },
          { term: "Transfer Duty", definition: "A government tax paid by the buyer on property purchases above R1,100,000. It is calculated on a sliding scale and is separate from conveyancing (legal transfer) fees." },
        ],
        requirement: (s) => s.savings >= s.targetDeposit * 0.8 && s.creditScore >= 670,
      },
      {
        id: 5,
        title: "Make Offer & Transfer",
        description:
          "You've found your property. Now navigate the offer, bond application, and transfer process with confidence.",
        actionItems: [
          "Submit a formal Offer to Purchase (OTP) — have a conveyancer review before signing",
          "Submit your final bond application immediately after OTP acceptance",
          "Respond promptly to any bank requests for additional documents",
          "Arrange home and contents insurance before transfer date",
          "Plan your move: utilities, internet, and all address updates in advance",
        ],
        tradeoffs: [
          {
            pro: "Fixed-rate bonds offer payment certainty — useful if rates are expected to rise",
            con: "Variable (prime-linked) rates benefit you when the SARB cuts rates",
          },
          {
            pro: "Buying in an upcoming area can generate equity faster",
            con: "Lower-cost areas may have slower capital appreciation",
          },
        ],
        warnings: [
          "Never sign an OTP without understanding all conditions — especially the bond approval suspensive condition.",
          "The transfer process takes 6–12 weeks. Do not give notice on your rental until transfer is registered.",
        ],
        educationalContent:
          "The Offer to Purchase (OTP) is a legally binding contract. It must include a suspensive condition stating the offer is subject to bond approval — this protects you if your bond application is declined. Once the OTP is accepted, the transfer attorney (appointed by the seller) manages the registration process with the Deeds Office. You'll pay transfer costs and bond registration costs at this stage.",
        glossaryTerms: [
          { term: "Offer to Purchase (OTP)", definition: "A legally binding written offer to buy a property at a specified price and terms. Becomes a sale agreement when accepted by the seller." },
          { term: "Suspensive Condition", definition: "A clause in the OTP that makes the sale conditional on a specific event — typically bond approval. If the condition isn't met, the sale falls away without penalty." },
          { term: "Conveyancer", definition: "An attorney specialising in property transfers. They manage the legal process of transferring ownership from seller to buyer and registering the bond at the Deeds Office." },
        ],
        requirement: (s) => s.savings >= s.targetDeposit && s.creditScore >= 700,
      },
    ],
  },

  {
    id: "balanced",
    name: "Balanced Lifestyle & Investing",
    tagline: "Build wealth without sacrificing the life you want now.",
    description:
      "For professionals who want to invest consistently while still living intentionally. Covers budgeting, TFSA, diversified investing, and lifestyle inflation management.",
    difficulty: "Intermediate",
    timeHorizon: "3–7 years",
    whoIsItFor:
      "Stable earners who don't want to sacrifice enjoyment today but want to build meaningful long-term wealth.",
    rationale:
      "Extreme frugality and aggressive investing aren't sustainable for most people. This track builds wealth through consistency, automation, and intentional lifestyle design — not deprivation.",
    nudgeDefs: [
      {
        id: "bal_tfsa_unused",
        condition: (m, ctx) => ctx.tfsa < 36000,
        message:
          "📈 You still have TFSA room this year. Tax-free growth is one of SA's most powerful tools — use it.",
        severity: SEVERITY.INFO,
      },
      {
        id: "bal_savings_low",
        condition: (m) => m.savingsRate < 10,
        message:
          "💡 A 10% savings rate is the minimum for meaningful wealth accumulation. Automate an extra R500/month.",
        severity: SEVERITY.WARNING,
      },
      {
        id: "bal_emergency_low",
        condition: (m) => m.emergencyMonths < 3,
        message:
          "🚨 Less than 3 months emergency cover puts your investment contributions at risk when life happens.",
        severity: SEVERITY.DANGER,
      },
    ],
    stages: [
      {
        id: 1,
        title: "Master Your Budget",
        description: "Build a spending plan that funds both your lifestyle and your future.",
        actionItems: [
          "Categorise every monthly expense into needs, wants, and savings",
          "Apply the 50/30/20 rule as a starting framework (adjust for your income level)",
          "Identify your top 3 'guilt-free' spending categories and protect them",
          "Cut one low-value subscription or expense per month until your savings rate hits 15%",
        ],
        tradeoffs: [
          { pro: "Clarity on spending creates room for both enjoyment and saving", con: "Budgeting requires honest tracking — most people underestimate spending by 20–30%" },
        ],
        warnings: [
          "A budget that eliminates all discretionary spending is unsustainable — build in lifestyle spending deliberately.",
        ],
        educationalContent:
          "The 50/30/20 framework allocates 50% of take-home to needs, 30% to wants, and 20% to savings and debt repayment. In South Africa, housing costs often push the 'needs' bucket above 50% — adjust accordingly but protect your savings rate.",
        glossaryTerms: [
          { term: "50/30/20 Rule", definition: "A personal finance framework where 50% of take-home pay covers necessities, 30% lifestyle spending, and 20% savings and debt repayment." },
        ],
        requirement: () => true,
      },
      {
        id: 2,
        title: "Emergency Fund First",
        description: "Build 3–6 months of expenses in a liquid, interest-bearing account before investing.",
        actionItems: [
          "Calculate your monthly essential expenses (rent, food, transport, utilities)",
          "Open a dedicated high-yield savings account or call account",
          "Automate R1,000–R2,000/month until you reach your target",
          "Do not invest beyond your TFSA until this is funded",
        ],
        tradeoffs: [
          { pro: "An emergency fund means unexpected costs don't derail your investment plan", con: "Money in a savings account earns less than a diversified investment portfolio" },
        ],
        warnings: ["Keep your emergency fund in a separate account — psychological distance prevents you spending it."],
        educationalContent:
          "Without an emergency fund, any unexpected expense forces you to either sell investments at the wrong time or take on expensive short-term debt. Three months covers most emergencies; six months is recommended for single-income households or the self-employed.",
        glossaryTerms: [
          { term: "Call Account", definition: "A bank account that earns competitive interest while keeping funds accessible without a fixed term. A good home for your emergency fund." },
        ],
        requirement: (s) => s.emergencyMonths >= 3,
      },
      {
        id: 3,
        title: "Maximise Your TFSA",
        description: "Contribute the full R36,000 annual TFSA allowance into growth-focused unit trusts.",
        actionItems: [
          "Open a TFSA if you don't have one — compare Allan Gray, Sygnia, Ninety One, and Satrix",
          "Set up a monthly debit order of R3,000 (R36,000/year limit)",
          "Choose a diversified equity unit trust — not a money market fund inside the TFSA",
          "Reinvest all dividends and interest automatically",
          "Do not withdraw — every rand withdrawn reduces your lifetime allowance permanently",
        ],
        tradeoffs: [
          { pro: "All growth inside a TFSA is permanently tax-free — no CGT, no dividends tax, no income tax on interest", con: "Annual and lifetime limits mean you cannot make up for years you didn't contribute" },
          { pro: "Long-term equity growth in a TFSA dramatically outperforms cash savings", con: "Short-term volatility is uncomfortable — requires a 5+ year mindset" },
        ],
        warnings: [
          "Withdrawing from a TFSA permanently destroys that contribution room — it does not reset like an ISA.",
          "A money market fund inside a TFSA wastes the tax-free benefit on low returns. Use equity funds.",
        ],
        educationalContent:
          "R36,000/year invested at 10% p.a. over 20 years grows to approximately R2.3M — all tax-free. A similar investment outside a TFSA would be subject to dividend withholding tax (20%), capital gains tax (effective rate ~18%), and income tax on interest. Over 20 years, the tax saving can exceed R400,000.",
        glossaryTerms: [
          { term: "Unit Trust", definition: "A pooled investment fund where many investors contribute and a professional fund manager invests the pooled capital across a range of assets. Returns are proportional to your holding." },
          { term: "Capital Gains Tax (CGT)", definition: "Tax on the profit made from selling an asset that has increased in value. Inside a TFSA, no CGT applies. Outside, 40% of the gain is included in your taxable income." },
        ],
        requirement: (s) => s.tfsa >= 10000,
      },
      {
        id: 4,
        title: "Diversify Beyond TFSA",
        description: "Once your TFSA is maxed, build a diversified local and offshore portfolio.",
        actionItems: [
          "Open a brokerage account with EasyEquities, Standard Bank Online Share Trading, or similar",
          "Start with a JSE-listed ETF tracking the FTSE/JSE Top 40 or All Share Index",
          "Add a global ETF (Satrix MSCI World, 1nvest S&P 500) for offshore exposure",
          "Use your R1,000,000 annual offshore allowance via a living annuity or local feeder funds",
          "Rebalance annually — don't react to short-term market movements",
        ],
        tradeoffs: [
          { pro: "Global diversification reduces concentration risk in the SA economy and rand", con: "Currency risk — offshore investments fluctuate with the rand/dollar rate" },
          { pro: "ETFs offer low-cost, instant diversification across hundreds of companies", con: "You forgo the chance of outperforming the market (but most active funds don't either)" },
        ],
        warnings: [
          "Never invest money you'll need within 5 years in equity markets — volatility is real.",
          "Don't chase past performance — last year's top fund is rarely next year's winner.",
        ],
        educationalContent:
          "South Africans can invest offshore through two main routes: Section 11(f) RA/living annuity allocations (up to 45% offshore), or using your SARS annual single discretionary allowance (R1M/year) or foreign investment allowance (R10M/year, requires tax clearance). Local feeder funds that invest in global ETFs are the simplest starting point.",
        glossaryTerms: [
          { term: "ETF (Exchange-Traded Fund)", definition: "A fund that tracks an index (like the S&P 500 or JSE All Share) and trades on a stock exchange like a share. Low cost, highly liquid, and broadly diversified." },
          { term: "Rand-Cost Averaging", definition: "Investing a fixed rand amount at regular intervals regardless of market price. Automatically buys more units when prices are low and fewer when high." },
        ],
        requirement: (s) => s.tfsa >= 36000 && s.totalSavings >= 50000,
      },
      {
        id: 5,
        title: "Manage Lifestyle Inflation",
        description: "As income grows, ensure a meaningful portion goes to wealth — not just lifestyle upgrades.",
        actionItems: [
          "For every salary increase, allocate at least 50% to investments before lifestyle expansion",
          "Define your 'enough' number for lifestyle categories and hold them firm during promotions",
          "Set a net worth tracking ritual — monthly or quarterly",
          "Review and renegotiate recurring costs annually (insurance, medical aid, subscriptions)",
        ],
        tradeoffs: [
          { pro: "Keeping lifestyle costs flat while income grows rapidly accelerates wealth building", con: "Some lifestyle upgrades at higher income are rational and sustainable — this isn't about deprivation" },
        ],
        warnings: [
          "Lifestyle inflation is silent. Without intentional tracking, most people have no idea their fixed costs have doubled.",
        ],
        educationalContent:
          "Studies show that happiness associated with income increases plateaus beyond approximately R1.2–1.5M per year in SA (adjusted for local costs). Beyond a certain level, more income generates more wealth only if spending discipline is maintained. Intentional lifestyle design — deciding what truly matters — is the highest-leverage financial skill.",
        glossaryTerms: [
          { term: "Lifestyle Inflation", definition: "The gradual increase in spending as income rises, often unconscious. It prevents wealth accumulation even at high income levels." },
          { term: "Net Worth", definition: "Total assets (savings, investments, property value) minus total liabilities (debt, loans). The single most important measure of financial progress." },
        ],
        requirement: (s) => s.savingsRate >= 20,
      },
    ],
  },

  {
    id: "aggressive",
    name: "Aggressive Global Investor",
    tagline: "Maximum exposure. Maximum discipline. Maximum growth.",
    description:
      "For high earners comfortable with risk who want to build significant wealth through globally diversified, high-allocation investing.",
    difficulty: "Advanced",
    timeHorizon: "5–15 years",
    whoIsItFor:
      "High earners (R100K+/month take-home) with a 10+ year horizon who want to optimise for wealth maximisation, not lifestyle.",
    rationale:
      "Wealth at scale requires moving beyond the basics. This track covers tax optimisation, offshore structures, high-allocation investing, and the discipline to stay the course through market cycles.",
    nudgeDefs: [
      {
        id: "agg_savings_low",
        condition: (m) => m.savingsRate < 30,
        message:
          "🎯 Aggressive wealth building typically requires 30%+ savings rate. Find more to allocate.",
        severity: SEVERITY.WARNING,
      },
      {
        id: "agg_offshore_low",
        condition: (m, ctx) => ctx.offshoreInv < ctx.totalSavings * 0.3,
        message:
          "🌍 Less than 30% of your portfolio is offshore. SA concentration risk is significant at scale.",
        severity: SEVERITY.INFO,
      },
    ],
    stages: [
      {
        id: 1,
        title: "Maximise Income & Reduce Tax",
        description: "At high income, every rand of tax saved is a rand available to compound. Structure matters.",
        actionItems: [
          "Maximise your RA contribution (27.5% of taxable income, up to R350K/year)",
          "Use your full R36,000 TFSA allowance — elite fund selection matters here",
          "Investigate whether contracting or consulting structures reduce your effective tax rate",
          "Ensure your medical aid tax credits are correctly applied to your PAYE",
          "Work with a fee-only financial advisor on income structuring",
        ],
        tradeoffs: [
          { pro: "RA contributions reduce taxable income immediately — a R5,000/month RA saves R1,500–R2,300/month in PAYE at high brackets", con: "RA funds are illiquid until age 55 — you cannot access this capital earlier" },
        ],
        warnings: [
          "Tax avoidance structures that aren't SARS-compliant carry significant penalties. Work only with qualified advisors.",
        ],
        educationalContent:
          "South Africa's top marginal rate is 45% on income above R1.8M/year. At this level, structuring contributions into an RA, utilising section 11(f) deductions, and splitting income where legally possible are material. A R10,000/month RA contribution at the 41% bracket saves R4,100/month in tax — R49,200/year returned to you as a tax refund.",
        glossaryTerms: [
          { term: "Retirement Annuity (RA)", definition: "A long-term retirement savings vehicle in SA. Contributions are tax-deductible up to 27.5% of taxable income (max R350,000/year). Funds are inaccessible until age 55." },
          { term: "Section 11(f) Deduction", definition: "The section of the Income Tax Act allowing RA and pension fund contributions to be deducted from taxable income, reducing your PAYE liability." },
        ],
        requirement: () => true,
      },
      {
        id: 2,
        title: "TFSA & Local Index Strategy",
        description: "Fully fund your TFSA with high-growth equity funds, then build a low-cost local index portfolio.",
        actionItems: [
          "Max R36,000 TFSA annually into a 100% equity fund (Satrix Top 40, 1nvest ALSI)",
          "Build a parallel brokerage account with JSE ETFs for flexibility above the TFSA limit",
          "Target a local equity allocation of 15–25% of total portfolio",
          "Automate contributions to remove behavioural risk",
        ],
        tradeoffs: [
          { pro: "Local equity has outperformed inflation significantly over 20-year periods despite volatility", con: "JSE concentration in resources and financials creates sector risk" },
        ],
        warnings: ["Don't over-weight the JSE at scale. SA GDP is ~0.4% of global GDP — your portfolio shouldn't be 90% local."],
        educationalContent:
          "The JSE All Share Index has delivered approximately 14% nominal returns over the last 20 years, but with significant volatility. At high portfolio values, CGT on local equity positions becomes material — holding via an RA or TFSA where possible delays or eliminates this liability.",
        glossaryTerms: [
          { term: "JSE All Share Index (ALSI)", definition: "An index tracking all shares listed on the Johannesburg Stock Exchange weighted by market capitalisation. A broad measure of South African equity market performance." },
        ],
        requirement: (s) => s.tfsa >= 36000,
      },
      {
        id: 3,
        title: "Build Offshore Exposure",
        description: "Systematically move capital offshore using legal SARS allowances to access global growth.",
        actionItems: [
          "Use your R1M annual single discretionary allowance without tax clearance",
          "Apply for a foreign investment tax clearance certificate for R10M/year",
          "Open an account with a global broker (Interactive Brokers, Charles Schwab, or local offshore platforms)",
          "Target S&P 500 and MSCI World Index ETFs as core holdings",
          "Maintain a rand-cost averaging approach — don't try to time the rand",
        ],
        tradeoffs: [
          { pro: "Global diversification protects against SA-specific political and economic risk", con: "Rand depreciation increases the rand value of offshore holdings but also increases your cost of repatriation" },
          { pro: "Access to US and European markets gives exposure to technology and sectors underrepresented on the JSE", con: "Offshore investing involves foreign estate duty complexity for large holdings" },
        ],
        warnings: [
          "SARS requires that all offshore income and gains be declared, even if not repatriated. Non-compliance carries heavy penalties.",
          "Do not move capital offshore faster than your risk and liquidity needs allow.",
        ],
        educationalContent:
          "The S&P 500 has delivered approximately 10% USD annual returns over the last 30 years. For a South African investor, this is magnified by rand depreciation (historically ~5% annual weakening against the USD). Combined, offshore equity has significantly outpaced JSE returns for most holding periods — but with currency volatility in between.",
        glossaryTerms: [
          { term: "Single Discretionary Allowance", definition: "A R1,000,000 annual allowance for South African tax residents to transfer funds offshore without applying for tax clearance from SARS." },
          { term: "Foreign Investment Allowance", definition: "An allowance of up to R10,000,000 per year for SA residents to invest offshore, requiring a tax compliance certificate from SARS." },
        ],
        requirement: (s) => s.offshoreInv >= 50000,
      },
      {
        id: 4,
        title: "Advanced Tax Optimisation",
        description: "Structure your affairs to legally minimise your lifetime tax liability across income, capital gains, and estate.",
        actionItems: [
          "Review your will and estate plan with a fiduciary specialist",
          "Consider a family trust for asset protection and estate planning at R5M+ net worth",
          "Understand the CGT implications of your existing portfolio before any asset sale",
          "Model your retirement date and optimal RA drawdown strategy",
          "Review your medical aid tax credits, travel allowance claims, and home office deductions",
        ],
        tradeoffs: [
          { pro: "Proper estate planning can save dependants hundreds of thousands in estate duty and executor fees", con: "Trusts have real ongoing costs — accounting, trustee fees, and complexity. Only worth it at scale." },
        ],
        warnings: [
          "Tax structuring must be grounded in genuine commercial substance — SARS aggressively challenges arrangements with no purpose other than tax avoidance.",
        ],
        educationalContent:
          "Estate duty in SA is levied at 20% on estates above R3.5M (primary abatement) and 25% above R30M. For married couples, the surviving spouse inherits free of estate duty, but the estate of the second spouse to die may face a large liability. Trusts, properly structured, can hold assets outside your personal estate.",
        glossaryTerms: [
          { term: "Estate Duty", definition: "A South African tax on the estate of a deceased person, levied at 20% on the dutiable estate above R3.5M. Planning can significantly reduce this liability." },
          { term: "Capital Gains Tax (CGT)", definition: "On disposal of assets held outside a TFSA or RA, 40% of the gain is included in your taxable income (for individuals). Effective rate at the top bracket: ~18%." },
        ],
        requirement: (s) => s.totalSavings >= 500000,
      },
      {
        id: 5,
        title: "Sustain and Scale",
        description: "Protect your wealth, maintain your strategy through market cycles, and begin thinking about legacy.",
        actionItems: [
          "Rebalance your portfolio annually to your target allocation",
          "Define your 'financial independence' number — the portfolio size that covers all expenses from returns",
          "Review your life, disability, and income protection insurance annually",
          "Build a giving or impact strategy — charity contributions are SARS-deductible up to 10% of taxable income",
          "Mentor or teach financial literacy — the most durable form of wealth transfer",
        ],
        tradeoffs: [
          { pro: "A large, diversified portfolio provides genuine lifestyle optionality", con: "Managing a complex portfolio across multiple jurisdictions requires ongoing professional advice" },
        ],
        warnings: [
          "The biggest risk at this stage is behavioural — don't panic sell during market downturns. Stay the course.",
        ],
        educationalContent:
          "Financial independence (FI) is typically defined as having 25× your annual expenses invested in assets generating 4%+ returns (the '4% rule'). In SA, this requires higher returns (to account for inflation and rand depreciation) — a 5% sustainable withdrawal rate on a diversified portfolio is more conservative. The FIRE (Financial Independence, Retire Early) movement applies this framework at an accelerated timeline.",
        glossaryTerms: [
          { term: "4% Rule", definition: "A guideline suggesting that withdrawing 4% of a portfolio per year (adjusted for inflation) is sustainable indefinitely, based on US historical data. Adjust to 3.5–4% for South African investors accounting for local inflation." },
          { term: "Financial Independence (FI)", definition: "The state of having enough invested assets that passive returns cover your living expenses without needing to work." },
        ],
        requirement: (s) => s.savingsRate >= 30 && s.totalSavings >= 1000000,
      },
    ],
  },
];

export function getTrackById(id) {
  return TRACKS.find((t) => t.id === id) ?? null;
}

export const TRACK_PROGRESS_KEY = (trackId) => `track_progress_${trackId}_v1`;