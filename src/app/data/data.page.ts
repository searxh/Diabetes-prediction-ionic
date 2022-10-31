import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { DataProviderService } from '../data-provider.service';
import { Chart, registerables } from 'chart.js';
import { Observable } from 'rxjs';
import { Model } from '../../../src/models/models.model';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-data',
  templateUrl: './data.page.html',
  styleUrls: ['./data.page.scss'],
})
export class DataPage implements OnInit {

  public corr_data$: Observable<Model>;
  public query_data: any = [];
  public inf_counter: number = 0;
  public corr_card: Boolean = true;
  public variables: any = [
    'Diabetes','High BP','High Chol','Chol Check','BMI','Smoker','Stroke','Heart Dis','Exercise','Fruits',
    'Vegetables','Alcohol','Hlth Care','Med Cost','Gen Hlth','Men Hlth','Phy Hlth','Diff Walk',
    'Sex','Age','Education','Income'
  ];
  public param: any = ['0','0','0','1','2','2'];
  public extracted_corr: any = [0,0,0];
  public submitted_time: number = 0;
  public submitted_time1: number = 0;

  public filter_param: string;
  public filter_op: string;
  public filter_value: number;

  public sort_param: string;
  public sort_by: string;
  public show_data: Boolean = false;

  constructor(private dataProvider:DataProviderService) {
    Chart.register(...registerables);
  }

  ngOnInit() {
  }
  ngAfterViewInit() {
    this.barChartMethod();
    this.barChart.destroy();
  }
  set() {
    this.sort_param=undefined
    this.sort_by=undefined
  }
  get_corr() {
    this.corr_data$=this.dataProvider.get_corr_data(this.param);
    this.corr_data$.pipe(take(1)).subscribe((val:any)=>{
      this.extracted_corr=val.data;
      this.extracted_corr=this.corrData();
      if (this.submitted_time!=0) {
        this.barChart.destroy();
      }
      this.barChartMethod();
      this.submitted_time++;
    });
  }
  corrData() {
    var ret = [Number(this.extracted_corr[0]),Number(this.extracted_corr[1]),Number(this.extracted_corr[2])];
    return ret;
  }
  queryData(event) {
    console.log('request query data')
    this.dataProvider.getQuery(
      this.query_data,this.filter_param,this.filter_op,
      this.filter_value,this.sort_param,this.sort_by,
      this.inf_counter*20,event)
    this.inf_counter++;
  }
  refresh_qd(event) {
    console.log('refresh query data')
    console.log(this.submitted_time);
    this.query_data=[];
    this.inf_counter=0;
    this.queryData(event);
    this.show_data=true;
    this.submitted_time1++;
  }

  @ViewChild('barCanvas', {static: true}) 
  private barCanvas: ElementRef;
  barChart: any;

  refreshChart() {
    console.log(this.param);
    console.log('refresh chart');
    this.get_corr();
    this.corr_card=false;
  }

  barChartMethod() {
    // Now we need to supply a Chart element reference with an object that defines the type of chart we want to use, and the type of data we want to display.
    this.barChart = new Chart(this.barCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: ['A', 'B', 'C'],
        datasets: [{
          label: 'Correlation Values',
          data: this.extracted_corr,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(255, 206, 86, 0.2)',
          ],
          borderColor: [
            'rgba(255,99,132,1)',
            'rgba(255, 159, 64, 1)',
            'rgba(255, 206, 86, 1)',
          ],
          borderWidth: 1
        }]
      },
      options: {

      }
    });
  }

}
