import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';

import { MessageType } from '../../enums/message-type.enum';
import { PlayerId } from '../../enums/player-id.enum';
import { Message } from '../../models/message.model';
import { MoveMessage } from '../../models/move-message.model';
import { SetIdMessage } from '../../models/setId-message.model';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})

export class MainComponent {
  @ViewChild('iframe1') iframe1!: ElementRef<HTMLIFrameElement>;
  playerOneIframe!: Window;

  @ViewChild('iframe2') iframe2!: ElementRef<HTMLIFrameElement>;
  playerTwoIframe!: Window;

  gameReady: boolean = false;
  gameFinished: boolean = false;
  playerOneTurn!: boolean;

  ngAfterViewInit(): void {
    this.playerOneIframe = this.iframe1.nativeElement.contentWindow!;
    this.playerTwoIframe = this.iframe2.nativeElement.contentWindow!;
    this.startGame();
  }

  @HostListener('window:message', ['$event'])
  onMessage(event: any) {
    this.handleMessage(event);
  }

  handleMessage(event: Event) {
    const message = event as MessageEvent;
    switch (message.data.type) {
      case MessageType.MOVE:
        this.broadcastMoveMessage(message.data);
        break;
      case MessageType.CHECKMATE:
        if (!this.gameFinished) {
          alert("Checkmate! Click on 'Create New Game' to start a new game.");
          this.gameFinished = true;
        }
      break;
    }
  }

  broadcastMoveMessage(message: any) { 
    const moveMessage = new MoveMessage(message.position);

    if (this.gameReady) {
      let positions = JSON.parse(localStorage.getItem("positions")!);
      positions.push(message.position);
      localStorage.setItem("positions", JSON.stringify(positions));
    }

    if (message.source == PlayerId.PLAYER_ONE_ID) {
      this.postMessage(this.playerTwoIframe, moveMessage);
      this.playerOneTurn = false;
    } else {
      this.postMessage(this.playerOneIframe, moveMessage);   
      this.playerOneTurn = true;
    }
  }

  postMessage(window: Window, message: Message) {
    window.postMessage(message, '*');
  }

  startGame() {
    setTimeout(() => {
      this.postMessage(this.playerTwoIframe, new Message(MessageType.DISABLE_LIGHT));
      this.postMessage(this.playerOneIframe, new Message(MessageType.DISABLE_DARK));
      this.postMessage(this.playerOneIframe, new SetIdMessage(PlayerId.PLAYER_ONE_ID));
      this.postMessage(this.playerTwoIframe, new SetIdMessage(PlayerId.PLAYER_TWO_ID));
      this.postMessage(this.playerTwoIframe, new Message(MessageType.REVERSE));

      let positions = JSON.parse(localStorage.getItem("positions") || "[]");
      if (!positions.length) {
        localStorage.setItem("positions", "[]");
        this.playerOneTurn = true;
        this.gameReady = true;
      }
      else 
        this.loadPreviousGame(positions);
    }, 2000);
  }

  resetGame() {
    localStorage.setItem("positions", "[]");
    this.gameFinished = false;
    this.playerOneTurn = true;
    this.postMessage(this.playerOneIframe, new Message(MessageType.RESET));
    this.postMessage(this.playerTwoIframe, new Message(MessageType.RESET));
    this.postMessage(this.playerTwoIframe, new Message(MessageType.REVERSE));
  }

  loadPreviousGame(positions: string[]) {
    this.gameReady = false;
    positions.forEach((position) => {
      this.postMessage(this.playerOneIframe, new MoveMessage(position));
      this.postMessage(this.playerTwoIframe, new MoveMessage(position));
   });
    setTimeout(() => {
      if (positions.length % 2 === 0) {
        this.playerOneTurn = true;
      } else {
        this.playerOneTurn = false;
      }
      this.gameReady = true;
    }, 2000);
  }
}
