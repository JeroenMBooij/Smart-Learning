import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AngularFireAuthGuard, redirectLoggedInTo, redirectUnauthorizedTo } from '@angular/fire/auth-guard';

import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/authentication/login/login.component';
import { DeckOverviewComponent } from './components/decks/deck-overview/deck-overview.component';
import { RegisterComponent } from './components/authentication/register/register.component';
import { RecoverComponent } from './components/authentication/recover/recover.component';
import { ManageAccountComponent } from './components/authentication/manage/manage.component';
import { CreateDeckComponent } from './components/decks/create-deck/create-deck.component';
import { CardEditorComponent } from './components/cards/editor/card-editor/card-editor.component';
import { DeckCardsOverviewComponent } from './components/cards/deck-cards-overview/deck-cards-overview.component';
import { StartLearnDeckComponent } from './components/learning/start-learn-deck/start-learn-deck.component';
import { LearnCardComponent } from './components/learning/learn-card/learn-card.component';
import { LandingpageComponent } from './components/Landing/landingpage/landingpage.component';


const redirectUnauthorizedToInfo = () => redirectUnauthorizedTo(['info']);
const redirectLoggedInToHome = () => redirectLoggedInTo(['/']);

const routes: Routes = [
    {
        path: 'info', 
        component: LandingpageComponent,
        canActivate: [AngularFireAuthGuard],
        data: { authGuardPipe: redirectLoggedInToHome }
    },
    {
        path: 'login', 
        component: LoginComponent,
        canActivate: [AngularFireAuthGuard],
        data: { authGuardPipe: redirectLoggedInToHome }
    },
    {
        path: 'register', 
        component: RegisterComponent,
        canActivate: [AngularFireAuthGuard],
        data: { authGuardPipe: redirectLoggedInToHome }
    },
    {
        path: 'account/recover', 
        component: RecoverComponent,
        canActivate: [AngularFireAuthGuard],
        data: { authGuardPipe: redirectLoggedInToHome }
    },
    {
        path: '', 
        component: HomeComponent,
        children: [
            {
                path: '', 
                component: DeckOverviewComponent,
                canActivate: [AngularFireAuthGuard],
                data: { authGuardPipe: redirectUnauthorizedToInfo }
            },
            {
                path: 'account/management', 
                component: ManageAccountComponent, 
                canActivate: [AngularFireAuthGuard],
                data: { authGuardPipe: redirectUnauthorizedToInfo }
            },
            {
                path: 'deck/create', 
                component: CreateDeckComponent, 
                canActivate: [AngularFireAuthGuard],
                data: { authGuardPipe: redirectUnauthorizedToInfo }
            },
            {
                path: 'deck/:deckId/card/:cardId/editor', 
                component: CardEditorComponent, 
                canActivate: [AngularFireAuthGuard],
                data: { authGuardPipe: redirectUnauthorizedToInfo }
            },
            {
                path: 'deck/:deckId/cards', 
                component: DeckCardsOverviewComponent, 
                canActivate: [AngularFireAuthGuard],
                data: { authGuardPipe: redirectUnauthorizedToInfo }
            },
            {
                path: 'deck/:deckId/cards/learn-overview', 
                component: StartLearnDeckComponent, 
                canActivate: [AngularFireAuthGuard],
                data: { authGuardPipe: redirectUnauthorizedToInfo }
            },
            {
                path: 'deck/:deckId/card/learn', 
                component: LearnCardComponent, 
                canActivate: [AngularFireAuthGuard],
                data: { authGuardPipe: redirectUnauthorizedToInfo }
            }
        ]
    },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
