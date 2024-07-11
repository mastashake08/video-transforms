async function detectFace(config = {
    face_detection_options: {
        // (Optional) Hint to try and limit the amount of detected faces
        // on the scene to this maximum number.
        maxDetectedFaces: 5,
        // (Optional) Hint to try and prioritize speed over accuracy
        // by, e.g., operating on a reduced scale or looking for large features.
        fastMode: false
      },
      cb: (frame) => {console.log(frame)}
}) {
    const faceDetector = new FaceDetector(config.face_detection_options);
      try {
        const transformer = new TransformStream({
            async transform(videoFrame, controller) {
                const newFrame = videoFrame.clone();
                const faces = await faceDetector.detect(newFrame);
                faces.forEach(face => config.cb(face));
                videoFrame.close();
                controller.enqueue(newFrame);
            },
          });
          return transformer;
      } catch (e) {
        console.error('Face detection failed:', e);
      }
}

const grabFrames = new TransformStream({
  start(controller) {
    this.videoFrames = []
   
  },
  transform(videoFrame, controller) {
    try {
      const frame = videoFrame.clone()
      videoFrame.close()
      
      this.videoFrames.push(frame);
      const evt = new Event('frame-grab', {frame: frame});
      document.dispatchEvent(evt);
      controller.enqueue(frame);
    } catch (error) {
      console.error(error);
    }
    },
    flush(controller) {
      const evt = new Event('frame-grab-complete', {frames: frames});
      document.dispatchEvent(evt);
    }
});
export {
    detectFace,
    grabFrames
}