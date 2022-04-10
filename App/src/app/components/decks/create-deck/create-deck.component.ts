import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DECK_DEFAULT_AGAIN, DECK_DEFAULT_DEFAULT_EASE_MODIFIER, DECK_DEFAULT_EASE_BONUS, DECK_DEFAULT_EASE_PENALTY, DECK_DEFAULT_EASY, DECK_DEFAULT_FEEDBACKOPTION, DECK_DEFAULT_GOOD, DECK_DEFAULT_HARD, DECK_DEFAULT_INTERVAL_MODIFIER, DECK_DEFAULT_LEARNING_STEPS } from 'src/app/common/constants/deck.constants';
import { ROBOT_DEATH_STATE, ROBOT_WALKING_STATE, ROBOT_DANCE_STATE, ROBOT_THUMBSUP_EMOTE, ROBOT_RUNNING_STATE, ROBOT_WAVE_EMOTE, ROBOT_YES_EMOTE } from 'src/app/common/constants/robot.constants';
import { environment } from 'src/environments/environment';
import { ThemeService } from 'src/app/services/theme/theme.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { TranslationService } from 'src/app/services/translation/translation.service';
import { InputDialogComponent } from '../../shared/input-dialog/input-dialog.component';
import { HelpInfoService } from 'src/app/services/help-info/help-info.service';
import { DeckService } from 'src/app/services/deck/deck.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ICategory } from 'src/app/models/collections/decks/category.interface';
import { SnackBarComponent } from '../../shared/snack-bar/snack-bar.component';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog.component';
import { CONFIRM, CREATE } from 'src/app/common/constants/angular.constants';
import { IDeck } from 'src/app/models/collections/decks/deck.interface';
import { Router } from '@angular/router';
import { CARD_TYPES } from 'src/app/common/constants/card.constants';
import { SelectionInput } from 'src/app/models/SelectionInput.model';
import { IDeckWithIcon } from 'src/app/models/collections/decks/deck-with-icon.interface';
import { ITeam } from 'src/app/models/collections/teams/team.interface';
import { TeamService } from 'src/app/services/team/team.service';
import { ANSWER_OPTION_SHOW, ANSWER_OPTION_SPEECH, ANSWER_OPTION_TYPE, ANSWER_OPTION_WRITE, FEEDBACK_OPTION_BOTH, FEEDBACK_OPTION_INPUT, FEEDBACK_OPTION_TIME } from 'src/app/common/enums/answers.enum';

@Component({
  selector: 'app-create-deck',
  templateUrl: './create-deck.component.html',
  styleUrls: ['./create-deck.component.scss']
})
export class CreateDeckComponent implements OnInit {

    public deck: IDeckWithIcon;
    public displayAdvancedSettings: boolean = false;
    public types: string[] = CARD_TYPES;
    public themeTracker: number;
    public playerTeams: Observable<ITeam[]>;
    public categories: Observable<ICategory[]>;
    public feedbackOptions: SelectionInput[];
    public learningSteps: number[];
    public answerOptions: SelectionInput[];
    public showAnswerOptions = false;


    public robotState: string;
    public robotPreviousState: string;
    public robotEmote: string;

    public iconBase64: any = {};

    public deckForm = new FormGroup({
        title : new FormControl('',[
          Validators.required,
        ]),
        teamId : new FormControl('',[]),
        selectedCategories : new FormControl('',[]),
        iconFile : new FormControl('',[]),
        description: new FormControl(''),
        feedbackOption : new FormControl(DECK_DEFAULT_FEEDBACKOPTION,[
            Validators.required,
        ]),
        answerOptions : new FormControl('',[
            Validators.required,
        ]),
        learningSteps : new FormControl('',[]),
        defaultEaseModifier : new FormControl(DECK_DEFAULT_DEFAULT_EASE_MODIFIER,[
            Validators.required,
        ]),
        intervalModifier : new FormControl(DECK_DEFAULT_INTERVAL_MODIFIER,[
            Validators.required,
        ]),
        easeBonus : new FormControl(DECK_DEFAULT_EASE_BONUS,[
            Validators.required,
        ]),
        easePenalty : new FormControl(DECK_DEFAULT_EASE_PENALTY,[
            Validators.required,
        ]),
        again : new FormControl(DECK_DEFAULT_AGAIN,[
            Validators.required,
        ]),
        hard : new FormControl(DECK_DEFAULT_HARD,[
            Validators.required,
        ]),
        good : new FormControl(DECK_DEFAULT_GOOD,[
            Validators.required,
        ]),
        easy : new FormControl(DECK_DEFAULT_EASY,[
            Validators.required,
        ]),
    });

