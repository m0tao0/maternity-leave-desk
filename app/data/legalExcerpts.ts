import type {
  CalculatedSegment,
  CityPolicy,
  DeliveryType,
  Source,
} from "../lib/maternity";

export type LegalExcerpt = {
  label: "天数依据" | "计算口径" | "执行口径" | "适用条件" | "确定方式";
  quote: string;
};

type SegmentExcerptMap = Record<string, LegalExcerpt[]>;

export type SegmentLegalCitation = {
  excerpt: LegalExcerpt;
  source: Source;
};

const EXCERPTS_BY_SOURCE: Record<string, SegmentExcerptMap> = {
  national_619: {
    national_base: [
      {
        label: "天数依据",
        quote: "女职工生育享受98天产假，其中产前可以休假15天。",
      },
    ],
    prenatal_leave: [
      {
        label: "天数依据",
        quote: "女职工生育享受98天产假，其中产前可以休假15天。",
      },
    ],
    birth_anchored_leave: [
      {
        label: "天数依据",
        quote: "女职工生育享受98天产假，其中产前可以休假15天。",
      },
    ],
    difficult_birth: [
      {
        label: "天数依据",
        quote: "难产的，增加产假15天。",
      },
    ],
    multiple_birth: [
      {
        label: "天数依据",
        quote: "生育多胞胎的，每多生育1个婴儿，增加产假15天。",
      },
    ],
  },
  shanghai_regulation: {
    local_leave: [
      {
        label: "天数依据",
        quote:
          "符合法律法规规定生育的夫妻，女方除享受国家规定的产假外，还可以再享受生育假六十天。",
      },
    ],
  },
  shanghai_counting: {
    local_leave: [
      {
        label: "计算口径",
        quote:
          "生育假一般应当与产假合并连续使用，享受产假同等待遇。……增加的婚假、生育假、配偶陪产假，遇法定节假日顺延。",
      },
    ],
  },
  shanghai_base_counting: {
    national_base: [
      {
        label: "计算口径",
        quote: "产假（顺产、难产、多胎、流产）：休息日包含，法定假日包含。",
      },
    ],
  },
  beijing_regulation: {
    local_leave: [
      {
        label: "天数依据",
        quote: "女方除享受国家规定的产假外，享受延长生育假六十日。",
      },
    ],
    employer_approved_extra: [
      {
        label: "适用条件",
        quote: "女方经所在……组织同意，可以再增加假期一至三个月。",
      },
    ],
  },
  beijing_counting: {
    local_leave: [
      {
        label: "计算口径",
        quote: "产假为连续假期，包括公休日和法定节假日。",
      },
    ],
  },
  guangdong_leave: {
    local_leave: [
      {
        label: "天数依据",
        quote: "女职工依照《广东省人口与计划生育条例》的规定享受80日奖励假。",
      },
      {
        label: "计算口径",
        quote: "假期原则上应一次性连续安排……遇法定休假日、休息日的，均不另加假期天数。",
      },
    ],
  },
  guangdong_women: {
    difficult_birth: [
      {
        label: "天数依据",
        quote: "生育时遇有难产的，增加30天产假。",
      },
    ],
    multiple_birth: [
      {
        label: "天数依据",
        quote: "生育多胞胎的，每多生育1个婴儿，增加15天产假。",
      },
    ],
  },
  sichuan_regulation: {
    local_leave: [
      {
        label: "天数依据",
        quote: "符合本条例规定生育子女的夫妻，除国家规定外，延长女方生育假九十日。",
      },
    ],
    third_child_approved: [
      {
        label: "适用条件",
        quote: "生育第三个子女的女方，经本人申请及所在单位同意，还可以再延长生育假三十日。",
      },
    ],
  },
  sichuan_guidance: {
    local_leave: [
      {
        label: "计算口径",
        quote: "2025年11月28日（含）之后生育……适用现行规定。……生育假应当一次性休完，不能分开休。",
      },
    ],
  },
  sichuan_breastfeeding: {
    breastfeeding_bonus: [
      {
        label: "天数依据",
        quote: "实行纯母乳喂养的女职工增加一个月产假，产假视为出勤。",
      },
      {
        label: "适用条件",
        quote: "凭爱婴医院出具的纯母乳喂养产假证明。",
      },
    ],
  },
  zhejiang_insurance: {
    birth_anchored_leave: [
      {
        label: "天数依据",
        quote: "一孩再增加产假60天；二孩、三孩再增加产假90天。",
      },
    ],
    difficult_birth: [
      {
        label: "天数依据",
        quote: "难产的，增加产假15天。",
      },
    ],
    multiple_birth: [
      {
        label: "天数依据",
        quote: "生育多胞胎的，每多生育1个婴儿，增加产假15天。",
      },
    ],
  },
  zhejiang_counting: {
    prenatal_leave: [
      {
        label: "计算口径",
        quote: "妇女产假的期限自生育之日起按照自然日计算，包含国家法定节假日、休息日和职业假。",
      },
    ],
    birth_anchored_leave: [
      {
        label: "计算口径",
        quote: "妇女产假的期限自生育之日起按照自然日计算，包含国家法定节假日、休息日和职业假。",
      },
    ],
  },
  chongqing_regulation: {
    local_leave: [
      {
        label: "天数依据",
        quote: "符合法律法规规定生育的女职工，在国家规定产假的基础上增加产假80日。",
      },
    ],
  },
  chongqing_counting: {
    local_leave: [
      {
        label: "计算口径",
        quote: "符合规定的女职工产假按自然天数计算，含法定节假日。",
      },
    ],
    cesarean_birth: [
      {
        label: "适用条件",
        quote: "“难产”指产钳助产、胎吸、剖宫生育。",
      },
    ],
  },
  hubei_faq: {
    local_leave: [
      {
        label: "天数依据",
        quote: "符合法律法规规定生育的妇女，除享受国家规定的产假外，增加产假60天。",
      },
      {
        label: "计算口径",
        quote: "自批准休假之日起按照自然日连续计算，包含国家法定节假日、休息日。",
      },
    ],
  },
  hubei_cesarean: {
    cesarean_birth: [
      {
        label: "适用条件",
        quote: "剖腹产按照难产休假。",
      },
    ],
  },
  jiangsu_regulation: {
    local_leave: [
      {
        label: "天数依据",
        quote: "女方在享受国家规定产假的基础上，延长产假不少于三十天。",
      },
      {
        label: "计算口径",
        quote: "国家法定休假日不计入前两款规定的假期。",
      },
    ],
  },
  jiangsu_158: {
    local_leave: [
      {
        label: "天数依据",
        quote: "在享受国家规定产假的基础上，延长产假60天，达到158天。",
      },
    ],
  },
  jiangsu_counting: {
    local_leave: [
      {
        label: "计算口径",
        quote: "延长产假60天，达到158天。国家法定休假日不计入延长产假假期。",
      },
    ],
  },
  jiangsu_special_current: {
    cesarean_birth: [
      {
        label: "适用条件",
        quote: "难产/剖宫产：增加15天。",
      },
    ],
  },
  shaanxi_regulation: {
    local_leave: [
      {
        label: "天数依据",
        quote: "在国家规定产假的基础上增加产假六十天。",
      },
    ],
    pre_pregnancy_exam: [
      {
        label: "天数依据",
        quote: "女职工参加孕前检查的，在国家规定产假的基础上增加产假十天。",
      },
    ],
    third_child: [
      {
        label: "天数依据",
        quote: "女职工生育三孩的，在前款规定的产假基础上增加产假十五天。",
      },
    ],
  },
  shaanxi_guidance: {
    local_leave: [
      {
        label: "计算口径",
        quote: "产假和延长产假一次性休完，原则上不拆分。……产假含公休日和国家法定假日。",
      },
    ],
    pre_pregnancy_exam: [
      {
        label: "适用条件",
        quote: "凭卫健部门指定的县级及以上医疗卫生机构出具的检查证明享受延长产假待遇。",
      },
    ],
  },
  shaanxi_women: {
    cesarean_birth: [
      {
        label: "适用条件",
        quote: "难产或者实施剖宫产手术分娩的，增加产假15天。",
      },
    ],
  },
  tianjin_measures: {
    local_leave: [
      {
        label: "天数依据",
        quote: "在享受国家规定的生育假（产假）的基础上增加生育假（产假）六十日。",
      },
      {
        label: "计算口径",
        quote: "生育假（产假）为自然日，包括法定节假日和休息日。……生育假（产假）一般应当连续使用。",
      },
    ],
  },
  tianjin_dystocia: {
    cesarean_birth: [
      {
        label: "适用条件",
        quote: "难产主要包括产钳助产、胎头吸引术、臀位助娩和剖宫产。无医学指征，因社会、个人因素由职工个人要求实施的剖宫产除外。",
      },
    ],
  },
  henan_regulation: {
    local_leave: [
      {
        label: "天数依据",
        quote: "符合法律、法规规定生育子女的，除国家规定的产假外，增加产假三个月。",
      },
    ],
  },
  zhengzhou_188: {
    local_leave: [
      {
        label: "执行口径",
        quote: "可享受延长产假90天的生育津贴，合计188天。",
      },
    ],
  },
  henan_women: {
    difficult_birth: [
      {
        label: "适用条件",
        quote: "难产或者实施剖宫产手术分娩的，增加产假15天。",
      },
    ],
  },
  hunan_regulation: {
    local_leave: [
      {
        label: "天数依据",
        quote: "符合法定生育条件的夫妻，女方除享受国家规定的产假外增加产假六十天。",
      },
    ],
  },
  hunan_women: {
    difficult_birth: [
      {
        label: "天数依据",
        quote: "难产的，增加产假15天。",
      },
    ],
    multiple_birth: [
      {
        label: "天数依据",
        quote: "生育多胞胎的，每多生育一个婴儿，增加产假15天。",
      },
    ],
  },
  anhui_regulation: {
    local_leave: [
      {
        label: "天数依据",
        quote: "女方在享受国家规定产假基础上，延长产假六十天。",
      },
    ],
  },
  anhui_guidance: {
    national_base: [
      {
        label: "计算口径",
        quote: "产假包含休息日，不包含国家法定休假日。",
      },
    ],
    local_leave: [
      {
        label: "计算口径",
        quote: "产假原则上连续使用，包含休息日，不包含国家法定休假日。",
      },
    ],
    difficult_birth: [
      {
        label: "计算口径",
        quote: "产假包含休息日，不包含国家法定休假日。",
      },
    ],
    multiple_birth: [
      {
        label: "计算口径",
        quote: "产假包含休息日，不包含国家法定休假日。",
      },
    ],
  },
  anhui_women: {
    difficult_birth: [
      {
        label: "适用条件",
        quote: "难产或者实施剖宫产手术分娩的，增加产假15天。",
      },
    ],
  },
  shandong_regulation: {
    local_leave: [
      {
        label: "天数依据",
        quote: "除国家规定的产假外，女职工增加六十日产假。",
      },
    ],
  },
  shandong_guidance: {
    national_base: [
      {
        label: "计算口径",
        quote: "国家法定节假日、休息日计入产假假期。",
      },
    ],
    local_leave: [
      {
        label: "计算口径",
        quote: "国家法定节假日、休息日计入产假假期。",
      },
    ],
    difficult_birth: [
      {
        label: "计算口径",
        quote: "国家法定节假日、休息日计入产假假期。",
      },
    ],
    multiple_birth: [
      {
        label: "计算口径",
        quote: "国家法定节假日、休息日计入产假假期。",
      },
    ],
  },
  fujian_regulation: {
    total_leave: [
      {
        label: "天数依据",
        quote: "符合本条例生育子女的夫妻，女方产假延长为一百五十八日至一百八十日。",
      },
    ],
  },
  fujian_women: {
    total_leave: [
      {
        label: "确定方式",
        quote: "女职工产假为一百五十八天至一百八十天，具体天数由用人单位规定。",
      },
    ],
  },
  fujian_faq: {
    total_leave: [
      {
        label: "执行口径",
        quote: "可由用工单位与申请人协商解决，但最低不得少于158天。",
      },
      {
        label: "计算口径",
        quote: "原则上应一次性休完，与法定节假日、公休假、教师寒暑假重合的不顺延。",
      },
    ],
  },
};

