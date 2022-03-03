import { Component, Input } from "@angular/core";
import {
  AbstractControl,
  ControlValueAccessor,
  FormBuilder,
  FormControl,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  Validator,
  Validators,
} from "@angular/forms";
import { Subscription } from "rxjs";

@Component({
  selector: "app-stepper",
  styleUrls: ["stepper-component.css"],
  templateUrl: "stepper-component.html",
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: StepperComponent,
    },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: StepperComponent,
    },
  ],
})
export class StepperComponent implements ControlValueAccessor, Validator {
  @Input() increment: number;

  constructor(private fb: FormBuilder) {}

  touched = false;
  disabled = false;
  inputValue = new FormControl(0, [Validators.required, Validators.max(70)]);

  form: FormGroup = this.fb.group({
    inputValue: this.inputValue,
  });

  onTouched: Function = () => {};
  onChangeSubs = new Subscription();

  ngOnDestroy() {
    this.onChangeSubs.unsubscribe();
  }

  onAdd() {
    this.markAsTouched();
    this.inputValue.markAllAsTouched();
    if (!this.disabled) {
      this.inputValue.patchValue(this.inputValue.value + this.increment);
    }
  }

  onRemove() {
    this.markAsTouched();
    this.inputValue.markAllAsTouched();
    if (!this.disabled) {
      this.inputValue.patchValue(this.inputValue.value - this.increment);
    }
  }

  writeValue(value: any) {
    if (value) {
      this.form.setValue(value, { emitEvent: false });
    }
  }

  registerOnChange(onChange: any) {
    this.onChangeSubs.add(this.form.valueChanges.subscribe(onChange));
  }

  registerOnTouched(onTouched: any) {
    this.onTouched = onTouched;
  }

  markAsTouched() {
    if (!this.touched) {
      this.onTouched();
      this.touched = true;
    }
  }

  setDisabledState(disabled: boolean) {
    if (disabled) {
      this.form.disable();
    } else {
      this.form.enable();
    }
  }

  validate(control: AbstractControl) {
    if (this.form.valid) {
      return null;
    }
    let errors: any = {};
    errors = this.addControlErrors(errors, "inputValue");
    return errors;
  }

  addControlErrors(allErrors: any, controlName: string) {
    const errors = { ...allErrors };
    const controlErrors = this.form.controls[controlName].errors;
    if (controlErrors) {
      errors[controlName] = controlErrors;
    }
    return errors;
  }
}