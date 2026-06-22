# TaskNotes Review Intervals

An [Obsidian](https://obsidian.md) plugin that adds review scheduling to your notes via configurable review intervals.

## How it works

Run the **"Mark reviewed"** command on any note. The plugin reads a `reviewIntervalDays` field from the note's frontmatter and writes a `review` date (today + interval) back into the frontmatter.

If the note doesn't have a `reviewIntervalDays` field yet, a prompt asks you to set one. The interval is saved to the note so future reviews are one command away.

Example frontmatter after marking reviewed with a 14-day interval:

```yaml
reviewIntervalDays: 14
review: 2026-07-06
```

## Settings

| Setting | Default | Description |
|---|---|---|
| Review field name | `review` | Frontmatter field written with the next review date |
| Review interval field name | `reviewIntervalDays` | Frontmatter field (integer days) read by the mark reviewed command |
| Default review interval (days) | `7` | Pre-filled value when the command prompts for an interval |

## Installation

### From the Obsidian community plugins list

Search for "TaskNotes Review Intervals" in Settings → Community plugins.

### Manually

Copy `main.js`, `styles.css`, and `manifest.json` into your vault at `.obsidian/plugins/tasknotes-review-intervals/`.

## Releasing new versions

Bump the version in `package.json`, then tag and push — GitHub Actions builds and creates a draft release automatically:

```bash
npm version patch   # or minor / major
git push && git push --tags
```
