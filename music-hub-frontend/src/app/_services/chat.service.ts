import {Injectable, OnDestroy} from '@angular/core';
import {environment} from '@environments/environment';
import {AccountService} from '@app/_services/account.service';
import {UserChatAdapter} from '@app/_components/chat/UserChatAdapter';
import {ChatParticipantStatus, Message, User} from 'ng-chat';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {BackendMessage} from '@app/_models/backendMessage';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  connection: WebSocket;
  chatAdapter: UserChatAdapter;
  pingPongId: any;

  constructor(private accountService: AccountService, private http: HttpClient) {
    this.initializeConnection();
  }

  private initializeConnection() {
    this.connection = new WebSocket(environment.chatUrl);
    this.connection.onopen = () => {
      console.log('Connection opened!');
    };
    this.connection.onclose = () => {
      console.log('Connection closed!');
      this.initializeConnection();
    };

    this.connection.onmessage = (msg) => {
      const data = JSON.parse(msg.data);
      const message = data.data;
      console.log('Got message:', data.data);
      if (message.toId === this.accountService.userValue.userId) {
        this.accountService.getUserById(message.fromId).subscribe(u => {
          const user = new User();
          user.id = u.userId;
          user.avatar = 'https://media.istockphoto.com/vectors/user-icon-flat-isolated-on-white-background-user-symbol-vector-vector-id1300845620?b=1&k=20&m=1300845620&s=170667a&w=0&h=JbOeyFgAc6-3jmptv6mzXpGcAd_8xqkQa_oUK2viFr8=';
          user.status = ChatParticipantStatus.Away;
          user.displayName = u.username;
          this.chatAdapter.onMessageReceived(user, message);
        });
      }
    };
  }

  startChat() {
    this.pingPongId = setInterval(() => this.sendPingMessage(), 5000);
  }

  sendMessage(message: Message) {
    this.connection.send(JSON.stringify({
      event: 'chat',
      data: message
    }));
  }

  getHistory(sender: string, recipient: string): Observable<BackendMessage[]> {
    return this.http.get<BackendMessage[]>(`${environment.apiUrl}/message/history?users=${sender},${recipient}`);
  }

  private sendPingMessage() {
    this.connection.send('ping');
  }

  stopChat() {
    if (this.pingPongId) {
      clearInterval(this.pingPongId);
    }
  }

}
