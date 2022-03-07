import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { ThemeService } from 'src/app/services/theme/theme.service';
import * as monacoApi from 'monaco-editor/esm/vs/editor/editor.api';
import { ROBOT_DEATH_STATE, ROBOT_RUNNING_STATE, ROBOT_WALKING_STATE } from 'src/app/common/constants/robot.constants';
import { ICustomCard } from 'src/app/models/collections/cards/card-custom.model';
import { IDeck } from 'src/app/models/collections/decks/deck.interface';
import { Observable } from 'rxjs';
import { CardService } from 'src/app/services/card/card.service';
import { SnackBarComponent } from 'src/app/components/shared/snack-bar/snack-bar.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslationService } from 'src/app/services/translation/translation.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';
import { patienceDiff } from 'src/app/common/logic/patient-diff';
import * as uuid from 'uuid';
import { COMMON_CSS } from 'src/app/services/card-html/html/common.html';
import { AnswerOption, FeedbackOption } from 'src/app/common/enums/answers.enum';
import { CardHtmlService } from 'src/app/services/card-html/card-html.service';

@Component({
  selector: 'custom-web-editor',
  templateUrl: './custom-web-editor.component.html',
  styleUrls: ['./custom-web-editor.component.scss']
})
export class CustomWebEditorComponent implements OnInit, AfterViewInit
{
    @Input()
    public deck: Observable<IDeck>;

    @Input()
    public card: Observable<ICustomCard>;

    @Input()
    public unsavedChanges: boolean;

    public deckId: string;
    public cardId: string;
    public cardName: string;

    public frontFrameSource: string = "";
    public backFrameSource: string = "";

    public editorContent = {
        frontHtml: 
        {
            current: "",
            init: "",
            eval: false,
            options: 
            {
                theme: 'vs', 
                language: 'html', 
                minimap: {
                    enabled: false
                }
            }
        },
        backHtml: 
        {
            current: "",
            init: "",
            eval: false,
            options:
            {
                theme: 'vs', 
                language: 'html', 
                minimap: {
                  enabled: false
                }
            }
        },
        css: 
        {
            current: "",
            init: "",
            eval: false,
            options:  
            {
                theme: 'vs', 
                language: 'css', 
                minimap: {
                  enabled: false
                }
            }
        },
        javascript: 
        {
            current: "",
            init: "",
            eval: false,
            options:  
            {
                theme: 'vs', 
                language: 'javascript', 
                minimap: {
                    enabled: false
                }
            }
        },
    }

    get robotState() 
    {
        return this._robotState;
    }
    set robotState(state: string)
    {
        this._robotState = state;
    }
    private _robotState: string;
    public robotEmote: string;

    public showSnackBar = true;

    private answerOptions: AnswerOption[];
    private feedbackOption: FeedbackOption;

    

    constructor(
        private themeService: ThemeService,
        private cardService: CardService,
        private cardHtmlService: CardHtmlService,
        private router: Router,
        private route: ActivatedRoute,
        private translationService: TranslationService,
        private dialog: MatDialog,
        private snackbar: MatSnackBar) { }



    ngOnInit(): void 
    {
        window.name = uuid.v4();

        this.deck.subscribe(deck => {
            this.deckId = deck.id;
            this.answerOptions = deck.answerOptions;
            this.feedbackOption = deck.feedbackOption;

            this.onSupportHtmlChange(false);
        });

        this.themeService.update.subscribe(theme => 
        {
            Object.keys(this.editorContent).forEach(editorKey => 
            {
                switch(theme)
                {
                    case 'light-theme':
                        this.editorContent[editorKey].options = { ...this.editorContent[editorKey].options, theme: 'vs' }
                        break;
                    case 'dark-theme':
                        this.editorContent[editorKey].options = { ...this.editorContent[editorKey].options, theme: 'vs-dark' }
                        break;
                }
            });
        });

    }

    ngAfterViewInit(): void
    {
        /*this.initFrontHtml = this.card.value.frontHtml;
        this.initBackHtml = this.card.value.backHtml;
        this.initCss = this.card.value.css;
        this.initJavascript = this.card.value.javascript;*/

        this.card.subscribe(card => 
        {
            if (environment.production == false)
                console.log("subscribed custom card");
                
            this.cardId = card.id;
            this.cardName = card.name;

            if (card.lastEditedBy != window.name)
                this.mergeCardWithEditors(card);

        });
    }

