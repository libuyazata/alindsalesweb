import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';

import { HomeService } from './home.service';
import { Chart } from 'angular-highcharts';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  chart:any;
  dashboardData:any;
  intervalId:any;

  pendingCalls: Array<any>;
  onGoingCalls: Array<any>;
  completedCalls: Array<any>;
  nonAllottedCalls: Array<any>;
  
  constructor(private homeService: HomeService, private datePipe: DatePipe) {
  }

  ngOnInit() {  
    this.getAdminDashBoard();
    this.intervalId = setInterval(() => {
      this.getAdminDashBoard(); 
    }, 60000);
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  public getEmployeeNameTitles(emp:any){
    let title = null;
    if(emp && emp.length > 0){
       title = emp.map((item:any)=> item.fullName);
       title = title.join(',');
    }
    return title;
  }

  protected renderLast30DaysAttendanceTrend(emp30DaysTrend:any) {
    this.chart = new Chart({
      chart: {
        type: 'column'
      },
      title: {
        text: 'Last 30 days Attendance Trend'
      },
      subtitle: {
        text: ''
      },
      xAxis: {
        type: 'category'
      },
      yAxis: {
        title: {
          text: 'Number of employees present'
        }
    
      },
      legend: {
        enabled: false
      },
      plotOptions: {
        // series: {
        //   borderWidth: 0,
        //   dataLabels: {
        //     enabled: true,
        //     format: '{point.y:.1f}'
        //   }
        // }
      },
    
      tooltip: {
        headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
        //pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> of total<br/>'
      },
    
      "series": [
        {
          "name": "Employees Present",
          //"colorByPoint": false,
          "data": emp30DaysTrend
        }
      ]
    });
  }

  protected convertToChartData(dataList:any) {
    let employeesData = [];
    for (let index=0; index < dataList.length; index++) {
      employeesData.push({
        "name" : this.datePipe.transform(dataList[index].dayDate, "dd MMM yyyy"),
        "y" : dataList[index].presentEmployeeCount
      })
    }
    return employeesData;
  }

  // protected getLeaveAlerts(){
  //   let params = { "year" : new Date().getFullYear() };
  //   this.homeService.getLeaveAlerts(params).subscribe((resp:any)=>{
  //     this.leaveAlerts = resp.allAlert;
  //   });
  // }

  protected getAdminDashBoard() {
    this.homeService.getAdminDashboardData().subscribe((resp:any) => {
      if(resp.dashBoardVariables != null){
        this.dashboardData = resp.dashBoardVariables;
        this.completedCalls = resp.dashBoardVariables.completedCalls;
        this.onGoingCalls = resp.dashBoardVariables.onGoingCalls;
        this.pendingCalls = resp.dashBoardVariables.pendingCalls;
        this.nonAllottedCalls = resp.dashBoardVariables.nonAllottedCalls;
      }
    })
  }

  protected getCompletedCalls() {
    this.homeService.getCompletedCalls().subscribe((resp:any) => {
      
    })
  }

  protected getOnGoingCalls() {
    this.homeService.getOnGoingCalls().subscribe((resp:any) => {
      
    })
  }

  protected getNonAllottedCalls() {
    this.homeService.getNonAllottedCalls().subscribe((resp:any) => {
      
    })
  }
}
