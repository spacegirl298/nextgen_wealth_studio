/*Hook wrapping taxCalculations.js for use in components.
–	Accepts grossIncome as input
–	Returns: netIncome, taxAmount, uifAmount, effectiveRate
–	Recalculates reactively when grossIncome changes
–	Used by: IncomeForm in MoneySnapshot
*/