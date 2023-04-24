import { Component, OnInit, ViewChild } from '@angular/core';

import { environment } from '@env/environment';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { BaseComponent } from '@app/core/component/base.component';
import { CallManagementService } from '@app/call-management/call-management.service';
import { ActivatedRoute } from '@angular/router';
import { DownloadComponent } from '@app/shared/components/download-ctrl/download.component';
import { AlertNotificationService } from '@app/shared/services/alertnotification.service';
import { AuthenticationService } from '@app/core/authentication/authentication.service'

// import { ExcelService } from '@app/shared/services/excel/excel.service';

@Component({
  selector: 'app-call-management',
  templateUrl: './call-management.component.html',
  styleUrls: ['./call-management.component.scss']
})
export class CallManagementComponent extends BaseComponent implements OnInit {
  
  public intervalId:any;
  public callStatusParam : String;  
  public dropdownSettings: any = {};
  public employeeList : Array<any>;
  public isNotEmployeesSelected: boolean = false; // For Call allotment
  public callManagementList : Array<any>;
  public callAllotmentList : Array<any>; // View list data
  public callManagementViewData : any;
  public callMngtSearchForm : FormGroup;
  public allotCallManagementForm : FormGroup;
  public isAllotCallManagementFormAttemptSubmit : Boolean;
  public callmanagementEditForm : FormGroup;
  public iscallsearchFormAttemptSubmit :Boolean = false;
  public iscalleditFormAttemptSubmit :Boolean = false;
  public isAdminUser :Boolean = false;
  public page: number = 1;
  public itemsPerPage: number;
  public totalItems: number;
  public isPaginationVisible : boolean = false;

  @ViewChild(DownloadComponent) downloadCtrl:DownloadComponent;
  
  constructor(private callManagementService : CallManagementService,
              // private excelService:ExcelService,
			  private alertService : AlertNotificationService,			  
              private route: ActivatedRoute,
			  private authenticationService: AuthenticationService,
              private fb : FormBuilder) { 
    super(callManagementService);
    this.isAllotCallManagementFormAttemptSubmit = false;
  }

