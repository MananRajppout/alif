import React, { useRef, useEffect, useState } from "react";

interface VideoEnhancerProps {
  mediaStream: MediaStream;
}

const VideoEnhancer: React.FC<VideoEnhancerProps> = ({ mediaStream }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const enhancedVideoRef = useRef<HTMLVideoElement | null>(null);
  const [enhancedStream, setEnhancedStream] = useState<MediaStream | null>(
    null
  );
  const [enhanceBool, setEnhanceBool] = useState<boolean>(true);

  useEffect(() => {
    if (!mediaStream) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const enhancedVideo = enhancedVideoRef.current;

    if (!video || !canvas || !enhancedVideo) return;

    console.log("Initializing video enhancer...");

    // Set the video source to the provided media stream
    video.srcObject = mediaStream;

    video.onloadedmetadata = () => {
      console.log("Video metadata loaded, playing original video");
      video.play().catch((error) => {
        console.error("Error playing original video:", error);
      });
    };

    // Draw the video frames on canvas and manipulate the pixels
    const context = canvas.getContext("2d");

    // const histogramEqualization = (data: Uint8ClampedArray) => {
    //   const histogram = new Array(256).fill(0);
    //   for (let i = 0; i < data.length; i += 4) {
    //     histogram[data[i]]++;
    //     histogram[data[i + 1]]++;
    //     histogram[data[i + 2]]++;
    //   }

    //   // Calculate the cumulative distribution function (CDF)
    //   const cdf = histogram.slice();
    //   for (let i = 1; i < cdf.length; i++) {
    //     cdf[i] += cdf[i - 1];
    //   }

    //   // Normalize the CDF
    //   const cdfMin = cdf[0];
    //   const cdfMax = cdf[cdf.length - 1];
    //   for (let i = 0; i < cdf.length; i++) {
    //     cdf[i] = ((cdf[i] - cdfMin) / (cdfMax - cdfMin)) * 255;
    //   }

    //   // Apply the equalization
    //   for (let i = 0; i < data.length; i += 4) {
    //     data[i] = cdf[data[i]];
    //     data[i + 1] = cdf[data[i + 1]];
    //     data[i + 2] = cdf[data[i + 2]];
    //   }
    // };
    // const enhanceSharpness = (
    //   data: Uint8ClampedArray,
    //   width: number,
    //   height: number
    // ) => {
    //   const kernel = [-1, -1, -1, -1, 9, -1, -1, -1, -1];
    //   const tempData = new Uint8ClampedArray(data);
    //   for (let y = 1; y < height - 1; y++) {
    //     for (let x = 1; x < width - 1; x++) {
    //       let sumR = 0,
    //         sumG = 0,
    //         sumB = 0;
    //       for (let ky = -1; ky <= 1; ky++) {
    //         for (let kx = -1; kx <= 1; kx++) {
    //           const offset = ((y + ky) * width + (x + kx)) * 4;
    //           const weight = kernel[(ky + 1) * 3 + (kx + 1)];
    //           sumR += tempData[offset] * weight;
    //           sumG += tempData[offset + 1] * weight;
    //           sumB += tempData[offset + 2] * weight;
    //         }
    //       }
    //       const idx = (y * width + x) * 4;
    //       data[idx] = Math.min(Math.max(sumR, 0), 255);
    //       data[idx + 1] = Math.min(Math.max(sumG, 0), 255);
    //       data[idx + 2] = Math.min(Math.max(sumB, 0), 255);
    //     }
    //   }
    // };
    const reduceNoise = (data: Uint8ClampedArray) => {
      // Simple box blur for noise reduction
      for (let i = 0; i < data.length; i += 4) {
        // @ts-ignore
        data[i] = (data[i] + data[i + 4] + data[i - 4]) / 3; // Red
        // @ts-ignore
        data[i + 1] = (data[i + 1] + data[i + 5] + data[i - 3]) / 3; // Green
        // @ts-ignore
        data[i + 2] = (data[i + 2] + data[i + 6] + data[i - 2]) / 3; // Blue
      }
    };
    const adjustGamma = (data: Uint8ClampedArray, gamma: number) => {
      const gammaCorrection = 1 / gamma;
      for (let i = 0; i < data.length; i += 4) {
        // @ts-ignore
        data[i] = 255 * Math.pow(data[i] / 255, gammaCorrection); // Red
        // @ts-ignore
        data[i + 1] = 255 * Math.pow(data[i + 1] / 255, gammaCorrection); // Green
        // @ts-ignore
        data[i + 2] = 255 * Math.pow(data[i + 2] / 255, gammaCorrection); // Blue
      }
    };

    const adjustVideo = () => {
      if (!context || !video) return;
      if (enhanceBool == false) return;

      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Apply brightness, contrast, gamma, noise reduction, and sharpness
      const brightness = 50;
      const contrast = 1.1;
      const gamma = 0.9;

      // Basic brightness and contrast
      for (let i = 0; i < data.length; i += 4) {
        // @ts-ignore
        data[i] = data[i] + brightness;
        // @ts-ignore
        data[i + 1] = data[i + 1] + brightness;
        // @ts-ignore
        data[i + 2] = data[i + 2] + brightness;
        // @ts-ignore
        data[i] = (data[i] - 128) * contrast + 128;
        // @ts-ignore
        data[i + 1] = (data[i + 1] - 128) * contrast + 128;
        // @ts-ignore
        data[i + 2] = (data[i + 2] - 128) * contrast + 128;
      }

      // Apply additional enhancements
      adjustGamma(data, gamma);
      reduceNoise(data);
      // enhanceSharpness(data, canvas.width, canvas.height);
      // histogramEqualization(data);

      context.putImageData(imageData, 0, 0);

      requestAnimationFrame(adjustVideo);
    };

    video.addEventListener("play", adjustVideo);

    // Wait until the video is playing before capturing the stream
    video.onplay = () => {
      console.log("Original video is playing, capturing enhanced stream...");

      // Capture the enhanced video stream from the canvas
      const captureStream = canvas.captureStream();
      setEnhancedStream(captureStream);
      enhancedVideo.srcObject = captureStream;

      enhancedVideo.onloadedmetadata = () => {
        console.log("Enhanced video metadata loaded");
        enhancedVideo
          .play()
          .then(() => {
            console.log("Playing enhanced video");
          })
          .catch((error) => {
            console.error("Error playing enhanced video:", error);
          });
      };
    };

    // Clean up on component unmount
    return () => {
      video.removeEventListener("play", adjustVideo);

      video.srcObject = null;
      enhancedVideo.srcObject = null;
      setEnhancedStream(null);
      setEnhanceBool(false);
    };
  }, [mediaStream]);

  return (
    <div className="w-full h-full">
      {/* Original video element used for capturing frames */}
      <video ref={videoRef} style={{ display: "none" }} muted />
      {/* Canvas used for manipulating video frames */}
      <canvas
        ref={canvasRef}
        style={{ display: "none" }}
        width={1280}
        height={720}
      />
      {/* Video element to display the enhanced video stream */}
      <video
        ref={enhancedVideoRef}
        autoPlay
        muted
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "10px",
        }}
      />
    </div>
  );
};

export default VideoEnhancer;
