export const dailyBlogPosts20260831 = [
  {
    id: "clinoro-daily-mri-system-procurement-acceptance-2026",
    slug: "mri-system-procurement-acceptance-2026",
    title: "قیمت مگنت، قیمت پروژه نیست؛ ۱۲ کنترل خرید MRI پیش از اولین اسکن",
    excerpt:
      "خرید MRI از انتخاب تسلا و قطر دهانه فراتر می‌رود. این راهنما نیاز بالینی، میدان حاشیه‌ای، RF Shield، Quench، کویل و نرم‌افزار، آزمون مستقل، QA، SLA، ظرفیت و هزینه چرخه‌عمر را به ۱۲ کنترل قراردادی تبدیل می‌کند.",
    content: `قیمت MRI روی پیش‌فاکتور معمولاً قیمت «مگنت و پیکربندی اصلی» است، نه قیمت یک خدمت تصویربرداری آماده و پایدار. طراحی سوئیت، RF Shield، کنترل میدان حاشیه‌ای، Quench pipe، برق و سرمایش، کویل‌ها، نرم‌افزار، تجهیزات MR Conditional، آزمون پذیرش، آموزش، نگهداری و توقف خدمت می‌توانند تصمیم اقتصادی را کاملاً عوض کنند.

این موضوع در سال ۲۰۲۶ راهنمای تازه و مستقیمی دارد. [ویرایش پنجم راهنمای ایمنی MRI سازمان MHRA بریتانیا](https://www.gov.uk/government/publications/safety-guidelines-for-magnetic-resonance-imaging-equipment-in-clinical-use) در ژوئیه ۲۰۲۶ منتشر و در ۱۳ اوت ۲۰۲۶ اصلاح شد. خود MHRA می‌گوید این راهنما ملاحظات پیش از خرید و پس از نصب را پوشش می‌دهد و چرخه را از Business case و انتخاب سایت تا خرید، نصب، پذیرش، نگهداری و خروج از خدمت می‌بیند.

[IEC 60601-2-33:2022](https://webstore.iec.ch/en/publication/67211) نیز الزامات ایمنی پایه و عملکرد ضروری تجهیزات MRI تشخیصی را برای حفاظت بیمار و کارکنان MRI تعریف می‌کند؛ نسخه عرضه‌شده IEC اکنون اصلاحات نوامبر ۲۰۲۵ و Interpretation sheetهای ۲۰۲۳ و ۲۰۲۵ را در خود دارد. بنابراین عبارت کلی «مطابق IEC» کافی نیست: خریدار باید نسخه، پیکربندی و مدارک انطباق همان سیستم را مشخص کند.

> این مقاله چارچوب خرید و پذیرش فنی است، نه پروتکل اسکن یا توصیه برای یک برند و Field strength. معیارهای عملکرد، حدود میدان، آزمون‌های فیزیک، Operating mode و شرایط استفاده از Implant باید از استاندارد جاری، IFU همان مدل، مقررات محل نصب و برنامه ایمنی مصوب مرکز استخراج شوند.

## ۱۲ کنترل پیش از قرارداد و Go-Live

### ۱. خدمت بالینی را پیش از عدد Tesla تعریف کنید

فهرست واقعی ارجاعات را بنویسید: مغز و ستون فقرات، اسکلتی‌عضلانی، شکم و لگن، قلب، Breast، کودکان، بیهوشی، اورژانس، Oncology، Spectroscopy یا Advanced diffusion. برای هر گروه، حجم ماهانه، زمان هدف، کیفیت مورد نیاز، وزن و ابعاد بیمار، نیاز به Contrast و تجهیزات همراه را ثبت کنید.

Field strength بالاتر به‌تنهایی پاسخ خرید نیست. باید اثر آن بر کاربردهای هدف، Artifact، Implant workflow، SAR، سرعت، کویل، هزینه زیرساخت و مهارت کاربر مقایسه شود. [راهنمای فنی NHS برای MRI پستان، به‌روزشده ۲۳ مارس ۲۰۲۶](https://www.gov.uk/government/publications/nhs-breast-screening-using-mri-with-higher-risk-women/technical-guidelines-for-mri-for-the-surveillance-of-women-at-higher-risk-of-developing-breast-cancer) برای همان کاربرد، هم ۱.۵ و هم ۳ تسلا را می‌پذیرد اما بر کویل اختصاصی و QC منظم سیستم و کویل تأکید می‌کند. پیام خریدار روشن است: قابلیت باید برای Use case و Workflow اثبات شود، نه با یک عدد بزرگ‌تر.

### ۲. تیم پروژه و مرز مسئولیت را پیش از RFP ببندید

MRI پروژه یک واحد نیست. Radiologist، MRI technologist، MR clinical scientist یا فیزیک‌پزشکی، MR Safety Expert، مهندسی پزشکی، تأسیسات، IT/PACS، کنترل عفونت، بیهوشی، آتش‌نشانی، معماری، سازه، RF و magnetic shielding و خرید باید از طراحی نیازمندی تا پذیرش حضور داشته باشند.

[راهنمای MHRA 2026](https://assets.publishing.service.gov.uk/media/6a7dca8b1f783fe89daaa258/MHRA_MRI_Guidance_v5-0-02.pdf) همین رویکرد چندتخصصی را توصیه می‌کند و حضور MR Safety Expert را در تیم پروژه لازم می‌داند. در Responsibility matrix مشخص کنید چه کسی طراحی میدان، Shielding، Quench، برق، Chiller، Interface، Training، آزمون و مجوز Go-Live را تأیید می‌کند. عبارت «Site preparation by customer» بدون نقشه و معیار تحویل، منشأ اختلاف است.

### ۳. مدل، نرم‌افزار و BOM قابل تحویل را قفل کنید

مدل مگنت، Field strength، Bore، Gradient amplitude و Slew rate، RF architecture، تعداد کانال‌های فعال، میز، کویل، Workstation، Reconstruction hardware، نسخه نرم‌افزار، Application package، DICOM option، UPS interface، Chiller و ابزار QA را با Part number و نسخه بنویسید. نام خانواده محصول یا «آخرین نسخه هنگام تحویل» مرز قرارداد نیست.

مجوز و Intended Use باید برای همان Hardware، Software و کویل بررسی شوند. مجوز پایه الزاماً Sequence پژوهشی، AI package، Cardiac package، Sedation monitoring یا تجهیزات جانبی را پوشش نمی‌دهد. هر Subscription، محدودیت تعداد کاربر، Credit-based reconstruction، Remote license و هزینه Upgrade باید در پیشنهاد مالی دیده شود.

### ۴. میدان حاشیه‌ای، Zoneها و دسترسی را روی پلان واقعی ببینید

از هر فروشنده نقشه سه‌بعدی Fringe field برای پیکربندی پیشنهادی، درها، سقف، کف و فضاهای مجاور را بخواهید. آسانسور، پارکینگ، مسیر عمومی، اتاق‌های بالا و پایین، CT/PET، تجهیزات حساس، Transformer، پله فرار و مسیر ورود سرویس را روی همان نقشه تطبیق دهید. ادعای «Active shielded» جای Field plot و بررسی سازه نیست.

[راهنمای ایمنی ACR در نسخه ۲۰۲۶](https://www.acr.org/Clinical-Resources/Clinical-Tools-and-Reference/radiology-safety/mr-safety) بر Zoneهای کنترل‌شده، جلوگیری از ورود فرد Screen‌نشده و اجسام Ferromagnetic و نگهداری دوره‌ای در Zone IV تأکید دارد. مسیر بیمار، همراه، خدمات، نظافت، آتش‌نشانی و تعویض قطعات باید بدون شکستن کنترل دسترسی طراحی شود. Ferromagnetic detection کمک است، نه جایگزین Screening.

### ۵. RF Shield و سازگاری سایت را قبل از نصب مگنت تحویل بگیرید

کابین RF، در، پنجره، Penetration panel، Waveguide، فیلتر برق، HVAC و تمام نفوذی‌ها یک سامانه‌اند. معیار Attenuation، روش آزمون، فرکانس‌ها، مسئول اصلاح، Baseline و ضمانت افت عملکرد را قرارداد کنید. هر سوراخ، کابل یا تغییر تأسیساتی آینده باید Change control داشته باشد.

هم‌جواری چند MRI می‌تواند Cross-talk بسازد و تجهیزات یا سازه Ferromagnetic می‌توانند Homogeneity را مختل کنند. MHRA می‌خواهد پذیرش Engineering services از جمله Shielding پیش از نصب دستگاه انجام شود. پرداخت مربوط به Site readiness را به گزارش اندازه‌گیری مستقل و رفع Punch list گره بزنید، نه صرفاً تحویل اتاق.

### ۶. Cryogen، Quench و فشار اتاق را یک بسته ایمنی بدانید

میان مگنت Conventional superconducting، Low-helium sealed و فناوری‌های دیگر فقط حجم Helium را مقایسه نکنید. سناریوی Quench، زمان افت میدان، مسیر تخلیه، Active exhaust، Passive pressure relief، Oxygen monitoring، بازیابی خدمت، هزینه Re-ramp و دسترسی تیم اضطراری برای هر مدل متفاوت است.

راهنمای MHRA که در اوت ۲۰۲۶ اصلاح شده، طراحی و نصب Quench pipe مطابق دستور سازنده، خروجی ایمن، علامت‌گذاری مسیر، حفاظت در برابر انسداد و بازرسی دوره‌ای را جدا از PM معمول Vendor مطرح می‌کند. [خلاصه تغییرات راهنمای ACR در مارس ۲۰۲۶](https://edge.sitecorecloud.io/americancoldf5f-acrorgf92a-productioncb02-3650/media/ACR/Files/Clinical/Radiology-Safety/Changes-to-ACR-Manual-on-MR-Safety.pdf) نیز بر Passive pressure relief مستقل برای کاهش خطر محبوس‌شدن ناشی از فشار مثبت تأکید دارد. نقشه، محاسبه، Declaration نصاب و Drill اضطراری باید تحویل‌دادنی باشند.

### ۷. برق، سرمایش و Availability را با بار واقعی بسنجید

توان لحظه‌ای و متوسط، کیفیت برق، Earthing، UPS مورد نیاز کنسول و سامانه‌های ایمنی، Chiller، Water quality، HVAC، Temperature/humidity و Heat rejection را برای Sequenceهای واقعی بگیرید. برنامه قطع برق باید تفاوت Emergency Power Off و Emergency Magnet Off را برای کارکنان روشن کند؛ این دو دکمه یک کار انجام نمی‌دهند.

تک‌نقطه‌های خرابی را فهرست کنید: Chiller pump، Compressor/cold head، RF amplifier، Gradient، در RF، Workstation، شبکه و Coil. برای هرکدام Alarm، Remote monitoring، قطعه محلی، زمان بازیابی و حالت ایمن تعریف شود. Uptime مگنت وقتی اتاق گرم، در خراب یا کویل لازم مردود است، ظرفیت قابل فروش نیست.

### ۸. کویل و Workflow را با Phantom و نمونه پروتکل ارزیابی کنید

فهرست کویل‌ها را با Case mix تطبیق دهید: Head/neck، Spine، Body، Flex، Knee، Shoulder، Breast، Cardiac یا Pediatric. تعداد Element اسمی کافی نیست؛ پوشش آناتومیک، SNR، Parallel imaging، تعویض کویل، وزن، کابل، Cleaning، Connector life و امکان اسکن بیمار بزرگ‌تر باید ارزیابی شود.

با Phantom و پروتکل‌های مرجع، Prescan، Positioning، Auto coil selection، Fat suppression، Motion correction و Reconstruction را در Workflow واقعی اجرا کنید. راهنمای NHS 2026 ثبت Baseline هر Coil element، استفاده از QC سازنده و اقدام هنگام خروج از Tolerance را برای MRI پستان توضیح می‌دهد. همین منطق خریدارمحور را برای کویل‌های بحرانی مرکز به معیار تحویل تبدیل کنید.

### ۹. ایمنی بیمار و تجهیزات همراه را بخشی از خرید کنید

[FDA](https://www.fda.gov/radiation-emitting-products/mri-magnetic-resonance-imaging/benefits-and-risks) خطرهای ویژه محیط MRI را شامل جذب اجسام، Heating و Burn، تحریک عصب، نویز، اختلال Implant یا تجهیزات فعال و افت کیفیت تصویر می‌داند. دستگاه یا Implant با وضعیت ناشناخته نباید ایمن فرض شود و MR Conditional فقط در Conditions مشخص خود معتبر است.

پکیج پروژه باید شامل Screening workflow، Implant database access، Hearing protection، Patient communication، MR Conditional monitor، Injector، Ventilator یا Anaesthesia equipment در صورت نیاز، Trolley و Wheelchair مناسب، Rescue equipment، Signage و آموزش باشد. در سناریوی احیا باید بیمار سریع از Zone IV خارج شود؛ تجهیز احیا را بی‌محابا کنار مگنت نبرید.

### ۱۰. SAT و پذیرش مستقل را از Demo فروشنده جدا کنید

فروشنده باید انطباق با Specification قراردادی و مشخصات عملکرد خود را مستند کند، اما این پایان پذیرش نیست. MHRA قویاً آزمون مستقل توسط MR Clinical Scientist را توصیه می‌کند تا عملکرد مستقل سنجیده، Baseline برنامه QA ساخته و اقدام اصلاحی پیش از استفاده بالینی مشخص شود.

پروتکل باید حداقل هویت Hardware/Software، ایمنی الکتریکی، RF cabin، Fringe field، Noise، Table، Intercom، Emergency systems، Homogeneity، SNR، Geometric accuracy، Slice thickness، Uniformity، Ghosting، Artifact و کویل‌ها را با Phantom شناخته‌شده پوشش دهد. معیار، ابزار، Raw result، Tolerance، Pass/Fail و Punch list ثبت شوند. شروع گارانتی و پرداخت نهایی را به SAT، پذیرش مستقل، آموزش و امضای Go-Live گره بزنید.

### ۱۱. داده، اتصال و Upgrade را بدون قفل‌شدگی قرارداد کنید

DICOM Storage، Worklist، MPPS، Structured report، Dose/exposure data در صورت کاربرد، PACS/VNA، Export خام یا قابل تحلیل، Compression، Time sync و Patient reconciliation را End-to-end آزمون کنید. حجم Seriesهای پیشرفته و زمان Reconstruction را با شبکه واقعی مرکز بسنجید.

Remote service، Log access، Account، Patch، Backup/restore، Cybersecurity، End-of-support و اثر Upgrade بر پروتکل، Calibration، AI و Interface باید Change control داشته باشند. مالکیت Protocolها، داده QA و Export هنگام تعویض Vendor را روشن کنید. «PACS ready» بدون License، Conformance statement و آزمون Workflow یک ادعای ناقص است.

### ۱۲. TCO را به اسکن قابل گزارش تبدیل کنید

قیمت مگنت، حمل و Rigging، تخریب و ساخت، Shielding، Quench، برق، Chiller، HVAC، Helium، کویل، نرم‌افزار، لایسنس، Contrast workflow، QA، فیزیک‌پزشکی، آموزش، بیمه، مصرف انرژی، سرویس، قطعه، Upgrade و Downtime را برای افق قرارداد جمع کنید. هزینه Delay پروژه و Referral هنگام توقف را نیز وارد کنید.

**هزینه هر اسکن قابل گزارش = کل هزینه مالکیت و بهره‌برداری دوره ÷ تعداد اسکن‌هایی که با کیفیت مصوب تکمیل، گزارش و تحویل می‌شوند**

این شاخص را برای Ramp-up، حجم پایه و حجم بالا محاسبه کنید. Throughput بروشور را بدون زمان تعویض بیمار، Screening، Coil change، Contrast، بیهوشی، Cleaning، Repeat و خرابی وارد مدل نکنید. در Exit plan، End-of-support، Decommissioning مگنت، Cryogen، انتقال داده، جمع‌آوری Shield و مسئولیت سازه را ببندید.

## پرونده‌ای که پیش از Go-Live باید کامل باشد

- Intended Use، مجوز و Configuration دقیق Hardware/Software
- Clinical requirement و ماتریس پروتکل، Coil و حجم
- Fringe-field plot، RF و Magnetic shielding report
- نقشه Quench، Pressure relief، Exhaust و Oxygen monitoring
- Load schedule برق، Chiller، HVAC و شرایط محیطی
- BOM کامل، License و تاریخ End-of-support
- DICOM conformance و گزارش آزمون PACS/Worklist
- SAT فروشنده و پذیرش مستقل با Baseline QA
- گزارش همه Coilها و Phantomهای تحویلی
- MR safety policy، Screening و Emergency drills
- سوابق آموزش و Competency تیم‌ها
- SLA، TCO، Business continuity و Exit plan

## هشت علامت توقف خرید

انتخاب Tesla پیش از تعریف خدمت، Site drawing بدون Fringe field، مسئولیت مبهم Quench، RF Shield بدون Acceptance criterion، کویل بدون QC مستقل، Software option بدون License term، تحویل بدون MR Clinical Scientist و SLA بدون Chiller/Coil/Downtime، هرکدام دلیل توقف ارزیابی و تکمیل پیشنهادند.

## جمع‌بندی و اقدام بعدی

MRI یک مگنت مستقل نیست؛ ترکیب فناوری تصویربرداری، ساختمان، ایمنی، فیزیک، IT و عملیات است. خرید زمانی قابل دفاع می‌شود که سیستم در سایت واقعی، با کویل و پروتکل واقعی، به کیفیت قابل سنجش برسد و هزینه توقف و خروج آن نیز از ابتدا معلوم باشد.

برای تهیه Requirement matrix، مقایسه پیکربندی MRI، چک‌لیست Site readiness، پروتکل SAT و مدل TCO، از [خدمات تأمین Clinoro](/procurement) شروع کنید یا [پیشنهادها و نقشه سایت را برای بررسی ارسال کنید](/contact). Case mix، حجم سالانه، Field strengthهای پیشنهادی، کویل‌ها، Site plan، Scope ساخت، نرم‌افزارها و تاریخ هدف Go-Live را ضمیمه کنید تا تصمیم روی داده واقعی پروژه بنا شود.`,
    image: "/assets/blog/mri-system-procurement-acceptance-2026.webp",
    category: "جهانی؛ MRI، ایمنی و خرید تجهیزات تصویربرداری",
    author: "تحریریه Clinoro",
    publishedAt: "2026-08-31",
    publishedTime: "2026-08-31T08:00:00+03:30",
    published: true,
    seoTitle: "خرید MRI؛ ۱۲ کنترل پیش از قرارداد و اولین اسکن",
    seoDescription:
      "راهنمای خرید MRI؛ نیاز بالینی، میدان حاشیه‌ای، RF Shield، Quench، کویل، نرم‌افزار، پذیرش مستقل، QA، SLA و هزینه چرخه‌عمر.",
    keywords: [
      "خرید دستگاه MRI",
      "آزمون پذیرش MRI",
      "هزینه پروژه MRI",
      "RF Shield MRI",
      "Quench pipe MRI",
      "کویل MRI",
      "کنترل کیفیت MRI",
      "SLA دستگاه MRI",
    ],
    sources: [
      {
        title:
          "MHRA — Safety Guidelines for MRI Equipment in Clinical Use، ویرایش پنجم؛ اصلاح ۱۳ اوت ۲۰۲۶",
        url: "https://www.gov.uk/government/publications/safety-guidelines-for-magnetic-resonance-imaging-equipment-in-clinical-use",
      },
      {
        title:
          "MHRA — متن کامل ویرایش پنجم راهنمای ایمنی MRI، نسخه V5.0.2 اوت ۲۰۲۶",
        url: "https://assets.publishing.service.gov.uk/media/6a7dca8b1f783fe89daaa258/MHRA_MRI_Guidance_v5-0-02.pdf",
      },
      {
        title:
          "IEC 60601-2-33:2022 — ایمنی پایه و عملکرد ضروری MRI تشخیصی؛ نسخه اصلاح‌شده نوامبر ۲۰۲۵",
        url: "https://webstore.iec.ch/en/publication/67211",
      },
      {
        title: "ACR — Manual on MR Safety 2026 و منابع جاری ایمنی MRI",
        url: "https://www.acr.org/Clinical-Resources/Clinical-Tools-and-Reference/radiology-safety/mr-safety",
      },
      {
        title: "ACR — خلاصه تغییرات Manual on MR Safety، مارس ۲۰۲۶",
        url: "https://edge.sitecorecloud.io/americancoldf5f-acrorgf92a-productioncb02-3650/media/ACR/Files/Clinical/Radiology-Safety/Changes-to-ACR-Manual-on-MR-Safety.pdf",
      },
      {
        title: "FDA — Benefits and Risks of MRI؛ Implant، Heating، Burn، Noise و Projectile",
        url: "https://www.fda.gov/radiation-emitting-products/mri-magnetic-resonance-imaging/benefits-and-risks",
      },
      {
        title:
          "NHS Breast Screening — Technical guidelines and MRI quality control، ۲۳ مارس ۲۰۲۶",
        url: "https://www.gov.uk/government/publications/nhs-breast-screening-using-mri-with-higher-risk-women/technical-guidelines-for-mri-for-the-surveillance-of-women-at-higher-risk-of-developing-breast-cancer",
      },
    ],
    imageCredit: "تصویر اختصاصی Clinoro، تولیدشده با OpenAI",
    imageSource:
      "https://clinoromedical.com/assets/blog/mri-system-procurement-acceptance-2026.webp",
    imageAlt:
      "متخصص فیزیک MRI، رادیولوژیست، کارشناس تصویربرداری و مهندس تأسیسات در حال پذیرش فنی دستگاه MRI با فانتوم کنترل کیفیت",
    imageLicense: "تصویر تولیدشده برای Clinoro",
  },
];
