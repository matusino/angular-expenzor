import { ExpenseCategory } from './expense-category';

export interface AddNewExpense{
  category: string,
  date: Date,
  description: string,
  value: number
}