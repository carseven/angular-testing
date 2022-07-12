import { HttpErrorResponse, HttpRequest } from "@angular/common/http";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { COURSES, findLessonsForCourse } from "../../../../server/db-data";
import { Course } from "../model/course";
import { CoursesService } from "./courses.service";

describe("CoursesService", () => {
  let coursesService: CoursesService;
  let httpTestingController: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CoursesService],
      imports: [HttpClientTestingModule],
    });
    coursesService = TestBed.inject(CoursesService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });
  it("should retrieve all courses", () => {
    coursesService.findAllCourses().subscribe((courses) => {
      // Comprueba que los cursos no vengan nulos
      expect(courses).toBeTruthy("No courses returned");

      // Comprobar que vienen todos los cursos
      expect(courses.length).toBe(12, "Incorrect number of courses");

      // Comprobar el formato de un curso 12 es correcto
      const course = courses.find((course) => course.id === 12);
      expect(course.titles.description).toBe("Angular Testing Course");
    });

    // Comprobar que hemos llamado api correctament
    const req = httpTestingController.expectOne("/api/courses");

    // Comprobar que la llamada del método a sido GET
    expect(req.request.method).toBe("GET");

    // Mockear la respuesta de la api
    req.flush({ payload: Object.values(COURSES) });
  });

  it("should find a course by id", () => {
    const courseID = 12;
    coursesService.findCourseById(courseID).subscribe((course) => {
      expect(course).toBeTruthy("No course has been found");
      expect(course.id).toBe(courseID, "Course id not correct");
    });
    // Comprobar que hemos llamado api correctament
    const req = httpTestingController.expectOne(`/api/courses/${courseID}`);

    // Comprobar que la llamada del método a sido GET
    expect(req.request.method).toBe("GET");

    // Mockear la respuesta de la api
    req.flush(COURSES[courseID]);
  });

  it("should save the course data", () => {
    const changes: Partial<Course> = {
      titles: {
        description: "Testing Course",
      },
    };
    const courseID = 12;
    coursesService.saveCourse(courseID, changes).subscribe((course) => {
      expect(course.id).toBe(courseID);
    });
    const req = httpTestingController.expectOne(`/api/courses/${courseID}`);
    expect(req.request.method).toBe("PUT");
    req.flush({
      ...COURSES[12],
      ...changes,
    });
  });

  it("should give an error if save course fail", () => {
    const changes: Partial<Course> = {
      titles: {
        description: "Testing Course",
      },
    };
    const courseID = 12;
    coursesService.saveCourse(courseID, changes).subscribe(
      (course) => {
        // Verificar que si entramos aquí, que no ha fallado la llamada y
        // por tanto el test ya no es correcto, xq debería haber devuelto
        // error la llamada
        fail("the save course operation should have fail");
      },
      (error: HttpErrorResponse) => {
        expect(error.status).toBe(500);
      }
    );
    const req = httpTestingController.expectOne(`/api/courses/${courseID}`);
    expect(req.request.method).toBe("PUT");

    // Mockear un error en la respuesta
    req.flush("Save course failed", {
      status: 500,
      statusText: "Internal server error",
    });
  });

  it("should find a list of lessons", () => {
    const courseID = 12;
    coursesService.findLessons(courseID).subscribe((lessons) => {
      expect(lessons).toBeTruthy();
      expect(lessons.length).toBe(3);
    });

    const req = httpTestingController.expectOne(
      (req: HttpRequest<any>) => req.url === "/api/lessons"
    );

    expect(req.request.method).toBe("GET");

    // Comprobar los query parameter por defecto son correctos
    // Ojo las query param son string siempre
    expect(req.request.params.get("courseId")).toBe(courseID.toString());
    expect(req.request.params.get("filter")).toBe("");
    expect(req.request.params.get("sortOrder")).toBe("asc");
    expect(req.request.params.get("pageSize")).toBe("3");

    req.flush({
      payload: findLessonsForCourse(courseID).slice(0, 3),
    });
  });

  afterAll(() => {
    httpTestingController.verify();
  });
});