    get title() { return this.deckForm.get('title') }
    get teamId() { return this.deckForm.get('teamId') }
    get selectedCategories() { return this.deckForm.get('selectedCategories') }
    get iconFile() { return this.deckForm.get('iconFile')}
    get description() { return this.deckForm.get('description') }
    get feedbackOption() { return this.deckForm.get('feedbackOption') }
    get selectedAnswerOptions() { return this.deckForm.get('answerOptions') }
    get selectedLearningSteps() { return this.deckForm.get('learningSteps') }
    get defaultEaseModifier() { return this.deckForm.get('defaultEaseModifier') }
    get intervalModifier() { return this.deckForm.get('intervalModifier') }
    get easeBonus() { return this.deckForm.get('easeBonus') }
    get easePenalty() { return this.deckForm.get('easePenalty') }
    get again() { return this.deckForm.get('again') }
    get hard() { return this.deckForm.get('hard') }
    get good() { return this.deckForm.get('good') }
    get easy() { return this.deckForm.get('easy') }




    constructor(
        public themeService: ThemeService,
        public his: HelpInfoService,
        private translationService: TranslationService,
        private deckService: DeckService,
        private teamService: TeamService,
        private router: Router,
        private snackbar: MatSnackBar,
        private dialog: MatDialog) 
    {
        this.playerTeams = this.teamService.getPlayerTeams();
        this.categories = this.deckService.getUserCategories();
        this.learningSteps = DECK_DEFAULT_LEARNING_STEPS;

        this.selectedLearningSteps.setValue(this.learningSteps);
        this.selectedCategories.setValue([]);
    }

    ngOnInit(): void 
    {
        this.deck = {} as IDeckWithIcon;
        this.deckForm.valueChanges.subscribe(status => 
        {
            if (environment.production == false)
                console.log('deckForm subscribed');
            
            for (let controlKey in this.deckForm.controls)
            {
                let control = this.deckForm.get(controlKey);
                if (control.invalid && (control.dirty || control.touched))
                {
                    this.robotPreviousState = this.robotState;
                    this.robotState = ROBOT_DEATH_STATE;
                    return;
                }
                
            }

            this.deck = this.deckForm.value;
            this.robotState = this.robotPreviousState ?? ROBOT_WALKING_STATE;
        });

        this.setDeckOptions();
        
        this.themeTracker = 0;
        this.themeService.update.subscribe(theme => 
        {
            if(environment.production == false)
                console.log('deck-card theme subscribed');

            this.themeTracker++;
        });
    }

    public onIconFileSelected(): void
    {
        const inputNode: any = document.querySelector('#icon-file');

        this.robotDance(5000);
          
        let file = inputNode.files[0];
        this.iconBase64 = URL.createObjectURL(file);
        this.iconFile.setValue(file);
    }

    public deleteIconFile(): void
    {
        this.iconBase64 = {};
        this.iconFile.setValue(null);
    }

    public openAdvancedSettings()
    {
        this.displayAdvancedSettings = !this.displayAdvancedSettings
        if(this.displayAdvancedSettings)
        {
            if (this.robotState != ROBOT_DEATH_STATE)
                this.robotState = ROBOT_RUNNING_STATE;

            this.robotPreviousState = ROBOT_RUNNING_STATE;
        }
        else
        {
            if (this.robotState != ROBOT_DEATH_STATE)
                this.robotState = ROBOT_WALKING_STATE;

            this.robotPreviousState = ROBOT_WALKING_STATE;
        }
    }

