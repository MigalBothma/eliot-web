import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardStaticComponent } from './dashboard-static.component';

describe('DashboardStaticComponent', () => {
  let component: DashboardStaticComponent;
  let fixture: ComponentFixture<DashboardStaticComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardStaticComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardStaticComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
