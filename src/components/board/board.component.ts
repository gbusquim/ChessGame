import { Component, HostListener, ViewChild } from '@angular/core';
import { NgxChessBoardModule, NgxChessBoardView} from 'ngx-chess-board';

import { Message } from '../../models/message.model';
import { MoveMessage } from '../../models/move-message.model';
import { MessageType } from '../../models/message-types.enum';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [NgxChessBoardModule],
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent {
  @ViewChild('board', {static: false}) board!: NgxChessBoardView;

  id!: string;
  size = 420;
  lightDisabled = false;
  darkDisabled = false;

  @HostListener('window:message', ['$event'])
  onMessage(event: any) {
      this.handleMessage(event);
  }

  handleMessage(event: Event) {
    const message = event as MessageEvent;
    switch (message.data.type) {
      case MessageType.DISABLEDARK:
        this.darkDisabled = true;
        break;
      case MessageType.DISABLELIGHT:
        this.lightDisabled = true;
        break;
      case MessageType.SETID:
        this.id = message.data.id;
        break;
      case MessageType.MOVE:
        this.board.move(message.data.position);
        break;
      case MessageType.REVERSE:
        this.board.reverse();
        break;
      case MessageType.RESET:
        this.board.reset();
        break;
    }
  }

  moveCallback(position: any): void {
    parent.postMessage(new MoveMessage(position.move, this.id), location.origin);
    if (position.checkmate) {
      parent.postMessage(new Message(MessageType.CHECKMATE, this.id), location.origin);
    }
  }
}
