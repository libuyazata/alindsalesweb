import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ObservationBeforeMaintenancePipe } from './observation-before-maintenance.pipe';


@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
      ObservationBeforeMaintenancePipe
  ],
  exports:[
    ObservationBeforeMaintenancePipe
  ]
})
export class ObservationBeforeMaintenancePipeModule { }