    public async save(): Promise<void>
    {
        if (this.cardName != '')
        {
            let customCard = {} as ICustomCard;
            customCard.type = 'web custom';
            customCard.id = this.cardId;
            customCard.deckId = this.deckId;
            customCard.lastEditedBy = window.name;
            customCard.frontHtml = this.editorContent.frontHtml.current;
            customCard.backHtml = this.editorContent.backHtml.current;
            customCard.css = this.editorContent.css.current;
            customCard.javascript = this.editorContent.javascript.current;
            customCard.frontFrameSource = this.frontFrameSource;
            customCard.backFrameSource = this.backFrameSource;
            let cardId = await this.cardService.saveCard(this.deckId, customCard);

            if(cardId)
            {
                if (this.showSnackBar)
                {
                    let snackRef = this.snackbar.openFromComponent(SnackBarComponent, {
                        data: `${this.translationService.get('signpost.card')}
                                ${this.translationService.get('input.saved')}`,
                        duration: 5000,
                        panelClass: ['mat-toolbar', 'mat-accent']
                    });

                    snackRef.afterOpened().subscribe(async () => 
                    {
                        this.showSnackBar = false;
                        await new Promise(resolve => setTimeout(resolve, 60000));
                        this.showSnackBar = true;
                    })
                }
                    
                this._robotState = ROBOT_WALKING_STATE;
            }
            else
                this.snackbar.openFromComponent(SnackBarComponent, {
                    data: `${this.translationService.get('input.somethingWentWrong')}`,
                    duration: 5000,
                    panelClass: ['mat-toolbar', 'mat-warning']
                });

                this.robotState = ROBOT_DEATH_STATE;
        }
        else
        {
            this.snackbar.openFromComponent(SnackBarComponent, {
                data: `${this.translationService.get('signpost.card')}
                        ${this.translationService.get('signpost.name')}
                        ${this.translationService.get('input.required')}` ,
                duration: 5000,
                panelClass: ['mat-toolbar', 'mat-warning']
            });

            this.robotState = ROBOT_DEATH_STATE;
        }
    }

    public UndoChanges(): void
    {
        /*this.frontHtml = this.initFrontHtml;
        this.backHtml = this.initBackHtml;
        this.css = this.initCss;
        this.javascript = this.initJavascript;*/

        this.save();
    }

    public onFrontHtmlChange(): void
    {
        this.reloadFrontCard();
        this.save();
    }

    public onBackHtmlChange(): void
    {
        this.reloadBackCard();
        this.save();
    }

    public onSupportHtmlChange(save = true): void
    {
        try
        {
            new Function(this.editorContent.javascript.current);
            this._robotState = ROBOT_RUNNING_STATE;
            this.editorContent.javascript.eval = false;

            this.reloadFrontCard();
            this.reloadBackCard();
            if(save)
                this.save();
        }
        catch(error)
        {
            this.editorContent.javascript.eval = true;
            this.robotState = ROBOT_DEATH_STATE;
        }
    }

    private reloadFrontCard(): void
    {
        this.editorContent.frontHtml.eval = this.checkHTML(this.editorContent.frontHtml.current);

        const source = `
            <html>
                <head>
                    <style>
                        ${COMMON_CSS}
                        ${this.editorContent.css.current}
                    </style>
                    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.1/dist/css/bootstrap.min.css" integrity="sha384-zCbKRCUGaJDkqS1kPbPd7TveP5iyJE0EjAuZQTgFLD2ylzuqKfdKlfG/eSrtxUkn" crossorigin="anonymous">
                    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" integrity="sha512-9usAa10IRO0HhonpyAIVpjrylPvoDwiPUiKdWk5t3PyolY1cOd4DSE0Ga+ri4AuTroPR5aQvXU9xC6qOPnzFeg==" crossorigin="anonymous" referrerpolicy="no-referrer" />
                </head>
                <body>
                    <div class="main-container text-break">
                        ${this.editorContent.frontHtml.current}
                    </div>
                
                    <script
                        src="https://code.jquery.com/jquery-3.6.0.slim.min.js"
                        integrity="sha256-u7e5khyithlIdTpu22PHhENmPcRdFiHRjhAuHcs05RI="
                        crossorigin="anonymous"
                    ></script>
                    <script 
                        src="https://cdn.jsdelivr.net/npm/bootstrap@4.6.1/dist/js/bootstrap.min.js" 
                        integrity="sha384-VHvPCCyXqtD5DqJeNxl2dtTyhF78xXNXdkwX1CZeRusQfRKp+tA7hAShOK/B/fQ2" 
                        crossorigin="anonymous"
                    ></script>
                    <script> 
                        ${this.editorContent.javascript.current}
                    </script>

                </body>
            </html>
            `;

        this.frontFrameSource = source;
    }

