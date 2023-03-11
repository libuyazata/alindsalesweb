import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NatureOfJobPipe } from './nature-of-job.pipe';


@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
      NatureOfJobPipe
  ],
  exports:[
    NatureOfJobPipe
  ]
})
export class NatureOfJobPipeModule { }