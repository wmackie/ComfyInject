export function handleComfyGen(messageNode) {
    const genElement = messageNode.querySelector("comfygen");

    if (!genElement) return;

    const prompt = genElement.getAttribute("prompt");
    const ar = genElement.getAttribute("ar");
    const shot = genElement.getAttribute("shot");
    const seed = genElement.getAttribute("seed");

    console.log("COMFYGEN detected:", { prompt, ar, shot, seed });

    // TEMP: replace with placeholder
    genElement.outerHTML = `<div class="img-status">[Generating image...]</div>`;
}