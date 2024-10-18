import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MessageType } from 'src/enums/message-type.enum';
import { Message } from 'src/models/message.model';
import { MoveMessage } from 'src/models/move-message.model';
import { MovesDatabaseService } from 'src/services/moves-database.service';

@Component({
  selector: 'app-online-board',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './online-board.component.html',
  styleUrls: ['./online-board.component.scss']
})
export class OnlineBoardComponent implements AfterViewInit {
  @ViewChild('iframe') iframe!: ElementRef<HTMLIFrameElement>;
  playerIframe!: Window;

  gameId!: string;
  gameStarted = false;
  gameFinished = false;
  gameMessage!: string;
  moves: string[] = [];
  playerId!: string;
  showGameCode = false;

  routeSub!: Subscription;
  movesSub!: Subscription;

  constructor (
    private movesDatabaseService: MovesDatabaseService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.router = router;
  }

  ngAfterViewInit() {
    this.playerIframe = this.iframe.nativeElement.contentWindow!;
    this.routeSub = this.route.paramMap.subscribe(params => {
      this.gameId = params.get('gameId')!;
      this.playerId = params.get('playerId')!;
      this.setupBoard(this.playerId);
      this.getMoves();
    });
  }

  @HostListener('window:message', ['$event'])
  onMessage(event: any) {
    this.handleMessage(event);
  }

  handleMessage(event: Event) {
    const message = event as MessageEvent;
    switch (message.data.type) {
      case MessageType.MOVE:
        this.saveMove(message.data.position);
        break;
      case MessageType.CHECKMATE:
        alert("Checkmate! Click on 'Return to Main Menu' to create a new online game.");
        this.gameFinished = true;
        this.gameMessage = 'Game over!';
        break;
    }
  }

  postMessage(window: Window, message: Message) {
    window.postMessage(message, '*');
  }

  setupBoard(playerId: string | null) {
    setTimeout(() => {
      if (playerId === 'playerTwo') {
        this.postMessage(this.playerIframe, new Message(MessageType.REVERSE));
        this.postMessage(this.playerIframe, new Message(MessageType.DISABLE_LIGHT));
      } else {
        this.showGameCode = true;
        this.postMessage(this.playerIframe, new Message(MessageType.DISABLE_DARK));
      }
    }, 2000);
  }

  getMoves() {
    this.movesSub = this.movesDatabaseService.get(this.gameId).subscribe({
      next: moves => {
        this.moves = moves;
        this.showCurrentTurn();
        if (moves.length > 0) {
          if (!this.gameStarted) {
            this.loadGame();
            this.gameStarted = true;
          }
          else {
            this.postMessage(this.playerIframe, new MoveMessage(moves[moves.length - 1]));
          }
        }
      },
      error: error => {
        console.error('Error fetching moves:', error);
      }
    });
  }

  goToMainMenu() {
    this.movesDatabaseService.delete(this.gameId);
    this.router.navigate(['/menu']);
  }

  showCurrentTurn() {
    const evenNumberOfMoves = this.moves.length % 2 === 0;
    if (evenNumberOfMoves && this.playerId === 'playerOne' ||
      !evenNumberOfMoves && this.playerId === 'playerTwo'
    ) {
      this.gameMessage = 'Your turn!';
    } else {
      this.gameMessage = 'Opponent\'s turn!';
    }
  }

  saveMove(position: string) {
    this.movesDatabaseService.add(this.gameId, position);
  }

  loadGame() {
    setTimeout(() => {
      this.moves.forEach(move => this.postMessage(this.playerIframe, new MoveMessage(move)))
    }, 2000);
  }

  ngOnDestroy() {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
    if (this.movesSub) {
      this.movesSub.unsubscribe();
    }
  }
}
