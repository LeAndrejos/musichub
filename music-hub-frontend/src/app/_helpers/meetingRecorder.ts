export class MeetingRecorder {

  private mediaRecorder: MediaRecorder;
  private recordedBlobs: Blob[];

  constructor(stream: MediaStream) {
    const options: MediaRecorderOptions = {mimeType: 'video/webm'};
    this.mediaRecorder = new MediaRecorder(stream, options);
  }

  startRecording() {
    this.recordedBlobs = [];
    try {
      this.mediaRecorder.start();
      this.onDataAvailableEvent();
    } catch (err) {
      console.log(err);
    }
  }

  stopRecording() {
    this.mediaRecorder.stop();
  }

  pauseRecording() {
    this.mediaRecorder.pause();
  }

  resumeRecording() {
    this.mediaRecorder.resume();
  }

  getVideoFile(name: string): File {
    return new File([new Blob(this.recordedBlobs, {type: 'video/webm'})], name);
  }

  private onDataAvailableEvent() {
    try {
      this.mediaRecorder.ondataavailable = (event: BlobEvent) => {
        if (event.data && event.data.size > 0) {
          this.recordedBlobs.push(event.data);
        }
      };
    } catch (error) {
      console.log(error);
    }
  }
}
