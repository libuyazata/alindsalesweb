import { Component, OnInit } from '@angular/core';

import { environment } from '@env/environment';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CallRegistrationService } from '@app/public/call-registration/call-registration.service';

import {Observable} from 'rxjs';
import {debounceTime, distinctUntilChanged, map} from 'rxjs/operators';

@Component({
  selector: 'app-call-registration',
  templateUrl: './call-registration.component.html',
  styleUrls: ['./call-registration.component.scss']
})
export class CallRegistrationComponent implements OnInit {
  
  public randomNumber:string;
  public showPanelControl:Boolean;
  public showAmcDetailsControl: Boolean = false;
  public customerNames : Array<any>;
  public boardDivisions : Array<any>;
  public customerList : Array<any>;  
  public relayDetails : Array<any>;
  public panelDetails : Array<any>;
  public natureOfJobDetails: Array<any>;
  public boardDivisionDetails : Array<any>;
  public siteDetailsList : Array<any>;  // Auto complete list
  public panelNamesList : Array<any>;  // Auto complete list
  public relayNamesList : Array<any>; // Auto complete list

  public callRegistrationForm : FormGroup;
  public isCallRegistrationFormAttemptSubmit:Boolean;

  /* Auto Complete */
  public model: any;
  public boardModel : any;
  public siteDetailsModel : any;
  public panelIdModel : any;
  public relayIdModel : any;

  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 2 ? []
        : this.customerNames.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    );
  
  searchBoardDivsion = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 2 ? []
        : this.boardDivisions.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
   );

   siteDetailsTypeAhead = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 2 ? []
        : this.siteDetailsList.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
   );

   panelIdTypeAhead = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 2 ? []
        : this.panelNamesList.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
   );

   relayIdTypeAhead = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 2 ? []
        : this.relayNamesList.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
   );
  /* */

  constructor(protected callRegService:CallRegistrationService) { 
    this.showPanelControl = true;
    this.randomNumber = Math.floor(Math.random() * 10).toString();
    this.isCallRegistrationFormAttemptSubmit = false;
  }

  ngOnInit() {    
    this.callRegistrationForm = new FormGroup({
      cdContactNo : new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(10)]),      
      cdEmail : new FormControl('', [Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]),
      // cdProblemDetails : new FormControl('', Validators.required),
      siteDetails :new FormControl('', Validators.required),
      customerId : new FormControl('', Validators.required),
      boardDivisionId : new FormControl('', Validators.required),
      panelId : new FormControl('', Validators.required),
      relayId : new FormControl('', Validators.required),
      // productDetails : new FormControl('', Validators.required),
      natureJobId : new FormControl('', Validators.required),
      remarks : new FormControl('', Validators.required),
      productSlNo : new FormControl(''),
      amc : new FormControl('0'),
      amcDetails : new FormControl({value: '', disabled: true})
    });

    this.callRegService.getAllBoardDivisionDetails().subscribe((resp:any)=>{
      this.boardDivisionDetails = resp.boardDivisionDetails;
      this.boardDivisions = this.boardDivisionDetails.map(item=> item.zoneDivisionName);
      this.callRegistrationForm.patchValue({"boardDivisionId" : ""});
    });

    this.callRegService.getAllPanelDetails().subscribe((resp:any)=>{
      this.panelDetails = resp.panelDetails;
      this.panelNamesList = this.panelDetails.map(item=> item.panelName);
      this.callRegistrationForm.patchValue({"panelId" : ""});
    });

    this.callRegService.getAllRelayDetails().subscribe((resp:any)=>{
      this.relayDetails = resp.relayDetails;
      this.relayNamesList = this.relayDetails.map(item=> item.relayName);
      this.callRegistrationForm.patchValue({"relayId" : ""});
    });

    this.callRegService.getCustomerDetails().subscribe((resp:any)=>{
      this.customerList = resp.customerDetails;
      this.customerNames = this.customerList.map(item=> item.customerName);
      this.callRegistrationForm.patchValue({"customerId" : ""});
    });

    this.callRegService.getNatureOfJobs().subscribe((resp:any)=>{
      if(resp.status == "success") {
        this.natureOfJobDetails = resp.natureOfJobs;
      }
    });
    this.callRegService.getAllCustomerSiteDetails().subscribe((resp:any)=>{
      if(resp.status == "success") {
        this.siteDetailsList = resp.customerSiteDetails.map((item:any)=> item.siteName);
      }
    });
    // By defaut the relayId is in disabled form.
    this.callRegistrationForm.controls["relayId"].disable();
  }

  // Convenience getter for easy access to callRegistrationForm form fields.
  get callRegForm() { return this.callRegistrationForm.controls; }

  public onCallRegistrationFormSubmitted(){
    this.isCallRegistrationFormAttemptSubmit = true;    

    if(this.callRegistrationForm.controls.amc.value == "1" && this.callRegistrationForm.controls.amcDetails.value == "") {
      this.callRegistrationForm.controls.amcDetails.setErrors({ empty : true })
    }   

    if(this.callRegistrationForm.valid) {       
      this.callRegService.submitCallRegistrationDetails(this.callRegistrationForm.value).subscribe((resp:any)=>{
        if(resp.status == "success"){
          let serviceReqId = resp.callDetail.serviceRequestId;
          alert("Your details has been registered successfully. Your request reference ID is: " + serviceReqId);
          this.isCallRegistrationFormAttemptSubmit = false;
          this.callRegistrationForm.reset();
        }
      })
    }
    console.log(this.callRegistrationForm.value);
  }

  public onTicketTypeSelected(ticketType:string){
    if(ticketType == "Panel"){
      this.showPanelControl = true;
      this.callRegistrationForm.patchValue({"relayId" : ""});
      this.callRegistrationForm.controls["relayId"].disable();
      this.callRegistrationForm.controls["panelId"].enable();
    } else { // Relay
      this.showPanelControl = false;
      this.callRegistrationForm.patchValue({"panelId" : ""});
      this.callRegistrationForm.controls["panelId"].disable();
      this.callRegistrationForm.controls["relayId"].enable();
    }
  }  

  public onAmcSelectionChange(amcValue : string) {
    if(parseInt(amcValue) == 1) {
      this.callRegistrationForm.controls['amcDetails'].enable();
      this.showAmcDetailsControl = true;
    } else {
      this.callRegistrationForm.controls['amcDetails'].disable();
      this.showAmcDetailsControl = false;
    }
  }
}
