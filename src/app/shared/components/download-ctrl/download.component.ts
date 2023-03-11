import { Component, OnInit, } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseComponent } from '@app/core/component/base.component';
import { DownloadService } from '@app/shared/components/download-ctrl/download.service';
import { DomSanitizer } from '@angular/platform-browser';
// import { debug } from 'util';

@Component({
  selector: 'download-ctrl',
  templateUrl: './download.component.html',
  styleUrls: ['./download.component.scss']
})
export class DownloadComponent extends BaseComponent implements OnInit {  
   
  public href:any;
  public fileName:string;

  constructor(private downloadService:DownloadService,
              private domsanitizer:DomSanitizer) {
    super(downloadService);
    this.href = "#";
    this.fileName = "";
  }

  ngOnInit() {
  }

  public downloadExcel(page:string, params:any){
    let url = "";
    if (page == "CallManagement"){
      url = "call/getCallDetailsReport"
    } else if (page == "ServiceReport"){
      url = "call/getServiceReportExcel";
    } else if (page == "WorkDetails"){
      url = "call/getWorkDetailsExcelReport";
    } else if (page == "EmpNewWork"){
      url = "call/getAllottedWorkDetailsReportByEmpId";
    }
    if(url != "") {
      this.downloadService.downloadExcel(url, params).subscribe((blob:any)=>{        
        const url= window.URL.createObjectURL(blob);
        // window.open(url);
        this.href = this.domsanitizer.bypassSecurityTrustUrl(url);
        this.fileName = page + ".xlsx";
        setTimeout(() => {
          document.getElementById("download-link").click();
          window.location.reload();
        }, 100);
      });
    }
  }

  public downloadPdf(page: string, params:any) {
    let url = "";
    if (page == "Minutes Of Meeting"){
      url = "call/getMinitesOfMettingPDFReport"
    }

    if(url != "") {
      this.downloadService.downloadPdf(url, params).subscribe((blob:any)=>{        
        const url= window.URL.createObjectURL(blob);
        // window.open(url);
        this.href = this.domsanitizer.bypassSecurityTrustUrl(url);
        this.fileName = page + ".pdf";
        setTimeout(() => {
          document.getElementById("download-link").click();
          window.location.reload();
        }, 100);
      });
    }
  }
}
