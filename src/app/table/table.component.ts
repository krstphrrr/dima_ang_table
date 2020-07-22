import { Component, OnDestroy} from '@angular/core';
import { StringServiceService } from '../services/string-service.service'
import { Subscription } from 'rxjs'
import { RestApiServiceService } from '../services/rest-api-service.service'


@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnDestroy {
  output:any[]=[];
  subscription:Subscription;
  public tableparse = {
    'tblGapDetail':'gapdetails',
    'tblGapHeader' : 'gapheader',
    'tblHorizontalFlux':'horizontalflux',
    'tblLines':'lines',
    'tblLPIDetail':'lpidetails',
    'tblLPIHeader':'lpiheader',
    'tblPlots':'plots',
    'tblSites':'sites',
    'tblSpecies':'species',
    'tblSpeciesGeneric':'speciesgeneric'
  }

  constructor(
    private str: StringServiceService,
    private api: RestApiServiceService
    ) {
    //subscribe to dropdown component  changes 
    this.subscription = this.str.retrieveContent().subscribe(message => {
      if (message) {
        this.clearContent()
        console.log(message.data)
        this.api.getData(this.tableparse[message.data])
        this.output.push(message)
      } else {
        // clear messages when empty message received
        this.output = [];
      }
    });
}
  // public input:string = '';

  // public onInput(event){
  //   this.input = event.currentTarget.value;
  //   this.str.input = event.currentTarget.value
  // }
  clearContent(){
    this.output = []
  }

  ngOnDestroy(){
    this.subscription.unsubscribe()
  }
}
