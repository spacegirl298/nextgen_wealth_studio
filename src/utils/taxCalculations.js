/*All SA tax logic as pure functions.
–	calculateIncomeTax(grossIncome) — applies SARS brackets
–	calculateUIF(grossIncome) — 1% capped
–	calculateNetIncome(grossIncome) — returns net, tax, UIF as object
–	calculateMedicalAidCredit(dependants) — monthly credit
–	calculateEffectiveTaxRate(grossIncome) — percentage
–	calculateAnnualFromMonthly(monthly) — utility
*/