import * as _ from "lodash";
import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
    name: "natureofjobfilter"
})
export class NatureOfJobPipe implements PipeTransform {

    transform(array: string, args?: any): any {
        return this.getNatureofJobString(array);
    }

    getNatureofJobString(list: string) {

        let arrayList : any[] = [];

        if( ! list) {
            return "";
        }

        arrayList = JSON.parse(list);

        let objStr = "";
        let index = 0;

        arrayList.forEach(element => {
            objStr += index++ > 0 ? ", " : "";
            objStr += element.jobNature;
        });

        return objStr.toUpperCase();
    }
}