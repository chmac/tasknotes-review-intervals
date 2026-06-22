export function computeNextReviewDate(today: Date, intervalDays: number): string {
	const date = new Date(today);
	date.setDate(date.getDate() + intervalDays);
	const y = date.getFullYear();
	const m = String(date.getMonth() + 1).padStart(2, '0');
	const d = String(date.getDate()).padStart(2, '0');
	return `${y}-${m}-${d}`;
}