export function getLegalExcerpts(
  sourceId: string,
  segmentId: string,
  variantId?: string,
): LegalExcerpt[] {
  const excerpts = EXCERPTS_BY_SOURCE[sourceId];
  if (!excerpts) return [];
  return [
    ...(excerpts[segmentId] ?? []),
    ...(variantId && variantId !== segmentId ? (excerpts[variantId] ?? []) : []),
  ];
}

export function getSegmentLegalCitations(
  policy: CityPolicy,
  segment: CalculatedSegment,
  deliveryType: DeliveryType,
): SegmentLegalCitation[] {
  const sourceIds = ["national_base", "prenatal_leave"].includes(segment.id)
    ? [...new Set([...segment.sourceIds, ...policy.localSourceIds])]
    : segment.sourceIds;
  const variantId =
    segment.id === "difficult_birth" && deliveryType === "cesarean"
      ? "cesarean_birth"
      : undefined;

  return sourceIds.flatMap((sourceId) => {
    const source = policy.sources.find((item) => item.id === sourceId);
    if (!source) return [];
    if (
      sourceId === "national_619" &&
      segment.id === "difficult_birth" &&
      segment.value !== 15
    ) {
      return [];
    }
    return getLegalExcerpts(sourceId, segment.id, variantId).map((excerpt) => ({
      excerpt,
      source,
    }));
  });
}
