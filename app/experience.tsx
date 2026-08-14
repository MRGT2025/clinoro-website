"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Activity,
  BadgeCheck,
  Boxes,
  Building2,
  CircleDot,
  ClipboardCheck,
  FileCheck2,
  FlaskConical,
  Gauge,
  HeartPulse,
  Hospital,
  MessageCircle,
  Microscope,
  Pause,
  Play,
  Route,
  ScanLine,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Target,
  Wrench,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import { useSiteContent } from "./content-context";

const showcase = [
  {
    icon: Activity,
    label: "مراقبت ویژه",
    en: "CRITICAL CARE",
    title: "اطلاعات حیاتی، در لحظه‌ای که هر ثانیه مهم است",
    text: "پایش چندپارامتری، مدیریت هشدار و اتصال مرکزی برای ICU، CCU، اورژانس و ریکاوری.",
    image: "/assets/patient-monitor.jpg",
    stat: "24/7",
    statLabel: "Continuous monitoring",
    color: "#47d7ee",
  },
  {
    icon: ScanLine,
    label: "تصویربرداری",
    en: "DIAGNOSTIC IMAGING",
    title: "تصویر واضح‌تر، تصمیم بالینی مطمئن‌تر",
    text: "سیستم‌های تصویربرداری بر اساس نوع پروب، workflow، کیفیت تصویر و ظرفیت واقعی مرکز انتخاب می‌شوند.",
    image: "/assets/ultrasound.jpg",
    stat: "4D",
    statLabel: "Advanced imaging",
    color: "#6684ff",
  },
  {
    icon: FlaskConical,
    label: "آزمایشگاه",
    en: "LABORATORY",
    title: "جریان آزمایشگاهی سریع، دقیق و قابل‌کنترل",
    text: "آنالایزر، QC، ظرفیت نمونه، مصرفی‌ها و اتصال LIS در قالب یک جریان یکپارچه دیده می‌شوند.",
    image: "/assets/hematology.jpg",
    stat: "LIS",
    statLabel: "Workflow ready",
    color: "#22b8b0",
  },
  {
    icon: Stethoscope,
    label: "اتاق عمل",
    en: "OPERATING ROOM",
    title: "هماهنگی فناوری و ایمنی در قلب اتاق عمل",
    text: "تجهیزات بیهوشی، نور، زیرساخت، نصب و آموزش با نگاه یکپارچه به محیط OR تعریف می‌شوند.",
    image: "/assets/anesthesia.jpg",
    stat: "OR",
    statLabel: "Integrated setup",
    color: "#ff8f7a",
  },
];

const planner = [
  {
    icon: Hospital,
    label: "بیمارستان",
    en: "HOSPITAL",
    color: "#47d7ee",
    title: "یک اکوسیستم متصل برای بخش‌های حیاتی",
    text: "از ICU و اتاق عمل تا تصویربرداری، زیرساخت و آموزش را در یک نقشه اجرایی واحد می‌بینیم.",
    products: ["مانیتورینگ مرکزی", "بیهوشی و اتاق عمل", "تصویربرداری"],
    result: "طرح جامع تجهیز و راه‌اندازی",
  },
  {
    icon: Building2,
    label: "کلینیک",
    en: "CLINIC",
    color: "#6684ff",
    title: "انتخاب فشرده برای فضای محدود و مراجعه بالا",
    text: "ترکیب محصول، چیدمان، ظرفیت و بودجه برای راه‌اندازی سریع‌تر و تجربه بهتر اپراتور.",
    products: ["سونوگرافی", "ECG و علائم حیاتی", "تجهیزات معاینه"],
    result: "پکیج بهینه کلینیک",
  },
  {
    icon: Microscope,
    label: "آزمایشگاه",
    en: "LAB",
    color: "#22b8b0",
    title: "جریان نمونه؛ از پذیرش تا نتیجه",
    text: "ظرفیت، QC، مصرفی، اتصال LIS و برنامه سرویس در یک معماری قابل توسعه طراحی می‌شوند.",
    products: ["آنالایزر", "سانتریفیوژ", "اتوماسیون و LIS"],
    result: "Workflow آزمایشگاهی",
  },
  {
    icon: Stethoscope,
    label: "اتاق عمل",
    en: "OR",
    color: "#ff8f7a",
    title: "هماهنگی ایمنی، عملکرد و زیرساخت",
    text: "ماشین بیهوشی، مانیتورینگ، نور، نصب و آموزش به‌صورت یک سیستم یکپارچه برنامه‌ریزی می‌شوند.",
    products: ["ماشین بیهوشی", "مانیتور بیمار", "چراغ جراحی"],
    result: "راهکار یکپارچه OR",
  },
];

