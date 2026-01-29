import { Plugin, MarkdownView, PluginSettingTab, Setting, App, Notice } from 'obsidian';
import { renderMermaid as renderMermaidFn, THEMES as THEMES_IMPORT } from 'beautiful-mermaid';

interface BeautifulMermaidSettings {
	theme: string;
	transparent: boolean;
	size: number; // Percentage size (0-100)
	showBox: boolean; // Show box/border around diagram
}

const DEFAULT_SETTINGS: BeautifulMermaidSettings = {
	theme: 'tokyo-night',
	transparent: false,
	size: 60,
	showBox: false
}

export default class BeautifulMermaidPlugin extends Plugin {
	settings: BeautifulMermaidSettings;

	async onload() {
		await this.loadSettings();

		console.log('Beautiful Mermaid Plugin: Loading...');
		
		// Verify beautiful-mermaid is available
		if (renderMermaidFn && THEMES_IMPORT) {
			console.log('Beautiful Mermaid Plugin: Library loaded successfully');
			console.log('Beautiful Mermaid Plugin: Available themes:', Object.keys(THEMES_IMPORT));
		} else {
			console.error('Beautiful Mermaid Plugin: Failed to load beautiful-mermaid library');
			new Notice('Beautiful Mermaid: Library failed to load. Check console for details.');
		}

		// Register the code block processor for beautiful-mermaid
		// Users will use ```beautiful-mermaid instead of ```mermaid
		this.registerMarkdownCodeBlockProcessor('beautiful-mermaid', async (source, el, ctx) => {
			console.log('Beautiful Mermaid Plugin: Processing beautiful-mermaid block', source.substring(0, 50));
			
			// Clear the element completely
			el.empty();
			
			// Add a marker to identify our rendered content
			el.setAttribute('data-beautiful-mermaid', 'true');
			
			await this.renderBeautifulMermaid(source, el);
		});

		// Add settings tab
		this.addSettingTab(new BeautifulMermaidSettingTab(this.app, this));

		// Add command to refresh beautiful-mermaid diagrams
		this.addCommand({
			id: 'refresh-beautiful-mermaid',
			name: 'Refresh Beautiful Mermaid diagrams',
			callback: () => {
				// Force re-render of all beautiful-mermaid blocks in active view
				const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
				if (activeView) {
					// Trigger a re-render
					if (activeView.getMode() === 'preview') {
						activeView.previewMode.rerender(true);
					}
				}
			}
		});
	}

