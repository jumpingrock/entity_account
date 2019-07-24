import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityAccountInquirySecondComponent } from './entity-account-inquiry-second.component';

describe('EntityAccountInquirySecondComponent', () => {
  let component: EntityAccountInquirySecondComponent;
  let fixture: ComponentFixture<EntityAccountInquirySecondComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntityAccountInquirySecondComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntityAccountInquirySecondComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
