'use client'
import {useEffect, useRef, useState} from "react";

import * as React from 'react';
import {start} from "node:repl";

type Props = {
  classNames?: string,

  imageData: IAnnotatedImageModel,

  selectedLabelId: number
  selectLabel: (id: number) => void,

  drawMode: boolean,
  endDrawMode: (selectId:number) => void,

  viewMode: boolean,

  emitMoveEntry: () => void,
}

const canvasResolution = 900;
const inferenceResolution = 300;

interface IPoint {
  x:number,
  y:number
}

const CanvasImageUi: React.FC<Props> = (
    {
      classNames = '',
      imageData,

      selectedLabelId,
      selectLabel,

      drawMode,
      endDrawMode,

      viewMode,

      emitMoveEntry
    }
) => {
  const cv = useRef<HTMLCanvasElement | null>(null);
  const [activeLabel, setActiveLabel] = useState<number>(selectedLabelId);

  const [aspectRatio, setAspectRatio] = useState<number>(0);

  const [newBoundingBox, setNewBoundingBox] = useState<IAnnotationBox | null>(null);

  useEffect(() => {
    // set new active Label from parent
    setActiveLabel(selectedLabelId);
  }, [selectedLabelId]);

  useEffect(() => {
    const boxIdx = getBoxIdxById(selectedLabelId);
    if (boxIdx !== false) {
      keepBoundaries(boxIdx);
    }
    drawBoundingBoxes();
    if (selectLabel) selectLabel(activeLabel);
  }, [activeLabel]);

  useEffect(() => {
    drawBoundingBoxes();
    if (!imageData.paths) return;

    const img = new Image();
    img.onload = () => {
      const ratio = img.width / img.height;
      setAspectRatio(ratio);
    }
    img.src = imageData.paths.thumbnail;

  }, [imageData]);

  const getCanvasContext = (): CanvasRenderingContext2D | null => {
    if (!cv.current) return null;
    const canvas = cv.current;
    return canvas.getContext('2d');
  }

  const drawBoundingBoxes = () => {
    const ctx = getCanvasContext();
    if (!ctx) return;

    ctx.clearRect(0, 0, canvasResolution, canvasResolution);

    ctx.textAlign = "left";
    ctx.strokeStyle = drawMode ? '#e9e9e9' : '#0079D1';
    ctx.fillStyle = drawMode ? '#e9e9e9' : '#0079D1';
    ctx.lineWidth = drawMode ? 1 : 2;

    ctx.textRendering = "optimizeSpeed";
    ctx.font = "20px sans-serif";

    for (let anno of imageData.annotations) {

      if (!anno.active || (anno.id === activeLabel)) continue;

      const box = scaleBoxData(anno.box);
      ctx.strokeRect(
          box.x, box.y,
          box.width, box.height
      );

      if (!drawMode && !viewMode) drawLabel(ctx, box, anno.label);
    }

    if (activeLabel > -1) {
      ctx.strokeStyle = '#EC4BB5';
      ctx.fillStyle = '#EC4BB5';
      ctx.lineWidth = 4;

      const selectedAnnotation = getBoxById(activeLabel);
      if (!selectedAnnotation) return;

      const box = scaleBoxData(selectedAnnotation.box);


      if (pressed) {
        ctx.fillStyle = 'rgba(236,75,181,0.3)';
        ctx.fillRect(
            box.x, box.y,
            box.width, box.height
        )
        ctx.fillStyle = '#EC4BB5';
      }
      ctx.strokeRect(
          box.x, box.y,
          box.width, box.height
      )

      drawDragHandle(ctx, box);
      if(!viewMode) drawLabel(ctx, box, selectedAnnotation.label);
    }

    // drawing
    if (drawMode && newBoundingBox) {
      ctx.strokeStyle = '#FF773D';
      ctx.fillStyle = 'rgba(255,119,61,0.3)'
      ctx.lineWidth = 4;
      ctx.fillRect(newBoundingBox.x, newBoundingBox.y, newBoundingBox.width, newBoundingBox.height);
      ctx.strokeRect(newBoundingBox.x, newBoundingBox.y, newBoundingBox.width, newBoundingBox.height);
    }
  }

  const getBoxIdxById = (id: number) => {
    for (let x in imageData.annotations) {
      if (imageData.annotations[x].id === id) return parseInt(x);
    }
    return false;
  }

  const getBoxById = (id: number) => {
    for (let x in imageData.annotations) {
      if (imageData.annotations[x].id === id) return imageData.annotations[x];
    }
    return false;
  }

  const scaleBoxData = (box: IAnnotationBox, upScale = true): IAnnotationBox => {
    const scaleFactor = upScale ? canvasResolution / inferenceResolution : inferenceResolution / canvasResolution;

    return {
      x: Math.floor(box.x * scaleFactor),
      y: Math.floor(box.y * scaleFactor),
      width: Math.floor(box.width * scaleFactor),
      height: Math.floor(box.height * scaleFactor),
    } as IAnnotationBox;
  }

  const drawDragHandle = (ctx: CanvasRenderingContext2D, box: IAnnotationBox) => {
    // center move handle
    const center = [Math.floor(box.x + (box.width / 2)), Math.floor(box.y + (box.height / 2))];
    ctx.beginPath();
    ctx.arc(center[0], center[1], 5, 0, 2 * Math.PI);
    ctx.fill();

    const handleSize = 5;

    // draw side resize
    ctx.beginPath();
    ctx.arc(box.x, center[1], handleSize, Math.PI / 2, (3 * Math.PI) / 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(box.x + box.width, center[1], handleSize, (3 * Math.PI) / 2, Math.PI / 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(center[0], box.y + box.height, handleSize, 0, Math.PI);
    ctx.fill();

    // draw edge resize
    ctx.beginPath();
    ctx.arc(box.x, box.y + box.height, handleSize, 0, 2 * Math.PI);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(box.x + box.width, box.y + box.height, handleSize, 0, 2 * Math.PI);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(box.x + box.width, box.y, handleSize, 0, 2 * Math.PI);
    ctx.fill();
  }

  const drawLabel = (ctx: CanvasRenderingContext2D, box: IAnnotationBox, label: string) => {

    const metrics = ctx.measureText(label);
    const textWidth = metrics.width;
    const textHeight = parseInt(ctx.font, 10);

    const textClipsTop = (box.y < 2 * textHeight);

    const padding = [8, 6];
    const rectX = box.x;
    const rectY = textClipsTop ? box.y : box.y - textHeight - (2 * padding[1]);
    const rectWidth = textWidth + (2 * padding[0]);
    const rectHeight = textHeight + (2 * padding[1]);
    ctx.fillRect(rectX, rectY, rectWidth, rectHeight);

    const textPos = [box.x + 5, textClipsTop ? box.y + textHeight : box.y - 10];

    ctx.fillStyle = "#ffffff";
    ctx.fillText(label, textPos[0], textPos[1]);
    ctx.fillStyle = '#0079D1';

  }

  const [pressed, setPressed] = useState<boolean>(false);
  const [selectedIdx, setSelectedIdx] = useState<number>(-1);
  const [startPoint, setStartPoint] = useState<IPoint | null>(null);
  const [boxStart, setBoxStart] = useState<IAnnotationBox | null>(null);
  const [moveType, setMoveType] = useState<number>(-1);

  const [cursor, setCursor] = useState<string>('cursor-default');

  useEffect(() => {
    // redraw on release
    if (!pressed) {
      drawBoundingBoxes();
    }
  }, [pressed]);

  useEffect(() => {
    // redraw on release
    drawBoundingBoxes();
  }, [drawMode, viewMode]);

  const cvInteraction = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (pressed) return;

    const padding = 10;

    const startPoint = getRelMousePos(event);
    setStartPoint(startPoint);
    setPressed(true);

    // draw mode enabled just creates new bounding box in newBoundingBox
    const scaledDownStart = scaleBoxData({
      x: startPoint.x,
      y: startPoint.y,
      width: 0,
      height: 0
    });
    setNewBoundingBox(scaledDownStart);

    // logic for manipulating selected box on canvas:
    const selectedAnnoIdx = getBoxIdxById(activeLabel);
    if (selectedAnnoIdx === false) return;

    // check if mouse is still in or around selected box
    const mouseBoundingSelectedRange = getClickedBoxes(startPoint, padding);
    const idArray = mouseBoundingSelectedRange.map(elm => {
      return elm.id;
    });

    // set no annotation to active when current box is not within the boxes under click position
    if (idArray.length == 0 || !idArray.includes(activeLabel)) {
      setActiveLabel(-1);
      return;
    }
    setSelectedIdx(selectedAnnoIdx);
    const currentAnnotation = imageData.annotations[selectedAnnoIdx];

    currentAnnotation.edited = true;

    // decide on movement
    const selBox = structuredClone(currentAnnotation.box);
    const scaledBox = scaleBoxData(selBox);

    const moveType = getMoveType(startPoint, scaledBox, padding);
    setMoveType(moveType)

    setBoxStart(selBox);
  }

  const cvDrag = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!pressed || !startPoint) return;

    const mousePos = getRelMousePos(event);
    const moveOffset = {
      x: mousePos.x - startPoint.x,
      y: mousePos.y - startPoint.y,
    } as IAnnotationBox;

    // scale Offset down
    const scaledOffset = scaleBoxData(moveOffset, false);

    if (drawMode && newBoundingBox) {
      setNewBoundingBox({
        x: startPoint.x,
        y: startPoint.y,
        width: moveOffset.x,
        height: moveOffset.y
      });
      drawBoundingBoxes();
      return;
    }

    // manipulate box position data
    if (!boxStart || selectedIdx < 0 || moveType < 0) return;
    switch (moveType) {
      case 1: // top right corner
        setCursor('cursor-ne-resize');
        imageData.annotations[selectedIdx].box.width = boxStart.width + scaledOffset.x;
        imageData.annotations[selectedIdx].box.height = boxStart.height - scaledOffset.y;
        imageData.annotations[selectedIdx].box.y = boxStart.y + scaledOffset.y;
        break;

      case 2: // right side
        setCursor('cursor-e-resize');
        imageData.annotations[selectedIdx].box.width = boxStart.width + scaledOffset.x;
        break;

      case 3: // bottom right corner
        setCursor('cursor-se-resize');
        imageData.annotations[selectedIdx].box.width = boxStart.width + scaledOffset.x;
        imageData.annotations[selectedIdx].box.height = boxStart.height + scaledOffset.y;
        break;

      case 4: // bottom side
        setCursor('cursor-s-resize');
        imageData.annotations[selectedIdx].box.height = boxStart.height + scaledOffset.y;
        break;

      case 5: // bottom left corner
        setCursor('cursor-sw-resize');
        imageData.annotations[selectedIdx].box.height = boxStart.height + scaledOffset.y;
        imageData.annotations[selectedIdx].box.width = boxStart.width - scaledOffset.x;
        imageData.annotations[selectedIdx].box.x = boxStart.x + scaledOffset.x;
        break;

      case 6: // left side
        setCursor('cursor-w-resize');

        imageData.annotations[selectedIdx].box.x = boxStart.x + scaledOffset.x;
        imageData.annotations[selectedIdx].box.width = boxStart.width - scaledOffset.x;
        break;

      default: // movement
        setCursor('cursor-grabbing');

        imageData.annotations[selectedIdx].box.x = scaledOffset.x + boxStart.x;
        imageData.annotations[selectedIdx].box.y = scaledOffset.y + boxStart.y;
        break;
    }

    keepBoundaries(selectedIdx);

    drawBoundingBoxes();
  }

  const cvEndInteraction = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!pressed || !startPoint) return;

    const mouseLeavePos = getRelMousePos(event);
    const tempStartPoint = startPoint;
    const moveOffset = {
      x: mouseLeavePos.x - tempStartPoint.x,
      y: mouseLeavePos.y - tempStartPoint.y
    } as IPoint;

    // Reset move variables
    setStartPoint(null);
    setCursor('cursor-default');
    setBoxStart(null);
    setSelectedIdx(-1);
    setMoveType(-1);
    setPressed(false);

    // check if movement or click
    const moveDelta = Math.sqrt(Math.pow(moveOffset.x, 2) + Math.pow(moveOffset.y, 2));
    if (moveDelta < 2) {
      if (!drawMode) checkBoxClick(mouseLeavePos);
    }else {
      if (!drawMode) emitMoveEntry();
    }

    if (!drawMode) return;

    // end Drawing if newBoudingBox valid
    setNewBoundingBox(null);

    // create new entry
    const newEntryId = getNextFreeId();
    const newAnnotation = {
      label: "New label",
      score: 1,
      id: newEntryId,
      box: scaleBoxData({
        x: (moveOffset.x < 0) ? tempStartPoint.x + moveOffset.x : tempStartPoint.x,
        y: (moveOffset.y < 0) ? tempStartPoint.y + moveOffset.y : tempStartPoint.y,
        width: Math.abs(moveOffset.x),
        height: Math.abs(moveOffset.y)
      }, false),
      active: true,
      edited: true
    } as IAnnotationModel;

    imageData.annotations = [newAnnotation].concat(imageData.annotations)

    endDrawMode(newEntryId);

  }

  const getMoveType = (point: IPoint, box: IAnnotationBox, pad: number): number => {
    const {x, y, width, height} = box;
    const withinPad = (a: number, b: number) => a > b - pad && a < b + pad;

    // Top right (corner)
    if (withinPad(point.x, x + width) && withinPad(point.y, y)) return 1;

    // Right side
    if (withinPad(point.x, x + width) && point.y > y + 2 * pad && point.y < y + height - 2 * pad) return 2;

    // Bottom right (corner)
    if (withinPad(point.x, x + width) && withinPad(point.y, y + height)) return 3;

    // Bottom side
    if (point.x > x + 2 * pad && point.x < x + width - 2 * pad && withinPad(point.y, y + height)) return 4;

    // Bottom left (corner)
    if (withinPad(point.x, x) && withinPad(point.y, y + height)) return 5;

    // Left side
    if (withinPad(point.x, x) && point.y > y + 2 * pad && point.y < y + height - 2 * pad) return 6;

    return 0;
  };

  const getRelMousePos = (event: React.MouseEvent<HTMLCanvasElement>): IPoint => {
    const canvasPos = (event.target as HTMLCanvasElement).getBoundingClientRect();
    const x = (event.pageX - (canvasPos.x + window.scrollX));
    const y = (event.pageY) - (canvasPos.y + window.scrollY);
    return {x: x, y: y} as IPoint;
  }

  const getClickedBoxes = (p: IPoint, padding = 0) => {
    const intersectionArray: IAnnotationModel[] = [];

    for (let anno of imageData.annotations) {
      if (!anno.active) continue;
      const box = scaleBoxData(anno.box);
      if (p.x > box.x - padding && p.x < box.x + box.width + padding) {
        if (p.y > box.y - padding && p.y < box.y + box.height + padding) {
          intersectionArray.push(anno);
        }
      }
    }
    return intersectionArray;
  }

  const getNextFreeId = () => {
    if (imageData.annotations.length < 1) return 1;
    const idArray = imageData.annotations.map(elm => elm.id);
    return Math.max(...idArray) + 1;
  }

  const checkBoxClick = (p: IPoint) => {
    const intersectionArray = getClickedBoxes(p);

    if (intersectionArray.length < 1) {
      // Deselect if not currently selected
      setActiveLabel(-1);
      return;
    }


    if (intersectionArray.length == 1) {
      setActiveLabel(intersectionArray[0].id);
      return;
    }

    // mehrere Boxen überlappen -> Selecte die am naehesten zum Mittelpunk
    let bestMatch = 0;
    let shortestDistance = canvasResolution;
    for (let interAnno of intersectionArray) {
      const box = scaleBoxData(interAnno.box);
      const centerX = box.x + (box.width / 2);
      const centerY = box.y + (box.height / 2);
      const distance = Math.sqrt(Math.pow(centerX - p.x, 2) + Math.pow(centerY - p.y, 2));
      if (distance < shortestDistance) {
        bestMatch = interAnno.id;
        shortestDistance = distance;
      }
    }
    setActiveLabel(bestMatch);
  }

  const keepBoundaries = (indx: number) => {
    const annotation = imageData.annotations[indx];
    if (!annotation) return;

    const box = annotation.box;

    const minSize = 10;

    const maxWidth = (aspectRatio < 1) ? Math.floor(aspectRatio * inferenceResolution) : inferenceResolution;
    const maxHeight = (aspectRatio < 1) ? inferenceResolution : Math.floor(inferenceResolution / aspectRatio);

    const xOffset = (aspectRatio < 1) ? Math.floor((inferenceResolution - maxWidth) / 2) : 0;
    const yOffset = (aspectRatio < 1) ? 0 : Math.floor((inferenceResolution - maxHeight) / 2);

    if (box.width > maxWidth) {
      imageData.annotations[indx].box.width = maxWidth;
      box.width = maxWidth;
    }
    if (box.width < minSize) {
      imageData.annotations[indx].box.width = minSize;
      box.width = minSize;
    }
    if (box.height > maxHeight) {
      imageData.annotations[indx].box.height = maxHeight;
      box.height = maxHeight;
    }
    if (box.height < minSize) {
      imageData.annotations[indx].box.height = minSize;
      box.height = minSize;
    }

    if (box.x <= xOffset) {
      imageData.annotations[indx].box.x = xOffset + 1;
    }
    if (box.x + box.width > inferenceResolution - xOffset) {
      imageData.annotations[indx].box.x = inferenceResolution - xOffset - box.width;
    }
    if (box.y <= yOffset) {
      imageData.annotations[indx].box.y = yOffset + 1;
    }
    if (box.y + box.height > inferenceResolution - yOffset) {
      imageData.annotations[indx].box.y = inferenceResolution - yOffset - box.height;
    }
  }


  return imageData.paths && <div className="relative !w-[900px] flex-grow-0 flex-shrink-0 !h-[900px] overflow-hidden rounded-xl custom-box-shadow hover:custom-box-shadow-active transition-[box-shadow] duration-300">
      <img src={imageData.paths.original}
          className={'w-full h-full top-0 left-0 absolute z-[2] object-contain'}
           style={{imageOrientation: 'from-image'}}
          alt="Background image"
      />
      <canvas
          className={`${classNames} ${cursor} overflow-hidden block absolute top-0 left-0 z-[5] w-full h-full`}
          ref={cv}
          width={canvasResolution}
          height={canvasResolution}
          onMouseDown={(ev) => cvInteraction(ev)}
          onMouseMove={(ev) => cvDrag(ev)}
          onMouseUp={(ev) => cvEndInteraction(ev)}
          onMouseLeave={(ev) => cvEndInteraction(ev)}
      ></canvas>
  </div>
}

export default CanvasImageUi;