
import React from "react";

type videoOnCanvasProps = {
  canvasRef: any,
  webcamRef: any,
  constraints: any,
};

const VideoOnCanvas = (props: videoOnCanvasProps) => (
  <div>
    <canvas
      ref={props.canvasRef}
      width={1920}
      height={1080}
      style={{ objectFit: "cover" }}
      className="canvas"
    />
   <video
      audio={false}
      width={1920}
      height={1080}
      mirrored={true}
      ref={props.webcamRef}
      videoConstraints={props.constraints}
      style={{ display: "none" }}
    />
  </div>
);
export default VideoOnCanvas;
