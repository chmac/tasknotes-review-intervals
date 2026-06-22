import { App, PluginSettingTab, Setting } from 'obsidian';
import ReviewIntervalsPlugin from './main';

export const DEFAULT_REVIEW_FIELD = 'review';
export const DEFAULT_REVIEW_INTERVAL_FIELD = 'reviewInterval';

export interface ReviewIntervalsSettings {
	reviewField: string;
	reviewIntervalField: string;
}

export const DEFAULT_SETTINGS: ReviewIntervalsSettings = {
	reviewField: DEFAULT_REVIEW_FIELD,
	reviewIntervalField: DEFAULT_REVIEW_INTERVAL_FIELD,
};

export class ReviewIntervalsSettingTab extends PluginSettingTab {
	plugin: ReviewIntervalsPlugin;

	constructor(app: App, plugin: ReviewIntervalsPlugin) {
		super(app, plugin);
		this.plugin = plugin;
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
					.setValue(this.plugin.settings.reviewField)
					.onChange(async (value) => {
						this.plugin.settings.reviewField =
							value || DEFAULT_REVIEW_FIELD;
						await this.plugin.saveSettings();
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
					.setValue(this.plugin.settings.reviewIntervalField)
					.onChange(async (value) => {
						this.plugin.settings.reviewIntervalField =
							value || DEFAULT_REVIEW_INTERVAL_FIELD;
						await this.plugin.saveSettings();
					}),
			);
	}
}
