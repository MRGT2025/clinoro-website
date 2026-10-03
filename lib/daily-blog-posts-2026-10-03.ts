export const dailyBlogPosts20261003 = [
  {
    id: "clinoro-daily-iran-emg-ncs-electromyograph-procurement-acceptance",
    slug: "iran-emg-ncs-electromyograph-procurement-acceptance",
    title: "موج تمیز در دمو کافی نیست؛ ۱۲ آزمون خرید EMG/NCS در ایران",
    excerpt:
      "سامانه EMG/NCS را با تعداد کانال یا ظاهر Waveform نخرید. این راهنمای ایران‌محور ۱۲ آزمون برای نویز، کالیبراسیون، Stimulator، الکترود، دما، پروتکل، داده، ایمنی، SAT، SLA و هزینه هر مطالعه قابل‌تفسیر ارائه می‌کند.",
    content: `یک Trace زیبا در دموی فروشنده می‌تواند از Preset آماده، فیلتر تهاجمی و محیط کم‌نویز آمده باشد؛ اما خرید زمانی قابل‌دفاع است که همان سامانه در اتاق واقعی، با کابل و الکترود قراردادی، روی بازه‌های سیگنال و تحریک موردنیاز، خروجی تکرارپذیر و قابل‌بازبینی بدهد. در EMG/NCS، چند میکروولت نویز، Ground نامناسب، دمای ثبت‌نشده، Cursor اشتباه یا Stimulator تأییدنشده می‌تواند نتیجه را تغییر دهد و مطالعه را تکراری کند.

سامانه Electrodiagnostic فقط Main unit نیست. Amplifier و Headbox، Electrical stimulator، Auditory/Visual accessories در صورت خرید پاسخ برانگیخته، Needle و Surface electrode، Ground، کابل، Footswitch، Temperature probe، Trolley، Isolation، نرم‌افزار، License، Protocol template، Report، Archive، UPS، آموزش و خدمات یک زنجیره‌اند. هر جزء باید در BOM، مجوز، آزمون پذیرش و هزینه چرخه‌عمر دیده شود.

[IEC 60601‑2‑40:2024](https://webstore.iec.ch/en/publication/68373) استاندارد جاری ایمنی پایه و عملکرد ضروری Electromyograph و Evoked response equipment است. این ویرایش در ۲۰ دسامبر ۲۰۲۴ منتشر شد، نسخه ۲۰۱۶ را جایگزین کرد و از تغییرات مهم آن افزودن الزامات Constant-voltage stimulator و روشن‌ترشدن الزامات Visual stimulator است. [IECEE TRF 60601‑2‑40D:2025](https://webstore.iec.ch/en/publication/107546) نیز فرم آزمون متناظر را برای همین ویرایش و نسخه‌های جاری IEC 60601‑1 فراهم می‌کند.

دامنه را اشتباه نگیرید: IEC صریحاً تجهیزات درمانی و TENS/EMS را که زیر IEC 60601‑2‑10 هستند از دامنه EMG تشخیصی خارج می‌کند. FDA نیز Diagnostic electromyograph را با Product Code IKN، Class II و مسیر 510(k) معرفی کرده و در صفحه به‌روزشده ۲۸ سپتامبر ۲۰۲۶، IEC 60601‑2‑40:2024 را به‌عنوان استاندارد اجماعی شناسایی‌شده نشان می‌دهد. بنابراین ظاهر مشابه Stimulator یا عبارت Biofeedback مجوز جایگزین‌کردن دستگاه درمانی با سامانه تشخیصی نیست.

> این متن راهنمای خرید، URS و پذیرش فنی است؛ انتخاب بیمار، محل Needle، شدت تحریک، تفسیر Waveform و تصمیم تشخیصی فقط بر عهده متخصص واجدصلاحیت و پروتکل بالینی مرکز است. آزمون‌های تحویل باید با Simulator، Load و ابزار کالیبره انجام شوند، نه با اعمال تحریک آزمایشی به کارکنان.

## پیش از استعلام، دامنه مطالعه را ببندید

مشخص کنید مرکز فقط Routine NCS و Needle EMG می‌خواهد یا Late response، Repetitive nerve stimulation، Blink reflex، Autonomic study، Single-fiber EMG، Quantitative EMG یا Evoked potential نیز لازم است. هر قابلیت به Amplifier، Stimulator، Accessory، Software module، Protocol، مصرفی، آموزش و شواهد جداگانه نیاز دارد.

جمعیت بزرگسال/کودک، تعداد Study روزانه، تعداد Room، Mobile use، نیاز به Remote review، اتصال به HIS/PACS، زبان Report، Retention، Backup، سطح آموزش کاربر و مرجع Reference value را در URS بنویسید. عبارت «Full option» بدون SKU، Version، Channel، Accessory و Intended use قابل خرید نیست.

## BOM را تا آخرین کابل و License قفل کنید

برای هر سیستم شماره فنی Main unit، Amplifier/Headbox، تعداد Channel، Electrical stimulator و نوع Constant-current/Constant-voltage، Probe، Footswitch، Temperature probe، Audio/Visual stimulator، Needle و Surface electrode، Ground، Lead، Cable، Adapter، Trolley، Isolation transformer، PC، Display، Printer، UPS، Database، License، Interface و Service tool را ثبت کنید.

Needle electrode و بسیاری از Consumableها مدل و کاربرد یکسان ندارند. FDA صفحه Diagnostic electromyograph needle electrode را با Product Code IKT، Class II و Regulation 890.1385 جداگانه فهرست می‌کند. سازگاری، Sterility، Single-use بودن، Lot، Expiry، Sharps disposal و موجودی پایدار باید در پیشنهاد مالی و قرارداد دیده شود.

## ۱۲ آزمون خرید و پذیرش EMG/NCS

### ۱. Intended use و مرز قابلیت‌ها را تطبیق دهید

برای هر ماژول یک ماتریس بسازید: Diagnostic EMG، NCS، EP، Intraoperative monitoring یا Rehabilitation/Biofeedback؛ نوع بیمار؛ محیط استفاده؛ کاربر؛ Channel؛ Stimulator؛ Accessory و محدودیت‌ها. متن مجوز، IFU، Datasheet و Demo باید هم‌خوان باشند.

تجهیز درمانی، TENS یا Muscle stimulator جای Stimulator تشخیصی نیست. همین‌طور سامانه IONM یا Biofeedback را صرفاً به‌دلیل داشتن ورودی EMG به‌عنوان دستگاه Routine electrodiagnostic نپذیرید. قابلیت خارج از Intended use، حتی اگر Software آن را نمایش دهد، بند معتبر خرید نیست.

### ۲. استاندارد و گزارش آزمون همان پیکربندی را بخواهید

Declaration و Test report را برای IEC 60601‑2‑40:2024، نسخه عمومی IEC 60601‑1 و Collateralهای مرتبط با همان Main unit، Amplifier، Stimulator، Power supply و Accessory قراردادی تطبیق دهید. گزارش نسخه ۲۰۱۶ یا Family مشابه باید با Gap assessment رسمی به مدل پیشنهادی متصل شود؛ عبارت «CE/IEC compliant» بدون Part، Edition، آزمایشگاه و Scope کافی نیست.

فرم آزمون IECEE 60601‑2‑40D:2025 دقیقاً برای ویرایش ۲۰۲۴ منتشر شده است. شماره Report، Edition، National deviation، Model list، Power supply، Applied part و Accessoryهای پوشش‌داده‌شده را بخواهید. اگر Visual یا Constant-voltage stimulation می‌خرید، شواهد همان قابلیت باید داخل Scope باشد.

### ۳. کف نویز و حذف Common-mode را در اتاق واقعی بسنجید

ورودی‌ها را طبق روش مصوب و با Fixture مناسب Short یا Terminate کنید و Baseline noise را در تنظیم‌های قراردادی ثبت کنید. سپس سیگنال Common-mode و Differential شناخته‌شده را با Generator ایزوله تزریق و رفتار CMRR، Saturation، Recovery و Channel-to-channel crosstalk را بررسی کنید. عدد Datasheet فقط وقتی معنا دارد که Bandwidth، Filter، Sampling، Electrode impedance و روش اندازه‌گیری مشخص باشد.

آزمون را در اتاق واقعی با چراغ، تخت برقی، Charger، UPS، شبکه و تجهیزات مجاور روشن تکرار کنید. فیلتر Notch نباید برای پنهان‌کردن Ground loop یا کابل معیوب اجباری باشد. Baseline پذیرفته‌شده هر Channel را برای کنترل‌های بعدی ذخیره کنید.

### ۴. زنجیره Acquisition را با Generator کالیبره اثبات کنید

Amplitude و Frequencyهای شناخته‌شده را در چند نقطه از بازه ورودی اعمال کنید و Gain، Time base، Polarity، Bandwidth، Sampling، Display scaling، Cursor و Export را با مقدار مرجع مقایسه کنید. Square pulse و Waveform مناسب می‌تواند Overshoot، Ringing، Clipping، Delay یا جابه‌جایی Channel را آشکار کند.

فایل Raw، Screenshot گزارش، تنظیم Generator، سریال و وضعیت کالیبراسیون ابزار، Software version و نتیجه هر Channel را ثبت کنید. یک Channel سالم نماینده کل Headbox نیست و ظاهر Waveform بدون محاسبه Error معیار قبولی محسوب نمی‌شود.

### ۵. Stimulator را روی Load، نه روی بدن، آزمون کنید

خروجی Stimulator را با Loadهای تعریف‌شده و ابزار مناسب برای Amplitude، Pulse duration، Polarity، Repetition، Train، Rise/Fall behavior و محدودیت Max output بررسی کنید. تفاوت Constant-current و Constant-voltage را در RFQ روشن کنید؛ ویرایش ۲۰۲۴ استاندارد برای Constant-voltage stimulator الزام افزوده است.

Controlها باید از افزایش ناخواسته، تحریک پیوسته، خطای Footswitch/Probe و Resume پس از Fault جلوگیری کنند. Indicator، Zero/start state، Emergency stop یا قطع سریع، کابل بیمار و رفتار در Lead باز/اتصال نامناسب را طبق IFU بیازمایید. هیچ آزمون پذیرشی مجوز عبور از حدود سازنده یا پروتکل ایمنی بالینی نیست.

### ۶. Needle، Surface electrode و کابل را جزء عملکرد بدانید

Connector، Shielding، طول کابل، Strain relief، Touch-proof بودن، Ground lead، Probe، Adapter و Consumable را با شماره فنی در BOM قفل کنید. Needleها باید بسته‌بندی سالم، Sterile، تاریخ معتبر و ردیابی Lot داشته باشند و پس از مصرف در مسیر Sharps تعیین‌شده دفع شوند. Reuse یا Re-sterilization فقط در صورت اجازه صریح سازنده و مسیر قانونی معتبر قابل طرح است.

Surface electrode، Recording lead و Ground جایگزین آزاد ندارند. تعویض برند یا جنس می‌تواند Contact impedance و Artifact را تغییر دهد. با بازوبسته‌کردن Connector، حرکت کنترل‌شده کابل و شبیه‌سازی Electrode شل، Detection و کیفیت سیگنال را بررسی کنید و حداقل موجودی Consumable را به SLA وصل کنید.

### ۷. Temperature را اندازه بگیرید و همراه مطالعه نگه دارید

سرعت هدایت، Latency و شکل Waveform به دما حساس‌اند؛ بنابراین وجود Temperature probe یا Workflow معتبر اندازه‌گیری فقط یک Accessory لوکس نیست. Accuracy و تکرارپذیری Probe را در نقاط موردنیاز با مرجع مناسب کنترل و ثبت خودکار/دستی دما را در Report آزمایش کنید.

اگر نرم‌افزار Correction یا هشدار دما دارد، Formula، محدوده اعتبار، Version و امکان مشاهده مقدار اصلی را بخواهید. سامانه نباید بدون اطلاع کاربر عدد را اصلاح کند. Warm-up تجهیز، شرایط اتاق و زمان رسیدن Probe به پایداری را در SOP مرکز تعریف کنید.

### ۸. Artifact و Recovery را با سناریوهای Failure ببینید

Cable motion، Electrode impedance بالا، Ground جدا، Mains interference، Stimulus artifact، Amplifier saturation و جابه‌جایی Lead را کنترل‌شده شبیه‌سازی کنید. سامانه باید Fault را قابل‌فهم نشان دهد، پس از رفع اشباع سریع و قابل‌پیش‌بینی Recover شود و Raw trace پیش و پس از Processing قابل‌بازبینی بماند.

Presetهای Filter را با اثر واقعی روی Amplitude، Latency و Morphology مقایسه کنید. فیلتر زیاد می‌تواند Trace را زیبا اما اطلاعات را تغییر دهد. Defaultهای قراردادی، سطح دسترسی تغییر تنظیم و Audit تغییرات را قبل از Go-live ببندید.

### ۹. Protocol و Reference value را از فروشنده «آماده» نخرید

Template باید Study type، Nerve/Muscle، Side، Site، Distance، Temperature، Stimulus، Filter، Sweep، Cursor و Comment را ساختاریافته ثبت کند. Reference value باید منبع، جمعیت، روش، واحد، Version و محدودیت داشته باشد؛ یک جدول ناشناس داخل نرم‌افزار مرجع بالینی معتبر نیست.

چند Case مصنوعی/آموزشی و مجاز را از Acquisition تا Calculation و Report اجرا کنید. Distal latency، Amplitude، Conduction velocity، F-wave یا سایر خروجی‌های قراردادی را مستقل محاسبه و با سامانه مقایسه کنید. تغییر فاصله یا Cursor باید با Traceability در نتیجه و Report منعکس شود.

### ۱۰. ایمنی بیمار دارای Implant را وارد Workflow کنید

Screening پیش از مطالعه باید Pacemaker/ICD، Deep brain stimulator، Spinal cord stimulator، Temporary lead، Anticoagulation، عفونت و سایر Contraindicationها را طبق سیاست بالینی مرکز ثبت کند. این کنترل، جای تصمیم پزشک را نمی‌گیرد؛ جلوی اجرای بی‌اطلاع Workflow را می‌گیرد.

[AANEM در ۱۲ اوت ۲۰۲۶](https://www.aanem.org/about-aanem/news-express/news/2026/08/12/patient-safety--considerations-when-performing-an-emg-ncs-on-a-patient-with-a-spinal-cord-simulator) برای بیمار دارای Spinal cord stimulator بر بررسی محل Lead و Generator، خاموش‌بودن SCS و اطمینان از پایان Trial با Lead خارجی تأکید کرده است. فرم Screening، هشدار نرم‌افزار، توقف Workflow و ثبت تصمیم متخصص را در Pilot آزمایش کنید؛ سیستم نباید با یک تیک پیش‌فرض این ریسک را پنهان کند.

### ۱۱. Raw data، Report و خروج از قفل فروشنده را بسنجید

از Patient registration تا Acquisition، Review، Annotation، Measurement، Report، Sign-off، Archive، Backup و Restore یک مسیر End-to-end اجرا کنید. شناسه بیمار، Laterality، Study time، User، Device serial، Software version و تغییر Cursor/Annotation باید قابل‌ردیابی باشد.

Export فقط PDF نیست. Raw waveform، Event/Marker، Setting، Measurement، Report و Metadata را در فرمت مستند و قابل‌بازیابی بخواهید. قطع شبکه، پرشدن Storage، خاموشی ناگهانی، Duplicate patient و Restore روی Workstation جایگزین را بیازمایید. License منقضی نباید مانع دسترسی قانونی مرکز به سوابق قبلی شود.

### ۱۲. Pilot، SAT، SLA و پرداخت را به Study قابل‌تفسیر وصل کنید

Pilot را با Mix واقعی Study، کاربر، Room، Consumable و Shift اجرا کنید. KPIها را از ابتدا بنویسید: Setup failure، Noise rejection، Repeat acquisition، Stimulator fault، Consumable failure، Report turnaround، Data recovery، Help-desk response و Downtime. AANEM در معیارهای اعتباربخشی خود فقط دستگاه را نمی‌بیند؛ Staff، Facility، Equipment، Protocol، Report و Patient-safety policy را کنار هم ارزیابی می‌کند.

SAT باید Baseline هر Channel، Amplifier، Stimulator، Probe و Software version را ثبت کند. SLA را برای Calibration، Preventive maintenance، Loaner، Cable/Headbox، Consumable، Software support، Backup/restore، Cybersecurity و End-of-support جدا کنید. پرداخت نهایی را به قبولی SAT/Pilot، آموزش، تحویل Service document و بسته‌شدن Punch list گره بزنید.

## ماتریس پذیرش کوتاه

- دامنه: EMG/NCS/EP و Intended use روشن؛ نه عنوان مبهم Neurodiagnostic.
- استاندارد: IEC 60601‑2‑40:2024 و Scope همان Config؛ نه گواهی نسخه قدیمی بدون Gap assessment.
- نویز: Baseline و Common-mode در اتاق واقعی؛ نه Trace آماده فروشنده.
- Acquisition: Gain، Time، Frequency، Cursor و Export با Generator؛ نه نگاه چشمی.
- تحریک: خروجی روی Load و رفتار Fault؛ نه آزمون روی کاربر.
- مصرفی: Needle/Electrode/Cable با Lot، Expiry و سازگاری؛ نه برند قابل‌تعویض.
- دما: Probe، ثبت و Workflow؛ نه عدد حفظ‌شده توسط اپراتور.
- داده: Raw waveform، Audit، Backup و Restore؛ نه PDF تنها.
- خدمت: Calibration، Loaner، Consumable، Software و Exit؛ نه گارانتی Main unit.

## پنج عددی که قیمت خرید پنهان می‌کند

First-pass interpretable rate = مطالعات پذیرفته‌شده بدون تکرار Acquisition ÷ کل مطالعات

Repeat rate = مطالعات تکرارشده به‌علت Noise، Cable، Electrode، Setting، Stimulator یا Data ÷ کل مطالعات

Downtime cost = ساعت توقف × Study از‌دست‌رفته در ساعت × حاشیه عملیاتی هر Study

هزینه هر مطالعه قابل‌تفسیر = سرمایه + Consumable + Calibration + Service + License + نیروی انسانی + Repeat + Downtime ÷ Study پذیرفته‌شده

TCO = خرید + Accessory + Needle/Electrode + PC/UPS + License + Training + PM/Calibration + Repair/Loaner + Cybersecurity + Data exit

سامانه ارزان با Headbox پرنویز، کابل کمیاب، Needle اختصاصی یا License بسته می‌تواند هزینه هر Study پذیرفته‌شده را از گزینه گران‌تر بیشتر کند. قیمت را بر اساس Volume و Mix واقعی مرکز محاسبه کنید.

## پرونده‌ای که باید هنگام تحویل بگیرید

- URS و ماتریس EMG/NCS/EP، جمعیت، Study و Workflow
- مجوز مدل، Intended use و مدارک تأمین‌کننده/خدمات مجاز در ایران
- IEC 60601‑2‑40:2024، Test report، Scope و Gap assessment
- BOM، Serial، Firmware، Software، License، Accessory و Consumable
- Protocol نویز، Acquisition، Stimulator، Temperature و Result خام
- Baseline هر Channel/Headbox، ابزار آزمون و گواهی کالیبراسیون
- Reference value، Protocol template، Report و Change control
- Patient screening، Implant policy، Infection control و Sharps SOP
- Data dictionary، Export، Backup/restore، Audit و Exit plan
- Pilot، SAT، Training، Punch list، SLA و End-of-support

## دوازده علامت توقف خرید

نسخه ۲۰۱۶ بدون Gap assessment، Stimulator درمانی به‌جای تشخیصی، Demo فقط با Preset آماده، نویز بدون روش اندازه‌گیری، آزمون Stimulator روی بدن، Needle خارج BOM، Temperature بدون ثبت، Reference value بدون منبع، Report بدون Raw trace، License مانع دسترسی به سابقه، SLA بدون Loaner و پرداخت کامل پیش از SAT دوازده دلیل روشن برای توقف‌اند.

## جمع‌بندی

EMG/NCS بهتر دستگاهی نیست که فقط Channel بیشتر یا Waveform زیباتری دارد. سامانه بهتر در اتاق واقعی نویز کنترل‌شده دارد، Acquisition و Stimulator آن با ابزار کالیبره اثبات می‌شود، Temperature و Setting را قابل‌ردیابی نگه می‌دارد، Consumable پایدار دارد، Raw data را حفظ می‌کند و در خرابی و خروج از قرارداد مرکز را گروگان نمی‌گیرد.

برای تدوین URS، مقایسه پیشنهادها، طراحی SAT/Pilot، ارزیابی Accessory و Consumable و محاسبه هزینه هر Study، از [خدمات تأمین Clinoro](/procurement) شروع کنید یا [فهرست Studyها، Volume، پیکربندی و پیشنهاد فروشندگان را برای بررسی ارسال کنید](/contact). خروجی می‌تواند یک Decision Pack شامل ماتریس فنی، پروتکل آزمون، سناریوهای Failure، SLA و مدل TCO باشد.`,
    image: "/assets/blog/iran-emg-ncs-electromyograph-procurement-acceptance.webp",
    category: "ایران؛ EMG/NCS، الکترودیاگنوز و پذیرش فنی",
    author: "تیم مهندسی پزشکی Clinoro",
    publishedAt: "2026-10-03",
    publishedTime: "2026-10-03T08:00:00+03:30",
    published: true,
    seoTitle: "خرید EMG/NCS در ایران؛ ۱۲ آزمون پذیرش و TCO",
    seoDescription:
      "راهنمای خرید EMG/NCS در ایران؛ ۱۲ آزمون برای نویز، کالیبراسیون، Stimulator، الکترود، دما، داده، ایمنی، SAT، SLA و هزینه هر مطالعه.",
    keywords: [
      "خرید دستگاه EMG در ایران",
      "خرید EMG NCS",
      "آزمون پذیرش الکترومیوگراف",
      "IEC 60601-2-40:2024",
      "کالیبراسیون دستگاه EMG",
      "تست Stimulator دستگاه NCS",
      "الکترود سوزنی EMG",
      "نویز دستگاه نوار عصب و عضله",
      "هزینه چرخه عمر EMG NCS",
    ],
    sources: [
      {
        title: "IEC — IEC 60601-2-40:2024، ایمنی و عملکرد Electromyograph و Evoked response equipment",
        url: "https://webstore.iec.ch/en/publication/68373",
      },
      {
        title: "IEC — IECEE TRF 60601-2-40D:2025، فرم آزمون ویرایش ۲۰۲۴",
        url: "https://webstore.iec.ch/en/publication/107546",
      },
      {
        title: "FDA — Diagnostic electromyograph، Product Code IKN و شناسایی IEC 60601-2-40:2024",
        url: "https://www.accessdata.fda.gov/scripts/cdrh/cfdocs/cfpcd/classification.cfm?id=IKN",
      },
      {
        title: "FDA — Diagnostic electromyograph needle electrode، Product Code IKT",
        url: "https://www.accessdata.fda.gov/scripts/cdrh/cfdocs/cfpcd/classification.cfm?id=IKT",
      },
      {
        title: "AANEM — معیارهای اعتباربخشی آزمایشگاه EDX؛ تجهیزات، پروتکل، گزارش و ایمنی بیمار",
        url: "https://www.aanem.org/certification-accreditation/edx-laboratory-accreditation/faqs",
      },
      {
        title: "AANEM — ایمنی EMG/NCS در بیمار دارای Spinal cord stimulator، ۱۲ اوت ۲۰۲۶",
        url: "https://www.aanem.org/about-aanem/news-express/news/2026/08/12/patient-safety--considerations-when-performing-an-emg-ncs-on-a-patient-with-a-spinal-cord-simulator",
      },
      {
        title: "سامانه ملی قوانین — آیین‌نامه تجهیزات و ملزومات پزشکی ایران",
        url: "https://qavanin.ir/Law/TreeText/?IDS=9198362936967421494",
      },
      {
        title: "WHO — راهنمای فرایند تدارکات فناوری و تجهیزات پزشکی",
        url: "https://www.who.int/publications/i/item/9789241501378",
      },
    ],
    imageCredit: "تصویر اختصاصی Clinoro، تولیدشده با OpenAI",
    imageSource:
      "https://clinoromedical.com/assets/blog/iran-emg-ncs-electromyograph-procurement-acceptance.webp",
    imageAlt:
      "سامانه EMG و NCS چندکاناله کنار Stimulator، الکترودها و مولد موج کالیبره برای آزمون پذیرش فنی",
    imageLicense: "تصویر تولیدشده برای Clinoro",
  },
];
