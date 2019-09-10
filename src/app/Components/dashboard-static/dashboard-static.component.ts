import { Component, OnInit } from '@angular/core';
import { TimeseriesService } from '../../Services/timeseries.service';
import { Subject, timer } from 'rxjs';
import 'chartjs-plugin-colorschemes';
import * as moment from 'moment';
import { ContextService } from 'src/app/Services/context.service';

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

  //some
  public Temperature : any;
  public Humidity : any;

  //ContextData
  public contextData;
  public poller;

  //Areadata for selected Location
  public areaData;
  public areasForSelected;

  //TIMESTAMP
  public timestampValues = new Subject();

  //TEMPERATURE
  public DS18B_temp_ChartValues : any = new Subject();
  public DHT11_temp_ChartValues : any = new Subject();

  public DS18B_minavgmax_temp_ChartValues : any = new Subject();
  public DHT11_minavgmax_temp_ChartValues : any = new Subject();

  //HUMIDITY
  public DHT11_humidity_ChartValues : any = new Subject();
  public DHT11_minavgmax_humidity_ChartValues : any = new Subject();

  //AC POWER
  public AC_Fan1_amps_ChartValues : any = new Subject();
  public AC_Fan1_watts_ChartValues : any = new Subject();
  public AC_Compressor1_amps_ChartValues : any = new Subject();
  public AC_Compressor1_watts_ChartValues : any = new Subject();

  public AC_Fan1_minavgmax_amps_ChartValue : any = new Subject();
  public AC_Fan1_minavgmax_watts_ChartValue : any = new Subject();
  public AC_Compressor1_minavgmax_amps_ChartValue : any = new Subject();
  public AC_Compressor1_minavgmax_watts_ChartValue : any = new Subject();

  //LATEST VALUES
  public latestTimestamp : any = new Subject();
  public latestDS18Temperature : any = new Subject();
  public latestDHT11Temperature : any = new Subject();
  public latestDHT11Humidity : any = new Subject();

  public latestACFan1Amps = "";
  public latestACFan1Watts = "";
  public latestACCompressor1Amps = "";
  public latestACCompressor1Watts = "";

  public timeseriesData;

  public chartTemperature : any = new Subject();
  public chartLabels : any = new Subject();

  public latestVals : any = new Subject();
  public locations : any = new Subject();
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

  customizeAmpText(arg) {
    return arg.valueText + ' A';
  }

  customizeWattText(arg) {
    return arg.valueText + ' W';
  }

  customizeHumidityText(arg) {
    return arg.valueText + ' %';
  }

  getKeys(obj) {
    return Object.keys(obj);
  }

  formatLegend(obj) {
    obj[0].text = "min - " + obj[0].text;
    obj[1].text = "avg - " + obj[1].text;
    obj[2].text = "max - " + obj[2].text;
    return obj;
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
    if (this.poller != undefined && !this.poller.closed) {
      this.poller.unsubscribe()
      this.areaChanged();
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

            this.DS18B_temp_ChartValues = this.timeseriesData["DS18B20-Temp"];
            this.DHT11_temp_ChartValues = this.timeseriesData["DHT-11-Temp"];
            this.DHT11_humidity_ChartValues = this.timeseriesData["DHT-11-Humidity"];
            this.timestampValues = this.timeseriesData["timestamp"];

            if(this.timeseriesData["AC-Fan1-Amps"]){
              this.AC_Fan1_amps_ChartValues = this.timeseriesData["AC-Fan1-Amps"];
              this.AC_Fan1_watts_ChartValues = this.timeseriesData["AC-Fan1-Watts"];
            }
            if(this.timeseriesData["AC-Compressor1-Watts"]){
              this.AC_Compressor1_amps_ChartValues = this.timeseriesData["AC-Compressor1-Amps"];
              this.AC_Compressor1_watts_ChartValues = this.timeseriesData["AC-Compressor1-Watts"];
            }

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

  public getLatestValues(chartData) {
    this.latestTimestamp = chartData["timestamp"][chartData["timestamp"].length - 1];

    this.latestDS18Temperature = chartData["DS18B20-Temp"][chartData["DS18B20-Temp"].length - 1];
    this.latestDHT11Temperature = chartData["DHT-11-Temp"][chartData["DHT-11-Temp"].length - 1];

    this.latestDHT11Humidity = chartData["DHT-11-Humidity"][chartData["DHT-11-Humidity"].length - 1];

    if(chartData["AC-Fan1-Amps"]){
      this.latestACFan1Amps = chartData["AC-Fan1-Amps"][chartData["AC-Fan1-Amps"].length - 1];
      this.latestACFan1Watts = chartData["AC-Fan1-Watts"][chartData["AC-Fan1-Watts"].length - 1];
    }
    
    if(chartData["AC-Compressor1-Amps"]){
      this.latestACCompressor1Amps = chartData["AC-Compressor1-Amps"][chartData["AC-Compressor1-Amps"].length - 1];
      this.latestACCompressor1Watts = chartData["AC-Compressor1-Watts"][chartData["AC-Compressor1-Watts"].length - 1];
    }
  }

  public getMinMaxAverage(chartData) {
    this.DS18B_minavgmax_temp_ChartValues["min"] = this.getMin(chartData["DS18B20-Temp"]);
    this.DS18B_minavgmax_temp_ChartValues["avg"] = this.getAverage(chartData["DS18B20-Temp"]);
    this.DS18B_minavgmax_temp_ChartValues["max"] = this.getMax(chartData["DS18B20-Temp"]);

    this.DHT11_minavgmax_temp_ChartValues["min"] = this.getMin(chartData["DHT-11-Temp"]);
    this.DHT11_minavgmax_temp_ChartValues["avg"] = this.getAverage(chartData["DHT-11-Temp"]);
    this.DHT11_minavgmax_temp_ChartValues["max"] = this.getMax(chartData["DHT-11-Temp"]);

    this.DHT11_minavgmax_humidity_ChartValues["min"] = this.getMin(chartData["DHT-11-Humidity"]);
    this.DHT11_minavgmax_humidity_ChartValues["avg"] = this.getAverage(chartData["DHT-11-Humidity"]);
    this.DHT11_minavgmax_humidity_ChartValues["max"] = this.getMax(chartData["DHT-11-Humidity"]);

    if (chartData["AC-Fan1-Amps"]) {
      this.AC_Fan1_minavgmax_amps_ChartValue["min"] = this.getMin(chartData["AC-Fan1-Amps"]);
      this.AC_Fan1_minavgmax_amps_ChartValue["avg"] = this.getAverage(chartData["AC-Fan1-Amps"]);
      this.AC_Fan1_minavgmax_amps_ChartValue["max"] = this.getMax(chartData["AC-Fan1-Amps"]);
    }

    if (chartData["AC-Fan1-Watts"]) {
      this.AC_Fan1_minavgmax_watts_ChartValue["min"] = this.getMin(chartData["AC-Fan1-Watts"]);
      this.AC_Fan1_minavgmax_watts_ChartValue["avg"] = this.getAverage(chartData["AC-Fan1-Watts"]);
      this.AC_Fan1_minavgmax_watts_ChartValue["max"] = this.getMax(chartData["AC-Fan1-Watts"]);
    }

    if (chartData["AC-Compressor1-Amps"]) {
      this.AC_Compressor1_minavgmax_amps_ChartValue["min"] = this.getMin(chartData["AC-Compressor1-Amps"]);
      this.AC_Compressor1_minavgmax_amps_ChartValue["avg"] = this.getAverage(chartData["AC-Compressor1-Amps"]);
      this.AC_Compressor1_minavgmax_amps_ChartValue["max"] = this.getMax(chartData["AC-Compressor1-Amps"]);
    }

    if (chartData["AC-Compressor1-Watts"]) {
      this.AC_Compressor1_minavgmax_watts_ChartValue["min"] = this.getMin(chartData["AC-Compressor1-Watts"]);
      this.AC_Compressor1_minavgmax_watts_ChartValue["avg"] = this.getAverage(chartData["AC-Compressor1-Watts"]);
      this.AC_Compressor1_minavgmax_watts_ChartValue["max"] = this.getMax(chartData["AC-Compressor1-Watts"]);
    }
  }

  public getAverage(arr) {
    let total = 0;
    let avg = 0.0;

    arr.forEach(value => {
      total += parseInt(value);
    });

    avg = total / arr.length;

    return parseInt(avg.toFixed(2));;
  }

  public areaChanged(){
    this.latestACCompressor1Amps = "";
    this.latestACCompressor1Watts = "";
    this.latestACFan1Amps = "";
    this.latestACFan1Watts = "";
  }

  public getMax(arr: any) {
    let max = Math.max(...arr);
    return max;
  }

  public getMin(arr: any) {
    let min = Math.min(...arr);
    return min;
  }

  ngAfterViewInit() {
  }

}
