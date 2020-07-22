import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class StringServiceService {
  // list$ : BehaviorSubject<ProjectModel[]> = new BehaviorSubject([]);
  private subject = new Subject();

  sendContent(content:string){
    // console.log(content)
    this.subject.next({data:content})
  }

  retrieveContent():Observable<any>{

    return this.subject.asObservable()
  }

  sendTableData(content:{}[]){
    this.subject.next({data:content})
  }

  
}
