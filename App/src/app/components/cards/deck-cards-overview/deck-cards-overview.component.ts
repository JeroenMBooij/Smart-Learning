import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { CREATE } from 'src/app/common/constants/angular.constants';
import { ALL_SCOPE, BACKCARD_SCOPE, CARDNAME_SCOPE, FRONTCARD_SCOPE } from 'src/app/common/constants/search.constants';
import { FormFieldValue } from 'src/app/common/interfaces/FormFieldValue.interface';
import { ICard } from 'src/app/models/collections/cards/card.model';
import { IDeckIdentity } from 'src/app/models/collections/decks/deck-identity.interface';
import { IDeck } from 'src/app/models/collections/decks/deck.interface';
import { SelectionInput } from 'src/app/models/SelectionInput.model';
import { CardService } from 'src/app/services/card/card.service';
import { DeckService } from 'src/app/services/deck/deck.service';
import { ThemeService } from 'src/app/services/theme/theme.service';
import { TranslationService } from 'src/app/services/translation/translation.service';
import { environment } from 'src/environments/environment';
import { SnackBarComponent } from '../../shared/snack-bar/snack-bar.component';

@Component({
  selector: 'app-deck-cards-overview',
  templateUrl: './deck-cards-overview.component.html',
  styleUrls: ['./deck-cards-overview.component.scss']
})
export class DeckCardsOverviewComponent implements OnInit, AfterViewInit
{
    public deckId: string;
    public deck: BehaviorSubject<IDeck> = new BehaviorSubject(null);

    public searchForm: FormControl;
    public scopeOptions: SelectionInput[];
    public cardDataSource: MatTableDataSource<ICard>;
    public selectedCardId: string;
    public selectedCard: BehaviorSubject<ICard> = new BehaviorSubject(null);
    public displayedColumns: string[] = ['name', 'settings', 'edit'];
    
    public deckIdentities: Observable<IDeckIdentity[]>;
    public deckIDS: IDeckIdentity[];
    public selectedDeckID: IDeckIdentity;
    public dropDownConfig: any;

    public frontFrameSource: string = "";
    public backFrameSource: string = "";

    @ViewChild('paginator') paginator: MatPaginator;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private deckService: DeckService,
        private cardService: CardService,
        private translationService: TranslationService,
        public themeService: ThemeService,
        private snackbar: MatSnackBar) { }

    ngOnInit(): void 
    {
        this.deckId = this.route.snapshot.paramMap.get('deckId');
        
        this.bootstrapDeckDropdown();

        this.cardDataSource = new MatTableDataSource([]);
        this.switchDeck(this.deckId, false);

        this.bootstrapSearch();

        this.selectedCard.subscribe(selectedCard => 
        {
            this.selectedCardId = selectedCard?.id ?? "";
            this.frontFrameSource = selectedCard?.frontFrameSource ?? "";
            this.backFrameSource = selectedCard?.backFrameSource ?? "";
        });
    }

    ngAfterViewInit(): void
    {
        this.cardDataSource.paginator = this.paginator;
    }

    public previewCard(cardId: string): void
    {
        this.cardService.getCard(this.deckId, cardId).subscribe(card => 
        {
            this.selectedCard.next(card);
        });
        
    }

    public openCardSettings(cardId: string): void
    {

    }

    public openCardEditor(cardId: string): void
    {
        this.router.navigate([`/deck/${this.deckId}/card/${cardId}/editor`]);
    }

    public applyFilter(value: FormFieldValue): void
    {
        this.cardDataSource.filter = value.query;
    }

    public openNewCard(): void
    {
        this.router.navigate([`/deck/${this.deckId}/card/${CREATE}/editor`]);
    }

    public switchDeck(deckId: string, update: boolean = true): void
    {
        this.deckService.getDeck(deckId).subscribe(deck =>
        {
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

            this.deck.next(deck);
            this.deckId = deckId;
            this.selectedDeckID = this.deckIDS.find(deckIdentity => deckIdentity.id == deckId);
            if (update)
                history.pushState({}, null, `/deck/${deckId}/cards`);
        });

        this.cardService.getDeckCards(deckId).subscribe(cards =>
        {
            if(environment.production == false)
                console.log('subscribed to deck cards');

            this.cardDataSource.data = cards;
        });

        this.selectedCard.next(null);
    }

    private bootstrapDeckDropdown(): void
    {
        this.deckIdentities = this.deckService.getDeckIdentities();

        this.deckIdentities.subscribe(deckIds => {
            if(environment.production == false)
                console.log("deck ids subscribed");
            
            this.deckIDS = deckIds;
            this.selectedDeckID = deckIds.find(deckIdentity => deckIdentity.id == this.deckId);
        });

        this.dropDownConfig = this.themeService.getDropdownSettings('title');
    }

    private bootstrapSearch(): void
    {
        this.searchForm = new FormControl(
        { 
            value: { scope: ALL_SCOPE, query: '' }
        });
        this.scopeOptions = [
            new SelectionInput(this.translationService.get('input.all'), ALL_SCOPE),
            new SelectionInput(this.translationService.get('card.name'), CARDNAME_SCOPE),
            new SelectionInput(this.translationService.get('card.frontCard'), FRONTCARD_SCOPE),
            new SelectionInput(this.translationService.get('card.backCard'), BACKCARD_SCOPE),
        ];
        this.searchForm.valueChanges.subscribe((value: FormFieldValue) => 
        { 
            if(environment.production == false)
                console.log('custom search subscribed');
                
            this.applyFilter(value)
        });
    }

    

}
