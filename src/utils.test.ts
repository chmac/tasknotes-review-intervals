import { describe, expect, it } from 'vitest';
import { computeNextReviewDate } from './utils';

describe('computeNextReviewDate', () => {
	it('adds interval days to today', () => {
		const result = computeNextReviewDate(new Date(2026, 5, 22), 7);
		expect(result).toBe('2026-06-29');
	});

	it('returns today when interval is 0', () => {
		const result = computeNextReviewDate(new Date(2026, 5, 22), 0);
		expect(result).toBe('2026-06-22');
	});

	it('rolls over month boundary', () => {
		const result = computeNextReviewDate(new Date(2026, 5, 25), 7);
		expect(result).toBe('2026-07-02');
	});

	it('rolls over year boundary', () => {
		const result = computeNextReviewDate(new Date(2026, 11, 28), 7);
		expect(result).toBe('2027-01-04');
	});

	it('pads single-digit month and day', () => {
		const result = computeNextReviewDate(new Date(2026, 0, 1), 0);
		expect(result).toBe('2026-01-01');
	});

	it('uses local date, not UTC (23:30 UTC-2 is next day in UTC but not locally)', () => {
		// 23:30 local time — if we accidentally used UTC, setDate arithmetic
		// could produce the wrong day in negative-offset timezones
		const lateNight = new Date(2026, 5, 22, 23, 30, 0);
		const result = computeNextReviewDate(lateNight, 1);
		expect(result).toBe('2026-06-23');
	});
});
