import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app',
  templateUrl: 'app-component.html',
})
export class AppComponent {
  constructor(private fb: FormBuilder) {}

  form = this.fb.group({
    stepper: {
      inputValue: 50,
    },
  });
}