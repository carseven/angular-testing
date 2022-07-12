import { TestBed } from "@angular/core/testing";
import { CalculatorService } from "./calculator.service";
import { LoggerService } from "./logger.service";
type Spied<T> = {
  [Method in keyof T]: jasmine.Spy;
};
describe("CalculatorService", () => {
  let calculatorService: CalculatorService;
  let loggerService: Spied<LoggerService>;
  beforeEach(() => {
    loggerService = jasmine.createSpyObj("LoggerService", ["log"]);
    TestBed.configureTestingModule({
      providers: [
        CalculatorService,
        { provide: LoggerService, useValue: loggerService },
      ],
    });

    // Le pasamos a TestBed.inject un token uúnico del servico que vamos a inyectar.
    calculatorService = TestBed.inject(CalculatorService);
  });

  it("should add two numbers", () => {
    //Execution
    const result = calculatorService.add(1, 1);

    // Assertion
    expect(result).toBe(2, "Unexpected adding error");
    expect(loggerService.log).toHaveBeenCalledTimes(1);
  });

  it("should substract two numbers", () => {
    //Execution
    const result = calculatorService.subtract(1, 1);

    // Assertion
    expect(result).toBe(0, "Unexpected substracting error");
  });
});
