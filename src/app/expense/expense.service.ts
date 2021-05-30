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

  getAllExpenses(currentYear: number): Observable<ExpenseModel[]>{
    return this.http.get<ExpenseModel[]>('http://localhost:8080/expenses/' + currentYear)
  }

  addNewExpense(addNewExpense: AddNewExpense): Observable<any>{
    return this.http.post('http://localhost:8080/expenses', addNewExpense, {responseType:'text'});
  }

  getExpenseByCategory(category: string): Observable<Array<ExpenseModel>>{
    return this.http.get<Array<ExpenseModel>>('http://localhost:8080/expenses/' + category);
  }

  getExpenseByMonth(month: number, year: number, username: string): Observable<Array<ExpenseModel>>{
    return this.http.get<Array<ExpenseModel>>('http://localhost:8080/expenses/' + month + '/' + year + '/' + username);
  }

  deleteExpenseById(id: number): Observable<void> {
    return this.http.delete<void>('http://localhost:8080/expenses/' + id);
  }

  exportTable(month: number, year: number): any {
    return this.http.get('http://localhost:8080/expenses/xls/' + month + '/' + year, {responseType: 'blob'});
  }

}
