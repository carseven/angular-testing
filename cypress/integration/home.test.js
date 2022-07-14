describe("Home Page", () => {
  beforeEach(() => {
    cy.intercept("GET", "api/courses", { fixture: "courses.json" }).as(
      "courses"
    );
    cy.visit("/");
    cy.wait("@courses");
  });

  it("should display a list of courses", () => {
    cy.contains("All Courses");
    cy.get("mat-card").should("have.length", 9);
  });

  it("should display the advanced courses", () => {
    cy.get(".mat-tab-label").should("have.length", 2);
    cy.get(".mat-tab-label").last().click();
    cy.get(".mat-tab-body-active .mat-card-title")
      .its("length")
      .should("be.gt", 1);
    cy.get(".mat-tab-body-active .mat-card-title")
      .first()
      .should("contain", "Angular Security Course");
  });
});
