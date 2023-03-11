import { Component, OnInit } from '@angular/core';

import { BaseComponent } from '@app/core/component/base.component';
import { MaterialRequestService } from './material-request.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthenticationService } from '@app/core/authentication/authentication.service'
import { isEmpty } from 'lodash';
import Swal from 'sweetalert2'
import { AlertNotificationService } from '@app/shared/services/alertnotification.service';

/**
 * Component Material Request
 * @author AJ 07-JUN-2020
 * 
 */
@Component({
  selector: 'app-material-request',
  templateUrl: './material-request.component.html',
  styleUrls: ['./material-request.component.scss']
})
export class MaterialRequestComponent extends BaseComponent implements OnInit {

  public materialRequestSearchForm : FormGroup;
  public materialRequestList : Array<any>;
  //material request create form
  /**
   * Variable to set data view for material request popup.
   *
   * @type {*}
   * @memberof MaterialRequestComponent
   */
  public materialRequestDataToView : any;
  /**
   * Variable set for material request create form visibility
   *
   * @type {boolean}
   * @memberof MaterialRequestComponent
   */
  public isMaterialRequestFormVisible : boolean;
  /**
   * Variable set on view of material request
   *
   * @type {boolean}
   * @memberof MaterialRequestComponent
   */
  public isMaterialRequestView : boolean;

  // Despatch Form variables
  /**
   * Form variable determines the form visible or not
   * Click button set this to true;
   *
   * @type {boolean}
   * @memberof MaterialRequestComponent
   */
  public isDespatchFormVisible : boolean;
  public isDespatchView : boolean;
  public materialRequestDesptachDataToView : any;
  public despatchMaterialRequest : any;


  public isDespatchStatusUpdateFormVisible : boolean;
  public despatchItemReceivedForm : FormGroup;
  public isDespatchStatusUpdateFormSubmitted: boolean = false;

  /**
   * Variable saved to identify open click on the material requests table
   *
   * @private
   * @type {*}
   * @memberof MaterialRequestComponent
   */
  private previousItem : any;

  isAdminUser:Boolean;

  constructor(private materialRequestService : MaterialRequestService, 
      private authenticationService: AuthenticationService,
      private alertService : AlertNotificationService) { 
    super(materialRequestService);
  }

  ngOnInit() {

    this.isAdminUser = this.authenticationService.isAdminUser();

    this.materialRequestSearchForm = new FormGroup({
      searchKeyWord : new FormControl(''),
      dateFrom : new FormControl(''),
      dateTo : new FormControl(''),
    })

     this.getMaterialRequestList();
     
  }

  onMaterialRequestSearched() {
    this.getMaterialRequestList();
  }

  openServiceRequest(item : any) {
    item.isDetailsSetVisible = ! item.isDetailsSetVisible;

    if(this.previousItem != null && item != this.previousItem) {
      this.previousItem.isDetailsSetVisible = false;
    }

    this.previousItem = item;
  }

  public onMaterialRequestSaved() {
    this.getMaterialRequestList();
    this.closeMaterialRequestCreate();
  }

  openMaterialRequestViewModal(item: any) {
    this.isMaterialRequestView = true;
    this.materialRequestDataToView = item;
    this.isMaterialRequestFormVisible = true;
  }

  opnDespatchViewModal(materialRequestNumber: any, despatchData : any) {

    let materialRequestData = despatchData;
    materialRequestData.metrialRequestNumber = materialRequestNumber;

    this.isDespatchView = true;
    this.materialRequestDesptachDataToView = materialRequestData;
    this.isDespatchFormVisible = true;
  }

 openMaterialRequestCreateView(){
    this.isMaterialRequestFormVisible = true;
    this.isMaterialRequestView = false;
  }

  public closeMaterialRequestCreate(){
    this.materialRequestDataToView = null;
    this.isMaterialRequestFormVisible = false;
  }

  openCreateDespatchView() {
    this.isDespatchFormVisible = true;
    this.isDespatchView = false;
  }

