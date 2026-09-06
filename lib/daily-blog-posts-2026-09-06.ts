export const dailyBlogPosts20260906 = [
  {
    id: "clinoro-daily-medical-device-software-license-vendor-lock-in-2026",
    slug: "medical-device-software-license-vendor-lock-in-2026",
    title:
      "قابلیتی نخرید که فردا خاموش شود؛ ۱۲ بند لایسنس و خروج تجهیزات پزشکی",
    excerpt:
      "قیمت دستگاه بدون مدت لایسنس، حق به‌روزرسانی، تاریخ پایان پشتیبانی، وابستگی ابری و امکان خروج از قفل فروشنده کامل نیست. این راهنما ۱۲ بند قراردادی برای خرید قابلیت نرم‌افزاریِ قابل‌استفاده در تمام عمر تجهیز ارائه می‌کند.",
    content: `یک تجهیز می‌تواند از نظر سخت‌افزار کاملاً سالم باشد و بااین‌حال به‌دلیل انقضای License، قطع Subscription، ازکارافتادن License server، پایان پشتیبانی سیستم‌عامل یا بسته‌شدن Cloud vendor بخشی از قابلیت بالینی خود را از دست بدهد. عبارت‌هایی مانند «AI ready»، «PACS compatible»، «Remote service included» یا «همه Optionها فعال» تا زمانی که به Part number، مدت، تعداد کاربر یا دستگاه، حق Update و سناریوی خروج متصل نشده‌اند، دارایی قابل‌تحویل نیستند.

این مقاله درباره کنترل تجاری و عملیاتی نرم‌افزار در خرید تجهیز است. برای طراحی کنترل‌های فنی شبکه و امنیت، [چک‌لیست امنیت تجهیزات پزشکی متصل](/blog/connected-medical-device-cybersecurity-checklist-2026) و برای آزمون Interface، [راهنمای پذیرش اتصال تجهیز](/blog/medical-device-interoperability-acceptance-2026) را جداگانه ببینید.

نکته تازه برای قراردادهای امسال این است که FDA در [۳ فوریه ۲۰۲۶ نسخه جدید راهنمای امنیت سایبری تجهیزات پزشکی](https://www.fda.gov/regulatory-information/search-fda-guidance-documents/cybersecurity-medical-devices-quality-management-system-considerations-and-content-premarket) را صادر و نسخه ۲۷ ژوئن ۲۰۲۵ را جایگزین کرد. این راهنما چرخه نرم‌افزار را فقط تا فروش نمی‌بیند: طراحی، توسعه، انتشار، پشتیبانی و خروج از خدمت را در یک چارچوب امن محصول قرار می‌دهد و صریحاً به حفظ Licenseهای شخص ثالث در کل عمر پشتیبانی و برنامه جایگزین برای توقف پشتیبانی تأمین‌کننده اشاره می‌کند.

[IMDRF N73](https://www.imdrf.org/sites/default/files/2023-04/Principles%20and%20Practices%20for%20Software%20Bill%20of%20Materials%20for%20Medical%20Device%20Cybersecurity%20%28N73%29.pdf) نیز توضیح می‌دهد که SBOM پیش از خرید و نصب به مرکز درمانی کمک می‌کند نرم‌افزار قدیمی یا رو به پایان عمر را ببیند. نتیجه خریدی روشن است: نام قابلیت روی بروشور کافی نیست؛ خریدار باید حق استفاده، حق نگهداری و حق خروج را هم تحویل بگیرد.

> این مقاله چارچوب خرید و قرارداد است، نه تفسیر حقوقی یا مجوزی برای تغییر نرم‌افزار پزشکی. هر Update، Migration یا تغییر Configuration باید با IFU، مقررات محل استفاده، مدیریت ریسک، کنترل تغییر و Validation متناسب با کاربرد بالینی انجام شود.

## چرا «لایسنس دائمی» هم ممکن است دائمی نباشد؟

Perpetual معمولاً فقط مدت حق استفاده را توصیف می‌کند؛ ممکن است Maintenance، وصله امنیتی، نسخه بعدی، Support، Cloud storage، اتصال API، الگوریتم، Concurrent user یا فعال‌سازی دوباره سخت‌افزار را پوشش ندهد. از طرف دیگر، Subscription ممکن است Update و Support را شامل شود اما پس از قطع پرداخت، Viewer، Export یا حتی دسترسی به سوابق را محدود کند. هیچ‌کدام ذاتاً خوب یا بد نیست؛ خطر وقتی آغاز می‌شود که Meter، مدت، وابستگی و رفتار پایان قرارداد تعریف نشده باشد.

راهنمای فوریه ۲۰۲۶ FDA، «امکان به‌روزرسانی و وصله امن و به‌موقع» را یکی از اهداف امنیتی می‌داند. همین راهنما توصیه می‌کند Patch امنیتی از چرخه Feature update مستقل باشد، Licenseهای شخص ثالث در تمام عمر پشتیبانی حفظ شوند و برای توقف فعالیت یا پشتیبانی شرکت ثالث برنامه جایگزین وجود داشته باشد. این توصیه‌ها برای خریدار حکم مستقیم قراردادی در همه کشورها نیستند، اما معیار دقیقی برای کشف هزینه و ریسک پنهان می‌سازند.

## ۱۲ بند قراردادی پیش از سفارش

### ۱. قابلیت را به Entitlement قابل‌ردیابی تبدیل کنید

هر قابلیت را در BOM با نام فنی، Part number یا SKU، نسخه، محل اجرا و وابستگی سخت‌افزاری بنویسید. مشخص کنید فعال‌سازی روی خود دستگاه، Console، Server، Workstation، Gateway، Cloud tenant یا حساب کاربر انجام می‌شود. Demo، Trial و Option قرضی باید جدا از اقلام تحویلی علامت بخورند.

برای هر Entitlement یک آزمون پذیرش تعریف کنید: چه ورودی‌ای داده می‌شود، چه خروجی‌ای باید دیده یا Export شود، چه کسی آزمون می‌کند و Pass/Fail چیست. Screenshot صفحه فروشنده یا تیک سبز منو، جای نتیجه عملکردی و ثبت License ID را نمی‌گیرد.

### ۲. Meter لایسنس را پیش از مقایسه قیمت روشن کنید

لایسنس ممکن است بر اساس Device، Serial، Detector، Probe، Bed، Modality، Concurrent user، Named user، Study، Exam، Algorithm run، Storage، API call یا Site محاسبه شود. «یک لایسنس» بدون واحد مصرف قابل مقایسه نیست.

سناریوی بار واقعی را بسازید و سقف، Overage، Credit expiry، Burst، کاربر مهمان، محیط Test و Disaster recovery را در آن بیاورید. اگر واحد مصرف تغییر کند یا حجم از پیش‌بینی عبور کند، فرمول قیمت و حق توقف خدمت باید از ابتدا معلوم باشد.

### ۳. حق استفاده، انتقال و فعال‌سازی مجدد را تفکیک کنید

مالکیت سخت‌افزار الزاماً License را قابل‌انتقال نمی‌کند. بنویسید حق استفاده متعلق به مرکز، Legal entity، Site، Serial یا حساب فروشنده است و در جابه‌جایی اتاق، تعویض Mainboard، تعویض Server، ادغام مرکز، تغییر پیمانکار سرویس یا فروش تجهیز چه اتفاقی می‌افتد.

Activation باید مسیر عادی و مسیر اضطراری داشته باشد. تعداد Rehost، زمان پاسخ، نیاز به اینترنت، Offline activation و مدرکی که مرکز در پایان کار دریافت می‌کند را مشخص کنید. فعال‌سازی وابسته به یک ایمیل شخصی یا لپ‌تاپ نماینده، تحویل پایدار نیست.

### ۴. تاریخ End-of-Support را به افق بهره‌برداری وصل کنید

برای Application، Firmware، سیستم‌عامل، Database، Browser، Driver، GPU library، Middleware و Cloud service تاریخ پایان فروش، پایان پشتیبانی و پایان وصله را جدا بگیرید. FDA در راهنمای ۲۰۲۶ توصیه می‌کند وضعیت پشتیبانی و تاریخ پایان پشتیبانی اجزای نرم‌افزاری مشخص باشد و هشدار می‌دهد پس از آن ممکن است Patch یا Update معقول دیگر ممکن نباشد.

اگر افق استفاده مرکز هفت سال است اما یکی از اجزای حیاتی سه سال دیگر پشتیبانی نمی‌شود، فروشنده باید Migration path، هزینه، Downtime، Validation و سخت‌افزار لازم را اکنون اعلام کند. «تا زمانی که قطعه موجود باشد» یا «طبق سیاست روز شرکت» تاریخ قراردادی نیست.

### ۵. Security update را از Feature upgrade جدا کنید

در قرارداد بنویسید کدام وصله‌های ایمنی و امنیتی در Warranty، Maintenance و پس از آن بدون خرید Feature جدید ارائه می‌شوند. Severity، زمان اطلاع‌رسانی، هدف انتشار Patch، Remote یا On-site بودن نصب، هزینه سفر، Regression test و مسئولیت Rollback را تعریف کنید.

فروشنده نباید رفع آسیب‌پذیری مؤثر بر ایمنی یا عملکرد را به خرید بسته قابلیت نامرتبط گره بزند. در مقابل، مرکز نیز باید Window تغییر، Backup، Test environment و دسترسی تیم‌های فنی را فراهم کند. پرداخت Maintenance وقتی ارزش دارد که خروجی قابل‌سنجش—اطلاعیه، بسته معتبر، نصب، آزمون و گزارش نسخه—تحویل دهد.

### ۶. SBOM را همراه وضعیت پشتیبانی تحویل بگیرید

SBOM فقط فهرست نام کتابخانه‌ها نیست. [راهنمای نهایی IMDRF N73](https://www.imdrf.org/sites/default/files/2023-04/Principles%20and%20Practices%20for%20Software%20Bill%20of%20Materials%20for%20Medical%20Device%20Cybersecurity%20%28N73%29.pdf) می‌گوید این فهرست باید در فرایند خرید در دسترس باشد و با مدیریت آسیب‌پذیری و رخداد به کار رود. FDA نیز برای Cyber deviceها SBOM شامل اجزای Commercial، Open-source و Off-the-shelf را الزام قانونی بخش 524B می‌داند و در راهنمای خود وضعیت و تاریخ پایان پشتیبانی هر جزء را توصیه می‌کند.

فرمت ماشین‌خوان، نسخه محصول متناظر، تاریخ تولید، روش دریافت Revision بعدی، دسترسی محرمانه و مسئول تطبیق SBOM با Inventory مرکز را تعریف کنید. SBOM بدون Update cadence و مسیر اعلام آسیب‌پذیری، یک فایل بایگانی‌شده است نه ابزار تصمیم.

### ۷. Cloud و Subscription را به Service dependency map تبدیل کنید

مشخص کنید کدام عملکرد بدون اینترنت ادامه می‌یابد، Cache یا Offline grace چند روز است و قطع Identity provider، DNS، Cloud region، Payment یا Vendor portal چه اثری بر تشخیص، درمان، مشاهده، Export و سرویس دارد. Tenant، محل نگهداری و Backup داده، Subprocessor، RPO، RTO، Retention و Availability را در دامنه قرارداد بیاورید.

تعهد Uptime باید اجزای پشت صحنه—License server، API، Model service، Storage و Support portal—را هم پوشش دهد. اگر دستگاه روشن است اما الگوریتم یا داده قابل‌دسترسی نیست، خدمت کامل در دسترس نیست. Service credit به‌تنهایی جای برنامه تداوم بالینی را نمی‌گیرد.

### ۸. دسترسی راه دور را Session-based و قابل‌ممیزی کنید

نام ابزار Remote، مالک حساب، MFA، نقش‌ها، روش Approval، ساعت مجاز، Recording یا Audit log، File transfer، Session timeout و Emergency access را تعیین کنید. اتصال دائمی با Credential مشترک یا حسابی که فقط فروشنده کنترل می‌کند، نباید شرط Warranty باشد.

راهنمای [MDCG 2019-16 Rev.1](https://health.ec.europa.eu/document/download/b23b362f-8a56-434c-922a-5b3ca4d0a7a1_en) از کنترل دسترسی، حداقل‌سازی مجوز، مدیریت Patch و پرهیز از اجزای پایان‌عمر در محیط بهره‌برداری سخن می‌گوید. قرارداد باید مسئولیت Vendor و مرکز را برای Remote support، Log retention و قطع دسترسی در پایان همکاری جدا کند.

### ۹. داده، تنظیمات و Log را قابل‌خروج نگه دارید

مالکیت و حق استفاده از داده بیمار، Raw data، نتیجه پردازش، Protocol، Calibration، QC، Annotation، Audit trail، Service log و Configuration backup را مشخص کنید. Format، Schema، Metadata، Encryption، Media، API و هزینه هر Export باید پیش از خرید آزموده شود.

خروج PDF به‌تنهایی قابلیت انتقال نیست. یک Sample migration از داده ناشناس اجرا کنید و Import در مقصد مستقل یا حداقل بازخوانی کامل را بسنجید. پس از خاتمه، دوره دسترسی Read-only، زمان تحویل Export نهایی، Certificate حذف و مسئول پاسخ به درخواست‌های قانونی یا بالینی باید معلوم باشد.

### ۱۰. Update را با Validation، Rollback و مجوز کنترل کنید

هر نسخه باید Release note، فهرست تغییر، نیاز زیرساخت، اثر بر Interface، Cybersecurity، Calibration، Algorithm، Workflow و داده قبلی داشته باشد. محیط Test یا روش کنترل‌شده، Backup قابل‌بازیابی، Rollback، حدود پذیرش و صاحب تصمیم Go/No-Go را تعریف کنید.

Update خودکار Cloud نباید بدون اطلاع، قابلیت بالینی یا خروجی تأییدشده را تغییر دهد. در عین حال، تعویق Patch نیز باید Risk acceptance و Compensating control داشته باشد. هدف، جلوگیری از تغییر نیست؛ هدف این است که هیچ تغییر مؤثر بر ایمنی یا Availability بدون شواهد و مسئول مشخص وارد خدمت نشود.

### ۱۱. SLA را برای خرابی نرم‌افزار و License server هم بنویسید

Severity را با اثر بالینی تعریف کنید، نه با تشخیص اولیه فروشنده. زمان Acknowledge، Remote response، Workaround، رفع موقت، Fix، حضور، Escalation و RCA را جدا کنید. توقف به‌دلیل Certificate، Database، Interface، Cloud، Account یا License باید در همان فرمول Availability خدمت دیده شود.

Escrow License key، Emergency code، Offline grace، نسخه پایدار قبلی، Spare server یا Export آفلاین می‌توانند بخشی از Continuity plan باشند. برای هر راه‌حل، زمان فعال‌سازی و آزمون دوره‌ای بنویسید؛ راه اضطراری که هرگز آزمایش نشده، ظرفیت آماده نیست.

### ۱۲. Exit، Escrow و Decommission را قبل از امضا ببندید

خاتمه قرارداد باید شامل Advance notice، Transition assistance، Export کامل، Dictionary و Documentation، تحویل حساب‌ها و کلیدها، تداوم Read-only، حذف امن، قطع Remote access و هزینه از پیش‌تعیین‌شده باشد. اگر Vendor یا تأمین‌کننده جزء ثالث پیش از عمر موردانتظار تجهیز پشتیبانی را قطع کرد، حق Migration، جایگزینی یا جبران باید روشن باشد.

راهنمای FDA حتی Acquisition یا Escrow کد منبع را برای سناریوی پایان زودهنگام پشتیبانی جزء خریداری‌شده به‌عنوان کنترل قابل‌بررسی مطرح می‌کند؛ این راهکار برای همه خریدها لازم یا عملی نیست، اما برای نرم‌افزار اختصاصیِ حیاتی باید حداقل امکان Escrow، Documentation کافی، Data portability یا Step-in support ارزیابی شود. در خروج از خدمت نیز پاک‌سازی امن داده و مدرک Decommission را تحویل بگیرید.

## مدل ساده هزینه برای مقایسه پیشنهادها

**TCO نرم‌افزار = خرید و فعال‌سازی + Subscription/Maintenance + زیرساخت و Cloud + Interface/API + Validation هر نسخه + امنیت و Backup + آموزش + Downtime + Migration و Exit**

دو قیمت را با یک افق زمانی، حجم خدمت و نرخ رشد مقایسه کنید. یک پیشنهاد ارزان با Credit محدود، Upgrade اجباری، Export پولی یا End-of-Support زودهنگام ممکن است در سال سوم گران‌تر شود. سناریوی پایه، رشد حجم و خروج زودهنگام را جدا محاسبه کنید.

**هزینه هر خدمت نرم‌افزاری قابل‌تحویل = TCO نرم‌افزار در افق قرارداد ÷ تعداد مطالعات یا ساعات کاری که قابلیت، داده، اتصال و پشتیبانی واقعاً در دسترس‌اند**

## پرونده تحویل که باید کامل باشد

- BOM و Entitlement matrix با SKU، Version، Meter و Expiry
- License certificate، حساب سازمانی و روش Activation/Rehost
- جدول هزینه Base، Option، Subscription، Overage، API و Storage
- تاریخ End-of-Sale، End-of-Support و End-of-Security-Updates هر جزء حیاتی
- سیاست Patch، Severity، زمان هدف، Validation و Rollback
- SBOM ماشین‌خوان و روش دریافت Revisionهای بعدی
- Service dependency map برای Cloud، Identity، License server و Third party
- Remote-access matrix، MFA، Approval، Log و Session termination
- Data dictionary، Export sample، API documentation و Migration test
- SLA نرم‌افزار با RCA، Workaround، Offline grace و Continuity drill
- Exit plan با Read-only period، انتقال، حذف امن و هزینه ثابت
- صورت‌جلسه SAT که قابلیت‌ها را با کانفیگ و حساب واقعی مرکز آزموده است

## هشت علامت توقف خرید

قابلیت Demo بدون SKU، Perpetual بدون تعریف Maintenance، تاریخ پایان پشتیبانی «بعداً اعلام می‌شود»، Patch امنیتی فقط با Upgrade پولی، SBOM ناموجود، Cloud بدون Offline workflow، Remote access با حساب مشترک، یا Export نهایی وابسته به تمدید اشتراک، هشت دلیل برای توقف ارزیابی و تکمیل پیشنهادند.

## جمع‌بندی و اقدام بعدی

خرید نرم‌افزار تجهیز پزشکی فقط خرید چند منو نیست؛ خرید حق استفاده پایدار، نگهداری امن، تداوم خدمت و خروج کنترل‌شده است. پیشنهاد قابل دفاع باید نشان دهد قابلیت دقیقاً کجا فعال است، تا چه زمانی کار می‌کند، چه کسی آن را به‌روز می‌کند، داده چگونه آزاد می‌ماند و اگر فروشنده یا جزء ثالث کنار رفت، خدمت بالینی چگونه ادامه پیدا می‌کند.

برای تدوین Entitlement matrix، مقایسه License و Subscription، طراحی SAT و محاسبه TCO نرم‌افزار، از [خدمات تأمین Clinoro](/procurement) شروع کنید یا [پیشنهاد فنی و مالی فروشندگان را برای بررسی ارسال کنید](/contact). تعداد دستگاه و کاربر، حجم سالانه، قابلیت‌های بالینی، اتصال‌ها، Cloud dependency، افق بهره‌برداری و تاریخ هدف Go-Live را ضمیمه کنید تا هر Option به حق استفاده، هزینه عمر و سناریوی خروج متصل شود.`,
    image:
      "/assets/blog/medical-device-software-license-vendor-lock-in-2026.webp",
    category: "جهانی؛ نرم‌افزار تجهیزات پزشکی، لایسنس و تداوم خدمت",
    author: "تحریریه Clinoro",
    publishedAt: "2026-09-06",
    publishedTime: "2026-09-06T08:00:00+03:30",
    published: true,
    seoTitle: "لایسنس تجهیزات پزشکی؛ ۱۲ بند ضد قفل فروشنده",
    seoDescription:
      "راهنمای خرید لایسنس تجهیزات پزشکی؛ ۱۲ بند برای Subscription، SBOM، Update، End-of-Support، Cloud، SLA، Export، Escrow و خروج از قفل فروشنده.",
    keywords: [
      "لایسنس تجهیزات پزشکی",
      "نرم افزار تجهیزات پزشکی",
      "خروج از قفل فروشنده",
      "Subscription تجهیزات پزشکی",
      "SBOM تجهیزات پزشکی",
      "End of Support تجهیزات پزشکی",
      "قرارداد نرم افزار پزشکی",
      "هزینه چرخه عمر نرم افزار پزشکی",
    ],
    sources: [
      {
        title:
          "FDA — راهنمای امنیت سایبری تجهیزات پزشکی، صادرشده در ۳ فوریه ۲۰۲۶",
        url: "https://www.fda.gov/regulatory-information/search-fda-guidance-documents/cybersecurity-medical-devices-quality-management-system-considerations-and-content-premarket",
      },
      {
        title:
          "FDA — متن PDF راهنمای فوریه ۲۰۲۶؛ SBOM، Patch، License شخص ثالث و End-of-Support",
        url: "https://www.fda.gov/media/119933/download",
      },
      {
        title:
          "FDA — صفحه مرجع امنیت سایبری تجهیزات پزشکی و منابع جاری",
        url: "https://www.fda.gov/medical-devices/digital-health-center-excellence/cybersecurity",
      },
      {
        title:
          "IMDRF N73 Final:2023 — اصول و رویه‌های SBOM برای امنیت سایبری تجهیزات پزشکی",
        url: "https://www.imdrf.org/sites/default/files/2023-04/Principles%20and%20Practices%20for%20Software%20Bill%20of%20Materials%20for%20Medical%20Device%20Cybersecurity%20%28N73%29.pdf",
      },
      {
        title:
          "IMDRF N70 Final:2023 — اصول امنیت سایبری تجهیزات پزشکی Legacy",
        url: "https://www.imdrf.org/documents/principles-and-practices-cybersecurity-legacy-medical-devices",
      },
      {
        title:
          "European Commission / MDCG 2019-16 Rev.1 — راهنمای امنیت سایبری تجهیزات پزشکی",
        url: "https://health.ec.europa.eu/document/download/b23b362f-8a56-434c-922a-5b3ca4d0a7a1_en",
      },
    ],
    imageCredit: "تصویر اختصاصی Clinoro، تولیدشده با OpenAI",
    imageSource:
      "https://clinoromedical.com/assets/blog/medical-device-software-license-vendor-lock-in-2026.webp",
    imageAlt:
      "مهندس پزشکی، متخصص امنیت بیمارستان و مدیر خرید در حال ارزیابی نرم‌افزار و اتصال تجهیزات پزشکی روی میز فنی",
    imageLicense: "تصویر تولیدشده برای Clinoro",
  },
];
