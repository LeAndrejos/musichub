export class AttachmentTypeHelper {
  static getResponseType(type: string): string {
    switch (type){
      case 'text':
        return 'text/plain';
      case 'pdf':
        return 'application/pdf';
      case 'mp4':
        return 'video/mp4';
      case 'mp3':
        return 'audio/mpeg';
      case 'wav':
        return 'audio/wav';
      case 'jpeg':
      case 'jpg':
        return 'image/jpeg';
      default:
        return 'unsupported';
    }
  }
}
