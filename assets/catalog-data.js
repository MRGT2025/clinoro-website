
window.CLINORO_CATALOG = {
  company: {
    name: "Clinoro",
    line: "Medical Technologies",
    phone: "09138986215",
    email: "info@clinoromedical.com",
    address: "اصفهان، ساختمان پردیس، طبقه ۴، واحد ۲۳",
    promise: "Clinoro یک برند کاتالوگی و بازرگانی در حوزه تجهیزات پزشکی است که محصول، راهکار، اسناد، نصب و خدمات را با رویکردی حرفه‌ای و قابل توسعه ارائه می‌کند."
  },
  heroSteps: [
    {step:"01", label:"Brand Introduction", title:"معرفی برند و لحن جهانی", text:"شروع تجربه با یک صحنه motion-led انجام می‌شود؛ جایی که برند نه مثل یک سایت عادی، بلکه مثل یک presentation system معاصر معرفی می‌شود."},
    {step:"02", label:"Product Portfolio", title:"سبد محصولات و گروه‌های اصلی", text:"در لایه دوم، focus از هویت به سبد محصولات می‌رود؛ تجهیزات، راهکارها و حوزه‌های تخصصی به‌صورت ساختارمند معرفی می‌شوند."},
    {step:"03", label:"Service Architecture", title:"خدمات شرکت و ساختار پشتیبانی", text:"در لایه سوم، خدمات، فرآیند استعلام، نصب، آموزش و اسناد برند نمایش داده می‌شود تا بازدیدکننده تصویر کامل‌تری بگیرد."}
  ],
  categories: [
    {id:"critical", label:"مراقبت ویژه", en:"Critical Care", note:"مانیتورینگ، ICU، پمپ تزریق و تجهیزات حیاتی.", image:"product-1.jpg"},
    {id:"imaging", label:"تصویربرداری", en:"Imaging Systems", note:"سونوگرافی و راهکارهای تصویربرداری با تمرکز بر کیفیت و کاربرد.", image:"product-3.jpg"},
    {id:"lab", label:"آزمایشگاه", en:"Laboratory Diagnostics", note:"آنالایزرها، QC، مصرفی‌ها و جریان کاری آزمایشگاه.", image:"product-2.jpg"},
    {id:"sterile", label:"استریل و CSSD", en:"Sterilization", note:"اتوکلاو، اعتبارسنجی و فرآیند استریل.", image:"product-5.jpg"},
    {id:"surgery", label:"اتاق عمل", en:"Surgery & OR", note:"ماشین بیهوشی، چراغ و تجهیزات زیرساختی اتاق عمل.", image:"product-4.jpg"},
    {id:"clinic", label:"کلینیک و دندانپزشکی", en:"Clinic & Dental", note:"راهکارهای مطب، کلینیک تخصصی و واحدهای سرپایی.", image:"medical-visual.jpg"}
  ],
  products: [
    {id:"icu-monitor", cat:"critical", image:"product-1.jpg", name:"مانیتور علائم حیاتی ICU", en:"ICU Patient Monitor", tier:"Critical Care", lead:"پایش چندپارامتری برای ICU، CCU، اورژانس و ریکاوری با تمرکز روی خوانایی، هشدارهای بالینی و قابلیت اتصال.", specs:["ECG / SpO₂ / NIBP / RESP / TEMP", "Central monitoring ready", "Alarm management & trend review", "مناسب ICU, CCU, Recovery"], docs:["Datasheet", "CE / ISO", "Installation Guide"], badge:"Clinical"},
    {id:"anesthesia", cat:"surgery", image:"product-4.jpg", name:"ماشین بیهوشی", en:"Anesthesia Workstation", tier:"Operating Room", lead:"راهکار بیهوشی برای اتاق عمل با توجه به ایمنی بیمار، سازگاری گازها، سرویس و آموزش اپراتور.", specs:["Ventilator modes", "Gas safety workflow", "Vaporizer compatibility", "Service & calibration plan"], docs:["Technical Offer", "Warranty Terms", "Training Plan"], badge:"Project"},
    {id:"ultrasound", cat:"imaging", image:"product-3.jpg", name:"سیستم سونوگرافی", en:"Ultrasound Imaging System", tier:"Diagnostic Imaging", lead:"انتخاب دستگاه بر اساس نوع پروب، کیفیت تصویر، نوع کاربری و ظرفیت مرکز درمانی.", specs:["Convex / Linear / Cardiac probes", "Portable or cart-based", "DICOM/PACS option", "OB/GYN, General, Cardiology"], docs:["Probe Matrix", "Room Requirement", "User Training"], badge:"Imaging"},
    {id:"hematology", cat:"lab", image:"product-2.jpg", name:"آنالایزر هماتولوژی", en:"Hematology Analyzer", tier:"Lab Workflow", lead:"برای آزمایشگاه‌هایی که دقت، سرعت، QC و تداوم بهره‌برداری در آن‌ها مهم است.", specs:["3-part / 5-part options", "QC and calibration flow", "Throughput mapping", "Consumables planning"], docs:["Consumables List", "QC Protocol", "LIS Notes"], badge:"Diagnostics"},
    {id:"chemistry", cat:"lab", image:"product-6.jpg", name:"آنالایزر بیوشیمی", en:"Clinical Chemistry Analyzer", tier:"High Throughput", lead:"راهکار بیوشیمی برای بررسی ظرفیت نمونه، منوی تست، مواد مصرفی و هزینه مالکیت.", specs:["Semi / fully automatic", "Reagent strategy", "LIS integration", "Preventive maintenance"], docs:["Test Menu", "Reagent Plan", "Maintenance SOP"], badge:"Lab"},
    {id:"autoclave", cat:"sterile", image:"product-5.jpg", name:"اتوکلاو پزشکی", en:"Medical Autoclave", tier:"Sterile Chain", lead:"برای کلینیک، CSSD و اتاق عمل با تمرکز بر ظرفیت، سیکل استریل، ایمنی و مستندسازی.", specs:["Class B / hospital grade", "Cycle documentation", "Validation support", "Water quality requirements"], docs:["Validation Sheet", "Site Prep", "Service Schedule"], badge:"CSSD"},
    {id:"infusion", cat:"critical", image:"product-7.jpg", name:"پمپ تزریق و سرنگ", en:"Infusion & Syringe Pumps", tier:"Care Delivery", lead:"تجهیزات تزریق دقیق برای ICU، NICU و اتاق عمل همراه با آموزش و سازگاری مصرفی.", specs:["Drug library option", "Stackable workflow", "Battery & alarm review", "Consumables compatibility"], docs:["Compatibility", "Training Checklist", "Warranty"], badge:"Essential"},
    {id:"or-light", cat:"surgery", image:"product-8.jpg", name:"چراغ اتاق عمل", en:"Surgical Operating Light", tier:"OR Infrastructure", lead:"نور متمرکز، کاهش سایه و طراحی نصب متناسب با چیدمان اتاق عمل.", specs:["Ceiling / mobile options", "Lux & color temperature", "Camera-ready options", "Installation mapping"], docs:["Room Layout", "Electrical Notes", "Installation Plan"], badge:"Infrastructure"},
    {id:"dental-unit", cat:"clinic", image:"medical-visual.jpg", name:"یونیت دندانپزشکی و تجهیزات کلینیکی", en:"Dental & Clinic Equipment", tier:"Clinic Suite", lead:"تجهیز مطب و کلینیک با نگاه یکپارچه به فضا، یونیت، استریل، مصرفی و جریان خدمت.", specs:["Chair / unit configuration", "Compressor & suction plan", "Sterilization workflow", "Operator ergonomics"], docs:["Clinic Layout", "Equipment List", "Service Flow"], badge:"Clinic"}
  ],
  solutions: [
    {title:"راهکار بخش مراقبت ویژه", en:"Critical Care Package", image:"product-1.jpg", text:"برای ICU و CCU شامل مانیتورینگ، تزریق، زیرساخت ارتباطی، آموزش پرسنل و برنامه نگهداری."},
    {title:"راهکار اتاق عمل", en:"Operating Room Setup", image:"product-4.jpg", text:"ماشین بیهوشی، چراغ، تخت و اقلام زیرساختی همراه با منطق نصب و استقرار."},
    {title:"راهکار تصویربرداری", en:"Imaging Workflow", image:"product-3.jpg", text:"انتخاب سیستم متناسب با نوع خدمت، کیفیت تصویر، فضا، برق و آموزش اپراتور."},
    {title:"راهکار آزمایشگاه", en:"Laboratory Efficiency", image:"product-2.jpg", text:"چیدمان تجهیزات، QC، LIS، برنامه مواد مصرفی و کنترل ظرفیت نمونه."},
    {title:"راهکار CSSD و استریل", en:"Sterile Processing", image:"product-5.jpg", text:"متمرکز بر اتوکلاو، گردش ابزار، اعتبارسنجی و مستندسازی فرآیند استریل."},
    {title:"راهکار کلینیک و مطب", en:"Clinic & Dental Setup", image:"medical-visual.jpg", text:"مناسب کلینیک‌های تخصصی و دندانپزشکی با نگاه به بهره‌برداری روزمره و خدمات."}
  ],
  services: [{"slug": "advisory", "page": "service-advisory.html", "title": "مشاوره انتخاب تجهیز", "en": "Technical Advisory", "summary": "تحلیل نیاز، ظرفیت، بودجه و کاربری برای انتخاب تجهیز مناسب قبل از خرید یا استعلام رسمی.", "hero": "انتخاب تجهیز باید با تحلیل فنی و سناریوی واقعی درمان انجام شود، نه فقط بر اساس ظاهر یا قیمت.", "bullets": ["بررسی نوع مرکز و دپارتمان درمانی", "تطبیق محصول با زیرساخت و بودجه", "تهیه پیشنهاد فنی اولیه و مسیر تصمیم‌گیری"], "scope": ["نیازسنجی اولیه و دریافت بریف پروژه", "مقایسه گزینه‌ها بر اساس کاربری و ظرفیت", "بررسی الزامات نصب، مصرفی و خدمات", "کمک به تدوین RFQ یا درخواست رسمی"], "deliverables": ["خلاصه نیاز پروژه", "فهرست گزینه‌های قابل پیشنهاد", "نکات فنی برای تصمیم‌گیری", "مسیر بعدی برای استعلام و تأمین"], "image": "product-3.jpg"}, {"slug": "installation", "page": "service-installation.html", "title": "نصب و راه‌اندازی", "en": "Installation & Commissioning", "summary": "هماهنگی استقرار، آماده‌سازی محل، تست اولیه و تحویل عملیاتی تجهیزات در زمان راه‌اندازی.", "hero": "نصب صحیح فقط تحویل دستگاه نیست؛ بخشی از تجربه برند و نقطه شروع بهره‌برداری مؤثر است.", "bullets": ["بررسی آمادگی محل پیش از ورود تجهیز", "هماهنگی استقرار و تست اولیه", "تحویل عملیاتی و ثبت چک‌لیست راه‌اندازی"], "scope": ["بازدید یا بررسی الزامات محیطی", "چک‌لیست برق، فضا و شرایط نصب", "هماهنگی نصب با تیم فنی", "تست اولیه و تحویل به کاربر"], "deliverables": ["Installation checklist", "صورت‌جلسه تحویل اولیه", "ثبت وضعیت راه‌اندازی", "فهرست اقدامات تکمیلی در صورت نیاز"], "image": "product-4.jpg"}, {"slug": "training", "page": "service-training.html", "title": "آموزش کاربران", "en": "User Training", "summary": "آموزش اپراتور و تیم بهره‌بردار برای استفاده صحیح، ایمن و استاندارد از تجهیزات.", "hero": "آموزش خوب باعث می‌شود تجهیز درست استفاده شود، ریسک پایین بیاید و کیفیت بهره‌برداری بالاتر برود.", "bullets": ["آموزش اولیه هنگام تحویل", "مرور workflow استفاده صحیح", "ثبت آموزش و نکات کلیدی برای اپراتورها"], "scope": ["آموزش پایه عملکرد دستگاه", "بررسی سناریوهای رایج کاربری", "مرور هشدارها و نکات ایمنی", "تهیه رکورد آموزش"], "deliverables": ["Training record", "راهنمای نکات کلیدی کاربر", "فهرست کاربران آموزش‌دیده", "پیشنهاد آموزش تکمیلی در صورت نیاز"], "image": "product-1.jpg"}, {"slug": "maintenance", "page": "service-maintenance.html", "title": "نگهداری پیشگیرانه", "en": "Preventive Maintenance", "summary": "برنامه سرویس دوره‌ای و بازدیدهای منظم برای کاهش ریسک توقف یا افت عملکرد تجهیز.", "hero": "سرویس دوره‌ای از خرابی‌های ناگهانی جلوگیری می‌کند و به پایداری سیستم در بلندمدت کمک می‌کند.", "bullets": ["برنامه‌ریزی سرویس و PM", "بازدیدهای دوره‌ای و پایش وضعیت", "کاهش ریسک downtime و هزینه‌های ناگهانی"], "scope": ["تهیه برنامه PM", "بررسی دوره‌ای عملکرد و وضعیت دستگاه", "ثبت نیازهای سرویس یا تنظیمات", "ارائه توصیه برای ادامه بهره‌برداری"], "deliverables": ["برنامه بازدید دوره‌ای", "گزارش PM یا سرویس", "ثبت اقدامات اصلاحی", "پیشنهاد برای سرویس بعدی"], "image": "product-8.jpg"}, {"slug": "consumables", "page": "service-consumables.html", "title": "تأمین قطعات و مصرفی", "en": "Parts & Consumables", "summary": "پشتیبانی اقلام مصرفی و قطعات کلیدی برای تداوم عملکرد سیستم و جلوگیری از وقفه در کار.", "hero": "بهره‌برداری پایدار بدون برنامه مناسب برای مصرفی‌ها و قطعات، در عمل کامل نمی‌شود.", "bullets": ["تدوین لیست مصرفی‌های مهم", "پشتیبانی اقلام کلیدی و قطعات پرکاربرد", "کمک به تداوم عملکرد و کاهش وقفه"], "scope": ["شناسایی اقلام مصرفی اصلی", "بررسی موجودی یا نیاز دوره‌ای", "توصیه برای اقلام حساس و حیاتی", "هماهنگی تأمین در مسیر پروژه"], "deliverables": ["Consumables list", "اولویت‌بندی اقلام مهم", "نکات نگهداری و مصرف", "مسیر استعلام برای اقلام بعدی"], "image": "product-6.jpg"}, {"slug": "documentation", "page": "service-documentation.html", "title": "اسناد و انطباق", "en": "Documentation Support", "summary": "ارائه دیتاشیت، شرایط گارانتی، الزامات نصب، سوابق آموزش و اسناد پشتیبان برای تصمیم‌گیری بهتر.", "hero": "اسناد حرفه‌ای اعتماد ایجاد می‌کنند و به تیم خرید، مدیران و کاربران کمک می‌کنند تصمیم دقیق‌تری بگیرند.", "bullets": ["دیتاشیت و مشخصات فنی", "گارانتی، نصب و سوابق آموزش", "بسته اطلاعاتی برای تصمیم‌گیری و پیگیری"], "scope": ["ارسال یا آماده‌سازی مشخصات فنی", "مرور شرایط گارانتی و تحویل", "ارائه checklistهای نصب و آموزش", "تجمیع بسته اسنادی هر تجهیز یا پروژه"], "deliverables": ["Datasheet pack", "Warranty summary", "Installation / training records", "بسته اسناد پروژه یا تجهیز"], "image": "bg-services.jpg"}],
  procurement: [
    {step:"01", title:"نیازسنجی و دریافت بریف", en:"Requirement Intake", text:"نوع مرکز، تخصص، ظرفیت، بودجه، برندهای مدنظر، شهر پروژه و زمان تحویل جمع‌آوری می‌شود."},
    {step:"02", title:"تطبیق فنی و انتخاب گزینه‌ها", en:"Technical Matching", text:"محصول بر اساس کاربری واقعی، زیرساخت، مصرفی، سرویس و هزینه مالکیت تطبیق داده می‌شود."},
    {step:"03", title:"آماده‌سازی بسته پیشنهادی", en:"Commercial & Technical Pack", text:"پیشنهاد رسمی شامل مشخصات کلیدی، دیتاشیت، شرایط تحویل، گارانتی و الزامات نصب ارائه می‌شود."},
    {step:"04", title:"تأمین، نصب و تحویل نهایی", en:"Supply, Install & Handover", text:"هماهنگی تأمین، کنترل اسناد، تحویل، نصب، آموزش و شروع پشتیبانی در یک مسیر واحد مدیریت می‌شود."}
  ],
  documents: [
    {title:"Datasheet", note:"مشخصات فنی اصلی، مدل، آپشن‌ها و الزامات استفاده."},
    {title:"Commercial Offer", note:"پیشنهاد رسمی با ساختار روشن برای استعلام و بررسی مدیریتی."},
    {title:"Warranty Terms", note:"مدت گارانتی، حدود پوشش و پیش‌نیازهای اجرایی."},
    {title:"Installation Checklist", note:"بررسی برق، فضا، شرایط محیطی و آمادگی محل نصب."},
    {title:"Training Record", note:"ثبت آموزش کاربر، تحویل عملیاتی و شروع بهره‌برداری."},
    {title:"Maintenance Plan", note:"برنامه سرویس، PM و الزامات بازدیدهای دوره‌ای."}
  ],
  faqs: [
    {q:"آیا سایت فروشگاه آنلاین است؟", a:"خیر. این ساختار یک کاتالوگ حرفه‌ای و بستر معرفی بازرگانی-فنی است که مسیر استعلام و معرفی خدمات را تقویت می‌کند."},
    {q:"چرا خدمات صفحه جدا دارند؟", a:"برای اینکه هر خدمت با روایت، دامنه کار، خروجی‌ها و جزئیات خودش معرفی شود و سایت از حالت عمومی خارج شود."},
    {q:"آیا امکان اتصال به CRM یا API وجود دارد؟", a:"بله. داده‌ها و فرم‌ها طوری چیده شده‌اند که برای توسعه بعدی به پنل، CRM یا API آماده باشند."},
    {q:"اگر محصول در کاتالوگ نبود چه کنیم؟", a:"از طریق فرم RFQ یا تماس مستقیم می‌توان تجهیز یا برند خاص را درخواست کرد تا مسیر پیشنهاد برای آن تنظیم شود."}
  ],
  metrics: [
    {value:40, suffix:"+", label:"برند و سازنده قابل تأمین"},
    {value:9, suffix:"", label:"گروه اصلی تجهیزات"},
    {value:6, suffix:"", label:"خدمات اصلی شرکت"},
    {value:24, suffix:"h", label:"پاسخ‌گویی اولیه برای RFQ"}
  ]
};
