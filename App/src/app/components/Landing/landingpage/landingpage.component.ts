import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ThemeService } from 'src/app/services/theme/theme.service';
import * as monacoApi from 'monaco-editor/esm/vs/editor/editor.api';
import { COMMON_CSS } from '../../cards/editor/options/custom-web-editor/card-editor.css';
import { TranslationService } from 'src/app/services/translation/translation.service';
import { ROBOT_DANCE_STATE, ROBOT_JUMP_EMOTE, ROBOT_WAVE_EMOTE } from 'src/app/common/constants/robot.constants';


@Component({
  selector: 'app-landingpage',
  templateUrl: './landingpage.component.html',
  styleUrls: ['./landingpage.component.scss']
})
export class LandingpageComponent implements OnInit 
{
    public editorContent = {
        current: "",
        css: "",
        options: 
        {
            theme: 'vs', 
            language: 'html', 
            minimap: {
                enabled: false
            }
        }
    }
    
    public frontFrameSource = "";

    public robotEmote = "";

    constructor(
        public themeService: ThemeService,
        public translationService: TranslationService,
        private router: Router,
        private cdr: ChangeDetectorRef) 
        { 
        }

    ngOnInit(): void 
    {
        this.themeService.update.subscribe(theme => 
        {
            switch(theme)
            {
                case 'light-theme':
                    this.editorContent.options = { ...this.editorContent.options, theme: 'vs' }
                    this.editorContent.css = "body{color: black !important; background-color: #ffffff !important;}"
                    break;
                case 'dark-theme':
                    this.editorContent.options = { ...this.editorContent.options, theme: 'vs-dark' }
                    this.editorContent.css = "body{color: white !important; background-color: #303030 !important;}"
                    break;
            }

            this.reloadFrontCard();
        });

        this.translationService.update.subscribe((update) =>
        {
            this.editorContent.current = this.translationService.get("info.editor-preview-html");
            this.reloadFrontCard();
            this.cdr.detectChanges();
        });
    }

    async ngAfterViewInit(): Promise<void>
    {
        this.editorContent.current = this.translationService.get("info.editor-preview-html");
        this.reloadFrontCard();
        this.cdr.detectChanges();

        new Promise(async () => {
            while(true)
            {
                this.robotEmote = "";

                await new Promise(resolve => setTimeout(resolve, 25000));
                this.robotEmote = ROBOT_WAVE_EMOTE;
                this.cdr.detectChanges();
            }
        });
        
        await new Promise(resolve => setTimeout(resolve, 3000));
        this.robotEmote = ROBOT_WAVE_EMOTE;
        this.cdr.detectChanges();
    }


    public openLogin(): void
    {
        this.router.navigate(['/login']);
    }

    public openRegister():void
    {
        this.router.navigate(['/register']);
    }

    public reloadFrontCard(): void
    {
        const source = `
            <html>
                <head>
                    <style>
                        ${COMMON_CSS}
                        ${this.editorContent.css}
                    </style>
                    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.1/dist/css/bootstrap.min.css" integrity="sha384-zCbKRCUGaJDkqS1kPbPd7TveP5iyJE0EjAuZQTgFLD2ylzuqKfdKlfG/eSrtxUkn" crossorigin="anonymous">
                    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" integrity="sha512-9usAa10IRO0HhonpyAIVpjrylPvoDwiPUiKdWk5t3PyolY1cOd4DSE0Ga+ri4AuTroPR5aQvXU9xC6qOPnzFeg==" crossorigin="anonymous" referrerpolicy="no-referrer" />
                </head>
                <body>
                    <div class="main-container text-break">
                        ${this.editorContent.current}
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

                </body>
            </html>
            `;

        this.frontFrameSource = source;
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
