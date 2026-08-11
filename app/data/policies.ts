import type { CityPolicy, Source } from "../lib/maternity";

const VERIFIED_ON = "2026-08-11";

const NATIONAL_SOURCE: Source = {
  id: "national_619",
  title: "《女职工劳动保护特别规定》",
  issuer: "国务院令第619号",
  article: "第七条",
  url: "https://xzfg.moj.gov.cn/front/law/detail?LawID=343&Query=",
};

type JurisdictionPolicy = Omit<CityPolicy, "city" | "tier">;

function cities(
  policy: JurisdictionPolicy,
  values: Array<[string, "一线" | "二线"]>,
): CityPolicy[] {
  return values.map(([city, tier]) => ({ ...policy, city, tier }));
}

const beijing: JurisdictionPolicy = {
  province: "北京市",
  effectiveFrom: "2021-11-26",
  verifiedOn: VERIFIED_ON,
  status: "已核验",
  baseDays: 98,
  localLeave: { kind: "fixed", days: 60, countMode: "calendar_days" },
  dystociaDays: 15,
  cesareanDays: 15,
  multipleBirthDaysPerAdditionalChild: 15,
  employerApprovedExtraMonthsMax: 3,
  localSourceIds: ["beijing_regulation", "beijing_counting"],
  notes: [
    "经用人单位同意可再增加1—3个月，该部分不是无条件法定基线；本工具只有在录入批准月数时才计入。",
  ],
  sources: [
    NATIONAL_SOURCE,
    {
      id: "beijing_regulation",
      title: "《北京市人口与计划生育条例》",
      issuer: "北京市人大常委会",
      article: "第十九条",
      url: "https://rsj.beijing.gov.cn/xxgk/tzgg/202203/P020220314332312298605.pdf",
    },
    {
      id: "beijing_counting",
      title: "北京市产假连续计算口径",
      issuer: "北京市人力资源和社会保障局",
      article: "产假包含公休日、法定节假日",
      url: "https://rsj.beijing.gov.cn/xwsl/mtgz/201912/t20191206_935576.html",
    },
  ],
};

const shanghai: JurisdictionPolicy = {
  province: "上海市",
  effectiveFrom: "2021-11-25",
  verifiedOn: VERIFIED_ON,
  status: "已核验",
  baseDays: 98,
  localLeave: {
    kind: "fixed",
    days: 60,
    countMode: "calendar_days_excluding_statutory_holidays",
  },
  dystociaDays: 15,
  cesareanDays: 15,
  multipleBirthDaysPerAdditionalChild: 15,
  localSourceIds: [
    "shanghai_regulation",
    "shanghai_counting",
    "shanghai_base_counting",
  ],
  notes: [
    "分段计算：国家98天及难产/多胞胎增加段按自然日；地方60天含周末，遇国家法定节假日顺延。",
  ],
  sources: [
    NATIONAL_SOURCE,
    {
      id: "shanghai_regulation",
      title: "《上海市人口与计划生育条例》",
      issuer: "上海市人大常委会",
      article: "第三十一条",
      url: "https://www.shanghai.gov.cn/jcsfbrkcqjhfzzh/20230621/c440fb200a9b48da87aed931e369792f.html",
    },
    {
      id: "shanghai_counting",
      title: "《上海市计划生育奖励与补助若干规定》",
      issuer: "上海市人民政府",
      article: "第二条、第二十条（沪府规〔2022〕18号）",
      url: "https://www.shanghai.gov.cn/zjfcsj/20250709/87151565cd6246c99854c129797d178c_af4.html",
    },
    {
      id: "shanghai_base_counting",
      title: "上海市女职工产假一览表",
      issuer: "上海市人力资源和社会保障局",
      article: "国家产假段计数口径",
      url: "https://rsj.sh.gov.cn/tmsztc_17502/20200617/t0035_1379441.html",
    },
  ],
};

