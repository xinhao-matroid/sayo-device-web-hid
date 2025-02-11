/// <reference path="./index.d.ts" />

import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { KeyType } from 'src/app/core/hid';

@Component({
  selector: 'Virtual-Key',
  templateUrl: './virtual-key.component.html',
  styleUrls: ['./virtual-key.component.scss'],
})
export class VirtualKeyComponent implements OnInit {
  @Input() width = 45;
  @Input() height = 45;
  @Input() raduis = 8;

  @Input() active = false;
  @Input() color = "";

  @Input() type!: KeyType;

  nameArr: string[] = [];

  @Input()
  set name(name: string) {
    this.nameArr = name.split("\r\n");
  }

  private _tooltip = '';
  @Input()
  get tooltip() {
    return this._tooltip;
  }
  set tooltip(text: string) {
    this._tooltip = text;
  }

  @Output('clicked') _clicked = new EventEmitter<void>();

  constructor() { }

  ngOnInit(): void { }

  clicked() {
    this._clicked.emit();
  }

  get style() {
    const getRadius = () => {
      let result = '';
      switch (this.type) {
        case KeyType.Button:
          result = `${this.raduis}px`;
          break;
        case KeyType.Anticlockwise:
          result = `0 ${this.width}px ${this.width}px 0`;
          break;
        case KeyType.Clockwise:
          result = `${this.width}px 0 0 ${this.width}px`;
          break;
        default:
          break;
      }
      return result;
    };

    return {
      width: `${this.width}px`,
      height: `${this.height}px`,
      'border-radius': getRadius(),
    };
  }
}