    private reloadBackCard(): void
    {
        this.editorContent.backHtml.eval = this.checkHTML(this.editorContent.backHtml.current);

        const source = `
            <html>
                <head>
                    <style>
                        ${COMMON_CSS}
                        ${this.editorContent.css.current}
                    </style>
                    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.1/dist/css/bootstrap.min.css" integrity="sha384-zCbKRCUGaJDkqS1kPbPd7TveP5iyJE0EjAuZQTgFLD2ylzuqKfdKlfG/eSrtxUkn" crossorigin="anonymous">
                    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" integrity="sha512-9usAa10IRO0HhonpyAIVpjrylPvoDwiPUiKdWk5t3PyolY1cOd4DSE0Ga+ri4AuTroPR5aQvXU9xC6qOPnzFeg==" crossorigin="anonymous" referrerpolicy="no-referrer" />
                </head>
                <body>
                    <div class="main-container text-break">
                        ${this.editorContent.backHtml.current}
                    </div>
                    
                    <script
                        src="https://code.jquery.com/jquery-3.6.0.slim.min.js"
                        integrity="sha256-u7e5khyithlIdTpu22PHhENmPcRdFiHRjhAuHcs05RI="
                        crossorigin="anonymous"
                    ></script>
                    <script 
                        src="https://cdn.jsdelivr.net/npm/bootstrap@4.6.1/dist/js/bootstrap.min.js" 
                        integrity="sha384-VHvPCCyXqtD5DqJeNxl2dtTyhF78xXNXdkwX1CZeRusQfRKp+tA7hAShOK/B/fQ2" 
                        crossorigin="anonymous"
                    ></script>
                    <script> 
                        ${this.editorContent.javascript.current}
                    </script>

                </body>
            </html>
            `;
            
        this.backFrameSource = source;
    }

    private mergeCardWithEditors(card: ICustomCard)
    {
        Object.keys(this.editorContent).forEach(editorKey =>
        {
            let cardContent = card[editorKey]?.split('') ?? '';
            let results = patienceDiff(cardContent, this.editorContent[editorKey].current.split(''), true);

            let addcount = 0;
            let subcount = 0;
            results.lines.forEach(result =>
            {
                let countIndex: number;
                if (result.bIndex == -1)
                {
                    countIndex = result.aIndex + addcount;
                    this.editorContent[editorKey].current = this.editorContent[editorKey].current.substring(0, countIndex) 
                                                          + result.line 
                                                          + this.editorContent[editorKey].current.substring(countIndex);
                    addcount++;
                }
                
                if(result.aIndex == -1)
                {
                    countIndex = result.bIndex + subcount;
                    this.editorContent[editorKey].current = this.editorContent[editorKey].current.substring(0, countIndex) 
                                                          + this.editorContent[editorKey].current.substring(countIndex + 1);
                    subcount--;
                }
            });
        });

        this.onSupportHtmlChange(false);
    }

    private checkHTML(html: string): boolean
    {
        html = html.trim().replaceAll('\r', '').replaceAll('\n', '');
        var doc = document.createElement('div');
        doc.innerHTML = html;
        return ( doc.innerHTML !== html );
    }

    public registerMonacoHtmlAutoComplete(): void
    {
        const monaco = window['monaco'];
        monaco.languages.registerCompletionItemProvider('html', 
        {
            triggerCharacters: ['>'],
            provideCompletionItems: (model, position) => 
            {
              const codePre: string = model.getValueInRange({
                startLineNumber: position.lineNumber,
                startColumn: 1,
                endLineNumber: position.lineNumber,
                endColumn: position.column,
              });
          
              const tag = codePre.match(/.*<(\w+)>$/)?.[1];
          
              if (!tag) {
                return;
              }
              
              const word = model.getWordUntilPosition(position);
          
              return {
                suggestions: [
                {
                    label: `</${tag}>`,
                    kind: monacoApi.languages.CompletionItemKind.EnumMember,
                    insertText: `$1</${tag}>`,
                    insertTextRules: monacoApi.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    range:  {
                       startLineNumber: position.lineNumber,
                       endLineNumber: position.lineNumber,
                       startColumn: word.startColumn,
                       endColumn: word.endColumn,
                    },
                  },
                ],
              };
            },
        });
    }

}
