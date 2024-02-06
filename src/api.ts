import d from './data.json';
//C:\Users\fribe\Documents\grafanaWSL\grafanaWorks\hugo-jsondemo-datasource\node_modules\webpack\lib\util

export interface JSONObject {
    tagName: string,
    dataType: number,
    timeStartRequest: string,
    timeEndRequest: string,
    timeStartActual: string,
    timeEndActual: string,
    valueCount: number,
    values: 
        [{
            timeStamp: string,
            status: number,
            value: number
        }]
    
}

export default class API {
    filePath: string;
    
    constructor(filePath: string) {
        this.filePath = filePath;
    }
    

    loadFile() {
        return d;
    }

    
}