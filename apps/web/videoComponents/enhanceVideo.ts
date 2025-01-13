export default async function enhanceVideoTrack(
  videoTrack: MediaStreamTrack,
  brightness: number = 1.5 // Start with brightness adjustment only
): Promise<MediaStreamTrack> {
  // Ensure the track is of type 'video'
  if (videoTrack.kind !== "video") {
    throw new Error("Provided track is not a video track.");
  }

  // Create a video element and set its source to the provided video track
  const videoElement = document.createElement("video");
  videoElement.srcObject = new MediaStream([videoTrack]);
  videoElement.muted = true; // Mute the video to avoid audio feedback

  document.body.appendChild(videoElement); // Attach to DOM for visibility

  await videoElement.play();

  // Create a canvas element to capture the video frames
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Failed to get 2D context from canvas.");
  }

  // Set up the canvas dimensions once the video is ready
  await new Promise<void>((resolve) => {
    videoElement.onloadedmetadata = () => {
      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;
      resolve();
    };
  });

  // Function to process and enhance the frames
  function processFrame(): void {
    if (!context) return;
    context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

    const frame = context.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = frame.data;

    // Apply brightness adjustment to each pixel
    for (let i = 0; i < pixels.length; i += 4) {
      // @ts-ignore
      pixels[i] = Math.min(255, pixels[i] * brightness); // Red
      // @ts-ignore
      pixels[i + 1] = Math.min(255, pixels[i + 1] * brightness); // Green
      // @ts-ignore
      pixels[i + 2] = Math.min(255, pixels[i + 2] * brightness); // Blue
    }

    context.putImageData(frame, 0, 0);
  }

  // Capture the processed frames from the canvas as a new video stream
  const processedStream = canvas.captureStream();
  const processedTrack = processedStream.getVideoTracks()[0];

  // Continuously process frames to enhance the video in real-time
  const frameInterval = setInterval(processFrame, 1000 / 30); // 30 FPS

  // Handle stopping the track and cleanup

  if (processedTrack) {
    console.log("Processed track available.");
    processedTrack.onended = () => {
      clearInterval(frameInterval);
      videoElement.srcObject = null;
      videoElement.remove();
      canvas.remove();
    };
    return processedTrack;
  } else {
    console.log("No processed track available.");
    return videoTrack;
  }
}
