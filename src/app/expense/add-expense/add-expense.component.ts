import { Component, OnInit } from '@angular/core';
import { ExpenseCategory } from './expense-category';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AddNewExpense } from './ad-new-expense';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ExpenseService } from '../expense.service';

@Component({
  selector: 'app-add-expense',
  templateUrl: './add-expense.component.html',
  styleUrls: ['./add-expense.component.css']
})
export class AddExpenseComponent implements OnInit {

  // public expenseEnum = ExpenseCategory;
  public expenseCategory: ExpenseCategory[]=[
    {value: 'FOOD', viewValue:'FOOD'},
    {value: 'GROCERIES', viewValue:'GROCERIES'},
    {value: 'HOUSING', viewValue:'HOUSING'},
    {value: 'UTILITIES', viewValue:'UTILITIES'},
    {value: 'CLOTHING', viewValue:'CLOTHING'},
    {value: 'COSMETICS', viewValue:'COSMETICS'},
    {value: 'LEISURE', viewValue:'LEISURE'},
    {value: 'TRANSPORTATION', viewValue:'TRANSPORTATION'},
    {value: 'HEALTH', viewValue:'HEALTH'},
    {value: 'OTHER', viewValue:'OTHER'}
  ];
  public expenseTypeOption = [];
  addExpenseForm: FormGroup;
  addNewExpense: AddNewExpense; 

  constructor(private expenseService: ExpenseService ,private router: Router, private toastr: ToastrService) {
      this.addNewExpense={
        date: new Date,
        description:'',
        value:0,
        category: ''
      }
   }

  ngOnInit(): void {
    this.expenseTypeOption = Object.keys(this.expenseCategory);
    this.addExpenseForm = new FormGroup({
      date: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      value: new FormControl('', Validators.required),
      category: new FormControl('', Validators.required)
    });
  }

  add(){
    this.addNewExpense.date = this.addExpenseForm.get('date').value;
    this.addNewExpense.description = this.addExpenseForm.get('description').value;
    this.addNewExpense.value = this.addExpenseForm.get('value').value;
    this.addNewExpense.category = this.addExpenseForm.get('category').value;

    this.expenseService.addNewExpense(this.addNewExpense).subscribe(data => {
      this.router.navigateByUrl('/');
      
      this.toastr.success('New Expense added');
    })
    
  }



}
