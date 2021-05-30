import { Component, Input, OnInit } from '@angular/core';
import { ExpenseCategory } from './expense-category';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AddNewExpense } from './ad-new-expense';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ExpenseService } from '../expense.service';
import { isEmpty } from 'rxjs/operators';

@Component({
  selector: 'app-add-expense',
  templateUrl: './add-expense.component.html',
  styleUrls: ['./add-expense.component.css']
})
export class AddExpenseComponent implements OnInit {

  public expenseCategory: ExpenseCategory[] = [
    { value: 'FOOD', viewValue: 'FOOD' },
    { value: 'GROCERIES', viewValue: 'GROCERIES' },
    { value: 'HOUSING', viewValue: 'HOUSING' },
    { value: 'UTILITIES', viewValue: 'UTILITIES' },
    { value: 'CLOTHING', viewValue: 'CLOTHING' },
    { value: 'COSMETICS', viewValue: 'COSMETICS' },
    { value: 'LEISURE', viewValue: 'LEISURE' },
    { value: 'TRANSPORTATION', viewValue: 'TRANSPORTATION' },
    { value: 'HEALTH', viewValue: 'HEALTH' },
    { value: 'OTHER', viewValue: 'OTHER' }
  ];
  public expenseTypeOption = [];
  addExpenseForm: FormGroup;
  addNewExpense: AddNewExpense;
  incomeTypeCheck = true;

  @Input()
  maxNumberOfCharacters = 50;
  numberOfCharacters1 = 0;

  constructor(private expenseService: ExpenseService, private router: Router, private toastr: ToastrService) {
    this.addNewExpense = {
      date: new Date,
      description: '',
      value: 0,
      category: ''
    }
  }

  ngOnInit(): void {
    this.expenseTypeOption = Object.keys(this.expenseCategory);
    this.addExpenseForm = new FormGroup({
      date: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      value: new FormControl('', Validators.required),
      category: new FormControl('FOOD', Validators.required)
    });
  }

  onKeyUp(event: any): void {
    this.numberOfCharacters1 = event.target.value.length;

    if (this.numberOfCharacters1 > this.maxNumberOfCharacters) {
      event.target.value = event.target.value.slice(0, this.maxNumberOfCharacters);
      this.numberOfCharacters1 = this.maxNumberOfCharacters;
    }
  }

  add() {
    this.addNewExpense.date = this.addExpenseForm.get('date').value;
    this.addNewExpense.description = this.addExpenseForm.get('description').value;
    if (this.incomeTypeCheck === true) {
      this.addNewExpense.value = this.possitiveToNegative(this.addExpenseForm.get('value').value);
    } else {
      this.addNewExpense.value = this.addExpenseForm.get('value').value;
    }
    if (this.incomeTypeCheck === false) {
      this.addNewExpense.category = "INCOME";
    } else {
      this.addNewExpense.category = this.addExpenseForm.get('category').value;
    }

    this.expenseService.addNewExpense(this.addNewExpense).subscribe(data => {
      this.redirectTo('/home');
      this.toastr.success('New Expense added');
    })

  }

  redirectTo(uri: string) {
    this.router.navigateByUrl('/test', { skipLocationChange: true }).then(() =>
      this.router.navigate([uri]));
  }

  toggle() {
    this.incomeTypeCheck = !this.incomeTypeCheck;
  }

  possitiveToNegative(value: number) {
    return -Math.abs(value);
  }


}
