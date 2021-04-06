import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {MessageComponent} from './components/message/message.component';
import {GameListComponent} from './components/game-list/game-list.component';
import {AuthorizationComponent} from './components/authorization/authorization.component';

const routes: Routes = [
  {path: '', redirectTo: 'games', pathMatch: 'full'},
  {path: 'games', component: GameListComponent},
  {path: 'message', component: MessageComponent},
  {path: 'auth', component: AuthorizationComponent},
  {path: '**', redirectTo: 'games', pathMatch: 'full'}
];;

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents = [MessageComponent, GameListComponent]
