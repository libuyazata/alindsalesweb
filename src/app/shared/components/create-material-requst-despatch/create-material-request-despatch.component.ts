import { Component, Input, OnInit, EventEmitter, Output, OnChanges } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, FormsModule } from '@angular/forms';
import { IMyDpOptions } from 'mydatepicker';
import { BaseComponent } from '@app/core/component/base.component';
import { ActivatedRoute } from '@angular/router';
import { MaterialRequestService } from '@app/material-request/material-request.service';
import { validateConfig } from '@angular/router/src/config';
import { AlertNotificationService } from '@app/shared/services/alertnotification.service';

@Component({
  selector: 'create-material-request-despatch',
  templateUrl: './create-material-request-despatch.component.html',
  styleUrls: ['./create-material-request-despatch.component.scss']
})
export class CreateMaterialRequestDespatchComponent extends BaseComponent implements OnInit, OnChanges {

  //#region public variables
  /**
   * Despatch Form
   */
  public addMaterialRequestDespatchForm: FormGroup;

  public isDespatchSubmitAttempted = false;
  public isFormView : boolean;
  public isFormNotValid : boolean;

  public materialRequestItemList : any[] = [];
  public materialRequestList : any[] = [];
  public isListNeeded : boolean = true;

  /**
   * searchable dropdown configuration for material request list selection
   *
   * @memberof CreateMaterialRequestDespatchComponent
   */
  public materialRequestListConfig = {
    displayKey:"metrialRequestNumber", 
    search:true,
    placeholder:'Select Material Request Number',
    noResultsFound: 'No results found!',
    searchPlaceholder:'Search Material Request Number'
  }

  /**
   * searchable dropdown configuration for courier List
   *
   * @memberof CreateMaterialRequestDespatchComponent
   */
  public courierListConfig = {
    displayKey:"courierCompanyName", 
    search:true,
    placeholder:'Select Courier',
    noResultsFound: 'No results found!',
    searchPlaceholder:'Search Courier'
  }
  /**
   * List of all available couriers
   *
   * @type {*}
   * @memberof CreateMaterialRequestDespatchComponent
   */
  public courierList : any;


  public stockListConfig = {
    displayKey:"materialName", 
    search:true,
    placeholder:'Select Item',
    noResultsFound: 'No results found!',
    searchPlaceholder:'Search Item'
  }

  //#endregion

  //#region private variables


  //#endregion
  
  @Input() materialRequestDespatchData : any;
  // @Input() materialRequestList : any;
  @Input() despatchMaterialRequest : any;
  @Output() materialRequestDespatchSaved = new EventEmitter();

  //#region controller methods
  constructor(private materialRequestService:MaterialRequestService,
              private route: ActivatedRoute,
              private alertService : AlertNotificationService) {
    super(materialRequestService);
  }

  ngOnInit() {
    this.isFormView = this.materialRequestDespatchData != null;

    if( ! this.materialRequestDespatchData) {
      this.getCourierList();
      this.getAllMaterialRequests();
    }

    this.initialize();

    if(this.despatchMaterialRequest) {
      this.isListNeeded = false;
      this.addMaterialRequestDespatchForm.controls.materialRequest.patchValue(this.despatchMaterialRequest.metrialRequestNumber);
      this.materialRequestItemList = this.despatchMaterialRequest.requestedItems;
      this.preloadItemList();
    }
  }

  ngOnChanges() {}

  ngAfterViewInit(){
    this.route.queryParams.subscribe((params:any) => {
      let employeeId = params['uid'];
      if(!employeeId) {
        employeeId = 0;
      }
    });
    // this.getCourierList();
    // if( ! this.materialRequestDespatchData) {
    //   this.getCourierList();
    // }
  }
  //#endregion

  //#region public methods - begin
  onMaterialRequestDespatchCreate() {

    this.isDespatchSubmitAttempted = true;

    if(this.addMaterialRequestDespatchForm.valid){
      this.isFormNotValid = false;

      let despatchData = this.addMaterialRequestDespatchForm.value;

      let despatchItems : any[] = [];

      (this.addMaterialRequestDespatchForm.controls.despatchItemsList as FormArray).controls.forEach((item: any) => {
        let value = item.value;
        let despatchItem = {
          materialStockId : value.materialStockId,
          requestedMaterialsId : value.requestedMaterialsId,
          despatchQuantity : value.despatchQuantity,
          balanceItemToSend :value.remainingQuantity
        };
        despatchItems.push(despatchItem)

      });

      let materialRequestId = this.isListNeeded ? despatchData.materialRequest.materialRequestId : this.despatchMaterialRequest.materialRequestId;

      let requestData = {
        materialRequestId: materialRequestId,
        details: despatchData.details,
        remarks: despatchData.remarks,
        courierServiceId : despatchData.courierService.courierServiceId,
        trackingId : despatchData.trackingId,
        despatchItemsList : JSON.stringify(despatchItems)
      };

      this.materialRequestService.saveDespatch(requestData).subscribe((resp : any) => {
        if(resp.status == "success") {
          this.materialRequestDespatchSaved.emit("Completed");
          this.alertService.showSaveStatus("despatch", true);
          this.resetForm();
        } else {
          this.alertService.showSaveStatus("despatch", false);
        }
      });
    } else {
      if( ! this.addMaterialRequestDespatchForm.controls.despatchItemsList.errors) {
        this.isFormNotValid = true;
      }
    }
  }