const guangdong: JurisdictionPolicy = {
  province: "广东省",
  effectiveFrom: "2023-07-01",
  verifiedOn: VERIFIED_ON,
  status: "已核验",
  baseDays: 98,
  localLeave: { kind: "fixed", days: 80, countMode: "calendar_days" },
  dystociaDays: 30,
  cesareanDays: 30,
  multipleBirthDaysPerAdditionalChild: 15,
  localSourceIds: ["guangdong_women", "guangdong_leave"],
  notes: [
    "广东将难产增加假提高为30天；奖励假原则一次性连续安排，周末和法定节假日不顺延。",
    "广州夫妻间调整奖励假须有双方及用人单位同意材料，首版按女方80天默认口径计算。",
  ],
  sources: [
    NATIONAL_SOURCE,
    {
      id: "guangdong_women",
      title: "广东省实施《女职工劳动保护特别规定》办法",
      issuer: "广东省人民政府",
      article: "第十一条",
      url: "https://www.pwccw.gd.gov.cn/dfzc/content/post_1138898.html",
    },
    {
      id: "guangdong_leave",
      title: "广东省婚假产假等假期实施工作的通知",
      issuer: "广东省人力资源和社会保障厅等",
      article: "第六、九点（粤人社规〔2023〕17号）",
      url: "https://www.gd.gov.cn/zwgk/gongbao/2023/27/content/post_4264561.html",
    },
  ],
};

const sichuan: JurisdictionPolicy = {
  province: "四川省",
  effectiveFrom: "2025-11-28",
  verifiedOn: VERIFIED_ON,
  status: "需人工复核",
  baseDays: 98,
  localLeave: { kind: "fixed", days: 90, countMode: "calendar_days" },
  dystociaDays: 15,
  cesareanDays: 15,
  multipleBirthDaysPerAdditionalChild: 15,
  thirdChildApprovalDays: 30,
  breastfeedingBonusMonths: 1,
  localSourceIds: ["sichuan_regulation", "sichuan_guidance", "sichuan_breastfeeding"],
  notes: [
    "2025年11月28日起通常为188天；现行文件没有明确90天生育假是否排除法定节假日，本次按连续自然日作运营推算。",
    "三孩经本人申请、单位同意可增加30天；纯母乳喂养凭爱婴医院证明可增加一个月。",
  ],
  sources: [
    NATIONAL_SOURCE,
    {
      id: "sichuan_regulation",
      title: "关于修改《四川省人口与计划生育条例》的决定",
      issuer: "四川省人大常委会",
      article: "第二十四条",
      url: "https://www.scspc.gov.cn/jyjd/202512/t20251203_49669.html",
    },
    {
      id: "sichuan_guidance",
      title: "《四川省人口与计划生育条例》假期适用指导意见",
      issuer: "四川省人社厅、四川省卫健委",
      article: "第二部分",
      url: "https://rst.sc.gov.cn/rst/gsgg/2025/12/1/5ca3491446f24a28977142077e12a8e6.shtml",
    },
    {
      id: "sichuan_breastfeeding",
      title: "纯母乳喂养增加产假官方答复",
      issuer: "四川省卫生健康委员会",
      article: "母婴保健法实施办法第二十四条",
      url: "https://wsjkw.sc.gov.cn/scwsjkw/hd1/lyxd/2023/4/4/37d0276f03444bd3a341dae391992d6a.shtml",
    },
  ],
};

