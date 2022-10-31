import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Model } from '../../src/models/models.model';

@Injectable({
  providedIn: 'root'
})
export class DataProviderService {
  public ngrok: string = "http://86af-35-231-142-85.ngrok.io"
  constructor(public http:HttpClient) { }

  getQuery(listData,filter_param,filter_op,filter_value,sort_param,sort_by,id,event) {
    var link:string = this.ngrok+"/query_data?";
    link += 'filp='+filter_param+"&";
    link += 'filo='+filter_op+"&";
    link += 'filv='+filter_value+"&";
    link += 'sortp='+sort_param+"&";
    link += 'sortb='+sort_by+"&";
    link += 'id='+id;
    console.log(link)
    this.http.get(link).subscribe(data=>
      {
        for(let i=0; i < data['data'].length; i++) {
          console.log(data['data'][i]);
          listData.push(data['data'][i]);
        }
      }
    );
    if (id != 0) {
      event.target.complete();
    }
  }
  getPredict(data:any) {
    var i:number
    var link:string = this.ngrok+"/get_prediction?"
    for(i=1;i<22;i++) {
      if (i<21) {
        link += "q"+i+"="+data[i-1]+"&";
      } else {
        link += "q"+i+"="+data[i-1];
      }
    }
    console.log(link)
    return this.http.get<Model>(link)
  }

  get_history_data(listData) {
    this.http.get(this.ngrok+'/get_history').subscribe(data=>
      {
        for(let i=0; i < data['data'].length; i++) {
          console.log(data['data'][i]);
          listData.push(data['data'][i]);
        }
      }
    );
   }

  get_corr_data(data:any) {
    var link:string = this.ngrok+"/get_corr?"
    for(var i=0;i<6;i++) {
      if (i<5) {
        link += "p"+i+"="+data[i]+"&";
      } else {
        link += "p"+i+"="+data[i];
      }
    }
    return this.http.get<Model>(link)
  }
}
