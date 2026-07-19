import {
  categories,
  getCategoryConfig,
  getCategoryIcon,
  getCategoryColor,
} from "@/constants/categories";

describe("categories", () => {
  it("has expected keys", () => {
    expect(categories).toHaveProperty("Learning");
    expect(categories).toHaveProperty("Coding");
    expect(categories).toHaveProperty("Health");
    expect(categories).toHaveProperty("Fitness");
    expect(categories).toHaveProperty("Finance");
    expect(categories).toHaveProperty("Personal");
    expect(categories).toHaveProperty("Reading");
    expect(categories).toHaveProperty("Knowledge");
    expect(categories).toHaveProperty("Programming");
    expect(categories).toHaveProperty("Career");
  });
});

describe("getCategoryConfig", () => {
  it("returns config for known category", () => {
    const config = getCategoryConfig("Learning");
    expect(config).toHaveProperty("icon");
    expect(config).toHaveProperty("color");
  });

  it("returns default for unknown category", () => {
    const config = getCategoryConfig("Nonexistent");
    expect(config).toHaveProperty("icon");
    expect(config).toHaveProperty("color");
    expect(config.color).toBe("var(--text-muted)");
  });
});

describe("getCategoryIcon", () => {
  it("returns a value", () => {
    const icon = getCategoryIcon("Learning");
    expect(icon).toBeTruthy();
  });
});

describe("getCategoryColor", () => {
  it("returns a string", () => {
    const color = getCategoryColor("Learning");
    expect(typeof color).toBe("string");
  });
});
