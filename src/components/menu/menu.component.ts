import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {
  router: Router;
  showInputJoinGame: boolean = false;
  gameId!: string;

  constructor(router: Router) {
    this.router = router;
  }

  goToLocalGame() {
    this.router.navigate(['/mainpage']);
  }

  createOnlineGame() {
    const randomGameId = Math.floor(10000 + Math.random() * 90000);
    this.router.navigate(['online','playerOne', randomGameId]);
  }

  showGameCodeInput() {
    this.showInputJoinGame = true;  
  }

  joinOnlineGame() {
    this.router.navigate(['online','playerTwo', this.gameId]);
  }
}
