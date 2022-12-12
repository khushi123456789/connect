import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { Employee } from '../employee';

@Component({
  selector: 'app-employee-form',
  template: `
    <form class="employee-form" autocomplete="off" [formGroup]="employeeForm" (ngSubmit)="submitForm()">
      <div class="form-floating mb-3">
        <input class="form-control" type="text" id="name" formControlName="name" placeholder="Name" required>
        <label for="name">Name</label>
      </div>

      <div *ngIf="name.invalid && (name.dirty || name.touched)" class="alert alert-danger">
        <div *ngIf="name.errors?.['required']">
          Name is required.
        </div>
        <div *ngIf="name.errors?.['minlength']">
          Name must be at least 3 characters long.
        </div>
      </div>

      <div class="form-floating mb-3">
        <input class="form-control" type="text" formControlName="age" placeholder="Age" required >
        <label for="age">Age</label>
      </div>

      <div *ngIf="age.invalid && (age.dirty || age.touched)" class="alert alert-danger">
        <div *ngIf="age.errors?.['required']">
          Age is required.
        </div>
        <div *ngIf="age.errors?.['min']">
          Age must be at least 18.
        </div>
        <div *ngIf="age.errors?.['max']">
        Age must be at till 65.
      </div>
      <div *ngIf="age.errors?.['pattern']" class="text-danger">Number Only</div>
      </div>

      <div class="form-floating mb-3">
      <input class="form-control" type="Date" id="start_date" formControlName="start_date" placeholder="DD/MM/YYYY" required>
      <label for="start_date">Start_date</label>
    </div>

    <div *ngIf="start_date.invalid && (start_date.dirty || start_date.touched)" class="alert alert-danger">
      <div *ngIf="start_date.errors?.['required']">
      Start_date is required.
      </div>
     
    </div>

      <div class="mb-3">
        <div class="form-check">
          <input class="form-check-input" type="radio" formControlName="slot" name="slot" id="6-7 AM" value="6-7 AM" required>
          <label class="form-check-label" for="6-7 AM">6-7 AM</label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="radio" formControlName="slot" name="slot" id="7-8 AM" value="7-8 AM">
          <label class="form-check-label" for="7-8 AM">7-8 AM</label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="radio" formControlName="slot" name="slot" id="8-9 AM"
            value="8-9 AM">
          <label class="form-check-label" for="8-9 AM">8-9 AM</label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="radio" formControlName="slot" name="slot" id="5-6 PM"
            value="5-6 PM">
          <label class="form-check-label" for="5-6 PM">5-6 PM</label>
        </div>
      </div>
      <div class="form-floating mb-3">
      <input class="form-control" type="text" id="fees" formControlName="fees" placeholder="fees" required>
      <label for="fees">Fees</label>
    </div>


      <button class="btn btn-primary" type="submit" [disabled]="employeeForm.invalid">Add</button>
    </form>
  `,
  styles: [
    `.employee-form {
      max-width: 560px;
      margin-left: auto;
      margin-right: auto;
    }`
  ]
})
export class EmployeeFormComponent implements OnInit {
  @Input()
  initialState: BehaviorSubject<Employee> = new BehaviorSubject({});

  @Output()
  formValuesChanged = new EventEmitter<Employee>();

  @Output()
  formSubmitted = new EventEmitter<Employee>();
   
  employeeForm: FormGroup = new FormGroup({});

  constructor(private fb: FormBuilder) { }

  get name() { return this.employeeForm.get('name')!; }
  get age() { return this.employeeForm.get('age')!; }
  get slot() { return this.employeeForm.get('slot')!; }
  get start_date() { return this.employeeForm.get('start_date')!; }
  get fees() { return this.employeeForm.get('fees')!; }
  
  feesValue(){

  }
  ngOnInit() {
    this.initialState.subscribe(employee => {
      this.employeeForm = this.fb.group({
        name: [ employee.name, [Validators.required] ],
        age: [ employee.age, [ Validators.required,  Validators.max(65), Validators.min(18), Validators.pattern("^[0-9]*$"),] ],
        slot: [ employee.slot, [Validators.required] ],
        start_date: [ employee.start_date, [Validators.required] ],
        fees: [ {value:500,disabled: true}, [Validators.required] ],
      });
    });

    this.employeeForm.valueChanges.subscribe((val) => { this.formValuesChanged.emit(val); });
  }

  submitForm() {
    this.formSubmitted.emit(this.employeeForm.value);
  }
}
