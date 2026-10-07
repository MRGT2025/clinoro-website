export const dailyBlogPosts20261007 = [
  {
    id: "clinoro-daily-iran-dental-cbct-procurement-acceptance",
    slug: "iran-dental-cbct-procurement-acceptance",
    title: "وُکسل کوچک، تصویر بهتر نیست؛ ۱۲ آزمون خرید CBCT دندان‌پزشکی در ایران",
    excerpt:
      "CBCT را با کوچک‌ترین وُکسل یا زیباترین بازسازی سه‌بعدی نخرید. این راهنمای ایران‌محور ۱۲ آزمون برای FOV، دز، فانتوم، کیفیت تصویر، آرتیفکت، DICOM، SAT، SLA و هزینه چرخه عمر ارائه می‌کند.",
    content: `اندازه وُکسل روی بروشور، معادل قدرت تفکیک واقعی نیست. هندسه دستگاه، اندازه FOV، تعداد پروجکشن، حرکت، نویز، پراکندگی، بازسازی و آرتیفکت فلز تعیین می‌کنند که تصویر CBCT برای سؤال بالینی موردنظر قابل استفاده باشد یا نه. دستگاهی با وُکسل اسمی کوچک‌تر ممکن است دز، نویز، زمان بازسازی و حجم ذخیره بیشتری ایجاد کند، بدون آنکه جزئیات مفید بیشتری تحویل دهد.

[FDA در معرفی رسمی Dental CBCT](https://www.fda.gov/radiation-emitting-products/medical-x-ray-imaging/dental-cone-beam-computed-tomography) توضیح می‌دهد این سامانه‌ها با چرخش منبع و آشکارساز و پرتو مخروطی، داده لازم برای بازسازی سه‌بعدی دندان، فک، صورت و برخی کاربردهای ENT را می‌سازند. همان منبع یادآوری می‌کند دز CBCT معمولاً از رادیوگرافی معمول دندان‌پزشکی بیشتر است و استفاده باید توجیه‌شده و بهینه باشد؛ به‌ویژه برای بیماران جوان‌تر.

برای خرید، دو لایه استاندارد را از هم جدا کنید. [IEC 60601‑2‑63:2012+A1:2017+A2:2021](https://webstore.iec.ch/en/publication/68977) به ایمنی پایه و عملکرد ضروری تجهیزات X‑ray خارج‌دهانی دندان‌پزشکی می‌پردازد. [IEC 61223‑3‑7:2021](https://www.accessdata.fda.gov/scripts/cdrh/cfdocs/cfstandards/detail.cfm?standard__identification_no=43271) مخصوص آزمون پذیرش و پایایی عملکرد تصویری Dental CBCT است و سه محور کیفیت تصویر، خروجی تابش و Positioning بیمار را پوشش می‌دهد. عبارت کلی «مطابق IEC» بدون شماره، ویرایش، دامنه و گزارش همان مدل کافی نیست.

> این مقاله چارچوب خرید و پذیرش فنی است؛ جایگزین تجویز تصویربرداری، تفسیر رادیولوژی، برنامه حفاظت پرتویی، الزامات مرجع مجوزدهنده یا متن کامل استانداردها نیست. آزمون‌های پرتویی و پذیرش باید بدون بیمار، با فانتوم و ابزار معتبر و زیر نظر افراد واجد صلاحیت انجام شوند.

## پیش از RFP، سؤال بالینی را به FOV تبدیل کنید

ایمپلنت تک‌دندان، اندودنتیکس، دندان نهفته، ارتودنسی، جراحی فک، TMJ، سینوس، Airway و ENT یک نیاز واحد نیستند. برای هر کاربرد، ناحیه آناتومیک، کوچک‌ترین FOV لازم، کیفیت هدف، احتمال فلز، گروه سنی، تعداد مراجعه، خروجی گزارش و نیاز به Fusion یا Surgical planning را بنویسید.

Small، Medium و Large FOV نام تجاری‌اند و میان سازندگان ابعاد یکسان ندارند. یک دستگاه ممکن است ۵×۵، ۸×۸ و ۱۲×۱۰ سانتی‌متر ارائه کند و دستگاه دیگر دسته‌بندی متفاوتی داشته باشد. معیار خرید را به ابعاد واقعی، محدوده بازسازی‌شده و کاربرد مجاز همان پروتکل وصل کنید؛ نه به نام بازاری «Full FOV» یا «Ultra HD».

## ۱۲ آزمون خرید و پذیرش CBCT دندان‌پزشکی

### ۱. Intended use، کاربرد و FOV را روی یک ماتریس قفل کنید

برای هر کاربرد مرکز مشخص کنید کدام Model، FOV، Mode، Position، Voxel، الگوریتم بازسازی و نرم‌افزار لازم است. اگر Cephalometric، Panoramic، Face scan، Model scan یا ENT option می‌خواهید، هرکدام را با Intended use، سخت‌افزار و License مستقل در ماتریس بیاورید.

یک FOV بزرگ را پیش‌فرض همه بیماران نکنید. [FDA](https://www.fda.gov/radiation-emitting-products/medical-x-ray-imaging/dental-cone-beam-computed-tomography) توصیه می‌کند CBCT فقط وقتی انجام شود که اطلاعات لازم با روش کم‌دزتر به دست نمی‌آید و تنظیمات بر اساس سؤال بالینی، اندازه بیمار و ناحیه اسکن بهینه شوند. در خرید، این اصل باید به وجود پروتکل‌ها و Collimation واقعی تبدیل شود.

### ۲. مدل، تیوب، آشکارساز و نسخه نرم‌افزار را با شواهد تطبیق دهید

Label، IFU، مجوز بازار هدف، Declaration، گزارش آزمون و سابقه اقدام اصلاحی را با Model و Revision پیشنهادی تطبیق دهید. Family name مشترک، ظاهر مشابه یا گزارش یک مدل قدیمی پوشش خودکار مدل جدید نیست.

[FDA ویرایش تجمیعی 1.2 استاندارد IEC 60601‑2‑63 را کامل شناسایی کرده است](https://www.accessdata.fda.gov/scripts/cdrh/cfdocs/cfStandards/detail.cfm?standard__identification_no=42549)، اما این شناسایی آمریکایی جای ثبت و الزامات ایران را نمی‌گیرد. درس خرید آن روشن است: شماره ویرایش، دامنه استاندارد، Procode یا Intended use و پیکربندی واقعی را کنار هم ببینید.

### ۳. BOM، Option و License را پیش از مقایسه قیمت ببندید

ژنراتور، تیوب، Detector، Gantry، Chin rest، Bite block، Head support، Positioning light، Control console، Workstation، Monitor تشخیصی یا Review monitor، فانتوم‌ها، دزیمتر یا دسترسی آزمون، UPS، DICOM، Viewer، Implant library، Ceph module، Export، Remote support و همه Licenseها را با Part number و مدت اعتبار ثبت کنید.

عبارت «نرم‌افزار کامل» قابل ارزیابی نیست. تعداد Seat، هم‌زمانی کاربران، Server یا Cloud، Update، Backup، Implant library، STL export، DICOM send/receive، Worklist، RDSR و هزینه تمدید را جدا قیمت‌گذاری کنید. Demo license باید از اقلام قطعی قرارداد تفکیک شود.

### ۴. اتاق، حفاظ، برق و Workflow را پیش از ورود دستگاه تأیید کنید

Footprint و Swing gantry، مسیر ورود، ارتفاع سقف، تحمل کف، برق، ارت، تهویه، شبکه، محل کنسول، دید و ارتباط با بیمار، خروج اضطراری و فضای سرویس را روی Site plan ببندید. دسترسی ویلچر، قدهای متفاوت، بیمار کم‌توان و فضای همراه نیز بخشی از Workflow است.

[AAPM TG‑261 در ۲۰۲۴](https://aapm.org/pubs/reports/detail.asp?docid=279) توصیه می‌کند فیزیک‌پزشکی از مرحله پیش‌نصب در پیکربندی اتاق و طراحی حفاظ ساختاری، در صورت نیاز، مشارکت کند. محاسبه حفاظ، Survey پس از نصب و مجوزهای پرتویی را به یک عدد عمومی ضخامت سرب یا نقشه فروشنده تقلیل ندهید؛ بار کاری، جهت پرتو، اشغال فضاهای مجاور و قواعد محل مهم‌اند.

### ۵. Positioning، Alignment و Collimation را مکانیکی بیازمایید

حرکت Gantry، ارتفاع، قفل‌ها، Emergency stop، Laser یا نورهای Positioning، Chin rest، Bite block، Temple support و برخورد احتمالی را در همه پوزیشن‌های قراردادی بررسی کنید. Phantom را چند بار خارج و دوباره قرار دهید تا خطای بازنشانی دیده شود.

TG‑261 پذیرش نصب جدید را شامل ارزیابی هم‌راستایی مکانیکی نورهای Positioning و Collimation پرتو می‌داند. مرکز FOV، مرز تابش و حجم بازسازی‌شده باید هم‌خوان باشند. اگر دستگاه Stitching یا اسکن چندبخشی دارد، Offset و مرز اتصال را نیز با فانتوم بسنجید.

### ۶. خروجی تابش و پروتکل‌ها را به کیفیت قابل‌قبول وصل کنید

برای هر FOV و پروتکل پرتکرار، kV، mA، زمان یا Pulse، Rotation، تعداد Projection، شاخص خروجی تابش و Mode کودک/بزرگسال را ثبت کنید. با ابزار مناسب، تکرارپذیری خروجی و در صورت الزام پروژه، کمیت دز را طبق روش فیزیک پزشکی اندازه بگیرید.

عدد دز بدون Protocol و کیفیت تصویر معنی ندارد. یک پروتکل «Low dose» که CNR یا جزئیات لازم را از بین ببرد، بهینه نیست؛ پروتکل پر‌دز با کیفیت بیشتر از نیاز هم قابل دفاع نیست. معیار پذیرش باید زوج «کیفیت کافی برای Use case + کمترین تابش معقول» باشد.

### ۷. کیفیت تصویر را با فانتوم و داده عددی Baseline کنید

فانتوم مناسب CBCT را برای Uniformity، Noise، Contrast-to-noise ratio، Spatial resolution، Geometric accuracy و Artifact اسکن کنید. TG‑261 همین پارامترها را برای Benchmark پذیرش برجسته می‌کند و می‌خواهد نتیجه‌ها دست‌کم سالانه در QC فیزیک پزشکی تکرار شوند.

فایل خام یا DICOM، Protocol، FOV، تنظیمات، نسخه نرم‌افزار، تحلیل، مقدار اندازه‌گیری، تلرانس و تصویر مرجع را نگه دارید. یک تصویر زیبا روی مانیتور فروشنده یا پیام Pass بدون داده، Baseline نگهداری نیست.

### ۸. وُکسل، Resolution و آرتیفکت را جداگانه بسنجید

وُکسل بازسازی‌شده کوچک، Sampling grid را توصیف می‌کند؛ تضمین نمی‌کند سامانه همان جزئیات را با کنتراست قابل‌استفاده تفکیک کند. Spatial resolution را با فانتوم و روش ثابت اندازه بگیرید و اثر FOV، Mode، Noise و Reconstruction را ثبت کنید.

برای فلز، Beam hardening، Scatter، Truncation، Motion، Ring artifact و خرابی Pixel سناریوی فانتومی یا داده آزمون مستند بسازید. Metal artifact reduction را روشن و خاموش مقایسه کنید؛ الگوریتم ممکن است آرتیفکت را کم کند اما مرز واقعی را نیز تغییر دهد. نتیجه باید محدودیت و امکان بازبینی Reconstruction اصلی را نشان دهد.

### ۹. پروتکل کودک و کاهش تکرار را عملی اجرا کنید

FDA می‌گوید نگرانی تابش در بیماران جوان‌تر بیشتر است و استفاده از پروتکل متناسب با اندازه را توصیه می‌کند. در پذیرش، پروتکل Pediatric را فقط در منو نبینید؛ FOV، تنظیمات، Positioning aid، راهنمای اپراتور و خروجی ثبت‌شده آن را بررسی کنید.

تکرار اسکن را با Immobilization مناسب، راهنمای صوتی/نوری، زمان کوتاه، Preview کم‌دز و آموزش کاهش دهید. Rejected study، علت تکرار، اپراتور، FOV و Protocol باید قابل ثبت و تحلیل باشد؛ حذف فایل ناموفق بدون Audit، شاخص دز و کیفیت را مخدوش می‌کند.

### ۱۰. Reconstruction، اندازه‌گیری و گزارش را با Case آزمون کنترل کنید

MPR، Curved planar reformation، Cross-section، MIP، Volume rendering، Implant planning و Nerve canal tracing را فقط در صورت خرید همان قابلیت آزمایش کنید. Pixel spacing، Slice interval، Orientation، Ruler، Angle و Annotation را با Phantom دارای ابعاد معلوم کنترل کنید.

یک Acquisition را با چند Kernel، Voxel یا FOV بازسازی کنید و زمان، حجم فایل، Artifact و امکان برگشت به داده اصلی را بسنجید. طبق [DICOM PS3.17 جاری](https://dicom.nema.org/medical/dicom/current/output/chtml/part17/sect_uuuu.3.2.6.5.html)، یک رویداد تابش می‌تواند چند بازسازی ایجاد کند؛ بنابراین نسبت Acquisition، Reconstruction و Irradiation Event باید در داده قابل ردیابی بماند.

### ۱۱. DICOM، PACS، Worklist و گزارش دز را انتها‌به‌انتها آزمون کنید

Modality Worklist، Patient ID، نام فارسی/لاتین، Accession number، Time sync، Storage، Query/Retrieve، Secondary capture، Structured report یا PDF و انتقال Volume را با PACS واقعی مرکز تست کنید. Screenshot یا Export دستی جای DICOM معتبر و Conformance Statement همان نسخه را نمی‌گیرد.

DICOM جاری برای Dental CT/CBCT گردش کار Acquisition، Reconstruction و Radiation Dose Structured Report را توضیح می‌دهد و RDSR را از Series تصویر جدا نگه می‌دارد. مشخص کنید دستگاه واقعاً RDSR تولید و ارسال می‌کند یا فقط عددی روی Report چاپ می‌شود. یک Study را Export، حذف آزمایشی، Restore و روی Viewer دوم باز کنید.

### ۱۲. SAT، QC، آموزش، SLA و TCO را به پرداخت وصل کنید

SAT باید هویت دستگاه و نرم‌افزار، BOM، Site، Alignment، Collimation، خروجی تابش، همه آزمون‌های فانتوم، Protocolها، DICOM، Backup، Training و Punch list را پوشش دهد. پرداخت نهایی را به قبولی معیارها، تحویل Baseline و بسته‌شدن نقص‌ها گره بزنید.

[آیین‌نامه تجهیزات و ملزومات پزشکی ایران](https://qavanin.ir/Law/TreeText/?IDS=9198362936967421494) خدمات پس از فروش را شامل تحویل قراردادی، نصب، راه‌اندازی، آزمون پذیرش، آموزش، ضمانت، قطعات، تعمیر، کنترل کیفی، آزمون ایمنی و عملکرد، کالیبراسیون، به‌روزرسانی، ردیابی و فراخوان می‌داند. این موارد را از وعده کلی به SLA عددی برای زمان پاسخ، حضور، تعمیر، Uptime، Tube/Detector، Workstation، Cybersecurity، Software update و End-of-support تبدیل کنید.

## ماتریس کوتاه مقایسه پیشنهادها

- کاربرد: Clinical matrix و FOV واقعی؛ نه «مناسب همه تخصص‌ها».
- هویت: Model، Revision، Detector و Software منطبق؛ نه Family مشابه.
- تصویر: Uniformity، Noise، CNR، Resolution و Artifact عددی؛ نه Demo چشم‌نواز.
- تابش: خروجی و کیفیت در هر Protocol؛ نه برچسب Low dose.
- Positioning: Alignment، Collimation و Repositioning؛ نه نور لیزر صرف.
- نرم‌افزار: License، Measurement، Reanalysis و Audit؛ نه Full option مبهم.
- اتصال: Worklist، Storage، Restore و RDSR واقعی؛ نه DICOM-ready.
- خدمت: قطعه، QC، Update، Loaner و End-of-support؛ نه گارانتی کلی.
- اقتصاد: هزینه هر مطالعه قابل‌گزارش؛ نه کمترین قیمت خرید.

## شاخص‌هایی که تصمیم را قابل دفاع می‌کنند

**Repeat rate = تعداد اسکن تکرارشده ÷ کل اسکن‌های شروع‌شده**

**Protocol success = آزمون‌های فانتوم قبول‌شده در FOV و Mode هدف ÷ کل Protocolهای قراردادی**

**Data portability = اقلام قابل Export، Restore و Reanalyse ÷ اقلام داده‌ای لازم قرارداد**

**Cost per reportable study = کل هزینه مالکیت و بهره‌برداری ÷ مطالعات کامل و قابل‌گزارش**

TCO را شامل خرید، Site و حفاظ، فانتوم و دزیمتری، License، PACS/Storage، PM/QC، Tube و Detector، Workstation، آموزش، Cybersecurity update، Downtime و خروج داده محاسبه کنید. حجم بروشوری را بدون زمان Positioning، Cleaning، Reconstruction، Report، Repeat و خرابی وارد مدل نکنید.

## پرونده‌ای که هنگام تحویل باید بگیرید

- URS، Clinical/FOV matrix و Intended use
- مجوز مدل، Label/IFU و گزارش استانداردهای قابل‌اعمال
- BOM، Serial، Detector، Software، Option و License
- Site plan، برق/ارت/شبکه، محاسبه حفاظ و Survey پس از نصب
- فانتوم‌ها، Certificate، روش تحلیل و ابزار پرتویی
- گزارش Alignment، Collimation و Positioning
- Baseline خروجی تابش و همه شاخص‌های کیفیت تصویر
- پروتکل کودک/بزرگسال و حدود اقدام QC
- Test study برای Artifact، Measurement و Reconstruction
- DICOM Conformance Statement و گزارش MWL/Storage/Retrieve/RDSR
- Backup/Restore، امنیت، Remote access و Change control
- SAT، آموزش، Competency، SLA، قطعات و End-of-support

## دوازده علامت توقف خرید

FOV بدون ابعاد، وُکسل بدون آزمون Resolution، License دمو، فانتوم بدون Certificate، گزارش استاندارد مدل دیگر، حفاظ بر اساس حدس، Low dose بدون Protocol، تصویر QC بدون داده عددی، Metal reduction بدون تصویر اصلی، DICOM فقط با USB، Backup بدون Restore، و Tube/Detector بدون Lead time دوازده دلیل روشن برای توقف‌اند.

## جمع‌بندی

CBCT بهتر دستگاهی نیست که کوچک‌ترین وُکسل یا پرجزئیات‌ترین تصویر تبلیغاتی را نشان دهد. انتخاب بهتر برای کاربرد مرکز FOV و پروتکل مناسب دارد، Positioning و Collimation آن دقیق است، کیفیت و خروجی تابش را با فانتوم قابل‌تکرار اثبات می‌کند، آرتیفکت و بازسازی را شفاف نگه می‌دارد، داده و دز را استاندارد منتقل می‌کند و برای قطعه، نرم‌افزار، QC و Downtime برنامه دارد.

برای تدوین URS، مقایسه فنی پیشنهادها، طراحی پروتکل فانتوم و دز، Site/SAT، DICOM checklist، SLA و مدل هزینه چرخه عمر، از [خدمات تأمین Clinoro](/procurement) شروع کنید یا [مدل‌ها، FOVها، حجم کار و پلان اتاق را برای بررسی ارسال کنید](/contact). خروجی می‌تواند یک Decision Pack شامل ماتریس فنی، پروتکل پذیرش، Baseline QC، Integration checklist و TCO باشد.`,
    image: "/assets/blog/iran-dental-cbct-procurement-acceptance.webp",
    category: "ایران؛ CBCT دندان‌پزشکی، حفاظت پرتویی و پذیرش فنی",
    author: "تیم مهندسی پزشکی Clinoro",
    publishedAt: "2026-10-07",
    publishedTime: "2026-10-07T08:00:00+03:30",
    published: true,
    seoTitle: "خرید CBCT دندان‌پزشکی در ایران؛ ۱۲ آزمون پذیرش",
    seoDescription:
      "راهنمای خرید CBCT دندان‌پزشکی در ایران؛ ۱۲ آزمون برای FOV، دز، فانتوم، کیفیت تصویر، وُکسل، آرتیفکت، DICOM، SAT، SLA و TCO.",
    keywords: [
      "خرید CBCT دندانپزشکی در ایران",
      "آزمون پذیرش CBCT",
      "کنترل کیفیت CBCT دندانپزشکی",
      "فانتوم CBCT",
      "FOV دستگاه CBCT",
      "دوز CBCT دندانپزشکی",
      "وُکسل CBCT",
      "DICOM دستگاه CBCT",
      "حفاظ اتاق CBCT",
      "هزینه چرخه عمر CBCT",
    ],
    sources: [
      {
        title:
          "IEC — IEC 60601‑2‑63:2012+A1:2017+A2:2021، ایمنی تجهیزات X‑ray خارج‌دهانی دندان‌پزشکی",
        url: "https://webstore.iec.ch/en/publication/68977",
      },
      {
        title:
          "FDA — شناسایی کامل IEC 60601‑2‑63 Edition 1.2 برای تجهیزات X‑ray خارج‌دهانی",
        url: "https://www.accessdata.fda.gov/scripts/cdrh/cfdocs/cfStandards/detail.cfm?standard__identification_no=42549",
      },
      {
        title:
          "FDA — IEC 61223‑3‑7:2021؛ آزمون پذیرش و پایایی Dental CBCT، به‌روزرسانی ۲۸ سپتامبر ۲۰۲۶",
        url: "https://www.accessdata.fda.gov/scripts/cdrh/cfdocs/cfstandards/detail.cfm?standard__identification_no=43271",
      },
      {
        title:
          "AAPM — گزارش TG‑261 سال ۲۰۲۴؛ پذیرش و کنترل کیفیت Dental/Maxillofacial CBCT",
        url: "https://aapm.org/pubs/reports/detail.asp?docid=279",
      },
      {
        title: "FDA — Dental Cone-beam Computed Tomography؛ کاربرد، دز و بهینه‌سازی",
        url: "https://www.fda.gov/radiation-emitting-products/medical-x-ray-imaging/dental-cone-beam-computed-tomography",
      },
      {
        title: "eCFR — 21 CFR 892.1750، طبقه‌بندی سامانه CT X‑ray",
        url: "https://www.ecfr.gov/current/title-21/chapter-I/subchapter-H/part-892/subpart-B/section-892.1750",
      },
      {
        title: "DICOM PS3.17 2026d — گردش کار Dental CT و CBCT و گزارش ساختاریافته دز",
        url: "https://dicom.nema.org/medical/dicom/current/output/chtml/part17/sect_uuuu.3.2.6.5.html",
      },
      {
        title: "سامانه ملی قوانین — آیین‌نامه تجهیزات و ملزومات پزشکی ایران",
        url: "https://qavanin.ir/Law/TreeText/?IDS=9198362936967421494",
      },
    ],
    imageCredit: "تصویر اختصاصی Clinoro، تولیدشده با OpenAI",
    imageSource:
      "https://clinoromedical.com/assets/blog/iran-dental-cbct-procurement-acceptance.webp",
    imageAlt:
      "دستگاه CBCT دندان‌پزشکی همراه فانتوم سر و دزیمتر برای آزمون پذیرش و کنترل کیفیت در اتاق تصویربرداری",
    imageLicense: "تصویر تولیدشده برای Clinoro",
  },
];
