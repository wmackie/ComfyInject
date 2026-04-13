export const AUTO_PROMPT_TEXT = `IMAGE INJECTION RULES
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

// Default settings for ComfyInject
// These are loaded into SillyTavern's extension settings panel.
// DO NOT CHANGE THESE VALUES HERE. Instead, change them in the UI.

export const MODULE_NAME = "comfyinject";

export const defaultSettings = Object.freeze({

    // --- ComfyUI Connection ---
    comfy_host: "http://127.0.0.1:8188",

    // --- Model ---
    // The filename of your checkpoint as it appears in ComfyUI's model list.
    // Example: "v1-5-pruned-emaonly.ckpt" or "dreamshaper_8.safetensors"
    checkpoint: "v1-5-pruned-emaonly-fp16.safetensors",

    // --- Workflow ---
    // The filename of the workflow JSON in the workflows folder.
    workflow: "comfyinject_default.json",

    // --- Negative Prompt ---
    negative_prompt: "worst quality, low quality, blurry, deformed, ugly, extra limbs",

    // --- Prepend Prompt ---
    // Custom tags prepended to every positive prompt before the LLM's output.
    prepend_prompt: "",

    // --- Append Prompt ---
    // Custom tags appended to every positive prompt after the LLM's output.
    append_prompt: "",

    // --- Sampler Settings ---
    steps: 24,
    cfg: 7.0,
    sampler: "euler",
    scheduler: "normal",
    denoise: 1.0,

    // --- Polling ---
    // Maximum number of 1-second polls before giving up on an image.
    max_poll_attempts: 600,

    // --- Aspect Ratio Resolutions ---
    // Width x Height in pixels for each AR token the LLM can use.
    resolutions: {
        PORTRAIT:  { width: 512,  height: 768 },
        SQUARE:    { width: 512,  height: 512 },
        LANDSCAPE: { width: 768,  height: 512 },
        CINEMA:    { width: 768,  height: 432 },
    },

    // --- Resolution Lock ---
    // When enabled, ignores the LLM's AR token and uses this resolution for everything.
    resolution_lock_enabled: false,
    resolution_lock: { width: 512, height: 768 },

    // --- Shot Lock ---
    // When enabled, ignores the LLM's SHOT token and uses this shot type for everything.
    shot_lock_enabled: false,
    shot_lock: "MEDIUM",

    // --- Seed Lock ---
    // When enabled, ignores the LLM's SEED token and uses this seed mode for everything.
    // seed_lock_mode can be "RANDOM", "LOCK", or "CUSTOM".
    seed_lock_enabled: false,
    seed_lock_mode: "RANDOM",
    seed_lock_value: 0,

    // --- Auto Prompt Injection ---
    // When enabled, ComfyInject automatically injects its system prompt into every
    // generation. Equivalent to placing the prompt in Author's Note.
    auto_prompt_enabled: false,

    // --- Marker Repair Notifications ---
    // Controls when parser repair toasts are shown.
    // "all" = successful repaired markers + parse failures
    // "failures" = parse failures only
    // "off" = no marker repair toasts
    repair_toast_mode: "failures",

    // --- Shot Tags ---
    // Danbooru-style tags prepended to the positive prompt for each SHOT token.
    // Edit these to match your model's preferred framing vocabulary.
    shot_tags: {
        CLOSE:     "close-up, face focus",
        MEDIUM:    "upper body",
        WIDE:      "full body",
        DUTCH:     "dutch angle",
        OVERHEAD:  "from above, bird's eye view",
        LOWANGLE:  "from below",
        HIGHANGLE: "from above",
        PROFILE:   "profile, from side",
        BACKVIEW:  "from behind",
        POV:       "pov",
    },
});