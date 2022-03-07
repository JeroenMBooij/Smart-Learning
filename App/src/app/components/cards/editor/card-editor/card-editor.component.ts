import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { promise } from 'protractor';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { CREATE } from 'src/app/common/constants/angular.constants';
import { CARD_TYPES } from 'src/app/common/constants/card.constants';
import { SelectionDialogComponent } from 'src/app/components/shared/selection-dialog/selection-dialog.component';
import { SnackBarComponent } from 'src/app/components/shared/snack-bar/snack-bar.component';
import { ICard } from 'src/app/models/collections/cards/card.model';
import { IDeckIdentity } from 'src/app/models/collections/decks/deck-identity.interface';
import { IDeck } from 'src/app/models/collections/decks/deck.interface';
import { SelectionInput } from 'src/app/models/SelectionInput.model';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { CardService } from 'src/app/services/card/card.service';
import { DeckService } from 'src/app/services/deck/deck.service';
import { TranslationService } from 'src/app/services/translation/translation.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-card-editor',
  templateUrl: './card-editor.component.html',
  styleUrls: ['./card-editor.component.scss']
})
export class CardEditorComponent implements OnInit
{
    public deckIdentities: Observable<IDeckIdentity[]>;
    public currentDeck: Observable<IDeck>;
    public card: Observable<ICard>;
    public testsub: Subscription;
    public test2sub: Subscription;
    public deckId: string;
    public cardId: string;
    public unsavedChanges: boolean = false;

    public cardDescriptionForm  = new FormGroup({
        name : new FormControl('',[
          Validators.required,
        ])
    });

    get name() { return this.cardDescriptionForm.get('name') }

    constructor(
        private deckService: DeckService,
        private cardService: CardService,
        private translationService: TranslationService,
        private authService: AuthenticationService,
        private router: Router,
        private route: ActivatedRoute,
        private dialog: MatDialog,
        private snackbar: MatSnackBar) { }

    async ngOnInit(): Promise<void>
    {
        this.deckId = this.route.snapshot.paramMap.get('deckId');
        this.route.params.subscribe(params => {
            this.cardId = params["cardId"];
        });

        this.currentDeck = this.deckService.getDeck(this.deckId);
        this.currentDeck.subscribe(deck =>
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
            }
        });

        this.deckIdentities = this.deckService.getDeckIdentities();

        await this.setCard();
    }

    public saveCardName(): void
    {
        if (this.name.value != '')
            this.cardService.updateCardName(this.deckId, this.cardId, this.name.value);
    }

    private async setCard(): Promise<void>
    {
        if (this.cardId == CREATE)
        {   
            let options: SelectionInput[] = [];
            CARD_TYPES.forEach(option => 
            {
                let selectionOption = new SelectionInput(`deck.cardTypes.${option.toLowerCase().replace(' ', '')}`, option.toLowerCase());
                options.push(selectionOption);
            });

            let dialogReference = this.dialog.open(SelectionDialogComponent, 
            {
                width: "600px",
                data: 
                { 
                    title: `${this.translationService.get('signpost.new')} ${this.translationService.get('signpost.card')}`,
                    message: this.translationService.get('card.selectCardType'),
                    selectionLabel: this.translationService.get('card.type'),
                    options: options,
                    optional: false
                }
            });

            await new Promise(resolve => 
            {
                dialogReference.afterClosed().subscribe(async result => 
                {
                    let newCard = {} as ICard;
                    newCard.id = CREATE;
                    newCard.name = `${this.translationService.get('signpost.card')} ${(Math.floor(Math.random() * 1000000)) + 1}`
                    newCard.type = result.content;
                    newCard.lastEditedBy = this.authService.userId.value;
                    this.cardId = await this.cardService.saveCard(this.deckId, newCard);
                    this.card = this.cardService.getCard(this.deckId, this.cardId);

                    history.pushState({}, null, `/deck/${this.deckId}/card/${this.cardId}/editor`);
                    resolve(true);
                });
            });
        }
        else
        {
            this.card = this.cardService.getCard(this.deckId, this.cardId);
        }

        this.testsub = this.card.subscribe(card =>
        {
            if(environment.production == false)
                console.log("firebase card subscribed");
                
            if(!card)
            {
                this.snackbar.openFromComponent(SnackBarComponent, {
                    data: `${this.translationService.get('input.invalid')} ${this.translationService.get('signpost.card')}`,
                    duration: 5000,
                    panelClass: ['mat-toolbar', 'mat-accent']
                });
                //navigate to home page
                this.router.navigate(['']);
                return;
            }

            this.name.setValue(card.name);
        },
        error => console.log(error),
        () =>
        {
            console.log('why');
        });

        this.testsub.add(() => {
            console.log('why');
        });
    }

}
