import { computeNextReviewDate } from './utils';

export type MarkReviewedAction =
	| { kind: 'update'; reviewDate: string }
	| { kind: 'prompt' };

export function getMarkReviewedAction(
	frontmatter: Record<string, unknown>,
	reviewIntervalField: string,
	today: Date,
): MarkReviewedAction {
	const interval = frontmatter[reviewIntervalField];
	if (
		typeof interval === 'number' &&
		Number.isFinite(interval) &&
		interval > 0
	) {
		return { kind: 'update', reviewDate: computeNextReviewDate(today, interval) };
	}
	return { kind: 'prompt' };
}

export function getInitialReviewPatch(
	days: number,
	reviewIntervalField: string,
	reviewField: string,
	today: Date,
): Record<string, unknown> {
	return {
		[reviewIntervalField]: days,
		[reviewField]: computeNextReviewDate(today, days),
	};
}