  openCreateDespatchViewForMaterialRequest(item : any) {

    this.isDespatchFormVisible = true;
    this.despatchMaterialRequest = item;
    this.isDespatchView = false;
  }

  // openDespatchViewModal(mrIndex : any, index : any) {
  //   this.isDespatchFormVisible = true;
  //   this.materialRequestDesptachDataToView = this.materialRequestList[mrIndex].despatch[index];
  //   this.isDespatchView = true;
  // }

  public closeDespatchCreate(){
    this.materialRequestDesptachDataToView = null;
    this.despatchMaterialRequest = null;
    this.isDespatchFormVisible = false;
  }

  onMaterialRequestDespatchSaved() {
    this.getMaterialRequestList();
    this.closeDespatchCreate();
  }

  openDespatchReceived(despatchId: any) {

    this.despatchItemReceivedForm = new FormGroup({
      despatchDetailsId : new FormControl(despatchId),
      despatchStatusId: new FormControl(2),
      remarks: new FormControl('', Validators.required)
    });

    this.isDespatchStatusUpdateFormVisible = true;
  }

  closeDespatchStatusPopup() {
    this.isDespatchStatusUpdateFormVisible = false;
    this.isDespatchStatusUpdateFormSubmitted = false;
  }

  onConfirmDespatchItem() {

    this.isDespatchStatusUpdateFormSubmitted = true;
    if( this.despatchItemReceivedForm.valid ) {

      let params = this.despatchItemReceivedForm.value;

      this.materialRequestService.updateDespatchStatus(params).subscribe((resp:any)=>{      
        if(resp.status == "success") {
          this.alertService.showSaveStatus("Despatch Status", true);
          this.closeDespatchStatusPopup();
          this.getMaterialRequestList();
        } else {
          this.alertService.showSaveStatus("Despatch Status", false);
        }
      });
    }
  }


  public onConfirmDeleteMaterialRequest(_self: any, params: any) {
    _self.materialRequestService.deleteMaterialRequest(params).subscribe((resp: any) => {
      let deleteStatus = resp.status == "success";
      _self.alertService.showDeleteStatus("material request", deleteStatus);
      _self.getMaterialRequestList();
    });
  }

  deleteMaterialRequest(item: any) {
    let materialRequest = item;
    let params = {
      materialRequestId : materialRequest.materialRequestId
    };
    this.alertService.showPermenantDeleteConfirmation(this, "material request", this.onConfirmDeleteMaterialRequest, params);
  }

  public onConfirmSuspendMaterialRequest(_self: any, params: any) {
    _self.materialRequestService.deleteMaterialRequest(params).subscribe((resp: any) => {
      let deleteStatus = resp.status == "success";
      _self.alertService.showSuspendStatus("material request", deleteStatus);
      _self.getMaterialRequestList();
    });
  }

  suspendMaterialRequest(item: any) {
    let materialRequest = item;
    let params = {
      materialRequestId : materialRequest.materialRequestId
    };
    this.alertService.showConfirmation(this, "Are you sure you want to suspend this material request?", "Suspend Material Request", "Suspend", this.onConfirmSuspendMaterialRequest, params);
  }

  

  
  /**
   * Call API for material request
   */
  protected getMaterialRequestList() {

    let searchFilter = this.materialRequestSearchForm.value;
    let params = {
      "dateFrom" : searchFilter.dateFrom == null ? "" : searchFilter.dateFrom,
      "dateTo" : searchFilter.dateTo == null ? "" : searchFilter.dateTo,
      "searchKeyWord" : searchFilter.searchKeyWord == null ? "" : searchFilter.searchKeyWord
    }

    this.materialRequestService.getAllMaterialRequests(params).subscribe((resp:any)=>{      
      this.materialRequestList = resp["materialRequests"];
    });
  }

  get despatchStatusForm() { return this.despatchItemReceivedForm.controls; }
}
