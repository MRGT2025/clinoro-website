export const dailyBlogPosts20261008 = [
  {
    id: "clinoro-daily-radiotherapy-linac-igrt-procurement-acceptance-2026",
    slug: "radiotherapy-linac-igrt-procurement-acceptance-2026",
    title: "مگاولتاژ بیشتر، درمان بهتر نیست؛ ۱۲ آزمون خرید Linac و IGRT",
    excerpt:
      "شتاب‌دهنده خطی را با تعداد انرژی، Dose rate یا نام تکنیک نخرید. این راهنمای جهانی ۱۲ آزمون برای Bunker، Beam data، MLC، IGRT، TPS، DICOM‑RT، Commissioning، SLA و هزینه هر فراکشن ارائه می‌کند.",
    content: `تعداد انرژی بیشتر، Dose rate بالاتر یا فهرست طولانی‌تری از IMRT، VMAT و SRS به‌تنهایی مرکز رادیوتراپی بهتری نمی‌سازد. آنچه باید بخرید یک «سامانه درمان قابل‌اندازه‌گیری» است: شتاب‌دهنده خطی، MLC، تخت و ابزار تصویربرداری؛ به‌علاوه TPS، Oncology Information System و Record & Verify، دزیمتری، Bunker، برق و سرمایش، شبکه، آموزش، QA و خدماتی که همه با یکدیگر کار کنند.

[IEC 60601‑2‑1:2020](https://webstore.iec.ch/en/publication/31388) برای شتاب‌دهنده‌های الکترونی پزشکی ۱ تا ۵۰ MeV، ایمنی پایه و عملکرد ضروری را پوشش می‌دهد و علاوه بر Type test، Site test را نیز در دامنه دارد. برای تصویربرداری هدایت‌شده درمان، [IEC 60601‑2‑68:2025](https://webstore.iec.ch/en/publication/67429) از ۴ فوریه ۲۰۲۵ جایگاه تازه‌ای دارد: kV و MV imaging، IGRT آفلاین، آنلاین و Real-time و ارتباط میان اجزای تصویربرداری و درمان را پوشش می‌دهد. بنابراین عبارت فروشنده که «دستگاه IGRT دارد» بدون پیکربندی، نسخه، آزمون و Workflow دقیق قابل پذیرش نیست.

> این مقاله چارچوب خرید و پذیرش فنی است؛ نسخه‌نویسی درمان، محاسبه حفاظ، Commissioning بالینی یا مجوز شروع درمان نیست. این فعالیت‌ها باید زیر نظر فیزیک‌پزشک، متخصص رادیوانکولوژی، مسئول حفاظت پرتویی و افراد واجد صلاحیت و با رعایت مقررات محل انجام شوند.

## پیش از RFP، دامنه بالینی را به ظرفیت قابل‌تحویل تبدیل کنید

ابتدا بنویسید مرکز قرار است چه بیمارانی را با چه تکنیک‌هایی درمان کند: 3D‑CRT، Electron، IMRT، VMAT، SRS/SBRT، FFF، Gating یا Adaptive workflow. برای هرکدام Site، حجم و پیچیدگی بیمار، تعداد فراکشن روزانه، زمان تصویربرداری و Setup، Peak hour، نیاز بیهوشی یا Immobilization و برنامه زمان خرابی را مشخص کنید.

سپس ظرفیت را با «فراکشن تکمیل‌شده و قابل‌تأیید» بسنجید؛ نه با کمترین Beam-on time. دستگاهی که Arc را سریع تحویل می‌دهد اما Setup، CBCT، Registration، انتقال Plan یا Recovery آن کند است، ظرفیت وعده‌داده‌شده را در Workflow واقعی نمی‌سازد.

## ۱۲ آزمون خرید و پذیرش Linac و IGRT

### ۱. Clinical scope و ظرفیت را روی یک ماتریس قفل کنید

برای هر تکنیک، Energy، Field size، MLC، Couch، Imaging، Immobilization، TPS algorithm، QA tool، License و Training لازم را یک‌جا ثبت کنید. عبارت‌هایی مانند «SRS ready»، «Adaptive capable» یا «Full IGRT» باید به Use case، Option و آزمون قبولی تبدیل شوند.

سناریوی روز پرترافیک را شبیه‌سازی کنید: Warm-up و QA روزانه، Patient setup، Imaging، Registration، Correction، Delivery، Record و Room turnover. زمان‌ها را در بیماران ساده و پیچیده جدا بگیرید و ظرفیت را پس از کسر PM، QA، تعطیلی و Unplanned downtime محاسبه کنید.

### ۲. مدل، نسخه و شواهد انطباق را دقیقاً تطبیق دهید

نام تجاری خانواده کافی نیست. Label، Intended use، Hardware revision، Software build، MLC، Imaging chain، Couch و Accessory پیشنهادشده را با Certificate، Declaration، Test report، مجوز بازار و سابقه اقدام اصلاحی همان پیکربندی مقایسه کنید.

[FDA شتاب‌دهنده خطی پزشکی را با Product code IYE در Class II و ذیل 21 CFR 892.5050 طبقه‌بندی می‌کند](https://www.accessdata.fda.gov/scripts/cdrh/cfdocs/cfpcd/classification.cfm?ID=IYE) و در فهرست استانداردهای مرتبط آن، IEC 60601‑2‑1، IEC 60976، IEC 61217، IEC 62083 و IEC 62274 دیده می‌شود. این مثال آمریکایی جای الزامات بازار شما را نمی‌گیرد؛ اما نشان می‌دهد ادعای کلی «دارای IEC» بدون شماره، ویرایش، دامنه و مدل واقعی ارزش قراردادی ندارد.

[FDA ویرایش دوم IEC 60601‑2‑68:2025 را در ۲۶ مه ۲۰۲۵ شناسایی کرده است](https://www.accessdata.fda.gov/scripts/cdrh/cfdocs/cfstandards/detail.cfm?standard__identification_no=46150) و برای ویرایش قبلی دوره گذار تا ۲ ژوئیه ۲۰۲۸ اعلام می‌کند. در RFP روشن کنید پیشنهاد با کدام ویرایش و کدام گزارش همان Config پشتیبانی می‌شود.

### ۳. BOM، Option و License را پیش از مقایسه قیمت ببندید

Gantry، RF chain، Waveguide، Magnet، Electron gun، Target، Energy، Dose rate، MLC، Jaws، Couch، EPID، kV source/detector، CBCT، Gating، Camera، Console، Workstation، UPS، Chiller، Compressor، QA kit و همه لوازم Immobilization را با Part number ثبت کنید.

در نرم‌افزار نیز تعداد Concurrent user، TPS modules، Algorithms، OIS، Record & Verify، DICOM services، Offline review، Auto-registration، Deformable registration، Motion management، Analytics، Backup، Remote support، Cybersecurity update و مدت License را جداگانه بنویسید. Demo license یا Option مدت‌دار نباید در قیمت پایه پنهان بماند.

### ۴. Bunker و زیرساخت را پیش از سفارش تأیید کنید

Layout، Maze، Door، Primary/secondary barrier، Ceiling، Floor، Control area، Cable duct، Equipment room، Chiller، HVAC، Humidity، Power quality، UPS، Generator، Earthing، Network، Fire protection، مسیر ورود و فضای سرویس باید با Config نهایی تطبیق داشته باشند.

محاسبه حفاظ را از فروشنده دستگاه مستقل و با Workload واقعی، Energy، Technique، Occupancy و جهت پرتو بررسی کنید. در Site responsibility matrix دقیقاً مشخص کنید چه کسی Survey، Interlock، Door contact، Emergency-off، Audio/video، Radiation monitor، Water quality، Heat rejection و تست‌های پس از نصب را تحویل می‌دهد. دستگاهی که در Factory خوب کار می‌کند ولی Bunker برای بار حرارتی یا Service clearance آن آماده نیست، پروژه آماده درمان نیست.

### ۵. هندسه، Isocenter و Collision envelope را مکانیکی بسنجید

Gantry، Collimator و Couch را در زوایای قراردادی حرکت دهید؛ Mechanical isocenter، Laser، Optical distance indicator، Couch translation/rotation، Sag، Scale، Brake، Load، Emergency stop و Anti-collision را با ابزار مناسب اندازه بگیرید. Isocenter کوچک روی یک زاویه، عملکرد تمام دامنه را اثبات نمی‌کند.

[IEC 61217](https://www.accessdata.fda.gov/scripts/cdrh/cfdocs/cfStandards/detail.cfm?standard__identification_no=32087) برای Coordinate، حرکت و Scale در تجهیزات رادیوتراپی زبان مشترک می‌سازد. همین مختصات باید میان دستگاه، TPS، Imaging و Record & Verify سازگار باشد. Collision map را برای Couch extension، Immobilization، SRS frame و وضعیت‌های Non-coplanar مستند کنید؛ فقط به Simulation نرم‌افزاری بسنده نکنید.

### ۶. Beam data و دزیمتری را مستقل Baseline کنید

برای همه Energyها و Modeهای قراردادی، Output، Energy quality، PDD یا TPR، Profiles، Flatness/Symmetry، Field size، Output factor، Wedge یا Accessory، Dose rate، Monitor unit linearity، Repeatability و Gantry dependence را اندازه بگیرید. ابزار، Calibration certificate، Setup، Water phantom، Correction، Raw data و Uncertainty budget باید قابل ردیابی باشند.

[نسخه بازنگری‌شده IAEA TRS‑398 که در ۲۰۲۴ منتشر شد](https://www.iaea.org/publications/15048/absorbed-dose-determination-in-external-beam-radiotherapy) چارچوب روزآمد کالیبراسیون Ionization chamber بر حسب Absorbed dose to water و تعیین دز در پرتوهای رادیوتراپی را ارائه می‌کند. یک عدد Output نهایی بدون Chain ردیابی، Conditions، Correction و عدم قطعیت، Baseline نیست.

### ۷. MLC، میدان کوچک و Delivery دینامیک را جداگانه آزمون کنید

Leaf positioning، Repeatability، Transmission، Interleaf leakage، Speed، Acceleration، Leaf-gap behavior، Tongue-and-groove، Carriage shift و Picket-fence را در Static و Dynamic mode بسنجید. برای IMRT و VMAT، Dose rate، Gantry speed و Leaf motion را هم‌زمان و در شرایط نزدیک به Limit آزمایش کنید.

Field کوچک را با Detector نامناسب یا صرفاً با Chamber میدان مرجع نسنجید. [AAPM TG‑155](https://www.aapm.org/pubs/reports/detail.asp?docid=217) محدودیت آشکارسازها و Correction factorهای Small-field dosimetry را توضیح می‌دهد. اگر SRS/SBRT یا FFF در قرارداد است، Output factor، Penumbra، MLC model و Patient-specific QA آن باید پیش از پذیرش بالینی مستقل Baseline شوند.

### ۸. IGRT را به‌عنوان حلقه هندسی کامل تحویل بگیرید

kV/MV imaging، EPID و CBCT را برای Geometric accuracy، Imaging-treatment isocenter coincidence، Image quality، Uniformity، Spatial/contrast resolution، Artifact، Imaging dose، Registration و Couch correction بیازمایید. Phantom را با Shift و Rotation معلوم قرار دهید و زنجیره Acquisition تا Registration، Approval، Correction و Re-image را اجرا کنید.

IEC 60601‑2‑68:2025 فقط خود تصویر را نمی‌بیند؛ ارتباط و وابستگی اجزای IGRT و کاهش خطر اتکای بیش از حد به سامانه را نیز در نظر می‌گیرد. Auto-registration باید امکان Review دستی، Override کنترل‌شده، Audit trail و توقف ایمن داشته باشد. نتیجه یک تصویر CBCT زیبا نیست؛ اثبات این است که Offset معلوم با خطای تعریف‌شده تشخیص و تصحیح می‌شود.

### ۹. Gating و مدیریت حرکت را با Phantom پویا بیازمایید

اگر Respiratory gating، Breath-hold، Tracking یا Triggered imaging می‌خرید، Phase و Amplitude، Latency، Beam-hold، Resume، Interlock، Signal loss، Baseline drift و ارتباط Internal/External surrogate را با Phantom حرکتی و Plan آزمون کنترل کنید.

سناریوهای قطع Camera، قطع شبکه، جابه‌جایی Marker، تنفس نامنظم و Recovery پس از توقف را نیز اجرا کنید. نمایش Waveform روی مانیتور به معنی دقت زمانی کافی نیست. Acceptance criterion باید خطای مکانی/زمانی، حد توقف و رفتار Fail-safe را مشخص کند.

### ۱۰. TPS و Commissioning را با آزمون End-to-end جدا کنید

Acceptance فروشنده پایان پروژه نیست. Beam model، CT calibration، Density override، Heterogeneity، MLC parameters، Small fields، Wedge، Electron، FFF، IMRT/VMAT و Techniqueهای پیچیده باید با داده مستقل Commission شوند. [IAEA TRS‑430](https://www-pub.iaea.org/MTCD/Publications/PDF/TRS430_web.pdf) خرید، پذیرش، Commissioning و QA مستمر TPS را به‌صورت یک چرخه می‌بیند و [IAEA TECDOC‑1583](https://www-pub.iaea.org/MTCD/Publications/PDF/te_1583_web.pdf) مجموعه آزمون‌های عملی برای تکنیک‌های متداول External beam ارائه می‌کند.

حداقل یک زنجیره End-to-end از CT phantom، Contour، Plan، Export، Transfer، Setup، IGRT، Correction، Delivery و Dose measurement بسازید. Expected result، Measurement uncertainty، Action limit و مسئول Approval را از قبل بنویسید. نتیجه Factory یا Golden beam data نباید جای Measurement محلی و Independent verification را بگیرد.

### ۱۱. OIS، Record & Verify و DICOM‑RT را با داده واقعی آزمون کنید

Patient ID، Plan UID، Version، Approval state، Prescription، Fraction، Accessory، Imaging order، Couch correction، Delivered MU، Interrupt/Resume و Treatment record را از TPS تا دستگاه و پرونده برگشتی بررسی کنید. یک Plan اصلاح‌شده نباید کنار نسخه قبلی مبهم بماند یا بدون Approval معتبر قابل تحویل باشد.

[IEC 62274](https://www.accessdata.fda.gov/scripts/cdrh/cfdocs/cfStandards/detail.cfm?standard__identification_no=29957) سامانه Record & Verify را سامانه‌ای می‌داند که داده Setup را وارد و نمایش می‌دهد، می‌تواند Operation را کنترل کند و Treatment session را ثبت کند. DICOM جاری نیز [RT Radiation Set](https://dicom.nema.org/Medical/dicom/current/output/chtml/part03/sect_7.14.5.html) را مجموعه‌ای برای تعریف یک Treatment fraction و [RT Radiation](https://dicom.nema.org/Medical/dicom/current/output/chtml/part03/sect_7.14.6.html) را مجموعه Control pointهای Machine و Positioning در یک Delivery تقسیم‌ناپذیر تعریف می‌کند.

Backup/Restore، Export، Time synchronization، Audit log، Role، Override، Network segmentation، Patch، SBOM، Remote access، Downtime procedure و Disaster recovery را نیز با سناریوی واقعی تست کنید. عبارت DICOM-ready بدون Conformance statement همان Version و تست Round-trip قابل قبول نیست.

### ۱۲. SAT، آموزش، SLA و TCO را به پرداخت وصل کنید

FAT و SAT، Bunker، Safety interlock، هندسه، Beam data، MLC، IGRT، Motion، TPS/OIS، End-to-end، آموزش، Documentation، Punch list و Independent commissioning را Milestoneهای جدا تعریف کنید. شروع درمان باید پس از تأیید افراد مسئول، بسته‌شدن انحراف‌ها و آمادگی Clinical governance باشد؛ نه صرفاً بعد از تحویل کلید اتاق.

SLA را با Uptime، Response، On-site time، Mean time to repair، قطعه، Remote diagnosis، Preventive maintenance، Software support، Cybersecurity patch، Loaner strategy و End-of-support عددی کنید. Lead time اجزای بحرانی مانند RF chain، MLC، Imaging detector، kV source، Couch electronics، Chiller و Workstation را بگیرید. پرداخت نهایی را به Acceptance evidence و بسته‌شدن Punch list متصل کنید.

## ماتریس کوتاه مقایسه پیشنهادها

- دامنه بالینی: Technique و ظرفیت فراکشن واقعی؛ نه تعداد Option روی بروشور.
- هویت: Model، Revision، Hardware و Software منطبق؛ نه Family مشابه.
- زیرساخت: Bunker، Power، HVAC و Service clearance تأییدشده؛ نه Site-ready مبهم.
- دزیمتری: Raw data، Traceability و Uncertainty؛ نه یک عدد Output.
- Delivery: MLC، Dynamic mode و میدان کوچک؛ نه Picket-fence نمایشی.
- IGRT: Image-to-treatment geometry و Correction loop؛ نه صرفاً تصویر CBCT.
- نرم‌افزار: TPS/OIS/R&V و DICOM‑RT انتها‌به‌انتها؛ نه Export دستی.
- خدمت: Uptime، قطعه، Patch و End-of-support؛ نه گارانتی کلی.
- اقتصاد: هزینه هر فراکشن تکمیل‌شده؛ نه کمترین CAPEX.

## شاخص‌هایی که تصمیم را قابل دفاع می‌کنند

**Availability = ساعات آماده درمان ÷ ساعات برنامه‌ریزی‌شده**

**First-pass delivery = فراکشن‌های تکمیل‌شده بدون توقف مرتبط با سامانه ÷ فراکشن‌های شروع‌شده**

**IGRT correction accuracy = اصلاح‌های Phantom در محدوده قبولی ÷ کل سناریوهای آزمون**

**Cost per verified fraction = کل هزینه مالکیت و بهره‌برداری ÷ فراکشن‌های تکمیل و ثبت‌شده**

TCO را شامل دستگاه، Bunker و اصلاح ساختمان، Power/HVAC/Chiller، Dosimetry و QA، TPS/OIS/License، Network و Cybersecurity، Service contract، Spare part، Calibration، Training، Upgrade، Downtime، Staffing و Decommissioning محاسبه کنید. Throughput بروشوری را بدون Setup، IGRT، Registration، QA، Cleaning، Re-plan و توقف وارد مدل نکنید.

## پرونده‌ای که هنگام تحویل باید بگیرید

- URS، Clinical matrix، ظرفیت و Workflow مصوب
- Label/IFU، Model/Revision، مجوز و گزارش استانداردهای قابل‌اعمال
- BOM، Serial، Energy، MLC، IGRT، Couch، Software و License
- محاسبه حفاظ، Site survey، برق، HVAC، Chiller و Interlock report
- Tool inventory، Calibration certificate و Uncertainty budget
- Mechanical، Beam، MLC، IGRT، Motion و Imaging baseline
- TPS beam model، Commissioning report و End-to-end evidence
- DICOM Conformance statement و TPS/OIS/R&V integration report
- Backup/Restore، Cybersecurity، Remote access و Downtime procedure
- FAT، SAT، Punch list، Change control و Approval signatures
- Training، Competency، PM/QC schedule و Action limits
- SLA، قطعات، Update roadmap، End-of-support و Decommissioning plan

## دوازده علامت توقف خرید

SRS-ready بدون Config، گزارش استاندارد مدل دیگر، Bunker بدون Workload، Energy بدون Beam data، MLC بدون Dynamic test، میدان کوچک بدون Detector مناسب، IGRT بدون Isocenter coincidence، Gating بدون Latency test، TPS با Golden data فقط، DICOM با USB، Backup بدون Restore و SLA بدون Lead time دوازده دلیل روشن برای توقف‌اند.

## جمع‌بندی

Linac بهتر دستگاهی نیست که بیشترین انرژی، سریع‌ترین Arc یا بلندترین فهرست Option را دارد. انتخاب بهتر سامانه‌ای است که برای دامنه بالینی مرکز اندازه مناسب دارد؛ Bunker و زیرساخت آن آماده‌اند؛ هندسه، Beam، MLC، IGRT و Motion را با داده مستقل اثبات می‌کند؛ TPS، OIS و DICOM‑RT آن End-to-end کار می‌کنند؛ و برای قطعه، Patch، Downtime و پایان عمر پاسخ قراردادی دارد.

برای تدوین URS، مقایسه فنی پیشنهادها، Site-readiness، طراحی FAT/SAT، Beam/IGRT acceptance matrix، Integration checklist، SLA و مدل هزینه هر فراکشن، از [خدمات تأمین Clinoro](/procurement) شروع کنید یا [Clinical scope، حجم فراکشن، پلان Bunker و پیشنهادهای فروشندگان را برای بررسی ارسال کنید](/contact). خروجی می‌تواند یک Decision Pack شامل ماتریس فنی، پروتکل پذیرش، Risk register، برنامه Commissioning و TCO باشد.`,
    image: "/assets/blog/radiotherapy-linac-igrt-procurement-acceptance-2026.webp",
    category: "جهانی؛ رادیوتراپی، Linac، IGRT و پذیرش فنی",
    author: "تیم مهندسی پزشکی Clinoro",
    publishedAt: "2026-10-08",
    publishedTime: "2026-10-08T08:00:00+03:30",
    published: true,
    seoTitle: "خرید Linac و IGRT؛ ۱۲ آزمون پذیرش رادیوتراپی",
    seoDescription:
      "راهنمای خرید Linac و IGRT؛ ۱۲ آزمون برای Bunker، Beam data، MLC، دزیمتری، IGRT، TPS، DICOM‑RT، Commissioning، SLA و TCO.",
    keywords: [
      "خرید شتاب‌دهنده خطی رادیوتراپی",
      "آزمون پذیرش Linac",
      "خرید IGRT",
      "Commissioning شتاب‌دهنده خطی",
      "IEC 60601-2-1",
      "IEC 60601-2-68:2025",
      "دزیمتری رادیوتراپی",
      "MLC و VMAT",
      "DICOM RT",
      "هزینه چرخه عمر Linac",
    ],
    sources: [
      {
        title: "IEC — IEC 60601‑2‑1:2020، ایمنی و عملکرد ضروری شتاب‌دهنده الکترونی پزشکی",
        url: "https://webstore.iec.ch/en/publication/31388",
      },
      {
        title: "IEC — IEC 60601‑2‑68:2025، ایمنی تجهیزات X‑ray برای IGRT",
        url: "https://webstore.iec.ch/en/publication/67429",
      },
      {
        title: "FDA — شناسایی IEC 60601‑2‑68 Edition 2.0 در ۲۶ مه ۲۰۲۵",
        url: "https://www.accessdata.fda.gov/scripts/cdrh/cfdocs/cfstandards/detail.cfm?standard__identification_no=46150",
      },
      {
        title: "FDA — طبقه‌بندی و استانداردهای شتاب‌دهنده خطی پزشکی، Product code IYE",
        url: "https://www.accessdata.fda.gov/scripts/cdrh/cfdocs/cfpcd/classification.cfm?ID=IYE",
      },
      {
        title: "IAEA — TRS‑398 Rev.1، تعیین دز جذبی در رادیوتراپی External beam، ۲۰۲۴",
        url: "https://www.iaea.org/publications/15048/absorbed-dose-determination-in-external-beam-radiotherapy",
      },
      {
        title: "IAEA — TRS‑430، Commissioning و QA سامانه‌های برنامه‌ریزی درمان",
        url: "https://www-pub.iaea.org/MTCD/Publications/PDF/TRS430_web.pdf",
      },
      {
        title: "IAEA — TECDOC‑1583، Commissioning سامانه‌های برنامه‌ریزی درمان رادیوتراپی",
        url: "https://www-pub.iaea.org/MTCD/Publications/PDF/te_1583_web.pdf",
      },
      {
        title: "AAPM — TG‑155، دزیمتری میدان‌های کوچک",
        url: "https://www.aapm.org/pubs/reports/detail.asp?docid=217",
      },
      {
        title: "FDA — IEC 62274، ایمنی سامانه‌های Record & Verify رادیوتراپی",
        url: "https://www.accessdata.fda.gov/scripts/cdrh/cfdocs/cfStandards/detail.cfm?standard__identification_no=29957",
      },
      {
        title: "DICOM PS3.3 2026d — RT Radiation Set و RT Radiation",
        url: "https://dicom.nema.org/Medical/dicom/current/output/chtml/part03/sect_7.14.5.html",
      },
    ],
    imageCredit: "تصویر اختصاصی Clinoro، تولیدشده با OpenAI",
    imageSource:
      "https://clinoromedical.com/assets/blog/radiotherapy-linac-igrt-procurement-acceptance-2026.webp",
    imageAlt:
      "شتاب‌دهنده خطی رادیوتراپی همراه فانتوم آب و تجهیزات دزیمتری برای آزمون پذیرش و Commissioning در اتاق درمان",
    imageLicense: "تصویر تولیدشده برای Clinoro",
  },
];
