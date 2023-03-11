import { Component, Input, OnInit, EventEmitter, Output, OnChanges } from '@angular/core';
import { BaseComponent } from '@app/core/component/base.component';
import { ActivatedRoute } from '@angular/router';
import { AlertNotificationService } from '@app/shared/services/alertnotification.service';
import { GeneralInfoService } from '@app/general-info/general-info.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'cr-jobnature-general-info',
  templateUrl: './cr-jobnature-general-info.component.html',
  styleUrls: ['./cr-jobnature-general-info.component.scss']
})
export class CrJobNatureGeneralInfoComponent extends BaseComponent implements OnInit, OnChanges {
 //#region Public Variables
  //Form Data Variable
  public addItemForm: FormGroup;

  public itemList: Array<any>;

  //Status variables
  public isFormVisible : boolean = false;
  public isEdit : boolean = false;
  public isFormSubmitInitiated : boolean = false;

  public itemName: string = "Action Undertaken";
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
      natureJobId : item.natureJobId
    };
    this.alertService.showPermenantDeleteConfirmation(this, this.itemName.toLowerCase(), this.onConfirmDelete, params);
  }

  public onConfirmDelete(_self: any, params: any) {
    _self.generalInfoService.deleteJobNature(params).subscribe((resp: any) => {
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

      this.generalInfoService.saveOrUpdateJobNature(params).subscribe((resp:any)=>{      
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
    this.generalInfoService.getJobNatureList(params).subscribe((resp:any)=>{      
      this.itemList = resp["natureOfJobs"];
    });
  }

  private clearForm() {
    this.isEdit = false;
    this.isFormVisible = false;
    this.isFormSubmitInitiated = false;
  }

  private initializeForm(data: any) {
    this.addItemForm = new FormGroup({
      natureJobId : new FormControl((null != data ? data.natureJobId : '')),
      jobNature : new FormControl((null != data ? data.jobNature : ''), Validators.required),
      description : new FormControl((null != data ? data.description : ''))
    });
  }

  private getPreparedParams(submitData: any) {

    let params : {[k : string]: any}= {
      jobNature : submitData.jobNature,
      description : submitData.description
    }

    if(this.isEdit) {
      params.natureJobId = submitData.natureJobId
    }

    return params;
  }

  // Convenience getter for easy access to attendance form fields.
  get itemForm() { return this.addItemForm.controls; }

}
