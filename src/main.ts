import { Plugin } from 'obsidian';
import {
	DEFAULT_SETTINGS,
	ReviewIntervalsSettings,
	ReviewIntervalsSettingTab,
} from './settings';

export default class ReviewIntervalsPlugin extends Plugin {
	settings!: ReviewIntervalsSettings;

	async onload() {
		await this.loadSettings();

		this.addCommand({
			id: 'mark-reviewed',
			name: 'Mark reviewed',
			checkCallback: (checking: boolean) => {
				const file = this.app.workspace.getActiveFile();
				if (!file) return false;

				const fm =
					this.app.metadataCache.getFileCache(file)?.frontmatter;
				const interval: unknown =
					fm?.[this.settings.reviewIntervalField];
				if (typeof interval !== 'number' || !Number.isFinite(interval))
					return false;

				if (!checking) {
					void this.app.fileManager.processFrontMatter(
						file,
						(frontmatter: Record<string, unknown>) => {
							const days =
								frontmatter[this.settings.reviewIntervalField];
							if (
								typeof days !== 'number' ||
								!Number.isFinite(days)
							)
								return;
							const date = new Date();
							date.setDate(date.getDate() + days);
							const y = date.getFullYear();
							const m = String(date.getMonth() + 1).padStart(
								2,
								'0',
							);
							const d = String(date.getDate()).padStart(2, '0');
							frontmatter[this.settings.reviewField] =
								`${y}-${m}-${d}`;
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
