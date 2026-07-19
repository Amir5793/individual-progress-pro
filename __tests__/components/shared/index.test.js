import {
  Card,
  LeftSection,
  TitleSection,
  Footer,
  Actions,
  Header,
  CategoryIconWrapper,
  IconButton,
} from "@/components/Items/Item/shared";

describe("shared styled components", () => {
  it("exports Card", () => {
    expect(Card).toBeDefined();
  });

  it("exports LeftSection", () => {
    expect(LeftSection).toBeDefined();
  });

  it("exports TitleSection", () => {
    expect(TitleSection).toBeDefined();
  });

  it("exports Footer", () => {
    expect(Footer).toBeDefined();
  });

  it("exports Actions", () => {
    expect(Actions).toBeDefined();
  });

  it("exports Header", () => {
    expect(Header).toBeDefined();
  });

  it("exports CategoryIconWrapper", () => {
    expect(CategoryIconWrapper).toBeDefined();
  });

  it("exports IconButton", () => {
    expect(IconButton).toBeDefined();
  });
});
