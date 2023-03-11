import { Component, Input, OnInit, EventEmitter, Output, OnChanges } from '@angular/core';
import { BaseComponent } from '@app/core/component/base.component';
import { ActivatedRoute } from '@angular/router';
import { AlertNotificationService } from '@app/shared/services/alertnotification.service';
import { GeneralInfoService } from '@app/general-info/general-info.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'mr-courier-general-info',
  templateUrl: './mr-courier-general-info.component.html',
  styleUrls: ['./mr-courier-general-info.component.scss']
})
export class MrCourierGeneralInfoComponent extends BaseComponent implements OnInit, OnChanges {
 //#region Public Variables
  //Form Data Variable
  public addItemForm: FormGroup;

  public itemList: Array<any>;

  public categoryList : any[];

  //Status variables
  public isFormVisible : boolean = false;
  public isEdit : boolean = false;
  public isFormSubmitInitiated : boolean = false;

  public itemName: string = "Courier Service";
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
      courierServiceId : item.courierServiceId
    };
    this.alertService.showPermenantDeleteConfirmation(this, this.itemName.toLowerCase(), this.onConfirmDelete, params);
  }

  public onConfirmDelete(_self: any, params: any) {
    _self.generalInfoService.deleteCourier(params).subscribe((resp: any) => {
      let deleteStatus = resp.status == "success";
      _self.alertService.showDeleteStatus(_self.itemName.toLowerCase(), deleteStatus);
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

      let params = this.getPreparedParams(submitData);

      this.generalInfoService.saveOrUpdateCourier(params).subscribe((resp:any)=>{      
        if(resp.status == "success") {
          this.alertService.showSaveStatus(this.itemName.toLowerCase(), true);
          this.resetForm();
          this.clearForm();
          this.getItemList();
        } else {
          this.alertService.showSaveStatus(this.itemName.toLowerCase(), false);
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
    this.generalInfoService.getCourierList(params).subscribe((resp:any)=>{      
      this.itemList = resp["courierServiceDetails"];
    });
  }

  private clearForm() {
    this.isEdit = false;
    this.isFormVisible = false;
    this.isFormSubmitInitiated = false;
  }

  private initializeForm(data: any) {
    this.addItemForm = new FormGroup({
      courierServiceId : new FormControl((null != data ? data.courierServiceId : '')),
      courierCompanyName : new FormControl((null != data ? data.courierCompanyName : ''), Validators.required),
      mobileNumber1 : new FormControl((null != data ? data.mobileNumber1 : '')),
      mobileNumber2 : new FormControl((null != data ? data.mobileNumber2 : '')),
      otherDetails : new FormControl((null != data ? data.otherDetails : '')),
      webSiteUrl : new FormControl((null != data ? data.webSiteUrl : ''))
    });
  }

  private getPreparedParams(submitData: any) {

    let params : {[k : string]: any}= {
      courierCompanyName : submitData.courierCompanyName,
      mobileNumber1 : submitData.mobileNumber1,
      mobileNumber2 : submitData.mobileNumber2,
      otherDetails : submitData.otherDetails,
      webSiteUrl : submitData.webSiteUrl
    }

    if(this.isEdit) {
      params.courierServiceId = submitData.courierServiceId
    }

    return params;
  }

  // Convenience getter for easy access to attendance form fields.
  get itemForm() { return this.addItemForm.controls; }

}
