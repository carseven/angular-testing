import { CalculatorService } from "./calculator.service";
import { LoggerService } from "./logger.service";

describe("CalculatorService", () => {
  it("should add two numbers", () => {
    const calculatorService = new CalculatorService(new LoggerService());

    const result = calculatorService.add(1, 1);
    expect(result).toBe(2);
  });

  it("should substract two numbers", () => {
    pending();
  });
});
