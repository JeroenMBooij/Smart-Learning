import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { DARK_THEME_BACK_COLOR, DARK_THEME_COLOR, LIGHT_THEME_BACK_COLOR, LIGHT_THEME_COLOR } from 'src/app/common/constants/theme.constants';
import { IDeckWithStats } from 'src/app/models/collections/decks/deck-with-stats.interface';
import { DeckService } from 'src/app/services/deck/deck.service';
import { ThemeService } from 'src/app/services/theme/theme.service';
import { TranslationService } from 'src/app/services/translation/translation.service';
import { environment } from 'src/environments/environment';
import { IGaugeData } from '../../shared/charts/gauge-chart/gauge-data.model';
import { SnackBarComponent } from '../../shared/snack-bar/snack-bar.component';

@Component({
  selector: 'app-start-learn-deck',
  templateUrl: './start-learn-deck.component.html',
  styleUrls: ['./start-learn-deck.component.scss']
})
export class StartLearnDeckComponent implements OnInit 
{
    public deckId: string;
    public deck: Observable<IDeckWithStats>;
    public learningAvailable: boolean;
    public gaugeData: BehaviorSubject<IGaugeData>;


    public robotState: string;
    public robotPreviousState: string;
    public robotEmote: string;

    constructor(
        private deckService: DeckService,
        private themeService: ThemeService,
        private translationService: TranslationService,
        private router: Router,
        private route: ActivatedRoute,
        private snackbar: MatSnackBar) { }

    ngOnInit(): void 
    {
        this.deckId = this.route.snapshot.paramMap.get('deckId');
        this.deck = this.deckService.getDeck(this.deckId) as Observable<IDeckWithStats>;
        this.deck.subscribe(deck => {
            if (environment.production == false)
                console.log('current deck subscribed');

            if (!deck)
            {
                this.snackbar.openFromComponent(SnackBarComponent, {
                    data: `${this.translationService.get('input.invalid')} ${this.translationService.get('signpost.deck')}`,
                    duration: 5000,
                    panelClass: ['mat-toolbar', 'mat-accent']
                });

                //navigate to home page
                this.router.navigate(['']);
                return;
            }

            this.learningAvailable = deck.cardsDue == 0 || deck.cardsDue == undefined
        });
        this.bootstrapGauge();
    }

    public startLearningCards(): void
    {
        if(this.learningAvailable)
        {

        }
    }

    public bootstrapGauge(): void
    {
        this.gaugeData = new BehaviorSubject({} as IGaugeData);
        this.gaugeData.value.progress = 30;
        this.gaugeData.value.leftover = 30;
        this.gaugeData.value.colors = [LIGHT_THEME_COLOR, '#ffffff'];

        this.themeService.update.subscribe(theme => 
        {
            let colors: string[];
            switch(theme)
            {
                case 'light-theme':
                    colors = [LIGHT_THEME_COLOR, LIGHT_THEME_BACK_COLOR]
                    break;

                case 'dark-theme':
                    colors = [DARK_THEME_COLOR, DARK_THEME_BACK_COLOR]
                    break;
            }

            this.gaugeData.next({...this.gaugeData.value, colors: colors});
        })
    }

}
