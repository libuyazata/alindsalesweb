import * as _ from "lodash";
import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
    name: "observationbeforemaintenancefilter"
})
export class ObservationBeforeMaintenancePipe implements PipeTransform {

    transform(array: string, args?: any): any {
        return this.getStringFromArray(array);
    }

    getStringFromArray(list: string) {

        let arrayList : any[] = [];

        if( ! list) {
            return "";
        }

        arrayList = JSON.parse(list);

        let objStr = "";
        let index = 0;

        arrayList.forEach(element => {
            objStr += index++ > 0 ? ", " : "";
            objStr += element.obervationDetails;
        });

        return objStr.toUpperCase();
    }
}