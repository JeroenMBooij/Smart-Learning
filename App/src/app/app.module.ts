import { environment } from 'src/environments/environment';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAnalyticsModule } from '@angular/fire/analytics';

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AUTHENTICATION_API_BASE_URL } from './services/authentication/authentication-client.generated';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';

import { MaterialModule } from './common/modules/material.module';
import { ReactiveModule } from './common/modules/reactive.module';
import { MonacoEditorModule } from 'ngx-monaco-editor';

import { RegisterComponent } from './components/authentication/register/register.component';
import { LoginComponent } from './components/authentication/login/login.component';
import { DeckOverviewComponent } from './components/decks/deck-overview/deck-overview.component';
import { MainButtonComponent } from './components/shared/main-button/main-button.component';
import { ThemeSwitchComponent } from './components/shared/theme-switch/theme-switch.component';
import { LanguageSwitchComponent } from './components/shared/language-switch/language-switch.component';
import { RecoverComponent } from './components/authentication/recover/recover.component';
import { ConfirmationDialogComponent } from './components/shared/confirmation-dialog/confirmation-dialog.component';
import { ManageAccountComponent } from './components/authentication/manage/manage.component';
import { HomeComponent } from './components/home/home.component';
import { DevToolComponent } from './components/development/dev-tool/dev-tool.component';
import { CreateDeckComponent } from './components/decks/create-deck/create-deck.component';
import { RobotComponent } from './components/shared/three/robot/robot.component';
import { GlLodComponent } from './components/shared/three/gl-lod/gl-lod.component';
import { InputDialogComponent } from './components/shared/input-dialog/input-dialog.component';
import { DeckCardComponent } from './components/decks/deck-card/deck-card.component';
import { CustomWebEditorComponent } from './components/cards/editor/options/custom-web-editor/custom-web-editor.component';
import { CardEditorComponent } from './components/cards/editor/card-editor/card-editor.component';
import { SelectionDialogComponent } from './components/shared/selection-dialog/selection-dialog.component';
import { DeckCardsOverviewComponent } from './components/cards/deck-cards-overview/deck-cards-overview.component';
import { CustomSearchInputComponent } from './components/shared/custom-search-input/custom-search-input.component';
import { StartLearnDeckComponent } from './components/learning/start-learn-deck/start-learn-deck.component';
import { GaugeChartComponent } from './components/shared/charts/gauge-chart/gauge-chart.component';
import { LearnCardComponent } from './components/learning/learn-card/learn-card.component';
import { FrontCardComponent } from './components/cards/card-displays/front-card/front-card.component';
import { BackCardComponent } from './components/cards/card-displays/back-card/back-card.component';
import { LandingpageComponent } from './components/Landing/landingpage/landingpage.component';
import { TeamsOverviewComponent } from './components/teams/teams-overview/teams-overview.component';
import { DIDAC_API_BASE_URL } from './services/didac/didac-client.generated';
import { DrawComponent } from './components/shared/draw/draw.component';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    DeckOverviewComponent,
    MainButtonComponent,
    ThemeSwitchComponent,
    LanguageSwitchComponent,
    RecoverComponent,
    ConfirmationDialogComponent,
    ManageAccountComponent,
    HomeComponent,
    DevToolComponent,
    CreateDeckComponent,
    RobotComponent,
    GlLodComponent,
    InputDialogComponent,
    DeckCardComponent,
    CustomWebEditorComponent,
    CardEditorComponent,
    SelectionDialogComponent,
    DeckCardsOverviewComponent,
    CustomSearchInputComponent,
    StartLearnDeckComponent,
    GaugeChartComponent,
    LearnCardComponent,
    FrontCardComponent,
    BackCardComponent,
    LandingpageComponent,
    TeamsOverviewComponent,
    DrawComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAnalyticsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      registrationStrategy: 'registerWhenStable:30000'
    }),
    HttpClientModule,
    TranslateModule.forRoot({
        loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
        }
    }),
    MaterialModule,
    ReactiveModule,
    MonacoEditorModule.forRoot()
  ],
  providers: [
      { provide: AUTHENTICATION_API_BASE_URL, useValue: environment.authenticationClient.baseUrl },
      { provide: DIDAC_API_BASE_URL, useValue: environment.didacClient.baseUrl }
    ],
  bootstrap: [AppComponent]
})

export class AppModule { }


export function HttpLoaderFactory (http: HttpClient): TranslateHttpLoader
{
    return new TranslateHttpLoader(http);
}