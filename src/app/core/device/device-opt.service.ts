import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Cmd, O2Protocol } from '../hid';
import { DeviceService } from './device.service';
import { LoaderService } from 'src/app/shared/components/loading/loader.service';

@Injectable({
  providedIn: 'root',
})
export class DeviceOptService implements O2Service<DeviceOption> {
  data$ = new BehaviorSubject<DeviceOption>({ id: 0, values: [] });

  constructor(
    private _device: DeviceService,
    private _o2p: O2Protocol,
    private _loader: LoaderService
  ) { }

  init(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this._device.isConnected()) {
        reject("device not connect.");
      } else {
        console.info("初始化设备选项数据");

        this._loader.loading();
        this._o2p.get_option_byte(this._device.instance!, (option) => {
          this.data$.next(option[0]);

          resolve("init option byte successful.");
          this._loader.complete();
        });
      }
    })
  }

  setItem(option: DeviceOption) {
    if (!this._device.isConnected()) return;

    this._o2p.set_option_byte(this._device.instance!, option, (ok) => {
      if (ok) {
        this.data$.next(option);
        this._device.setChanged(ok);
      }
    });
  }

  isSupport() {
    return this._device.isSupport(Cmd.Option);
  }
}
