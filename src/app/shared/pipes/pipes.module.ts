import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataFilterPipeModule } from '@app/shared/pipes/data-filter/data-filter-pipe.module';
import { LeaveStatusFormatModule } from '@app/shared/pipes/leave-status/leave-status-pipe.module';
import { NatureOfJobPipeModule } from './nature-of-job/nature-of-job-pipe.module';
import { ObservationBeforeMaintenancePipeModule } from './observation-before-maintenance/observation-before-maintenance-pipe.module';


@NgModule({
  imports: [
    CommonModule,
    DataFilterPipeModule,
    LeaveStatusFormatModule,
    NatureOfJobPipeModule,
    ObservationBeforeMaintenancePipeModule
  ],
  declarations: [
  ],
  exports:[
          
  ]
})
export class PipesModule { }
