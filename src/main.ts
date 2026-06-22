import { App, EventRef, Notice, Plugin, TFile } from 'obsidian';
import {
	DEFAULT_SETTINGS,
	ExtraDatesSettings,
	ExtraDatesSettingTab,
} from './settings';

interface TaskNotesApi {
	readonly apiVersion: number;
	hasCapability(capability: string): boolean;
	events: {
		on(
			event: string,
			handler: (payload: { taskPath: string }) => void,
		): EventRef;
	};
}

interface ObsidianWithPlugins extends App {
	plugins: {
		getPlugin(id: string): { api?: TaskNotesApi } | null;
	};
}

export default class ExtraDatesPlugin extends Plugin {
	settings!: ExtraDatesSettings;

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

		this.addSettingTab(new ExtraDatesSettingTab(this.app, this));

		this.app.workspace.onLayoutReady(() => {
			this.wireTaskNotesEvents();
		});
	}

	private wireTaskNotesEvents() {
		const api = (this.app as ObsidianWithPlugins).plugins.getPlugin(
			'tasknotes',
		)?.api;

		if (
			!api ||
			api.apiVersion !== 1 ||
			!api.hasCapability('recurring.events')
		) {
			new Notice(
				'Tasknotes extra dates: TaskNotes plugin not found or missing recurring.events capability — snooze clearing on completion is disabled.',
			);
			return;
		}

		const clearSnoozed = (payload: { taskPath: string }) => {
			const file = this.app.vault.getAbstractFileByPath(payload.taskPath);
			if (!(file instanceof TFile)) return;
			this.app.fileManager
				.processFrontMatter(
					file,
					(frontmatter: Record<string, unknown>) => {
						delete frontmatter[this.settings.snoozedField];
					},
				)
				.catch((err: unknown) =>
					console.error(
						'extra-dates: failed to clear snoozed field',
						err,
					),
				);
		};

		this.registerEvent(
			api.events.on('recurring.instance.completed', clearSnoozed),
		);
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			(await this.loadData()) as Partial<ExtraDatesSettings>,
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
