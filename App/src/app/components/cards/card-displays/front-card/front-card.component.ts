import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, SimpleChange, ViewChild } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'front-card',
  templateUrl: './front-card.component.html',
  styleUrls: ['./front-card.component.scss']
})
export class FrontCardComponent implements OnInit, AfterViewInit {

    @Input()
    public frameSource: string;

    @Input()
    public showAnswer: BehaviorSubject<boolean>;

    @Output() 
    flipCardEvent = new EventEmitter<boolean>();


    @ViewChild('frame') frame: ElementRef;

    get iFrame(): HTMLIFrameElement {
        return this.frame.nativeElement;
    }

    constructor() { }

    ngOnInit(): void 
    {
        if(!this.showAnswer)
            this.showAnswer = new BehaviorSubject(false);
    }

    ngAfterViewInit(): void
    {
        this.iFrame.srcdoc = this.frameSource;
    }

    ngOnChanges(changes: SimpleChange): void
    {
        if(this.frame)
            this.iFrame.srcdoc = this.frameSource;
    }

    public async submit(): Promise<void>
    {
        this.showAnswer.next(true);

        this.flipCardEvent.emit(true);
    }

}