  ngOnInit() {     
    // this.excelService.generateExcel();
    this.callMngtSearchForm = new FormGroup({
      callManagementStatus : new FormControl(''),
      searchKeyWord : new FormControl(''),
      dateFrom : new FormControl(''),
      dateTo : new FormControl(''),
      gurenteePeriod : new FormControl('',Validators.required)
    });

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'employeeId',
      textField: 'fullName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
    this.allotCallManagementForm = this.fb.group({
      cdId: new FormControl(''),
      employees : new FormControl('', Validators.required),
      mobileNumber : new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(10)]),
      allotDate : new FormControl('', Validators.required),
    });
    this.callMngtSearchForm.patchValue({"gurenteePeriod" : "all"});
    this.route.queryParams.subscribe(params => {
      if(params['cs']) {
        this.callStatusParam = params['cs'];
        this.callMngtSearchForm.patchValue({"callManagementStatus" : this.callStatusParam});
      }
    });
    /* this.callManagementService.getEmployeeList( { "departmentId": -1, "designationId" : -1, "searchKeyWord" : ""}).subscribe((resp:any)=>{
      this.employeeList = resp.employeeList;
    });  */   

    // Load the data.
    this.getCallManagementList(); 
    /* this.intervalId = setInterval(() => {
      this.getCallManagementList(); 
    }, 60000); */
	/* this.callMngtSearchForm = new FormGroup({
	callManagementStatus : new FormControl(''),
	gurenteePeriod : new FormControl(''),
	dateFrom : new FormControl(''),
	dateTo : new FormControl(''),
	searchKeyWord : new FormControl('',Validators.required)
	}); */
	this.callmanagementEditForm = new FormGroup({
      cdId : new FormControl(''),
      cdAllotNo : new FormControl(''),
      cdAllotDate : new FormControl(''),
      cdBoardDivision : new FormControl(''),
      cdContactNo : new FormControl(''),
      cdCustomerName : new FormControl(''),
      cdEmail : new FormControl(''),
      cdGuranteePeriod : new FormControl(''),
      cdProblemDetails : new FormControl(''),
      cdRelayPanelDetails : new FormControl(''),
      cdStatus : new FormControl(''),
      createdAt : new FormControl(''),
      isActive : new FormControl(''),
      serviceRequestId : new FormControl(''),
      siteDetails : new FormControl(''),
      workPhNo : new FormControl(''),
      productDetails : new FormControl(''),
      panelId : new FormControl(''),
      productSlNo : new FormControl(''),
      remarks : new FormControl(''),
      viewAlert : new FormControl(''),
      natureJobId : new FormControl(''),
      updatedAt : new FormControl('',  Validators.required)
    });
	
    this.isAdminUser = this.authenticationService.isAdminUser();
  }  

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  public onCallManagementSearched(){   
    //this.getCallManagementList();    
    //this.iscallsearchFormAttemptSubmit = true;
	this.page=1;
	this.getCallManagementListSearched(); 
  }
  // Convenience getter for easy access of form fields.
  get allotCallMngtForm() { return this.allotCallManagementForm.controls; }

  public allotCallManagementDetails(data:any){
    this.resetAndOpenAllotEntryForm();
    this.allotCallManagementForm.controls.cdId.patchValue(data.cdId);
    // if(!data.cdGuranteePeriod || (data.cdGuranteePeriod && data.cdGuranteePeriod.toLowerCase() == "no")){
    //   if(confirm("Have you ensured the gurantee period for the service request " + data.serviceRequestId.toUpperCase())){
    //     this.allotCallManagementForm.controls.cdId.patchValue(data.cdId); 
    //   } else {
    //     this.closeAllotEntryView();
    //   }
    // } else {
    //   this.allotCallManagementForm.controls.cdId.patchValue(data.cdId); 
    // }   
  }

  public onAllotCallManagementSubmitted(){        
    this.isAllotCallManagementFormAttemptSubmit = true;
    if(this.allotCallManagementForm.valid) {
      let allotInfo = this.allotCallManagementForm.value;      
      this.callManagementService.allotEmployees(allotInfo).subscribe((resp:any)=>{
        alert("Employees has been allotted sucessfully.");
        this.closeAllotEntryView();
        this.getCallManagementList();
      });
    } else {
      if (!this.allotCallManagementForm.value.employees || this.allotCallManagementForm.value.length == 0){
        this.isNotEmployeesSelected = true;
      }
    }
  }

  public resetAndOpenAllotEntryForm() {    
    this.allotCallManagementForm.reset();
    this.isAllotCallManagementFormAttemptSubmit = false;
    document.getElementById('allotCallMngtModal').classList.toggle('d-block');
  }  

  public closeAllotEntryView() {
    this.allotCallManagementForm.reset();
    this.isAllotCallManagementFormAttemptSubmit = false;
    document.getElementById('allotCallMngtModal').classList.toggle('d-block');
  } 

  public openCallMngtViewModal(callData:any){    
    this.getCallMangementDetaildById(callData);    
    document.getElementById('callMngtViewModal').classList.toggle('d-block');
  }
  
  public openCallMngtEditModal(callData:any){
    this.opencalleditEntryForm();
	this.callmanagementEditForm.patchValue({"cdId" : callData.cdId});
	this.callmanagementEditForm.patchValue({"isActive" : callData.isActive});
	this.callmanagementEditForm.patchValue({"viewAlert" : callData.viewAlert});
	this.callmanagementEditForm.patchValue({"natureJobId" : callData.natureJobId});
	this.callmanagementEditForm.patchValue({"cdAllotNo" : callData.cdAllotNo});
	this.callmanagementEditForm.patchValue({"cdAllotDate" : this.formatDate(callData.cdAllotDate)});
	this.callmanagementEditForm.patchValue({"cdBoardDivision" : callData.cdBoardDivision});
	this.callmanagementEditForm.patchValue({"cdContactNo" : callData.cdContactNo});
	this.callmanagementEditForm.patchValue({"cdCustomerName" : callData.cdCustomerName});
	this.callmanagementEditForm.patchValue({"cdEmail" : callData.cdEmail});
	this.callmanagementEditForm.patchValue({"cdGuranteePeriod" : callData.cdGuranteePeriod});
	this.callmanagementEditForm.patchValue({"cdProblemDetails" : callData.cdProblemDetails});
	this.callmanagementEditForm.patchValue({"cdRelayPanelDetails" : callData.cdRelayPanelDetails});
	this.callmanagementEditForm.patchValue({"cdStatus" : callData.cdStatus});
	this.callmanagementEditForm.patchValue({"createdAt" : callData.createdAt});
	this.callmanagementEditForm.patchValue({"serviceRequestId" : callData.serviceRequestId});
	this.callmanagementEditForm.patchValue({"siteDetails" : callData.siteDetails});
	this.callmanagementEditForm.patchValue({"workPhNo" : callData.workPhNo});
	this.callmanagementEditForm.patchValue({"productDetails" : callData.productDetails});
	this.callmanagementEditForm.patchValue({"productSlNo" : callData.productSlNo});
	this.callmanagementEditForm.patchValue({"remarks" : callData.remarks});
	this.callmanagementEditForm.patchValue({"updatedAt" : this.formatDate(callData.updatedAt)});
  }
  public formatDate(date:any) {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
  }
  public formatDatedmy(date:any) {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [day, month, year].join('-');
  }
  public oncallEditDetailsSubmitted(){
    this.iscalleditFormAttemptSubmit = true;
    if(this.callmanagementEditForm.valid) { 
      let callEditValue = this.callmanagementEditForm.value;
      //callEditValue.cdAllotDate="04-04-2023";
      callEditValue.updatedAt=this.formatDatedmy(callEditValue.updatedAt);
	  this.callManagementService.updateCallDetails(callEditValue).subscribe((resp:any)=>{
		if(resp.status == "success") {
         // this.alertService.showSaveStatus("Call Management details", true);
          this.alertService.showSaveStatus("Call Management details", true);
		  this.getCallManagementList();
          this.closecalleditEntryView();
        } else {
          this.alertService.showSaveStatus("Call Management details", false);
        }
	  
	  });
	  }/* else{ 
	  } */
  }
  public opencalleditEntryForm() {    
	this.iscalleditFormAttemptSubmit = false;
    document.getElementById('editcallModal').classList.toggle('d-block');
  }
  public closecalleditEntryView() {
    this.callmanagementEditForm.reset();
    this.iscalleditFormAttemptSubmit = false;
    document.getElementById('editcallModal').classList.toggle('d-block');
  } 
  public closeCallMngtViewModal(){
    this.callManagementViewData = null;
    document.getElementById('callMngtViewModal').classList.toggle('d-block');
  }

  public onItemSelect(event:any){    
    this.isNotEmployeesSelected = !(this.allotCallManagementForm.value.employees && 
                                    this.allotCallManagementForm.value.employees.length > 0);    
    this.setFirstSelectedEmpMobileNo();
  }

  public onItemDeSelect(event:any){    
    this.isNotEmployeesSelected = (!this.allotCallManagementForm.value.employees || 
                                    this.allotCallManagementForm.value.employees.length == 0);
    this.setFirstSelectedEmpMobileNo();
  }

  public onGuranteePeriodClicked(event:any, data:any){
    let cancelEvent = true;
    let guranteePeriod = null;

    if(data.cdGuranteePeriod && data.cdGuranteePeriod.toLowerCase() == 'yes') {
      if(true === confirm("Are you sure to change the gurantee period to 'No'")){        
        cancelEvent = false;  
        guranteePeriod = "No";      
      } 
    } else if(!data.cdGuranteePeriod || data.cdGuranteePeriod.toLowerCase() == 'no'){      
      if(true === confirm("Are you sure to change the gurantee period to 'Yes'")){
        cancelEvent = false;
        guranteePeriod = "Yes";
      } 
    } else {
      cancelEvent = false;
      guranteePeriod = null;
      console.log("Invalid gurantee period.");
    }

    if(cancelEvent) {
      event.preventDefault();
    } else { // User wish to update the gurantee period.
      let params = { "cdId" : data.cdId, "cdGuranteePeriod" : guranteePeriod };
      this.callManagementService.saveGuranteePeriod(params).subscribe((resp:any)=>{        
        if(resp.status == "success"){
          this.getCallManagementList();
        }        
      });
    }
  } 

  public deleteCallData(callData:any){
    if(confirm("Are your sure that your want to delete this call management details?")){
      let params = { "cdId" : callData.cdId };
      this.callManagementService.deleteCallDetails(params).subscribe((resp:any)=>{        
        if(resp.status == "success"){
          this.getCallManagementList();
          alert("The call management details has been deleted successfully.");
        }        
      });
    }
  }

  public onDownloadExcelClicked(){
    let params = this.getSearchParams();
    this.downloadCtrl.downloadExcel("CallManagement", params);
  }

  protected getCallManagementList() {    
	let params = this.getSearchParams();
	this.callManagementService.getCallManagementList(params).subscribe((resp:any)=>{
      //console.log("Received call details.");
      //this.callManagementList = resp["callDetails"]; // .filter((x:any) => x.cdId < 10);
	  this.callManagementList = resp["callDetails"]["callDetailModelList"];
      const messageCount=resp["callDetails"].totalCount;
	  this.totalItems = messageCount;
	  if(this.totalItems > 0){
		this.isPaginationVisible = true;
	  }
	  });
  }
  onresetSearch() {    
	let params = { 
		  "dateFrom" : "",
		  "dateTo" : "",
		  "searchKeyWord" : "",
		  "callStatus" : -1,
		  "gurenteePeriod" : "all",
		  "pageNo" : 1,
		  "pageCount" : 15,
		};
	this.callManagementService.getCallManagementListSearched(params).subscribe((resp:any)=>{
      //console.log("Received call details.");
      //this.callManagementList = resp["callDetails"]; // .filter((x:any) => x.cdId < 10);
	  this.callManagementList = resp["callDetails"]["callDetailModelList"];
      const messageCount=resp["callDetails"].totalCount;
	  this.totalItems = messageCount;
	  if(this.totalItems > 0){
		this.isPaginationVisible = true;
	  }
	  });
  }
  protected getCallManagementListSearched() {    
	let params = this.getSearchParams();
	this.callManagementService.getCallManagementListSearched(params).subscribe((resp:any)=>{
      //console.log("Received call details.");
      //this.callManagementList = resp["callDetails"]; // .filter((x:any) => x.cdId < 10);
	  this.callManagementList = resp["callDetails"]["callDetailModelList"];
      const messageCount=resp["callDetails"].totalCount;
	  this.totalItems = messageCount;
	  if(this.totalItems > 0){
		this.isPaginationVisible = true;
	  }
	  });
  }
  public getCallManagementListPage(page: any) {
	let params = this.getSearchParams();
	params.pageNo = page;
	this.callManagementService.getCallManagementList(params).subscribe((resp:any)=>{      
	  //this.callManagementList = resp["callDetails"];
	  this.callManagementList = resp["callDetails"]["callDetailModelList"];
      const itemsCount=resp["callDetails"].totalCount;
	  this.totalItems = itemsCount;
	  if(this.totalItems > 0){
		this.isPaginationVisible = true;
	  }
	  this.page = page;
    });
	
  }
  protected getSearchParams(){
    let searchFilter = this.callMngtSearchForm.value;
    let callStatus = searchFilter.callManagementStatus == "" ? -1 : parseInt(searchFilter.callManagementStatus);
    if(isNaN(callStatus)){
      callStatus = -1;
    }
	let params = { 
		  "dateFrom" : searchFilter.dateFrom == null ? "" : searchFilter.dateFrom,
		  "dateTo" : searchFilter.dateTo == null ? "" : searchFilter.dateTo,
		  "searchKeyWord" : searchFilter.searchKeyWord == null ? "" : searchFilter.searchKeyWord,
		  "callStatus" : callStatus,
		  "gurenteePeriod" : searchFilter.gurenteePeriod == null ? "all" : searchFilter.gurenteePeriod,
		  "pageNo" : 1,
		  "pageCount" : 15,
		};
    return params;
  }

  protected setFirstSelectedEmpMobileNo(){
    if(this.allotCallManagementForm.value.employees && this.allotCallManagementForm.value.employees.length > 0) {
      // Get the first employee id
      let empId = this.allotCallManagementForm.value.employees[0].employeeId;
      let employee = this.employeeList.find(x => x.employeeId == empId);
      this.allotCallManagementForm.patchValue({"mobileNumber" : employee.primaryMobileNo});      
    } 
  }

  protected getCallMangementDetaildById(callDetail:any){
    this.callAllotmentList = null;
    let param = { "cdId" : callDetail.cdId };
    this.callManagementViewData = callDetail;
    this.callManagementService.getCallDetailByCdId(param).subscribe((resp:any)=>{
      if(resp.status == "success"){
        this.callAllotmentList = (resp.callDetail && resp.callDetail.allots) ? resp.callDetail.allots : null;
        if(this.callAllotmentList){
          this.callManagementService.markAsRead({ "action" : "callDetails", "id" : callDetail.cdId}).subscribe((resp:any)=>{
            if(resp.status == "success") {
              let record = this.callManagementList.find(x=> x.cdId == resp.updateStatus);
              record.viewAlert = 0;
            }
          });
        }
      }
    })
  }
  get editForm() { return this.callmanagementEditForm.controls; }
  get searchForm() { return this.callMngtSearchForm.controls; }
}
