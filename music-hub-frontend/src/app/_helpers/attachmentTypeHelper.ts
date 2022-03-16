export class AttachmentTypeHelper {
  static getResponseType(type: string): string {
    switch (type){
      case 'text':
        return 'text/plain';
      case 'pdf':
        return 'application/pdf';
      case 'mp4':
        return 'video/mp4';
    }
  }
}
