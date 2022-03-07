import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogInput } from 'src/app/models/DialogInput.model';
import { SelectionInput } from 'src/app/models/SelectionInput.model';
import { TranslationService } from 'src/app/services/translation/translation.service';

@Component({
  selector: 'app-selection-dialog',
  templateUrl: './selection-dialog.component.html',
  styleUrls: ['./selection-dialog.component.scss']
})
export class SelectionDialogComponent implements OnInit {

    public title: string = "app";

    public message: string;

    public selectionLabel: string;
    
    public options: SelectionInput[];

    public optional: boolean = true;


    public dialogForm = new FormGroup({
        input     : new FormControl('',[
          Validators.required,
        ])
    });

    get input() { return this.dialogForm.get('input') }

    constructor(
        private thisDialogReference: MatDialogRef<SelectionDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) 
        { 
            this.message = data.message;
            this.selectionLabel = data.selectionLabel;
            this.options = data.options;
            if (data.title)
                this.title = data.title;
            if (data.optional == false)
            {
                this.optional = data.optional;
                thisDialogReference.disableClose = true
            }

        }

        ngOnInit(): void {
        }

        public confirm(): void 
        {
            this.thisDialogReference.close(new DialogInput(true, this.input.value));
        }
    
        public cancel(): void 
        {
            this.thisDialogReference.close(new DialogInput(false));
        }

}
