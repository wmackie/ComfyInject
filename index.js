import { initDom } from "./src/dom.js";
import { initUI } from "./src/ui.js";
import { MODULE_NAME, defaultSettings, AUTO_PROMPT_TEXT } from "./settings.js";

// Import outbound so comfyInjectInterceptor gets registered on globalThis
import "./src/outbound.js";


/**
 * Applies or clears the ComfyInject system prompt injection based on current settings.
 * Safe to call at any time — re-reads settings on each call.
 */
export function updateExtensionPrompt() {
    const { extensionSettings, setExtensionPrompt } = SillyTavern.getContext();
    const settings = extensionSettings[MODULE_NAME];

    if (settings.auto_prompt_enabled) {
        // Position 1 = IN_PROMPT, depth 4 matches Author's Note injection depth
        // (extension_prompt_types unavailable in this ST build, values hardcoded)
        setExtensionPrompt(MODULE_NAME, AUTO_PROMPT_TEXT, 1, 4);
    } else {
        setExtensionPrompt(MODULE_NAME, "");
    }
}

/**
 * Initializes ComfyInject settings.
 * Merges defaults with any existing saved settings so new
 * keys are always present after an update.
 */
function initSettings() {
    const { extensionSettings, saveSettingsDebounced } = SillyTavern.getContext();

    if (!extensionSettings[MODULE_NAME]) {
        extensionSettings[MODULE_NAME] = {};
    }

    // Merge defaults into existing settings so new keys are always present
    const saved = extensionSettings[MODULE_NAME];
    for (const key of Object.keys(defaultSettings)) {
        if (!(key in saved)) {
            saved[key] = structuredClone(defaultSettings[key]);
        }
    }

    saveSettingsDebounced();
}

const VERSION = "1.0.5";

// Entry point
(async () => {
    console.log(`[ComfyInject] Loading... (v${VERSION})`);

    initSettings();
    await initUI();
    initDom();
    updateExtensionPrompt();

    // Re-apply the extension prompt whenever ST clears it (character/chat changes)
    const { eventSource, event_types } = SillyTavern.getContext();
    eventSource.on(event_types.CHAT_CHANGED, updateExtensionPrompt);

    console.log(`[ComfyInject] Ready! (v${VERSION})`);
})();