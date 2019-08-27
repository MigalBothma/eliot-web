import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { TimeseriesService } from '../../Services/timeseries.service';
import { Observable, Subscribable, Subject } from 'rxjs';
import 'chartjs-plugin-colorschemes';
import * as moment from 'moment';
import { ChartComponent } from 'ng-apexcharts';

@Component({
  selector: 'app-dashboard-static',
  templateUrl: './dashboard-static.component.html',
  styleUrls: ['./dashboard-static.component.css']
})

export class DashboardStaticComponent implements OnInit {
  //@ViewChild('tempChart') tempChart : ChartComponent;
  public selectedLocation = new Subject();

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

  constructor(private tsService: TimeseriesService) { }

  ngOnInit() {
    this.tsService.getDataByCompany('Migal')
      .subscribe(eventsLocationData => {
        if (eventsLocationData) {
          this.timeseriesData = eventsLocationData;
          this.locations.next(Object.keys(eventsLocationData));

          Object.keys(eventsLocationData).forEach(location => {
            let areaData = this.timeseriesData[location]["0"];
            Object.keys(areaData).forEach(area => {
              this.chartData.push(areaData);
            });
          });

          //convert UTC to local time
          this.chartData[0]["Study"]["timestamp"].forEach((timestamp, index) => {
            this.chartData[0]["Study"]["timestamp"][index] = moment(timestamp).local().format();
          });

          this.DS18BtempChartValues = this.chartData[0]["Study"]["DS18B20-Temp"];
          this.DHT11tempChartValues = this.chartData[0]["Study"]["DHT-11-Temp"];
          this.humidityChartValues = this.chartData[0]["Study"]["DHT-11-Humidity"];
          this.timestampValues = this.chartData[0]["Study"]["timestamp"];

          //get Latest values
          this.getLatestValues(this.chartData[0]);

          //get Average, Min, Max
          this.getMinMaxAverage(this.chartData[0]);      
        }
      });
  }

  public getLatestValues( chartData ){
    this.latestTimestamp = chartData["Study"]["timestamp"][chartData["Study"]["timestamp"].length - 1];
    this.latestDS18Temperature = chartData["Study"]["DS18B20-Temp"][chartData["Study"]["DS18B20-Temp"].length - 1];
    this.latestDHT11Temperature = chartData["Study"]["DHT-11-Temp"][chartData["Study"]["DHT-11-Temp"].length - 1];
    this.latestDHT11Humidity = chartData["Study"]["DHT-11-Humidity"][chartData["Study"]["DHT-11-Humidity"].length - 1];
  }

  public getMinMaxAverage( chartData ){
    this.DS18BminavgmaxTempChartValue["min"] = this.getMin(this.chartData[0]["Study"]["DS18B20-Temp"]);
    this.DS18BminavgmaxTempChartValue["avg"] = this.getAverage(this.chartData[0]["Study"]["DS18B20-Temp"]);
    this.DS18BminavgmaxTempChartValue["max"] = this.getMax(this.chartData[0]["Study"]["DS18B20-Temp"]);

    this.DHT11minavgmaxTempChartValue["min"] = this.getMin(this.chartData[0]["Study"]["DHT-11-Temp"]);
    this.DHT11minavgmaxTempChartValue["avg"] = this.getAverage(this.chartData[0]["Study"]["DHT-11-Temp"]);
    this.DHT11minavgmaxTempChartValue["max"] = this.getMax(this.chartData[0]["Study"]["DHT-11-Temp"]);

    this.DHT11minavgmaxHumidityChartValue["min"] = this.getMin(this.chartData[0]["Study"]["DHT-11-Humidity"]);
    this.DHT11minavgmaxHumidityChartValue["avg"] = this.getAverage(this.chartData[0]["Study"]["DHT-11-Humidity"]);
    this.DHT11minavgmaxHumidityChartValue["max"] = this.getMax(this.chartData[0]["Study"]["DHT-11-Humidity"]);
  }

  public getAverage(arr){
    let total = 0;
    let avg = 0.0;

    arr.forEach(value => {
      total += value;
    });

    avg = total / arr.length;

    return avg.toFixed(2);;
  }

  public getMax( arr : any ){
    let max = Math.max(...arr);
    return max;
  }

  public getMin( arr : any ){
    let min = Math.min(...arr);
    return min;
  }

  public setSelectedLocation(location){
    debugger;
    this.selectedLocation = location;

    if(this.selectedLocation){
      this.areadata = this.timeseriesData[location][0];
      this.areasForSelected = Object.keys(this.timeseriesData[location][0]);
    }
  }

  ngAfterViewInit() {
  }

}
