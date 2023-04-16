import OBR from "@owlbear-rodeo/sdk";
import { ICurrentTurnUnit } from "./interfaces/current-turn-unit";

export class ViewportFunctions
{
    /**
     * Center the current OBR viewport on an image
     * @param {import("@owlbear-rodeo/sdk").Image} item - The image item
     */
    static async CenterViewportOnImage(ctu: ICurrentTurnUnit)
    {
        const dpi = await OBR.scene.grid.getDpi();
        const scale = await OBR.viewport.getScale();
        const viewportWidth = await OBR.viewport.getWidth();
        const viewportHeight = await OBR.viewport.getHeight();
        const viewportCenter = { x: viewportWidth / 2, y: viewportHeight / 2 };
        // Scale the viewport center to match the items coordinate space
        const relativeViewportCenter = {
            x: viewportCenter.x / scale,
            y: viewportCenter.y / scale,
        };

        const imageCenter = await this.GetImageCenter(ctu, dpi);
        // Offset the image to find out what viewport position would center it
        const center = {
            x: imageCenter.x - relativeViewportCenter.x,
            y: imageCenter.y - relativeViewportCenter.y,
        };

        // Scale and invert the position to match the viewport's offset direction
        const position = {
            x: center.x * scale * -1,
            y: center.y * scale * -1,
        };

        await OBR.viewport.animateTo({
            position,
            scale,
        });
    }

    /**
     * Get the center for an OBR image
     * @param {import("@owlbear-rodeo/sdk").Image} item - The image item
     * @param {number} dpi - The base DPI of the scene
     * @returns {import("@owlbear-rodeo/sdk").Vector2}
     */
    static async GetImageCenter(ctu: ICurrentTurnUnit, dpi: number)
    {
        const dpiScale = dpi / ctu.dpi;
        const width = ctu.width * dpiScale;
        const height = ctu.height * dpiScale;
        const offsetX = (ctu.offsetx / ctu.width) * width;
        const offsetY = (ctu.offsety / ctu.height) * height;
        return {
            x: ctu.xpos - offsetX + width / 2,
            y: ctu.ypos - offsetY + height / 2,
        };
    }
}
