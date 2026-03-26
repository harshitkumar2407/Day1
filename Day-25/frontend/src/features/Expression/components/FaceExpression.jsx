import { useEffect, useRef, useState } from "react";
// import {
//     FaceLandmarker,
//     FilesetResolver
// } from "@mediapipe/tasks-vision";

import { detect, init } from "../utiles/utils";

export default function FaceExpression() {
  const videoRef = useRef(null);
  const landmarkerRef = useRef(null);
  const animationRef = useRef(null);
  const streamRef = useRef(null);

  const [expression, setExpression] = useState("Detecting...");

  useEffect(() => {
    // let stream;

    init({ landmarkerRef, videoRef, streamRef });

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }

      if (landmarkerRef.current) {
        landmarkerRef.current.close();
      }

      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div style={{ textAlign: "center" }}>
      <video
        ref={videoRef}
        style={{ width: "400px", borderRadius: "12px" }}
        playsInline
      />
      <h2>{expression}</h2>
      <button
        onClick={() =>
          detect({ landmarkerRef, videoRef, setExpression, animationRef })
        }
      >
        detect expression
      </button>
    </div>
  );
}
