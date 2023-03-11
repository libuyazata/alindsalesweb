import { Component, Input, OnInit, EventEmitter, Output, OnChanges } from '@angular/core';
import { BaseComponent } from '@app/core/component/base.component';
import { ActivatedRoute } from '@angular/router';
import { AlertNotificationService } from '@app/shared/services/alertnotification.service';
import { GeneralInfoService } from '@app/general-info/general-info.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'mr-itemlist-general-info',
  templateUrl: './mr-itemlist-general-info.component.html',
  styleUrls: ['./mr-itemlist-general-info.component.scss']
})
export class MrItemListGeneralInfoComponent extends BaseComponent implements OnInit, OnChanges {
 //#region Public Variables
  //Form Data Variable
  public addItemForm: FormGroup;

  public itemList: Array<any>;

  public categoryList : any[];

  //Status variables
  public isFormVisible : boolean = false;
  public isEdit : boolean = false;
  public isFormSubmitInitiated : boolean = false;

  public itemName: string = "Material Stock";
  //#endregion

  //#region events and constructor
  constructor(private generalInfoService:GeneralInfoService,
              private alertService : AlertNotificationService,
              private route: ActivatedRoute) {
    super(generalInfoService);
  }

  ngOnInit() {
    this.initialize(); 
    this.getCategoryList();
  }

  ngOnChanges() {

  }

  ngAfterViewInit(){

  }
  //#endregion

  //#region public function
  deleteItem(item: any) {
    let params = {
      materialStockId : item.materialStockId
    };
    this.alertService.showPermenantDeleteConfirmation(this, this.itemName.toLowerCase(), this.onConfirmDelete, params);
  }

  public onConfirmDelete(_self: any, params: any) {
    _self.generalInfoService.deleteMaterialStock(params).subscribe((resp: any) => {
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

      this.generalInfoService.saveOrUpdateMaterialStock(params).subscribe((resp:any)=>{      
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
    this.generalInfoService.getMaterialStockList(params).subscribe((resp:any)=>{      
      this.itemList = resp["materialStockInfos"];
    });
  }

  private clearForm() {
    this.isEdit = false;
    this.isFormVisible = false;
    this.isFormSubmitInitiated = false;
  }

  private initializeForm(data: any) {
    this.addItemForm = new FormGroup({
      materialStockId : new FormControl((null != data ? data.materialStockId : '')),
      materialCategory : new FormControl((null != data ? data.materialCategory.materialCategoryId : ''), Validators.required),
      materialType : new FormControl((null != data ? data.materialType : ''), Validators.required),
      noOfStocks : new FormControl((null != data ? data.noOfStocks : ''), {validators:Validators.compose([Validators.required, Validators.pattern('^[0-9]*$')])}),
      description : new FormControl((null != data ? data.description : ''))
    });
  }

  private getPreparedParams(submitData: any) {

    let params : {[k : string]: any}= {
      materialCategoryId : submitData.materialCategory,
      materialType : submitData.materialType,
      noOfStocks : submitData.noOfStocks,
      description : submitData.description
    }

    if(this.isEdit) {
      params.materialStockId = submitData.materialStockId
    }

    return params;
  }

  private getCategoryList() {
    let params = {}
    this.generalInfoService.getMaterialStockCategoryList(params).subscribe((resp:any)=>{      
      this.categoryList = resp["materialCategories"];
    });
  }

  // Convenience getter for easy access to attendance form fields.
  get itemForm() { return this.addItemForm.controls; }

}
