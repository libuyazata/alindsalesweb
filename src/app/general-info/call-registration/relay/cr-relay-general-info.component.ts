import { Component, Input, OnInit, EventEmitter, Output, OnChanges } from '@angular/core';
import { BaseComponent } from '@app/core/component/base.component';
import { ActivatedRoute } from '@angular/router';
import { AlertNotificationService } from '@app/shared/services/alertnotification.service';
import { GeneralInfoService } from '@app/general-info/general-info.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'cr-relay-general-info',
  templateUrl: './cr-relay-general-info.component.html',
  styleUrls: ['./cr-relay-general-info.component.scss']
})
export class CrRelayGeneralInfoComponent extends BaseComponent implements OnInit, OnChanges {

   //#region Public Variables
  //Form Data Variable
  public addItemForm: FormGroup;

  public itemList: Array<any>;

  //Status variables
  public isFormVisible : boolean = false;
  public isEdit : boolean = false;
  public isFormSubmitInitiated : boolean = false;

  public itemName: string = "Relay";
  //#endregion

  //#region events and constructor
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
  //#endregion

  //#region public function
  deleteItem(item: any) {
    let params = {
      relayId : item.relayId
    };
    this.alertService.showPermenantDeleteConfirmation(this, "relay", this.onConfirmDelete, params);
  }

  public onConfirmDelete(_self: any, params: any) {
    _self.generalInfoService.deleteRelay(params).subscribe((resp: any) => {
      let deleteStatus = resp.status == "success";
      _self.alertService.showDeleteStatus("relay", deleteStatus);
      _self.getItemList();
    });
  }

  editItem(item: any) {
    this.isEdit = true;
    this.isFormVisible = true;
    this.initializeForm(item);
  }

  resetForm() {
    this.addItemForm.reset();
  }

  onAddItem() {
    this.isFormSubmitInitiated = true;
    if( this.addItemForm.valid ) {
      let submitData = this.addItemForm.value;

      let params : {[k : string]: any}= {
        relayName : submitData.relayName,
        description : submitData.description
      }

      if(this.isEdit) {
        params.relayId = submitData.relayId
      }
      
      this.generalInfoService.saveOrUpdateRelay(params).subscribe((resp:any)=>{      
        if(resp.status == "success") {
          this.alertService.showSaveStatus("relay", true);
          this.resetForm();
          this.clearForm();
          this.getItemList();
        } else {
          this.alertService.showSaveStatus("relay", false);
        }
      });

    
    }
  };

  openCreateForm() {
    this.isFormVisible = true;
    this.isEdit = false;

    this.initializeForm(null)
  }

  closePopup() {
    this.clearForm();
    this.resetForm();
  }
  //#endregion

  private initialize() {
    this.getItemList()
  }

  private getItemList() {
    let params = {}
    this.generalInfoService.getRelayList(params).subscribe((resp:any)=>{      
      this.itemList = resp["relayDetails"];
    });
  }

  private clearForm() {
    this.isEdit = false;
    this.isFormVisible = false;
    this.isFormSubmitInitiated = false;
  }

  private initializeForm(data: any) {
    this.addItemForm = new FormGroup({
      relayId : new FormControl((null != data ? data.relayId : '')),
      relayName : new FormControl((null != data ? data.relayName : ''), Validators.required),
      description : new FormControl((null != data ? data.description : ''))
    });
  }

  // Convenience getter for easy access to attendance form fields.
  get itemForm() { return this.addItemForm.controls; }

}
