import { Component, Input, OnInit, SimpleChange } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { IDeckWithStats } from 'src/app/models/collections/decks/deck-with-stats.interface';
import { ThemeService } from 'src/app/services/theme/theme.service';

@Component({
  selector: 'deck-card',
  templateUrl: './deck-card.component.html',
  styleUrls: ['./deck-card.component.scss']
})
export class DeckCardComponent implements OnInit {
    

    @Input()
    public deck: IDeckWithStats;

    @Input()
    public themeTracker: number;

    @Input()
    public scale = true;

    @Input()
    public imageSource: string;
    
    public defaultImageSource: string;
    public imageSourceAvailable: boolean = false;

    public id: string;

    constructor(
        private router: Router,
        private themeService: ThemeService) { }

    ngOnInit(): void 
    {
        this.setDefaultTypeBackgroundImage();
        this.setimageSource();
    }

    ngOnChanges(changes: SimpleChange) {
        let propKey = Object.keys(changes)[0];

        switch(propKey)
        {
            case 'themeTracker':
                this.setDefaultTypeBackgroundImage();
                break;
            case 'imageSource':
                this.setimageSource();
                break;
        }
        
    }

    public openLearnCards()
    {
        if(this.scale)
            this.router.navigate([`/deck/${this.deck.id}/cards/learn-overview`]);
    }

    public openDeck()
    {
        if(this.scale)
            this.router.navigate([`/deck/${this.deck.id}/cards`]);
    }

    private setimageSource()
    {
        this.imageSourceAvailable = Object.keys(this.imageSource ?? {}).length != 0
        if (this.imageSourceAvailable)
        {
            let prefix = `url('`
            let postfix = `')`
            this.imageSource = `${prefix}${this.imageSource}${postfix}`;
            this.imageSourceAvailable = true;
        }
    }

    private setDefaultTypeBackgroundImage(): void
    {
        let prefix = `url('`
        let postfix = `')`
        let path = '/assets/images/deck/';
        let random = Math.round(Math.random() * (4 - 1) + 1);

        switch(random)
        {
            case 1:
                this.defaultImageSource = `${prefix}${path}${this.themeService.themeMath.value ?? ''}${postfix}`;
                break;
            case 2:
                this.defaultImageSource = `${prefix}${path}${this.themeService.themeWriting.value ?? ''}${postfix}`;
                break;                        
            case 3:
                this.defaultImageSource = `${prefix}${path}${this.themeService.themeReading.value ?? ''}${postfix}`;
                break;                        
            case 4:
                this.defaultImageSource = `${prefix}${path}${this.themeService.themeCustom.value ?? ''}${postfix}`;
                break;
        }
    }

}
