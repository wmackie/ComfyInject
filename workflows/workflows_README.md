# Custom Workflows

Place your ComfyUI workflow JSON files here.

ComfyInject ships with `comfyinject_default.json` which works out of the box using only built-in ComfyUI nodes. You only need a custom workflow if you want to use custom nodes, ControlNet, LoRAs wired in at the node level, or any other advanced setup.

---

## Placeholder Formats

ComfyInject supports two placeholder formats. Use whichever matches your workflow — they are interchangeable and can be mixed in the same file.

### ComfyInject format: `{{PLACEHOLDER}}`

| Placeholder | Type | Description |
|---|---|---|
| `"{{POSITIVE_PROMPT}}"` | string | Prepend prompt + shot tags + LLM prompt + append prompt |
| `"{{NEGATIVE_PROMPT}}"` | string | Negative prompt from settings |
| `"{{SEED}}"` | integer | Resolved numeric seed |
| `"{{WIDTH}}"` | integer | Image width in pixels |
| `"{{HEIGHT}}"` | integer | Image height in pixels |
| `"{{CHECKPOINT}}"` | string | Model filename from the Checkpoint field in settings |
| `"{{STEPS}}"` | integer | Sampling steps (optional override) |
| `"{{CFG}}"` | float | CFG scale (optional override) |
| `"{{SAMPLER}}"` | string | Sampler name (optional override) |
| `"{{SCHEDULER}}"` | string | Scheduler name (optional override) |
| `"{{DENOISE}}"` | float | Denoise strength (optional override) |

### SillyTavern format: `%placeholder%`

Workflows exported from SillyTavern's built-in image generation use this format and work without modification.

| Placeholder | Type | Description |
|---|---|---|
| `"%prompt%"` | string | Equivalent to `{{POSITIVE_PROMPT}}` |
| `"%negative_prompt%"` | string | Equivalent to `{{NEGATIVE_PROMPT}}` |
| `"%seed%"` | integer | Equivalent to `{{SEED}}` |
| `"%width%"` | integer | Equivalent to `{{WIDTH}}` |
| `"%height%"` | integer | Equivalent to `{{HEIGHT}}` |
| `"%checkpoint%"` | string | Equivalent to `{{CHECKPOINT}}` |
| `"%steps%"` | integer | Equivalent to `{{STEPS}}` |
| `"%cfg%"` | float | Equivalent to `{{CFG}}` |
| `"%sampler%"` | string | Equivalent to `{{SAMPLER}}` |
| `"%scheduler%"` | string | Equivalent to `{{SCHEDULER}}` |
| `"%denoise%"` | float | Equivalent to `{{DENOISE}}` |

> Placeholders not present in your workflow are silently ignored. Workflows that hard-code their own sampler settings, checkpoint, or resolution are unaffected by the corresponding ComfyInject settings.

> The quotes are part of the placeholder syntax. In your JSON file, the value field must be the placeholder string in quotes, e.g. `"seed": "{{SEED}}"` or `"seed": "%seed%"`. ComfyInject replaces the entire quoted string — including the quotes — with the correct typed value.

### About `{{CHECKPOINT}}`

Despite the name, this placeholder isn't limited to checkpoint models. It gets replaced with whatever you type into the **Checkpoint** field in the extension settings. If your workflow uses a `UNETLoader`, `DiffusionModelLoader`, or any other node that loads a model by filename, you can use `"{{CHECKPOINT}}"` in that node's model field and type the correct filename into ComfyInject's Checkpoint setting. All ComfyInject does is a text replacement — it doesn't care what type of node receives the value.

### Reusing Placeholders

Each placeholder can appear in **multiple places** across your workflow. Every occurrence will be replaced with the same value. For example, if two nodes in your workflow both need `steps`, you can put `"{{STEPS}}"` in both and they'll both receive the same value from your settings. This works for any placeholder.

---

## Positive Prompt Order

The `{{POSITIVE_PROMPT}}` placeholder is filled with the following components in order, separated by commas:

1. **Prepend Prompt** — custom tags from the Prepend Prompt setting (if set)
2. **Shot Tags** — Danbooru tags for the active shot type (e.g. `close-up, face focus` for CLOSE)
3. **LLM Prompt** — the prompt the LLM wrote in the marker
4. **Append Prompt** — custom tags from the Append Prompt setting (if set)

If resolution or shot lock is active, the locked values are used regardless of what the LLM specified.

---

## Using a Custom Workflow

1. Export your workflow from ComfyUI using **Save (API format)** — not the regular Save.
2. Replace the literal values in your exported JSON with the placeholder strings from the table above.
3. Save the file into this folder.
4. In the ComfyInject extension settings, type your workflow filename into the **Workflow** field. The field validates automatically — you'll see a notification confirming whether the file was found.