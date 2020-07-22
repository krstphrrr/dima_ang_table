import { Observable, Subject, of } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StringServiceService {

  private subject = new Subject();

  sendContent(content:string){
    // console.log(content)
    this.subject.next({data:content})
  }

  retrieveContent():Observable<any>{

    return this.subject.asObservable()
  }
}
