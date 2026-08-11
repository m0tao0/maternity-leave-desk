import assert from "node:assert/strict";
import test from "node:test";
import { CITY_POLICIES } from "../app/data/policies";
import { calculateMaternityLeave } from "../app/lib/maternity";

function calculate(
  city: string,
  overrides: Partial<Parameters<typeof calculateMaternityLeave>[0]> = {},
) {
  const policy = CITY_POLICIES.find((item) => item.city === city);
  assert.ok(policy, `Missing policy for ${city}`);
  return calculateMaternityLeave({
    policy,
    startDate: "2026-01-01",
    birthDate: "2026-01-01",
    deliveryType: "standard",
    childCount: 1,
    parity: 1,
    lawfulBirthConfirmed: true,
    ...overrides,
  });
}

test("ships exactly 20 mapped cities", () => {
  assert.equal(CITY_POLICIES.length, 20);
  assert.equal(new Set(CITY_POLICIES.map((item) => item.city)).size, 20);
});

test("Shanghai and Jiangsu split the national and local calendars", () => {
  for (const city of ["上海", "南京", "苏州"]) {
    const result = calculate(city);
    assert.equal(result.statutoryLabel, "158天");
    assert.equal(result.endDate, "2026-06-09");
    assert.equal(result.elapsedCalendarDays, 160);
    assert.equal(result.segments[0].countMode, "calendar_days");
    assert.equal(
      result.segments[1].countMode,
      "calendar_days_excluding_statutory_holidays",
    );
  }
});

test("Anhui excludes statutory holidays across the full leave", () => {
  const result = calculate("合肥");
  assert.equal(result.statutoryLabel, "158天");
  assert.equal(result.endDate, "2026-06-15");
  assert.equal(result.elapsedCalendarDays, 166);
});

test("Guangdong grants 80 local days and 30 difficult-birth days", () => {
  const result = calculate("广州", {
    deliveryType: "dystocia",
    medicalProof: true,
  });
  assert.equal(result.statutoryLabel, "208天");
  assert.equal(result.endDate, "2026-07-27");
  assert.equal(result.requiresManualReview, false);
});

test("Sichuan uses the post-2025 188-day rule and keeps a review gate", () => {
  const result = calculate("成都");
  assert.equal(result.statutoryLabel, "188天");
  assert.equal(result.endDate, "2026-07-07");
  assert.equal(result.requiresManualReview, true);
});

test("Zhejiang anchors the extended leave to the birth date", () => {
  const result = calculate("杭州", {
    startDate: "2025-12-20",
    birthDate: "2026-01-01",
    parity: 2,
  });
  assert.equal(result.endDate, "2026-07-07");
  assert.equal(result.elapsedCalendarDays, 200);
  assert.equal(result.segments[0].label, "产前已休产假");
  assert.equal(result.segments[0].value, 12);
  assert.equal(result.segments[1].value, 188);
});

test("Shaanxi conditionally adds prenatal-exam and third-child leave", () => {
  const result = calculate("西安", {
    parity: 3,
    prePregnancyExam: true,
  });
  assert.equal(result.statutoryLabel, "183天");
  assert.equal(result.endDate, "2026-07-02");
});

test("Fujian uses the employer's total range and does not auto-stack dystocia", () => {
  const result = calculate("厦门", {
    selectedLocalDays: 170,
    deliveryType: "dystocia",
    medicalProof: true,
  });
  assert.equal(result.statutoryLabel, "170天");
  assert.equal(result.endDate, "2026-06-19");
  assert.equal(result.requiresManualReview, true);
});

test("an unconfirmed lawful birth only receives the national base", () => {
  const result = calculate("上海", { lawfulBirthConfirmed: false });
  assert.equal(result.statutoryLabel, "98天");
  assert.equal(result.endDate, "2026-04-08");
});
