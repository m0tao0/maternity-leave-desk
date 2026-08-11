export type CountMode =
  | "calendar_days"
  | "calendar_days_excluding_statutory_holidays"
  | "calendar_months";

export type DeliveryType = "standard" | "dystocia" | "cesarean";

export type Source = {
  id: string;
  title: string;
  issuer: string;
  article: string;
  url: string;
};

export type SegmentRule = {
  id: string;
  label: string;
  value: number;
  unit: "days" | "months";
  countMode: CountMode;
  sourceIds: string[];
  note?: string;
};

export type CityPolicy = {
  city: string;
  province: string;
  tier: "一线" | "二线";
  effectiveFrom: string;
  verifiedOn: string;
  status: "已核验" | "需人工复核";
  baseDays: number;
  baseCountMode?: CountMode;
  localLeave:
    | { kind: "fixed"; days: number; countMode: CountMode }
    | {
        kind: "by_parity";
        firstChildDays: number;
        laterChildDays: number;
        countMode: CountMode;
      }
    | {
        kind: "range";
        minDays: number;
        maxDays: number;
        countMode: CountMode;
      }
    | {
        kind: "total_range";
        minTotalDays: number;
        maxTotalDays: number;
        countMode: CountMode;
      }
    | { kind: "months"; months: number; countMode: CountMode };
  dystociaDays: number;
  cesareanDays: number;
  multipleBirthDaysPerAdditionalChild: number;
  difficultBirthMode?: "add" | "included_in_total";
  multipleBirthMode?: "add" | "manual";
  birthDateAnchored?: boolean;
  thirdChildDays?: number;
  thirdChildApprovalDays?: number;
  breastfeedingBonusMonths?: number;
  employerApprovedExtraMonthsMax?: number;
  conditionalBonus?: {
    id: "pre_pregnancy_exam";
    label: string;
    days: number;
    countMode: CountMode;
    note: string;
  };
  localSourceIds: string[];
  notes: string[];
  sources: Source[];
};

export type CalculationInput = {
  policy: CityPolicy;
  startDate: string;
  birthDate: string;
  deliveryType: DeliveryType;
  childCount: number;
  parity: 1 | 2 | 3;
  selectedLocalDays?: number;
  prePregnancyExam?: boolean;
  requestedDays?: number;
  lawfulBirthConfirmed?: boolean;
  medicalProof?: boolean;
  optionalLeaveApproved?: boolean;
  pureBreastfeedingProof?: boolean;
  employerApprovedExtraMonths?: number;
};

export type CalculatedSegment = SegmentRule & {
  startDate: string;
  endDate: string;
  elapsedCalendarDays: number;
};

export type CalculationResult = {
  segments: CalculatedSegment[];
  endDate: string;
  returnDate: string;
  elapsedCalendarDays: number;
  statutoryLabel: string;
  requestedDecision?: {
    requestedDays: number;
    overBy: number;
    status: "within" | "over";
  };
  warnings: string[];
  requiresManualReview: boolean;
  reviewReasons: string[];
};

const DAY_MS = 86_400_000;

// “法定节假日”只列《全国年节及纪念日放假办法》中的法定日期，
// 不把调休形成的连休日或普通周末算作法定节假日。
const STATUTORY_HOLIDAYS = new Set([
  "2025-01-01",
  "2025-01-28",
  "2025-01-29",
  "2025-01-30",
  "2025-01-31",
  "2025-04-04",
  "2025-05-01",
  "2025-05-02",
  "2025-05-31",
  "2025-10-01",
  "2025-10-02",
  "2025-10-03",
  "2025-10-06",
  "2026-01-01",
  "2026-02-16",
  "2026-02-17",
  "2026-02-18",
  "2026-02-19",
  "2026-04-05",
  "2026-05-01",
  "2026-05-02",
  "2026-06-19",
  "2026-09-25",
  "2026-10-01",
  "2026-10-02",
  "2026-10-03",
]);

const ARRANGED_DAYS_OFF = new Set([
  "2025-01-01",
  ...dateRange("2025-01-28", "2025-02-04"),
  ...dateRange("2025-04-04", "2025-04-06"),
  ...dateRange("2025-05-01", "2025-05-05"),
  ...dateRange("2025-05-31", "2025-06-02"),
  ...dateRange("2025-10-01", "2025-10-08"),
  ...dateRange("2026-01-01", "2026-01-03"),
  ...dateRange("2026-02-15", "2026-02-23"),
  ...dateRange("2026-04-04", "2026-04-06"),
  ...dateRange("2026-05-01", "2026-05-05"),
  ...dateRange("2026-06-19", "2026-06-21"),
  ...dateRange("2026-09-25", "2026-09-27"),
  ...dateRange("2026-10-01", "2026-10-07"),
]);

