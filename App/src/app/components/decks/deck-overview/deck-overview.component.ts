import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { BACKCARD_SCOPE, CATEGORY_SCOPE, FRONTCARD_SCOPE, TITLE_SCOPE } from 'src/app/common/constants/search.constants';
import { FormFieldValue } from 'src/app/common/interfaces/FormFieldValue.interface';
import { IDeck } from 'src/app/models/collections/decks/deck.interface';
import { SelectionInput } from 'src/app/models/SelectionInput.model';
import { DeckService } from 'src/app/services/deck/deck.service';
import { HelpInfoService } from 'src/app/services/help-info/help-info.service';
import { ThemeService } from 'src/app/services/theme/theme.service';
import { TranslationService } from 'src/app/services/translation/translation.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-deck-overview',
  templateUrl: './deck-overview.component.html',
  styleUrls: ['./deck-overview.component.scss']
})
export class DeckOverviewComponent implements OnInit,  AfterViewInit {

    public decks: Observable<IDeck[]>;
    public filterReview = true;
    public searchForm: FormControl;
    public scopeOptions: SelectionInput[];
    public themeTracker: number;

    public robotState: string;
    public robotPreviousState: string;
    public robotEmote: string;

    constructor(
        private deckService: DeckService,
        public themeService: ThemeService,
        private translationService: TranslationService,
        public his: HelpInfoService,
        private router: Router) { }

    ngOnInit(): void 
    {
        this.decks = this.deckService.getUserDecks();

        this.bootstrapSearch();

        this.themeTracker = 0;
        this.themeService.update.subscribe(theme => 
        {
            if(environment.production == false)
                console.log('deck-card theme subscribed');

            this.themeTracker++;
        });
    }

    ngAfterViewInit(): void 
    {
        window.addEventListener('scroll',  this.stickySearch);
    }

    ngOnDestroy(): void
    {
        window.removeEventListener('scroll',  this.stickySearch);
    }

    public applyFilter(searchTerm: FormFieldValue): void
    {

    }

    public applyReviewFilter(): void
    {
       this.filterReview = !this.filterReview;

       
    }

    public openAddDeck(): void
    {
        this.router.navigate([`/deck/create`]);
    }

    private bootstrapSearch(): void
    {
        this.searchForm = new FormControl(
        { 
            value: { scope: TITLE_SCOPE, query: '' }
        });
        this.translationService.update.subscribe(update => 
        {
            this.scopeOptions = [
                new SelectionInput(this.translationService.get('deck.title'), TITLE_SCOPE),
                new SelectionInput(this.translationService.get('deck.category'), CATEGORY_SCOPE),
                new SelectionInput(this.translationService.get('deck.frontCard'), FRONTCARD_SCOPE),
                new SelectionInput(this.translationService.get('deck.backCard'), BACKCARD_SCOPE)
            ];
        });
        this.searchForm.valueChanges.subscribe((value: FormFieldValue) => 
        { 
            if(environment.production == false)
                console.log('custom search subscribed');
                
            this.applyFilter(value)
        });
    }

    private stickySearch()
    {        
        let offset = window.pageYOffset;
        if(window.pageYOffset > 110)
        {
            offset = 110;
            document.getElementById('hide-search-icon').classList.add('d-none');
        }
        else
        {
            document.getElementById('hide-search-icon').classList.remove('d-none');
        }

        document.documentElement.style.setProperty('--sticky-subheader', `${offset.toString()}px`);
        
    }

}

