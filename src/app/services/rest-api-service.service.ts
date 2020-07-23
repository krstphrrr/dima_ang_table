import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class RestApiServiceService {
  private api = environment.API_URL
  tables = environment.TABLE_URL

  private observable:Observable<any>;
  data$ : BehaviorSubject<any> = new BehaviorSubject({})
  private extractData(res:Response){
    let body=res;
    return body || {};
  }
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':'application/json'
    })
  }

  constructor(private httpClient: HttpClient) { }

  getData(choice){
    // getData(choice){
    this.data$ = new BehaviorSubject({})
    let newString = `${this.api}/api/${choice}`
    this.httpClient.get(newString, this.httpOptions).toPromise().then(
      res=>{
        let complete={}
        let cols=[]
        let data= res
        for(let [key,value] of Object.entries(res[0])){
          cols.push(key)
        }
        complete['cols'] = cols
        complete['data'] = data
        this.data$.next(complete)
      })
      return this.data$
  }

  getTables(){

    return this.httpClient.get(this.tables, this.httpOptions).pipe(
      map(this.extractData)
    )
  }
}
