import { Component, OnInit } from '@angular/core';

import { environment } from '@env/environment';
import { FormGroup, FormControl, Validators } from '@angular/forms';
//import { DatePipe } from '@angular/common';

import { ProjectService } from '@app/project/project.service';
import { IMyDpOptions } from 'mydatepicker';
import { BaseComponent } from '@app/core/component/base.component';
import { invalid } from '@angular/compiler/src/render3/view/util';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent extends BaseComponent implements OnInit {

  public selectedProjectId : number; // Project Id selected for editing.
  public saveProjectForm : FormGroup;
  public projectSearchForm : FormGroup;
  public projectPaymentStatusForm : FormGroup;
   
  public employeeList : Array<any>;  
  public projectInfoList : Array<any>;  // Contains all projects
  public projectInfoLive : Array<any>;  // Contains the projects of status in progress.
  public projectStatusList : Array<any>;
  public paymentStatusList : Array<any>;
  public projectResourceList : Array<any>;
  public projectPaymentInfoList : Array<any>;
  public userProjectAllocationInfo : Array<any>;    // Contains the allocated projects for a user.
  
  public isProjectFormAttemptSubmit : Boolean = false;
  public isProjectSearchFormAttemptSubmit : Boolean = false;
  public isProjectPaymentFormAttemptSubmit : Boolean = false;
  public isProjectDocumentsTabDisabled : Boolean = true; // Default its disabled, if project id available enable it

  public projectPickerOptions: IMyDpOptions = {
      // other options...
      dateFormat: 'dd mmm yyyy',
      inline: false,
  };

  constructor(private projectService:ProjectService) { 
    super(projectService);
  }

  ngOnInit() {
    this.saveProjectForm = new FormGroup({
      projectId : new FormControl(),
      projectName : new FormControl('', Validators.required),
      projectCode : new FormControl('', Validators.required),
      amcCode : new FormControl(''),
      description : new FormControl(''),
      projectStatusId : new FormControl('', Validators.required),
      startDate : new FormControl('', Validators.required),
      endDate : new FormControl('', Validators.required),
      quotationNo : new FormControl(''),
      purchaseOrderNo : new FormControl(''),
      contactNo : new FormControl(''),
      projectJobCardApproval : new FormControl(''),
      detailsOfSuppliers : new FormControl(''),
      detailsOfSubContractors : new FormControl(''),
      comments : new FormControl(''),
      projectValue : new FormControl(''),
      amountReceived : new FormControl(''),
      outstandingAmount : new FormControl(''),
      scopeOfWork : new FormControl(''),
      paymentStatus : new FormControl(''),
      contractRefNo : new FormControl(''),
      dateOfContract : new FormControl(''),
      clientName : new FormControl(''),
    });
    
    this.projectSearchForm = new FormGroup({
      userId : new FormControl('', Validators.required),
      projectId : new FormControl('', Validators.required),
      startDate : new FormControl('', Validators.required),
      endDate : new FormControl('', Validators.required),
    });

    this.projectPaymentStatusForm = new FormGroup({
      projectPaymentStatusid : new FormControl(''),
      projectId : new FormControl('', Validators.required),
      amountReceived : new FormControl('', Validators.required),
      amountReceivedDate : new FormControl('', Validators.required),
      remarks : new FormControl(''),
      retention : new FormControl(''),
      securityBond : new FormControl(''),
      bankName : new FormControl(''),
      chequeNo : new FormControl(''),
      invoiceNo : new FormControl(''),
    });

    this.getProjectList();
    this.getEmployeeList();
    this.getProjectStatusList();
    this.getPaymentStatusList(); // Status like Open, Close etc
    this.getProjectPaymentStatusList(); // Payment List
  }

  /* Add / Save Project View  Model Open Close Method */
  public openProjectView() {    
    this.isProjectDocumentsTabDisabled = true;
    document.getElementById('projectViewModal').classList.toggle('d-block');
  }

  public resetAndOpenProjectForm() {    
    this.saveProjectForm.reset();
    this.isProjectFormAttemptSubmit = false;
    document.getElementById('projectViewModal').classList.toggle('d-block');
  }  

  public closeProjectView() {
    this.selectedProjectId = 0;
    this.saveProjectForm.reset();
    this.isProjectDocumentsTabDisabled = true;
    document.getElementById('projectViewModal').classList.toggle('d-block');
  } 
  /* End of Add / Save Project View */

  /* Project Payment Model Open Close Method */

  public openProjectPaymentView() {    
    this.isProjectDocumentsTabDisabled = true;
    document.getElementById('projectPaymentViewModal').classList.toggle('d-block');
  }

  public resetAndOpenProjectPaymentForm() {    
    this.projectPaymentStatusForm.reset();
    this.isProjectPaymentFormAttemptSubmit = false;
    document.getElementById('projectPaymentViewModal').classList.toggle('d-block');
  }

  public closeProjectPaymentView() {
    this.projectPaymentStatusForm.reset();
    document.getElementById('projectPaymentViewModal').classList.toggle('d-block');
  } 

  /* End of Project Payment */

  public onProjectPaymentSubmitted(){
    this.isProjectPaymentFormAttemptSubmit = true;
    if(!this.projectPaymentStatusForm.invalid) {
      let projectPaymentInfo = this.projectPaymentStatusForm.value;
      projectPaymentInfo.amountReceivedDate = this.getDateFromMyDP(projectPaymentInfo.amountReceivedDate);
      this.projectService.saveProjectPayment(projectPaymentInfo).subscribe((resp:any)=>{
        if(resp.status == "success") {
          this.getProjectPaymentStatusList();
          this.showAlert("Project payment details has been submitted successfully.");
        }
      });
    }
    console.log(this.projectPaymentStatusForm.value);
  }
 
  public editProjectPaymentDetails(projectPaymentInfo:any){
    this.openProjectPaymentView()
    this.projectPaymentStatusForm.patchValue(projectPaymentInfo);    
    this.setProjectPaymentDates(new Date(projectPaymentInfo.amountReceivedDate));
  }

  /* Project Save / Edit Methods */

  public editProjectDetails(projectInfo:any){
    this.openProjectView();
    this.saveProjectForm.patchValue(projectInfo);
    if(projectInfo.projectId > 0){
      this.selectedProjectId = projectInfo.projectId;
      this.isProjectDocumentsTabDisabled = false;
    }
    this.setProjectDates(new Date(projectInfo.startDate), new Date(projectInfo.endDate),  new Date(projectInfo.dateOfContract));
  }

  public onProjectDetailsSubmitted() {
    this.isProjectFormAttemptSubmit = true;
    if(!this.saveProjectForm.invalid) {
      let projectInfo = this.saveProjectForm.value;
      projectInfo.startDate = this.getDateFromMyDP(projectInfo.startDate);
      projectInfo.endDate = this.getDateFromMyDP(projectInfo.endDate);
      projectInfo.dateOfContract = this.getDateFromMyDP(projectInfo.endDate);
      this.projectService.saveProject(projectInfo).subscribe((resp:any)=>{
        if(resp.projectDetails && resp.status == "success") {
          this.selectedProjectId = resp.projectDetails.projectId;
          this.showAlert("Project details has been saved successfully. Please add the necessary documents from the \"Project Documents\" tab.");
          this.getProjectList();
        } else {
          this.showAlert("An error occured while processing the request.")
        }
      })
    }
  }

   /* End of Project Save / Edit Methods */

  public onProjectSelectionChanged(event:any){
    let projectId = event.target.value;
    if(projectId != "") {
      this.getResourcesByProject(projectId);
    } else {
      this.projectResourceList = []; // Reset it.
    }
  }

  public onProjectAssigned(){    
    if(!this.projectSearchForm.invalid) {
      let projectResource = this.projectSearchForm.value;
      projectResource.startDate = this.getDateFromMyDP(projectResource.startDate);
      projectResource.endDate = this.getDateFromMyDP(projectResource.endDate);
      this.projectService.assignProjectResource(projectResource).subscribe((resp:any)=>{
        this.getProjectByResourceId(projectResource.userId);
        this.getResourcesByProject(projectResource.projectId);
      });
    }
  }

  public onUserSelected(event:any){
    this.getProjectByResourceId(event.target.value);
  }

  // Convenience getter for easy access to project form fields.
  get projectForm() { return this.saveProjectForm.controls; }

  get projectPaymentForm() { return this.projectPaymentStatusForm.controls; }

  // Convenience getter for easy access to project search form fields.
  get projectSearchFormFields() { return this.projectSearchForm.controls; }

  protected getProjectStatusList(){
    this.projectService.getProjectStatusList().subscribe( (resp:any) => {
      this.projectStatusList = resp;
    });
  }

  protected getPaymentStatusList(){
    // Status like Open, Close, ...
    this.projectService.getPaymentStatusList().subscribe( (resp:any) => {
      this.paymentStatusList = resp;
    });
  }

  protected getProjectList(){
    this.projectService.getProjectList().subscribe((resp:any) => {
      this.projectInfoList = resp.projectDetails;
      this.projectInfoLive = this.cloneObjectArray(this.projectInfoList).filter((proj:any)=> proj.projectStatusId == 2);
    });
  }

  protected getResourcesByProject(projectId:number){
    let projectSearch = { "projectId" : projectId };
    this.projectService.getProjectResourceList(projectSearch).subscribe((resp:any) => {
      this.projectResourceList = resp.projectResources;
    });
  }

  protected getEmployeeList(){
    this.projectService.getEmployeeNames().subscribe((resp:any) => {
      this.employeeList = resp.userNameInfo;
    });
  }
  
  protected getProjectPaymentStatusList(){
    let projectInfo = { "projectId" : -1 }; // TODO: Select the project Id from the drop down list
    this.projectService.getProjectPaymentStatusList(projectInfo).subscribe((resp:any) => {
      this.projectPaymentInfoList = resp.projectPaymentStatus;
    });
  }

  protected getProjectByResourceId(userId:number) {
    if(userId){
      let userInfo = { "userId" : userId }
      this.projectService.getProjectByResource(userInfo).subscribe((resp:any)=>{
        this.userProjectAllocationInfo = resp.projectDetails;
      });
    }
  }

  protected setProjectDates(startDate:Date, endDate:Date, dateOfContract:Date): void {
    this.saveProjectForm.patchValue({startDate: {
      date: {
        year: startDate.getFullYear(),
        month: startDate.getMonth() + 1,
        day: startDate.getDate()}
    }});

    this.saveProjectForm.patchValue({endDate: {
      date: {
        year: endDate.getFullYear(),
        month: endDate.getMonth() + 1,
        day: endDate.getDate()}
    }});
    
    this.saveProjectForm.patchValue({dateOfContract: {
      date: {
          year: dateOfContract.getFullYear(),
          month: dateOfContract.getMonth() + 1,
          day: dateOfContract.getDate()}
      }});
  }

  protected setProjectPaymentDates(amountRecived:Date): void {
    this.projectPaymentStatusForm.patchValue({amountRecivedDate: {
    date: {
        year: amountRecived.getFullYear(),
        month: amountRecived.getMonth() + 1,
        day: amountRecived.getDate()}
    }});
  }
}
