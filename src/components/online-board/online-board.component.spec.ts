import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OnlineBoardComponent } from './online-board.component';



describe('OnlinePlayerComponent', () => {
  let component: OnlineBoardComponent;
  let fixture: ComponentFixture<OnlineBoardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OnlineBoardComponent]
    });
    fixture = TestBed.createComponent(OnlineBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
