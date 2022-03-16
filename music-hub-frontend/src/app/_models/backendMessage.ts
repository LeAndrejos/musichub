export interface BackendMessage {
  message_id: string;
  sender: string;
  recipient: string;
  content: string;
  date: Date;
}
