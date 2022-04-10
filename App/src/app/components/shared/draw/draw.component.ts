import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, SimpleChange, ViewChild } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { switchMap, takeUntil, pairwise } from 'rxjs/operators';

@Component({
  selector: 'draw',
  templateUrl: './draw.component.html',
  styleUrls: ['./draw.component.scss']
})
export class DrawComponent implements AfterViewInit  
{  
    @ViewChild('canvas') public canvas: ElementRef;
    get canvasEl(): HTMLCanvasElement { return this.canvas.nativeElement; }

    @Input()
    public fileName: string;
    private get _fileName(): string 
    { 
        if(this.fileName)
            return `${this.fileName}.png`;
        else
            return "filename.png"; 
    }

    @Input()
    public canSubmit: boolean = true;

    @Output() 
    submitEvent = new EventEmitter<File>();
    
    private cx: CanvasRenderingContext2D; 
    private drawSubscription: Subscription; 


    constructor() { }

    ngAfterViewInit() 
    {
        this.buildCanvas();
    }

    ngOnChanges(changes: SimpleChange) 
    {
        let propKey = Object.keys(changes)[0];

        switch(propKey)
        {
            case 'canSubmit':
                if(this.canSubmit)
                    this.captureEvents();
                else
                    this.drawSubscription?.unsubscribe();
                break;
        }
        
    }
    public async submit(): Promise<void>
    {
        if (this.canSubmit)
        {

            var img: File = await new Promise(resolve =>
            {
                this.canvasEl.toBlob((blob) => 
                {
                    resolve(new File([blob], this._fileName, { type: "image/png" }));
                }, 'image/png');
            });

            this.submitEvent.emit(img);
        }
    }

    private buildCanvas(): void
    {
        // get the context
        this.cx = this.canvasEl.getContext('2d');

        // set the width and height
        this.canvasEl.width = this.canvasEl.parentElement.parentElement.parentElement.clientWidth * 0.75;
        this.canvasEl.height = this.canvasEl.parentElement.parentElement.parentElement.clientHeight;

        this.clearCanvas();
        
        this.captureEvents();
    }

    public clearCanvas(): void
    {
        this.cx.fillStyle = "white";
        this.cx.fillRect(0, 0, this.canvasEl.width, this.canvasEl.height);

        // set some default properties about the line
        this.cx.lineWidth = 3;
        this.cx.lineCap = 'round';
        this.cx.strokeStyle = '#000';
    }

    private captureEvents() 
    {
        // this will capture all mousedown events from the canvas element
        this.drawSubscription = fromEvent(this.canvasEl, 'mousedown')
            .pipe(
                switchMap((e) => {
                    // after a mouse down, we'll record all mouse moves
                    return fromEvent(this.canvasEl, 'mousemove')
                        .pipe(
                        // we'll stop (and unsubscribe) once the user releases the mouse
                        // this will trigger a 'mouseup' event    
                        takeUntil(fromEvent(this.canvasEl, 'mouseup')),
                        // we'll also stop (and unsubscribe) once the mouse leaves the canvas (mouseleave event)
                        takeUntil(fromEvent(this.canvasEl, 'mouseleave')),
                        // pairwise lets us get the previous value to draw a line from
                        // the previous point to the current point    
                        pairwise()
                    );
                })
            )
            .subscribe((res: [MouseEvent, MouseEvent]) => 
            {
                const rect = this.canvasEl.getBoundingClientRect();
        
                // previous and current position with the offset
                const prevPos = {
                    x: res[0].clientX - rect.left,
                    y: res[0].clientY - rect.top
                };
        
                const currentPos = {
                    x: res[1].clientX - rect.left,
                    y: res[1].clientY - rect.top
                };
        
                // this method we'll implement soon to do the actual drawing
                this.drawOnCanvas(prevPos, currentPos);
        });
    }

    private drawOnCanvas(
        prevPos: { x: number, y: number }, 
        currentPos: { x: number, y: number }) 
    {
        // incase the context is not set
        if (!this.cx) { return; }
      
        // start our drawing path
        this.cx.beginPath();
      
        // we're drawing lines so we need a previous position
        if (prevPos) 
        {
            // sets the start point
            this.cx.moveTo(prevPos.x, prevPos.y); // from
        
            // draws a line from the start pos until the current position
            this.cx.lineTo(currentPos.x, currentPos.y);
        
            // strokes the current path with the styles we set earlier
            this.cx.stroke();
        }
    }

}
