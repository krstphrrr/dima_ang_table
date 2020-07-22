import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RestApiServiceService {
  private api = 'http://localhost:5005'
  tables = 'http://localhost:5005/tables'
  private observable:Observable<any>;
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

  // getData(choice):Observable<any[]>{
    getData(choice){
      
    let newString = `${this.api}/api/${choice}`
    console.log(newString) 
    // return this.httpClient.get<any[]>(this.api+choice)
  }

  getTables(){
    // let tmpArray:any
    return this.httpClient.get(this.tables, this.httpOptions).pipe(
      map(this.extractData)
    )
    // console.log(this.data)
    // return tmpArray

  }
}