const heroSignals = ["انتخاب هوشمندتر", "اجرای دقیق‌تر", "پشتیبانی ماندگار"];

export function HeroSignal({ signals = heroSignals }: { signals?: string[] }) {
  const { general } = useSiteContent();
  const safeSignals = signals.length ? signals : heroSignals;
  const [active, setActive] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (general.motionMode === "reduced") return;
    const timer = window.setInterval(
      () => setActive((value) => (value + 1) % safeSignals.length),
      general.motionMode === "subtle" ? 4200 : 2900,
    );
    return () => window.clearInterval(timer);
  }, [safeSignals.length, general.motionMode]);
  const value = safeSignals[active % safeSignals.length];
  return (
    <span className="hero-signal" key={value}>
      {value}
    </span>
  );
}

export function ExperienceLayer() {
  const { general } = useSiteContent();
  const [motion, setMotion] = useState(general.motionMode !== "reduced");
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("motion-ready");
    root.dataset.motion = general.motionMode;
    const reduced =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      general.motionMode === "reduced";
    const interactive = !reduced && general.motionMode === "full";
    let frame = 0;
    const updatePointer = (event: PointerEvent) => {
      if (!interactive) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        root.style.setProperty("--pointer-x", `${event.clientX}px`);
        root.style.setProperty("--pointer-y", `${event.clientY}px`);
        root.style.setProperty(
          "--tilt-x",
          `${(event.clientY / window.innerHeight - 0.5) * -3}deg`,
        );
        root.style.setProperty(
          "--tilt-y",
          `${(event.clientX / window.innerWidth - 0.5) * 3.5}deg`,
        );
      });
    };
    const updateScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      root.style.setProperty(
        "--page-progress",
        `${max > 0 ? (window.scrollY / max) * 100 : 0}%`,
      );
      root.style.setProperty(
        "--scroll-shift",
        `${Math.min(window.scrollY * 0.08, 70)}px`,
      );
    };
    const reactive = interactive
      ? [
          ...document.querySelectorAll<HTMLElement>(
            ".glass-panel,.glass-nav,.service-lens,.product-card,.detail-card,.blog-card,.insight-card,.source-card,.related-card,.decision-console,.trust-protocol-console,.catalog-decision-profile,.trust-control-grid article",
          ),
        ]
      : [];
    const handlers = reactive.map((element) => {
      const handler = (event: PointerEvent) => {
        const rect = element.getBoundingClientRect();
        element.style.setProperty(
          "--shine-x",
          `${event.clientX - rect.left}px`,
        );
        element.style.setProperty("--shine-y", `${event.clientY - rect.top}px`);
      };
      element.addEventListener("pointermove", handler);
      return [element, handler] as const;
    });
    window.addEventListener("pointermove", updatePointer, { passive: true });
    window.addEventListener("scroll", updateScroll, { passive: true });
    updateScroll();
    return () => {
      cancelAnimationFrame(frame);
      root.classList.remove("motion-ready");
      delete root.dataset.motion;
      window.removeEventListener("pointermove", updatePointer);
      window.removeEventListener("scroll", updateScroll);
      handlers.forEach(([element, handler]) =>
        element.removeEventListener("pointermove", handler),
      );
    };
  }, [general.motionMode]);
  useEffect(() => {
    document.documentElement.classList.toggle("motion-paused", !motion);
    return () => document.documentElement.classList.remove("motion-paused");
  }, [motion]);
  return (
    <>
      <div className="cursor-aurora" />
      <div className="page-progress">
        <i />
      </div>
      <nav className="assist-dock glass-panel" aria-label="دسترسی سریع">
        <Link href="/products" aria-label="مشاهده محصولات">
          <Boxes size={18} />
          <span>محصولات</span>
        </Link>
        <Link href="/contact" aria-label="ارتباط با کارشناس">
          <MessageCircle size={18} />
          <span>کارشناس</span>
        </Link>
        <button
          onClick={() => setMotion((value) => !value)}
          aria-label={
            motion ? "توقف حرکت‌های تزئینی" : "فعال‌کردن حرکت‌های تزئینی"
          }
        >
          {motion ? <Pause size={17} /> : <Play size={17} />}
          <span>{motion ? "توقف حرکت" : "شروع حرکت"}</span>
        </button>
      </nav>
    </>
  );
}

