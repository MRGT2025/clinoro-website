"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Activity,
  Boxes,
  Building2,
  CircleDot,
  FileCheck2,
  FlaskConical,
  HeartPulse,
  Hospital,
  MessageCircle,
  Microscope,
  Pause,
  Play,
  ScanLine,
  Sparkles,
  Stethoscope,
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
            ".glass-panel,.glass-nav,.service-lens,.product-card,.detail-card,.blog-card,.insight-card,.source-card,.related-card",
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
