import { Injectable } from '@angular/core';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { O2Protocol } from '../hid';

@Injectable({
  providedIn: 'root',
})
export class DeviceService {
  _info?: DeviceInfo;
  instance?: HIDDevice;

  device$ = new ReplaySubject<HIDDevice>(1);

  changed$ = new BehaviorSubject<Boolean>(false);

  constructor(private _o2p: O2Protocol) {}

  isSupport(code: number) {
    if (!this.instance || !this._info) return false;
    return this._info.api.includes(code);
  }

  info() {
    return this._info!;
  }

  setDevice(device: HIDDevice) {
    if (device) {
      if (device !== this.instance) {
        this.instance = device;
        console.info('连接设备: ', this.instance);
      } else {
        console.error('请选择其他设备');
      }
    } else {
      console.error('请连接设备');
    }
  }

  save() {
    if (!this.instance) {
      console.warn('请连接设备');
      return;
    }

    this._o2p.save(this.instance!, (ok: boolean) => {
      if (ok) this.setChanged(false);
    });
  }

  updateInfo() {
    if (!this.instance) return;

    this._o2p.get_metaInfo(this.instance, (info: DeviceInfo) => {
      this._info = info;

      this._info.pid = this.instance?.productId!;

      console.log("设备信息: ", info);

      this.device$.next(this.instance!);
    });
  }

  isConnected() {
    return this.instance !== undefined;
  }

  isChanged() {
    return this.changed$.getValue();
  }

  setChanged(isChanged: boolean) {
    this.changed$.next(isChanged);
  }

  filename() {
    if (this.instance) {
      return this.instance!.productId === 3 ? 'main_vid_3.json' : 'main.json';
    } else {
      console.error('device not connect.');

      return '';
    }
  }
}
