import OBR from "@owlbear-rodeo/sdk";

const THROTTLE_TIME = 300;
const SIDEBAR_WIDTH = 200; // Replace with your actual sidebar width

export function throttle(callback: () => void, delay: number): () => void
{
    let lastTime = 0;
    return function ()
    {
        const now = new Date().getTime();
        if (now - lastTime >= delay)
        {
            callback();
            lastTime = now;
        }
    };
}

async function handleResize()
{
    const resizedWidth = window.innerHeight / 2 + SIDEBAR_WIDTH;
    await OBR.action.setWidth(resizedWidth);
}

export function addResizeListener()
{
    const throttledResize = throttle(handleResize, THROTTLE_TIME);
    handleResize(); // Initial resize

    window.addEventListener("resize", throttledResize);

    return function removeResizeListener()
    {
        window.removeEventListener("resize", throttledResize);
    };
}

//Usage
//const removeResizeListener = addResizeListener();

// If you want to remove the resize listener at some point, call:
// removeResizeListener();
