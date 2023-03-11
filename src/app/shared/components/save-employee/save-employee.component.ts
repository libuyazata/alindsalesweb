import { Component, Input, OnInit, EventEmitter, Output, OnChanges } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BaseComponent } from '@app/core/component/base.component';
import { SaveEmployeeService } from '@app/shared/components/save-employee/save-employee.service';
import { Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { DepartmentService } from '@app/department/department.service';


@Component({
  selector: 'save-employee',
  templateUrl: './save-employee.component.html',
  styleUrls: ['./save-employee.component.scss']
})
export class SaveEmployeeComponent extends BaseComponent implements OnInit, OnChanges {

  private imgB64Data : string;        // Base64 image to be displayed as a placeholder
  public isValidImgUpload = true;   // Default value is true.
  public imgUploaded:string;
  public isEditMode: Boolean;
  public userRoleList:any;
  public departmentList:any;
  public designationList:any;
  public addEmployeeForm: FormGroup;  
  public isEmployeeFormAttemptSubmit = false;

  @Input() employeeData: any;
  @Output() employeSaveCompleted = new EventEmitter();

  constructor(private empService:SaveEmployeeService,
              private departmentService : DepartmentService,
              private route: ActivatedRoute) {
    super(empService);
  }

  ngOnInit() {
    this.imgB64Data = "data:image/png;base64,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";  
    this.imgUploaded = this.imgB64Data;
  }

  ngOnChanges(){
    if(this.employeeData){         
      this.isEditMode = true;   
    } else {
      this.isEditMode = false;
    }
    this.initialize();
  }

  // Convenience getter for easy access to attendance form fields.
  get employeeForm() { return this.addEmployeeForm.controls; }

  public onEmployeeDataSubmitClicked(){
    this.isEmployeeFormAttemptSubmit = true;   
    if(this.addEmployeeForm.valid && this.isValidImgUpload){      
      let employeeData = this.addEmployeeForm.value;
      let role = employeeData.role;
      employeeData.role = new Object();
      employeeData.role.roleId = role; // Reassigning based on backend api 
      employeeData.photo = (this.imgUploaded != this.imgB64Data) ? this.imgUploaded : "";
      this.empService.submitEmployeeDetails(employeeData).subscribe((resp: any) =>{  
        this.employeSaveCompleted.emit("Completed");
        alert("Employee details has been submitted successfully");
      });
    }
  }  
  
  public resetPassword(){
    if(confirm("Are you sure you want reset the password?")) {
      if(this.employeeData){
        let employeeId = { "employeeId": this.employeeData.employeeId };      
        this.empService.resetPassword(employeeId).subscribe((resp: any) =>{
          if(resp.status == "success") {
            alert("Password has been reset successfully and the new password has been sent to the email address.");
          }
        });
      }
    }
  } 

  public onSelectFile(event:any) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url
      reader.onload = (e:any) => { // called once readAsDataURL is completed   
        //Initiate the JavaScript Image object.
        var image = new Image();
        //Set the Base64 string return from FileReader as source.
        image.src = e.target.result;        
        image.onload = (args:any) => {          
          var height = args.srcElement.height;
          var width = args.srcElement.width;
          if (height == 150 && width == 150) { // Validate the File Height and Width.
            this.isValidImgUpload = true;
            this.imgUploaded = e.target.result;
            return true;
          } else {
            this.isValidImgUpload = false;
            this.imgUploaded = this.imgB64Data;
            alert("Please upload an image of resolution 150 X 150.");
            return false;
          }
        };
      }
    }
  }

  public removeImageUplaoded(){
    this.isValidImgUpload = true; // Set to default value to continue employee data submit, as img is optional.
    this.imgUploaded = this.imgB64Data; // Reset back to previous placeholder
  }

  public resetEmployeeSaveForm(){
    this.isEmployeeFormAttemptSubmit = false;
    this.addEmployeeForm.reset();
  }

  public passwordMatcher(control: FormControl): { [s: string]: boolean } {
      if (this.addEmployeeForm && (control.value !== this.addEmployeeForm.controls.password.value)) {
          return { passwordNotMatch: true };
      }
      return null;
  }

  private initialize(){    
    this.getUserRole();
    this.getDepartmentList();
    this.getDesignationList();    

    this.addEmployeeForm = new FormGroup({
      employeeId : new FormControl(),      
      firstName : new FormControl('', Validators.required),
      lastName : new FormControl('', Validators.required),    
      userName : new FormControl('', Validators.required),
      // password : new FormControl('', Validators.required), 
      // confirmPassword : new FormControl('', [Validators.required, this.passwordMatcher.bind(this)]), 
      emailId : new FormControl('', Validators.required),
      secondaryEmailId : new FormControl('', [Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]),
      primaryMobileNo : new FormControl('', [Validators.required, Validators.max(9999999999)]),
      secondaryMobileNo : new FormControl('', [Validators.max(9999999999)]),               
      position : new FormControl('', Validators.required),
      departmentId: new FormControl('', Validators.required),
      role: new FormControl('', Validators.required),
      gender: new FormControl('', Validators.required),      
    });

    if(this.employeeData){
      this.addEmployeeForm.patchValue(this.employeeData);
      this.employeeForm.role.patchValue(this.employeeData.role.roleId);
      this.employeeForm.departmentId.patchValue(this.employeeData.department.departmentId);
      this.employeeForm.password.disable();
      this.employeeForm.confirmPassword.disable();
    } 
  }

  protected getUserRole(){
    this.empService.getUserRole().subscribe((userRole: any) => { 
        this.userRoleList = userRole;
    });
  } 
  
  protected getDepartmentList(){  
    let params = {
      status : 1
    }
    this.departmentService.getDepartmentList(params)
      .subscribe((departmentListData: any) => { 
        this.departmentList = departmentListData.departmentList;
    });
  }

  protected getDesignationList(){
    this.empService.getDesignationList()
      .subscribe((designationListData: any) => {         
        this.designationList = designationListData; 
    });
  }

  private getSearchFilter(){
    return {
      "departmentId" : -1,
      "designationId" : -1
    }
  }
}