	async renderBeautifulMermaid(source: string, el: HTMLElement) {
		try {
			console.log('Beautiful Mermaid Plugin: Rendering with theme:', this.settings.theme);
			
			if (!renderMermaidFn || !THEMES_IMPORT) {
				throw new Error('beautiful-mermaid library not loaded');
			}
			
			// Clear any existing content
			el.empty();
			
			// Get the theme
			const themeName = this.settings.theme || 'tokyo-night';
			const theme = THEMES_IMPORT[themeName] || THEMES_IMPORT['tokyo-night'];
			
			if (!theme) {
				throw new Error(`Theme "${themeName}" not found. Available themes: ${Object.keys(THEMES_IMPORT).join(', ')}`);
			}

			// Create a minimal container for the SVG (matching native Mermaid styling)
			const container = el.createDiv({
				cls: 'beautiful-mermaid-container',
				attr: {
					'data-size': this.settings.size.toString(),
					'data-show-box': this.settings.showBox.toString(),
					style: `--beautiful-mermaid-size: ${this.settings.size}%;`
				}
			});

			// Show loading state
			const loading = container.createDiv({
				text: 'Rendering diagram...',
				cls: 'beautiful-mermaid-loading',
				attr: {
					style: 'padding: 10px; text-align: center;'
				}
			});

			// Render the diagram
			console.log('Beautiful Mermaid Plugin: Calling renderMermaid...');
			console.log('Beautiful Mermaid Plugin: Theme config:', theme);
			const svgString = await renderMermaidFn(source, {
				...theme,
				transparent: this.settings.transparent
			});
			console.log('Beautiful Mermaid Plugin: Got SVG, length:', svgString.length);
			console.log('Beautiful Mermaid Plugin: SVG preview (first 500 chars):', svgString.substring(0, 500));

			// Remove loading
			loading.remove();

			// Create a wrapper div for the SVG
			const svgWrapper = container.createDiv({
				cls: 'beautiful-mermaid-svg-wrapper'
			});

			// Insert the SVG directly as HTML to preserve CSS custom properties
			// This is important because beautiful-mermaid uses CSS variables on the SVG element
			svgWrapper.innerHTML = svgString;

			// Get the SVG element and make it responsive
			const svgElement = svgWrapper.querySelector('svg') as SVGElement;
			if (svgElement) {
				// Check if SVG has CSS custom properties (beautiful-mermaid theme variables)
				const hasCustomProps = svgElement.style.getPropertyValue('--bg') || 
				                      svgElement.getAttribute('style')?.includes('--bg');
				console.log('Beautiful Mermaid Plugin: SVG has custom properties:', hasCustomProps);
				
				// Get original dimensions for scaling
				const originalWidth = svgElement.getAttribute('width');
				const originalHeight = svgElement.getAttribute('height');
				const viewBox = svgElement.getAttribute('viewBox');
				
				// Preserve viewBox if it exists, otherwise create one from width/height
				if (!viewBox && originalWidth && originalHeight) {
					svgElement.setAttribute('viewBox', `0 0 ${originalWidth} ${originalHeight}`);
				}
				
				// Remove fixed dimensions to make it responsive
				svgElement.removeAttribute('width');
				svgElement.removeAttribute('height');
				
				// Preserve existing styles (including CSS custom properties) and add responsive behavior
				const existingStyle = svgElement.getAttribute('style') || '';
				// Build new style string, preserving CSS variables
				// Use width: auto instead of 100% to allow natural sizing, then CSS will scale it
				let newStyle = existingStyle;
				if (!newStyle.includes('max-width')) {
					newStyle = newStyle ? `${newStyle}; max-width: 100%; width: auto; height: auto;` : 'max-width: 100%; width: auto; height: auto;';
				}
				svgElement.setAttribute('style', newStyle);
				
				// Ensure the SVG scales properly within Obsidian's constraints
				svgElement.setAttribute('preserveAspectRatio', 'xMidYMid meet');
			} else {
				throw new Error('SVG element not found in rendered output');
			}

			console.log('Beautiful Mermaid Plugin: Successfully rendered diagram');

		} catch (error) {
			console.error('Beautiful Mermaid Plugin: Error rendering diagram', error);
			el.empty();
			const errorDiv = el.createDiv({
				cls: 'beautiful-mermaid-error',
				attr: {
					style: 'padding: 20px; background: #fee2e2; color: #991b1b; border-radius: 4px;'
				}
			});
			errorDiv.createEl('strong', { text: 'Error rendering Mermaid diagram:' });
			errorDiv.createEl('br');
			errorDiv.createEl('span', { text: error instanceof Error ? error.message : String(error) });
		}
	}

	onunload() {
		// Cleanup if needed
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	refreshDiagrams() {
		// Update all existing diagrams with new settings
		const views = this.app.workspace.getLeavesOfType('markdown');
		views.forEach(leaf => {
			const view = leaf.view as MarkdownView;
			if (view && view.previewMode) {
				view.previewMode.rerender(true);
			}
		});
	}
}

class BeautifulMermaidSettingTab extends PluginSettingTab {
	plugin: BeautifulMermaidPlugin;