const MAKE_UP_WORKDAYS = new Set([
  "2025-01-26",
  "2025-02-08",
  "2025-04-27",
  "2025-09-28",
  "2025-10-11",
  "2026-01-04",
  "2026-02-14",
  "2026-02-28",
  "2026-05-09",
  "2026-09-20",
  "2026-10-10",
]);

function parseDate(value: string): Date {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * DAY_MS);
}

function addMonthsClamped(date: Date, months: number): Date {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth();
  const day = date.getUTCDate();
  const targetFirst = new Date(Date.UTC(year, month + months, 1));
  const targetLastDay = new Date(
    Date.UTC(targetFirst.getUTCFullYear(), targetFirst.getUTCMonth() + 1, 0),
  ).getUTCDate();
  return new Date(
    Date.UTC(
      targetFirst.getUTCFullYear(),
      targetFirst.getUTCMonth(),
      Math.min(day, targetLastDay),
    ),
  );
}

function dateRange(start: string, end: string): string[] {
  const values: string[] = [];
  let cursor = parseDate(start);
  const last = parseDate(end);
  while (cursor <= last) {
    values.push(toIsoDate(cursor));
    cursor = addDays(cursor, 1);
  }
  return values;
}

function isCoveredYear(date: Date): boolean {
  const year = date.getUTCFullYear();
  return year === 2025 || year === 2026;
}

function isWorkday(date: Date): boolean {
  const iso = toIsoDate(date);
  if (MAKE_UP_WORKDAYS.has(iso)) return true;
  if (ARRANGED_DAYS_OFF.has(iso)) return false;
  const weekday = date.getUTCDay();
  return weekday !== 0 && weekday !== 6;
}

function segmentEnd(
  start: Date,
  value: number,
  unit: "days" | "months",
  countMode: CountMode,
): Date {
  if (unit === "months" || countMode === "calendar_months") {
    return addDays(addMonthsClamped(start, value), -1);
  }

  if (countMode === "calendar_days") {
    return addDays(start, value - 1);
  }

  let cursor = start;
  let counted = 0;
  while (counted < value) {
    if (!STATUTORY_HOLIDAYS.has(toIsoDate(cursor))) counted += 1;
    if (counted < value) cursor = addDays(cursor, 1);
  }
  return cursor;
}

function getLocalSegment(input: CalculationInput): SegmentRule {
  const { policy } = input;
  const sourceIds = policy.localSourceIds;

  if (policy.localLeave.kind === "by_parity") {
    const days =
      input.parity === 1
        ? policy.localLeave.firstChildDays
        : policy.localLeave.laterChildDays;
    return {
      id: "local_leave",
      label: input.parity === 1 ? "地方延长假（生育一孩）" : "地方延长假（生育二孩或三孩）",
      value: days,
      unit: "days",
      countMode: policy.localLeave.countMode,
      sourceIds,
    };
  }

  if (policy.localLeave.kind === "range") {
    const selected = Math.min(
      policy.localLeave.maxDays,
      Math.max(
        policy.localLeave.minDays,
        input.selectedLocalDays ?? policy.localLeave.minDays,
      ),
    );
    return {
      id: "local_leave",
      label: "地方延长假（单位在法定区间内确定）",
      value: selected,
      unit: "days",
      countMode: policy.localLeave.countMode,
      sourceIds,
      note: `当地规定区间为${policy.localLeave.minDays}—${policy.localLeave.maxDays}天，本次按${selected}天计算。`,
    };
  }

  if (policy.localLeave.kind === "total_range") {
    const selectedTotal = Math.min(
      policy.localLeave.maxTotalDays,
      Math.max(
        policy.localLeave.minTotalDays,
        input.selectedLocalDays ?? policy.localLeave.minTotalDays,
      ),
    );
    return {
      id: "total_leave",
      label: "用人单位确定的产假总期",
      value: selectedTotal,
      unit: "days",
      countMode: policy.localLeave.countMode,
      sourceIds,
      note: `当地规定总产假为${policy.localLeave.minTotalDays}—${policy.localLeave.maxTotalDays}天，本次按${selectedTotal}天计算。`,
    };
  }

  if (policy.localLeave.kind === "months") {
    return {
      id: "local_leave",
      label: "地方奖励假",
      value: policy.localLeave.months,
      unit: "months",
      countMode: policy.localLeave.countMode,
      sourceIds,
      note: "法规以“月”为单位，本工具按对应日历月计算，不擅自折算为固定天数。",
    };
  }

  return {
    id: "local_leave",
    label: "地方延长假",
    value: policy.localLeave.days,
    unit: "days",
    countMode: policy.localLeave.countMode,
    sourceIds,
  };
}

