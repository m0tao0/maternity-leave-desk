# 产假逐段计算法规精简原文（国家、北京、上海、广东、四川、浙江）

核验日期：2026-08-11
适用代码：`app/data/policies.ts`、`app/lib/maternity.ts`
用途：为每个 `CalculatedSegment.id` 提供可直接展示的精简原文、文件信息和原文链接。

> 展示原则：页面只展示实际参与本次计算的段；下列引文均保留原意并尽量缩短。法规未明示的计算口径不得包装成“法规原文”。

## 1. 全国共同段

| segment id | 适用段 | source id | 文件 / 条款 / 发布机关 | 页面精简原文 | 官方原文 |
|---|---|---|---|---|---|
| `national_base`、`difficult_birth`、`multiple_birth` | 98天；难产+15天；每多1婴+15天 | `national_619` | 《女职工劳动保护特别规定》第七条；国务院令第619号；国务院 | “女职工生育享受98天产假……难产的，增加产假15天；生育多胞胎的，每多生育1个婴儿，增加产假15天。” | [国家行政法规库](https://xzfg.moj.gov.cn/front/law/detail?LawID=343&Query=) |

建议把 `NATIONAL_SOURCE.url` 从司法部旧页面替换为上表国家行政法规库链接；两者均为司法部官方来源，但法规库链接当前更稳定。

风险边界：第七条只写“难产”，没有写“所有剖宫产均属于难产”。因此 `deliveryType === "cesarean"` 不宜仅凭员工勾选自动认定；无地方明文时，应要求医疗机构的生育医学证明或出院小结明确记载“难产”。

## 2. 北京

| segment id | 适用段 | source id | 文件 / 条款 / 发布机关 | 页面精简原文 | 官方原文 |
|---|---|---|---|---|---|
| `local_leave` | 延长生育假60日 | `beijing_regulation` | 《北京市人口与计划生育条例》第十九条；北京市人大常委会公告〔十五届〕第65号；北京市人大常委会 | “女方除享受国家规定的产假外，享受延长生育假六十日。” | [北京市人社局政策文件指引 PDF，第197页](https://rsj.beijing.gov.cn/xxgk/tzgg/202203/P020220314332312298605.pdf) |
| `employer_approved_extra` | 经单位同意增加1—3个月 | `beijing_regulation` | 同上，第十九条 | “女方经所在……组织同意，可以再增加假期一至三个月。” | [同一官方 PDF，第197页](https://rsj.beijing.gov.cn/xxgk/tzgg/202203/P020220314332312298605.pdf) |
| 全部连续自然日段 | 包含公休日、法定节假日 | `beijing_counting` | 《职工可享受哪些假期？》；北京市人力资源和社会保障局 | “产假为连续假期，包括公休日和法定节假日。” | [北京市人社局](https://rsj.beijing.gov.cn/xwsl/mtgz/201912/t20191206_935576.html) |

补充核验：北京市卫健委2026年官方页面再次写明“女方延长产假至158天，难产增加产假15天，生育多胞胎每多生育一个婴儿增加产假15天”。可作为结果摘要的较新佐证：[北京市卫生健康委员会](https://wjw.beijing.gov.cn/xwzx_20031/jcdt/202604/t20260424_4607899.html)。

注意：`beijing_counting` 页面正文仍出现历史的128天总数，只可截取“连续假期”这一句，不可把该页旧总数展示为现行标准。

## 3. 上海

| segment id | 适用段 | source id | 文件 / 条款 / 发布机关 | 页面精简原文 | 官方原文 |
|---|---|---|---|---|---|
| `local_leave` | 生育假60天 | `shanghai_regulation` | 《上海市人口与计划生育条例》第三十一条；上海市人大常委会 | “女方除享受国家规定的产假外，还可以再享受生育假六十天。” | [上海市人民政府](https://www.shanghai.gov.cn/jcsfbrkcqjhfzzh/20230621/c440fb200a9b48da87aed931e369792f.html) |
| `local_leave` | 与产假合并连续使用；法定节假日顺延 | `shanghai_counting` | 《上海市计划生育奖励与补助若干规定》第二条；沪府规〔2022〕18号；上海市人民政府 | “生育假一般应当与产假合并连续使用……遇法定节假日顺延。” | [上海市人民政府](https://www.shanghai.gov.cn/zjfcsj/20250709/87151565cd6246c99854c129797d178c_af4.html) |
| `national_base`、`difficult_birth`、`multiple_birth` | 国家段含休息日和法定假日 | 建议新增 `shanghai_base_counting` | 《女职工产假一览表》；上海市人力资源和社会保障局 | “产假（顺产、难产、多胎、流产）：休息日包含，法定假日包含。” | [上海市人社局](https://rsj.sh.gov.cn/tmsztc_17502/20200617/t0035_1379441.html) |

页面计算口径应拆开显示：国家98天及难产/多胞胎增加段按连续自然日；上海60天生育假含休息日，遇国家法定节假日顺延。

剖宫产边界：上海市人社局只明确“医疗机构出具的《生育医学证明》或出院小结上注明为难产的，增加15天”。因此剖宫产应在医疗材料注明难产后才走 `difficult_birth`：[上海市人社局《女职工产假一览表》](https://rsj.sh.gov.cn/tmsztc_17502/20200617/t0035_1379441.html)。

## 4. 广东（广州、深圳、东莞、佛山）

| segment id | 适用段 | source id | 文件 / 条款 / 发布机关 | 页面精简原文 | 官方原文 |
|---|---|---|---|---|---|
| `national_base`、`difficult_birth`、`multiple_birth`、`local_leave` | 98天；难产+30天；每多1婴+15天；奖励假80天 | `guangdong_leave` | 《广东省职工假期待遇和死亡抚恤待遇规定》第六点；粤人社规〔2023〕17号；广东省人社厅 | “产假98天……难产的增加30天；多胞胎每多1婴增加15天……女职工享受80天奖励假。” | [广东省人民政府公报](https://www.gd.gov.cn/zwgk/gongbao/2023/27/content/post_4264561.html) |
| 全部连续自然日段 | 一次性连续；法休、休息日不另加 | `guangdong_leave` | 同上，第九点 | “假期原则上应一次性连续安排……遇法定休假日、休息日的，均不另加假期天数。” | [广东省人民政府公报](https://www.gd.gov.cn/zwgk/gongbao/2023/27/content/post_4264561.html) |
| `difficult_birth`、`multiple_birth` | 难产+30；每多1婴+15 | `guangdong_women` | 广东省实施《女职工劳动保护特别规定》办法第十一条；广东省政府令第227号；广东省人民政府 | “生育时遇有难产的，增加30天产假；生育多胞胎的，每多生育1个婴儿，增加15天产假。” | [广东省妇女儿童工作委员会](https://www.pwccw.gd.gov.cn/dfzc/content/post_1138898.html) |

剖宫产边界：省级现行条文写“难产”，未直接写“所有剖宫产”。广州旧实施办法曾明确“难产（剖腹产、会阴Ⅲ度破裂）另加30天”，但不宜外推至全部广东城市；广东全省案件仍建议以医疗机构是否认定难产为准。广州原文：[广东省人民政府门户网站](https://www.gd.gov.cn/zwgk/wjk/zcfgk/content/post_2724264.html?jump=false)。

## 5. 四川（成都）

| segment id | 适用段 | source id | 文件 / 条款 / 发布机关 | 页面精简原文 | 官方原文 |
|---|---|---|---|---|---|
| `local_leave` | 延长生育假90日 | `sichuan_regulation` | 关于修改《四川省人口与计划生育条例》的决定，第二十四条；四川省人大常委会 | “符合本条例规定生育子女的夫妻，除国家规定外，延长女方生育假九十日。” | [四川人大网](https://www.scspc.gov.cn/jyjd/202512/t20251203_49669.html) |
| `third_child_approved` | 三孩经申请及单位同意+30日 | `sichuan_regulation` | 同上，第二十四条 | “生育第三个子女的女方，经本人申请及所在单位同意，还可以再延长生育假三十日。” | [四川人大网](https://www.scspc.gov.cn/jyjd/202512/t20251203_49669.html) |
| `local_leave` | 新规适用节点；一次性休完 | `sichuan_guidance` | 《关于〈四川省人口与计划生育条例〉实施中有关假期规定适用问题的指导意见》第二部分；四川省卫健委、四川省人社厅 | “2025年11月28日（含）之后生育……适用现行……生育假应当一次性休完，不能分开休。” | [四川省人社厅](https://rst.sc.gov.cn/rst/gsgg/2025/12/1/5ca3491446f24a28977142077e12a8e6.shtml) |
| `breastfeeding_bonus` | 纯母乳喂养增加1个月 | `sichuan_breastfeeding` | 《四川省〈中华人民共和国母婴保健法〉实施办法》第二十四条及省卫健委官方答复；四川省人大常委会、四川省卫健委 | “实行纯母乳喂养的女职工增加一个月产假，产假视为出勤。” | [四川省卫生健康委员会](https://wsjkw.sc.gov.cn/scwsjkw/hd1/lyxd/2023/4/4/37d0276f03444bd3a341dae391992d6a.shtml) |

纯母乳证明的页面补充短句可用：“凭爱婴医院出具的纯母乳喂养产假证明”。同一省卫健委答复明确该材料要求。

计算风险：省级现行90日条文及适用指导意见没有明文写“法定节假日是否顺延”。`calendar_days` 只能展示为“按连续自然日运营推算，需人工复核”，不能冒充法规原文。四川省内乐山市卫健委答复称产假包含双休日和法定节假日，但它是市级答复，不足以单独作为成都全省统一口径：[乐山市卫生健康委员会](https://www.leshan.gov.cn/lsswszf/xlxxx/3086951.html)。

## 6. 浙江（杭州、宁波）

| segment id | 适用段 | source id | 文件 / 条款 / 发布机关 | 页面精简原文 | 官方原文 |
|---|---|---|---|---|---|
| `birth_anchored_leave`、`local_leave` | 一孩+60；二孩、三孩+90 | `zhejiang_insurance` | 《浙江省生育保险办法》第三部分第（四）项；浙政发〔2024〕15号；浙江省人民政府 | “一孩再增加产假60天；二孩、三孩再增加产假90天。” | [浙江省人民政府公报 PDF，第15页](https://zjjcmspublic.oss-cn-hangzhou-zwynet-d01-a.internet.cloud.zj.gov.cn/jcms_files/jcms1/web3096/site/attach/0/910dece4c74d4f78b239305f375aeb78.pdf) |
| `difficult_birth`、`multiple_birth` | 难产+15；每多1婴+15 | `zhejiang_insurance` | 同上 | “难产的，增加产假15天；生育多胞胎的，每多生育1个婴儿，增加产假15天。” | [同一官方 PDF，第15页](https://zjjcmspublic.oss-cn-hangzhou-zwynet-d01-a.internet.cloud.zj.gov.cn/jcms_files/jcms1/web3096/site/attach/0/910dece4c74d4f78b239305f375aeb78.pdf) |
| `difficult_birth`、`multiple_birth` | 同一特殊增加段的省政府规章依据 | `zhejiang_women` | 《浙江省女职工劳动保护办法》第十四条；浙江省政府令第355号（经第402号令修正）；浙江省人民政府 | “难产的，增加产假15天；生育多胞胎的，每多生育1个婴儿，增加产假15天。” | [浙江省人民政府公报 PDF，第13页](https://zjjcmspublic.oss-cn-hangzhou-zwynet-d01-a.internet.cloud.zj.gov.cn/jcms_files/jcms1/web3241/site/attach/0/72a5ae30dc8b4c158501dadd836b91fc.pdf) |
| `prenatal_leave`、`birth_anchored_leave` | 从生育日锚定；按自然日；包含法休/休息日/职业假 | 建议新增 `zhejiang_counting` | 《浙江省人口与计划生育条例》有关问题解答；浙江省卫生健康委员会 | “妇女产假的期限自生育之日起按照自然日计算，包含国家法定节假日、休息日和职业假。” | [“健康浙江”发布全文（浙江在线）](https://zjnews.zjol.com.cn/zjnews/202111/t20211130_23430318_ext.shtml) |

浙江多胞胎存在官方答复内部张力：同一问题解答一方面称难产、多胞胎增加假“可以叠加享受”，另一方面又称双胞胎、三胞胎“可以享受188天产假”。因此多胞胎案件必须保留人工复核提示，不能仅凭计算结果自动审批。

剖宫产边界：现行省政府规章只写“难产”，没有把所有剖宫产直接等同难产；同样应以医疗材料认定为准。

## 7. 建议的应用绑定清单

| `segment.id` | 首选 excerpt source ids |
|---|---|
| `national_base` | `national_619`；上海另加 `shanghai_base_counting` |
| `difficult_birth` | `national_619` + 对应地方源；剖宫产需显示医疗认定提示 |
| `multiple_birth` | `national_619` + 对应地方源；浙江显示人工复核提示 |
| `local_leave` | 北京 `beijing_regulation`；上海 `shanghai_regulation` + `shanghai_counting`；广东 `guangdong_leave`；四川 `sichuan_regulation` + `sichuan_guidance`；浙江 `zhejiang_insurance` + `zhejiang_counting` |
| `prenatal_leave`、`birth_anchored_leave` | `national_619` + `zhejiang_insurance` + `zhejiang_counting` |
| `employer_approved_extra` | `beijing_regulation` |
| `third_child_approved` | `sichuan_regulation` |
| `breastfeeding_bonus` | `sichuan_breastfeeding` |

## 8. 实施前必须处理的证据问题

1. 不要把“剖宫产”在所有辖区无条件映射成难产增加假；应增加医疗证明确认门槛。
2. 四川90日的节假日计算为运营推算，页面必须标“需人工复核”。
3. 浙江多胞胎仍应人工复核；不要把冲突答复静默处理成自动审批。
4. 浙江锚定/自然日口径的直接全文目前为省卫健委署名、健康浙江发布的官方问题解答镜像；建议后续找到省卫健委自身存档链接后替换。
5. 北京连续日来源正文含旧的128天历史口径，只引用计算口径句，不引用旧总天数。
