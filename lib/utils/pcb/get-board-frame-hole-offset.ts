import { applyToPoint, type Matrix } from "transformation-matrix"

/**
 * Maps a plated hole's drill offset into the board frame.
 *
 * `holeOffsetX`/`holeOffsetY` are a direction (mm) in the same frame as the
 * hole's own `pcbX`/`pcbY`, usually footprint-local. Circuit JSON consumers
 * (SVG, Gerber drill, DRC) add `hole_offset_*` directly to the board-frame hole
 * center, so the offset must follow the parent's rotation and layer flip. As a
 * direction it picks up no translation. The hole's own `pcbRotation` is not
 * applied: inflated Circuit JSON already stores offsets in the parent frame.
 */
export const getBoardFrameHoleOffset = ({
  parentTransform,
  holeOffsetX,
  holeOffsetY,
}: {
  parentTransform: Matrix
  holeOffsetX?: number
  holeOffsetY?: number
}): { hole_offset_x?: number; hole_offset_y?: number } => {
  if (holeOffsetX === undefined && holeOffsetY === undefined) {
    return { hole_offset_x: holeOffsetX, hole_offset_y: holeOffsetY }
  }
  const origin = applyToPoint(parentTransform, { x: 0, y: 0 })
  const offsetEnd = applyToPoint(parentTransform, {
    x: holeOffsetX ?? 0,
    y: holeOffsetY ?? 0,
  })
  return {
    hole_offset_x: offsetEnd.x - origin.x,
    hole_offset_y: offsetEnd.y - origin.y,
  }
}
