import { Component, OnInit } from '@angular/core';
import { DataProviderService } from '../data-provider.service';
import { Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-detect',
  templateUrl: './detect.page.html',
  styleUrls: ['./detect.page.scss'],
})
export class DetectPage implements OnInit {
  public answers = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
  public weight: number;
  public height: number;
  constructor(
    private dataProvider: DataProviderService,
    private router: Router) { }
  ngOnInit() {
  }
  bmi_cal() {
    var ans:number = (this.weight/(this.height*this.height))*10000;
    var final:any = ans.toFixed();
    this.answers[3]= final;
    return final;
  }
  bmi_check() {
   if (this.weight != null && this.height != null) {
     return true
   } else {
     return false
   }
  }
  redirect() {
    let navigationExtras: NavigationExtras = {
      state: {data:this.answers}
    };
    this.router.navigate(['home'], navigationExtras);
  }

}
