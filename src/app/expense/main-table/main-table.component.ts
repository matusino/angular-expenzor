import { Component, OnInit } from '@angular/core';
import { ExpenseModel } from '../expense-model';
import { ExpenseService } from '../expense.service';
import { ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-main-table',
  templateUrl: './main-table.component.html',
  styleUrls: ['./main-table.component.css']
})
export class MainTableComponent implements OnInit {


  expense: Array<ExpenseModel> =[];

  displayedColumns: string[] = ['date', 'value', 'category', 'description'];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private expenseService: ExpenseService) {
    this.expenseService.getAllExpenses().subscribe(expense => {
      this.expense = expense;
      console.log(expense);
    });
   }

  ngOnInit(): void {
    
  }

  // https://material.angular.io/components/table/examples

}
