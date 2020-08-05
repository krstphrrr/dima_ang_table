import { Component, OnDestroy, OnInit, ViewChild, Input, OnChanges, ChangeDetectorRef, AfterViewInit} from '@angular/core';
import { StringServiceService } from '../services/string-service.service'
import { Subscription, BehaviorSubject, ObjectUnsubscribedError} from 'rxjs'
import { RestApiServiceService } from '../services/rest-api-service.service'
import { MatTableDataSource } from '@angular/material/table'
import {MatSort} from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

import {FormControl} from '@angular/forms';


interface Filters {
  name:string;
  open:boolean;
}


@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnDestroy, OnInit, OnChanges, AfterViewInit {

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator:MatPaginator;
  @Input('tableColumns')tableCols:string[]=[]
  @Input()tableData:{}[]=[];
  headerText: string;
  limit:number = 10;
  skip:number = 0;
  totalLength:number = 0;
  pageIndex : number = 0;
  pageLimit:number[] = [5, 10, 20, 100] ;

  // FOR FILTER PANEL
  filterArray:Filters[]=[]
  panelOpenState: boolean = false;
  toggleOutput: string;
  clickButton:boolean;
  filterValues:{}={}
  colFilter = new FormControl('')

  @Input() justClicked:string;
  tableDataSrc:any

  output:any[]=[];
  subscription:Subscription;
  
  

  constructor(
    
    private str: StringServiceService,
    private api: RestApiServiceService
    ) {
    //subscribe to dropdown component  changes 
    this.justClicked = ''
    this.subscription = this.str.retrieveContent().subscribe(message => {
      this.refresh()

    });
}
  refresh(){
    this.api.data$.subscribe(newData=>{
      this.tableDataSrc = new MatTableDataSource(newData['data'])
      this.tableDataSrc.sort = this.sort
      this.tableDataSrc.paginator = this.paginator
    })
    
  }
  ngAfterViewInit(){

  }
  ///////////////////////////////////////////
  // FUNCTIONS TO BUILD AND TEST FILTER PANEL
  togglePanel(string) {
    // toggles expand/close of lower panel
    console.log(string)
    this.toggleOutput=string
    this.panelOpenState = !this.panelOpenState
  }
  AddNewRow(string) {
    
    this.filterArray.push({name: string, open: false});
  }

  removeRow(string){
    this.clickButton = true;
    console.log(this.filterArray, string, "before")
    let something = this.filterArray.filter(function(obj){
      return obj.name != string;
    })
    this.filterArray = something
  }

  arrayRemove(arr,val){


  }

  ///////////////////////////////////////////

  onSearchInput(ev){
    console.log(this.tableDataSrc)
    const searchTarget = ev.target.value;
    this.tableDataSrc.filter = searchTarget.trim().toLowerCase()
  }
  ngOnInit(){
    this.refresh()
    this.colFilter.valueChanges
     .subscribe(
       field => {
         this.filterValues[`${this.justClicked}`] = field
       }
     )
    // this.printdata()
  }
  changePage(event){
    // console.log(this.tableDataSrc)
    if(this.totalLength > this.tableDataSrc.data.length){
       if(this.pageIndex < event.pageIndex){
        // next page
        this.skip = this.skip + this.limit;
      }
    }
  }


  printdata(){
    console.log(this.tableCols)
    console.log(this.tableData['item'])
  }
  ngOnChanges(){    
    // // this.printdata()
    // this.ngOnInit()
    // console.log(this.sort)
  }


  ngOnDestroy(){
    this.subscription.unsubscribe()
  }

}
