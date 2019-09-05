import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { TimeseriesService } from '../../Services/timeseries.service';
import { Observable, Subscribable, Subject, timer, Subscriber } from 'rxjs';
import 'chartjs-plugin-colorschemes';
import * as moment from 'moment';
import { ChartComponent } from 'ng-apexcharts';
import { ContextService } from 'src/app/Services/context.service';
import { debug } from 'util';
import { subscribe } from 'graphql';

@Component({
  selector: 'app-dashboard-static',
  templateUrl: './dashboard-static.component.html',
  styleUrls: ['./dashboard-static.component.css']
})

export class DashboardStaticComponent implements OnInit {
  //@ViewChild('tempChart') tempChart : ChartComponent;
  public selectedLocation = new Subject();
  public selectedArea = new Subject();

  //UI Triggers
  public showSpinner;
  public showContent;

  //ContextData
  public contextData;
  public poller;

  //Areadata for selected Location
  public areadata;
  public areasForSelected;

  public DS18BtempChartValues = new Subject();
  public DHT11tempChartValues = new Subject();
  public humidityChartValues = new Subject();
  public timestampValues = new Subject();

  public DS18BminavgmaxTempChartValue = {};
  public DHT11minavgmaxTempChartValue = {};
  public DHT11minavgmaxHumidityChartValue = {};

  public latestTimestamp = new Subject();
  public latestDS18Temperature = new Subject();
  public latestDHT11Temperature = new Subject();
  public latestDHT11Humidity = new Subject();

  public timeseriesData;

  public chartTemperature = new Subject();
  public chartLabels = new Subject();

  public latestVals = new Subject();
  public locations = new Subject();
  public location;

  public chartData = [];

  constructor(private tsService: TimeseriesService, private ctxService: ContextService) { }

  ngOnInit() {
    this.showSpinner = true;

    this.ctxService.getContextByCompany('Migal')
      .subscribe(_contextData => {
        this.locations.next(Object.keys(_contextData[0]["locations"]));
        this.contextData = _contextData[0];

        if (this.contextData) {
          this.showSpinner = false;
        }
      });
  }

  //DevExpress Radial Bar Chart Formatting
  customizeTempText(arg) {
    return arg.valueText + ' °C';
  }

  customizeHumidityText(arg) {
    return arg.valueText + ' %';
  }

  getKeys(obj) {
    return Object.keys(obj);
  }

  formatLegend(obj) {
    obj[0].text = "min"
    obj[1].text = "avg"
    obj[2].text = "max"
    return obj;
  }

  public getLatestValues(chartData) {
    this.latestTimestamp = chartData["timestamp"][chartData["timestamp"].length - 1];
    this.latestDS18Temperature = chartData["DS18B20-Temp"][chartData["DS18B20-Temp"].length - 1];
    this.latestDHT11Temperature = chartData["DHT-11-Temp"][chartData["DHT-11-Temp"].length - 1];
    this.latestDHT11Humidity = chartData["DHT-11-Humidity"][chartData["DHT-11-Humidity"].length - 1];
  }

  public getMinMaxAverage(chartData) {
    this.DS18BminavgmaxTempChartValue["min"] = this.getMin(chartData["DS18B20-Temp"]);
    this.DS18BminavgmaxTempChartValue["avg"] = this.getAverage(chartData["DS18B20-Temp"]);
    this.DS18BminavgmaxTempChartValue["max"] = this.getMax(chartData["DS18B20-Temp"]);

    this.DHT11minavgmaxTempChartValue["min"] = this.getMin(chartData["DHT-11-Temp"]);
    this.DHT11minavgmaxTempChartValue["avg"] = this.getAverage(chartData["DHT-11-Temp"]);
    this.DHT11minavgmaxTempChartValue["max"] = this.getMax(chartData["DHT-11-Temp"]);

    this.DHT11minavgmaxHumidityChartValue["min"] = this.getMin(chartData["DHT-11-Humidity"]);
    this.DHT11minavgmaxHumidityChartValue["avg"] = this.getAverage(chartData["DHT-11-Humidity"]);
    this.DHT11minavgmaxHumidityChartValue["max"] = this.getMax(chartData["DHT-11-Humidity"]);
  }

  public getAverage(arr) {
    let total = 0;
    let avg = 0.0;

    arr.forEach(value => {
      total += value;
    });

    avg = total / arr.length;

    return avg.toFixed(2);;
  }

  public getMax(arr: any) {
    let max = Math.max(...arr);
    return max;
  }

  public getMin(arr: any) {
    let min = Math.min(...arr);
    return min;
  }

  public setSelectedLocation(location) {
    this.selectedLocation = location;

    if (this.selectedLocation) {
      //this.areadata = this.contextData[location][0];
      this.areasForSelected = Object.keys(this.contextData["locations"][location]);
    }
  }

  public setSelectedArea(area) {
    this.selectedArea = area;
    this.showSpinner = true;
    this.showContent = false;

    if (this.selectedLocation && this.selectedArea) {
      this.getDashboardData(this.selectedLocation, this.selectedArea);
    }
  }

  private getDashboardData(location, area) {
    //Check if poller is defined && if poller is 'Subscriber' and !closed, we close it and open new one;
    if( this.poller != undefined && !this.poller.closed){
      this.poller.unsubscribe()
    }

    this.poller = timer(0, 60000).subscribe(() => {
      this.tsService.getDataByCompanyLocationArea('Migal', location, area)
        .subscribe(areaData => {
          if (areaData) {
            this.timeseriesData = areaData[area];

            //convert UTC to local time
            this.timeseriesData["timestamp"].forEach((event, index) => {
              this.timeseriesData["timestamp"][index] = moment(this.timeseriesData["timestamp"][index]).local().format();
            });

            this.DS18BtempChartValues = this.timeseriesData["DS18B20-Temp"];
            this.DHT11tempChartValues = this.timeseriesData["DHT-11-Temp"];
            this.humidityChartValues = this.timeseriesData["DHT-11-Humidity"];
            this.timestampValues = this.timeseriesData["timestamp"];

            //get Latest values
            this.getLatestValues(this.timeseriesData);

            //get Average, Min, Max
            this.getMinMaxAverage(this.timeseriesData);

            this.showSpinner = false;
            this.showContent = true;
          }
        });
    })
    console.log(this.poller);
  }

  ngAfterViewInit() {
  }

}
