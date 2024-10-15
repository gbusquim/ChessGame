import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from '../components/main/main.component';
import { BoardComponent } from '../components/board/board.component';

const routes: Routes = [
    { path: '', redirectTo: '/mainpage', pathMatch: 'full' },
    { path: 'mainpage', component: MainComponent },
    { path: 'iframepage', component: BoardComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }