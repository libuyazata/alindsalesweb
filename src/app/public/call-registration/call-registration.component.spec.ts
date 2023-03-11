import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CallRegistrationComponent } from './call-registration.component';

describe('CallRegistrationComponent', () => {
  let component: CallRegistrationComponent;
  let fixture: ComponentFixture<CallRegistrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        declarations: [CallRegistrationComponent]
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CallRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