export function InteractiveShowcase() {
  const [active, setActive] = useState(0);
  const item = showcase[active];
  const Icon = item.icon;
  return (
    <section
      className="immersive-showcase motion-section"
      style={{ "--spot-color": item.color } as CSSProperties}
    >
      <div className="showcase-grid" />
      <div className="showcase-glow" />
      <div className="site-wrap showcase-shell">
        <div className="showcase-tabs glass-panel prism-edge" data-reveal>
          <span className="showcase-tabs-label">EXPLORE SYSTEMS</span>
          {showcase.map((entry, index) => {
            const TabIcon = entry.icon;
            return (
              <button
                className={index === active ? "active" : ""}
                aria-pressed={index === active}
                onClick={() => setActive(index)}
                key={entry.en}
              >
                <span>
                  <TabIcon size={19} />
                </span>
                <b>{entry.label}</b>
                <small>0{index + 1}</small>
              </button>
            );
          })}
        </div>
        <div className="showcase-visual prism-edge" data-reveal>
          <div
            key={item.image}
            className="showcase-photo showcase-image-in"
            role="img"
            aria-label={item.label}
            style={{ backgroundImage: `url(${item.image})` }}
          />
          <div className="showcase-shade" />
          <div className="showcase-live glass-panel">
            <i />
            <span>CLINICAL SYSTEM</span>
            <b>ONLINE</b>
          </div>
          <div className="showcase-stat glass-panel">
            <strong>{item.stat}</strong>
            <small>{item.statLabel}</small>
          </div>
          <div className="scan-beam" />
        </div>
        <div className="showcase-copy" data-reveal>
          <span className="eyebrow">
            <Sparkles size={14} />
            {item.en}
          </span>
          <h2 key={`${item.en}-title`} className="showcase-copy-in">
            {item.title}
          </h2>
          <p key={`${item.en}-text`} className="showcase-copy-in">
            {item.text}
          </p>
          <div className="showcase-meter">
            <span>
              <i />
            </span>
            <small>CLINORO INTEGRATION INDEX</small>
          </div>
          <Link className="button button-primary" href="/products">
            بررسی تجهیزات <ArrowLeft size={18} />
          </Link>
        </div>
        <div className="showcase-symbol" aria-hidden="true">
          <Icon size={48} />
        </div>
      </div>
    </section>
  );
}

