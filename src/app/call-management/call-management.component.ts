import { Component, OnInit, ViewChild } from '@angular/core';

import { environment } from '@env/environment';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { BaseComponent } from '@app/core/component/base.component';
import { CallManagementService } from '@app/call-management/call-management.service';
import { ActivatedRoute } from '@angular/router';
import { DownloadComponent } from '@app/shared/components/download-ctrl/download.component';
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
  
  @ViewChild(DownloadComponent) downloadCtrl:DownloadComponent;
  
  constructor(private callManagementService : CallManagementService,
              // private excelService:ExcelService, 
              private route: ActivatedRoute,
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
      gurenteePeriod : new FormControl('')
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
    this.callManagementService.getEmployeeList( { "departmentId": -1, "designationId" : -1, "searchKeyWord" : ""}).subscribe((resp:any)=>{
      this.employeeList = resp.employeeList;
    });    

    // Load the data.
    this.getCallManagementList(); 
    this.intervalId = setInterval(() => {
      this.getCallManagementList(); 
    }, 60000);
  }  

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  public onCallManagementSearched(){   
    this.getCallManagementList();    
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
      console.log("Received call details.");
      this.callManagementList = resp["callDetails"]; // .filter((x:any) => x.cdId < 10);
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
}
