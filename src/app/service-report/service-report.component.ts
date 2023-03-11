import { Component, OnInit, ViewChild } from '@angular/core';

import { environment } from '@env/environment';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ServiceReportService } from '@app/service-report/service-report.service';
import { BaseComponent } from '@app/core/component/base.component';
import { DownloadComponent } from '@app/shared/components/download-ctrl/download.component';

@Component({
  selector: 'app-service-report',
  templateUrl: './service-report.component.html',
  styleUrls: ['./service-report.component.scss']
})
export class ServiceReportComponent extends BaseComponent implements OnInit {

  public intervalId:any;
  public basePath:string;
  public employeeList : Array<any>;
  public serviceReportViewData : any;
  public serviceReportList : Array<any>;
  public serviceReportSearchForm : FormGroup;
  public serviceReportSubmitForm : FormGroup; // Gurantee period submit
  public isServiceReportSubmitFormSubmit = false;  

  @ViewChild(DownloadComponent) downloadCtrl:DownloadComponent;

  constructor(private serviceReportService : ServiceReportService) { 
    super(serviceReportService);
    this.basePath = environment.serverUrl;
  }

  ngOnInit() {     
    this.serviceReportSearchForm = new FormGroup({
      statusId : new FormControl(''),
      employeeId : new FormControl(''),
      serviceReportStatus : new FormControl(''),
      searchKeyWord : new FormControl(''),
      dateFrom : new FormControl(''),
      dateTo : new FormControl(''),
      gurenteePeriod : new FormControl('')
    });
    this.serviceReportSubmitForm = new FormGroup({
      srId: new FormControl('', Validators.required),
      slNo : new FormControl(''),
      gurenteePeriod : new FormControl('', Validators.required)
    });
    this.serviceReportSearchForm.patchValue({"statusId" : "-1"});
    this.serviceReportSearchForm.patchValue({"employeeId" : "-1"});
    this.serviceReportSearchForm.patchValue({"gurenteePeriod" : "all"});
    this.serviceReportSearchForm.patchValue({"serviceReportStatus" : "all"});
        
    this.getEmployees();

    // Load the data.
    this.getServiceReportList();
    this.intervalId = setInterval(() => {
      this.getServiceReportList(); 
    }, 60000);
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  public onServiceReportSearched(){   
    this.getServiceReportList();    
  }

  // Convenience getter for easy access to service report form fields.
  get serviceReportSrchForm() { return this.serviceReportSearchForm.controls; }

  // Convenience getter for easy access to form fields.
  get serviceReportSaveForm() { return this.serviceReportSubmitForm.controls; }

  public openServiceReportViewModal(serviceDetails:any){
    this.serviceReportViewData = serviceDetails;
    this.serviceReportService.markAsRead({ "action" : "serviceReport", "id" : serviceDetails.srId}).subscribe((resp:any)=>{
      if(resp.status == "success") {
        let record = this.serviceReportList.find( x=> x.srId == resp.updateStatus);
        record.viewAlert = 0;
      }
    });
    document.getElementById('serviceReportViewModal').classList.toggle('d-block');
  }

  public closeServiceReportViewModal(){
    this.serviceReportViewData = null;
    document.getElementById('serviceReportViewModal').classList.toggle('d-block');
  }

  public editServiceReport(serviceReport:any){
    this.openServiceReportSubmitView();
    this.serviceReportSubmitForm.patchValue({"srId" : serviceReport.srId});
    this.serviceReportSubmitForm.patchValue({"slNo" : serviceReport.callDetail.productSlNo});
    if(serviceReport.gurenteePeriod){      
      this.serviceReportSubmitForm.patchValue({"gurenteePeriod" : serviceReport.gurenteePeriod.toLowerCase()});
    }
  }

  public openServiceReportSubmitView() {
    document.getElementById('serviceReportSubmitModal').classList.toggle('d-block');
  }

  public closeServiceReportSubmitView(){
    this.isServiceReportSubmitFormSubmit = false;
    document.getElementById('serviceReportSubmitModal').classList.toggle('d-block');
  }

  public onServiceReportSubmitted(){
    this.isServiceReportSubmitFormSubmit = true;
    if(this.serviceReportSubmitForm.valid){
      let report = this.serviceReportSubmitForm.value;
      this.serviceReportService.submitServiceReport(report).subscribe((resp:any)=>{
        if(resp.status == "success"){
          this.closeServiceReportSubmitView();
          alert("Service report has been submitted successfully");
          this.getServiceReportList();
        }
      })
    }
  }

  public onDownloadExcelClicked(){    
    let params = this.getSearchParams();
    this.downloadCtrl.downloadExcel("ServiceReport", params);    
  }

  public onDownloadPdfClicked(tAlId: number){
    // let params = this.getSearchParams();
    let params = {
      alId : tAlId
    }
    this.downloadCtrl.downloadPdf("Minutes Of Meeting", params);
  }

  public print(event: any) {
    // this.invokePrint("Service Report", "serviceReportPrintSection");
    event.preventDefault();

    let element: HTMLElement = document.getElementById("report-download-control") as HTMLElement;
    element.click();
  }
 
  protected getSearchParams(){
    let searchFilter = this.serviceReportSearchForm.value;
    let params = {
       "statusId" : searchFilter.statusId == null ? "-1" : searchFilter.statusId,
       "employeeId" : searchFilter.employeeId == null ? "-1" : searchFilter.employeeId,
       "dateFrom" : searchFilter.dateFrom == null ? "" : searchFilter.dateFrom,
       "dateTo" : searchFilter.dateTo == null ? "" : searchFilter.dateTo,
       "searchKeyWord" : searchFilter.searchKeyWord == null ? "" : searchFilter.searchKeyWord,
       "gurenteePeriod" : searchFilter.gurenteePeriod == null ? "all" : searchFilter.gurenteePeriod,
    }
    return params;
  }

  protected getServiceReportList() {
    let params = this.getSearchParams();
    this.serviceReportService.searchServiceReport(params).subscribe((resp:any)=>{      
      this.serviceReportList = resp["serviceReports"];
    });
  }  

  protected getEmployees() {
    let params = { "departmentId": -1, "designationId" : -1, "searchKeyWord" : ""};
    this.serviceReportService.getEmployeeList(params).subscribe((resp:any)=>{
      this.employeeList = resp.employeeList;
    }); 
  }
}
