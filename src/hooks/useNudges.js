/*Hook for triggering and managing contextual nudges.
–	Reads financial metrics from FinancialContext
–	Evaluates nudge trigger rules (e.g. savings rate < 10%, debt ratio > 40%)
–	Returns active nudges array
–	Exposes dismissNudge(id) function
–	Persists dismissed nudge IDs in localStorage so they don't re-appear immediately
–	Used by: NudgeBanner, NudgeContext
*/