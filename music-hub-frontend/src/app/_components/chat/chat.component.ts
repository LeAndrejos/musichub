import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ChatAdapter} from 'ng-chat';
import {UserChatAdapter} from '@app/_components/chat/UserChatAdapter';
import {AccountService} from '@app/_services';
import {CourseService} from '@app/_services/course.service';
import {ChatService} from '@app/_services/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.less']
})
export class ChatComponent implements OnInit, OnDestroy {
  userId: string;
  title = 'Chat';
  @Input() courseId: string;

  constructor(private accountService: AccountService, private courseService: CourseService, private chatService: ChatService) {
  }

  public adapter: ChatAdapter;

  ngOnInit(): void {
    this.chatService.startChat();
    this.userId = this.accountService.userValue.userId;
    this.adapter = new UserChatAdapter(this.courseService, this.courseId, this.chatService, this.accountService);
  }

  ngOnDestroy(): void {
    this.chatService.stopChat();
  }

}