const zhejiang: JurisdictionPolicy = {
  province: "浙江省",
  effectiveFrom: "2021-11-25",
  verifiedOn: VERIFIED_ON,
  status: "已核验",
  baseDays: 98,
  birthDateAnchored: true,
  localLeave: {
    kind: "by_parity",
    firstChildDays: 60,
    laterChildDays: 90,
    countMode: "calendar_days",
  },
  dystociaDays: 15,
  cesareanDays: 15,
  multipleBirthDaysPerAdditionalChild: 15,
  localSourceIds: ["zhejiang_insurance", "zhejiang_women", "zhejiang_counting"],
  notes: [
    "浙江延长产假自生育日起计算；产前已休时必须以实际或预计生育日锚定。",
    "浙江关于多胞胎最终总天数的公开表述存在张力，多胞胎案件需当地经办部门复核。",
  ],
  sources: [
    NATIONAL_SOURCE,
    {
      id: "zhejiang_insurance",
      title: "《浙江省生育保险办法》",
      issuer: "浙江省人民政府",
      article: "产假计发规则",
      url: "https://zjjcmspublic.oss-cn-hangzhou-zwynet-d01-a.internet.cloud.zj.gov.cn/jcms_files/jcms1/web3096/site/attach/0/910dece4c74d4f78b239305f375aeb78.pdf",
    },
    {
      id: "zhejiang_women",
      title: "《浙江省女职工劳动保护办法》",
      issuer: "浙江省人民政府",
      article: "第十四条",
      url: "https://zjjcmspublic.oss-cn-hangzhou-zwynet-d01-a.internet.cloud.zj.gov.cn/jcms_files/jcms1/web3241/site/attach/0/72a5ae30dc8b4c158501dadd836b91fc.pdf",
    },
    {
      id: "zhejiang_counting",
      title: "《浙江省人口与计划生育条例》有关问题解答",
      issuer: "浙江省卫生健康委员会（健康浙江发布）",
      article: "产假计算口径",
      url: "https://zjnews.zjol.com.cn/zjnews/202111/t20211130_23430318_ext.shtml",
    },
  ],
};

const chongqing: JurisdictionPolicy = {
  province: "重庆市",
  effectiveFrom: "2021-11-25",
  verifiedOn: VERIFIED_ON,
  status: "已核验",
  baseDays: 98,
  localLeave: { kind: "fixed", days: 80, countMode: "calendar_days" },
  dystociaDays: 15,
  cesareanDays: 15,
  multipleBirthDaysPerAdditionalChild: 15,
  localSourceIds: ["chongqing_regulation", "chongqing_counting"],
  notes: ["难产须以生产医院意见为准；各增加项可累计。"],
  sources: [
    NATIONAL_SOURCE,
    {
      id: "chongqing_regulation",
      title: "《重庆市人口与计划生育条例》及政策解读",
      issuer: "重庆市人民政府",
      article: "第二十三条",
      url: "https://www.cq.gov.cn/zwgk/zfxxgkzl/fdzdgknr/zdmsxx/shbz/shbz_ssqk/202112/t20211207_10094718.html",
    },
    {
      id: "chongqing_counting",
      title: "重庆市产假自然日计算口径",
      issuer: "重庆市人力资源和社会保障局",
      article: "包含法定节假日",
      url: "https://rlsbj.cq.gov.cn/zwgk_182/zfxxgkml/zcwj_145360/jfxzgfxwj/201512/t20151210_6925971.html",
    },
  ],
};

const hubei: JurisdictionPolicy = {
  province: "湖北省",
  effectiveFrom: "2021-11-26",
  verifiedOn: VERIFIED_ON,
  status: "已核验",
  baseDays: 98,
  localLeave: { kind: "fixed", days: 60, countMode: "calendar_days" },
  dystociaDays: 15,
  cesareanDays: 15,
  multipleBirthDaysPerAdditionalChild: 15,
  localSourceIds: ["hubei_faq", "hubei_cesarean"],
  notes: ["自批准休假之日起按自然日连续计算，包含国家法定节假日和休息日。"],
  sources: [
    NATIONAL_SOURCE,
    {
      id: "hubei_faq",
      title: "《湖北省人口与计划生育条例》有关问题解答",
      issuer: "湖北省卫生健康委员会",
      article: "第一、二问",
      url: "https://wjw.hubei.gov.cn/bmdt/ztzl/zwzsk/zczsk/jhsy/202112/t20211210_3907554.shtml",
    },
    {
      id: "hubei_cesarean",
      title: "湖北省产假政策公开信回复",
      issuer: "武汉市卫生健康委员会",
      article: "剖腹产按照难产休假",
      url: "https://www.wuhan.gov.cn/hdjl/lxgs/202204/t20220427_1963220.shtml",
    },
  ],
};