  onMaterialRequstSelectionChanged(event: any) {

    if(null == this.addMaterialRequestDespatchForm.value.materialRequest) {
      return;
    }

    let materialRequestSelected = this.addMaterialRequestDespatchForm.value.materialRequest;
    this.materialRequestItemList = materialRequestSelected.requestedItems;
    this.preloadItemList();
    //TODO: Implement
  }

  onCourierSelectionChanged(event: any) {
    //TODO: Implement
  }

  updateRemainingQuantity(itemControls : FormGroup) {

    let remainingQuantities = itemControls.controls.totalRemainingQuantity.value;
    let shippingQuantity = itemControls.controls.despatchQuantity.value;

    itemControls.controls.remainingQuantity.setValue(remainingQuantities - shippingQuantity);
  }

  /**
   * Method to add despatch item selection to the items list table
   *
   * @memberof CreateMaterialRequestDespatchComponent
   */
  addDespatchItem() {
    //TODO: Validate total number of requested Items.
    this.despatchedItemList.push(this.addDespatchItemFormGroup());
  }

  removeDespatchItem(index: any) {
    this.despatchedItemList.removeAt(index);
  }

  getdespatchItemsControls() {
    return (this.addMaterialRequestDespatchForm.controls.despatchItemsList as FormArray).controls;
  }

  resetForm() {
    this.addMaterialRequestDespatchForm.reset();
    this.clearAllMaterialItemForms();
  }
  //#endregion


  //#region private methods
  /**
   * Intialize Method
   */
  private initialize() {

    this.addMaterialRequestDespatchForm = new FormGroup({
      materialRequest : new FormControl('', Validators.required),
      courierService : new FormControl('', Validators.required),
      trackingId : new FormControl('', Validators.required),
      details : new FormControl(''),
      remarks : new FormControl(''),
      despatchItemsList : new FormArray([
        this.addDespatchItemFormGroup()
      ])
    });

    
  }

  protected clearAllMaterialItemForms() {
    this.removeAllDespatchItemsForm();
    this.addDespatchItem();
  }

  /**
   * Single Despatch Item.
   *  #remainingQuantity is for keeping the quantity remaining.
   */
  private  addDespatchItemFormGroup() : FormGroup {
    return new FormGroup({
      materialStockId : new FormControl('', Validators.required),
      requestedMaterialsId : new FormControl('', Validators.required),
      materialCategoryId : new FormControl('', Validators.required),
      materialCategory: new FormControl(''),
      materialType: new FormControl(''),
      despatchQuantity : new FormControl('', Validators. required),
      remainingQuantity: new FormControl(''),
      totalRemainingQuantity : new FormControl('', Validators.required),
      remarks : new FormControl('')
    })
  }

  private addDespatchItemFormGroupWithValue(data: any) : FormGroup {
    return new FormGroup({
      materialStockId : new FormControl(data.materialStockId, Validators.required),
      requestedMaterialsId : new FormControl(data.requestedMaterialsId, Validators.required),
      materialCategoryId : new FormControl(data.materialStockInfo.materialCategory.materialCategoryId, Validators.required),
      materialCategory: new FormControl(data.materialStockInfo.materialCategory.materialCategory),
      materialType: new FormControl(data.materialStockInfo.materialType),
      despatchQuantity : new FormControl(data.balanceItemToSend, [Validators.required, Validators.max(data.balanceItemToSend), Validators.min(0)]),
      remainingQuantity : new FormControl(0),
      totalRemainingQuantity : new FormControl(data.totalRemainingQuantity),
      remarks: new FormControl('')
    })
  }

  /**
   *  Update list of couriers 
   */
  private getCourierList() {
    let params = {};
    this.materialRequestService.getCourierList(params).subscribe((resp:any)=>{      
      this.courierList = resp["courierServiceDetails"];
    });
  }

  private getAllMaterialRequests() {
    let params = {
       "searchKeyWord" : ""
    }

    this.materialRequestService.getAllMaterialRequests(params).subscribe((resp:any)=>{      
      this.materialRequestList = resp["materialRequests"];
    });
  }

  private preloadItemList() {
    this.removeAllDespatchItemsForm();
    let index = 0;
    this.materialRequestItemList.forEach((item: any) => {
      item.totalRemainingQuantity = item.balanceItemToSend;
      this.despatchedItemList.controls.push(this.addDespatchItemFormGroupWithValue(item));
      index++
    });
  }

  private removeAllDespatchItemsForm() {
    let itemListFormArray = this.getdespatchItemsControls();
    let formArrayLength = itemListFormArray.length;

    for(let i = 0; i < formArrayLength; i++) {
      this.removeDespatchItem(0);
    }
  }
  //#endregion

  //#region getters
  // Convenience getter for easy access to attendance form fields.
  get depatchForm() { return this.addMaterialRequestDespatchForm.controls; }

  get despatchedItemList() {
    return this.addMaterialRequestDespatchForm.get('despatchItemsList') as FormArray;
  }

  
  //#endregion
}
