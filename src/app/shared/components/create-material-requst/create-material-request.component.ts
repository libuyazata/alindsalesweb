import { Component, Input, OnInit, EventEmitter, Output, OnChanges } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormGroup, FormControl, Validators, FormArray, FormsModule } from '@angular/forms';
import { IMyDpOptions } from 'mydatepicker';
import { BaseComponent } from '@app/core/component/base.component';
import { CreateUserService } from '@app/shared/components/create-user/create-user.service';
import { Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { MaterialRequestService } from '@app/material-request/material-request.service';
import { NewWorkDetailsService } from '@app/employee/new-work/new-work.service';
import { AlertNotificationService } from '@app/shared/services/alertnotification.service';
import { InternalFormsSharedModule } from '@angular/forms/src/directives';
import { INVALID } from '@angular/forms/src/model';



@Component({
  selector: 'create-material-request',
  templateUrl: './create-material-request.component.html',
  styleUrls: ['./create-material-request.component.scss']
})
export class CreateMaterialRequestComponent extends BaseComponent implements OnInit, OnChanges {


  public addMaterialRequestForm: FormGroup;

  public allottedWorksList : any[];
  public stockList : any[] = [];
  public categoryList : any[];
  public isMaterialRequestSubmitAttempted = false;
  public isFormView : boolean;
  public isFormNotValid : boolean = false;

  public callDetails: any;

  public allotedWorkDetails: any[] = []

  public itemIndex : number;

  /**
   *Configuration for the searchable dropdwon
   *
   * @memberof CreateMaterialRequestComponent
   */
  public allottedListConfig = {
    displayKey:"alAllotNo", 
    // clearOnSelection: true,
    // height: 300,
    search:true,
    placeholder:'Select Allotment Number',
    noResultsFound: 'No results found!',
    searchPlaceholder:'Search Allotment Number'
  }


  public stockListSelectConfig = {
    displayKey:"materialType", 
    search:true,
    placeholder:'Select Item',
    noResultsFound: 'No results found!',
    searchPlaceholder:'Search Item'
  }

  public stockCategorySelectConfig = {
    displayKey:"materialCategory", 
    search:true,
    placeholder:'Select Category',
    noResultsFound: 'No results found!',
    searchPlaceholder:'Search Category'
  }

  

  /**
   *Configuration for the date picker
   *
   * @type {IMyDpOptions}
   * @memberof CreateMaterialRequestComponent
   */
  public datePickerConfig: IMyDpOptions = {
    dateFormat: 'dd mmm yyyy',
    inline: false,
  };
  
  @Input() materialRequestData : any;
  @Output() materialRequestSaved = new EventEmitter();

  constructor(private materialRequestService:MaterialRequestService,
              private newWorkDetailsService: NewWorkDetailsService,
              private alertService : AlertNotificationService,
              private route: ActivatedRoute) {
    super(materialRequestService);
  }

  

  ngOnInit() {
    this.isFormView = this.materialRequestData != null;
    this.initialize(); 
    
  }

  ngOnChanges() {

  }

  ngAfterViewInit(){
    this.route.queryParams.subscribe((params:any) => {
      let employeeId = params['uid'];
      if(!employeeId) {
        employeeId = 0;
      }
    });
    if( ! this.materialRequestData) {

      this.getCallAllotmentList();
      this.getMaterialCategories();
    }

    
  }

  resetForm() {
    this.addMaterialRequestForm.reset();
    this.clearAllMaterialItemForms();
  }

  /**
   * Material Request Crate call
   * Save Only 
   * @since v1.0
   */
  public onMaterialRequestCreate() {
    this.isMaterialRequestSubmitAttempted = true;

    if(this.addMaterialRequestForm.valid){
      this.isFormNotValid = false;
      let materialRequestData = this.addMaterialRequestForm.value;

      let requestedItems : any[] = [];

      materialRequestData.requestedItemList.forEach((item: any) => {

        let requestedItem = {
          materialCategory : item.materialCategory.materialCategoryId,
          materialStockId : item.materialStockId.materialStockId,
          requestedQuantity : item.requestedQuantity,
          remarks :item.remarks
        };
        requestedItems.push(requestedItem)

      });

      let requestData = {
        cdId: materialRequestData.allotedwork.callDetail.cdId,
        dueDate: this.getDateFromMyDP(materialRequestData.dueDate),
        remarks : materialRequestData.remarks,
        name : materialRequestData.name,
        address : materialRequestData.address,
        state : materialRequestData.state,
        country : materialRequestData.country,
        pincode : materialRequestData.pincode,
        phoneNumber1 : materialRequestData.phoneNumber1,
        phoneNumber2 : materialRequestData.phoneNumber2,
        requestedItemList : JSON.stringify(requestedItems)
      }

      this.materialRequestService.saveMaterialRequst(requestData).subscribe((resp : any) => {
        if(resp.status == "success") {
          this.materialRequestSaved.emit("Completed");
          this.alertService.showSaveStatus("material request", true);
          this.resetForm();
        } else {
          this.alertService.showSaveStatus("material request", false);
        }
      });
    } else {
      if( ! this.addMaterialRequestForm.controls.allotedwork.errors) {
        this.isFormNotValid = true;
      }
    } 
  }
  

  /**
   * Change event on selection of allotted Work
   * @since v1.0
   * @param event 
   */
  onAllottedWorkSelectionChanged(event: any) {
    if(this.addMaterialRequestForm.value.allotedwork != null)  {
      this.callDetails = this.addMaterialRequestForm.value.allotedwork;
    } else {
      this.callDetails = this.initializeCallDetails();
    }
  }

  onStockCategoryChange(index: number) {
    let materialCategory = this.requestedItemControlsOfIndex(index).value;
    // this.categoryList[index].materialCategoryId;
    let params = {
      materialCategoryId : materialCategory.materialCategory.materialCategoryId
    };

    this.materialRequestService.getStockDetails(params).subscribe((stockDetails: any) => {
      this.stockList[index] = stockDetails.materialStockInfos;
    });

  }

  onStockItemChange(index: number) {

    let materialRequestData = this.addMaterialRequestForm.value;
    let isFound = false;
    let length =  materialRequestData.requestedItemList.length;
    let currentItem = materialRequestData.requestedItemList[index];
    for(let i = 0; i < length; i++) {
      if(index != i && currentItem.materialStockId.materialStockId == materialRequestData.requestedItemList[i].materialStockId.materialStockId) {
        isFound = true;
      }
    }
    if(isFound) {
      this.alertService.showWarning("Selection of duplicate items is not allowed! Please update the existing Item", "Warning");
      // let controls = (this.getRequestedItemCotnrols()[index] as FormGroup)
      // controls.controls.materialStockId = new FormControl('', Validators.required)
      return false;
    } else {
      return true;
    }
  }

  protected clearAllMaterialItemForms() {
    let materialListFormArray = this.getRequestedItemCotnrols();
    let formArrayLength = materialListFormArray.length;
    for(var i =0 ; i < formArrayLength; i++) {
      this.removeMaterialRequestItem(0);
    }
    this.addMaterialRequestItem();
  }

  protected initializeCallDetails () {
    return {
      callDetail : {
        serviceRequestId : "",
        cdBoardDivision : "",
        cdCustomerName : "",
        siteDetails : "",
        productDetails : "",

      }
    };
  }

  private initialize(){  

    this.callDetails = this.initializeCallDetails();

    this.addMaterialRequestForm = new FormGroup({
      allotedwork : new FormControl('', Validators.required),      
      dueDate : new FormControl(''),
      remarks: new FormControl(''),
      name: new FormControl('', Validators.required),
      address : new FormControl('', Validators.required),
      state : new FormControl('', Validators.required),
      country: new FormControl('INDIA', Validators.required),
      pincode: new FormControl('', Validators.required),
      phoneNumber1 : new FormControl('', Validators.required),
      phoneNumber2 : new FormControl(''),
      requestedItemList : new FormArray([
        this.addRequestedItemFormGroup()
      ])
    });
  }

  getRequestedItemCotnrols() {
    return (this.addMaterialRequestForm.controls.requestedItemList as FormArray).controls;
  }

  requestedItemControlsOfIndex(i:any) {
    return (this.addMaterialRequestForm.controls.requestedItemList as FormArray).controls[i];
  }

  addRequestedItemFormGroup () : FormGroup{
    return new FormGroup({
      materialCategory: new FormControl('', Validators.required),
      materialStockId: new FormControl('', Validators.required),
      requestedQuantity: new FormControl('', Validators.required),
      remarks: new FormControl('')
    });
  }

  get materialRequestItemList() {
    return this.addMaterialRequestForm.get('requestedItemList') as FormArray;
  }

  addMaterialRequestItem() {
    this.materialRequestItemList.push(this.addRequestedItemFormGroup());
  }

  removeMaterialRequestItem(index: any) {
    // this.stockList.removeAt(index);
    this.materialRequestItemList.removeAt(index);
  }

  getMaterialStockList(index : number) { 
    return this.stockList[index] == undefined ? [] : this.stockList[index] 
  }

  private getMaterialCategories() {
    let params = {
      "isActive" : 1
    };

    this.materialRequestService.getMaterialCategories(params).subscribe((stockDetails: any) => {
      this.categoryList = stockDetails.materialCategories;
    });
  }
  /**
   * Get Stock details from the server.
   * 
   * @since v1.0
   */
  private getStockList(id: number) {
    let params = {
      "materialCategoryId" : id
    };

    this.materialRequestService.getStockDetails(params).subscribe((stockDetails: any) => {
      this.stockList = stockDetails.materialStockInfos;
    });
  }

  /**
   * Get all works for the current employee
   * 
   * Token check should also be done to ensure this call on the server side. 
   * @since v1.0
   */
  private getCallAllotmentList() {

    let params = {
      "employeeId" : this.getUserId()
    };

    this.newWorkDetailsService.getAllottedWorkDetails(params).subscribe((allottedWorks: any) => {
      this.allottedWorksList = allottedWorks.allottedWorks;
    });
  }

  // Convenience getter for easy access to attendance form fields.
  get materialRequestForm() { return this.addMaterialRequestForm.controls; }
  

}
