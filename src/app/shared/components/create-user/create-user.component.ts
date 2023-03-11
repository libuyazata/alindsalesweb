import { Component, Input, OnInit, EventEmitter, Output, OnChanges } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IMyDpOptions } from 'mydatepicker';
import { BaseComponent } from '@app/core/component/base.component';
import { CreateUserService } from '@app/shared/components/create-user/create-user.service';
import { Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent extends BaseComponent implements OnInit, OnChanges {

  public countryList:any;
  public userRoleList:any;
  public userStatusList:any;
  public departmentList:any;
  public designationList:any;
  public employeeTypeList:any;
  public employmentRemarkList:any;
  public addEmployeeForm: FormGroup;
  public isEmployeeFormAttemptSubmit = false;

  public myDatePickerOptions: IMyDpOptions = {
    // other options...
    dateFormat: 'dd mmm yyyy',
    inline: false,
  };

  @Input() employeeData: any;
  @Input() receiveEmployeeId: Subject<number>;
  @Output() employeeSubmitClicked = new EventEmitter();

  constructor(private userService:CreateUserService,
              private route: ActivatedRoute) {
    super(userService);
  }

  ngOnInit() {
    if(!this.employeeData) {
      this.employeeData = [];
    }
    this.initialize(); 
  }

  ngOnChanges(){
    if(this.employeeData){
      this.initialize();
    }
    if(this.receiveEmployeeId){
      this.receiveEmployeeId.subscribe(employeeId => { ;
        this.getEmployeeDetailsById(employeeId);
      });
    }
  }

  ngAfterViewInit(){
    this.route.queryParams.subscribe((params:any) => {
      let employeeId = params['uid'];
      if(!employeeId) {
        employeeId = 0;
      }
      this.getEmployeeDetailsById(employeeId);  
    })
  }

  public onEmployeeDataSubmitClicked(){
    this.isEmployeeFormAttemptSubmit = true;
    if(this.addEmployeeForm.valid){
      this.toggleField(this.addEmployeeForm, "employeeCode", true);    
      let employeeData = this.addEmployeeForm.value;

      employeeData.doj = this.getDateFromMyDP(employeeData.doj);
      employeeData.dob = this.getDateFromMyDP(employeeData.dob);

      employeeData.visaValidity = this.getDateFromMyDP(employeeData.visaValidity);
      employeeData.passportValidity = this.getDateFromMyDP(employeeData.passportValidity);
      employeeData.healthCardValidity = this.getDateFromMyDP(employeeData.healthCardValidity);
      employeeData.insuranceValidity = this.getDateFromMyDP(employeeData.insuranceValidity);
      employeeData.qatarIdValidity = this.getDateFromMyDP(employeeData.qatarIdValidity);

      // employeeData.doj = (employeeData.doj && employeeData.doj.jsdate) ? employeeData.doj.jsdate : "";
      // employeeData.dob = (employeeData.dob && employeeData.dob.jsdate) ? employeeData.dob.jsdate : "";
      
      // employeeData.visaValidity = (employeeData.visaValidity && employeeData.visaValidity.jsdate) ? employeeData.visaValidity.jsdate : "";
      // employeeData.passportValidity = (employeeData.passportValidity && employeeData.passportValidity.jsdate) ? employeeData.passportValidity.jsdate : "";
      // employeeData.healthCardValidity = (employeeData.healthCardValidity && employeeData.healthCardValidity.jsdate) ? employeeData.healthCardValidity.jsdate : "";
      // employeeData.insuranceValidity = (employeeData.insuranceValidity && employeeData.insuranceValidity.jsdate) ? employeeData.insuranceValidity.jsdate : "";
      // employeeData.qatarIdValidity = (employeeData.qatarIdValidity && employeeData.qatarIdValidity.jsdate) ? employeeData.qatarIdValidity.jsdate : "";

      employeeData.userId = (employeeData.userId) ? employeeData.userId : 0;
      //employeeData.isActive = employeeData.isActive ? 1 : 0;
      console.log(this.addEmployeeForm.value);
      this.userService.submitEmployeeDetails(employeeData).subscribe((resp: any) =>{       
        alert("Employee details has been submitted successfully");
      });
    }
  }  
  
  protected getEmployeeDetailsById(employeeId:number){
    let empParams = { "userId" : employeeId, "year" : 0 };
    this.userService.getEmployeeDetailsById(empParams).subscribe((emp: any) => { 
      if(emp.status == "success" && emp.user) {
        this.addEmployeeForm.patchValue(emp.user);
        this.setDates(emp.user);
      } else if(emp.status != "success"){
        this.showAlert("An error occured while processing your request.");
      }
    });
  }

  protected toggleField(form: FormGroup, fieldName:string, enable:boolean){
    let control = form.get(fieldName);      
    if(enable) {
      control.enable(); 
    } else {
      control.disable(); 
    }
  }

  protected setDates(employeeInfo:any): void {
    let date = new Date();

    if(employeeInfo.dob) {
      date = new Date(employeeInfo.dob);
      this.addEmployeeForm.patchValue({"dob": {
      date: {
          year: date.getFullYear(),
          month: date.getMonth() + 1,
          day: date.getDate()}
      }});
    }

    if(employeeInfo.doj) {
      date = new Date(employeeInfo.doj);
      this.addEmployeeForm.patchValue({"doj": {
      date: {
          year: date.getFullYear(),
          month: date.getMonth() + 1,
          day: date.getDate()}
      }});
    }

    if(employeeInfo.visaValidity) {
      date = new Date(employeeInfo.visaValidity);
      this.addEmployeeForm.patchValue({"visaValidity": {
      date: {
          year: date.getFullYear(),
          month: date.getMonth() + 1,
          day: date.getDate()}
      }});
    }

    if(employeeInfo.passportValidity) {
      date = new Date(employeeInfo.passportValidity);
      this.addEmployeeForm.patchValue({ "passportValidity": {
      date: {
          year: date.getFullYear(),
          month: date.getMonth() + 1,
          day: date.getDate()}
      }});
    }

    if(employeeInfo.insuranceValidity) {
      date = new Date(employeeInfo.insuranceValidity);
      this.addEmployeeForm.patchValue({ "insuranceValidity": {
      date: {
          year: date.getFullYear(),
          month: date.getMonth() + 1,
          day: date.getDate()}
      }});
    }

    if(employeeInfo.qatarIdValidity) {
      date = new Date(employeeInfo.qatarIdValidity);
      this.addEmployeeForm.patchValue({ "qatarIdValidity": {
      date: {
          year: date.getFullYear(),
          month: date.getMonth() + 1,
          day: date.getDate()}
      }});
    }

    if(employeeInfo.healthCardValidity) {
      date = new Date(employeeInfo.healthCardValidity);
      this.addEmployeeForm.patchValue({ "healthCardValidity": {
      date: {
          year: date.getFullYear(),
          month: date.getMonth() + 1,
          day: date.getDate()}
      }});
    }
  }

  private initialize(){    
    this.getUserRole();
    this.getCountries();    
    this.getEmployeeStatus();
    this.getDepartmentList();
    this.getDesignationList();    
    this.getEmployeeTypeList();
    this.getEmploymentRemarkList();

    this.addEmployeeForm = new FormGroup({
      userId : new FormControl(),      
      firstName : new FormControl('', Validators.required),
      lastName : new FormControl('', Validators.required),
      thirdName : new FormControl(''),
      fourthName : new FormControl(''),
      email : new FormControl(''),
      dob : new FormControl('', Validators.required),
      phone : new FormControl(''),
      phone2 : new FormControl(''),
      nationality : new FormControl('', Validators.required),
      // countryId : new FormControl('', Validators.required),
      nativeAddress : new FormControl(''),
      accommodationLocation : new FormControl(''),

      emergencyContactName : new FormControl(''),
      emergencyContactPhone : new FormControl('', Validators.required),
      relationship : new FormControl(''),
      homeCountryPhone: new FormControl(''),

      employmentRemark : new FormControl('', Validators.required),
      employeeCode : new FormControl('', Validators.required),
      employeeType: new FormControl('', Validators.required),
      designationId : new FormControl('', Validators.required),
      departmentId: new FormControl('', Validators.required),
      doj : new FormControl(null, Validators.required),
      userRole: new FormControl('', Validators.required),
      userStatus: new FormControl('', Validators.required),
      //lastWorkingDay: new FormControl('', Validators.required),

      visaProfession: new FormControl('', Validators.required), 
      passportNo: new FormControl('', Validators.required),
      passportValidity: new FormControl('', Validators.required),
      visa: new FormControl('', Validators.required),
      workingCountryIdNo: new FormControl('', Validators.required),
      visaValidity: new FormControl('', Validators.required),
      healthCardValidity: new FormControl('', Validators.required),
      healthCardNo: new FormControl('', Validators.required),
      insurancePolicyNo: new FormControl('', Validators.required),
      insuranceValidity: new FormControl('', Validators.required),

      qatarId : new FormControl('', Validators.required),
      qatarIdValidity: new FormControl('', Validators.required),
    });
  }

  protected getCountries(){
    super.getCountryList().subscribe((countryListData: any) => { 
        this.countryList = countryListData 
    });
  }

  protected getUserRole(){
    this.userService.getUserRole().subscribe((userRole: any) => { 
        this.userRoleList = userRole;
    });
  } 
  
  protected getEmployeeStatus(){
    this.userService.getEmployeeStatus().subscribe((userStatus: any) => { 
        this.userStatusList = userStatus;
    });
  }
  
  protected getEmployeeTypeList(){
    this.userService.getEmployeeType().subscribe((empTypes: any) => { 
        this.employeeTypeList = empTypes;
    });
  }

  protected getEmploymentRemarkList(){
    this.userService.getEmploymentRemarkList().subscribe((employmentRemarkList: any) => { 
        this.employmentRemarkList = employmentRemarkList;
    });
  }
  protected getDepartmentList(){
    // this.userService.getDepartmentList({})
    //   .subscribe((departmentListData: any) => { 
    //     this.departmentList = departmentListData.departmentList; 
    // });
  }

  protected getDesignationList(){
    this.userService.getDesignationList()
      .subscribe((designationListData: any) => { 
        this.designationList = designationListData.designation; 
    });
  }

  private getSearchFilter(){
    return {
      "departmentId" : -1,
      "designationId" : -1
    }
  }

  // Convenience getter for easy access to attendance form fields.
  get employeeForm() { return this.addEmployeeForm.controls; }

}
