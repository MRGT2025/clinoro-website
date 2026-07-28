import { ensureDatabase, getD1 } from "../db";
import { dailyBlogPosts20260728 } from "./daily-blog-posts-2026-07-28";
import { dailyBlogPosts20260727 } from "./daily-blog-posts-2026-07-27";
import { v35BlogPosts } from "./v35-blog-posts";

export type ProductDocument = { title:string; url:string; type:string };
export type TechnicalSpec = { label:string; value:string };
export type ProductItem = {
  slug:string;
  cat:string;
  image:string;
  gallery:string[];
  fa:string;
  en:string;
  tag:string;
  summary:string;
  brand:string;
  model:string;
  availability:string;
  intendedUse:string;
  specs:string[];
  technicalSpecs:TechnicalSpec[];
  services:string[];
  documents:ProductDocument[];
  imageCredit:string;
  imageSource:string;
  imageLicense:string;
  featured:boolean;
};
export type ServiceItem = { en:string; title:string; text:string; list:string[] };
export type SolutionItem = { title:string; en:string; image:string; text:string };
export type StepItem = { title:string; text:string };
export type HomeCategory = { title:string; en:string; image:string };
export type HomeTextCard = { title:string; text:string };
export type PageIntro = { eyebrow:string; title:string; text:string; image:string; note:string; credit:string; source:string };
export type PageKey = "home"|"products"|"services"|"solutions"|"procurement"|"about"|"contact"|"blog";
export type BlogPost = {
  id:string;
  slug:string;
  title:string;
  excerpt:string;
  content:string;
  image:string;
  category:string;
  author:string;
  publishedAt:string;
  publishedTime?:string;
  published:boolean;
  seoTitle:string;
  seoDescription:string;
  sources:{title:string;url:string}[];
  imageCredit:string;
  imageSource:string;
  imageAlt?:string;
  imageLicense?:string;
};
export type InjectionCode = { html:string; css:string; javascript:string };
export type ContentBlock = {
  id:string;
  type:"text"|"image"|"video"|"cta";
  title:string;
  text:string;
  mediaUrl:string;
  caption:string;
  linkLabel:string;
  linkUrl:string;
  theme:"light"|"glass"|"dark";
};
export type TrustItem = {
  id:string;
  type:"project"|"client"|"certificate"|"document";
  title:string;
  subtitle:string;
  description:string;
  image:string;
  fileUrl:string;
  issuer:string;
  issuedAt:string;
  published:boolean;
  verified:boolean;
};

export type SiteContent = {
  schemaVersion:number;
  general:{ brand:string; tagline:string; logoUrl:string; logoAlt:string; phone:string; email:string; address:string; metaTitle:string; metaDescription:string; footerText:string; motionMode:"full"|"subtle"|"reduced" };
  home:{ kicker:string; title:string; signals:string[]; intro:string; heroImage:string; storyTitle:string; storyText:string; storyImage:string; proofPoints:HomeTextCard[]; categories:HomeCategory[]; serviceCards:HomeTextCard[]; process:HomeTextCard[]; finalCta:HomeTextCard };
  pages:Record<"products"|"services"|"solutions"|"procurement"|"about"|"contact"|"blog",PageIntro>;
  products:ProductItem[];
  services:ServiceItem[];
  solutions:SolutionItem[];
  procurementSteps:StepItem[];
  about:{ headline:string; paragraphs:string[]; image:string; values:HomeTextCard[] };
  blogPosts:BlogPost[];
  trustItems:TrustItem[];
  customBlocks:Record<PageKey,ContentBlock[]>;
  injections:{global:InjectionCode;pages:Record<PageKey,InjectionCode>};
};

const emptyInjection=():InjectionCode=>({html:"",css:"",javascript:""});

