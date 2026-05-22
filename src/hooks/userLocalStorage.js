/*Generic hook for reading/writing to localStorage with JSON serialisation.
–	useLocalStorage(key, initialValue) — returns [value, setValue]
–	Auto-parses on read, auto-stringifies on write
–	Handles parse errors gracefully
–	Used by: StrategyTrack progress, MoneySnapshot history, UserContext session
*/