import { App, Plugin, PluginSettingTab, Setting } from 'obsidian';

export const DEFAULT_REVIEW_FIELD = 'review';
export const DEFAULT_REVIEW_INTERVAL_FIELD = 'reviewIntervalDays';
export const DEFAULT_REVIEW_INTERVAL_DAYS = 7;

export interface ReviewIntervalsSettings {
	reviewField: string;
	reviewIntervalField: string;
	defaultReviewIntervalDays: number;
}

export const DEFAULT_SETTINGS: ReviewIntervalsSettings = {
	reviewField: DEFAULT_REVIEW_FIELD,
	reviewIntervalField: DEFAULT_REVIEW_INTERVAL_FIELD,
	defaultReviewIntervalDays: DEFAULT_REVIEW_INTERVAL_DAYS,
};

export class ReviewIntervalsSettingTab extends PluginSettingTab {
	private settings: ReviewIntervalsSettings;
	private readonly saveSettings: () => Promise<void>;

	constructor(
		app: App,
		plugin: Plugin,
		settings: ReviewIntervalsSettings,
		saveSettings: () => Promise<void>,
	) {
		super(app, plugin);
		this.settings = settings;
		this.saveSettings = saveSettings;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		new Setting(containerEl)
			.setName('Review field name')
			.setDesc('Frontmatter field written with the next review date.')
			.addText((text) =>
				text
					.setPlaceholder(DEFAULT_REVIEW_FIELD)
					.setValue(this.settings.reviewField)
					.onChange(async (value) => {
						this.settings.reviewField =
							value || DEFAULT_REVIEW_FIELD;
						await this.saveSettings();
					}),
			);

		new Setting(containerEl)
			.setName('Review interval field name')
			.setDesc(
				'Frontmatter field (integer days) read by the "mark reviewed" command.',
			)
			.addText((text) =>
				text
					.setPlaceholder(DEFAULT_REVIEW_INTERVAL_FIELD)
					.setValue(this.settings.reviewIntervalField)
					.onChange(async (value) => {
						this.settings.reviewIntervalField =
							value || DEFAULT_REVIEW_INTERVAL_FIELD;
						await this.saveSettings();
					}),
			);

		new Setting(containerEl)
			.setName('Default review interval (days)')
			.setDesc(
				'Pre-filled value when the "mark reviewed" command prompts for an interval.',
			)
			.addText((text) =>
				text
					.setPlaceholder(String(DEFAULT_REVIEW_INTERVAL_DAYS))
					.setValue(
						String(this.settings.defaultReviewIntervalDays),
					)
					.onChange(async (value) => {
						const parsed = parseInt(value, 10);
						this.settings.defaultReviewIntervalDays =
							Number.isInteger(parsed) && parsed > 0
								? parsed
								: DEFAULT_REVIEW_INTERVAL_DAYS;
						await this.saveSettings();
					}),
			);
	}
}