export function calculateMaternityLeave(
  input: CalculationInput,
): CalculationResult {
  const { policy } = input;
  const rules: SegmentRule[] = [];
  const lawfulBirthConfirmed = input.lawfulBirthConfirmed !== false;
  const baseCountMode = policy.baseCountMode ?? "calendar_days";
  const isTotalRange = policy.localLeave.kind === "total_range";

  if (isTotalRange && lawfulBirthConfirmed) {
    rules.push(getLocalSegment(input));
  } else if (policy.birthDateAnchored && lawfulBirthConfirmed) {
    const start = parseDate(input.startDate);
    const birth = parseDate(input.birthDate);
    const prenatalDays = Math.max(
      0,
      Math.round((birth.getTime() - start.getTime()) / DAY_MS),
    );
    if (prenatalDays > 0) {
      rules.push({
        id: "prenatal_leave",
        label: "产前已休产假",
        value: prenatalDays,
        unit: "days",
        countMode: baseCountMode,
        sourceIds: ["national_619"],
        note: "浙江延长产假从生育日锚定，产前已休天数单独列示。",
      });
    }
    const local = getLocalSegment(input);
    rules.push({
      id: "birth_anchored_leave",
      label: "自生育日起的产假及延长产假",
      value: policy.baseDays + local.value,
      unit: "days",
      countMode: local.countMode,
      sourceIds: ["national_619", ...policy.localSourceIds],
      note: "按实际生育日作为第1天计算。",
    });
  } else {
    rules.push({
      id: "national_base",
      label: "国家基础产假",
      value: policy.baseDays,
      unit: "days",
      countMode: baseCountMode,
      sourceIds: ["national_619"],
      note: "产假起始日计为第1天。",
    });
  }

  if (
    input.deliveryType !== "standard" &&
    !(
      policy.difficultBirthMode === "included_in_total" &&
      lawfulBirthConfirmed
    )
  ) {
    const days =
      input.deliveryType === "cesarean"
        ? policy.cesareanDays
        : policy.dystociaDays;
    rules.push({
      id: "difficult_birth",
      label: input.deliveryType === "cesarean" ? "剖宫产增加假" : "难产增加假",
      value: days,
      unit: "days",
      countMode: baseCountMode,
      sourceIds: ["national_619", ...policy.localSourceIds],
    });
  }

  if (
    input.childCount > 1 &&
    !(policy.multipleBirthMode === "manual" && lawfulBirthConfirmed)
  ) {
    rules.push({
      id: "multiple_birth",
      label: `多胞胎增加假（多${input.childCount - 1}个婴儿）`,
      value:
        (input.childCount - 1) * policy.multipleBirthDaysPerAdditionalChild,
      unit: "days",
      countMode: baseCountMode,
      sourceIds: ["national_619", ...policy.localSourceIds],
    });
  }

  if (!isTotalRange && !policy.birthDateAnchored && lawfulBirthConfirmed) {
    rules.push(getLocalSegment(input));
  }

  if (
    lawfulBirthConfirmed &&
    input.prePregnancyExam &&
    policy.conditionalBonus
  ) {
    rules.push({
      id: policy.conditionalBonus.id,
      label: policy.conditionalBonus.label,
      value: policy.conditionalBonus.days,
      unit: "days",
      countMode: policy.conditionalBonus.countMode,
      sourceIds: policy.localSourceIds,
      note: policy.conditionalBonus.note,
    });
  }

  if (lawfulBirthConfirmed && input.parity === 3 && policy.thirdChildDays) {
    rules.push({
      id: "third_child",
      label: "生育三孩增加假",
      value: policy.thirdChildDays,
      unit: "days",
      countMode: baseCountMode,
      sourceIds: policy.localSourceIds,
    });
  }

  if (
    lawfulBirthConfirmed &&
    input.parity === 3 &&
    input.optionalLeaveApproved &&
    policy.thirdChildApprovalDays
  ) {
    rules.push({
      id: "third_child_approved",
      label: "三孩经单位同意增加假",
      value: policy.thirdChildApprovalDays,
      unit: "days",
      countMode: baseCountMode,
      sourceIds: policy.localSourceIds,
      note: "该段需要本人申请及用人单位同意材料。",
    });
  }

  if (
    lawfulBirthConfirmed &&
    input.pureBreastfeedingProof &&
    policy.breastfeedingBonusMonths
  ) {
    rules.push({
      id: "breastfeeding_bonus",
      label: "纯母乳喂养增加假",
      value: policy.breastfeedingBonusMonths,
      unit: "months",
      countMode: "calendar_months",
      sourceIds: policy.localSourceIds,
      note: "法规使用“一个月”，本次按对应日历月推算，仍需确认当地起止边界。",
    });
  }

  if (
    lawfulBirthConfirmed &&
    input.employerApprovedExtraMonths &&
    policy.employerApprovedExtraMonthsMax
  ) {
    rules.push({
      id: "employer_approved_extra",
      label: "经单位同意的额外假期",
      value: Math.min(
        input.employerApprovedExtraMonths,
        policy.employerApprovedExtraMonthsMax,
      ),
      unit: "months",
      countMode: "calendar_months",
      sourceIds: policy.localSourceIds,
      note: "该段不是无条件法定基线，需留存用人单位同意材料。",
    });
  }

  const segments: CalculatedSegment[] = [];
  let cursor = parseDate(input.startDate);
  for (const rule of rules) {
    const end = segmentEnd(cursor, rule.value, rule.unit, rule.countMode);
    segments.push({
      ...rule,
      startDate: toIsoDate(cursor),
      endDate: toIsoDate(end),
      elapsedCalendarDays:
        Math.round((end.getTime() - cursor.getTime()) / DAY_MS) + 1,
    });
    cursor = addDays(end, 1);
  }

  const finalEnd = parseDate(segments.at(-1)!.endDate);
  let returnDate = addDays(finalEnd, 1);
  while (!isWorkday(returnDate)) returnDate = addDays(returnDate, 1);

  const start = parseDate(input.startDate);
  const elapsedCalendarDays =
    Math.round((finalEnd.getTime() - start.getTime()) / DAY_MS) + 1;
  const dayParts = rules
    .filter((rule) => rule.unit === "days")
    .reduce((sum, rule) => sum + rule.value, 0);
  const monthParts = rules
    .filter((rule) => rule.unit === "months")
    .reduce((sum, rule) => sum + rule.value, 0);
  const statutoryLabel = [
    dayParts ? `${dayParts}天` : "",
    monthParts ? `${monthParts}个月` : "",
  ]
    .filter(Boolean)
    .join(" + ");

  const warnings = [...policy.notes];
  const reviewReasons: string[] = [];
  if (input.deliveryType !== "standard" && !input.medicalProof) {
    reviewReasons.push("难产或剖宫产增加假尚未确认符合当地要求的医疗证明。 ");
  }
  if (policy.status === "需人工复核") {
    reviewReasons.push("该地区存在法规区间或尚未明确的日历计算口径。 ");
  }
  if (policy.multipleBirthMode === "manual" && input.childCount > 1) {
    reviewReasons.push("当地多胞胎与总产假区间的叠加关系缺少明确现行口径。 ");
  }
  if (policy.birthDateAnchored && input.childCount > 1) {
    reviewReasons.push("浙江多胞胎规则的官方公开表述存在张力，需向当地经办部门复核。 ");
  }
  if (policy.birthDateAnchored && input.startDate > input.birthDate) {
    reviewReasons.push("产假开始日晚于生育日，无法按浙江的生育日锚定规则自动审批。 ");
  }
  if (policy.birthDateAnchored) {
    const prenatalDays = Math.max(
      0,
      Math.round(
        (parseDate(input.birthDate).getTime() -
          parseDate(input.startDate).getTime()) /
          DAY_MS,
      ),
    );
    if (prenatalDays > 15) {
      reviewReasons.push("产前起休超过国家规定可在98天中产前休假的15天，需人工复核。 ");
    }
  }
  if (input.pureBreastfeedingProof) {
    reviewReasons.push("纯母乳喂养增加“一个月”的起止边界需要四川当地口径确认。 ");
  }
  if (!lawfulBirthConfirmed) {
    warnings.push("未确认符合地方延长生育假的条件，本次只计算国家基础产假及相应特殊增加假。 ");
  }
  if (!isCoveredYear(start) || !isCoveredYear(returnDate)) {
    warnings.push(
      "返岗日超出已内置的2025—2026年国务院放假调休表；结果仅按标准双休推算，请结合对应年度官方安排复核。",
    );
  }

  const requestedDecision = input.requestedDays
    ? {
        requestedDays: input.requestedDays,
        overBy: Math.max(0, input.requestedDays - elapsedCalendarDays),
        status:
          input.requestedDays <= elapsedCalendarDays
            ? ("within" as const)
            : ("over" as const),
      }
    : undefined;

  return {
    segments,
    endDate: toIsoDate(finalEnd),
    returnDate: toIsoDate(returnDate),
    elapsedCalendarDays,
    statutoryLabel,
    requestedDecision,
    warnings,
    requiresManualReview: reviewReasons.length > 0,
    reviewReasons,
  };
}

export function formatChineseDate(value: string): string {
  return new Intl.DateTimeFormat("zh-CN", {
    timeZone: "UTC",
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
  }).format(parseDate(value));
}

export function countModeLabel(mode: CountMode): string {
  if (mode === "calendar_days_excluding_statutory_holidays") {
    return "连续使用，含周末；遇法定节假日顺延";
  }
  if (mode === "calendar_months") return "连续日历月";
  return "连续自然日，含周末及法定节假日";
}
