import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ListPagePage } from './list-page.page';

describe('ListPagePage', () => {
  let component: ListPagePage;
  let fixture: ComponentFixture<ListPagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListPagePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ListPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