    public openCreateCategory()
    {
        this.robotEmote = ROBOT_WAVE_EMOTE;

        let dialogReference = this.dialog.open(InputDialogComponent, {
            width: "600px",
            data: 
            { 
                title: `${this.translationService.get('input.create')} ${this.translationService.get('input.deck.category')}`,
                message: this.translationService.get('deck.createCategoryInfo'),
                inputLabel: this.translationService.get('input.deck.category')
            }
        });

        dialogReference.afterClosed().subscribe(async result => 
        {
            if(result.confirmed)
            {
                let created = await this.deckService.createCategory(result.content);
                if (created == false)
                {
                    this.snackbar.openFromComponent(SnackBarComponent, 
                    {
                        data: `${this.translationService.get('input.somethingWentWrong')} </br>
                        ${this.translationService.get('input.creating')} ${this.translationService.get('input.deck.category')}`,
                        duration: 5000,
                        panelClass: ['mat-toolbar', 'mat-accent']
                    });
                }
            }
        });
    }

    public deleteCategory(category: ICategory)
    {
        let dialogReference = this.dialog.open(ConfirmationDialogComponent, 
        {
            width: "600px",
            data: { 
                title: `${this.translationService.get('input.delete')} ${this.translationService.get('input.deck.category')} ${category.name}`,
                message: this.translationService.get('deck.deleteCategoryInfo')
            }
        });

        dialogReference.afterClosed().subscribe(async result => 
        {    
            if(result == CONFIRM)
            {
                let message = await this.deckService.deleteCategory(category);

                this.snackbar.openFromComponent(SnackBarComponent, {
                    data: message,
                    duration: 5000,
                    panelClass: ['mat-toolbar', 'mat-accent']
                });
            }
        });
    }

    public async createDeck(): Promise<void>
    {
        //TODO database security rule deck structure (deck has all required fields)
        if(this.deckForm.valid)
        {
            this.robotState = ROBOT_YES_EMOTE;

            if(this.showAnswerOptions == false)
                this.selectedAnswerOptions.setValue([ANSWER_OPTION_SHOW]);

            let deckId: string = await this.deckService.createDeck(this.deckForm.value);

            this.router.navigate([`/deck/${deckId}/card/${CREATE}/editor`]);
        }
    }

    public handleAnswerOptions(): void
    {
        this.showAnswerOptions = !this.showAnswerOptions;
        this.selectedAnswerOptions.setValue([ANSWER_OPTION_TYPE, ANSWER_OPTION_WRITE, ANSWER_OPTION_SPEECH]);
    }

    public addLearningStep(): void
    {
        this.learningSteps.push(Math.max(...this.learningSteps) + 1);

        this.selectedLearningSteps.setValue(this.learningSteps);
    }

    public updateLearningStep(index: number, value: number): void
    {
        // TODO validate if value is higher than previous learningstep value
        this.learningSteps[index] = value;

        this.selectedLearningSteps.setValue(this.learningSteps);
    }

    public deleteLearningStep(index: number): void
    {
        this.learningSteps.splice(index, 1);
    }

    private setDeckOptions()
    {

        this.feedbackOptions = [
            new SelectionInput(this.translationService.get('deck.feedbackOption.input'), FEEDBACK_OPTION_INPUT),
            new SelectionInput(this.translationService.get('deck.feedbackOption.time'), FEEDBACK_OPTION_TIME),
            new SelectionInput(this.translationService.get('deck.feedbackOption.both'), FEEDBACK_OPTION_BOTH)
        ];
        this.feedbackOption.setValue(this.feedbackOptions[0].value);

        this.answerOptions = [
            new SelectionInput(this.translationService.get('deck.answerOption.type'), ANSWER_OPTION_TYPE),
            new SelectionInput(this.translationService.get('deck.answerOption.write'), ANSWER_OPTION_WRITE),
            new SelectionInput(this.translationService.get('deck.answerOption.speech'), ANSWER_OPTION_SPEECH)
        ];
        this.selectedAnswerOptions.setValue([ANSWER_OPTION_TYPE, ANSWER_OPTION_WRITE, ANSWER_OPTION_SPEECH]);
    }


    private robotDance(time: number): void
    {
        let previousState = this.robotState ?? ROBOT_WALKING_STATE;
        this.robotState = ROBOT_DANCE_STATE;
        setTimeout(() => 
        { 
            this.robotState = previousState
        }, time);
    }

}
