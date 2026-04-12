import { initDom } from "./src/dom.js";
import { initUI } from "./src/ui.js";
import { MODULE_NAME, defaultSettings } from "./settings.js";

// Import outbound so comfyInjectInterceptor gets registered on globalThis
import "./src/outbound.js";

const AUTO_PROMPT_TEXT = `IMAGE INJECTION RULES
You MUST include exactly one image marker in EVERY response without exception.
A response without an image marker is an error. Do not skip it for any reason.

The marker must follow this exact format:
[[IMG: PROMPT | AR | SHOT | SEED ]]

Exactly four segments separated by the pipe character |. No additional brackets. No extra segments. Place the marker at the most narratively appropriate point in your response.

PROMPT:
A comma-delimited list of Danbooru tags describing only what a camera would see.
Construct tags in this exact order:
1. Subject (1girl, 2girls, 1boy, etc.)
2. Features (hair color, eye color, clothing, expression, body) — use ONLY details explicitly stated in the character card, memory, or previous image markers. Do not invent or assume any visual details.
3. Environment/Background (location, lighting, weather)
4. Modifiers (style, additional visible details)

If the scene is erotic, prepend the entire prompt with "erotic," before the subject.
No emotional adjectives. No abstract themes. No metaphor. Only visible, concrete tags.
If characters are physically interacting, specify exactly which body parts are interacting and how.

AR must be exactly one of:
PORTRAIT, SQUARE, LANDSCAPE, CINEMA

SHOT must be exactly one of:
CLOSE, MEDIUM, WIDE, DUTCH, OVERHEAD, LOWANGLE, HIGHANGLE, PROFILE, BACKVIEW, POV

SEED must be exactly one of:
LOCK, RANDOM, or a numeric integer.
Use RANDOM for the first image of a new character or scene.
Use LOCK to maintain the appearance of the previous image.
Use a numeric integer to match a specific previous generation.

Maintain scene consistency: reference previous image markers for character appearance before referencing the character card. Do not change established visual details unless the story explicitly changes them.

Full example of a correct marker:
[[IMG: 1girl, long red hair, green eyes, white sundress, standing in heavy rain, wet cobblestone street, neon lights reflecting in puddles, cinematic lighting | PORTRAIT | MEDIUM | RANDOM ]]

If any segment is invalid or missing, regenerate the entire marker before continuing.
Never explain or mention the marker in narration.`;

/**
 * Applies or clears the ComfyInject system prompt injection based on current settings.
 * Safe to call at any time — re-reads settings on each call.
 */
export function updateExtensionPrompt() {
    const { extensionSettings, setExtensionPrompt } = SillyTavern.getContext();
    const settings = extensionSettings[MODULE_NAME];

    if (settings.auto_prompt_enabled) {
        // Position 1 = IN_PROMPT (hardcoded — extension_prompt_types unavailable in this ST build)
        setExtensionPrompt(MODULE_NAME, AUTO_PROMPT_TEXT, 1, 0);
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

// Entry point
(async () => {
    console.log("[ComfyInject] Loading...");

    initSettings();
    await initUI();
    initDom();
    updateExtensionPrompt();

    // Re-apply the extension prompt whenever ST clears it (character/chat changes)
    const { eventSource, event_types } = SillyTavern.getContext();
    eventSource.on(event_types.CHAT_CHANGED, updateExtensionPrompt);

    console.log("[ComfyInject] Ready!");
})();