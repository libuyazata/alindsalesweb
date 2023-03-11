import { Component, Input, OnInit, EventEmitter, Output, OnChanges } from '@angular/core';
import { BaseComponent } from '@app/core/component/base.component';
import { ActivatedRoute } from '@angular/router';
import { AlertNotificationService } from '@app/shared/services/alertnotification.service';
import { GeneralInfoService } from '@app/general-info/general-info.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'cr-boarddivision-general-info',
  templateUrl: './cr-boarddivision-general-info.component.html',
  styleUrls: ['./cr-boarddivision-general-info.component.scss']
})
export class CrBoardDivisionGeneralInfoComponent extends BaseComponent implements OnInit, OnChanges {
 //#region Public Variables
  //Form Data Variable
  public addItemForm: FormGroup;

  public itemList: Array<any>;

  //Status variables
  public isFormVisible : boolean = false;
  public isEdit : boolean = false;
  public isFormSubmitInitiated : boolean = false;

  public itemName: string = "Board/Division";
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
      boardDivisionId : item.boardDivisionId
    };
    this.alertService.showPermenantDeleteConfirmation(this, this.itemName.toLowerCase(), this.onConfirmDelete, params);
  }

  public onConfirmDelete(_self: any, params: any) {
    _self.generalInfoService.deleteBoardDivision(params).subscribe((resp: any) => {
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

      this.generalInfoService.saveOrUpdateBoardDivision(params).subscribe((resp:any)=>{      
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
    this.generalInfoService.getBoardDivisionList(params).subscribe((resp:any)=>{      
      this.itemList = resp["boardDivisionDetails"];
    });
  }

  private clearForm() {
    this.isEdit = false;
    this.isFormVisible = false;
    this.isFormSubmitInitiated = false;
  }

  private initializeForm(data: any) {
    this.addItemForm = new FormGroup({
      boardDivisionId : new FormControl((null != data ? data.boardDivisionId : '')),
      boardDivisionName : new FormControl((null != data ? data.boardDivisionName : ''), Validators.required),
      boardDivisionAddress : new FormControl((null != data ? data.boardDivisionAddress : ''), Validators.required),
      railwayZone : new FormControl((null != data ? data.railwayZone : ''), Validators.required),
      // zoneDivisionName : new FormControl((null != data ? data.zoneDivisionName : ''), Validators.required),
      otherDetails : new FormControl((null != data ? data.otherDetails : ''))
    });
  }

  private getPreparedParams(submitData: any) {

    let params : {[k : string]: any}= {
      boardDivisionName : submitData.boardDivisionName,
      boardDivisionAddress : submitData.boardDivisionAddress,
      railwayZone: submitData.railwayZone,
      // zoneDivisionName: submitData.zoneDivisionName,
      otherDetails : submitData.otherDetails
    }

    if(this.isEdit) {
      params.boardDivisionId = submitData.boardDivisionId
    }

    return params;
  }

  // Convenience getter for easy access to attendance form fields.
  get itemForm() { return this.addItemForm.controls; }

}
