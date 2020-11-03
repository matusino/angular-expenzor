import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ExpenseModel } from '../expense-model';
import { ExpenseService } from '../expense.service';
import { ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { ChartOptions, ChartType } from 'chart.js';
import { BaseChartDirective, Label, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip, MultiDataSet, SingleDataSet } from 'ng2-charts';
import * as Chart from 'chart.js';



@Component({
  selector: 'app-main-table',
  templateUrl: './main-table.component.html',
  styleUrls: ['./main-table.component.css']
})
export class MainTableComponent implements AfterViewInit {


  displayedColumns: string[] = ['date', 'value', 'category', 'description'];
  expenseDb =[];
  expense = new MatTableDataSource<ExpenseModel>(this.expenseDb);


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  // https://www.positronx.io/angular-chart-js-tutorial-with-ng2-charts-examples/

  category = ["INCOME","CLOTHING", "HOUSING", "FOOD", "GROCERIES","COSMETICS","UTILITIES","LEISURE","TRANSPORTATION","HEALTH","OTHER"];
  chart: Chart;
  

  constructor(private expenseService: ExpenseService){
    this.expenseService.getAllExpenses().subscribe(expense => {
      this.expenseDb = expense;
      this.expense.data=this.expenseDb;
      this.generateChart(this.expenseDb);
    });
  }

  generateChart(expense: ExpenseModel[]){
    
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
      if(expense[i].category === "CLOTHING"){
        clothingDta = clothingDta + expense[i].value;
      }else if (expense[i].category === "HOUSING"){
        housingData = housingData + expense[i].value;
      }else if(expense[i].category ==="FOOD"){
        foodData = foodData + expense[i].value;
      }else if(expense[i].category ==="GROCERIES"){
        groceriesData = groceriesData + expense[i].value;
      }else if(expense[i].category ==="UTILITIES"){
        utilitiesData = utilitiesData + expense[i].value;
      }else if(expense[i].category ==="COSMETICS"){
        cosmeticsData = cosmeticsData + expense[i].value;
      }else if(expense[i].category ==="LEISURE"){
        leisureData = leisureData + expense[i].value;
      }else if(expense[i].category ==="TRANSPORTATION"){
        transportationData = transportationData + expense[i].value;
      }else if(expense[i].category ==="HEALTH"){
        healthData = healthData + expense[i].value;
      }else if(expense[i].category ==="OTHER"){
        otherData = otherData + expense[i].value;
      }else if(expense[i].category ==="INCOME"){
        incomeData = incomeData + expense[i].value;
      }
    }

    this.chart = new Chart('canvas',{
      type:'pie',
      data:{
        labels:this.category,
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

  public getAllExpenses() {
    this.expenseService.getAllExpenses().subscribe(expense => {
      this.expenseDb = expense;
      this.expense.data=this.expenseDb;
      this.chart.destroy();
      this.generateChart(this.expenseDb);
    });
   }


  //  https://dzone.com/articles/create-charts-in-angular-8-application-using-chart
   public getExpenseByCategory(category: string) {
     this.expenseDb=[];
    this.expenseService.getExpenseByCategory(category).subscribe(expense => {
      this.expenseDb = expense;
      this.expense.data=this.expenseDb;
    });
    
   } 

   public getExpenseByMonth(month: number) {
    this.expenseDb=[];
   this.expenseService.getExpenseByMonth(month).subscribe(expense => {
     this.expenseDb = expense;
     this.expense.data=this.expenseDb;
     this.chart.destroy();
     this.generateChart(this.expenseDb);
   });
  }

  ngAfterViewInit() {
    this.expense.paginator = this.paginator;
    this.expense.sort = this.sort;
  }

  applyFilter(filterValue: string){
    this.expense.filter = filterValue.trim().toLowerCase();
  }
}
