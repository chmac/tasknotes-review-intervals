import {
	App,
	ButtonComponent,
	Modal,
	Plugin,
	TextComponent,
	TFile,
} from 'obsidian';
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

				if (!checking) {
					const frontmatterCache =
						this.app.metadataCache.getFileCache(file)?.frontmatter;
					const interval: unknown =
						frontmatterCache?.[this.settings.reviewIntervalField];

					if (
						typeof interval === 'number' &&
						Number.isFinite(interval)
					) {
						void this.app.fileManager.processFrontMatter(
							file,
							(frontmatter: Record<string, unknown>) => {
								const days =
									frontmatter[
										this.settings.reviewIntervalField
									];
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
					} else {
						new SetReviewIntervalModal(
							this.app,
							this.settings,
							file,
						).open();
					}
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

class SetReviewIntervalModal extends Modal {
	private readonly settings: ReviewIntervalsSettings;
	private readonly file: TFile;

	constructor(app: App, settings: ReviewIntervalsSettings, file: TFile) {
		super(app);
		this.settings = settings;
		this.file = file;
	}

	onOpen() {
		this.setTitle('Set review interval');

		const input = new TextComponent(this.contentEl)
			.setPlaceholder('E.g. 14')
			.setValue(String(this.settings.defaultReviewIntervalDays));

		input.inputEl.addEventListener('keydown', (e: KeyboardEvent) => {
			if (e.key === 'Enter') {
				this.submit(input.getValue());
			}
		});

		new ButtonComponent(this.contentEl)
			.setButtonText('Set interval')
			.setCta()
			.onClick(() => this.submit(input.getValue()));

		input.inputEl.focus();
		input.inputEl.select();
	}

	onClose() {
		this.contentEl.empty();
	}

	private submit(value: string) {
		const days = parseInt(value, 10);
		if (!Number.isInteger(days) || days <= 0) {
			return;
		}
		void this.app.fileManager.processFrontMatter(
			this.file,
			(frontmatter: Record<string, unknown>) => {
				frontmatter[this.settings.reviewIntervalField] = days;
				frontmatter[this.settings.reviewField] = computeNextReviewDate(
					new Date(),
					days,
				);
			},
		);
		this.close();
	}
}
