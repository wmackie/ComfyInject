import { handleComfyGen } from "./parse.js";

export function initObserver() {
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (!(node instanceof HTMLElement)) continue;

                if (node.classList?.contains("mes")) {
                    scanMessage(node);
                }
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

function scanMessage(messageNode) {
    const content = messageNode.innerHTML;

    if (content.includes("<COMFYGEN")) {
        handleComfyGen(messageNode);
    }
}