import { predict } from "./tensorflowPredictions";
import {
  EMOTION_PANEL_BG_COLOR,
  EMOTION_PANEL_COLOR,
  SIZE_EMOTION_PANEL,
} from "../Constants/canvas.constant";

const _setRectStyle = (context) => {
  context.lineWidth = 0;
  context.strokeStyle = "transparent";
};

const _drawRect = (context, boundingBox) => {
  // rectangle draw all around the face
  context.beginPath();
  _setRectStyle(context);
  const { x, y, width } = _getRectDim(boundingBox, context);
  const height = boundingBox.height * context.canvas.height;
  context.rect(x, y, width, height);
  context.stroke();
};

const _getFace = (context, boundingBox) => {
  const { x, y, width } = _getRectDim(boundingBox, context);
  const height = boundingBox.height * context.canvas.height;
  return context.getImageData(x, y, width, height);
};
const _setFillStyle = (context, color) => (context.fillStyle = color);

const _getRectDim = (boundingBox, context) => {
  const x = boundingBox.xCenter * context.canvas.width;
  const y = boundingBox.yCenter * context.canvas.height - SIZE_EMOTION_PANEL;
  const width = boundingBox.width * context.canvas.width;
  return { x, y, width };
};

const _drawPanel = (context, boundingBox) => {
  const { x, y, width } = _getRectDim(boundingBox, context);
  context.fillRect(x, y, width * 1.5, SIZE_EMOTION_PANEL);
  const cornerRadius = 10; // Adjust the value to control the roundness

  // Draw rounded corners before filling the rectangle
  context.arc(x + cornerRadius, y + cornerRadius, cornerRadius, Math.PI, 1.5 * Math.PI);
  context.arc(x + width * 1.5 - cornerRadius, y + cornerRadius, cornerRadius, 1.5 * Math.PI, 2 * Math.PI);
  context.arc(x + width * 1.5 - cornerRadius, y + SIZE_EMOTION_PANEL - cornerRadius, cornerRadius, 0, 0.5 * Math.PI);
  context.arc(x + cornerRadius, y + SIZE_EMOTION_PANEL - cornerRadius, cornerRadius, 0.5 * Math.PI, Math.PI);
  
  // Fill the rectangle
  context.fillRect(x, y, width * 1.5, SIZE_EMOTION_PANEL);
  
  // Draw rounded corners after filling the rectangle
  context.arc(x + cornerRadius, y + cornerRadius, cornerRadius, Math.PI, 1.5 * Math.PI, true);
  context.arc(x + width * 1.5 - cornerRadius, y + cornerRadius, cornerRadius, 1.5 * Math.PI, 2 * Math.PI, true);
  context.arc(x + width * 1.5 - cornerRadius, y + SIZE_EMOTION_PANEL - cornerRadius, cornerRadius, 0, 0.5 * Math.PI, true);
  context.arc(x + cornerRadius, y + SIZE_EMOTION_PANEL - cornerRadius, cornerRadius, 0.5 * Math.PI, Math.PI, true);
  
};

const _setFont = (context) => (context.font = SIZE_EMOTION_PANEL + "px serif");

const _drawText = (context, text, boundingBox) => {
  const { x, y, width } = _getRectDim(boundingBox, context);
  context.fillStyle = EMOTION_PANEL_COLOR;
  context.textBaseline = "middle";
  context.textAlign = "center";
  context.font = SIZE_EMOTION_PANEL * 0.3 + "px serif"; // Adjust the font size as desired
  context.fillText(text, x + width / 1.2, y + SIZE_EMOTION_PANEL / 2);
};


const _drawEmotionPanel = (context, boundingBox, prediction) => {
  _setFillStyle(context, EMOTION_PANEL_BG_COLOR);
  _drawPanel(context, boundingBox);
  _setFont(context);
  _setFillStyle(context, EMOTION_PANEL_COLOR);
  _drawText(context, prediction, boundingBox);
};

const _isBoundingBoxPositive = (boundingBox) =>
  boundingBox.xCenter > 0 &&
  boundingBox.yCenter > 0 &&
  boundingBox.width > 0 &&
  boundingBox.height > 0;

const _clearCanvas = (context) =>
  context.clearRect(0, 0, context.canvas.width, context.canvas.height);

const _drawImage = (video, context) =>
  context.drawImage(video, 0, 0, context.canvas.width, context.canvas.height);

const _drawPrediction = (context, bb, emotionRecognizer, state) =>
  _drawEmotionPanel(
    context,
    bb,
    predict(emotionRecognizer, state, _getFace(context, bb))
  );

const drawOnCanvas = (
  state,
  context,
  video,
  boundingBox,
  emotionRecognizer
) => {
  _clearCanvas(context);
  _drawImage(video, context);
  for (let bb of boundingBox) {
    // recuperation of all values into boundingBox (coordinate of face)
    _drawRect(context, bb);
    // recuperation of face only if boundingBox has valuable coordinates
    if (_isBoundingBoxPositive(bb) && state.isModelSet) {
      _drawPrediction(context, bb, emotionRecognizer, state);
    }
  }
};

export default drawOnCanvas;
