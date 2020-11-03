import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { ExpenseModel } from './expense-model';
import { AddNewExpense } from '../expense/add-expense/ad-new-expense';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {

  constructor(private http: HttpClient) { }

  getAllExpenses(): Observable<ExpenseModel[]>{
    return this.http.get<ExpenseModel[]>('http://localhost:8080/expense/get-all')
  }

  addNewExpense(addNewExpense: AddNewExpense): Observable<any>{
    return this.http.post('http://localhost:8080/expense/add', addNewExpense, {responseType:'text'});
  }

  getExpenseByCategory(category: string): Observable<Array<ExpenseModel>>{
    return this.http.get<Array<ExpenseModel>>('http://localhost:8080/expense/get/' + category);
  }

  getExpenseByMonth(month: number): Observable<Array<ExpenseModel>>{
    return this.http.get<Array<ExpenseModel>>('http://localhost:8080/expense/get/expenses/' + month);
  }
}
