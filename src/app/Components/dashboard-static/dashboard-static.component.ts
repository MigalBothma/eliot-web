import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { TimeseriesService } from '../../Services/timeseries.service';
import { Observable, Subject } from 'rxjs';
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

  public DS18BtempChartValues = new Subject();
  public DHT11tempChartValues = new Subject();
  public humidityChartValues = new Subject();
  public timestampValues = new Subject();

  public latestTimestamp = new Subject();
  public latestDS18Temperature = new Subject();
  public latestDHT11Temperature = new Subject();
  public latestDHT11Humidty = new Subject();

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

          this.latestTimestamp = this.chartData[0]["Study"]["timestamp"][this.chartData[0]["Study"]["timestamp"].length - 1];
          this.latestDS18Temperature = this.chartData[0]["Study"]["DS18B20-Temp"][this.chartData[0]["Study"]["DS18B20-Temp"].length - 1];
          this.latestDHT11Temperature = this.chartData[0]["Study"]["DHT-11-Temp"][this.chartData[0]["Study"]["DHT-11-Temp"].length - 1];
          this.latestDHT11Humidty = this.chartData[0]["Study"]["DHT-11-Humidity"][this.chartData[0]["Study"]["DHT-11-Humidity"].length - 1];
        }
      });
  }

  ngAfterViewInit() {
  }

}
