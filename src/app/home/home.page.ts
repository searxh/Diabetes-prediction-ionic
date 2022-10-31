import { Component, ElementRef, ViewChild } from '@angular/core';
import { DataProviderService } from '../data-provider.service';
import { Observable } from 'rxjs';
import { Model } from '../../../src/models/models.model';
import { Chart, registerables } from 'chart.js';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { IonContent } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  public input: String;
  public input1: String;
  public status$: Observable<Model>;
  public data$: Observable<Model>;
  public prediction$: Observable<Model>;

  public answers: any;
  public diabetes: any = [0,1,1,0];
  public pred_dis: any = ['Predicted Status:','Estimated Chance:','Estimated Chance:','Risk Percentile:'];
  public predict_card: Boolean = true;
  public submitted_time: number = 0;

  public history_data: any = [];
  public trigger_history:boolean = false;

  constructor(private dataProvider: DataProviderService,
    private route: ActivatedRoute,
    private router: Router) {
    Chart.register(...registerables);
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state != null) {
        this.answers = this.router.getCurrentNavigation().extras.state.data;
        this.get_predict();
        this.toggle_predict();
      }
    });
  }
  get_predict() {
    this.prediction$ = this.dataProvider.getPredict(this.answers);
    this.prediction$.pipe(take(1)).subscribe((val:any)=>{
      this.diabetes=val.data;
      this.scroll_top();
      if (this.submitted_time!=0) {
        this.destroyChart();
      }
      this.doughnutChartMethod();
      this.submitted_time++;
    });
  }
  toggle_predict() {
    this.predict_card=false;
    console.log(this.predict_card);
  }
  riskData() {
    var final:any = (Math.round(this.diabetes[1]*100*100)/100).toFixed(2);
    var final1:any = (Math.round(this.diabetes[2]*100*100)/100).toFixed(2);
    this.diabetes[3] = Number((this.diabetes[3]/100).toFixed(2));
    console.log([Number(final),Number(final1)]);
    return [Number(final),Number(final1)];
  }
  scroll_top() {
    this.content.scrollToTop(1500);
  }
  update_number() {
    var i:number = 0;
    for(i=0;i<this.history_data.length;i++) {
      this.history_data[i].b=Number(this.history_data[i].b.toFixed(2))
    }
    console.log(this.history_data);
    this.trigger_history=true;
    return false
  }

  @ViewChild(IonContent, { static: false }) 
  content: IonContent;
  @ViewChild('doughnutCanvas', {static: true}) 
  private doughnutCanvas: ElementRef;

  doughnutChart: any;
  showData=[];

  // When we try to call our chart to initialize methods in ngOnInit() it shows an error nativeElement of undefined. 
  // So, we need to call all chart methods in ngAfterViewInit() where @ViewChild and @ViewChildren will be resolved.
  ionViewDidEnter() {
    //this.dataProvider.getData(this.showData,this.lineChart);
    this.history_data = [];
    this.dataProvider.get_history_data(this.history_data);
  }
  destroyChart() {
    this.doughnutChart.destroy();
  }

  doughnutChartMethod() {
    this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {
      type: 'doughnut',
      data: {
        labels: ['No Diabetes', 'Diabetes'],
        datasets: [{
          label: 'Estimated Chances',
          data: this.riskData(),
          backgroundColor: [
            'rgba(156, 204, 101, 0.2)',
            'rgba(255, 99, 132, 0.2)',
          ],
          hoverBackgroundColor: [
            '#90E654',
            '#FF6384',
          ]
        }]
      }
    });
  }
}
