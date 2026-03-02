# ComfyInject

Automatically generates ComfyUI images from `[[IMG: ...]]` markers in SillyTavern.

## Requirements
- SillyTavern
- Local ComfyUI instance

## Installation
1. Clone this repo into your SillyTavern extensions folder.
2. Reload SillyTavern.
3. Configure ComfyUI host in extension settings.

## Usage
Have your model output:
[[IMG: danbooru tags | AR | SHOT | SEED]]

The extension will:
- Generate the image via ComfyUI
- Replace the marker with the rendered image
- Inject a compact `[IMGID:...]` token into LLM context for visual consistency

## Workflows
Place workflow JSON files in the `workflows/` folder.
A default minimal workflow will be provided in a future release.