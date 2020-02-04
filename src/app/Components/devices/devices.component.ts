import { Component, OnInit } from '@angular/core';
import * as device_data from './devices.json';

@Component({
  selector: 'app-devices',
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.css']
})
export class DevicesComponent implements OnInit {

  deviceData:any = (device_data as any).default;

  constructor() { }

  ngOnInit() {
    console.log(this.deviceData);
  }
}
