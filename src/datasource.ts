import { DataSourceInstanceSettings, CoreApp, DataQueryRequest, MutableDataFrame, FieldType, DataQueryResponse, DataSourceApi } from '@grafana/data';
import defaults from 'lodash/defaults';
import { MyQuery, MyDataSourceOptions, DEFAULT_QUERY } from './types';

export class DataSource extends DataSourceApi<MyQuery, MyDataSourceOptions> {
  constructor(instanceSettings: DataSourceInstanceSettings<MyDataSourceOptions>) {
    super(instanceSettings);
  }


  async query(options: DataQueryRequest<MyQuery>): Promise<DataQueryResponse> {
    const { range } = options;
    const from = range!.from.valueOf();
    const to = range!.to.valueOf();

    const duration = to - from;
    const step = duration / 1000;

    const data = options.targets.map(target => {
      const query = defaults(target, DEFAULT_QUERY);

      const frame = new MutableDataFrame({
        refId: query.refId,
        fields: [
          {name: 'time', type: FieldType.time},
          {name: 'value', type: FieldType.number},
        ],
      });

      for(let t = 0; t < duration; t += step) {
        frame.add({time: from + t, value: Math.sin((2 * Math.PI * t) / duration)});
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


