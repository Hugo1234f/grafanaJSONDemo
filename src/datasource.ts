import { DataSourceInstanceSettings, CoreApp, DataQueryRequest, MutableDataFrame, FieldType, DataQueryResponse, DataSourceApi } from '@grafana/data';
import defaults from 'lodash/defaults';
import { MyQuery, MyDataSourceOptions, DEFAULT_QUERY } from './types';
import API from './api'

export class DataSource extends DataSourceApi<MyQuery, MyDataSourceOptions> {
  api: API;
  
  constructor(instanceSettings: DataSourceInstanceSettings<MyDataSourceOptions>) {
    super(instanceSettings);

    this.api = new API('../data/data.json');
  }


  async query(options: DataQueryRequest<MyQuery>): Promise<DataQueryResponse> {
    const { range } = options;
    const from = range!.from.valueOf();
    const to = range!.to.valueOf();
    const JSONData = this.api.loadFile();

    const duration = to - from;
    const step = duration / 1000;

    const data = options.targets.map(target => {
      const query = defaults(target, DEFAULT_QUERY);

      const frame = new MutableDataFrame({
        refId: query.refId,
        fields: [
          //{name: 'tagname', type: FieldType.string},
          //{name: 'dataType', type: FieldType.number},
          //{name: 'timeStartRequested', type: FieldType.string},
          //{name: 'timeEndRequested', type: FieldType.string},
          //{name: 'timeStartActual', type: FieldType.string},
          //{name: 'timeEndActual', type: FieldType.string},
          //{name: 'valueCount', type: FieldType.number},

          {name: 'timeStamp', type: FieldType.string},
          {name: 'status', type: FieldType.number},
          {name: 'value', type: FieldType.number}
        ],
        
      });
      

      for(let t = 0; t < JSONData.valueCount; t += 1) {
        const time = JSONData.values[t].timeStamp;
        const status = JSONData.values[t].status;
        const value = JSONData.values[t].value;
        frame.add({time, status, value});
      }

      return frame;
    });


    return { data };
  }


  getDefaultQuery(_: CoreApp): Partial<MyQuery> {
    return DEFAULT_QUERY;
  }


  //dum funktion för att få testDatasource() att fungera
  yes() {
    return 200;
  }

  //Ärvd av DataSourceAPI
  async testDatasource() {
    const defaultErrorMessage = 'Cannot connect to API';

    try {
      const response = await this.yes();

      if (response === 200) {
        return {
          status: 'success',
          message: 'Success',
        };
      } else {
        return {
          status: 'error',
          message: 'yes',
        };
      }
    } catch (err: any) {
      return {
        status: 'error',
        message: defaultErrorMessage,
      };
    }
  }


}


