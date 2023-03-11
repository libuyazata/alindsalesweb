import { Component, Input, OnInit, EventEmitter, Output, OnChanges } from '@angular/core';
import { BaseComponent } from '@app/core/component/base.component';
import { ActivatedRoute } from '@angular/router';
import { AlertNotificationService } from '@app/shared/services/alertnotification.service';
import { GeneralInfoService } from '@app/general-info/general-info.service';

@Component({
  selector: 'designation-general-info',
  templateUrl: './designation-general-info.component.html',
  styleUrls: ['./designation-general-info.component.scss']
})
export class DesignationGeneralInfoComponent extends BaseComponent implements OnInit, OnChanges {

  @Input() materialRequestData : any;
  @Output() materialRequestSaved = new EventEmitter();

  constructor(private generalInfoService:GeneralInfoService,
              private alertService : AlertNotificationService,
              private route: ActivatedRoute) {
    super(generalInfoService);
  }

  

  ngOnInit() {
    this.initialize(); 
    
  }

  ngOnChanges() {

  }

  ngAfterViewInit(){

  }

 
  private initialize(){  

  }

 

}
