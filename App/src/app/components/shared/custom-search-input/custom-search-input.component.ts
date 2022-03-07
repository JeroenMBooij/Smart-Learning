import { MatInput } from '@angular/material/input';
import { FocusMonitor } from '@angular/cdk/a11y';
import {
  Component,
  OnInit,
  Input,
  HostBinding,
  ViewChild,
  ElementRef,
  OnDestroy,
  Optional,
  Self,
  DoCheck,
} from '@angular/core';
import { MatFormFieldControl } from '@angular/material/form-field';
import { Subject } from 'rxjs';
import {
  NgControl,
  ControlValueAccessor,
  FormBuilder,
  FormGroup,
  FormControl,
  FormGroupDirective,
  NgForm,
} from '@angular/forms';
import {
  ErrorStateMatcher,
  CanUpdateErrorStateCtor,
  mixinErrorState,
  mixinDisabled,
  CanDisableCtor,
} from '@angular/material/core';
import { take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { SelectionInput } from 'src/app/models/SelectionInput.model';

export interface FormFieldValue {
  query: string;
  scope: string;
}

export class CustomErrorMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl): boolean {
    return control.dirty && control.invalid;
  }
}

class SearchInputBase {
  constructor(
    public _parentFormGroup: FormGroupDirective,
    public _parentForm: NgForm,
    public _defaultErrorStateMatcher: ErrorStateMatcher,
    public ngControl: NgControl
  ) {}
}

const _SearchInputMixiBase: CanUpdateErrorStateCtor &
  CanDisableCtor = mixinDisabled(mixinErrorState(SearchInputBase));

@Component({
  selector: 'advanced-search-input',
  templateUrl: './custom-search-input.component.html',
  styleUrls: ['./custom-search-input.component.scss'],
  providers: [
    {
      provide: MatFormFieldControl,
      useExisting: CustomSearchInputComponent,
    },
    {
      provide: ErrorStateMatcher,
      useClass: CustomErrorMatcher,
    },
  ],
})
export class CustomSearchInputComponent extends _SearchInputMixiBase
  implements
    OnInit,
    OnDestroy,
    MatFormFieldControl<FormFieldValue>,
    ControlValueAccessor,
    DoCheck 
{
    public static nextId = 0;

    @ViewChild(MatInput, { read: ElementRef, static: true })

    public input: ElementRef;

    @Input()
    public scopeOptions: SelectionInput[] = [];

    @Input()
    set value(value: FormFieldValue) {
        this.form.patchValue(value);
        this.stateChanges.next();
    }
    get value() {
        return this.form.value;
    }

    @HostBinding()
    public id = `custom-form-field-id-${CustomSearchInputComponent.nextId++}`;

    @Input()
    set placeholder(value: string) {
        this._placeholder = value;
        this.stateChanges.next();
    }
    get placeholder() {
        return this._placeholder;
    }
    private _placeholder: string;

    focused: boolean;

    get empty(): boolean {
        return !this.value.query && !this.value.scope;
    }

    @HostBinding('class.floated')
    get shouldLabelFloat(): boolean {
        return true;
    }

    @Input()
    public required: boolean;

    @Input()
    public disabled: boolean;

    public controlType = 'custom-form-field';

    @HostBinding('attr.aria-describedby') describedBy = '';

    public onChange: (value: FormFieldValue) => void;
    public onToutch: () => void;

    public form: FormGroup;

    constructor(
        private focusMonitor: FocusMonitor,
        @Optional() @Self() public ngControl: NgControl,
        private fb: FormBuilder,
        public _defaultErrorStateMatcher: ErrorStateMatcher,
        @Optional() _parentForm: NgForm,
        @Optional() _parentFormGroup: FormGroupDirective
    ) 
    {
        super(_defaultErrorStateMatcher, _parentForm, _parentFormGroup, ngControl);
        
        if (this.ngControl != null) 
            this.ngControl.valueAccessor = this;
        
        this.form = this.fb.group({
            scope: new FormControl(''),
            query: new FormControl(''),
        });
    }

    public writeValue(obj: FormFieldValue): void 
    {
    }

    public registerOnChange(fn: any): void 
    {
        this.onChange = fn;
    }

    public registerOnTouched(fn: any): void {
        this.onToutch = fn;
    }

    public setDisabledState(isDisabled: boolean): void 
    {
        this.disabled = isDisabled;
        this.form.disable();
        this.stateChanges.next();
    }

    public setDescribedByIds(ids: string[]): void 
    {
        this.describedBy = ids.join(' ');
    }

    public onContainerClick(): void 
    {
        this.focusMonitor.focusVia(this.input, 'program');
    }

    ngOnInit(): void 
    {
        this.form.get('scope').setValue(this.scopeOptions[0].value);

        this.focusMonitor.monitor(this.input).subscribe((focused) => 
        {
            this.focused = !!focused;
            this.stateChanges.next();
        });

        this.focusMonitor
            .monitor(this.input)
            .pipe(take(1))
            .subscribe(() => {
                this.onToutch();
            });

        this.form.valueChanges.subscribe((value) => 
        { 
            if(environment.production == false)
                console.log('custom search subscribed');
                
            this.onChange(value)}
        );
    }

    public ngDoCheck() 
    {
        if (this.ngControl) 
            this.updateErrorState();
    }

    public ngOnDestroy() 
    {
        this.focusMonitor.stopMonitoring(this.input);
        this.stateChanges.complete();
    }

}