import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, SimpleChange, ViewChild } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ANSWER_OPTION_SHOW, ANSWER_OPTION_SPEECH, ANSWER_OPTION_TYPE, ANSWER_OPTION_WRITE } from 'src/app/common/enums/answers.enum';
import { DataMessage } from 'src/app/models/DataMessage.model';

@Component({
  selector: 'front-card',
  templateUrl: './front-card.component.html',
  styleUrls: ['./front-card.component.scss']
})
export class FrontCardComponent implements OnInit 
{
    @Input()
    public frameSource: string;

    @Input()
    public answerOptions: string[];

    @Input()
    public canSubmit: boolean = true;

    @Output() 
    flipCardEvent = new EventEmitter<DataMessage>();


    @ViewChild('frame') frame: ElementRef;

    get iFrame(): HTMLIFrameElement {
        return this.frame.nativeElement;
    }
    
    public validate: boolean;
    public selectedWrite: boolean;
    public selectedSpeech: boolean;
    public selectedType: boolean;

    private selectedOptionIndex = 0;

    constructor() { }

    ngOnInit(): void
    {

    }


    ngOnChanges(changes: SimpleChange): void
    {
        if(this.frame)
            this.iFrame.srcdoc = this.frameSource;

        if(this.answerOptions)
            this.switchAnswerOption(this.answerOptions[this.selectedOptionIndex]);
            
    }

    public async submit(data: any): Promise<void>
    {
        this.validate = true;

        let dataMessage = new DataMessage(this.answerOptions[this.selectedOptionIndex], data);
        this.flipCardEvent.emit(dataMessage);
    }

    public switchAnswerOption(option: string): void
    {
        this.validate = true;
        this.selectedWrite = false;
        this.selectedSpeech = false;
        this.selectedType = false;

        switch(option)
        {
            case ANSWER_OPTION_WRITE:
                this.selectedWrite = true;
                break;
            case ANSWER_OPTION_SPEECH:
                this.selectedSpeech = true;
                break;
            case ANSWER_OPTION_TYPE:
                this.selectedType = true;
                break;
            case ANSWER_OPTION_SHOW:
                this.validate = false;
                break;
        }
    }

}
