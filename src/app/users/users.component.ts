import { DatePipe } from '@angular/common';
import { Component, OnInit  } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UsersService } from './users-list.service';
import { BaseComponent } from '@app/core/component/base.component';

@Component({
  selector: 'app-home',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UserListComponent extends BaseComponent  implements OnInit {

  public employeeList: any;
  public searchForm:FormGroup;
  public empSearchForm:FormGroup;
  public selectedEmployee:any;
 
  constructor(protected employeeService: UsersService,              
              private datePipe: DatePipe) { 
                super(employeeService);
  }

  ngOnInit() { 
    this.getEmployeeList();
    this.empSearchForm = new FormGroup({
      searchKeyWord : new FormControl(), 
    });    
  }

  public openEmployeeEntryView(employee:any){
    this.selectedEmployee = employee; // employee == null means create employee mode.
    document.getElementById('employeeModal').classList.toggle('d-block');
  }

  public closeEmployeeEntryView(){
    this.selectedEmployee = null; // To not selected.
    document.getElementById('employeeModal').classList.toggle('d-block');
  }

  public onSearchButtonClicked() {
   
  }

  public onUserEditClicked(event:any, empData:any){     
    this.openEmployeeEntryView(empData);
  }

  public onUserDeleteClicked(event:any, empData:any) {
    if(confirm("Are your certain that you need to delete this employee.") === true){
      let employeeData = { "employeeId" : empData.employeeId };
      this.employeeService.deleteEmployee(employeeData).subscribe((resp:any)=>{
        if(resp.status == "success"){
          this.getEmployeeList();
          alert("Employee has been deleted successfully.");
        }
      });
    }
  }

  public onAddEmployeeClicked(){
    this.selectedEmployee = null;
    this.openEmployeeEntryView(null);
  }

  public onEmployeeSearched(){
    this.getEmployeeList();
  }

  public onEmployeeSaved(){
    this.getEmployeeList();
    this.closeEmployeeEntryView();
  }

  protected getEmployeeList(){
    var searchFilterData = this.getSearchFilter();
    this.employeeService.getEmployeeList(searchFilterData)
      .subscribe((employeeListData: any) => {         
        setTimeout(()=> {
          this.employeeList =  employeeListData.employeeList;
        }, 100);
      });
  }

  private getSearchFilter(){
    return {
      "departmentId" : -1,
      "designationId" : -1,
      "searchKeyWord" : this.empSearchForm && this.empSearchForm.controls.searchKeyWord.value ? this.empSearchForm.controls.searchKeyWord.value : ""
    }
  }
} 
