export const dailyBlogPosts20260902 = [
  {
    id: "clinoro-daily-spectral-photon-counting-ct-procurement-2026",
    slug: "spectral-photon-counting-ct-procurement-2026",
    title:
      "برچسب Spectral کافی نیست؛ ۱۲ آزمون خرید CT چندانرژی و Photon‑Counting",
    excerpt:
      "Dual‑Energy، Spectral و Photon‑Counting نام یک خروجی واحد نیستند. این راهنمای خریدار، معماری، کاربرد بالینی، دز–کیفیت، فانتوم و QC اختصاصی، نقشه‌های ماده، بازسازی، PACS، لایسنس، SLA و هزینه هر مطالعه قابل‌گزارش را به ۱۲ کنترل قراردادی تبدیل می‌کند.",
    content: `اگر در RFP فقط بنویسید «CT طیفی» یا «Photon‑Counting»، احتمالاً چند پیشنهاد با نام مشابه اما دامنه، معماری، خروجی، سرعت، میدان دید، دز، Workflow و هزینه کاملاً متفاوت دریافت می‌کنید. فناوری چندانرژی می‌تواند اطلاعاتی فراتر از CT تک‌انرژی ایجاد کند، اما ارزش خرید فقط وقتی اثبات می‌شود که یک کاربرد بالینی تعریف‌شده را با کیفیت، دز، زمان و هزینه قابل‌اندازه‌گیری تحویل دهد.

[گزارش Task Group 299 انجمن فیزیک‌پزشکی آمریکا (AAPM) در سال ۲۰۲۴](https://www.aapm.org/pubs/reports/detail.asp?docid=288) دقیقاً درباره همین تفاوت هشدار می‌دهد: معماری‌های سخت‌افزاری و نرم‌افزاری سازندگان به‌طور معنادار متفاوت‌اند و پارامترهای آشکار یا پنهان می‌توانند عملکرد و دز Multi‑Energy CT را تغییر دهند. این گزارش می‌گوید QC معمول CT تک‌انرژی به‌تنهایی کافی نیست و آزمون باید برای Task موردنظر—مانند تفکیک دو ماده یا کمی‌سازی یک عنصر—طراحی شود.

تفاوت فقط میان برندها نیست. [AAPM TG291](https://www.aapm.org/pubs/reports/detail.asp?docid=201) رویکردهای مختلف Multi‑Energy CT، خروجی‌هایی مانند Virtual monoenergetic، Material decomposition و Virtual non‑contrast و اثر فناوری بر دز را بررسی می‌کند. سیستم می‌تواند از دو منبع، تغییر سریع kV، فیلتر طیفی، آشکارساز دولایه یا Photon‑Counting استفاده کند؛ هر معماری محدودیت و Workflow خودش را دارد. پس «تعداد Energy» یا یک لوگوی Spectral روی بروشور، مشخصات خرید نیست.

در ۲۵ اوت ۲۰۲۶ نیز [IAEA نتیجه یک مطالعه چندمرکزی](https://www.iaea.org/newscenter/news/iaea-led-study-finds-5-star-rating-system-can-help-make-ct-imaging-safer) را منتشر کرد که کیفیت تشخیصی را همراه با دز می‌سنجد، نه صرفاً با تصویر کم‌نویزتر. در این مطالعه ۲۷۳۷ CT قفسه سینه و شکم با ۲۳ اندیکاسیون در شش بیمارستان پنج کشور اروپایی ارزیابی شد. پیام خرید روشن است: تصویر «زیباتر» یا Dose ادعایی کمتر، بدون Task بالینی و معیار تشخیصی مشترک، ارزش قابل‌مقایسه ایجاد نمی‌کند.

> این مقاله چارچوب خرید و پذیرش فنی است، نه پروتکل تصویربرداری یا توصیه برای کاهش ماده حاجب، حذف فاز یا تشخیص بیمار. پروتکل، دز، Reconstruction، استفاده از VNC و تصمیم گزارش باید توسط رادیولوژیست، فیزیک‌پزشکی و تیم ایمنی مرکز برای همان سیستم و جمعیت اعتبارسنجی شوند.

## ۱۲ آزمون پیش از قرارداد و اولین گزارش بالینی

### ۱. مسئله بالینی را پیش از نام فناوری قفل کنید

از رادیولوژیست‌ها بخواهید حداکثر پنج Use case اولویت‌دار را با حجم سالانه تعریف کنند: Characterization سنگ، Gout، کاهش Artifact فلز، Iodine map، Perfusion، Pulmonary embolism، Oncologic follow‑up، Cardiac، Bone marrow، VNC یا Ultra‑high‑resolution. برای هرکدام بنویسید خروجی قرار است چه تصمیمی را بهتر یا سریع‌تر کند و معیار موفقیت چیست.

یک سیستم ممکن است در Material separation قوی باشد اما Coverage، Temporal resolution یا Workflow موردنیاز قلب را نداشته باشد. دیگری ممکن است Spectral data را همیشه جمع‌آوری کند اما تولید نقشه خاص، FOV کامل یا Reconstruction سریع به License و Workstation جدا نیاز داشته باشد. امتیازدهی را به Case mix واقعی مرکز متصل کنید، نه به طول فهرست Applicationها.

### ۲. معماری و محدودیت حالت تصویربرداری را شفاف کنید

در ماتریس فنی مشخص کنید داده انرژی چگونه جدا می‌شود: Source‑based یا Detector‑based؟ آیا Spectral acquisition هم‌زمان است؟ Field of view طیفی، Pitch، Rotation، Coverage، Tube current modulation، ECG gating، اندازه بیمار و حالت Ultra‑high‑resolution چه محدودیت‌هایی دارند؟ آیا داده طیفی در همه اسکن‌ها ذخیره می‌شود یا باید قبل از Scan یک Mode خاص انتخاب شود؟

نام «Photon‑Counting» نیز به‌تنهایی Intended Use را نشان نمی‌دهد. برای نمونه، [خلاصه 510(k) شماره K252249 FDA در ۱۳ مارس ۲۰۲۶](https://www.accessdata.fda.gov/cdrh_docs/pdf25/K252249.pdf) یک CT آشکارساز Photon‑Counting را برای تصویربرداری اندام فوقانی بزرگسالان توصیف می‌کند. این مثال درباره همان محصول است و به همه سیستم‌ها تعمیم ندارد؛ اما ثابت می‌کند خریدار باید Indication، آناتومی، سن بیمار و حالت مجاز **همان مدل** را بخواند، نه اینکه از نام فناوری دامنه کاربرد را حدس بزند.

### ۳. CT پایه را قربانی قابلیت طیفی نکنید

حتی اگر ۲۰ درصد مطالعات Spectral باشند، ۱۰۰ درصد بیماران به CT قابل‌اتکا نیاز دارند. Aperture، وزن میز، طول Scan، توان Generator، ظرفیت و Cooling تیوب، Spatial و Contrast resolution، Temporal resolution، AEC، Motion correction، Metal artifact reduction، Pediatric protocol و Reconstruction معمول باید جداگانه ارزیابی شوند.

[IEC 60601-2-44](https://webstore.iec.ch/en/publication/2661) ایمنی پایه و عملکرد ضروری CT را پوشش می‌دهد و [IEC 61223-3-5 که FDA آن را به رسمیت شناخته است](https://www.accessdata.fda.gov/scripts/cdrh/cfdocs/cfStandards/detail.cfm?standard__identification_no=40109) پارامترهای پذیرش مرتبط با کیفیت تصویر، خروجی پرتو و Positioning بیمار را تعریف می‌کند. Spectral performance یک لایه اضافه است؛ جای آزمون CT پایه را نمی‌گیرد.

### ۴. فهرست خروجی و License را با نسخه قفل کنید

برای هر Use case، خروجی دقیق را در BOM بنویسید: Low/high‑energy images، Virtual monoenergetic در بازه موردنیاز، Iodine map، Z‑effective، Electron density، Material‑specific map، Calcium suppression، VNC، Stone composition یا Spectral raw data. سپس محل پردازش، نسخه نرم‌افزار، Workstation، Concurrent user، Subscription، محدودیت Export و زمان End‑of‑support را مشخص کنید.

عبارت «Spectral ready» ممکن است فقط به Acquisition اشاره کند، نه License تفسیر یا ذخیره خروجی. Demo روی Cloud سازنده نیز الزاماً نشان نمی‌دهد خروجی در شبکه واقعی مرکز، روی PACS و Viewer فعلی، برای همه کاربران مجاز قابل تولید است. هر گزینه باید Part number، مدت مجوز، هزینه Upgrade و معیار تحویل داشته باشد.

### ۵. QC اختصاصی را با فانتوم Material‑specific ببندید

فانتوم آب و آزمون CT number معمول، دقت کمی‌سازی Iodine یا جداسازی مواد را ثابت نمی‌کند. فانتوم باید Insertهای شناخته‌شده و اندازه‌های نماینده بیمار داشته باشد و Protocol باید Accuracy، Bias، Repeatability، Uniformity، Detectability و اثر اندازه بیمار، Dose و Reconstruction را برای Taskهای قراردادشده بسنجد.

[AAPM TG299](https://www.aapm.org/pubs/reports/detail.asp?docid=288) برنامه QC اختصاصی Multi‑Energy CT را بر مبنای فناوری، Task، دز و نوع فانتوم توصیه می‌کند. [ابزار پژوهش مقرراتی FDA برای Spectral CT](https://cdrh-rst.fda.gov/method-and-phantom-design-evaluation-material-quantification-accuracy-contrast-enhanced-spectral) نیز روشی برای ارزیابی دقت کمی‌سازی Iodine با فانتوم معرفی می‌کند. این ابزار جای استاندارد یا پروتکل مرکز نیست، اما نشان می‌دهد «نقشه رنگی درست به نظر می‌رسد» معیار پذیرش کمی نیست.

### ۶. دز و کیفیت را برای هر Task با هم اندازه بگیرید

هیچ معماری را ذاتاً کم‌دوز فرض نکنید. CTDIvol، DLP و در صورت امکان SSDE را همراه با اندازه فانتوم، AEC، kV، mAs، Pitch، Collimation، Reconstruction و هدف تشخیصی ثبت کنید. مقایسه باید یا در Dose هم‌ارز، کیفیت Task‑specific را بسنجد یا در کیفیت هم‌ارز، Dose را؛ ترکیب Protocolهای نابرابر نتیجه بازاری می‌سازد.

مطالعه IAEA منتشرشده در ۲۵ اوت ۲۰۲۶ تأکید می‌کند تصویر بسیار Sharp و کم‌نویز که با پرتو بیش از نیاز ساخته شده، لزوماً امتیاز بهتری ندارد. در قرارداد، Protocol optimization را Deliverable مستقل بگذارید: فیزیک‌پزشکی و رادیولوژیست باید کیفیت کافی برای Indication را با دز مناسب تأیید کنند، نه اینکه کارخانه‌ای‌ترین تصویر برنده شود.

### ۷. ادعای کاهش ماده حاجب یا حذف فاز را مستقل اعتبارسنجی کنید

Low‑keV virtual monoenergetic images یا Iodine map ممکن است در بعضی کاربردها CNR را تغییر دهند؛ VNC نیز می‌تواند در Workflowهای خاص اطلاعات فاز بدون کنتراست را شبیه‌سازی کند. اما این به معنی مجوز عمومی برای کاهش Contrast یا حذف Acquisition نیست. عملکرد به آناتومی، اندازه بیمار، غلظت Iodine، Timing، Artifact، Reconstruction و هدف تشخیصی وابسته است.

قبل از تغییر Protocol، مطالعه Validation با نمونه کافی، معیار از پیش نوشته‌شده و بازبینی رادیولوژی انجام دهید. True non‑contrast را در فاز پذیرش فقط وقتی حذف کنید که تیم بالینی برای Use case مشخص شواهد و حاکمیت تغییر را تصویب کرده باشد. صرفه‌جویی ادعایی Contrast یا Dose را تا پیش از اثبات محلی وارد Business case قطعی نکنید.

### ۸. زمان بازسازی و خوانش را با بار واقعی بسنجید

یک Scan می‌تواند چندین Series و نقشه بسازد. زمان Reconstruction، Queue، Prioritization اورژانس، انتقال به PACS، بازشدن Viewer، Hanging protocol، Fusion و تولید گزارش را با Workflow واقعی اندازه بگیرید. سرعت Gantry وقتی نقشه Iodine ده دقیقه بعد آماده می‌شود، الزاماً Throughput بالینی ایجاد نمی‌کند.

برای هر مطالعه، تعداد Series خودکار و دستی، حجم داده، زمان تا اولین تصویر و زمان تا مجموعه کامل را ثبت کنید. آیا رادیولوژیست باید وارد کنسول اختصاصی شود؟ آیا نقشه‌ها با یک کلیک در PACS دیده می‌شوند؟ آیا پردازش Batch، Remote و هم‌زمان چند کاربر ممکن است؟ Acceptance باید از Registration بیمار تا Signed report ادامه پیدا کند.

### ۹. داده، DICOM و ظرفیت زیرساخت را قیمت‌گذاری کنید

Conformance statement و نمونه واقعی DICOM را پیش از سفارش بگیرید. Series description، Energy level، Material map، Secondary capture یا Parametric map، Dose SR، Raw data، Compression، Lossless export و قابلیت Anonymization را بررسی کنید. داده‌ای که فقط روی Workstation Vendor قابل خواندن است، ارزش پژوهشی و Exit plan را محدود می‌کند.

حجم سالانه را در سناریوهای Conventional، Spectral‑on‑demand و Spectral‑always محاسبه کنید. PACS، VNA، Network، Backup، Viewer license، Cybersecurity، Remote service و Retention ممکن است هزینه‌ای مستقل از Scanner بسازند. SLA باید خرابی Reconstruction server و License server را نیز مانند خرابی Gantry پوشش دهد.

### ۱۰. پذیرش مستقل و Baseline را پیش از Go‑Live کامل کنید

پذیرش Vendor برای اثبات نصب لازم است، اما Baseline مستقل مرکز را جایگزین نمی‌کند. فیزیک‌پزشکی باید هویت Hardware/Software، ایمنی، هندسه، CT number، Noise، Uniformity، Spatial/low‑contrast resolution، AEC، دز، Positioning و تمام آزمون‌های Spectral قراردادشده را با Raw result ثبت کند.

استاندارد IEC 61223-3-5 هدف Acceptance را بررسی انطباق نصب یا Major service با مشخصات مؤثر بر کیفیت تصویر، خروجی پرتو و Positioning می‌داند و Constancy test را برای کشف زودهنگام تغییر عملکرد به‌کار می‌برد. بنابراین گزارش روز تحویل باید Baseline برنامه QC آینده باشد، نه یک فرم «دستگاه سالم است».

### ۱۱. Upgrade، Drift و سرویس را بخشی از عملکرد طیفی بدانید

تعویض تیوب، Detector calibration، Firmware، Reconstruction kernel، AI denoising، Material decomposition algorithm یا Workstation می‌تواند خروجی کمی را تغییر دهد. برای هر Major service و Update، Test subset، مسئول Validation، Rollback، Downtime و معیار بازگشت به Clinical use را از پیش بنویسید.

[آموزش‌های CT سازمان IAEA که در ۲۸ ژوئیه ۲۰۲۵ معرفی شدند](https://www.iaea.org/newscenter/news/new-iaea-video-tutorials-on-computed-tomography-for-medical-physicists) بر همکاری فیزیک‌پزشکی با تیم بالینی، ارزیابی AEC، مدیریت Protocol و تحلیل تصویر تأکید دارند. قرارداد آموزش نیز باید Role‑based باشد: Technologist برای Acquisition، Radiologist برای Interpretation، Physicist برای QC و IT برای داده و Recovery.

### ۱۲. TCO را به مطالعه طیفی قابل‌گزارش تبدیل کنید

قیمت Gantry، Detector، تیوب، Workstation، Application، Subscription، Phantom، فیزیک‌پزشکی، Contrast، Injector، PACS/VNA، Storage، آموزش، QA، سرویس، قطعه، Upgrade و Downtime را جمع کنید. سپس فقط حجم Use caseهایی را وارد کنید که Radiologist و Workflow واقعاً خروجی طیفی را به گزارش بالینی تبدیل می‌کنند.

**هزینه هر مطالعه طیفی قابل‌گزارش = هزینه افزوده مالکیت و بهره‌برداری قابلیت طیفی ÷ تعداد مطالعاتی که خروجی طیفی معتبر، قابل مشاهده و مورداستفاده در گزارش دارند**

اسکن Spectral که نقشه آن ساخته یا دیده نمی‌شود، در مخرج قرار نمی‌گیرد. همین شاخص را برای سه سناریوی حجم کم، پایه و بالا محاسبه و با Upgrade یک CT موجود، خرید CT متعارف جدید و ارجاع بیرونی مقایسه کنید. ارزش بالینی احتمالی را جدا از صرفه‌جویی نقدی مدل کنید تا یک ادعای تشخیصی به درآمد تضمینی تبدیل نشود.

## پرونده‌ای که پیش از اولین گزارش باید کامل باشد

- Clinical use case، حجم، جمعیت و معیار موفقیت
- Intended Use و Indication همان مدل و نسخه
- معماری، Modeها، Spectral FOV و محدودیت اندازه بیمار
- BOM کامل Hardware، Application، License و Subscription
- DICOM conformance و نمونه Export همه خروجی‌ها
- Phantom و پروتکل QC اختصاصی هر Task
- Raw data پذیرش CT پایه، دز و Spectral performance
- Baseline Iodine quantification و Material separation
- گزارش End‑to‑end PACS، Viewer و Reconstruction time
- Protocolهای تصویب‌شده و Change control
- SLA تیوب، Detector، Server، Software و Cybersecurity
- TCO، ظرفیت Storage، Business continuity و Exit plan

## هشت علامت توقف خرید

پیشنهادی که فقط نام Spectral می‌دهد اما معماری و محدودیت Mode را پنهان می‌کند، خروجی‌ها را بدون Part number می‌نویسد، کاهش Dose یا Contrast را بدون Task و Protocol ادعا می‌کند، QC را به فانتوم آب محدود می‌سازد، نقشه‌ها را فقط روی Demo workstation نشان می‌دهد، زمان Reconstruction را گزارش نمی‌کند، Raw data و DICOM را قابل‌خروج نمی‌کند یا تسویه را پیش از پذیرش مستقل می‌خواهد، هنوز قابل خرید نیست.

## جمع‌بندی و اقدام بعدی

CT چندانرژی یک Feature واحد نیست؛ زنجیره‌ای از Acquisition، Reconstruction، کمی‌سازی، Viewer، تخصص کاربر، QC و تصمیم بالینی است. خرید زمانی قابل دفاع می‌شود که معماری و دامنه مجاز همان مدل شناخته شود، عملکرد Task‑specific با فانتوم و Protocol واقعی اثبات شود و دز، زمان، داده و هزینه در کنار کیفیت تشخیصی سنجیده شوند.

برای تدوین Requirement matrix، مقایسه Dual‑Energy و Photon‑Counting CT، طراحی پروتکل پذیرش و مدل TCO، از [خدمات تأمین Clinoro](/procurement) شروع کنید یا [پیشنهادها و Case mix مرکز را برای بررسی ارسال کنید](/contact). حجم سالانه، Use caseهای اولویت‌دار، پیکربندی‌ها، Application و Licenseها، PACS/VNA، دز فعلی و تاریخ هدف Go‑Live را ضمیمه کنید تا ارزیابی بر مبنای خروجی قابل‌گزارش انجام شود.`,
    image: "/assets/blog/spectral-photon-counting-ct-procurement-2026.webp",
    category: "جهانی؛ CT طیفی، Photon‑Counting و خرید تصویربرداری",
    author: "تحریریه Clinoro",
    publishedAt: "2026-09-02",
    publishedTime: "2026-09-02T08:00:00+03:30",
    published: true,
    seoTitle: "خرید CT طیفی و Photon‑Counting؛ ۱۲ آزمون",
    seoDescription:
      "راهنمای خرید CT چندانرژی و Photon‑Counting؛ معماری، کاربرد، دز–کیفیت، فانتوم، QC، نقشه ماده، PACS، لایسنس، پذیرش و TCO.",
    keywords: [
      "خرید CT طیفی",
      "Photon Counting CT",
      "Dual Energy CT",
      "Multi Energy CT",
      "آزمون پذیرش CT",
      "کنترل کیفیت CT طیفی",
      "فانتوم Spectral CT",
      "هزینه چرخه عمر CT",
    ],
    sources: [
      {
        title:
          "AAPM Task Group 299 — Quality control in multi-energy computed tomography، ۲۰۲۴",
        url: "https://www.aapm.org/pubs/reports/detail.asp?docid=288",
      },
      {
        title:
          "AAPM Task Group 291 — Principles and Applications of Multi-energy CT، ۲۰۲۰",
        url: "https://www.aapm.org/pubs/reports/detail.asp?docid=201",
      },
      {
        title:
          "IEC 60601-2-44:2009 — ایمنی پایه و عملکرد ضروری تجهیزات X-ray CT",
        url: "https://webstore.iec.ch/en/publication/2661",
      },
      {
        title:
          "FDA Recognized Standard — IEC 61223-3-5:2019، پذیرش و آزمون پایداری CT با Corrigendum 2022",
        url: "https://www.accessdata.fda.gov/scripts/cdrh/cfdocs/cfStandards/detail.cfm?standard__identification_no=40109",
      },
      {
        title:
          "FDA CDRH Regulatory Science Tool — ارزیابی دقت کمی‌سازی ماده در Spectral CT، ۲۰ ژوئن ۲۰۲۴",
        url: "https://cdrh-rst.fda.gov/method-and-phantom-design-evaluation-material-quantification-accuracy-contrast-enhanced-spectral",
      },
      {
        title:
          "FDA 510(k) K252249 — نمونه دامنه کاربرد محدود یک Photon-counting CT، ۱۳ مارس ۲۰۲۶",
        url: "https://www.accessdata.fda.gov/cdrh_docs/pdf25/K252249.pdf",
      },
      {
        title:
          "IAEA — مطالعه چندمرکزی امتیازدهی Dose-aware کیفیت CT، ۲۵ اوت ۲۰۲۶",
        url: "https://www.iaea.org/newscenter/news/iaea-led-study-finds-5-star-rating-system-can-help-make-ct-imaging-safer",
      },
      {
        title:
          "IAEA — آموزش بهینه‌سازی CT برای فیزیک‌پزشکی، ۲۸ ژوئیه ۲۰۲۵",
        url: "https://www.iaea.org/newscenter/news/new-iaea-video-tutorials-on-computed-tomography-for-medical-physicists",
      },
    ],
    imageCredit: "تصویر اختصاصی Clinoro، تولیدشده با OpenAI",
    imageSource:
      "https://clinoromedical.com/assets/blog/spectral-photon-counting-ct-procurement-2026.webp",
    imageAlt:
      "فیزیک‌پزشک، رادیولوژیست و مهندس پزشکی در حال آزمون CT طیفی با فانتوم چندماده‌ای و بررسی نقشه‌های کمی",
    imageLicense: "تصویر تولیدشده برای Clinoro",
  },
];
