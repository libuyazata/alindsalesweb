import { Component, OnInit } from '@angular/core';

import { environment } from '@env/environment';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DepartmentService } from '@app/department/department.service';
import { BaseComponent } from '@app/core/component/base.component';
// import { stat } from 'fs';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.scss']
})
export class DepartmentComponent extends BaseComponent implements OnInit {

  version: string = environment.version;
  public departmentSaveForm : FormGroup;
  //public employeeList : Array<any>;
  //public salaryInfoList : Array<any>;
  public isDepartmentFormAttemptSubmit :Boolean = false;

  public departmentList : Array<any>;
  public departmentSearchForm : FormGroup;

  constructor(private departmentService : DepartmentService) { 
    super(departmentService);
  }

  ngOnInit() { 
    /*
    createdAt: 1527726446000
    departmentId: 1
    departmentName: "AFTER SALES"
    description: null
    emailId: "aftersales@alindrelays.com"
    isActive: 1
    mobileNo: "9446001704/320"
    updatedAt: 1527800257000
    */
    this.departmentSaveForm = new FormGroup({
      departmentId : new FormControl(''),
      departmentName : new FormControl('',  Validators.required),
      description : new FormControl('',),
      emailId : new FormControl('', Validators.required),
      isActive : new FormControl('',  Validators.required),
      mobileNo : new FormControl('',  Validators.required)
    });
    this.departmentSearchForm = new FormGroup({
      departmentStatus : new FormControl(''),
    });
    this.getDepartmentList();
  }

  // Convenience getter for easy access to leave request form fields.
  get departmentForm() { return this.departmentSaveForm.controls; }

  public onDepartmentDetailsSubmitted(){
    this.isDepartmentFormAttemptSubmit = true;
    if(this.departmentSaveForm.valid) {      
      this.departmentService.saveOrUpdateDepartment(this.departmentSaveForm.value).subscribe((resp:any)=>{
        this.showAlert("Department details has been submitted successfully");
        this.getDepartmentList();
        this.closeDepartmentEntryView();
      })
    } else {
      this.showAlert("Please fill all the mandatory fields before submit.");
    }
  }

  public editDepartmentDetails(departmentInfo:any){
    this.openDepartmentEntryForm();
    this.departmentSaveForm.patchValue(departmentInfo);
  }

  /* Add / Save Project View  Model Open Close Method */
  public openDepartmentEntryForm() {    
    this.isDepartmentFormAttemptSubmit = false;
    document.getElementById('departmentModal').classList.toggle('d-block');
  }

  public resetAndOpenDepartmentEntryForm() {    
    this.departmentSaveForm.reset();
    this.isDepartmentFormAttemptSubmit = false;
    document.getElementById('departmentModal').classList.toggle('d-block');
  }  

  public closeDepartmentEntryView() {
    this.departmentSaveForm.reset();
    this.isDepartmentFormAttemptSubmit = false;
    document.getElementById('departmentModal').classList.toggle('d-block');
  } 

  public onDepartmentStatusChanged(event:any){
    this.getDepartmentList();
  }
  
  /* End of Add / Save Project View */

  protected getDepartmentList() {
    let params = {
      status : this.departmentSearchForm.value.departmentStatus == "" ? "-1" : this.departmentSearchForm.value.departmentStatus
    }
    this.departmentService.getDepartmentList(params).subscribe((resp:any)=>{      
      this.departmentList = resp["departmentList"];
    });
  }  
}
