import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-info',
  templateUrl: './info.page.html',
  styleUrls: ['./info.page.scss'],
})
export class InfoPage implements OnInit {

  private title: string;
  private description: string;
  private address: string;
  private date: string;
  private time: string;

  constructor(
    private activatedRoute: ActivatedRoute,
  ) { 
    /*this.title = activatedRoute.snapshot.queryParamMap.get("title");
    this.description = activatedRoute.snapshot.queryParamMap.get("description");
    this.address = activatedRoute.snapshot.queryParamMap.get("address");
    this.date = activatedRoute.snapshot.queryParamMap.get("date");
    this.time = activatedRoute.snapshot.queryParamMap.get("time");
  */}

  ngOnInit() {
  }

  ionViewWillEnter(){
    console.log("WILL ENTER")
    this.title = this.activatedRoute.snapshot.queryParamMap.get("title");
    this.description = this.activatedRoute.snapshot.queryParamMap.get("description");
    this.address = this.activatedRoute.snapshot.queryParamMap.get("address");
    this.date = this.activatedRoute.snapshot.queryParamMap.get("date");
    this.time = this.activatedRoute.snapshot.queryParamMap.get("time");
  }
}
