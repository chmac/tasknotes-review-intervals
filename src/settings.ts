import { App, PluginSettingTab, Setting } from 'obsidian';
import ExtraDatesPlugin from './main';

export const DEFAULT_SNOOZED_FIELD = 'snoozed';
export const DEFAULT_REVIEW_FIELD = 'review';
export const DEFAULT_REVIEW_INTERVAL_FIELD = 'reviewInterval';

export interface ExtraDatesSettings {
	snoozedField: string;
	reviewField: string;
	reviewIntervalField: string;
}

export const DEFAULT_SETTINGS: ExtraDatesSettings = {
	snoozedField: DEFAULT_SNOOZED_FIELD,
	reviewField: DEFAULT_REVIEW_FIELD,
	reviewIntervalField: DEFAULT_REVIEW_INTERVAL_FIELD,
};

export class ExtraDatesSettingTab extends PluginSettingTab {
	plugin: ExtraDatesPlugin;

	constructor(app: App, plugin: ExtraDatesPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		new Setting(containerEl)
			.setName('Snoozed field name')
			.setDesc('Frontmatter field cleared when a task is completed.')
			.addText((text) =>
				text
					.setPlaceholder(DEFAULT_SNOOZED_FIELD)
					.setValue(this.plugin.settings.snoozedField)
					.onChange(async (value) => {
						this.plugin.settings.snoozedField =
							value || DEFAULT_SNOOZED_FIELD;
						await this.plugin.saveSettings();
					}),
			);

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
