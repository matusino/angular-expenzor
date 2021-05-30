import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ExpenseModel } from '../expense-model';
import { ExpenseService } from '../expense.service';
import { ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { ChartOptions, ChartType } from 'chart.js';
import { BaseChartDirective, Label, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip, MultiDataSet, SingleDataSet } from 'ng2-charts';
import * as Chart from 'chart.js';
import { Router } from '@angular/router';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { LocalStorageService } from 'ngx-webstorage';
import { stringToKeyValue } from '@angular/flex-layout/extended/typings/style/style-transforms';
import * as fileSaver from 'file-saver';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-main-table',
  templateUrl: './main-table.component.html',
  styleUrls: ['./main-table.component.css']
})
export class MainTableComponent implements AfterViewInit {

  displayedColumns: string[] = ['date', 'value', 'category', 'description', 'delete'];
  expenseDb = [];
  expense = new MatTableDataSource<ExpenseModel>(this.expenseDb);
  faTrashAlt = faTrashAlt;
  expenseTotal = 0;
  incomeTotal = 0;
  percentage = '';
  negative: boolean;
  currentYear: number;
  choosenYear: number;
  isError: boolean;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  category = ["INCOME", "CLOTHING", "HOUSING", "FOOD", "GROCERIES", "COSMETICS", "UTILITIES", "LEISURE", "TRANSPORTATION", "HEALTH", "OTHER"];
  chart: Chart;

  constructor(private expenseService: ExpenseService, private router: Router, private localStorage: LocalStorageService, private toastr: ToastrService) {
    this.currentYear = new Date().getFullYear();
    this.choosenYear = new Date().getFullYear();
    this.expenseService.getAllExpenses(this.currentYear).subscribe(expense => {
      this.expenseDb = expense;
      this.expense.data = this.expenseDb;
      this.generateChart(this.expenseDb);
      this.getTotalExpense(this.expenseDb);
    });


  }

  generateChart(expense: ExpenseModel[]) {
    let housingData = 0;
    let clothingDta = 0;
    let groceriesData = 0;
    let cosmeticsData = 0;
    let leisureData = 0;
    let transportationData = 0;
    let healthData = 0;
    let otherData = 0;
    let foodData = 0;
    let utilitiesData = 0;
    let incomeData = 0;

    for (let i = 0; i < expense.length; i++) {
      if (expense[i].category === "CLOTHING") {
        clothingDta = clothingDta + expense[i].value;
      } else if (expense[i].category === "HOUSING") {
        housingData = housingData + expense[i].value;
      } else if (expense[i].category === "FOOD") {
        foodData = foodData + expense[i].value;
      } else if (expense[i].category === "GROCERIES") {
        groceriesData = groceriesData + expense[i].value;
      } else if (expense[i].category === "UTILITIES") {
        utilitiesData = utilitiesData + expense[i].value;
      } else if (expense[i].category === "COSMETICS") {
        cosmeticsData = cosmeticsData + expense[i].value;
      } else if (expense[i].category === "LEISURE") {
        leisureData = leisureData + expense[i].value;
      } else if (expense[i].category === "TRANSPORTATION") {
        transportationData = transportationData + expense[i].value;
      } else if (expense[i].category === "HEALTH") {
        healthData = healthData + expense[i].value;
      } else if (expense[i].category === "OTHER") {
        otherData = otherData + expense[i].value;
      } else if (expense[i].category === "INCOME") {
        incomeData = incomeData + expense[i].value;
      }
    }

    this.chart = new Chart('canvas', {
      type: 'pie',
      data: {
        labels: this.category,
        datasets: [{
          data: [incomeData, clothingDta, housingData, foodData, groceriesData, cosmeticsData, utilitiesData, leisureData, transportationData, healthData, otherData],
          backgroundColor: [
            'rgba(35, 189, 0, 1)',
            'rgba(186, 0, 189, 1)',
            'rgba(255, 84, 98, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(106, 90, 205)',
            'rgb(238, 130, 238)',
            'rgb(255, 165, 0)',
            'rgb(60, 179, 113)',
            'rgb(255, 0, 0)',
            'rgb(0, 0, 255)',
            'rgb(60, 60, 60)'
          ],
          borderWidth: 0.5
        }]

      },
      options: {
        title: {
          display: true,
          text: 'Expenses'
        }
      }
    });
  }

  public getAllExpenses(year: number) {
    this.expenseDb = [];
    this.choosenYear = year;
    this.expenseService.getAllExpenses(year).subscribe(expense => {
      if (expense == null) {
        this.toastr.error('No inputs for choosen year!');
      } else {
        this.expenseDb = expense;
        this.expense.data = this.expenseDb;
        this.chart.destroy();
        this.generateChart(this.expenseDb);
        this.getTotalExpense(this.expenseDb);
      }
    }
    );

  }

  public getExpenseByMonth(month: number) {
    this.expenseDb = [];
    this.expenseService.getExpenseByMonth(month, this.choosenYear, this.localStorage.retrieve('username')).subscribe(expense => {
      this.expenseDb = expense;
      this.expense.data = this.expenseDb;
      this.chart.destroy();
      this.generateChart(this.expenseDb);
      this.getTotalExpense(this.expenseDb);
    });
  }

  ngAfterViewInit() {
    this.expense.paginator = this.paginator;
    this.expense.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    this.expense.filter = filterValue.trim().toLowerCase();
  }

  deleteExpense(id: number) {
    this.expenseService.deleteExpenseById(id).subscribe(
      () => console.log("Expense deleted")
    );
    this.redirectTo('/home');
  }

  redirectTo(uri: string) {
    this.router.navigateByUrl('/test', { skipLocationChange: true }).then(() =>
      this.router.navigate([uri]));
  }

  getTotalExpense(expense: ExpenseModel[]) {
    this.expenseTotal = 0;
    this.incomeTotal = 0;
    this.percentage = '';
    for (let i = 0; i < expense.length; i++) {
      if (expense[i].value < 0) {
        this.expenseTotal = this.expenseTotal + expense[i].value;
      } else if (expense[i].value > 0) {
        this.incomeTotal = this.incomeTotal + expense[i].value;
      }
    }
    let expenseTemp = Math.abs(this.expenseTotal);
    if (this.incomeTotal === 0 && expenseTemp > 0) {
      this.percentage = '-100';
      this.negative = true;
    } else {
      let percentTemp = 100 - (100 * expenseTemp) / this.incomeTotal;
      this.percentage = percentTemp.toFixed(2);
      if (Number(percentTemp.toFixed(2)) < 0) {
        this.negative = true;
      } else {
        this.negative = false;
      }
    }
  }

  exportTable(month: number) {
    this.expenseService.exportTable(month, this.choosenYear).subscribe(response => {
      let blob: any = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      fileSaver.saveAs(blob, 'report.xlsx');

    }), error => console.log('Error downloading the file'),
      () => console.info('File downloaded successfully');

  }


}
