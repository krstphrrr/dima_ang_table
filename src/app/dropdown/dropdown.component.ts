import { Component, OnInit, AfterContentInit, DoCheck, AfterContentChecked } from '@angular/core';
import { StringServiceService } from '../services/string-service.service'
import { RestApiServiceService } from '../services/rest-api-service.service'
import { map } from 'rxjs/operators'
interface Tables {
  value: string;
  pathName: string;
}


@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.css']
})
export class DropdownComponent implements OnInit, AfterContentInit, DoCheck, AfterContentChecked{
 
  tables: Tables[]
  empty_list = []
  selected;

  constructor(
    private str: StringServiceService,
    private api: RestApiServiceService
  ) {

   }

  sendContent(content){
    // console.log(content.value)

    this.str.sendContent(content.value)
  }
  ngOnInit(){
    this.selected = this.api.getTables()
  //   for(const tbl in this.selected){
  //     console.log(this.selected[tbl])
  //     let tmp = {value:this.selected[tbl], pathName:this.tableparse[this.selected[tbl]]}
  //     // console.log(tmp)
  //     this.tables.push(tmp)  
    
  // }
    
  }
  ngAfterContentInit(){
    console.log('aftercontent init')
  }

  ngAfterContentChecked(){
    // console.log(this.selected)

     


  }
  ngDoCheck(){
    // if(this.selected){
    //   console.log(this.selected)
    // }
  }
  getTables(){
    this.api.getTables().subscribe(result=>{
      this.selected = result
    })
  }


}
