import { Plugin } from 'obsidian';
import {
	DEFAULT_SETTINGS,
	ReviewIntervalsSettings,
	ReviewIntervalsSettingTab,
} from './settings';
import { computeNextReviewDate } from './utils';

export default class ReviewIntervalsPlugin extends Plugin {
	settings!: ReviewIntervalsSettings;

	async onload() {
		await this.loadSettings();

		this.addCommand({
			id: 'mark-reviewed',
			name: 'Mark reviewed',
			checkCallback: (checking: boolean) => {
				const file = this.app.workspace.getActiveFile();
				if (!file) {
					return false;
				}

				const frontmatterCache =
					this.app.metadataCache.getFileCache(file)?.frontmatter;
				const interval: unknown =
					frontmatterCache?.[this.settings.reviewIntervalField];
				if (
					typeof interval !== 'number' ||
					!Number.isFinite(interval)
				) {
					return false;
				}

				if (!checking) {
					void this.app.fileManager.processFrontMatter(
						file,
						(frontmatter: Record<string, unknown>) => {
							const days =
								frontmatter[this.settings.reviewIntervalField];
							if (
								typeof days !== 'number' ||
								!Number.isFinite(days)
							) {
								return;
							}
							frontmatter[this.settings.reviewField] =
								computeNextReviewDate(new Date(), days);
						},
					);
				}

				return true;
			},
		});

		this.addSettingTab(new ReviewIntervalsSettingTab(this.app, this));
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			(await this.loadData()) as Partial<ReviewIntervalsSettings>,
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
