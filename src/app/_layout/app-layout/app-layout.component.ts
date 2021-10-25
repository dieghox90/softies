import { Component, OnInit } from '@angular/core';
//import * as adminlte from '@assets/js/adminlte.js';

declare var $: any;

@Component({
  selector: 'app-app-layout',
  templateUrl: './app-layout.component.html',
  styleUrls: ['./app-layout.component.css']
})
export class AppLayoutComponent implements OnInit {

  constructor() {

  }

  ngOnInit() {
    $('[data-widget="treeview"]').Treeview('init');
  }

}
