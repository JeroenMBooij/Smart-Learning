import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, SimpleChange, ViewChild } from '@angular/core';

@Component({
  selector: 'back-card',
  templateUrl: './back-card.component.html',
  styleUrls: ['./back-card.component.scss']
})
export class BackCardComponent implements OnInit , AfterViewInit {

    @Input()
    public frameSource: string;

    @Input()
    public provideFeedback: boolean;

    @Output() 
    feedbackEvent = new EventEmitter<string>();


    @ViewChild('frame') frame: ElementRef;

    get iFrame(): HTMLIFrameElement {
        return this.frame.nativeElement;
    }

    constructor() { }

    ngOnInit(): void 
    {
    }

    ngAfterViewInit(): void
    {
        this.iFrame.srcdoc = this.frameSource;
    }

    ngOnChanges(changes: SimpleChange) 
    {
        if(this.frame)
            this.iFrame.srcdoc = this.frameSource;
    }

    public next(feedback: string)
    {
        if (this.feedbackEvent)
            this.feedbackEvent.emit(feedback);
    }
}
