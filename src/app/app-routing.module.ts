import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from '../components/main/main.component';
import { BoardComponent } from '../components/board/board.component';
import { OnlineBoardComponent } from 'src/components/online-board/online-board.component';
import { MenuComponent } from 'src/components/menu/menu.component';

const routes: Routes = [
    { path: '', redirectTo: '/menu', pathMatch: 'full' },
    { path: 'menu', component: MenuComponent },
    { path: 'mainpage', component: MainComponent },
    { path: 'iframepage', component: BoardComponent },
    { path: 'online/:playerId/:gameId', component: OnlineBoardComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }