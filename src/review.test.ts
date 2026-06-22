import { describe, expect, it } from 'vitest';
import { getInitialReviewPatch, getMarkReviewedAction } from './review';

const TODAY = new Date(2026, 5, 22);

describe('getMarkReviewedAction', () => {
	it('returns update with next review date when interval is set', () => {
		const result = getMarkReviewedAction(
			{ reviewIntervalDays: 7 },
			'reviewIntervalDays',
			TODAY,
		);
		expect(result).toEqual({ kind: 'update', reviewDate: '2026-06-29' });
	});

	it('returns prompt when field is missing', () => {
		const result = getMarkReviewedAction({}, 'reviewIntervalDays', TODAY);
		expect(result).toEqual({ kind: 'prompt' });
	});

	it('returns prompt when value is a string', () => {
		const result = getMarkReviewedAction(
			{ reviewIntervalDays: '7' },
			'reviewIntervalDays',
			TODAY,
		);
		expect(result).toEqual({ kind: 'prompt' });
	});

	it('returns prompt when value is zero', () => {
		const result = getMarkReviewedAction(
			{ reviewIntervalDays: 0 },
			'reviewIntervalDays',
			TODAY,
		);
		expect(result).toEqual({ kind: 'prompt' });
	});

	it('returns prompt when value is negative', () => {
		const result = getMarkReviewedAction(
			{ reviewIntervalDays: -3 },
			'reviewIntervalDays',
			TODAY,
		);
		expect(result).toEqual({ kind: 'prompt' });
	});
});

describe('getInitialReviewPatch', () => {
	it('returns both fields with correct values', () => {
		const result = getInitialReviewPatch(
			14,
			'reviewIntervalDays',
			'review',
			TODAY,
		);
		expect(result).toEqual({
			reviewIntervalDays: 14,
			review: '2026-07-06',
		});
	});

	it('uses the provided field names', () => {
		const result = getInitialReviewPatch(
			7,
			'customIntervalField',
			'customReviewField',
			TODAY,
		);
		expect(result).toEqual({
			customIntervalField: 7,
			customReviewField: '2026-06-29',
		});
	});
});
