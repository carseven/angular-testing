import { DebugElement } from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { setupCourses } from "../common/setup-test-data";
import { CoursesModule } from "../courses.module";
import { CoursesCardListComponent } from "./courses-card-list.component";

describe("CoursesCardListComponent", () => {
  let component: CoursesCardListComponent;
  let fixture: ComponentFixture<CoursesCardListComponent>;
  let debugElement: DebugElement;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [CoursesModule],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(CoursesCardListComponent);

        component = fixture.componentInstance;
        debugElement = fixture.debugElement;
      });
  }));
  it("should create the component", () => {
    expect(component).toBeTruthy();
  });

  it("should display the course list", () => {
    component.courses = setupCourses();
    fixture.detectChanges();

    const coursesCards = debugElement.queryAll(By.css(".course-card"));

    // Se han encontrado cursos
    expect(coursesCards.length).toBeGreaterThan(
      0,
      "Could not find courses cards"
    );
    expect(coursesCards.length).toBe(12, "Unexpected number of courses");
  });

  it("should display the first course", () => {
    component.courses = setupCourses();
    fixture.detectChanges();

    const expectedCourse = component.courses[0];

    const firstCourseRendered = debugElement.query(By.css(".course-card"));
    const title = firstCourseRendered.query(By.css("mat-card-title"));
    const img = firstCourseRendered.query(By.css("img"));

    expect(firstCourseRendered).toBeTruthy("Could not find first course card");

    expect(title.nativeElement.innerText).toBe(
      expectedCourse.titles.description,
      "Course title not correct"
    );

    expect(img.nativeElement.src).toBe(expectedCourse.iconUrl);
  });
});
