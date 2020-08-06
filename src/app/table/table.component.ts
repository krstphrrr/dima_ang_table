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
interface Options{
  name:string;
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

  // FOR FILTER PANEL ////////
  filterArray:Filters[]=[]
  panelOpenState: boolean = false;
  toggleOutput: string;
  clickButton:boolean;
  filterValues:{}={}
  colFilter = new FormControl('')
  isTarget:any
  tempSet:Filters[]
  tempSet2:Options[]

  dropdownKeys:{}[]
  ////////////////////////////

  tableDataSrc:any

  output:any[]=[];
  subscription:Subscription;
  
  

  constructor(
    
    private str: StringServiceService,
    private api: RestApiServiceService
    ) {
    //subscribe to dropdown component  changes 
    this.subscription = this.str.retrieveContent().subscribe(message => {
      this.refresh()

    });
}

  refresh(){
    this.tempSet = [] // emptying added filters on reload
    this.filterArray = []
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
    // testing dropdown functionality
    switch(string){
      case 'SiteKey':
        this.dropdownKeys = [] 
        this.tempSet2 = []
        this.dropdownKeysetup(string)
        break;
      case 'PrimaryKey':
        this.dropdownKeys = [] 
        this.tempSet2 = []
        this.dropdownKeysetup(string)
        break;
    }
    // adding only objects with unique 'name'(columns) to filterArray
    // so the filters appear only once:
    // https://codeburst.io/javascript-array-distinct-5edc93501dc4
    this.tempSet.push({name: string, open: false})
    let newSet = Array.from(new Set(this.tempSet.map(s=>s.name)))
      .map(name =>{
        return{
          name:name,
          open: this.tempSet.find(s=>s.name===name).open
        }
      })
      this.filterArray = newSet
    
  }

  removeRow(string){
    this.clickButton = true;
    console.log(this.filterArray, string, "before")
    let arrayWithout_item = this.filterArray.filter(function(obj){
      return obj.name != string;
    })
    let trimTemp = this.tempSet.filter(function(obj){
      return obj.name != string;
    })
    this.filterArray = arrayWithout_item
    this.tempSet = trimTemp
    this.resetFilter()
    
  }
  setupFilter(column:string){
    // console.log(column)
    this.tableDataSrc.filterPredicate = (d:MatTableDataSource<any>, filter:string)=>{
      const textToSearch = d[column].toLowerCase() || '';
      return textToSearch.indexOf(filter) !== -1;
    }
    console.log(this.tableDataSrc.filterPredicate)
  }
  applyFilter(filterValue:string){
    this.tableDataSrc.filter = filterValue.trim().toLowerCase()
  }
  resetFilter(){
    console.log(this.tableDataSrc.filter)
    this.tableDataSrc.filter = ''
  }

  dropdownKeysetup(string){ 
    
    this.tableData.forEach((item)=>{

      // console.log(item[string])
      this.tempSet2.push({name: item[string]})
      let newSet = Array.from(new Set(this.tempSet2.map(s=>s.name)))
      .map(name =>{
        return{
          name:name
        }
      })
      this.dropdownKeys= newSet
      // if(!this.siteKey.includes(item['SiteKey'])){
      //   this.siteKey.push(item['SiteKey'])
      // }
    }) 
  }
  sendSelection(string){
    const searchTarget = string.value
    this.tableDataSrc.filter = searchTarget.trim().toLowerCase()
  }

  ///////////////////////////////////////////

  onSearchInput(ev){
    console.log(this.tableDataSrc)
    // this.colFilter = ev.target.value
    const searchTarget = ev.target.value;
    this.tableDataSrc.filter = searchTarget.trim().toLowerCase()
  }
  ngOnInit(){
    this.refresh()
    // this.colFilter.valueChanges
    //  .subscribe(
    //    field => {
    //      console.log(field)
    //     //  this.filterValues[`${this.justClicked}`] = field
    //    }
    //  )
    // // this.printdata()
  }
  changePage(event){

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

  }


  ngOnDestroy(){
    this.subscription.unsubscribe()
  }

}