	constructor(app: App, plugin: BeautifulMermaidPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		containerEl.createEl('h2', { text: 'Beautiful Mermaid Settings' });

		// Usage reminder
		const usageInfo = containerEl.createDiv({
			cls: 'beautiful-mermaid-usage-info',
			attr: {
				style: 'padding: 15px; background: var(--background-modifier-border); border-radius: 6px; margin-bottom: 20px;'
			}
		});
		usageInfo.createEl('strong', { text: 'Usage: ' });
		usageInfo.createEl('span', { 
			text: 'Use ' 
		});
		usageInfo.createEl('code', { 
			text: '```beautiful-mermaid' 
		});
		usageInfo.createEl('span', { 
			text: ' (not ' 
		});
		usageInfo.createEl('code', { 
			text: '```mermaid' 
		});
		usageInfo.createEl('span', { 
			text: ') as your code block type to use beautiful themes.' 
		});

		// Theme selection
		new Setting(containerEl)
			.setName('Theme')
			.setDesc('Select the theme for Mermaid diagrams')
			.addDropdown(dropdown => {
				const themes = [
					{ value: 'zinc-light', label: 'Zinc Light' },
					{ value: 'zinc-dark', label: 'Zinc Dark' },
					{ value: 'tokyo-night', label: 'Tokyo Night' },
					{ value: 'tokyo-night-storm', label: 'Tokyo Night Storm' },
					{ value: 'tokyo-night-light', label: 'Tokyo Night Light' },
					{ value: 'catppuccin-mocha', label: 'Catppuccin Mocha' },
					{ value: 'catppuccin-latte', label: 'Catppuccin Latte' },
					{ value: 'nord', label: 'Nord' },
					{ value: 'nord-light', label: 'Nord Light' },
					{ value: 'dracula', label: 'Dracula' },
					{ value: 'github-light', label: 'GitHub Light' },
					{ value: 'github-dark', label: 'GitHub Dark' },
					{ value: 'solarized-light', label: 'Solarized Light' },
					{ value: 'solarized-dark', label: 'Solarized Dark' },
					{ value: 'one-dark', label: 'One Dark' }
				];

				themes.forEach(theme => {
					dropdown.addOption(theme.value, theme.label);
				});

				dropdown.setValue(this.plugin.settings.theme);
				dropdown.onChange(async (value) => {
					this.plugin.settings.theme = value;
					await this.plugin.saveSettings();
					this.plugin.refreshDiagrams();
				});
			});

		// Transparent background option
		new Setting(containerEl)
			.setName('Transparent background')
			.setDesc('Render diagrams with a transparent background')
			.addToggle(toggle => {
				toggle.setValue(this.plugin.settings.transparent);
				toggle.onChange(async (value) => {
					this.plugin.settings.transparent = value;
					await this.plugin.saveSettings();
					this.plugin.refreshDiagrams();
				});
			});

		// Size setting
		new Setting(containerEl)
			.setName('Diagram size')
			.setDesc('Size of diagrams as a percentage of container width (10-100)')
			.addSlider(slider => {
				slider
					.setLimits(10, 100, 5)
					.setValue(this.plugin.settings.size)
					.setDynamicTooltip()
					.onChange(async (value) => {
						this.plugin.settings.size = value;
						await this.plugin.saveSettings();
						this.plugin.refreshDiagrams();
					});
			});

		// Show box setting
		new Setting(containerEl)
			.setName('Show box around diagram')
			.setDesc('Display a border/box around the diagram like in the web app')
			.addToggle(toggle => {
				toggle.setValue(this.plugin.settings.showBox);
				toggle.onChange(async (value) => {
					this.plugin.settings.showBox = value;
					await this.plugin.saveSettings();
					this.plugin.refreshDiagrams();
				});
			});

		// Attribution
		containerEl.createEl('hr');
		const attribution = containerEl.createDiv({
			cls: 'beautiful-mermaid-attribution',
			attr: {
				style: 'padding: 20px 0; color: var(--text-muted); font-size: 0.9em;'
			}
		});
		attribution.createEl('p', {
			text: 'This plugin uses the ',
		});
		const link = attribution.createEl('a', {
			text: 'beautiful-mermaid',
			href: 'https://github.com/lukilabs/beautiful-mermaid',
			attr: {
				target: '_blank',
				rel: 'noopener noreferrer'
			}
		});
		attribution.createEl('span', {
			text: ' library for rendering Mermaid diagrams with beautiful themes.'
		});
	}
}
