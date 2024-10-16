import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {
  router: Router;

  constructor(router: Router) {
    this.router = router;
  }

  goToLocalGame() {
    this.router.navigate(['/mainpage']);
  }

  goToOnlineGame() {}
}