const jiangsu: JurisdictionPolicy = {
  province: "江苏省",
  effectiveFrom: "2022-02-10",
  verifiedOn: VERIFIED_ON,
  status: "已核验",
  baseDays: 98,
  localLeave: {
    kind: "fixed",
    days: 60,
    countMode: "calendar_days_excluding_statutory_holidays",
  },
  dystociaDays: 15,
  cesareanDays: 15,
  multipleBirthDaysPerAdditionalChild: 15,
  localSourceIds: [
    "jiangsu_regulation",
    "jiangsu_158",
    "jiangsu_counting",
    "jiangsu_special_current",
  ],
  notes: [
    "分段计算：国家98天及特殊增加段按自然日；江苏延长60天包含周末，但国家法定休假日不计入。",
  ],
  sources: [
    NATIONAL_SOURCE,
    {
      id: "jiangsu_regulation",
      title: "《江苏省人口与计划生育条例》",
      issuer: "江苏省人大常委会",
      article: "第二十四条",
      url: "https://www.jsrd.gov.cn/qwfb/sjfg/202109/t20210930_1221202.shtml",
    },
    {
      id: "jiangsu_158",
      title: "江苏省158天产假执行说明",
      issuer: "苏州市人力资源和社会保障局",
      article: "苏发〔2022〕8号适用说明",
      url: "https://hrss.suzhou.gov.cn/jsszhrss/zcwd/202403/bad53ef63a02456f94ba0dd0fac6b718.shtml",
    },
    {
      id: "jiangsu_counting",
      title: "江苏延长产假节假日计算解释",
      issuer: "苏州市人民政府",
      article: "地方延长段排除法定休假日",
      url: "https://hrss.suzhou.gov.cn/jsszhrss/zcwd/202203/28454ef8c59f4fbd91eeb59f2da07adf.shtml",
    },
    {
      id: "jiangsu_special_current",
      title: "苏州市生育津贴与产假天数提示",
      issuer: "苏州市人民政府",
      article: "难产、剖宫产及多胞胎增加天数",
      url: "https://www.suzhou.gov.cn/szsrmzf/mszx/202607/c32ceda38b034a68aa22250e9def8ccf.shtml",
    },
  ],
};

const shaanxi: JurisdictionPolicy = {
  province: "陕西省",
  effectiveFrom: "2022-05-25",
  verifiedOn: VERIFIED_ON,
  status: "已核验",
  baseDays: 98,
  localLeave: { kind: "fixed", days: 60, countMode: "calendar_days" },
  dystociaDays: 15,
  cesareanDays: 15,
  multipleBirthDaysPerAdditionalChild: 15,
  thirdChildDays: 15,
  conditionalBonus: {
    id: "pre_pregnancy_exam",
    label: "已取得孕前检查证明",
    days: 10,
    countMode: "calendar_days",
    note: "须为指定县级以上医疗卫生机构出具的检查证明。",
  },
  localSourceIds: ["shaanxi_regulation", "shaanxi_guidance", "shaanxi_women"],
  notes: ["产假一次性休完、原则不拆分，包含公休日和国家法定假日。"],
  sources: [
    NATIONAL_SOURCE,
    {
      id: "shaanxi_regulation",
      title: "《陕西省人口与计划生育条例》",
      issuer: "陕西省人大常委会",
      article: "第四十五条",
      url: "https://www.shaanxi.gov.cn/zfxxgk/zcwjk/dfxfg/202402/t20240226_2320584.html",
    },
    {
      id: "shaanxi_guidance",
      title: "陕西省三孩生育政策配套措施指导意见",
      issuer: "陕西省卫生健康委员会",
      article: "第五、六项",
      url: "https://www.shaanxi.gov.cn/zfxxgk/zcwjk/szfbm_14999/qtwj_15009/202208/t20220831_2249166.html",
    },
    {
      id: "shaanxi_women",
      title: "《陕西省实施女职工劳动保护特别规定》",
      issuer: "陕西省人民政府",
      article: "第十四条",
      url: "https://www.shaanxi.gov.cn/zfxxgk/fdzdgknr/zcwj/nszfgz/202208/t20220804_2233087.html",
    },
  ],
};

