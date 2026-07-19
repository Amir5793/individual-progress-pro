import { handleTimeSelection, handleDatePick } from "@/components/Stepper/utils/stepHandler";

beforeEach(() => {
  jest.clearAllMocks();
});

describe("handleTimeSelection", () => {
  it("No deadline sets null and hides calendar", () => {
    const clearError = jest.fn();
    const setShowCalendar = jest.fn();
    const setDeadline = jest.fn();
    handleTimeSelection("No deadline", clearError, setShowCalendar, setDeadline);
    expect(clearError).toHaveBeenCalledWith("deadline");
    expect(setDeadline).toHaveBeenCalledWith(null);
    expect(setShowCalendar).toHaveBeenCalledWith(false);
  });

  it("tomorrow sets tomorrow's date", () => {
    const clearError = jest.fn();
    const setShowCalendar = jest.fn();
    const setDeadline = jest.fn();
    handleTimeSelection("tomorrow", clearError, setShowCalendar, setDeadline);
    expect(clearError).toHaveBeenCalledWith("deadline");
    expect(setDeadline).toHaveBeenCalledWith(expect.any(Date));
    expect(setShowCalendar).toHaveBeenCalledWith(false);
    const calledDate = setDeadline.mock.calls[0][0];
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    expect(calledDate.getDate()).toBe(tomorrow.getDate());
  });

  it("this week sets end of week", () => {
    const clearError = jest.fn();
    const setShowCalendar = jest.fn();
    const setDeadline = jest.fn();
    handleTimeSelection("this week", clearError, setShowCalendar, setDeadline);
    expect(clearError).toHaveBeenCalledWith("deadline");
    expect(setDeadline).toHaveBeenCalledWith(expect.any(Date));
    expect(setShowCalendar).toHaveBeenCalledWith(false);
  });

  it("pick a date shows calendar without setting deadline", () => {
    const clearError = jest.fn();
    const setShowCalendar = jest.fn();
    const setDeadline = jest.fn();
    handleTimeSelection("pick a date", clearError, setShowCalendar, setDeadline);
    expect(clearError).toHaveBeenCalledWith("deadline");
    expect(setShowCalendar).toHaveBeenCalledWith(true);
    expect(setDeadline).not.toHaveBeenCalled();
  });

  it("unknown option does nothing", () => {
    const clearError = jest.fn();
    const setShowCalendar = jest.fn();
    const setDeadline = jest.fn();
    handleTimeSelection("unknown", clearError, setShowCalendar, setDeadline);
    expect(clearError).toHaveBeenCalledWith("deadline");
    expect(setDeadline).not.toHaveBeenCalled();
    expect(setShowCalendar).not.toHaveBeenCalled();
  });
});

describe("handleDatePick", () => {
  it("sets deadline and hides calendar", () => {
    const setDeadline = jest.fn();
    const setShowCalendar = jest.fn();
    const date = new Date("2025-06-15");
    handleDatePick(date, setDeadline, setShowCalendar);
    expect(setDeadline).toHaveBeenCalledWith(date);
    expect(setShowCalendar).toHaveBeenCalledWith(false);
  });
});
