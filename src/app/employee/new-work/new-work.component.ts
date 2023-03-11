import { Component, OnInit, ViewChild } from '@angular/core';

import { environment } from '@env/environment';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BaseComponent } from '@app/core/component/base.component';
import { ActivatedRoute } from '@angular/router';
import { NewWorkDetailsService } from '@app/employee/new-work/new-work.service';
import { HttpEventType, HttpResponse } from '@angular/common/http';

import {Observable} from 'rxjs';
import {debounceTime, distinctUntilChanged, map} from 'rxjs/operators';
import { DownloadComponent } from '@app/shared/components/download-ctrl/download.component';

@Component({
  selector: 'app-new-work-details',
  templateUrl: './new-work.component.html',
  styleUrls: ['./new-work.component.scss']
})
export class NewWorkDetailsComponent extends BaseComponent implements OnInit {
   
  public intervalId:any;
  protected fileToUpload : any; // MoM files
  public isMomFormAttemptSubmit: Boolean;

  public allotedWork : any;  
  public basePath:string;
  public newWorkList : Array<any>;
  public observationList : Array<any>;
  public serviceReportData: any; // View data model
  public minsOfMeetingForm : FormGroup;
  public newWorkReportSearchForm : FormGroup;  
  public allotCallManagementForm : FormGroup;
  public isAllotCallManagementFormAttemptSubmit : Boolean;

  public obmList : any[] = [];

  public obmDropdownSettings  = {
    singleSelection: false,
    idField: 'obervationId',
    textField: 'obervationDetails',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 3,
    allowSearchFilter: true
  };

  public natureOfJobList : any[] = [];

  public natureOfJobDropdownSettings  = { 
    ssingleSelection: false,
    idField: 'natureJobId',
    textField: 'jobNature',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 3,
    allowSearchFilter: true
  };
  
  /* Auto Complete */
  public observationModel: any;

  @ViewChild(DownloadComponent) downloadCtrl:DownloadComponent;

