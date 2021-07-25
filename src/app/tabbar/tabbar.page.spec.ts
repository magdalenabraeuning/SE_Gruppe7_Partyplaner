import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import {HttpClientModule} from '@angular/common/http';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { environment } from 'src/environments/environment';

import { TabbarPage } from './tabbar.page';

fdescribe('TabbarPage', () => {
  let component: TabbarPage;
  let fixture: ComponentFixture<TabbarPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TabbarPage ],
      imports: [IonicModule.forRoot(), HttpClientTestingModule,AngularFireModule,
        AngularFireDatabaseModule, AngularFireModule.initializeApp(environment.firebase), HttpClientModule, AngularFireDatabaseModule, RouterTestingModule, 
        FormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(TabbarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have menu labels', async () => {
    const fixture = await TestBed.createComponent(TabbarPage);
    await fixture.detectChanges();
    const app = fixture.nativeElement;
    const menuItems = app.querySelectorAll('ion-tab-button');
    expect(menuItems.length).toEqual(5);
    expect(menuItems[0].textContent).toContain('Home');
    expect(menuItems[1].textContent).toContain('Info');
    expect(menuItems[2].textContent).toContain('Cocktails');
    expect(menuItems[3].textContent).toContain('Listen');
    expect(menuItems[4].textContent).toContain('Partymodus');
  });

  it('should have urls', async () => {
    const fixture = await TestBed.createComponent(TabbarPage);
    await fixture.detectChanges();
    const app = fixture.nativeElement;
    const menuItems = app.querySelectorAll('ion-tab-button');
    expect(menuItems.length).toEqual(5);
    expect(menuItems[0].getAttribute('ng-reflect-router-link')).toEqual('/partys');
    expect(menuItems[1].getAttribute('ng-reflect-tab')).toEqual('info');
    expect(menuItems[2].getAttribute('ng-reflect-tab')).toEqual('cocktail');
    expect(menuItems[3].getAttribute('ng-reflect-tab')).toEqual('listen');
    expect(menuItems[4].getAttribute('ng-reflect-tab')).toEqual('partymodus');
  });

});