const tianjin: JurisdictionPolicy = {
  province: "天津市",
  effectiveFrom: "2021-11-29",
  verifiedOn: VERIFIED_ON,
  status: "已核验",
  baseDays: 98,
  localLeave: { kind: "fixed", days: 60, countMode: "calendar_days" },
  dystociaDays: 15,
  cesareanDays: 15,
  multipleBirthDaysPerAdditionalChild: 15,
  localSourceIds: ["tianjin_measures", "tianjin_dystocia"],
  notes: [
    "难产须符合产钳、胎吸、臀位助娩或有医学指征剖宫产等当地认定；个人自行要求剖宫产不当然适用。",
  ],
  sources: [
    NATIONAL_SOURCE,
    {
      id: "tianjin_measures",
      title: "天津市婚假生育假等假期休假实施办法",
      issuer: "天津市人民政府办公厅",
      article: "第三、五、十三条（津政办规〔2022〕9号）",
      url: "https://www.tj.gov.cn/zwgk/szfwj/tjsrmzfbgt/202205/t20220520_5886520.html",
    },
    {
      id: "tianjin_dystocia",
      title: "天津市难产认定政策问答",
      issuer: "天津市人力资源和社会保障局",
      article: "难产医学范围",
      url: "https://hrss.tj.gov.cn/WZWSREL3poZW5nbWluaHVkb25nL3dkay96Y3dkLzIwMjQxMC90MjAyNDEwMjNfNjc1OTQwMi5odG1s",
    },
  ],
};

const henan: JurisdictionPolicy = {
  province: "河南省（郑州口径）",
  effectiveFrom: "2021-11-27",
  verifiedOn: VERIFIED_ON,
  status: "已核验",
  baseDays: 98,
  localLeave: { kind: "fixed", days: 90, countMode: "calendar_days" },
  dystociaDays: 15,
  cesareanDays: 15,
  multipleBirthDaysPerAdditionalChild: 15,
  localSourceIds: ["henan_regulation", "zhengzhou_188", "henan_women"],
  notes: [
    "省条例原文为增加“三个月”，郑州市政府公开执行口径按90天、合计188天；周末和节假日按连续自然日作运营默认。",
  ],
  sources: [
    NATIONAL_SOURCE,
    {
      id: "henan_regulation",
      title: "《河南省人口与计划生育条例》",
      issuer: "河南省人大常委会（郑州卫健官方全文）",
      article: "第二十五条",
      url: "https://hj.jiceng.zhengzhou.gov.cn/021005001/7984833.jhtml",
    },
    {
      id: "zhengzhou_188",
      title: "郑州市产假188天官方答复",
      issuer: "郑州市人民政府",
      article: "地方奖励90天执行口径",
      url: "https://public.zhengzhou.gov.cn/D1101X/8738656.jhtml",
    },
    {
      id: "henan_women",
      title: "《河南省女职工劳动保护特别规定》",
      issuer: "河南省人民政府",
      article: "第十一条",
      url: "https://www.moj.gov.cn/pub/sfbgw/flfggz/flfggzdfzwgz/201903/t20190313_142466.html",
    },
  ],
};