  searchObservations = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 2 ? []
        : this.observationList.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
  );
  /* */

  constructor(private newWorkDetailsService : NewWorkDetailsService, 
              private route: ActivatedRoute) { 
    super(newWorkDetailsService);
                this.allotedWork = null;
                this.isMomFormAttemptSubmit = false;
                this.basePath = environment.serverUrl;
  }

  ngOnInit() {   

    this.getNatureOfJobs();
    this.getObservationDetails();

    this.isAllotCallManagementFormAttemptSubmit = false;   
    this.newWorkReportSearchForm = new FormGroup({
      searchKeyWord : new FormControl(''),
      dateFrom : new FormControl(''),
      dateTo : new FormControl(''),
      // gurenteePeriod : new FormControl('')
    });
     
    this.minsOfMeetingForm = new FormGroup({
      srId : new FormControl(''),
      obervationDetails: new FormControl('', Validators.required),
      productSlNo: new FormControl('', Validators.required),
      srCallAttendDate : new FormControl('', Validators.required),
      srCallClosedDate : new FormControl('', Validators.required),
      srCallStatus : new FormControl('', Validators.required),
      srNaturalOfService : new FormControl('', Validators.required),
      srRemarks : new FormControl('', Validators.required),
      // srReportedProblem : new FormControl('', Validators.required),
      sr_cd_id : new FormControl('')
    });
    // this.getNewWorkDetails();   
    
    // this.newWorkDetailsService.getAllObservationBeforeMaintanence().subscribe((resp:any)=>{
    //   if(resp.status == "success") {
    //     this.observationList = resp.obList.map((item:any)=> item.obervationDetails);
    //     console.log(this.observationList);
    //   }
    // });

    // Load the data.
    this.getNewWorkDetails();
    
    this.intervalId = setInterval(() => {
      this.getNewWorkDetails(); 
    }, 60000);
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  // Convenience getter for easy access to the form fields.
  get momForm() { return this.minsOfMeetingForm.controls; }

  public onWorkDetailsSearched(){
    this.getNewWorkDetails();    
  }

  public openMoMModalView() {    
    document.getElementById('minOfMeetingModal').classList.toggle('d-block');
  }

  public closeMoMModalView() {
    this.isMomFormAttemptSubmit = false;
    document.getElementById('minOfMeetingModal').classList.toggle('d-block');
  } 

  private getStringData(obj:any) {
    return JSON.stringify(obj);
  }

  public onMoMDetailsSubmitted(){
    this.isMomFormAttemptSubmit = true;
    if(!this.minsOfMeetingForm.invalid) {      
      var formData = new FormData();     
      if(this.fileToUpload){
         // Array.from(files).forEach(f => formData.append('file', f, f.name));
        formData.append('momFile', this.fileToUpload, this.fileToUpload.name);
      }
      formData.append("srId", this.momForm.srId.value);
      formData.append("productSlNo", this.momForm.productSlNo.value);
      formData.append("obervationDetails", this.getStringData(this.momForm.obervationDetails.value));
      formData.append("srCallAttendDate", this.momForm.srCallAttendDate.value);
      formData.append("srCallClosedDate", this.momForm.srCallClosedDate.value);
      formData.append("srCallStatus", this.momForm.srCallStatus.value);
      formData.append("srNaturalOfService", this.getStringData(this.momForm.srNaturalOfService.value));
      formData.append("srRemarks", this.momForm.srRemarks.value);
      // formData.append("srReportedProblem", this.momForm.srReportedProblem.value);
      formData.append("sr_cd_id", this.momForm.sr_cd_id.value);
      console.log(formData);
      this.newWorkDetailsService.saveOrUpdateServiceReport(formData).subscribe((event:any)=>{        
        if (event && event instanceof HttpResponse) {
          this.closeMoMModalView();
          this.getNewWorkDetails();
          alert("The details has been submitted successfully.");
        }
      })
    }
    console.log(this.minsOfMeetingForm.value);
  }

  public onMoMFileSelected(files: FileList) {
    this.fileToUpload = files.item(0);
  }

  public onServiceRecordClicked(serviceReport:any){    
    this.newWorkDetailsService.getAllottedWorkDetailsByAllotId({ "alId" : serviceReport.alId}).subscribe((resp:any)=>{      
      this.resetMoMView();
      this.minsOfMeetingForm.patchValue({"srCallStatus" : ""});
      this.openMoMModalView();

      // Now patch the values
      this.allotedWork = resp["allot"];
      this.minsOfMeetingForm.patchValue({"sr_cd_id" : this.allotedWork.callDetail.cdId});      
    });    
  }  

  public openNewWorkViewModal(newWork:any){
    
    let params = { "alId" : newWork.alId };
    this.newWorkDetailsService.getServiceReportByAllotId(params).subscribe((resp:any) => {
      if(resp.status == "success"){
        this.serviceReportData = resp.serviceReport;
        this.openMoMViewModal();
        this.markAsRead(newWork);
      }
    });
  }
  
  public closeMoMViewModal(){
    document.getElementById('serviceReportViewModal').classList.toggle('d-block');
  }

  public openMoMViewModal(){
    document.getElementById('serviceReportViewModal').classList.toggle('d-block');
  }

  getJobNature(objArray: any[]) {

    let objStr = "";
    let index = 0;

    objArray.forEach(element => {
      objStr += index++ > 0 ? "," : "";
      objStr += element.jobNature;
    });
  }

  getObservationDetailsView(objArray: any[]) {
    
    let objStr = "";
    let index = 0;

    objArray.forEach(element => {
      objStr += index++ > 0 ? "," : "";
      objStr += element.obervationDetails;
    });
  }

  public print(event : any) {
    event.preventDefault();

    let element: HTMLElement = document.getElementById("report-download-control") as HTMLElement;
    element.click();
    // let params = { "alId" : alId };
    // this.newWorkDetailsService.getMinutesofMeetingPrint(params).subscribe((resp:any) => {
    //   // if(resp.status == "success"){
    //     console.log(resp)
    //   // }
    // });
    
    // this.invokePrint("Work Details", "serviceReportPrintSection");
  }

  public onDownloadExcelClicked(){
    let params = this.getSearchParams();
    this.downloadCtrl.downloadExcel("EmpNewWork", params);
  }

public onDownloadPdfClicked(tAlId: number){
    // let params = this.getSearchParams();
    let params = {
      alId : tAlId
    }
    this.downloadCtrl.downloadPdf("Minutes Of Meeting", params);
  }

  private getNatureOfJobs() {
    let params = {};
    this.newWorkDetailsService.getJobNatureList(params).subscribe((resp:any) => {
      this.natureOfJobList = resp["natureOfJobs"];
    });
  }

  private getObservationDetails() {
    let params = {};
    this.newWorkDetailsService.getObmList(params).subscribe((resp:any) => {
      this.observationList = resp["obList"];
    });
  }
  
  protected getSearchParams(){
    let searchFilter = this.newWorkReportSearchForm.value;    
    let params = {
      "searchKeyWord" : searchFilter.searchKeyWord == null ? "" : searchFilter.searchKeyWord,
      "employeeId" : this.getUserId(),
      //"callStatus"  : searchFilter.serviceReportStatus,
      "dateFrom" : searchFilter.dateFrom == null ? "" : searchFilter.dateFrom,
      "dateTo" : searchFilter.dateTo == null ? "" : searchFilter.dateTo,      
      //"gurenteePeriod" : "all",      
    }
    return params;
  }

  protected markAsRead(data:any){
    this.newWorkDetailsService.markAsRead({ "action" : "newWork", "id" : data.alId}).subscribe((resp:any)=>{
      if(resp.status == "success") {         
        let record = this.newWorkList.find(x=> x.alId == resp.updateStatus);
        record.viewAlert = 0;
      }
    });
  }

  protected resetMoMView(){
    this.minsOfMeetingForm.reset();
  }
  
  protected getNewWorkDetails() { 
    let params = this.getSearchParams();
    this.newWorkDetailsService.getAllottedWorkDetails(params).subscribe((resp:any)=>{
      this.newWorkList = resp["allottedWorks"];
    });
  }
}
