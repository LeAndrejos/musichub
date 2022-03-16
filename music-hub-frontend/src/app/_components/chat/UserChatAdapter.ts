// tslint:disable-next-line:max-line-length
import {
  ChatAdapter,
  IChatGroupAdapter,
  Group,
  Message,
  ChatParticipantStatus,
  ParticipantResponse,
  ChatParticipantType,
  IChatParticipant
} from 'ng-chat';
import {Observable, of} from 'rxjs';
import {delay, map} from 'rxjs/operators';
import {CourseService} from '@app/_services/course.service';
import {User} from '@app/_models';
import {ChatService} from '@app/_services/chat.service';
import {AccountService} from '@app/_services';
import {BackendMessage} from '@app/_models/backendMessage';

export class UserChatAdapter extends ChatAdapter implements IChatGroupAdapter {

  constructor(private courseService: CourseService, private courseId: string,
              private chatService: ChatService, private accountService: AccountService) {
    super();
    chatService.chatAdapter = this;
  }

  listFriends(): Observable<ParticipantResponse[]> {
    return this.courseService.getUsersForCourse(this.courseId, true).pipe((map(users => {
      console.log(users);
      return users.map((user: User) => {
        const participantResponse = new ParticipantResponse();

        participantResponse.participant = {
          participantType: ChatParticipantType.User,
          id: user.userId,
          displayName: user.username,
          avatar: 'https://media.istockphoto.com/vectors/user-icon-flat-isolated-on-white-background-user-symbol-vector-vector-id1300845620?b=1&k=20&m=1300845620&s=170667a&w=0&h=JbOeyFgAc6-3jmptv6mzXpGcAd_8xqkQa_oUK2viFr8=',
          status: ChatParticipantStatus.Online
        };
        return participantResponse;
      });
    })));
  }

  getMessageHistory(destinataryId: any): Observable<Message[]> {
    return this.chatService.getHistory(this.accountService.userValue.userId, destinataryId).pipe((map(messages => {
      console.log(messages);
      return messages.map((message: BackendMessage) => {
        return {
          fromId: message.sender,
          toId: message.recipient,
          message: message.content,
          dateSent: message.date
        };
      });
    })));
  }

  sendMessage(message: Message): void {
    console.log(message.dateSent);
    this.chatService.sendMessage(message);
  }

  groupCreated(group: Group): void {}
}