const hunan: JurisdictionPolicy = {
  province: "湖南省",
  effectiveFrom: "2021-12-03",
  verifiedOn: VERIFIED_ON,
  status: "已核验",
  baseDays: 98,
  localLeave: { kind: "fixed", days: 60, countMode: "calendar_days" },
  dystociaDays: 15,
  cesareanDays: 15,
  multipleBirthDaysPerAdditionalChild: 15,
  localSourceIds: ["hunan_regulation", "hunan_women"],
  notes: [
    "现行条文未重新明确节假日口径；本次沿用连续自然日运营口径，争议个案建议向长沙人社或卫健部门复核。",
    "2025年文件仅鼓励有条件单位延长至188天，不作为无条件法定基线。",
  ],
  sources: [
    NATIONAL_SOURCE,
    {
      id: "hunan_regulation",
      title: "《湖南省人口与计划生育条例》",
      issuer: "湖南省人大常委会",
      article: "第十六条",
      url: "https://wjw.hunan.gov.cn/wjw/xxgk/zcfg/dfxfg/202502/t20250226_33596385.html",
    },
    {
      id: "hunan_women",
      title: "《湖南省女职工劳动保护特别规定》",
      issuer: "湖南省人民政府",
      article: "第八条",
      url: "https://www.hunan.gov.cn/hnszf/xxgk/zfgz/202110/20737345/files/3cca9bb233b34dd590c5ab55d2e1a019.pdf",
    },
  ],
};

const anhui: JurisdictionPolicy = {
  province: "安徽省",
  effectiveFrom: "2022-01-01",
  verifiedOn: VERIFIED_ON,
  status: "已核验",
  baseDays: 98,
  baseCountMode: "calendar_days_excluding_statutory_holidays",
  localLeave: {
    kind: "fixed",
    days: 60,
    countMode: "calendar_days_excluding_statutory_holidays",
  },
  dystociaDays: 15,
  cesareanDays: 15,
  multipleBirthDaysPerAdditionalChild: 15,
  localSourceIds: ["anhui_regulation", "anhui_guidance", "anhui_women"],
  notes: [
    "全段原则连续，周末计入，但《全国年节及纪念日放假办法》规定的法定节日本日不计入；调休形成的连休日仍计入。",
  ],
  sources: [
    NATIONAL_SOURCE,
    {
      id: "anhui_regulation",
      title: "《安徽省人口与计划生育条例》",
      issuer: "安徽省人大常委会",
      article: "第三十二条",
      url: "https://flk.npc.gov.cn/detail?fileId=&id=ff8081817dc2ae9c017dc610f0840730&title=%E5%AE%89%E5%BE%BD%E7%9C%81%E4%BA%BA%E5%8F%A3%E4%B8%8E%E8%AE%A1%E5%88%92%E7%94%9F%E8%82%B2%E6%9D%A1%E4%BE%8B&type=",
    },
    {
      id: "anhui_guidance",
      title: "安徽省人口与计划生育条例实施指导意见",
      issuer: "安徽省卫生健康委员会（官方镜像）",
      article: "假期计算口径",
      url: "https://wsjkw.tl.gov.cn/tlswsjkwyh/c00010/1686672897484840960/uEJKzTD9.pdf",
    },
    {
      id: "anhui_women",
      title: "《安徽省女职工劳动保护特别规定》",
      issuer: "安徽省人民政府",
      article: "第十条",
      url: "https://www.ahlx.gov.cn/Livelihood/show/6985.html",
    },
  ],
};

const shandong: JurisdictionPolicy = {
  province: "山东省",
  effectiveFrom: "2025-01-18",
  verifiedOn: VERIFIED_ON,
  status: "已核验",
  baseDays: 98,
  localLeave: { kind: "fixed", days: 60, countMode: "calendar_days" },
  dystociaDays: 15,
  cesareanDays: 15,
  multipleBirthDaysPerAdditionalChild: 15,
  localSourceIds: ["shandong_regulation", "shandong_guidance"],
  notes: ["国家法定节假日和休息日均计入产假，按连续自然日计算。"],
  sources: [
    NATIONAL_SOURCE,
    {
      id: "shandong_regulation",
      title: "《山东省人口与计划生育条例》现行文本说明",
      issuer: "山东省卫生健康委员会官方发布",
      article: "第二十六条",
      url: "https://www.jinan.gov.cn/col/col118356/art/2026/art_294f88b7131b454bb39c378754d1549d.html",
    },
    {
      id: "shandong_guidance",
      title: "山东省人口与计划生育条例假期指导意见",
      issuer: "山东省卫生健康委员会等",
      article: "鲁卫人口家庭字〔2025〕3号",
      url: "https://ws.zibo.gov.cn/gongkai/channel_c_5f9fa491ab327f36e4c13061_n_1605682450.3131/doc_67a5b11e0c81719cbf7171e4_c40bf8efdc4f89fdb726fece655ac213.pdf",
    },
  ],
};

