import { isNgTemplate } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import {​​​ AlertController }​​​ from'@ionic/angular';


@Component({
  selector: 'app-listen',
  templateUrl: './listen.page.html',
  styleUrls: ['./listen.page.scss'],
})
export class ListenPage implements OnInit {

  toDoList = [{
    itemName:"Chips",
    itemMenge: "1Kg",
    itemCategory:"Essen",
    itemUser:"Lena"

  },
  {
    itemName:"Nüsse",
    itemMenge: "1Kg",
    itemCategory:"Essen",
    itemUser:"Annika"
  }
]

  constructor(private alertCtrl: AlertController) {}

  addItem(){
    this.alertCtrl.create({
      message: "Item hinzufügen",
      inputs: [
        { type: 'text', name: 'itemName', placeholder: "Name" },
        { type: 'textarea', name: 'itemMenge', placeholder: "Menge" },
        //{ type: 'textarea', name: 'itemCategory', placeholder: "Kategorie" },
        { type: 'textarea', name: 'itemUser', placeholder: "User" }
      ],
      buttons: [
        {
          text: 'Weiter',
          handler: (res) => {
            this.alertCtrl.create({
              message: "Kategorie wählen",
              inputs: [
                {
                  name : 'itemCategory',
                  type: 'radio',
                  label: 'Essen',
                  value: 'value1',
                  checked: true
                },
                {
                  name: 'itemCategory',
                  type: 'radio',
                  label: 'Trinken',
                  value: 'value2'
                },
                ],
              buttons: [
                {
                  text: 'Add',
                  handler: (res) => {
                    
                  }
                }, {
                  text: 'Cancel'
                }
              ]
            }).then(a => a.present());
          
            console.log(res);
            this.toDoList.push(res);
          }
        }, {
          text: 'Cancel'
        }
      ]
    }).then(a => a.present());
  }

  ngOnInit() {
  }

}
