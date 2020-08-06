import { Component, OnInit, OnDestroy, OnChanges} from '@angular/core';
import { RestApiServiceService } from './services/rest-api-service.service'
import { StringServiceService } from './services/string-service.service'
import { Subscription } from 'rxjs'


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnDestroy, OnInit, OnChanges{
  public tableparse = {
    'tblGapDetail':'tblGapDetail',
    'tblGapHeader' : 'tblGapHeader',
    'tblHorizontalFlux':'tblHorizontalFlux',
    'tblLines':'tblLines',
    'tblLPIDetail':'tblLPIDetail',
    'tblLPIHeader':'tblLPIHeader',
    'tblPlots':'tblPlots',
    'tblSites':'tblSites',
    'tblSpecies':'tblSpecies',
    'tblSpeciesGeneric':'tblSpeciesGeneric'
  }
  tableCols = []
  tableData:{}[] = []
  subscription:Subscription;
  title = 'angdimatable';
  constructor(
    private str: StringServiceService,
    private api: RestApiServiceService
    ) {
      this.subscription = this.str.retrieveContent().subscribe(dropDownChoice => {
        this.tableData = []
        this.tableCols = []
        if (dropDownChoice) {
          
          
          this.api.getData(this.tableparse[dropDownChoice.data]).subscribe(data=>{
            this.tableCols = data['cols']
            this.tableData = data['data']
            })
        } else {
          this.tableCols = []
          this.tableData = []
        }
      })
    }
    ngOnChanges(){
      this.printdata()
    }
    printdata(){
      console.log(this.tableCols)
      console.log(this.tableData)
    }

    ngOnInit(){
      // this.onDropDownChange()
    }

    ngOnDestroy(){
      this.subscription.unsubscribe()
    }

}