const fujian: JurisdictionPolicy = {
  province: "福建省",
  effectiveFrom: "2022-03-30",
  verifiedOn: VERIFIED_ON,
  status: "需人工复核",
  baseDays: 98,
  localLeave: {
    kind: "total_range",
    minTotalDays: 158,
    maxTotalDays: 180,
    countMode: "calendar_days",
  },
  dystociaDays: 0,
  cesareanDays: 0,
  difficultBirthMode: "included_in_total",
  multipleBirthDaysPerAdditionalChild: 15,
  multipleBirthMode: "manual",
  localSourceIds: [
    "fujian_regulation",
    "fujian_women",
    "fujian_faq",
    "fujian_difficult",
  ],
  notes: [
    "福建产假总期由用人单位在158—180天内确定；未录入单位口径时不得给出唯一审批结论。",
    "按福建条例执行158—180天时，难产不再另加15天；多胞胎能否在总区间外叠加缺少明确现行省级口径。",
    "周末和法定节假日暂按连续自然日推算，但现行省级一手文件未明确该口径。",
  ],
  sources: [
    NATIONAL_SOURCE,
    {
      id: "fujian_regulation",
      title: "《福建省人口与计划生育条例》",
      issuer: "福建省人大常委会",
      article: "第二十四条",
      url: "https://www.fujian.gov.cn/zwgk/flfg/dfxfg/202204/t20220420_5896105.htm",
    },
    {
      id: "fujian_women",
      title: "《福建省女职工劳动保护条例》",
      issuer: "福建省人大常委会",
      article: "第十三条",
      url: "https://fujian.gov.cn/zwgk/flfg/dfxfg/202003/t20200326_5222995.htm",
    },
    {
      id: "fujian_faq",
      title: "福建省158—180天产假执行问答",
      issuer: "福建省卫生健康委员会",
      article: "由单位协商确定，最低158天",
      url: "https://wjw.fujian.gov.cn/xxgk/fgwj/zcjd/bmzcjd/201603/t20160303_2372710.htm",
    },
    {
      id: "fujian_difficult",
      title: "难产是否有增加天数？",
      issuer: "福建省人力资源和社会保障厅",
      article: "政策问答",
      url: "https://rst.fujian.gov.cn/wz/cjwt/ldgx/xxxj/202311/t20231113_6295379.htm",
    },
  ],
};

export const CITY_POLICIES: CityPolicy[] = [
  ...cities(beijing, [["北京", "一线"]]),
  ...cities(shanghai, [["上海", "一线"]]),
  ...cities(guangdong, [
    ["广州", "一线"],
    ["深圳", "一线"],
  ]),
  ...cities(sichuan, [["成都", "二线"]]),
  ...cities(zhejiang, [["杭州", "二线"]]),
  ...cities(chongqing, [["重庆", "二线"]]),
  ...cities(hubei, [["武汉", "二线"]]),
  ...cities(jiangsu, [["苏州", "二线"]]),
  ...cities(shaanxi, [["西安", "二线"]]),
  ...cities(jiangsu, [["南京", "二线"]]),
  ...cities(tianjin, [["天津", "二线"]]),
  ...cities(henan, [["郑州", "二线"]]),
  ...cities(hunan, [["长沙", "二线"]]),
  ...cities(guangdong, [["东莞", "二线"]]),
  ...cities(zhejiang, [["宁波", "二线"]]),
  ...cities(guangdong, [["佛山", "二线"]]),
  ...cities(anhui, [["合肥", "二线"]]),
  ...cities(shandong, [["青岛", "二线"]]),
  ...cities(fujian, [["厦门", "二线"]]),
];
