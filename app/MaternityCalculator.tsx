"use client";

import { useMemo, useState } from "react";
import { CITY_POLICIES } from "./data/policies";
import {
  calculateMaternityLeave,
  countModeLabel,
  formatChineseDate,
  type DeliveryType,
} from "./lib/maternity";

const TODAY = "2026-08-11";

function formatDuration(value: number, unit: "days" | "months") {
  return unit === "months" ? `${value}个月` : `${value}天`;
}

export function MaternityCalculator() {
  const [city, setCity] = useState("上海");
  const [startDate, setStartDate] = useState(TODAY);
  const [birthDate, setBirthDate] = useState(TODAY);
  const [deliveryType, setDeliveryType] =
    useState<DeliveryType>("standard");
  const [childCount, setChildCount] = useState(1);
  const [parity, setParity] = useState<1 | 2 | 3>(1);
  const [selectedLocalDays, setSelectedLocalDays] = useState(60);
  const [prePregnancyExam, setPrePregnancyExam] = useState(false);
  const [lawfulBirthConfirmed, setLawfulBirthConfirmed] = useState(true);
  const [medicalProof, setMedicalProof] = useState(false);
  const [optionalLeaveApproved, setOptionalLeaveApproved] = useState(false);
  const [pureBreastfeedingProof, setPureBreastfeedingProof] = useState(false);
  const [employerApprovedExtraMonths, setEmployerApprovedExtraMonths] =
    useState(0);
  const [requestedDays, setRequestedDays] = useState(200);

  const policy = CITY_POLICIES.find((item) => item.city === city)!;

  const result = useMemo(
    () =>
      calculateMaternityLeave({
        policy,
        startDate,
        birthDate,
        deliveryType,
        childCount,
        parity,
        selectedLocalDays,
        prePregnancyExam,
        requestedDays: requestedDays || undefined,
        lawfulBirthConfirmed,
        medicalProof,
        optionalLeaveApproved,
        pureBreastfeedingProof,
        employerApprovedExtraMonths,
      }),
    [
      policy,
      startDate,
      birthDate,
      deliveryType,
      childCount,
      parity,
      selectedLocalDays,
      prePregnancyExam,
      requestedDays,
      lawfulBirthConfirmed,
      medicalProof,
      optionalLeaveApproved,
      pureBreastfeedingProof,
      employerApprovedExtraMonths,
    ],
  );

  const historicalMismatch = birthDate < policy.effectiveFrom;
  const requiresManualReview = result.requiresManualReview || historicalMismatch;
  const decision = result.requestedDecision;

  function changeCity(nextCity: string) {
    setCity(nextCity);
    const next = CITY_POLICIES.find((item) => item.city === nextCity)!;
    if (next.localLeave.kind === "range") {
      setSelectedLocalDays(next.localLeave.minDays);
    } else if (next.localLeave.kind === "total_range") {
      setSelectedLocalDays(next.localLeave.minTotalDays);
    }
    setOptionalLeaveApproved(false);
    setPureBreastfeedingProof(false);
    setEmployerApprovedExtraMonths(0);
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="产假政策核算台首页">
          <span className="brand-mark" aria-hidden="true">
            假
          </span>
          <span>
            <strong>产假政策核算台</strong>
            <small>Maternity Leave Desk</small>
          </span>
        </a>
        <div className="topbar-meta">
          <span className="coverage-pill">首批 20 城</span>
          <span>政策核验至 2026.08</span>
        </div>
      </header>

      <section className="intro" id="top">
        <div>
          <p className="eyebrow">HR · Leave Admin</p>
          <h1>把政策条文，算成一个明确日期。</h1>
          <p>
            输入工作地和生育情况，立即得到法定假期、休假截止日、返岗日与逐段计算依据。
          </p>
        </div>
        <div className="trust-note">
          <span className="trust-dot" />
          <div>
            <strong>仅引用官方来源</strong>
            <small>每个结论均可追溯至具体文件与条款</small>
          </div>
        </div>
      </section>

      <div className="workspace">
        <aside className="input-panel" aria-label="核算条件">
          <div className="panel-heading">
            <span className="step-number">01</span>
            <div>
              <h2>填写核算条件</h2>
              <p>带 * 的项目用于确定政策和日期</p>
            </div>
          </div>

          <div className="form-grid">
            <label className="field field-wide">
              <span>员工工作地 *</span>
              <select value={city} onChange={(event) => changeCity(event.target.value)}>
                {CITY_POLICIES.map((item) => (
                  <option value={item.city} key={item.city}>
                    {item.city} · {item.province}（{item.tier}）
                  </option>
                ))}
              </select>
            </label>

            <label className="check-field field-wide">
              <input
                type="checkbox"
                aria-label="已确认符合法律法规规定生育"
                checked={lawfulBirthConfirmed}
                onChange={(event) => setLawfulBirthConfirmed(event.target.checked)}
              />
              <span>
                <strong>已确认符合法律法规规定生育</strong>
                <small>地方延长生育假通常以此为前提；未确认时仅计算国家基础部分。</small>
              </span>
            </label>

            <label className="field">
              <span>产假开始日 *</span>
              <input
                type="date"
                value={startDate}
                onChange={(event) => setStartDate(event.target.value)}
              />
            </label>

            <label className="field">
              <span>分娩 / 预计分娩日 *</span>
              <input
                type="date"
                value={birthDate}
                onChange={(event) => setBirthDate(event.target.value)}
              />
            </label>

            <fieldset className="field field-wide segmented-field">
              <legend>分娩情况</legend>
              <div className="segmented-control">
                {([
                  ["standard", "顺产"],
                  ["dystocia", "难产"],
                  ["cesarean", "剖宫产"],
                ] as const).map(([value, label]) => (
                  <label key={value}>
                    <input
                      type="radio"
                      name="deliveryType"
                      value={value}
                      checked={deliveryType === value}
                      onChange={() => setDeliveryType(value)}
                    />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            {deliveryType !== "standard" && (
              <label className="check-field field-wide">
                <input
                  type="checkbox"
                  aria-label="已取得符合当地口径的医疗证明"
                  checked={medicalProof}
                  onChange={(event) => setMedicalProof(event.target.checked)}
                />
                <span>
                  <strong>已取得符合当地口径的医疗证明</strong>
                  <small>仅勾选“难产”或“剖宫产”不足以自动审批增加假。</small>
                </span>
              </label>
            )}

            <label className="field">
              <span>本次生育胎数</span>
              <select
                value={childCount}
                onChange={(event) => setChildCount(Number(event.target.value))}
              >
                <option value={1}>1 胎</option>
                <option value={2}>双胞胎</option>
                <option value={3}>三胞胎</option>
                <option value={4}>四胞胎</option>
              </select>
            </label>

            <label className="field">
              <span>这是第几个子女</span>
              <select
                value={parity}
                onChange={(event) =>
                  setParity(Number(event.target.value) as 1 | 2 | 3)
                }
              >
                <option value={1}>一孩</option>
                <option value={2}>二孩</option>
                <option value={3}>三孩</option>
              </select>
            </label>

            {policy.localLeave.kind === "range" && (
              <label className="field field-wide range-field">
                <span>
                  单位确定的总产假天数
                  <b>{selectedLocalDays + 98}天</b>
                </span>
                <input
                  type="range"
                  min={policy.localLeave.minDays}
                  max={policy.localLeave.maxDays}
                  value={selectedLocalDays}
                  onChange={(event) => setSelectedLocalDays(Number(event.target.value))}
                />
                <small>
                  当地法定区间：{policy.localLeave.minDays + 98}—
                  {policy.localLeave.maxDays + 98}天
                </small>
              </label>
            )}

            {policy.localLeave.kind === "total_range" && (
              <label className="field field-wide range-field">
                <span>
                  单位制度确定的产假总期
                  <b>{selectedLocalDays}天</b>
                </span>
                <input
                  type="range"
                  min={policy.localLeave.minTotalDays}
                  max={policy.localLeave.maxTotalDays}
                  value={selectedLocalDays}
                  onChange={(event) => setSelectedLocalDays(Number(event.target.value))}
                />
                <small>
                  福建法定区间：{policy.localLeave.minTotalDays}—
                  {policy.localLeave.maxTotalDays}天；请依据本单位成文制度选择。
                </small>
              </label>
            )}

            {policy.conditionalBonus && (
              <label className="check-field field-wide">
                <input
                  type="checkbox"
                  aria-label={policy.conditionalBonus.label}
                  checked={prePregnancyExam}
                  onChange={(event) => setPrePregnancyExam(event.target.checked)}
                />
                <span>
                  <strong>{policy.conditionalBonus.label}</strong>
                  <small>{policy.conditionalBonus.note}</small>
                </span>
              </label>
            )}

            {policy.thirdChildApprovalDays && parity === 3 && (
              <label className="check-field field-wide">
                <input
                  type="checkbox"
                  aria-label="三孩增加假已获用人单位同意"
                  checked={optionalLeaveApproved}
                  onChange={(event) => setOptionalLeaveApproved(event.target.checked)}
                />
                <span>
                  <strong>三孩增加假已获用人单位同意</strong>
                  <small>四川三孩经本人申请、用人单位同意，可再增加30天。</small>
                </span>
              </label>
            )}

            {policy.breastfeedingBonusMonths && (
              <label className="check-field field-wide">
                <input
                  type="checkbox"
                  aria-label="已取得爱婴医院纯母乳喂养证明"
                  checked={pureBreastfeedingProof}
                  onChange={(event) => setPureBreastfeedingProof(event.target.checked)}
                />
                <span>
                  <strong>已取得爱婴医院纯母乳喂养证明</strong>
                  <small>可增加“一个月”，但日期边界仍需当地口径复核。</small>
                </span>
              </label>
            )}

            {policy.employerApprovedExtraMonthsMax && (
              <label className="field field-wide">
                <span>用人单位已同意的额外假期</span>
                <select
                  value={employerApprovedExtraMonths}
                  onChange={(event) =>
                    setEmployerApprovedExtraMonths(Number(event.target.value))
                  }
                >
                  <option value={0}>未批准 / 不计入</option>
                  {Array.from(
                    { length: policy.employerApprovedExtraMonthsMax },
                    (_, index) => index + 1,
                  ).map((months) => (
                    <option value={months} key={months}>{months}个月</option>
                  ))}
                </select>
              </label>
            )}

            <label className="field field-wide optional-field">
              <span>员工申请天数（可选）</span>
              <div className="input-suffix">
                <input
                  type="number"
                  min={1}
                  max={500}
                  value={requestedDays || ""}
                  onChange={(event) => setRequestedDays(Number(event.target.value))}
                />
                <span>天</span>
              </div>
            </label>
          </div>

          <div className="policy-snapshot">
            <div>
              <span>适用政策</span>
              <strong>{policy.province}现行口径</strong>
            </div>
            <div>
              <span>生效日期</span>
              <strong>{policy.effectiveFrom}</strong>
            </div>
            <div>
              <span>核验状态</span>
              <strong className={policy.status === "已核验" ? "verified" : "review"}>
                {policy.status}
              </strong>
            </div>
          </div>
        </aside>

        <section className="result-panel" aria-live="polite">
          <div className="panel-heading result-heading">
            <span className="step-number">02</span>
            <div>
              <h2>核算结果</h2>
              <p>{city} · {deliveryType === "standard" ? "顺产" : deliveryType === "cesarean" ? "剖宫产" : "难产"} · {childCount === 1 ? "单胎" : `${childCount}胞胎`}</p>
            </div>
            <span className={`result-status ${requiresManualReview ? "manual" : ""}`}>
              {requiresManualReview ? "需人工复核" : "可自动核算"}
            </span>
          </div>

          {historicalMismatch && (
            <div className="alert alert-warning">
              分娩日期早于当前政策版本生效日。本首版暂不自动套用历史版本，请人工复核后再审批。
            </div>
          )}

          <div className="date-hero">
            <div className="date-card primary-date">
              <span>法定休假最后一天</span>
              <strong>{formatChineseDate(result.endDate)}</strong>
              <small>从 {formatChineseDate(startDate)} 起连续计算</small>
            </div>
            <div className="date-arrow" aria-hidden="true">→</div>
            <div className="date-card return-date">
              <span>预计返岗日期</span>
              <strong>{formatChineseDate(result.returnDate)}</strong>
              <small>已按标准双休和已公布调休顺延</small>
            </div>
          </div>

          <div className="summary-strip">
            <div>
              <span>法规表达</span>
              <strong>{result.statutoryLabel}</strong>
            </div>
            <div>
              <span>本次自然日跨度</span>
              <strong>{result.elapsedCalendarDays}天</strong>
            </div>
            <div>
              <span>适用政策层级</span>
              <strong>国家 + {policy.province}</strong>
            </div>
          </div>

          {requiresManualReview && (
            <div className="decision-card review-gate">
              <span className="decision-icon">!</span>
              <div>
                <strong>当前结果不可直接自动审批</strong>
                <p>
                  日期仍作为运营推算展示；请先完成下方复核事项，再形成最终审批结论。
                </p>
                <ul>
                  {historicalMismatch && (
                    <li>分娩日期早于本工具收录的现行政策版本生效日。</li>
                  )}
                  {result.reviewReasons.map((reason) => (
                    <li key={reason}>{reason}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {decision && (
            <div className={`decision-card ${decision.status}`}>
              <span className="decision-icon">{decision.status === "over" ? "!" : "✓"}</span>
              <div>
                <strong>
                  {decision.status === "over" ? "申请超过法定范围" : "申请未超过法定范围"}
                </strong>
                <p>
                  员工申请 {decision.requestedDays} 天。
                  {decision.status === "over"
                    ? `按本次${requiresManualReview ? "运营推算" : "核算"}的自然日跨度比较，超出 ${decision.overBy} 天；超出部分不能直接按法定产假审批。`
                    : "可继续核对申请起止日期及证明材料。"}
                </p>
              </div>
            </div>
          )}

          <section className="breakdown-section">
            <div className="section-title">
              <h3>逐段计算</h3>
              <span>起始日计为第 1 天</span>
            </div>
            <ol className="timeline">
              {result.segments.map((segment, index) => (
                <li key={segment.id}>
                  <span className="timeline-index">{String(index + 1).padStart(2, "0")}</span>
                  <div className="timeline-body">
                    <div className="timeline-row">
                      <strong>{segment.label}</strong>
                      <b>{formatDuration(segment.value, segment.unit)}</b>
                    </div>
                    <p>
                      {formatChineseDate(segment.startDate)} — {formatChineseDate(segment.endDate)}
                    </p>
                    <small>{countModeLabel(segment.countMode)}</small>
                    {segment.note && <small>{segment.note}</small>}
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section className="sources-section">
            <div className="section-title">
              <h3>政策依据</h3>
              <span>点击打开官方原文</span>
            </div>
            <div className="source-list">
              {policy.sources.map((source, index) => (
                <a href={source.url} target="_blank" rel="noreferrer" key={source.id}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <strong>{source.title}</strong>
                    <small>{source.issuer} · {source.article}</small>
                  </div>
                  <b aria-hidden="true">↗</b>
                </a>
              ))}
            </div>
          </section>

          {result.warnings.length > 0 && (
            <section className="review-notes">
              <h3>审批复核提示</h3>
              <ul>
                {result.warnings.map((warning) => (
                  <li key={warning}>{warning}</li>
                ))}
              </ul>
            </section>
          )}
        </section>
      </div>

      <footer>
        <p>
          本工具用于企业内部初步核算，不替代主管部门解释、法律意见或企业制度审批。
        </p>
        <p>版本 v0.1 · 20 城政策样本</p>
      </footer>
    </main>
  );
}
