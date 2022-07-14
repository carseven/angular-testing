import { DebugElement } from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { of } from "rxjs";
import { setupCourses } from "../common/setup-test-data";
import { click } from "../common/test-utils";
import { CoursesModule } from "../courses.module";
import { CoursesService } from "../services/courses.service";
import { HomeComponent } from "./home.component";
type Spied<T> = { [Method in keyof T]: jasmine.Spy };
describe("HomeComponent", () => {
  let fixture: ComponentFixture<HomeComponent>;
  let component: HomeComponent;
  let el: DebugElement;
  let coursesServiceSpy: Spied<CoursesService>;

  // Mock data
  const getCoursesByCategory = (courseCategory: "BEGINNER" | "ADVANCED") =>
    setupCourses().filter((course) => course.category === courseCategory);

  beforeEach(waitForAsync(() => {
    coursesServiceSpy = jasmine.createSpyObj("CoursesService", [
      "findAllCourses",
    ]);
    TestBed.configureTestingModule({
      imports: [CoursesModule, NoopAnimationsModule],
      providers: [{ provide: CoursesService, useValue: coursesServiceSpy }],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(HomeComponent);
        component = fixture.componentInstance;
        el = fixture.debugElement;
      });
  }));

  it("should create the component", () => {
    expect(component).toBeTruthy();
  });

  it("should display only beginner courses", () => {
    coursesServiceSpy.findAllCourses.and.returnValue(
      of(getCoursesByCategory("BEGINNER"))
    );
    fixture.detectChanges();

    const renderedTabs = el.queryAll(By.css(".mat-tab-label"));

    expect(renderedTabs.length).toBe(1, "unexpected number of tabs found");
  });

  it("should display only advanced courses", () => {
    coursesServiceSpy.findAllCourses.and.returnValue(
      of(getCoursesByCategory("ADVANCED"))
    );
    fixture.detectChanges();

    const renderedTabs = el.queryAll(By.css(".mat-tab-label"));

    expect(renderedTabs.length).toBe(1, "unexpected number of tabs found");
  });

  it("should display both tabs", () => {
    coursesServiceSpy.findAllCourses.and.returnValue(of(setupCourses()));
    fixture.detectChanges();

    const renderedTabs = el.queryAll(By.css(".mat-tab-label"));

    expect(renderedTabs.length).toBe(2, "unexpected number of tabs found");
  });
  it("should display advanced courses when tab clicked", waitForAsync(() => {
    coursesServiceSpy.findAllCourses.and.returnValue(of(setupCourses()));
    fixture.detectChanges();

    const renderedTabs = el.queryAll(By.css(".mat-tab-label"));

    // Comprobar que se han renderizado las dos tabs
    expect(renderedTabs.length).toBe(2, "unexpected number of tabs found");

    // Hacer un click en el elemento y comprobar que se renderiza la
    // pestaña de cursos avanzados
    click(renderedTabs[1]);
    fixture.detectChanges();

    // Con el waitAsync controlamos todas las asyncronidades del componente
    // cuando todas se han resuelto, entonces se cumple la promesa de la función
    // whenStable
    fixture.whenStable().then(() => {
      const cardTitle = el.query(By.css(".mat-card-title"));
      expect(cardTitle.nativeElement.innerText).toContain(
        "Angular Testing Course"
      );
    });
  }));
});