export function ClinicalPlanner() {
  const [active, setActive] = useState(0);
  const item = planner[active];
  const Icon = item.icon;
  return (
    <section
      className="planner-section motion-section"
      style={{ "--planner-color": item.color } as CSSProperties}
    >
      <div className="planner-aura" />
      <div className="site-wrap">
        <header className="planner-head" data-reveal>
          <div>
            <span className="eyebrow">
              <CircleDot size={14} /> GUIDED DISCOVERY
            </span>
            <h2>مسیر مناسب را از محیط درمانی خودتان شروع کنید</h2>
          </div>
          <p>
            به‌جای مرور بی‌پایان کاتالوگ، نوع مرکز را انتخاب کنید تا راهکارهای
            مرتبط و قدم بعدی روشن شوند.
          </p>
        </header>
        <div className="planner-console glass-panel prism-edge" data-reveal>
          <div className="planner-tabs">
            <small>فضای شما کدام است؟</small>
            {planner.map((entry, index) => {
              const TabIcon = entry.icon;
              return (
                <button
                  key={entry.en}
                  className={active === index ? "active" : ""}
                  aria-pressed={active === index}
                  onClick={() => setActive(index)}
                >
                  <span>
                    <TabIcon size={20} />
                  </span>
                  <b>{entry.label}</b>
                  <i>{entry.en}</i>
                </button>
              );
            })}
          </div>
          <div className="planner-map" aria-hidden="true">
            <div className="planner-rings">
              <i />
              <i />
              <i />
            </div>
            <span className="map-node node-a">
              <HeartPulse size={18} />
            </span>
            <span className="map-node node-b">
              <ScanLine size={18} />
            </span>
            <span className="map-node node-c">
              <FlaskConical size={18} />
            </span>
            <span className="map-node node-d">
              <Wrench size={18} />
            </span>
            <div className="map-core">
              <span>
                <Icon size={34} />
              </span>
              <b key={item.en}>{item.en}</b>
              <small>CLINORO FLOW</small>
            </div>
            <div className="map-scan" />
          </div>
          <div className="planner-result" key={item.en}>
            <span className="result-label">
              <Sparkles size={14} />
              {item.result}
            </span>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
            <div className="result-products">
              {item.products.map((product, index) => (
                <span key={product}>
                  <i>0{index + 1}</i>
                  {product}
                </span>
              ))}
            </div>
            <div className="result-actions">
              <Link className="button button-primary" href="/contact">
                دریافت پیشنهاد اختصاصی <ArrowLeft size={18} />
              </Link>
              <Link href="/solutions">دیدن راهکارها</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function IntentRibbon() {
  return (
    <section className="intent-ribbon">
      <div className="site-wrap intent-shell glass-panel prism-edge">
        <div className="intent-lead">
          <span>START HERE</span>
          <b>امروز دنبال چه هستید؟</b>
        </div>
        <Link href="/products">
          <Boxes size={20} />
          <span>
            <b>انتخاب محصول</b>
            <small>جست‌وجو و مقایسه تجهیزات</small>
          </span>
          <ArrowLeft size={17} />
        </Link>
        <Link href="/#planner">
          <Activity size={20} />
          <span>
            <b>راهنمای انتخاب</b>
            <small>مسیر تعاملی سریع</small>
          </span>
          <ArrowLeft size={17} />
        </Link>
        <Link href="/services">
          <Wrench size={20} />
          <span>
            <b>خدمات و پشتیبانی</b>
            <small>نصب، آموزش و سرویس</small>
          </span>
          <ArrowLeft size={17} />
        </Link>
        <Link href="/credentials">
          <FileCheck2 size={20} />
          <span>
            <b>اسناد و اعتماد</b>
            <small>مدارک، منابع و شفافیت</small>
          </span>
          <ArrowLeft size={17} />
        </Link>
      </div>
    </section>
  );
}

const decisionEnvironments = [
  {
    id: "hospital",
    label: "بیمارستان",
    en: "HOSPITAL",
    icon: Hospital,
    category: "critical",
    route: "تجهیزات حیاتی و زیرساخت متصل",
  },
  {
    id: "clinic",
    label: "کلینیک",
    en: "CLINIC",
    icon: Building2,
    category: "imaging",
    route: "تجهیزات فشرده با بهره‌برداری سریع",
  },
  {
    id: "lab",
    label: "آزمایشگاه",
    en: "LABORATORY",
    icon: Microscope,
    category: "lab",
    route: "ظرفیت، مصرفی و اتصال LIS",
  },
  {
    id: "or",
    label: "اتاق عمل",
    en: "OPERATING ROOM",
    icon: Stethoscope,
    category: "surgery",
    route: "ایمنی، بیهوشی و هماهنگی زیرساخت",
  },
] as const;

const decisionPriorities = [
  {
    id: "performance",
    label: "عملکرد بالینی",
    detail: "دقت، قابلیت و workflow",
    risk: "تطبیق ناکافی با کاربرد واقعی",
  },
  {
    id: "lifecycle",
    label: "چرخه عمر",
    detail: "سرویس، قطعه و آموزش",
    risk: "هزینه و توقف خارج از برنامه",
  },
  {
    id: "timeline",
    label: "زمان اجرا",
    detail: "تأمین، نصب و تحویل",
    risk: "تأخیر زیرساخت یا مدارک",
  },
] as const;

const decisionStages = [
  {
    id: "explore",
    label: "بررسی اولیه",
    packet: "Shortlist و معیارهای غربال اولیه",
  },
  {
    id: "rfq",
    label: "استعلام فعال",
    packet: "پیشنهاد فنی، اسناد و محدوده خدمات",
  },
  {
    id: "replacement",
    label: "جایگزینی تجهیز",
    packet: "برنامه انتقال، آموزش و تداوم خدمت",
  },
] as const;

export function BuyerDecisionStudio() {
  const { home } = useSiteContent();
  const [environment, setEnvironment] = useState(0);
  const [priority, setPriority] = useState(0);
  const [stage, setStage] = useState(0);
  const selectedEnvironment = decisionEnvironments[environment];
  const selectedPriority = decisionPriorities[priority];
  const selectedStage = decisionStages[stage];
  const SelectedIcon = selectedEnvironment.icon;
  const productUrl = `/products?category=${selectedEnvironment.category}&intent=${selectedStage.id}&priority=${selectedPriority.id}`;
  const contactUrl = `/contact?environment=${selectedEnvironment.id}&stage=${selectedStage.id}&priority=${selectedPriority.id}`;

  return (
    <section className="decision-studio motion-section" id="decision-studio">
      <div className="decision-ambient" aria-hidden="true">
        <i />
        <i />
        <i />
      </div>
      <div className="site-wrap">
        <header className="decision-heading" data-reveal>
          <div>
            <span className="eyebrow">
              <Route size={15} /> {home.decisionStudio.eyebrow}
            </span>
            <h2>{home.decisionStudio.title}</h2>
          </div>
          <p>{home.decisionStudio.text}</p>
        </header>

        <div className="decision-console prism-edge" data-reveal>
          <div className="decision-controls">
            <fieldset>
              <legend>
                <span>01</span> محیط درمانی
              </legend>
              <div className="decision-options decision-options-icons">
                {decisionEnvironments.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <button
                      type="button"
                      className={environment === index ? "active" : ""}
                      aria-pressed={environment === index}
                      onClick={() => setEnvironment(index)}
                      key={item.id}
                    >
                      <Icon size={19} />
                      <span>{item.label}</span>
                      <small>{item.en}</small>
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <fieldset>
              <legend>
                <span>02</span> اولویت تصمیم
              </legend>
              <div className="decision-options">
                {decisionPriorities.map((item, index) => (
                  <button
                    type="button"
                    className={priority === index ? "active" : ""}
                    aria-pressed={priority === index}
                    onClick={() => setPriority(index)}
                    key={item.id}
                  >
                    <b>{item.label}</b>
                    <small>{item.detail}</small>
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend>
                <span>03</span> مرحله پروژه
              </legend>
              <div className="decision-options">
                {decisionStages.map((item, index) => (
                  <button
                    type="button"
                    className={stage === index ? "active" : ""}
                    aria-pressed={stage === index}
                    onClick={() => setStage(index)}
                    key={item.id}
                  >
                    <b>{item.label}</b>
                    <small>{item.packet}</small>
                  </button>
                ))}
              </div>
            </fieldset>
          </div>

          <aside className="decision-output" aria-live="polite">
            <div className="decision-output-orbit" aria-hidden="true">
              <i />
              <i />
              <span>
                <SelectedIcon size={34} />
              </span>
            </div>
            <span className="decision-status">
              <i /> مسیر تصمیم آماده است
            </span>
            <small>{selectedEnvironment.en} · CLINORO FLOW</small>
            <h3>{selectedEnvironment.route}</h3>
            <dl>
              <div>
                <dt>
                  <Target size={16} /> تمرکز اصلی
                </dt>
                <dd>{selectedPriority.label}</dd>
              </div>
              <div>
                <dt>
                  <ShieldCheck size={16} /> ریسک قابل کنترل
                </dt>
                <dd>{selectedPriority.risk}</dd>
              </div>
              <div>
                <dt>
                  <FileCheck2 size={16} /> بسته تصمیم
                </dt>
                <dd>{selectedStage.packet}</dd>
              </div>
            </dl>
            <div className="decision-output-actions">
              <Link className="button button-primary" href={productUrl}>
                دیدن مسیر پیشنهادی <ArrowLeft size={18} />
              </Link>
              <Link href={contactUrl}>شروع RFQ اختصاصی</Link>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

const trustStages = [
  {
    id: "definition",
    icon: Target,
    label: "تعریف نیاز",
    en: "REQUIREMENT",
    title: "معیار پذیرش قبل از انتخاب برند روشن می‌شود",
    text: "کاربرد، ظرفیت، زیرساخت، محدودیت‌ها و مسئولیت‌ها به زبان قابل‌اندازه‌گیری ثبت می‌شوند.",
    deliverables: ["Requirement brief", "Site constraints", "Acceptance criteria"],
  },
  {
    id: "proposal",
    icon: ClipboardCheck,
    label: "پیشنهاد فنی",
    en: "TECHNICAL OFFER",
    title: "هر ادعا باید به مدل، سند و تعهد مشخص متصل باشد",
    text: "پیشنهاد، دامنه تأمین، استثناها، خدمات و زمان‌بندی را کنار هم قرار می‌دهد تا مقایسه واقعی باشد.",
    deliverables: ["Model & configuration", "Document index", "Service scope"],
  },
  {
    id: "handover",
    icon: BadgeCheck,
    label: "تحویل و پذیرش",
    en: "HANDOVER",
    title: "تحویل زمانی کامل است که تجهیز قابل بهره‌برداری باشد",
    text: "کنترل تحویل، نصب، آزمون پذیرش، آموزش و مدارک در یک پرونده قابل پیگیری بسته می‌شوند.",
    deliverables: ["Acceptance record", "Training record", "Handover pack"],
  },
  {
    id: "lifecycle",
    icon: Wrench,
    label: "پشتیبانی چرخه عمر",
    en: "LIFECYCLE",
    title: "خدمت پس از فروش باید پیش از خرید قابل سنجش باشد",
    text: "زمان پاسخ، نگهداری، قطعه، آموزش تکمیلی و مسیر escalation از ابتدا به قرارداد متصل می‌شوند.",
    deliverables: ["Response matrix", "PM framework", "Escalation path"],
  },
] as const;

export function TrustProtocol() {
  const { home } = useSiteContent();
  const [active, setActive] = useState(0);
  const item = trustStages[active];
  const Icon = item.icon;
  return (
    <section className="trust-protocol motion-section">
      <div className="trust-protocol-grid" aria-hidden="true" />
      <div className="site-wrap trust-protocol-shell">
        <header data-reveal>
          <span className="eyebrow">
            <ShieldCheck size={15} /> {home.trustProtocol.eyebrow}
          </span>
          <h2>{home.trustProtocol.title}</h2>
          <p>{home.trustProtocol.text}</p>
        </header>

        <div className="trust-protocol-console prism-edge" data-reveal>
          <nav aria-label="مراحل پروتکل اعتماد">
            {trustStages.map((stage, index) => {
              const StageIcon = stage.icon;
              return (
                <button
                  type="button"
                  className={active === index ? "active" : ""}
                  aria-pressed={active === index}
                  onClick={() => setActive(index)}
                  key={stage.id}
                >
                  <span>
                    <StageIcon size={18} />
                  </span>
                  <b>{stage.label}</b>
                  <small>0{index + 1}</small>
                </button>
              );
            })}
          </nav>

          <article key={item.id} className="trust-protocol-detail">
            <div className="trust-protocol-mark">
              <span>
                <Icon size={31} />
              </span>
              <i />
            </div>
            <small>{item.en}</small>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
            <div>
              {item.deliverables.map((deliverable) => (
                <span key={deliverable}>
                  <FileCheck2 size={15} /> {deliverable}
                </span>
              ))}
            </div>
            <footer>
              <Link href="/credentials">
                مرکز اسناد و اعتماد <ArrowLeft size={17} />
              </Link>
              <Link href="/procurement">مشاهده فرآیند تأمین</Link>
            </footer>
          </article>

          <aside>
            <Gauge size={22} />
            <div>
              <b>۴ دروازه کنترل</b>
              <small>از نیاز تا چرخه عمر</small>
            </div>
            <i />
            <div>
              <b>مدرک‌محور</b>
              <small>بدون ادعای تأییدنشده</small>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