export const defaultSiteContent: SiteContent = {
  schemaVersion:9,
  general:{ brand:"CLINORO", tagline:"MEDICAL TECHNOLOGIES", logoUrl:"/assets/clinoro-logo-minimal-grey.png", logoAlt:"لوگوی Clinoro", phone:"+98 913 898 6215", email:"info@clinoromedical.com", address:"اصفهان، ساختمان پردیس، طبقه ۴، واحد ۲۳", metaTitle:"Clinoro | تجهیزات و فناوری‌های پزشکی", metaDescription:"تأمین تجهیزات پزشکی، مشاوره فنی، نصب، آموزش و پشتیبانی تخصصی برای مراکز درمانی.",footerText:"معرفی و تأمین حرفه‌ای تجهیزات پزشکی، همراه با مشاوره فنی، نصب، آموزش و پشتیبانی ساختارمند.",motionMode:"subtle" },
  home:{ kicker:"CLINICAL TECHNOLOGY · PROCUREMENT · SUPPORT", title:"فناوری پزشکی،", signals:["انتخاب هوشمندتر","اجرای دقیق‌تر","پشتیبانی ماندگار"], intro:"تأمین حرفه‌ای تجهیزات پزشکی همراه با مشاوره فنی، نصب، آموزش و پشتیبانی؛ از انتخاب محصول تا بهره‌برداری مطمئن.", heroImage:"/assets/clinoro-hero-prism.webp", storyTitle:"تصمیم بهتر، اجرای دقیق‌تر، بهره‌برداری مطمئن‌تر", storyText:"ما تجهیزات را جدا از محیط استفاده نمی‌بینیم. هر پیشنهاد با درنظرگرفتن workflow، زیرساخت، آموزش، مصرفی و برنامه نگهداری شکل می‌گیرد.", storyImage:"/assets/medical-visual.jpg",
    proofPoints:[{title:"۸ گروه محصول",text:"پوشش نیازهای اصلی مراکز درمانی"},{title:"پاسخ اولیه در ۲۴ ساعت",text:"برای استعلام‌ها و درخواست‌های فنی"},{title:"پشتیبانی سراسری",text:"از تأمین و نصب تا آموزش و خدمات"}],
    categories:[{title:"مراقبت ویژه",en:"Critical Care",image:"/assets/patient-monitor.jpg"},{title:"تصویربرداری",en:"Imaging Systems",image:"/assets/ultrasound.jpg"},{title:"آزمایشگاه",en:"Laboratory",image:"/assets/hematology.jpg"},{title:"اتاق عمل",en:"Operating Room",image:"/assets/surgical-light.jpg"},{title:"استریل و CSSD",en:"Sterile Processing",image:"/assets/autoclave.jpg"},{title:"تزریق و مراقبت",en:"Care Delivery",image:"/assets/infusion.jpg"}],
    serviceCards:[{title:"مشاوره و انتخاب",text:"تحلیل نیاز، ظرفیت مرکز، بودجه و الزامات فنی پیش از خرید."},{title:"تأمین و لجستیک",text:"مدیریت پیشنهاد، مدارک، تحویل و هماهنگی پروژه به‌صورت یکپارچه."},{title:"نصب و راه‌اندازی",text:"Site survey، آماده‌سازی، نصب، تست و تحویل ساختارمند تجهیز."},{title:"آموزش و پشتیبانی",text:"آموزش کاربر، نگهداری پیشگیرانه و برنامه خدمات پس از فروش."}],
    process:[{title:"تعریف نیاز",text:"نوع مرکز، کاربرد بالینی، ظرفیت و محدودیت‌های پروژه مشخص می‌شود."},{title:"پیشنهاد فنی",text:"راهکار مناسب همراه با مشخصات، اسناد و گزینه‌های اجرایی ارائه می‌شود."},{title:"تأمین و اجرا",text:"زمان‌بندی، لجستیک، نصب و هماهنگی‌های فنی مدیریت می‌شوند."},{title:"تحویل و پشتیبانی",text:"آموزش، مستندسازی و برنامه خدمات پس از تحویل تکمیل می‌شود."}],
    finalCta:{title:"پروژه یا تجهیز موردنظرتان را با ما در میان بگذارید",text:"اطلاعات اولیه را ارسال کنید تا مسیر فنی و تجاری مناسب برایتان آماده شود."},
  },
  pages:{
    products:{eyebrow:"PRODUCT ECOSYSTEM",title:"تجهیزات پزشکی",text:"محصولات را بر اساس محیط درمانی و کاربرد بررسی کنید؛ هر انتخاب با مشخصات کلیدی، اسناد موردنیاز و مسیر استعلام همراه است.",image:"/assets/ultrasound.jpg",note:"Clinical equipment, structured around real care workflows.",credit:"Harrison Keely — CC BY 4.0",source:"https://commons.wikimedia.org/wiki/File:A_modern_medical_ultrasound_scanner.jpg"},
    services:{eyebrow:"LIFECYCLE SERVICES",title:"خدمات تخصصی",text:"خدمات Clinoro از قبلِ انتخاب تجهیز شروع می‌شوند و تا نصب، آموزش، نگهداری و مستندسازی ادامه دارند.",image:"/assets/infusion.jpg",note:"Support that continues beyond equipment delivery.",credit:"Senior Airman Andrea Posey / U.S. Air Force — Public domain",source:"https://commons.wikimedia.org/wiki/File:Infusion_pump_2.jpg"},
    solutions:{eyebrow:"CARE ENVIRONMENTS",title:"راهکارهای درمانی",text:"به‌جای نگاه جداگانه به دستگاه‌ها، تجهیزات، زیرساخت، خدمات و گردش کار را در قالب یک سناریوی کامل می‌بینیم.",image:"/assets/anesthesia.jpg",note:"Integrated solutions for real clinical environments.",credit:"Coronation Dental Specialty Group — CC BY-SA 3.0",source:"https://commons.wikimedia.org/wiki/File:Operating_room_anesthetic_station.jpg"},
    procurement:{eyebrow:"PROCUREMENT & RFQ",title:"تأمین و استعلام",text:"یک مسیر روشن برای تبدیل نیاز اولیه به پیشنهاد فنی، تأمین، تحویل و پشتیبانی قابل پیگیری.",image:"/assets/chemistry.jpg",note:"A transparent RFQ path from requirement to handover.",credit:"Bobjgalindo — CC BY-SA 4.0",source:"https://commons.wikimedia.org/wiki/File:LabMachines.jpg"},
    about:{eyebrow:"ABOUT CLINORO",title:"درباره Clinoro",text:"Clinoro برای ایجاد یک تجربه حرفه‌ای‌تر در انتخاب، تأمین و پشتیبانی تجهیزات پزشکی شکل گرفته است.",image:"/assets/blog-maintenance-real.jpg",note:"Clarity, technical discipline and long-term support.",credit:"Wikimedia Commons contributor",source:"https://commons.wikimedia.org/"},
    contact:{eyebrow:"CONTACT & RFQ",title:"تماس و شروع استعلام",text:"نام تجهیز، نوع مرکز، محل پروژه و هر نکته فنی مهم را ارسال کنید تا بررسی اولیه انجام شود.",image:"/assets/patient-monitor.jpg",note:"Start with a clear requirement. We will shape the next step.",credit:"Tony Webster — CC BY 2.0",source:"https://commons.wikimedia.org/wiki/File:Hospital_Patient_Monitor_(17239884329).jpg"},
    blog:{eyebrow:"CLINORO JOURNAL",title:"دانش و تجربه پزشکی",text:"راهنماهای انتخاب تجهیزات، نگهداری، استانداردهای اجرایی و تجربه‌های کاربردی پروژه‌های درمانی.",image:"/assets/blog-ai-imaging-real.jpg",note:"Practical knowledge for better clinical technology decisions.",credit:"Wikimedia Commons contributor",source:"https://commons.wikimedia.org/"},
  },
  products:[
    {slug:"icu-patient-monitor",cat:"critical",image:"/assets/patient-monitor.jpg",gallery:[],fa:"مانیتور علائم حیاتی ICU",en:"ICU Patient Monitor",tag:"Critical Care",summary:"پایش پیوسته پارامترهای حیاتی برای محیط‌های مراقبت ویژه، اورژانس و ریکاوری.",brand:"چندبرندی",model:"انتخاب متناسب با پروژه",availability:"پس از بررسی موجودی و مشخصات پروژه",intendedUse:"پایش علائم حیاتی بیمار در محیط‌های تحت نظارت حرفه‌ای",specs:["ECG / SpO₂ / NIBP","Central monitoring ready","Alarm & trend review"],technicalSpecs:[{label:"پارامترها",value:"قابل انتخاب بر اساس کاربرد"},{label:"اتصال",value:"گزینه‌های شبکه و مانیتورینگ مرکزی"},{label:"فرم دستگاه",value:"Bedside / Transport بر اساس پروژه"}],services:["بررسی نیاز بالینی","نصب و راه‌اندازی","آموزش کاربر","برنامه سرویس"],documents:[],imageCredit:"Tony Webster — CC BY 2.0",imageSource:"https://commons.wikimedia.org/wiki/File:Hospital_Patient_Monitor_(17239884329).jpg",imageLicense:"CC BY 2.0",featured:true},
    {slug:"anesthesia-workstation",cat:"surgery",image:"/assets/anesthesia.jpg",gallery:[],fa:"ماشین بیهوشی",en:"Anesthesia Workstation",tag:"Operating Room",summary:"راهکار بیهوشی برای پشتیبانی از تهویه، پایش گاز و گردش کار ایمن اتاق عمل.",brand:"چندبرندی",model:"انتخاب متناسب با پروژه",availability:"پس از بررسی موجودی و مشخصات پروژه",intendedUse:"ارائه و کنترل گازهای بیهوشی و تهویه در اتاق عمل",specs:["Advanced ventilation","Gas safety workflow","Training & calibration"],technicalSpecs:[{label:"تهویه",value:"مدها و ظرفیت بر اساس سناریوی بالینی"},{label:"گاز",value:"پیکربندی بر اساس زیرساخت مرکز"},{label:"پایش",value:"قابلیت یکپارچگی بر اساس مدل منتخب"}],services:["Site survey","نصب و تست ایمنی","آموزش تیم بیهوشی","کالیبراسیون و سرویس"],documents:[],imageCredit:"Coronation Dental Specialty Group — CC BY-SA 3.0",imageSource:"https://commons.wikimedia.org/wiki/File:Operating_room_anesthetic_station.jpg",imageLicense:"CC BY-SA 3.0",featured:true},
    {slug:"ultrasound-imaging-system",cat:"imaging",image:"/assets/ultrasound.jpg",gallery:[],fa:"سیستم سونوگرافی",en:"Ultrasound Imaging System",tag:"Diagnostic Imaging",summary:"سیستم تصویربرداری سونوگرافی با انتخاب پلتفرم و پروب متناسب با تخصص و حجم کار.",brand:"چندبرندی",model:"انتخاب متناسب با پروژه",availability:"پس از بررسی موجودی و مشخصات پروژه",intendedUse:"تصویربرداری اولتراسوند تشخیصی توسط کاربر آموزش‌دیده",specs:["Multiple probe options","DICOM / PACS ready","Portable or cart-based"],technicalSpecs:[{label:"پروب‌ها",value:"انتخاب بر اساس کاربرد تخصصی"},{label:"اتصال",value:"DICOM / PACS در مدل‌های سازگار"},{label:"پلتفرم",value:"پرتابل یا Cart-based"}],services:["انتخاب پروب و پکیج","بررسی اتصال شبکه","نصب و آموزش","پشتیبانی کاربردی"],documents:[],imageCredit:"Harrison Keely — CC BY 4.0",imageSource:"https://commons.wikimedia.org/wiki/File:A_modern_medical_ultrasound_scanner.jpg",imageLicense:"CC BY 4.0",featured:true},
    {slug:"hematology-analyzer",cat:"lab",image:"/assets/hematology.jpg",gallery:[],fa:"آنالایزر هماتولوژی",en:"Hematology Analyzer",tag:"Laboratory",summary:"آنالیز خودکار CBC با ظرفیت و تفکیک متناسب با جریان نمونه آزمایشگاه.",brand:"چندبرندی",model:"انتخاب متناسب با پروژه",availability:"پس از بررسی موجودی و مشخصات پروژه",intendedUse:"آنالیز نمونه‌های خون در آزمایشگاه تشخیص طبی",specs:["3-part / 5-part","QC and calibration","LIS connectivity"],technicalSpecs:[{label:"Diff",value:"3-part یا 5-part بر اساس نیاز"},{label:"ظرفیت",value:"متناسب با حجم نمونه"},{label:"اتصال",value:"LIS در مدل‌های سازگار"}],services:["تحلیل حجم کار","راه‌اندازی QC","آموزش اپراتور","برنامه مصرفی و سرویس"],documents:[],imageCredit:"Ptrump16 — CC BY-SA 4.0",imageSource:"https://commons.wikimedia.org/wiki/File:Automated_hematology_analyzer.jpg",imageLicense:"CC BY-SA 4.0",featured:false},
    {slug:"clinical-chemistry-analyzer",cat:"lab",image:"/assets/chemistry.jpg",gallery:[],fa:"آنالایزر بیوشیمی",en:"Clinical Chemistry Analyzer",tag:"Laboratory",summary:"راهکار بیوشیمی بالینی با ظرفیت، منوی تست و برنامه مصرفی متناسب با آزمایشگاه.",brand:"چندبرندی",model:"انتخاب متناسب با پروژه",availability:"پس از بررسی موجودی و مشخصات پروژه",intendedUse:"اندازه‌گیری پارامترهای بیوشیمی در نمونه‌های آزمایشگاهی",specs:["Flexible throughput","Reagent planning","Preventive maintenance"],technicalSpecs:[{label:"Throughput",value:"انتخاب بر اساس حجم نمونه"},{label:"Reagent",value:"سیستم باز یا بسته بسته به مدل"},{label:"Automation",value:"Standalone یا یکپارچه"}],services:["برنامه‌ریزی ظرفیت","طراحی منوی تست","آموزش و QC","نگهداری پیشگیرانه"],documents:[],imageCredit:"Bobjgalindo — CC BY-SA 4.0",imageSource:"https://commons.wikimedia.org/wiki/File:LabMachines.jpg",imageLicense:"CC BY-SA 4.0",featured:false},
    {slug:"medical-autoclave",cat:"sterile",image:"/assets/autoclave.jpg",gallery:[],fa:"اتوکلاو پزشکی",en:"Medical Autoclave",tag:"Sterile Chain",summary:"استریلیزاسیون بخار با انتخاب ظرفیت، چرخه و مستندسازی مناسب برای کلینیک یا CSSD.",brand:"چندبرندی",model:"انتخاب متناسب با پروژه",availability:"پس از بررسی موجودی و مشخصات پروژه",intendedUse:"استریلیزاسیون اقلام سازگار با بخار طبق دستورالعمل سازنده",specs:["Class B / Hospital grade","Cycle documentation","Validation support"],technicalSpecs:[{label:"ظرفیت",value:"رومیزی تا بیمارستانی"},{label:"چرخه",value:"بر اساس بار و استاندارد پروژه"},{label:"مستندسازی",value:"پرینتر یا ثبت دیجیتال در مدل‌های سازگار"}],services:["بررسی زیرساخت","نصب و راه‌اندازی","آموزش بارگذاری","پشتیبانی اعتبارسنجی"],documents:[],imageCredit:"Microrao — CC BY-SA 4.0",imageSource:"https://commons.wikimedia.org/wiki/File:Hospital_autoclave.jpg",imageLicense:"CC BY-SA 4.0",featured:false},
    {slug:"infusion-syringe-pumps",cat:"critical",image:"/assets/infusion.jpg",gallery:[],fa:"پمپ تزریق و سرنگ",en:"Infusion & Syringe Pumps",tag:"Care Delivery",summary:"تزریق کنترل‌شده برای بخش‌های مراقبتی با پیکربندی مستقل یا ماژولار.",brand:"چندبرندی",model:"انتخاب متناسب با پروژه",availability:"پس از بررسی موجودی و مشخصات پروژه",intendedUse:"تحویل کنترل‌شده مایعات و داروها توسط کاربر بالینی آموزش‌دیده",specs:["Stackable workflow","Drug library option","Battery & alarm review"],technicalSpecs:[{label:"فرم",value:"Infusion / Syringe / Modular"},{label:"کتابخانه دارویی",value:"در مدل‌های پشتیبانی‌شده"},{label:"توان",value:"برق و باتری بر اساس مدل"}],services:["بررسی workflow","پیکربندی و تست","آموزش بالینی","بازبینی دوره‌ای"],documents:[],imageCredit:"Senior Airman Andrea Posey / U.S. Air Force",imageSource:"https://commons.wikimedia.org/wiki/File:Infusion_pump_2.jpg",imageLicense:"Public domain",featured:false},
    {slug:"surgical-operating-light",cat:"surgery",image:"/assets/surgical-light.jpg",gallery:[],fa:"چراغ اتاق عمل",en:"Surgical Operating Light",tag:"OR Infrastructure",summary:"نور جراحی با طراحی نصب، شدت و کنترل سایه متناسب با اتاق عمل.",brand:"چندبرندی",model:"انتخاب متناسب با پروژه",availability:"پس از بررسی موجودی و مشخصات پروژه",intendedUse:"روشن‌سازی میدان جراحی در محیط اتاق عمل",specs:["Ceiling / mobile","Lux & temperature","Installation mapping"],technicalSpecs:[{label:"نصب",value:"سقفی، دیواری یا پرتابل"},{label:"نور",value:"شدت و میدان بر اساس پروژه"},{label:"زیرساخت",value:"نقشه سازه و برق پیش از نصب"}],services:["بازدید محل","نقشه نصب","نصب و تست","آموزش و نگهداری"],documents:[],imageCredit:"Tyler Frew MD — CC BY-SA 4.0",imageSource:"https://commons.wikimedia.org/wiki/File:Operating_Room_Surgical_Light_During_Plastic_Surgery_Procedure.jpg",imageLicense:"CC BY-SA 4.0",featured:false},
  ],
  services:[
    {en:"ADVISORY",title:"مشاوره فنی و انتخاب",text:"تعریف نیاز، مقایسه گزینه‌ها و انتخاب تجهیز بر اساس کاربرد، ظرفیت، زیرساخت و بودجه.",list:["Needs assessment","Technical comparison","Budget mapping"]},
    {en:"INSTALLATION",title:"نصب و راه‌اندازی",text:"بررسی محل، برنامه‌ریزی نصب، تست عملکرد و تحویل ساختارمند به تیم بهره‌بردار.",list:["Site survey","Installation & commissioning","Acceptance checklist"]},
    {en:"TRAINING",title:"آموزش کاربران",text:"آموزش کاربری و مراقبت روزمره برای بهره‌برداری درست و ایمن از تجهیزات.",list:["Operator training","Clinical workflow","Training records"]},
    {en:"MAINTENANCE",title:"نگهداری و خدمات",text:"برنامه نگهداری پیشگیرانه، عیب‌یابی و پیگیری سرویس برای کاهش توقف تجهیز.",list:["Preventive maintenance","Technical support","Service history"]},
    {en:"CONSUMABLES",title:"مصرفی و قطعات",text:"برنامه‌ریزی مصرفی‌ها و قطعات سازگار برای حفظ تداوم عملکرد و کنترل هزینه.",list:["Compatibility review","Stock planning","Replacement parts"]},
    {en:"DOCUMENTATION",title:"اسناد و انطباق",text:"ساختاردهی دیتاشیت، گارانتی، مدارک نصب، آموزش و سوابق خدمات پروژه.",list:["Technical dossier","Warranty package","Handover records"]},
  ],
  solutions:[
    {title:"ICU و مراقبت ویژه",en:"Critical Care Solution",image:"/assets/patient-monitor.jpg",text:"ترکیب مانیتورینگ، تزریق، تجهیزات حیاتی، آموزش و برنامه پشتیبانی برای محیط‌های حساس."},
    {title:"تصویربرداری تشخیصی",en:"Diagnostic Imaging",image:"/assets/ultrasound.jpg",text:"انتخاب سیستم، پروب‌ها، اتصال به PACS، نیازهای اتاق و آموزش متناسب با سناریوی تشخیصی."},
    {title:"آزمایشگاه تشخیص طبی",en:"Laboratory Workflow",image:"/assets/hematology.jpg",text:"طراحی جریان نمونه، ظرفیت، QC، مصرفی‌ها، اتصال LIS و برنامه نگهداری تجهیزات."},
    {title:"اتاق عمل و مرکز درمانی",en:"Operating Room Setup",image:"/assets/anesthesia.jpg",text:"راهکار یکپارچه برای تجهیزات، زیرساخت، نصب و آموزش در محیط‌های درمانی."},
  ],
  procurementSteps:[
    {title:"ثبت نیاز و RFQ",text:"نوع تجهیز، تعداد، کاربرد، محل پروژه و محدودیت زمانی دریافت می‌شود."},
    {title:"بررسی فنی و پیشنهاد",text:"گزینه‌ها، مشخصات، اسناد، زمان تحویل و شرایط خدمات در یک پیشنهاد منظم ارائه می‌شوند."},
    {title:"تأمین و هماهنگی",text:"پیگیری سفارش، اسناد، لجستیک و هماهنگی‌های اجرایی در یک مسیر مشخص انجام می‌شود."},
    {title:"تحویل و تکمیل",text:"نصب، تست، آموزش، تحویل اسناد و برنامه پشتیبانی پروژه تکمیل می‌شوند."},
  ],
  about:{headline:"فروش دستگاه کافی نیست؛ باید امکان یک تصمیم مطمئن را ساخت",paragraphs:["در تجهیزات پزشکی، کیفیت ارائه فقط به برند یا عددهای یک دیتاشیت وابسته نیست. تناسب تجهیز با محیط، امکان نصب، آمادگی کاربر، دسترسی به مصرفی و برنامه نگهداری همگی روی نتیجه نهایی اثر دارند.","به همین دلیل، معماری Clinoro بر پایه اطلاعات ساختارمند، مشاوره قابل فهم و پیگیری مرحله‌به‌مرحله شکل گرفته است."],image:"/assets/medical-visual.jpg",values:[{title:"شفافیت",text:"مشخصات، محدودیت‌ها، زمان‌بندی و تعهدات باید از ابتدا روشن باشند."},{title:"نگاه یکپارچه",text:"تجهیز، زیرساخت، آموزش، مصرفی و نگهداری را در کنار هم می‌بینیم."},{title:"دقت فنی",text:"پیشنهادها بر اساس سناریوی واقعی استفاده و نیاز قابل‌اندازه‌گیری شکل می‌گیرند."},{title:"پشتیبانی پایدار",text:"ارتباط با پروژه پس از تحویل هم ادامه دارد؛ چون بهره‌برداری بخشی از نتیجه است."}]},
  blogPosts:[
    ...dailyBlogPosts20260728,
    ...dailyBlogPosts20260727,
    ...v35BlogPosts,
    {id:"clinoro-cybersecurity-2026",slug:"connected-medical-device-cybersecurity-checklist-2026",title:"خرید تجهیزات پزشکی متصل در ۲۰۲۶؛ ۱۰ سؤال امنیتی قبل از قرارداد",excerpt:"از فهرست اجزای نرم‌افزاری و سیاست به‌روزرسانی تا ثبت رخداد و مسئولیت پاسخ‌گویی؛ مواردی که باید پیش از خرید روشن شوند.",content:`تجهیز پزشکی متصل فقط یک دستگاه نیست؛ بخشی از شبکه، داده و جریان بالینی مرکز است. راهنمای نهایی FDA در فوریه ۲۰۲۶ امنیت سایبری را موضوعی در چرخه عمر محصول و سیستم مدیریت کیفیت می‌بیند. بنابراین بررسی امنیت نباید به روز نصب یا یک رمز عبور محدود شود.

## ده سؤال برای جلسه فنی و قرارداد
- آیا سازنده فهرست اجزای نرم‌افزاری یا SBOM و روش اعلام آسیب‌پذیری‌ها را ارائه می‌کند؟
- دوره پشتیبانی نرم‌افزار و تاریخ پایان پشتیبانی دقیقاً چه زمانی است؟
- زمان هدف برای انتشار وصله‌های بحرانی چقدر است و نصب آن‌ها چه مسئولیتی دارد؟
- احراز هویت کاربران، نقش‌ها و ثبت فعالیت‌ها چگونه انجام می‌شود؟
- آیا دستگاه با تفکیک شبکه، دیواره آتش و حداقل دسترسی لازم سازگار است؟
- داده هنگام انتقال و ذخیره چگونه محافظت می‌شود؟
- پشتیبان‌گیری و بازگردانی تنظیمات دستگاه در بحران چگونه آزمایش می‌شود؟
- در صورت رخداد امنیتی، مسیر تماس و زمان پاسخ‌گویی سازنده چیست؟
- تغییرات نرم‌افزاری چگونه اعتبارسنجی و مستندسازی می‌شوند؟
- آیا آموزش تیم IT، مهندسی پزشکی و کاربر بالینی در تحویل پروژه دیده شده است؟

## مدارکی که بهتر است تحویل بگیرید
پاسخ شفاهی کافی نیست. سیاست وصله، معماری اتصال، فهرست پورت‌ها و سرویس‌ها، روش پشتیبان‌گیری، سابقه نسخه نرم‌افزار، مسئولیت‌های خریدار و فروشنده و برنامه پایان پشتیبانی باید در پرونده تجهیز ثبت شوند.

## یک تصمیم عملی
ریسک را بر اساس کاربرد واقعی دستگاه اولویت‌بندی کنید. تجهیزی که به شبکه بیمارستان، سامانه مرکزی یا داده قابل‌شناسایی بیمار متصل است به کنترل‌ها و هماهنگی بیشتری میان تیم‌های بالینی، IT و مهندسی پزشکی نیاز دارد.

> این چک‌لیست جایگزین ارزیابی امنیتی، الزامات قانونی محل استفاده یا دستورالعمل سازنده نیست؛ هدف آن روشن‌کردن سؤال‌های قراردادی و اجرایی است.`,image:"/assets/blog-cybersecurity-real.jpg",category:"امنیت تجهیزات",author:"تحریریه Clinoro",publishedAt:"2026-07-22",published:true,seoTitle:"چک‌لیست امنیت سایبری تجهیزات پزشکی متصل در ۲۰۲۶ | Clinoro",seoDescription:"ده سؤال امنیتی مهم برای ارزیابی تجهیزات پزشکی متصل پیش از خرید، نصب و قرارداد خدمات.",sources:[{title:"FDA — Cybersecurity in Medical Devices (February 2026)",url:"https://www.fda.gov/regulatory-information/search-fda-guidance-documents/cybersecurity-medical-devices-quality-management-system-considerations-and-content-premarket"},{title:"FDA — Cybersecurity in Medical Devices FAQs",url:"https://www.fda.gov/medical-devices/digital-health-center-excellence/cybersecurity-medical-devices-frequently-asked-questions-faqs"}],imageCredit:"Tony Webster — CC BY 2.0",imageSource:"https://commons.wikimedia.org/wiki/File:Hospital_Patient_Monitor_(17239884329).jpg"},
    {id:"clinoro-ai-imaging-2026",slug:"ai-medical-imaging-procurement-checklist",title:"هوش مصنوعی در تصویربرداری پزشکی؛ چک‌لیست ارزیابی پیش از خرید",excerpt:"برچسب AI به‌تنهایی معیار خرید نیست؛ کاربرد تعریف‌شده، شواهد عملکرد، نظارت انسانی، تغییرات مدل و یکپارچگی باید قابل ارزیابی باشند.",content:`فهرست دستگاه‌های پزشکی دارای قابلیت هوش مصنوعی FDA مرتب به‌روزرسانی می‌شود، اما خود FDA تأکید می‌کند که این فهرست جامع همه دستگاه‌ها نیست. برای خریدار، نکته مهم‌تر از عنوان AI این است که قابلیت موردنظر دقیقاً برای چه کاربرد، کاربر و جمعیت بیماری طراحی و ارزیابی شده است.

## ابتدا کاربرد را دقیق تعریف کنید
مشخص کنید الگوریتم برای تشخیص، اولویت‌بندی فهرست کار، اندازه‌گیری، بازسازی تصویر یا کمک به گزارش‌نویسی استفاده می‌شود. سپس روشن کنید خروجی آن توصیه است، هشدار است یا مستقیماً بخشی از تصمیم بالینی می‌شود.

## شش محور ارزیابی
- شواهد عملکرد: معیارها، اندازه نمونه، محیط آزمون و محدودیت‌های اعلام‌شده چیست؟
- تناسب جمعیت: داده‌های ارزیابی تا چه حد به جمعیت و پروتکل‌های مرکز شما نزدیک‌اند؟
- نظارت انسانی: کاربر چگونه خروجی را تأیید، رد یا اصلاح می‌کند و خطا چگونه دیده می‌شود؟
- تغییر مدل: نسخه‌ها، به‌روزرسانی‌ها و اثر هر تغییر چگونه اطلاع‌رسانی و اعتبارسنجی می‌شوند؟
- یکپارچگی: ارتباط با modality، PACS، RIS و ایستگاه گزارش‌نویسی در سناریوی واقعی تست می‌شود؟
- بهره‌برداری: زمان پردازش، قطعی سرویس، پشتیبانی، آموزش و پایش پس از نصب چگونه مدیریت می‌شوند؟

## پایلوت را شبیه محیط واقعی طراحی کنید
نمونه‌های متنوع، چند کاربر با تجربه‌های متفاوت و زمان‌های شلوغ را وارد آزمون کنید. تنها دقت کلی کافی نیست؛ نرخ موارد از دست‌رفته، هشدارهای اضافی، زمان ذخیره‌شده و اثر ابزار بر جریان کار باید جداگانه دیده شوند.

## تصمیم خرید، تصمیم چرخه عمر است
راهنمای پیشنهادی FDA درباره نرم‌افزارهای دارای AI بر مدیریت ریسک در چرخه عمر، شفافیت و کنترل تغییر تأکید دارد. در قرارداد نیز نسخه نرم‌افزار، روش پایش، سیاست به‌روزرسانی، مالکیت داده و خروج از سرویس را روشن کنید.

> این مطلب یک چارچوب خرید و ارزیابی فناوری است و جایگزین ارزیابی بالینی یا مقررات محل استفاده نیست.`,image:"/assets/blog-ai-imaging-real.jpg",category:"هوش مصنوعی پزشکی",author:"تحریریه Clinoro",publishedAt:"2026-07-22",published:true,seoTitle:"چک‌لیست خرید هوش مصنوعی در تصویربرداری پزشکی | Clinoro",seoDescription:"راهنمای ارزیابی کاربرد، شواهد، نظارت انسانی، تغییرات مدل و یکپارچگی AI در تصویربرداری پزشکی.",sources:[{title:"FDA — AI-Enabled Medical Devices",url:"https://www.fda.gov/medical-devices/software-medical-device-samd/artificial-intelligence-enabled-medical-devices"},{title:"FDA — AI-Enabled Device Software Functions: Lifecycle Management (Draft, 2025)",url:"https://www.fda.gov/regulatory-information/search-fda-guidance-documents/artificial-intelligence-enabled-device-software-functions-lifecycle-management-and-marketing"}],imageCredit:"U.S. Navy / J.L. Chirrick — Public Domain",imageSource:"https://commons.wikimedia.org/wiki/File:US_Navy_100219-N-1525C-001_Lt._Cmdr._Robin_Lindsay,_a_facial_plastic_and_reconstructive_surgeon_from_Virginia_Beach,_Va.,_reviews_CT_scan_images_of_a_Haitian_earthquake_victim.jpg"},
    {id:"clinoro-lifecycle-cost-2026",slug:"medical-equipment-total-cost-of-ownership",title:"هزینه واقعی مالکیت تجهیزات پزشکی؛ فراتر از قیمت خرید",excerpt:"چطور سرویس، مصرفی، توقف، آموزش و پایان عمر را وارد مقایسه کنیم تا انتخاب ارزان امروز، هزینه پنهان فردا نشود؟",content:`دو دستگاه با قیمت خرید نزدیک می‌توانند در پنج سال هزینه و دسترس‌پذیری کاملاً متفاوتی داشته باشند. سازمان جهانی بهداشت در برنامه نگهداری تجهیزات پزشکی بر موجودی دقیق، بازرسی دوره‌ای و نگهداری پیشگیرانه و اصلاحی تأکید می‌کند. این موارد باید پیش از خرید به زبان بودجه و قرارداد ترجمه شوند.

## مدل ساده هزینه کل مالکیت
هزینه کل مالکیت یا TCO را می‌توان از جمع قیمت خرید، حمل و نصب، آماده‌سازی زیرساخت، آموزش، قرارداد سرویس، قطعات، مصرفی‌ها، کالیبراسیون، نرم‌افزار، توقف تجهیز و هزینه خروج از سرویس ساخت.

## پنج داده‌ای که قبل از مقایسه لازم دارید
- حجم واقعی کار و ساعات استفاده در روز
- فهرست مصرفی‌ها، عمر مفید و امکان تأمین جایگزین
- برنامه سرویس، کالیبراسیون و قطعات پرمصرف
- زمان پاسخ و تعمیر و وجود دستگاه جایگزین
- دوره پشتیبانی سازنده و مسیر خروج ایمن از سرویس

## توقف تجهیز را قیمت‌گذاری کنید
توقف فقط هزینه تعمیر نیست. جابه‌جایی بیمار، لغو خدمت، اضافه‌کاری، ارسال نمونه یا برون‌سپاری و اثر بر رضایت کاربر هم باید در سناریوهای ریسک دیده شوند. برای تجهیزات حیاتی، زمان بازیابی و موجودی قطعات می‌تواند از تخفیف اولیه مهم‌تر باشد.

## پرونده تجهیز را از روز اول بسازید
اطلاعات نصب، آموزش، نسخه نرم‌افزار، کالیبراسیون، سرویس‌ها، قطعات تعویض‌شده و رخدادها را در یک پرونده واحد نگه دارید. موجودی قابل اعتماد، پایه تصمیم‌گیری برای نگهداری، بودجه سال بعد و زمان جایگزینی است.

## نتیجه عملی
از هر تأمین‌کننده بخواهید یک سناریوی سه تا پنج‌ساله با فرض‌های شفاف ارائه کند. سپس قیمت خرید را کنار هزینه سالانه، زمان توقف موردانتظار، تعهدات خدمات و ریسک تأمین مقایسه کنید.`,image:"/assets/blog-maintenance-real.jpg",category:"نگهداری و بهره‌برداری",author:"تحریریه Clinoro",publishedAt:"2026-07-22",published:true,seoTitle:"هزینه کل مالکیت تجهیزات پزشکی و برنامه نگهداری | Clinoro",seoDescription:"راهنمای محاسبه TCO تجهیزات پزشکی با درنظرگرفتن سرویس، قطعات، مصرفی، آموزش و هزینه توقف.",sources:[{title:"WHO — Medical equipment maintenance programme overview",url:"https://www.who.int/publications/i/item/9789241501538"},{title:"WHO — Management and safe use of medical devices",url:"https://www.who.int/teams/health-product-policy-and-standards/assistive-and-medical-technology/medical-devices/management-use"}],imageCredit:"U.S. Navy / Adriones Johnson — Public Domain",imageSource:"https://commons.wikimedia.org/wiki/File:Biomedical_Technicians_Test_Hospital_Equipment_(8587864).jpg"},
    {id:"clinoro-dicom-pacs-2026",slug:"dicom-pacs-procurement-checklist",title:"DICOM و PACS پیش از خرید دستگاه تصویربرداری؛ چه چیزهایی را باید تست کرد؟",excerpt:"اتصال روی کاغذ کافی نیست؛ سرویس‌های DICOM، جریان اطلاعات بیمار، تعهد ذخیره و آزمون پذیرش باید پیش از تحویل روشن باشند.",content:`استاندارد DICOM برای تبادل، مدیریت و یکپارچه‌سازی اطلاعات تصویربرداری پزشکی ساخته شده و امکان ارتباط میان دستگاه‌های تصویربرداری، PACS، ایستگاه‌های کاری و سامانه‌های آرشیو از سازندگان مختلف را فراهم می‌کند. با این حال عبارت DICOM compatible بدون تعیین سرویس‌ها و سناریوی آزمون، برای خرید کافی نیست.

## سند Conformance Statement را مقایسه کنید
از سازنده دستگاه و PACS سند DICOM Conformance Statement را بگیرید. این سند باید نقش‌ها، سرویس‌ها، نسخه‌ها و محدودیت‌های پیاده‌سازی را روشن کند. تطبیق دو سند، قدم اول است؛ آزمون در شبکه واقعی قدم بعدی است.

## سرویس‌های مهم در سناریوی پذیرش
- Storage: ارسال تصویر و داده مرتبط به آرشیو
- Query/Retrieve: جست‌وجو و بازیابی مطالعه‌ها
- Modality Worklist: دریافت فهرست کار و اطلاعات بیمار برای کاهش ورود دستی
- Modality Performed Procedure Step: اعلام وضعیت و اطلاعات انجام فرایند
- Storage Commitment: تأیید اینکه آرشیو مسئولیت نگهداری داده را پذیرفته است

## آزمون فقط اتصال نیست
نام و شناسه بیمار، تاریخ و زمان، accession number، نام پروتکل، سری‌ها، گزارش خطا، مطالعه اورژانسی و بازیابی پس از قطع شبکه را تست کنید. همچنین مشخص کنید تصاویر با چه کیفیت و فشرده‌سازی ارسال می‌شوند و چه کسی خطاهای صف ارسال را پایش می‌کند.

## شبکه و امنیت را هم‌زمان ببینید
IP، پورت، AE Title، DNS، همگام‌سازی زمان، گواهی‌ها، تفکیک شبکه و دسترسی سرویس باید پیش از نصب ثبت شوند. هر تغییر زیرساختی بعد از تحویل می‌تواند جریان کار را مختل کند، پس مسئولیت هر تیم در صورت‌جلسه پذیرش مشخص باشد.

## خروجی جلسه فنی
یک ماتریس اتصال بنویسید: هر سامانه، سرویس DICOM، نقش، مقصد، مسئول پیکربندی و معیار قبولی. این ماتریس اختلاف برداشت میان فروشنده، IT، تصویربرداری و PACS را کم می‌کند.`,image:"/assets/blog-imaging-real.jpg",category:"یکپارچگی و استانداردها",author:"تحریریه Clinoro",publishedAt:"2026-07-22",published:true,seoTitle:"چک‌لیست DICOM و PACS برای خرید تجهیزات تصویربرداری | Clinoro",seoDescription:"سرویس‌های DICOM و سناریوهای آزمون پذیرش PACS که باید پیش از خرید و تحویل دستگاه تصویربرداری بررسی شوند.",sources:[{title:"DICOM Standard — Overview",url:"https://www.dicomstandard.org/using/overview"},{title:"DICOM Standard — Current Edition",url:"https://www.dicomstandard.org/current"}],imageCredit:"Shixart1985 — CC BY 2.0",imageSource:"https://commons.wikimedia.org/wiki/File:Medical_examination_room_with_ultrasound_equipment.jpg"},
    {id:"clinoro-guide-1",slug:"medical-equipment-selection-guide",title:"پنج معیار کلیدی برای انتخاب تجهیزات پزشکی",excerpt:"چطور مشخصات فنی را به یک تصمیم اجرایی مطمئن برای مرکز درمانی تبدیل کنیم؟",content:"انتخاب تجهیزات پزشکی فقط مقایسه چند عدد در دیتاشیت نیست. کاربرد واقعی، زیرساخت محل، توانایی تیم کاربر، دسترسی به مصرفی و برنامه خدمات باید هم‌زمان بررسی شوند.\n\nپیش از تصمیم نهایی، سناریوی استفاده را شفاف کنید و معیارهای پذیرش، آموزش و نگهداری را در کنار قیمت و زمان تحویل بنویسید. این نگاه یکپارچه ریسک پروژه را کاهش می‌دهد و بهره‌برداری را قابل پیش‌بینی‌تر می‌کند.",image:"/assets/medical-visual.jpg",category:"راهنمای خرید",author:"تیم Clinoro",publishedAt:"2026-07-21",published:true,seoTitle:"راهنمای انتخاب تجهیزات پزشکی | Clinoro",seoDescription:"پنج معیار کاربردی برای انتخاب مطمئن‌تر تجهیزات پزشکی و برنامه‌ریزی بهتر پروژه.",sources:[],imageCredit:"",imageSource:""},
  ],
  trustItems:[],
  customBlocks:{home:[],products:[],services:[],solutions:[],procurement:[],about:[],contact:[],blog:[]},
  injections:{
    global:emptyInjection(),
    pages:{home:emptyInjection(),products:emptyInjection(),services:emptyInjection(),solutions:emptyInjection(),procurement:emptyInjection(),about:emptyInjection(),contact:emptyInjection(),blog:emptyInjection()},
  },
};

