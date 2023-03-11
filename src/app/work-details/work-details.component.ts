import { Component, OnInit, ViewChild } from '@angular/core';

import { environment } from '@env/environment';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BaseComponent } from '@app/core/component/base.component';
import { WorkDetailsService } from '@app/work-details/work-details.service';
import { ActivatedRoute } from '@angular/router';
import { DownloadComponent } from '@app/shared/components/download-ctrl/download.component';

@Component({
  selector: 'app-work-details',
  templateUrl: './work-details.component.html',
  styleUrls: ['./work-details.component.scss']
})
export class WorkDetailsComponent extends BaseComponent implements OnInit {
   
  public intervalId:any;
  public workDetailsViewData:any;  
  public employeeList : Array<any>;
  public dropdownSettings: any = {};
  public isNotEmployeesSelected: boolean = false; // For work allotment
  public onGoingServiceReportList : Array<any>;
  public serviceReportSearchForm : FormGroup;
  public allotCallManagementForm : FormGroup;
  public isAllotCallManagementFormAttemptSubmit : Boolean;

  @ViewChild(DownloadComponent) downloadCtrl:DownloadComponent;

  constructor(private workDetailsService : WorkDetailsService, 
              private route: ActivatedRoute) { 
    super(workDetailsService);
  }

  ngOnInit() {            
    this.serviceReportSearchForm = new FormGroup({
      searchKeyWord : new FormControl(''),
      dateFrom : new FormControl(''),
      dateTo : new FormControl(''),
      gurenteePeriod : new FormControl('')
    });       
    this.serviceReportSearchForm.patchValue({"gurenteePeriod" : "all"});
    // this.getOnGoingCallManagementList();

    this.allotCallManagementForm = new FormGroup({
      alId: new FormControl(''),
      employees : new FormControl('', Validators.required),
      mobileNumber : new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$"), 
                                          Validators.maxLength(10), Validators.minLength(10)]),
      allotDate : new FormControl('', Validators.required),
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
    this.workDetailsService.getEmployeeList({"departmentId": -1, "designationId" : -1, "searchKeyWord" : ""}).subscribe((resp:any)=>{
      this.employeeList = resp.employeeList;
    });

    // Load the data.
    this.getOnGoingCallManagementList();
    this.intervalId = setInterval(() => {
      this.getOnGoingCallManagementList(); 
    }, 60000);
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  public onWorkDetailsSearched(){
    // Combination of Call Management "OnGoing" status and service report data is the work details.
    this.getOnGoingCallManagementList();    
  }

  public openWorkDetailsViewModal(workDetails:any){
    this.workDetailsViewData = workDetails;
    this.workDetailsService.markAsRead({ "action" : "workDetails", "id" : workDetails.srId}).subscribe((resp:any)=>{
      if(resp.status == "success") {
        let record = this.onGoingServiceReportList.find(x=> x.srId == resp.updateStatus);
        record.viewAlert = 0;
      }
    });
    document.getElementById('workDetailsViewModal').classList.toggle('d-block');
  }

  public closeWorkDetailsViewModal(){
    this.workDetailsViewData = null;
    document.getElementById('workDetailsViewModal').classList.toggle('d-block');
  }

  public onDownloadExcelClicked(){
    let params = this.getSearchParams();
    this.downloadCtrl.downloadExcel("WorkDetails", params);
  }

  /* === Allot Employee === */
  // Convenience getter for easy access of form fields.
  get allotCallMngtForm() { return this.allotCallManagementForm.controls; }

  public allotCallDetails(data:any){
    this.resetAndOpenAllotEntryForm();
    this.allotCallManagementForm.controls.alId.patchValue(data.alId); 
    this.allotCallManagementForm.controls.mobileNumber.patchValue(data.workPhNo);     
    if(data.cdAllotDate){
      const allottedDate = new Date(data.cdAllotDate).toISOString().substring(0, 10);
      this.allotCallManagementForm.controls.allotDate.setValue(allottedDate);
    }
        
    let selectedAllotedEmployees = new Array();
    if(data.employeeList && data.employeeList.length > 0){
      data.employeeList.forEach((element:any) => {        
        selectedAllotedEmployees.push({"employeeId": element.employeeId, "fullName": element.firstName + " " + element.lastName, "isDisabled": false});
      });
    }
    this.allotCallManagementForm.controls.employees.setValue(selectedAllotedEmployees);
  }

  public onAllotCallManagementSubmitted(){
    this.isAllotCallManagementFormAttemptSubmit = true;    
    if(this.allotCallManagementForm.valid) {
      let allotInfo = this.allotCallManagementForm.value;
      this.workDetailsService.allotEmployees(allotInfo).subscribe((resp:any)=>{
        alert("Employees has been allotted sucessfully.");
        this.closeAllotEntryView();
        this.getOnGoingCallManagementList();
      });
    }
  }

  public resetAndOpenAllotEntryForm() {    
    this.allotCallManagementForm.reset();
    this.isAllotCallManagementFormAttemptSubmit = false;
    document.getElementById('allotModal').classList.toggle('d-block');
  }  

  public closeAllotEntryView() {
    this.allotCallManagementForm.reset();
    this.isAllotCallManagementFormAttemptSubmit = false;
    document.getElementById('allotModal').classList.toggle('d-block');
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

  public print() {
    this.invokePrint("Work Details", "workDetailsViewPrintSection");
  }

  protected setFirstSelectedEmpMobileNo(){    
    if(this.allotCallManagementForm.value.employees && this.allotCallManagementForm.value.employees.length > 0) {
      // Get the first employee id
      let empId = this.allotCallManagementForm.value.employees[0].employeeId;
      let employee = this.employeeList.find(x => x.employeeId == empId);
      this.allotCallManagementForm.patchValue({"mobileNumber" : employee.primaryMobileNo});      
    } 
  }
  
  /* === End of allotment === */

  /*
    Combination of Call Management "OnGoing" status and service report data is the work details.
  */

  protected getSearchParams(){
    let searchFilter = this.serviceReportSearchForm.value;    
    let params = {
      //"callStatus"  : searchFilter.serviceReportStatus,
      "dateFrom" : searchFilter.dateFrom == null ? "" : searchFilter.dateFrom,
      "dateTo" : searchFilter.dateTo == null ? "" : searchFilter.dateTo,
      "searchKeyWord" : searchFilter.searchKeyWord == null ? "" : searchFilter.searchKeyWord,
      "gurenteePeriod" : searchFilter.gurenteePeriod == null ? "all" : searchFilter.gurenteePeriod,
    }
    return params;
  }
  protected getOnGoingCallManagementList() {
    let params = this.getSearchParams();
    this.workDetailsService.searchWorkAllotDetails(params).subscribe((resp:any)=>{
      this.onGoingServiceReportList = resp["callDetails"]; 
    });
  }

}
