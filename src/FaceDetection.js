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

export {
    detectFace
}