export async function getSiteContent():Promise<SiteContent>{
  try{
    await ensureDatabase();
    const row=await getD1().prepare("SELECT document FROM site_content WHERE id = ?").bind("primary").first<{document:string}>();
    if(!row) return defaultSiteContent;
    return mergeContent(defaultSiteContent,JSON.parse(row.document) as Partial<SiteContent>);
  }catch{return defaultSiteContent;}
}

export async function saveSiteContent(content:SiteContent){
  await ensureDatabase();
  await getD1().prepare("INSERT INTO site_content (id, document, updated_at) VALUES (?, ?, ?) ON CONFLICT(id) DO UPDATE SET document = excluded.document, updated_at = excluded.updated_at").bind("primary",JSON.stringify(content),Date.now()).run();
}

function mergeContent(base:SiteContent,value:Partial<SiteContent>):SiteContent{
  const upgradedLogo=(value.schemaVersion??0)<3?base.general.logoUrl:(value.general?.logoUrl||base.general.logoUrl);
  const savedPosts=Array.isArray(value.blogPosts)?value.blogPosts:[];
  const seededIds=new Set(base.blogPosts.map(post=>post.id));
  const mergedPosts=(value.schemaVersion??0)<9
    ? [...base.blogPosts.map(seed=>savedPosts.find(post=>post.id===seed.id)??seed),...savedPosts.filter(post=>!seededIds.has(post.id))]
    : (savedPosts.length?savedPosts:base.blogPosts);
  const legacyImages=["/assets/product-1.jpg","/assets/product-4.jpg","/assets/product-3.jpg","/assets/product-2.jpg","/assets/product-6.jpg","/assets/product-5.jpg","/assets/product-7.jpg","/assets/product-8.jpg"];
  const legacyMap:Record<string,string>={"/assets/product-1.jpg":"/assets/patient-monitor.jpg","/assets/product-2.jpg":"/assets/hematology.jpg","/assets/product-3.jpg":"/assets/ultrasound.jpg","/assets/product-4.jpg":"/assets/anesthesia.jpg","/assets/product-5.jpg":"/assets/autoclave.jpg","/assets/product-6.jpg":"/assets/chemistry.jpg","/assets/product-7.jpg":"/assets/infusion.jpg","/assets/product-8.jpg":"/assets/surgical-light.jpg"};
  const savedProducts=Array.isArray(value.products)?value.products:[];
  const normalizeProduct=(saved:ProductItem,seed:ProductItem,index:number):ProductItem=>{
    const savedImage=typeof saved.image==="string"?saved.image:"";
    return {
      ...seed,...saved,
      slug:saved.slug||seed.slug||`product-${index+1}`,
      image:(value.schemaVersion??0)<6&&legacyImages.includes(savedImage)?seed.image:(savedImage||seed.image),
      gallery:Array.isArray(saved.gallery)?saved.gallery:seed.gallery,
      specs:Array.isArray(saved.specs)?saved.specs:seed.specs,
      technicalSpecs:Array.isArray(saved.technicalSpecs)?saved.technicalSpecs:seed.technicalSpecs,
      services:Array.isArray(saved.services)?saved.services:seed.services,
      documents:Array.isArray(saved.documents)?saved.documents:seed.documents,
    };
  };
  let products:ProductItem[];
  if((value.schemaVersion??0)>=6){
    products=savedProducts.map((saved,index)=>normalizeProduct(saved,base.products.find(seed=>seed.slug===saved.slug||seed.en===saved.en)||base.products[0],index));
  }else{
    const used=new Set<ProductItem>();
    const seeded=base.products.map((seed,index)=>{const saved=savedProducts.find(item=>!used.has(item)&&(item.en===seed.en||item.image===legacyImages[index]))||savedProducts.find(item=>!used.has(item));if(!saved)return seed;used.add(saved);return normalizeProduct(saved,seed,index)});
    const extras=savedProducts.filter(item=>!used.has(item)).map((item,index)=>normalizeProduct(item,base.products[0],base.products.length+index));
    products=[...seeded,...extras];
  }
  const pages=Object.fromEntries((Object.keys(base.pages) as Array<keyof SiteContent["pages"]>).map(key=>[
    key,{...base.pages[key],...value.pages?.[key],image:(value.schemaVersion??0)<6&&value.pages?.[key]?.image?.startsWith("/assets/bg-")?base.pages[key].image:(value.pages?.[key]?.image||base.pages[key].image)},
  ])) as SiteContent["pages"];
  const home={...base.home,...value.home};
  if((value.schemaVersion??0)<6){
    if(home.heroImage==="/assets/clinoro-hero-prism.png")home.heroImage=base.home.heroImage;
    home.categories=(home.categories||base.home.categories).map((item,index)=>({...item,image:legacyMap[item.image]||item.image||base.home.categories[index]?.image||"/assets/medical-visual.jpg"}));
  }
  const solutions=(Array.isArray(value.solutions)?value.solutions:base.solutions).map((item,index)=>({...base.solutions[index],...item,image:(value.schemaVersion??0)<6?(legacyMap[item.image]||item.image):item.image}));
  return {
    ...base,...value,schemaVersion:base.schemaVersion,
    general:{...base.general,...value.general,logoUrl:upgradedLogo,motionMode:(value.schemaVersion??0)<6&&value.general?.motionMode==="full"?"subtle":(value.general?.motionMode||base.general.motionMode)},
    home,
    pages,
    products,
    solutions,
    about:{...base.about,...value.about},
    blogPosts:mergedPosts.map(post=>({...post,sources:Array.isArray(post.sources)?post.sources:[],imageCredit:post.imageCredit||"",imageSource:post.imageSource||"",imageAlt:post.imageAlt||post.title,imageLicense:post.imageLicense||""})),
    trustItems:Array.isArray(value.trustItems)?value.trustItems:base.trustItems,
    customBlocks:{...base.customBlocks,...value.customBlocks},
    injections:{
      global:{...base.injections.global,...value.injections?.global},
      pages:Object.fromEntries((Object.keys(base.injections.pages) as PageKey[]).map(key=>[key,{...base.injections.pages[key],...value.injections?.pages?.[key]}])) as Record<PageKey,InjectionCode>,
    },
  };
}
