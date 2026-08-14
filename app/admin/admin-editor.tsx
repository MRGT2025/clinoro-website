"use client";

import {
  useCallback,
  useEffect,
  useState,
  type CSSProperties,
} from "react";
import Image from "next/image";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpLeft,
  Blocks,
  BookOpenText,
  Check,
  ChevronDown,
  Code2,
  Copy,
  Download,
  Eye,
  FileJson,
  FileText,
  GripVertical,
  ImagePlus,
  LayoutDashboard,
  Inbox,
  Layers3,
  LoaderCircle,
  LogOut,
  Monitor,
  PackagePlus,
  Palette,
  PanelTop,
  PlayCircle,
  Redo2,
  RefreshCw,
  RotateCcw,
  Save,
  Settings2,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Smartphone,
  Tablet,
  Trash2,
  Undo2,
  Upload,
  UserPlus,
  Users,
  Video,
} from "lucide-react";
import type {
  BlogPost,
  ContentBlock,
  DesignSettings,
  HomeCategory,
  HomeTextCard,
  InjectionCode,
  PageIntro,
  PageKey,
  ProductItem,
  SavedDesignPreset,
  ServiceItem,
  SiteContent,
  SolutionItem,
  StepItem,
  TrustItem,
} from "../../lib/site-content";
import type { AdminMember } from "../../lib/admin-users";
import type { RfqStatus, RfqSubmission } from "../../lib/rfq";

const pageLabels: Record<keyof SiteContent["pages"], string> = {
  products: "محصولات",
  services: "خدمات",
  solutions: "راهکارها",
  procurement: "تأمین و RFQ",
  about: "درباره ما",
  contact: "تماس",
  blog: "بلاگ",
};
const builderPageLabels: Record<PageKey, string> = {
  home: "صفحه اصلی",
  products: "محصولات",
  services: "خدمات",
  solutions: "راهکارها",
  procurement: "تأمین و RFQ",
  about: "درباره ما",
  contact: "تماس",
  blog: "بلاگ",
};
const previewPaths: Record<PageKey, string> = {
  home: "/",
  products: "/products",
  services: "/services",
  solutions: "/solutions",
  procurement: "/procurement",
  about: "/about",
  contact: "/contact",
  blog: "/blog",
};
const blockTypeLabels: Record<ContentBlock["type"], string> = {
  text: "مطلب متنی",
  image: "تصویر و مطلب",
  video: "ویدئو و مطلب",
  cta: "دعوت به اقدام",
};
const tabs = [
  { id: "general", label: "تنظیمات و لوگو", icon: Settings2 },
  { id: "design", label: "طراحی سایت", icon: Palette },
  { id: "home", label: "صفحه اصلی", icon: LayoutDashboard },
  { id: "pages", label: "سربرگ صفحات", icon: ArrowUpLeft },
  { id: "products", label: "محصولات", icon: PackagePlus },
  { id: "content", label: "خدمات و راهکارها", icon: Check },
  { id: "blog", label: "بلاگ و مقالات", icon: BookOpenText },
  { id: "rfq", label: "صندوق RFQ", icon: Inbox },
  { id: "trust", label: "مدارک و اعتماد", icon: ShieldCheck },
  { id: "builder", label: "سازنده همه صفحات", icon: Blocks },
  { id: "code", label: "تزریق کد", icon: Code2, ownerOnly: true },
  { id: "advanced", label: "ویرایش پیشرفته", icon: FileJson },
  { id: "admins", label: "مدیران", icon: Users, ownerOnly: true },
] as const;
type TabId = (typeof tabs)[number]["id"];
type SaveState = "idle" | "saving" | "saved" | "error";

export function AdminEditor({
  initialContent,
  initialAdmins,
  currentAdmin,
  user,
  signOut,
}: {
  initialContent: SiteContent;
  initialAdmins: AdminMember[];
  currentAdmin: AdminMember;
  user: string;
  signOut: string;
}) {
  const [content, setContentState] = useState(initialContent);
  const [savedContent, setSavedContent] = useState(initialContent);
  const [dirty, setDirty] = useState(false);
  const [history, setHistory] = useState<SiteContent[]>([]);
  const [future, setFuture] = useState<SiteContent[]>([]);
  const [active, setActive] = useState<TabId>("general");
  const [state, setState] = useState<SaveState>("idle");
  const [builderPage, setBuilderPage] = useState<PageKey>("home");
  const [previewPage, setPreviewPage] = useState<PageKey>("home");
  const [previewDevice, setPreviewDevice] = useState<
    "desktop" | "tablet" | "mobile"
  >("desktop");
  const [previewMode, setPreviewMode] = useState<"draft" | "live">("draft");
  const [previewRevision, setPreviewRevision] = useState(0);
  const [admins, setAdmins] = useState(initialAdmins);
  const [adminForm, setAdminForm] = useState({ username: "", email: "" });
  const [adminMessage, setAdminMessage] = useState("");
  const [adminBusy, setAdminBusy] = useState(false);

  const setContent = (next: SiteContent) => {
    if (next === content) return;
    setHistory((current) => [...current.slice(-79), content]);
    setFuture([]);
    setContentState(next);
    setDirty(true);
    if (state === "saved") setState("idle");
  };

  const undo = useCallback(() => {
    setHistory((current) => {
      if (!current.length) return current;
      const previous = current[current.length - 1];
      setFuture((items) => [content, ...items].slice(0, 80));
      setContentState(previous);
      setDirty(JSON.stringify(previous) !== JSON.stringify(savedContent));
      setState("idle");
      return current.slice(0, -1);
    });
  }, [content, savedContent]);

  const redo = useCallback(() => {
    setFuture((current) => {
      if (!current.length) return current;
      const next = current[0];
      setHistory((items) => [...items.slice(-79), content]);
      setContentState(next);
      setDirty(JSON.stringify(next) !== JSON.stringify(savedContent));
      setState("idle");
      return current.slice(1);
    });
  }, [content, savedContent]);

  const chooseTab = (id: TabId) => {
    setActive(id);
    const map: Partial<Record<TabId, PageKey>> = {
      home: "home",
      products: "products",
      blog: "blog",
    };
    if (map[id]) setPreviewPage(map[id]!);
  };
  const save = useCallback(async () => {
    setState("saving");
    try {
      const response = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });
      if (!response.ok) throw new Error();
      setSavedContent(content);
      setDirty(false);
      setPreviewRevision((value) => value + 1);
      setState("saved");
      window.setTimeout(() => setState("idle"), 2200);
    } catch {
      setState("error");
    }
  }, [content]);
  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "s") {
        event.preventDefault();
        void save();
        return;
      }
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "z") {
        event.preventDefault();
        if (event.shiftKey) redo();
        else undo();
        return;
      }
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "y") {
        event.preventDefault();
        redo();
      }
    };
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, [redo, save, undo]);
  const upload = async (
    file: File,
    onDone: (url: string, contentType: string) => void,
  ) => {
    setState("saving");
    const data = new FormData();
    data.append("file", file);
    const response = await fetch("/api/admin/upload", {
      method: "POST",
      body: data,
    });
    if (!response.ok) {
      setState("error");
      return;
    }
    const result = (await response.json()) as {
      url: string;
      contentType: string;
    };
    onDone(result.url, result.contentType || file.type);
    setState("idle");
  };
  const addAdmin = async () => {
    setAdminBusy(true);
    setAdminMessage("");
    try {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(adminForm),
      });
      const result = (await response.json()) as {
        member?: AdminMember;
        error?: string;
      };
      if (!response.ok || !result.member)
        throw new Error(result.error || "خطا در افزودن مدیر");
      setAdmins((previous) => [
        ...previous.filter((item) => item.email !== result.member?.email),
        result.member!,
      ]);
      setAdminForm({ username: "", email: "" });
      setAdminMessage(
        "مدیر جدید فعال شد؛ حالا می‌تواند با ChatGPT و همین ایمیل وارد شود.",
      );
    } catch (error) {
      setAdminMessage(
        error instanceof Error ? error.message : "خطا در افزودن مدیر",
      );
    } finally {
      setAdminBusy(false);
    }
  };
  const deleteAdmin = async (email: string) => {
    setAdminBusy(true);
    setAdminMessage("");
    try {
      const response = await fetch("/api/admin/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error || "خطا در حذف مدیر");
      setAdmins((previous) => previous.filter((item) => item.email !== email));
      setAdminMessage("دسترسی مدیر حذف شد.");
    } catch (error) {
      setAdminMessage(
        error instanceof Error ? error.message : "خطا در حذف مدیر",
      );
    } finally {
      setAdminBusy(false);
    }
  };

  return (
    <main className="admin-app admin-app-v3" dir="rtl">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <Image
            src="/assets/clinoro-mark-primary.png"
            alt="Clinoro"
            width={48}
            height={48}
            unoptimized
          />
          <div>
            <b>CLINORO</b>
            <small>CONTENT STUDIO V4</small>
          </div>
        </div>
        <nav>
          {tabs
            .filter(
              (tab) =>
                !(
                  "ownerOnly" in tab &&
                  tab.ownerOnly &&
                  currentAdmin.role !== "owner"
                ),
            )
            .map(({ id, label, icon: Icon }) => (
              <button
                className={active === id ? "active" : ""}
                onClick={() => chooseTab(id)}
                key={id}
              >
                <Icon size={18} />
                {label}
              </button>
            ))}
        </nav>
        <div className="admin-user">
          <span>{currentAdmin.username.slice(0, 1).toUpperCase()}</span>
          <div>
            <b>{currentAdmin.username || user}</b>
            <small>
              {currentAdmin.role === "owner" ? "مدیر اصلی" : "مدیر محتوا"}
            </small>
          </div>
        </div>
        <a className="admin-signout" href={signOut}>
          <LogOut size={17} /> خروج امن
        </a>
      </aside>
      <section className="admin-workspace">
        <header className="admin-top">
          <div>
            <small>CLINORO CMS / DESIGN STUDIO</small>
            <h1>
              {tabs.find((tab) => tab.id === active)?.label}
              <span className={dirty ? "admin-dirty active" : "admin-dirty"}>
                {dirty ? "تغییر ذخیره‌نشده" : "همگام"}
              </span>
            </h1>
          </div>
          <div>
            <a
              href={previewPaths[previewPage]}
              target="_blank"
              rel="noreferrer"
            >
              نمایش سایت <ArrowUpLeft size={16} />
            </a>
            {active !== "admins" && active !== "rfq" && (
              <>
                <div className="admin-history-controls" aria-label="تاریخچه ویرایش">
                  <button
                    type="button"
                    onClick={undo}
                    disabled={!history.length}
                    title="Undo · Ctrl/⌘ + Z"
                    aria-label="برگشت یک تغییر"
                  >
                    <Undo2 size={16} />
                    <span>برگشت</span>
                  </button>
                  <button
                    type="button"
                    onClick={redo}
                    disabled={!future.length}
                    title="Redo · Ctrl/⌘ + Shift + Z"
                    aria-label="انجام دوباره تغییر"
                  >
                    <Redo2 size={16} />
                    <span>دوباره</span>
                  </button>
                  <small>
                    {history.length.toLocaleString("fa-IR")} مرحله
                  </small>
                </div>
                {dirty && (
                  <button
                    type="button"
                    className="admin-reset"
                    onClick={() => {
                      setHistory((current) => [
                        ...current.slice(-79),
                        content,
                      ]);
                      setFuture([]);
                      setContentState(savedContent);
                      setDirty(false);
                      setState("idle");
                    }}
                  >
                    <RotateCcw size={16} /> بازگشت
                  </button>
                )}
                <button
                  type="button"
                  className={`admin-save ${state}`}
                  onClick={() => void save()}
                  disabled={state === "saving"}
                  title="ذخیره با Ctrl/⌘ + S"
                >
                  {state === "saving" ? (
                    <LoaderCircle className="spin" size={18} />
                  ) : state === "saved" ? (
                    <Check size={18} />
                  ) : (
                    <Save size={18} />
                  )}{" "}
                  {state === "saving"
                    ? "در حال ذخیره"
                    : state === "saved"
                      ? "ذخیره شد"
                      : state === "error"
                        ? "خطا؛ دوباره تلاش کنید"
                        : "ذخیره تغییرات"}
                </button>
              </>
            )}
          </div>
        </header>
        <div className="admin-content">
          {active === "general" && (
            <>
              <AdminSnapshot
                content={content}
                admins={admins.length}
                onOpen={chooseTab}
              />
              <Panel
                title="هویت، لوگو و اطلاعات تماس"
                text="هویت نهایی Clinoro با نشانه پالس پزشکی و درگاه تجارت فعال است؛ در صورت نیاز می‌توانید فایل دیگری بارگذاری کنید."
              >
                <Grid>
                  <MediaField
                    wide
                    kind="image"
                    label="لوگوی کامل سایت"
                    value={content.general.logoUrl}
                    onUpload={(file) =>
                      upload(file, (url) =>
                        setContent({
                          ...content,
                          general: { ...content.general, logoUrl: url },
                        }),
                      )
                    }
                  />
                  <Field
                    label="متن جایگزین لوگو"
                    value={content.general.logoAlt}
                    onChange={(value) =>
                      setContent({
                        ...content,
                        general: { ...content.general, logoAlt: value },
                      })
                    }
                  />
                  <Field
                    label="نام برند"
                    value={content.general.brand}
                    onChange={(value) =>
                      setContent({
                        ...content,
                        general: { ...content.general, brand: value },
                      })
                    }
                  />
                  <Field
                    label="زیرعنوان برند"
                    value={content.general.tagline}
                    onChange={(value) =>
                      setContent({
                        ...content,
                        general: { ...content.general, tagline: value },
                      })
                    }
                  />
                  <SelectField
                    label="میزان حرکت و موشن"
                    value={content.general.motionMode}
                    onChange={(value) =>
                      setContent({
                        ...content,
                        general: {
                          ...content.general,
                          motionMode:
                            value as SiteContent["general"]["motionMode"],
                        },
                      })
                    }
                    options={[
                      ["full", "پویا و کامل"],
                      ["subtle", "ملایم و حرفه‌ای"],
                      ["reduced", "حداقل حرکت"],
                    ]}
                  />
                  <Field
                    label="شماره تماس"
                    value={content.general.phone}
                    onChange={(value) =>
                      setContent({
                        ...content,
                        general: { ...content.general, phone: value },
                      })
                    }
                  />
                  <Field
                    label="ایمیل"
                    value={content.general.email}
                    onChange={(value) =>
                      setContent({
                        ...content,
                        general: { ...content.general, email: value },
                      })
                    }
                  />
                  <Field
                    wide
                    label="آدرس"
                    value={content.general.address}
                    onChange={(value) =>
                      setContent({
                        ...content,
                        general: { ...content.general, address: value },
                      })
                    }
                  />
                  <TextArea
                    wide
                    label="متن معرفی فوتر"
                    value={content.general.footerText}
                    onChange={(value) =>
                      setContent({
                        ...content,
                        general: { ...content.general, footerText: value },
                      })
                    }
                  />
                  <Field
                    wide
                    label="عنوان مرورگر و گوگل"
                    value={content.general.metaTitle}
                    onChange={(value) =>
                      setContent({
                        ...content,
                        general: { ...content.general, metaTitle: value },
                      })
                    }
                  />
                  <TextArea
                    wide
                    label="توضیحات گوگل"
                    value={content.general.metaDescription}
                    onChange={(value) =>
                      setContent({
                        ...content,
                        general: { ...content.general, metaDescription: value },
                      })
                    }
                  />
                </Grid>
              </Panel>
            </>
          )}
          {active === "design" && (
            <DesignStudio
              design={content.design}
              onChange={(design) => setContent({ ...content, design })}
              savedPresets={content.designLibrary}
              onSavePreset={(name) =>
                setContent({
                  ...content,
                  designLibrary: [
                    ...content.designLibrary,
                    {
                      id: crypto.randomUUID(),
                      name,
                      createdAt: new Date().toISOString(),
                      settings: content.design,
                    },
                  ].slice(-12),
                })
              }
              onApplyPreset={(design) => setContent({ ...content, design })}
              onDeletePreset={(id) =>
                setContent({
                  ...content,
                  designLibrary: content.designLibrary.filter(
                    (preset) => preset.id !== id,
                  ),
                })
              }
            />
          )}
          {active === "home" && (
            <>
              <Panel
                title="Hero صفحه اصلی"
                text="تمام تغییرات همین لحظه در پیش‌نمایش کنار صفحه دیده می‌شوند."
              >
                <Grid>
                  <Field
                    wide
                    label="عبارت بالای تیتر"
                    value={content.home.kicker}
                    onChange={(value) =>
                      setContent({
                        ...content,
                        home: { ...content.home, kicker: value },
                      })
                    }
                  />
                  <Field
                    label="تیتر اصلی"
                    value={content.home.title}
                    onChange={(value) =>
                      setContent({
                        ...content,
                        home: { ...content.home, title: value },
                      })
                    }
                  />
                  {content.home.signals.map((signal, index) => (
                    <Field
                      key={index}
                      label={`پیام متحرک ${index + 1}`}
                      value={signal}
                      onChange={(value) => {
                        const signals = [...content.home.signals];
                        signals[index] = value;
                        setContent({
                          ...content,
                          home: { ...content.home, signals },
                        });
                      }}
                    />
                  ))}
                  <TextArea
                    wide
                    label="توضیح Hero"
                    value={content.home.intro}
                    onChange={(value) =>
                      setContent({
                        ...content,
                        home: { ...content.home, intro: value },
                      })
                    }
                  />
                  <MediaField
                    wide
                    kind="image"
                    label="تصویر Hero"
                    value={content.home.heroImage}
                    onUpload={(file) =>
                      upload(file, (url) =>
                        setContent({
                          ...content,
                          home: { ...content.home, heroImage: url },
                        }),
                      )
                    }
                  />
                </Grid>
              </Panel>
              <Panel
                title="Decision Studio و پروتکل اعتماد"
                text="عنوان‌ها و توضیحات دو بخش شاخص تجربه خریدار را بدون تغییر کد مدیریت کنید. منطق تعاملی و کنترل‌های فنی خودکار باقی می‌مانند."
              >
                <Grid>
                  <Field
                    wide
                    label="عبارت بالای Decision Studio"
                    value={content.home.decisionStudio.eyebrow}
                    onChange={(eyebrow) =>
                      setContent({
                        ...content,
                        home: {
                          ...content.home,
                          decisionStudio: {
                            ...content.home.decisionStudio,
                            eyebrow,
                          },
                        },
                      })
                    }
                  />
                  <Field
                    wide
                    label="عنوان Decision Studio"
                    value={content.home.decisionStudio.title}
                    onChange={(title) =>
                      setContent({
                        ...content,
                        home: {
                          ...content.home,
                          decisionStudio: {
                            ...content.home.decisionStudio,
                            title,
                          },
                        },
                      })
                    }
                  />
                  <TextArea
                    wide
                    label="توضیح Decision Studio"
                    value={content.home.decisionStudio.text}
                    onChange={(text) =>
                      setContent({
                        ...content,
                        home: {
                          ...content.home,
                          decisionStudio: {
                            ...content.home.decisionStudio,
                            text,
                          },
                        },
                      })
                    }
                  />
                  <Field
                    wide
                    label="عبارت بالای پروتکل اعتماد"
                    value={content.home.trustProtocol.eyebrow}
                    onChange={(eyebrow) =>
                      setContent({
                        ...content,
                        home: {
                          ...content.home,
                          trustProtocol: {
                            ...content.home.trustProtocol,
                            eyebrow,
                          },
                        },
                      })
                    }
                  />
                  <Field
                    wide
                    label="عنوان پروتکل اعتماد"
                    value={content.home.trustProtocol.title}
                    onChange={(title) =>
                      setContent({
                        ...content,
                        home: {
                          ...content.home,
                          trustProtocol: {
                            ...content.home.trustProtocol,
                            title,
                          },
                        },
                      })
                    }
                  />
                  <TextArea
                    wide
                    label="توضیح پروتکل اعتماد"
                    value={content.home.trustProtocol.text}
                    onChange={(text) =>
                      setContent({
                        ...content,
                        home: {
                          ...content.home,
                          trustProtocol: {
                            ...content.home.trustProtocol,
                            text,
                          },
                        },
                      })
                    }
                  />
                </Grid>
              </Panel>
              <Panel title="بخش داستان Clinoro">
                <Grid>
                  <Field
                    wide
                    label="عنوان"
                    value={content.home.storyTitle}
                    onChange={(value) =>
                      setContent({
                        ...content,
                        home: { ...content.home, storyTitle: value },
                      })
                    }
                  />
                  <TextArea
                    wide
                    label="متن"
                    value={content.home.storyText}
                    onChange={(value) =>
                      setContent({
                        ...content,
                        home: { ...content.home, storyText: value },
                      })
                    }
                  />
                  <MediaField
                    wide
                    kind="image"
                    label="تصویر"
                    value={content.home.storyImage}
                    onUpload={(file) =>
                      upload(file, (url) =>
                        setContent({
                          ...content,
                          home: { ...content.home, storyImage: url },
                        }),
                      )
                    }
                  />
                </Grid>
              </Panel>
              <HomeTextCollection
                title="نوار اعتماد و آمار"
                items={content.home.proofPoints}
                onChange={(proofPoints) =>
                  setContent({
                    ...content,
                    home: { ...content.home, proofPoints },
                  })
                }
              />
              <HomeCategoryCollection
                items={content.home.categories}
                onChange={(categories) =>
                  setContent({
                    ...content,
                    home: { ...content.home, categories },
                  })
                }
                upload={upload}
              />
              <HomeTextCollection
                title="کارت‌های خدمات صفحه اصلی"
                items={content.home.serviceCards}
                onChange={(serviceCards) =>
                  setContent({
                    ...content,
                    home: { ...content.home, serviceCards },
                  })
                }
              />
              <HomeTextCollection
                title="مراحل مسیر پروژه"
                items={content.home.process}
                onChange={(process) =>
                  setContent({ ...content, home: { ...content.home, process } })
                }
              />
              <Panel title="دعوت به اقدام انتهای صفحه">
                <Grid>
                  <Field
                    wide
                    label="عنوان"
                    value={content.home.finalCta.title}
                    onChange={(title) =>
                      setContent({
                        ...content,
                        home: {
                          ...content.home,
                          finalCta: { ...content.home.finalCta, title },
                        },
                      })
                    }
                  />
                  <TextArea
                    wide
                    label="توضیح"
                    value={content.home.finalCta.text}
                    onChange={(text) =>
                      setContent({
                        ...content,
                        home: {
                          ...content.home,
                          finalCta: { ...content.home.finalCta, text },
                        },
                      })
                    }
                  />
                </Grid>
              </Panel>
            </>
          )}
          {active === "pages" &&
            Object.entries(content.pages).map(([key, page]) => (
              <PageEditor
                key={key}
                label={pageLabels[key as keyof SiteContent["pages"]]}
                page={page}
                onFocus={() => setPreviewPage(key as PageKey)}
                onChange={(next) =>
                  setContent({
                    ...content,
                    pages: { ...content.pages, [key]: next },
                  })
                }
                onUpload={(file) =>
                  upload(file, (url) =>
                    setContent({
                      ...content,
                      pages: {
                        ...content.pages,
                        [key]: { ...page, image: url },
                      },
                    }),
                  )
                }
              />
            ))}
          {active === "products" && (
            <CollectionPanel
              title="کاتالوگ و صفحات اختصاصی محصولات"
              count={content.products.length}
              onAdd={() =>
                setContent({
                  ...content,
                  products: [
                    ...content.products,
                    {
                      slug: `new-product-${Date.now()}`,
                      cat: "critical",
                      image: "/assets/patient-monitor.jpg",
                      gallery: [],
                      fa: "محصول جدید",
                      en: "New Product",
                      tag: "Medical Equipment",
                      summary: "معرفی کوتاه محصول",
                      brand: "چندبرندی",
                      model: "انتخاب متناسب با پروژه",
                      availability: "پس از بررسی موجودی",
                      intendedUse: "کاربرد محصول را بنویسید",
                      specs: ["ویژگی اول"],
                      technicalSpecs: [{ label: "مشخصه", value: "مقدار" }],
                      services: ["مشاوره و انتخاب"],
                      documents: [],
                      imageCredit: "",
                      imageSource: "",
                      imageLicense: "",
                      featured: false,
                    },
                  ],
                })
              }
            >
              {content.products.map((item, index) => (
                <ProductEditor
                  key={`${item.slug}-${index}`}
                  item={item}
                  index={index}
                  onChange={(next) => {
                    const items = [...content.products];
                    items[index] = next;
                    setContent({ ...content, products: items });
                  }}
                  onRemove={() =>
                    setContent({
                      ...content,
                      products: content.products.filter((_, i) => i !== index),
                    })
                  }
                  onUpload={(file) =>
                    upload(file, (url) => {
                      const items = [...content.products];
                      items[index] = { ...item, image: url };
                      setContent({ ...content, products: items });
                    })
                  }
                  onDocumentUpload={(file) =>
                    upload(file, (url) => {
                      const items = [...content.products];
                      items[index] = {
                        ...item,
                        documents: [
                          ...item.documents,
                          {
                            title: file.name.replace(/\.pdf$/i, ""),
                            type: "PDF",
                            url,
                          },
                        ],
                      };
                      setContent({ ...content, products: items });
                    })
                  }
                />
              ))}
            </CollectionPanel>
          )}
          {active === "content" && (
            <>
              <CollectionPanel
                title="خدمات"
                count={content.services.length}
                onAdd={() =>
                  setContent({
                    ...content,
                    services: [
                      ...content.services,
                      {
                        en: "SERVICE",
                        title: "خدمت جدید",
                        text: "توضیحات خدمت",
                        list: ["مورد اول"],
                      },
                    ],
                  })
                }
              >
                {content.services.map((item, index) => (
                  <ServiceEditor
                    key={index}
                    item={item}
                    index={index}
                    onChange={(next) => {
                      const items = [...content.services];
                      items[index] = next;
                      setContent({ ...content, services: items });
                    }}
                    onRemove={() =>
                      setContent({
                        ...content,
                        services: content.services.filter(
                          (_, i) => i !== index,
                        ),
                      })
                    }
                  />
                ))}
              </CollectionPanel>
              <CollectionPanel
                title="راهکارها"
                count={content.solutions.length}
                onAdd={() =>
                  setContent({
                    ...content,
                    solutions: [
                      ...content.solutions,
                      {
                        title: "راهکار جدید",
                        en: "NEW SOLUTION",
                        image: "/assets/medical-visual.jpg",
                        text: "توضیحات راهکار",
                      },
                    ],
                  })
                }
              >
                {content.solutions.map((item, index) => (
                  <SolutionEditor
                    key={index}
                    item={item}
                    index={index}
                    onChange={(next) => {
                      const items = [...content.solutions];
                      items[index] = next;
                      setContent({ ...content, solutions: items });
                    }}
                    onRemove={() =>
                      setContent({
                        ...content,
                        solutions: content.solutions.filter(
                          (_, i) => i !== index,
                        ),
                      })
                    }
                    onUpload={(file) =>
                      upload(file, (url) => {
                        const items = [...content.solutions];
                        items[index] = { ...item, image: url };
                        setContent({ ...content, solutions: items });
                      })
                    }
                  />
                ))}
              </CollectionPanel>
              <CollectionPanel
                title="مراحل تأمین"
                count={content.procurementSteps.length}
                onAdd={() =>
                  setContent({
                    ...content,
                    procurementSteps: [
                      ...content.procurementSteps,
                      { title: "مرحله جدید", text: "توضیحات مرحله" },
                    ],
                  })
                }
              >
                {content.procurementSteps.map((item, index) => (
                  <StepEditor
                    key={index}
                    item={item}
                    index={index}
                    onChange={(next) => {
                      const items = [...content.procurementSteps];
                      items[index] = next;
                      setContent({ ...content, procurementSteps: items });
                    }}
                    onRemove={() =>
                      setContent({
                        ...content,
                        procurementSteps: content.procurementSteps.filter(
                          (_, i) => i !== index,
                        ),
                      })
                    }
                  />
                ))}
              </CollectionPanel>
              <Panel title="متن درباره ما">
                <Grid>
                  <Field
                    wide
                    label="عنوان"
                    value={content.about.headline}
                    onChange={(value) =>
                      setContent({
                        ...content,
                        about: { ...content.about, headline: value },
                      })
                    }
                  />
                  {content.about.paragraphs.map((paragraph, index) => (
                    <TextArea
                      wide
                      key={index}
                      label={`پاراگراف ${index + 1}`}
                      value={paragraph}
                      onChange={(value) => {
                        const paragraphs = [...content.about.paragraphs];
                        paragraphs[index] = value;
                        setContent({
                          ...content,
                          about: { ...content.about, paragraphs },
                        });
                      }}
                    />
                  ))}
                  <MediaField
                    wide
                    kind="image"
                    label="تصویر درباره ما"
                    value={content.about.image}
                    onUpload={(file) =>
                      upload(file, (url) =>
                        setContent({
                          ...content,
                          about: { ...content.about, image: url },
                        }),
                      )
                    }
                  />
                </Grid>
              </Panel>
              <HomeTextCollection
                title="ارزش‌های صفحه درباره ما"
                items={content.about.values}
                onChange={(values) =>
                  setContent({
                    ...content,
                    about: { ...content.about, values },
                  })
                }
              />
            </>
          )}
          {active === "blog" && (
            <BlogManager
              content={content}
              setContent={setContent}
              upload={upload}
            />
          )}
          {active === "rfq" && <RfqInbox />}
          {active === "trust" && (
            <TrustManager
              content={content}
              setContent={setContent}
              upload={upload}
              canVerify={currentAdmin.role === "owner"}
            />
          )}
          {active === "builder" && (
            <BlockBuilder
              page={builderPage}
              setPage={(page) => {
                setBuilderPage(page);
                setPreviewPage(page);
              }}
              content={content}
              setContent={setContent}
              upload={upload}
            />
          )}
          {active === "code" && currentAdmin.role === "owner" && (
            <CodeInjectionEditor content={content} setContent={setContent} />
          )}
          {active === "advanced" && (
            <AdvancedEditor content={content} setContent={setContent} />
          )}
          {active === "admins" && currentAdmin.role === "owner" && (
            <AdminManager
              admins={admins}
              currentAdmin={currentAdmin}
              form={adminForm}
              setForm={setAdminForm}
              busy={adminBusy}
              message={adminMessage}
              add={addAdmin}
              remove={deleteAdmin}
            />
          )}
        </div>
      </section>
      <LivePreview
        content={content}
        page={previewPage}
        setPage={setPreviewPage}
        device={previewDevice}
        setDevice={setPreviewDevice}
        mode={previewMode}
        setMode={setPreviewMode}
        revision={previewRevision}
      />
    </main>
  );
}

function Panel({
  title,
  text,
  children,
}: {
  title: string;
  text?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="admin-panel">
      <header>
        <h2>{title}</h2>
        {text && <p>{text}</p>}
      </header>
      {children}
    </section>
  );
}
function Grid({ children }: { children: React.ReactNode }) {
  return <div className="admin-grid">{children}</div>;
}
function Field({
  label,
  value,
  onChange,
  wide = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  wide?: boolean;
}) {
  return (
    <label className={wide ? "wide" : ""}>
      <span>{label}</span>
      <input value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}
function TextArea({
  label,
  value,
  onChange,
  wide = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  wide?: boolean;
}) {
  return (
    <label className={wide ? "wide" : ""}>
      <span>{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}
function CodeField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <label className="wide admin-code-field">
      <span>{label}</span>
      <textarea
        dir="ltr"
        spellCheck={false}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
      />
    </label>
  );
}
function SelectField({
  label,
  value,
  onChange,
  options,
  wide = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<[string, string]>;
  wide?: boolean;
}) {
  return (
    <label className={wide ? "wide" : ""}>
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map(([optionValue, label]) => (
          <option value={optionValue} key={optionValue}>
            {label}
          </option>
        ))}
      </select>
    </label>
  );
}
function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="admin-color-field">
      <span>{label}</span>
      <div>
        <input
          type="color"
          value={/^#[0-9a-f]{6}$/i.test(value) ? value : "#3978ff"}
          onChange={(event) => onChange(event.target.value)}
        />
        <input
          dir="ltr"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-label={`کد رنگ ${label}`}
        />
      </div>
    </label>
  );
}
function RangeField({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  suffix = "",
  wide = false,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  suffix?: string;
  wide?: boolean;
}) {
  return (
    <label className={`admin-range-field${wide ? " wide" : ""}`}>
      <span>
        {label}
        <output>
          {value.toLocaleString("fa-IR", { maximumFractionDigits: 2 })}
          {suffix}
        </output>
      </span>
      <input
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}

const designPresets: Array<{
  id: DesignSettings["preset"];
  title: string;
  subtitle: string;
  colors: DesignSettings["colors"];
  headerStyle: DesignSettings["headerStyle"];
  cardStyle: DesignSettings["cardStyle"];
  density: DesignSettings["density"];
  backgroundStyle: DesignSettings["backgroundStyle"];
  buttonStyle: DesignSettings["buttonStyle"];
  glassBlur: number;
  shadowDepth: number;
  motionIntensity: number;
}> = [
  {
    id: "prism",
    title: "Clinoro Prism",
    subtitle: "هویت فعلی؛ شیشه، نور پزشکی و آبی الکتریک",
    colors: {
      ink: "#071a31",
      ink2: "#0c2848",
      cobalt: "#2b65d9",
      blue: "#3978ff",
      teal: "#22b8b0",
      cyan: "#47d7ee",
      silver: "#d8dee9",
      surface: "#f4f8f8",
      muted: "#60758a",
    },
    headerStyle: "glass",
    cardStyle: "elevated",
    density: "balanced",
    backgroundStyle: "aurora",
    buttonStyle: "rounded",
    glassBlur: 22,
    shadowDepth: 1.08,
    motionIntensity: 1,
  },
  {
    id: "midnight",
    title: "Midnight Clinical",
    subtitle: "تیره، سینمایی و مناسب برند فناوری پیشرفته",
    colors: {
      ink: "#040f1f",
      ink2: "#092b4b",
      cobalt: "#356dff",
      blue: "#4b83ff",
      teal: "#19bbb0",
      cyan: "#6be8f2",
      silver: "#cfd8e8",
      surface: "#eaf3f5",
      muted: "#5d7486",
    },
    headerStyle: "solid",
    cardStyle: "elevated",
    density: "spacious",
    backgroundStyle: "aurora",
    buttonStyle: "pill",
    glassBlur: 30,
    shadowDepth: 1.35,
    motionIntensity: 1.2,
  },
  {
    id: "sterile",
    title: "Sterile Editorial",
    subtitle: "روشن، مینیمال و متمرکز بر محصول و اسناد",
    colors: {
      ink: "#0a2335",
      ink2: "#153c50",
      cobalt: "#245fd3",
      blue: "#2f71ed",
      teal: "#158f8a",
      cyan: "#39bfd2",
      silver: "#dfe5ea",
      surface: "#f8fbfb",
      muted: "#647985",
    },
    headerStyle: "minimal",
    cardStyle: "outline",
    density: "compact",
    backgroundStyle: "clean",
    buttonStyle: "compact",
    glassBlur: 12,
    shadowDepth: 0.7,
    motionIntensity: 0.65,
  },
];

function DesignStudio({
  design,
  onChange,
  savedPresets,
  onSavePreset,
  onApplyPreset,
  onDeletePreset,
}: {
  design: DesignSettings;
  onChange: (design: DesignSettings) => void;
  savedPresets: SavedDesignPreset[];
  onSavePreset: (name: string) => void;
  onApplyPreset: (design: DesignSettings) => void;
  onDeletePreset: (id: string) => void;
}) {
  const [presetName, setPresetName] = useState("");
  const patch = (next: Partial<DesignSettings>) =>
    onChange({ ...design, ...next });
  const color = (key: keyof DesignSettings["colors"], value: string) =>
    patch({ colors: { ...design.colors, [key]: value } });

  return (
    <>
      <Panel
        title="سیستم طراحی سراسری"
        text="یک‌بار تنظیم کنید تا رنگ، تایپوگرافی، فاصله، گردی، گرید و سبک اجزا در تمام صفحات هماهنگ شوند. پیش‌نمایش سمت چپ قبل از ذخیره، نسخه فعلی را نشان می‌دهد."
      >
        <div className="design-preset-grid">
          {designPresets.map((preset) => (
            <button
              type="button"
              className={design.preset === preset.id ? "active" : ""}
              key={preset.id}
              onClick={() =>
                onChange({
                  ...design,
                  preset: preset.id,
                  colors: preset.colors,
                  headerStyle: preset.headerStyle,
                  cardStyle: preset.cardStyle,
                  density: preset.density,
                  backgroundStyle: preset.backgroundStyle,
                  buttonStyle: preset.buttonStyle,
                  glassBlur: preset.glassBlur,
                  shadowDepth: preset.shadowDepth,
                  motionIntensity: preset.motionIntensity,
                })
              }
            >
              <span
                style={{
                  background: `linear-gradient(135deg,${preset.colors.ink},${preset.colors.blue},${preset.colors.cyan})`,
                }}
              >
                <Sparkles size={21} />
              </span>
              <b>{preset.title}</b>
              <small>{preset.subtitle}</small>
              <i>{design.preset === preset.id ? "فعال" : "اعمال تم"}</i>
            </button>
          ))}
        </div>
        <div className="design-library">
          <header>
            <div>
              <b>کتابخانه تم‌های خودتان</b>
              <small>
                ترکیب فعلی رنگ، فونت، گرید، موشن و سبک اجزا را برای استفاده بعدی ذخیره کنید.
              </small>
            </div>
            <label>
              <input
                value={presetName}
                onChange={(event) => setPresetName(event.target.value)}
                placeholder="نام تم؛ مثلاً کمپین ICU"
              />
              <button
                type="button"
                disabled={!presetName.trim()}
                onClick={() => {
                  onSavePreset(presetName.trim());
                  setPresetName("");
                }}
              >
                <Save size={15} /> ذخیره تم فعلی
              </button>
            </label>
          </header>
          {savedPresets.length > 0 && (
            <div>
              {savedPresets.map((preset) => (
                <article key={preset.id}>
                  <span
                    style={{
                      background: `linear-gradient(135deg,${preset.settings.colors.ink},${preset.settings.colors.blue},${preset.settings.colors.cyan})`,
                    }}
                  />
                  <div>
                    <b>{preset.name}</b>
                    <small>
                      {new Date(preset.createdAt).toLocaleDateString("fa-IR")} ·{" "}
                      {preset.settings.faFont} / {preset.settings.cardStyle}
                    </small>
                  </div>
                  <button
                    type="button"
                    onClick={() => onApplyPreset(preset.settings)}
                  >
                    اعمال
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeletePreset(preset.id)}
                    aria-label={`حذف تم ${preset.name}`}
                  >
                    <Trash2 size={15} />
                  </button>
                </article>
              ))}
            </div>
          )}
        </div>
      </Panel>

      <Panel
        title="پالت هویت برند"
        text="رنگ‌ها به‌صورت توکن ذخیره می‌شوند؛ بنابراین تغییر یک رنگ، تمام اجزای وابسته را هماهنگ می‌کند."
      >
        <div className="design-tool-heading">
          <Palette size={20} />
          <span>رنگ‌های پایه و تعاملی</span>
        </div>
        <Grid>
          <ColorField
            label="سرمه‌ای اصلی"
            value={design.colors.ink}
            onChange={(value) => color("ink", value)}
          />
          <ColorField
            label="سرمه‌ای ثانویه"
            value={design.colors.ink2}
            onChange={(value) => color("ink2", value)}
          />
          <ColorField
            label="کبالت برند"
            value={design.colors.cobalt}
            onChange={(value) => color("cobalt", value)}
          />
          <ColorField
            label="آبی الکتریک"
            value={design.colors.blue}
            onChange={(value) => color("blue", value)}
          />
          <ColorField
            label="سبز پزشکی"
            value={design.colors.teal}
            onChange={(value) => color("teal", value)}
          />
          <ColorField
            label="فیروزه‌ای نور"
            value={design.colors.cyan}
            onChange={(value) => color("cyan", value)}
          />
          <ColorField
            label="نقره‌ای برند"
            value={design.colors.silver}
            onChange={(value) => color("silver", value)}
          />
          <ColorField
            label="سطح روشن"
            value={design.colors.surface}
            onChange={(value) => color("surface", value)}
          />
          <ColorField
            label="متن ثانویه"
            value={design.colors.muted}
            onChange={(value) => color("muted", value)}
          />
        </Grid>
      </Panel>

      <Panel
        title="تایپوگرافی و سبک اجزا"
        text="فونت فارسی و لاتین مستقل‌اند؛ سبک هدر و کارت‌ها بدون دست‌کاری کد قابل تغییر است."
      >
        <div className="design-tool-heading">
          <PanelTop size={20} />
          <span>فونت، هدر، کارت و تراکم رابط</span>
        </div>
        <Grid>
          <SelectField
            label="فونت فارسی"
            value={design.faFont}
            onChange={(value) =>
              patch({ faFont: value as DesignSettings["faFont"] })
            }
            options={[
              ["vazirmatn", "وزیرمتن"],
              ["estedad", "استعداد"],
              ["noto", "Noto Sans Arabic"],
            ]}
          />
          <SelectField
            label="فونت لاتین"
            value={design.enFont}
            onChange={(value) =>
              patch({ enFont: value as DesignSettings["enFont"] })
            }
            options={[
              ["manrope", "Manrope"],
              ["inter", "Inter"],
            ]}
          />
          <SelectField
            label="ظاهر هدر"
            value={design.headerStyle}
            onChange={(value) =>
              patch({ headerStyle: value as DesignSettings["headerStyle"] })
            }
            options={[
              ["glass", "شیشه‌ای"],
              ["solid", "تیره و یکپارچه"],
              ["minimal", "مینیمال روشن"],
            ]}
          />
          <SelectField
            label="ظاهر کارت‌ها"
            value={design.cardStyle}
            onChange={(value) =>
              patch({ cardStyle: value as DesignSettings["cardStyle"] })
            }
            options={[
              ["glass", "شیشه‌ای"],
              ["outline", "خطی و مینیمال"],
              ["elevated", "برجسته و سایه‌دار"],
            ]}
          />
          <SelectField
            label="تراکم رابط"
            value={design.density}
            onChange={(value) =>
              patch({ density: value as DesignSettings["density"] })
            }
            options={[
              ["compact", "فشرده"],
              ["balanced", "متعادل"],
              ["spacious", "باز و لوکس"],
            ]}
          />
          <SelectField
            label="بافت پس‌زمینه"
            value={design.backgroundStyle}
            onChange={(value) =>
              patch({
                backgroundStyle: value as DesignSettings["backgroundStyle"],
              })
            }
            options={[
              ["aurora", "Aurora پویا"],
              ["grid", "گرید مهندسی"],
              ["clean", "مینیمال تمیز"],
            ]}
          />
          <SelectField
            label="فرم دکمه‌ها"
            value={design.buttonStyle}
            onChange={(value) =>
              patch({ buttonStyle: value as DesignSettings["buttonStyle"] })
            }
            options={[
              ["pill", "کپسولی"],
              ["rounded", "مدرن گرد"],
              ["compact", "فشرده دقیق"],
            ]}
          />
          <RangeField
            label="اندازه متن پایه"
            value={design.baseFontSize}
            onChange={(baseFontSize) => patch({ baseFontSize })}
            min={14}
            max={20}
            suffix="px"
          />
          <RangeField
            label="مقیاس تیترها"
            value={design.headingScale}
            onChange={(headingScale) => patch({ headingScale })}
            min={0.82}
            max={1.25}
            step={0.01}
            suffix="×"
          />
          <RangeField
            label="شفافیت شیشه"
            value={design.glassBlur}
            onChange={(glassBlur) => patch({ glassBlur })}
            min={8}
            max={42}
            suffix="px"
          />
          <RangeField
            label="عمق سایه‌ها"
            value={design.shadowDepth}
            onChange={(shadowDepth) => patch({ shadowDepth })}
            min={0.5}
            max={1.8}
            step={0.05}
            suffix="×"
          />
          <RangeField
            label="شدت موشن"
            value={design.motionIntensity}
            onChange={(motionIntensity) => patch({ motionIntensity })}
            min={0.35}
            max={1.5}
            step={0.05}
            suffix="×"
          />
        </Grid>
      </Panel>

      <Panel
        title="گرید، اندازه و فاصله"
        text="کنترل‌های ساختاری برای عرض صفحه، فاصله عمودی، ستون‌ها و گردی اجزا؛ همه مقادیر پاسخ‌گو باقی می‌مانند."
      >
        <div className="design-tool-heading">
          <SlidersHorizontal size={20} />
          <span>Layout tokens</span>
        </div>
        <Grid>
          <RangeField
            label="حداکثر عرض محتوا"
            value={design.containerWidth}
            onChange={(containerWidth) => patch({ containerWidth })}
            min={1080}
            max={1600}
            step={10}
            suffix="px"
            wide
          />
          <RangeField
            label="فاصله عمودی بخش‌ها"
            value={design.sectionSpacing}
            onChange={(sectionSpacing) => patch({ sectionSpacing })}
            min={68}
            max={160}
            suffix="px"
          />
          <RangeField
            label="مقیاس گردی گوشه‌ها"
            value={design.radiusScale}
            onChange={(radiusScale) => patch({ radiusScale })}
            min={0.7}
            max={1.45}
            step={0.05}
            suffix="×"
          />
          <RangeField
            label="تعداد ستون‌های گرید"
            value={design.gridColumns}
            onChange={(gridColumns) => patch({ gridColumns })}
            min={8}
            max={16}
          />
          <RangeField
            label="فاصله ستون‌ها"
            value={design.gridGap}
            onChange={(gridGap) => patch({ gridGap })}
            min={8}
            max={48}
            suffix="px"
          />
        </Grid>
        <div
          className="design-grid-visual"
          style={
            {
              "--grid-columns": design.gridColumns,
              "--grid-gap": `${design.gridGap}px`,
            } as CSSProperties
          }
        >
          {Array.from({ length: design.gridColumns }, (_, index) => (
            <i key={index} />
          ))}
        </div>
      </Panel>
    </>
  );
}
function MediaField({
  label,
  value,
  onUpload,
  kind,
  wide = false,
}: {
  label: string;
  value: string;
  onUpload: (file: File) => void;
  kind: "image" | "video";
  wide?: boolean;
}) {
  return (
    <div className={`admin-image-field${wide ? " wide" : ""}`}>
      <span>{label}</span>
      <div>
        {value &&
          (kind === "video" ? (
            <video src={value} controls preload="metadata" />
          ) : (
            <Image
              src={value}
              width={180}
              height={110}
              unoptimized
              alt="پیش‌نمایش"
            />
          ))}
        <label>
          {kind === "video" ? <Video size={18} /> : <ImagePlus size={18} />}{" "}
          انتخاب و آپلود {kind === "video" ? "ویدئو" : "تصویر"}
          <input
            type="file"
            accept={
              kind === "video"
                ? "video/mp4,video/webm,video/quicktime"
                : "image/*"
            }
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) onUpload(file);
            }}
          />
        </label>
        <small>{value || "فایلی انتخاب نشده"}</small>
      </div>
    </div>
  );
}
function CollectionPanel({
  title,
  count,
  onAdd,
  children,
}: {
  title: string;
  count: number;
  onAdd: () => void;
  children: React.ReactNode;
}) {
  return (
    <Panel title={title}>
      <div className="admin-collection-head">
        <span>{count.toLocaleString("fa-IR")} مورد</span>
        <button className="admin-add" onClick={onAdd}>
          <PackagePlus size={17} /> افزودن مورد جدید
        </button>
      </div>
      <div className="admin-collection">{children}</div>
    </Panel>
  );
}
function Remove({ onClick }: { onClick: () => void }) {
  return (
    <button className="admin-remove" onClick={onClick} aria-label="حذف">
      <Trash2 size={17} />
    </button>
  );
}
function EditorDetails({
  title,
  subtitle,
  index,
  children,
  onRemove,
  open = false,
}: {
  title: string;
  subtitle: string;
  index: number;
  children: React.ReactNode;
  onRemove: () => void;
  open?: boolean;
}) {
  return (
    <details className="admin-item" open={open}>
      <summary>
        <span>{String(index + 1).padStart(2, "0")}</span>
        <div>
          <b>{title}</b>
          <small>{subtitle}</small>
        </div>
        <ChevronDown size={18} />
      </summary>
      <Remove onClick={onRemove} />
      <div className="admin-item-body">{children}</div>
    </details>
  );
}
function PageEditor({
  label,
  page,
  onChange,
  onUpload,
  onFocus,
}: {
  label: string;
  page: PageIntro;
  onChange: (value: PageIntro) => void;
  onUpload: (file: File) => void;
  onFocus: () => void;
}) {
  return (
    <div onFocus={onFocus}>
      <Panel title={`صفحه ${label}`}>
        <Grid>
          <Field
            label="برچسب انگلیسی"
            value={page.eyebrow}
            onChange={(value) => onChange({ ...page, eyebrow: value })}
          />
          <Field
            label="عنوان"
            value={page.title}
            onChange={(value) => onChange({ ...page, title: value })}
          />
          <TextArea
            wide
            label="توضیحات"
            value={page.text}
            onChange={(value) => onChange({ ...page, text: value })}
          />
          <Field
            wide
            label="یادداشت روی تصویر"
            value={page.note}
            onChange={(value) => onChange({ ...page, note: value })}
          />
          <MediaField
            wide
            kind="image"
            label="تصویر Hero"
            value={page.image}
            onUpload={onUpload}
          />
          <Field
            label="اعتبار عکاس / منبع"
            value={page.credit || ""}
            onChange={(value) => onChange({ ...page, credit: value })}
          />
          <Field
            label="لینک منبع تصویر"
            value={page.source || ""}
            onChange={(value) => onChange({ ...page, source: value })}
          />
        </Grid>
      </Panel>
    </div>
  );
}
function ProductEditor({
  item,
  index,
  onChange,
  onRemove,
  onUpload,
  onDocumentUpload,
}: {
  item: ProductItem;
  index: number;
  onChange: (value: ProductItem) => void;
  onRemove: () => void;
  onUpload: (file: File) => void;
  onDocumentUpload: (file: File) => void;
}) {
  return (
    <EditorDetails
      title={item.fa || "محصول جدید"}
      subtitle={item.en || item.tag}
      index={index}
      onRemove={onRemove}
    >
      <Grid>
        <Field
          label="نام فارسی"
          value={item.fa}
          onChange={(value) => onChange({ ...item, fa: value })}
        />
        <Field
          label="نام انگلیسی"
          value={item.en}
          onChange={(value) => onChange({ ...item, en: value })}
        />
        <Field
          label="آدرس انگلیسی محصول"
          value={item.slug}
          onChange={(value) =>
            onChange({
              ...item,
              slug: value.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
            })
          }
        />
        <Field
          label="دسته‌بندی"
          value={item.cat}
          onChange={(value) => onChange({ ...item, cat: value })}
        />
        <Field
          label="برچسب"
          value={item.tag}
          onChange={(value) => onChange({ ...item, tag: value })}
        />
        <Field
          label="برند"
          value={item.brand}
          onChange={(value) => onChange({ ...item, brand: value })}
        />
        <Field
          label="مدل"
          value={item.model}
          onChange={(value) => onChange({ ...item, model: value })}
        />
        <Field
          label="وضعیت تأمین"
          value={item.availability}
          onChange={(value) => onChange({ ...item, availability: value })}
        />
        <TextArea
          wide
          label="خلاصه معرفی"
          value={item.summary}
          onChange={(value) => onChange({ ...item, summary: value })}
        />
        <TextArea
          wide
          label="کاربرد موردنظر"
          value={item.intendedUse}
          onChange={(value) => onChange({ ...item, intendedUse: value })}
        />
        <TextArea
          wide
          label="ویژگی‌های کلیدی؛ هر خط یک مورد"
          value={item.specs.join("\n")}
          onChange={(value) =>
            onChange({
              ...item,
              specs: value
                .split("\n")
                .map((line) => line.trim())
                .filter(Boolean),
            })
          }
        />
        <TextArea
          wide
          label="مشخصات فنی؛ هر خط: عنوان | مقدار"
          value={item.technicalSpecs
            .map((spec) => `${spec.label} | ${spec.value}`)
            .join("\n")}
          onChange={(value) =>
            onChange({
              ...item,
              technicalSpecs: value
                .split("\n")
                .map((line) => line.split("|"))
                .filter((parts) => parts[0]?.trim())
                .map((parts) => ({
                  label: parts[0].trim(),
                  value: parts.slice(1).join("|").trim(),
                })),
            })
          }
        />
        <TextArea
          wide
          label="خدمات همراه؛ هر خط یک مورد"
          value={item.services.join("\n")}
          onChange={(value) =>
            onChange({
              ...item,
              services: value
                .split("\n")
                .map((line) => line.trim())
                .filter(Boolean),
            })
          }
        />
        <TextArea
          wide
          label="دیتاشیت و مدارک؛ هر خط: عنوان | نوع | لینک"
          value={item.documents
            .map(
              (document) =>
                `${document.title} | ${document.type} | ${document.url}`,
            )
            .join("\n")}
          onChange={(value) =>
            onChange({
              ...item,
              documents: value
                .split("\n")
                .map((line) => line.split("|").map((part) => part.trim()))
                .filter((parts) => parts[0])
                .map((parts) => ({
                  title: parts[0],
                  type: parts[1] || "PDF",
                  url: parts.slice(2).join("|"),
                })),
            })
          }
        />
        <DocumentField
          label="آپلود دیتاشیت PDF"
          value=""
          onUpload={onDocumentUpload}
        />
        <MediaField
          wide
          kind="image"
          label="تصویر محصول"
          value={item.image}
          onUpload={onUpload}
        />
        <Field
          label="اعتبار تصویر"
          value={item.imageCredit}
          onChange={(value) => onChange({ ...item, imageCredit: value })}
        />
        <Field
          label="مجوز تصویر"
          value={item.imageLicense}
          onChange={(value) => onChange({ ...item, imageLicense: value })}
        />
        <Field
          wide
          label="لینک منبع تصویر"
          value={item.imageSource}
          onChange={(value) => onChange({ ...item, imageSource: value })}
        />
        <label className="admin-switch">
          <span>محصول منتخب</span>
          <button
            className={item.featured ? "on" : ""}
            onClick={() => onChange({ ...item, featured: !item.featured })}
            type="button"
          >
            <i />
            {item.featured ? "نمایش ویژه" : "عادی"}
          </button>
        </label>
      </Grid>
    </EditorDetails>
  );
}
function ServiceEditor({
  item,
  index,
  onChange,
  onRemove,
}: {
  item: ServiceItem;
  index: number;
  onChange: (value: ServiceItem) => void;
  onRemove: () => void;
}) {
  return (
    <EditorDetails
      title={item.title || "خدمت جدید"}
      subtitle={item.en}
      index={index}
      onRemove={onRemove}
    >
      <Grid>
        <Field
          label="برچسب انگلیسی"
          value={item.en}
          onChange={(value) => onChange({ ...item, en: value })}
        />
        <Field
          label="عنوان"
          value={item.title}
          onChange={(value) => onChange({ ...item, title: value })}
        />
        <TextArea
          wide
          label="توضیحات"
          value={item.text}
          onChange={(value) => onChange({ ...item, text: value })}
        />
        <TextArea
          wide
          label="موارد؛ هر خط یک مورد"
          value={item.list.join("\n")}
          onChange={(value) =>
            onChange({ ...item, list: value.split("\n").filter(Boolean) })
          }
        />
      </Grid>
    </EditorDetails>
  );
}
function SolutionEditor({
  item,
  index,
  onChange,
  onRemove,
  onUpload,
}: {
  item: SolutionItem;
  index: number;
  onChange: (value: SolutionItem) => void;
  onRemove: () => void;
  onUpload: (file: File) => void;
}) {
  return (
    <EditorDetails
      title={item.title || "راهکار جدید"}
      subtitle={item.en}
      index={index}
      onRemove={onRemove}
    >
      <Grid>
        <Field
          label="عنوان"
          value={item.title}
          onChange={(value) => onChange({ ...item, title: value })}
        />
        <Field
          label="عنوان انگلیسی"
          value={item.en}
          onChange={(value) => onChange({ ...item, en: value })}
        />
        <TextArea
          wide
          label="توضیحات"
          value={item.text}
          onChange={(value) => onChange({ ...item, text: value })}
        />
        <MediaField
          wide
          kind="image"
          label="تصویر"
          value={item.image}
          onUpload={onUpload}
        />
      </Grid>
    </EditorDetails>
  );
}
function StepEditor({
  item,
  index,
  onChange,
  onRemove,
}: {
  item: StepItem;
  index: number;
  onChange: (value: StepItem) => void;
  onRemove: () => void;
}) {
  return (
    <EditorDetails
      title={item.title || "مرحله جدید"}
      subtitle="مرحله تأمین"
      index={index}
      onRemove={onRemove}
    >
      <Grid>
        <Field
          label="عنوان"
          value={item.title}
          onChange={(value) => onChange({ ...item, title: value })}
        />
        <TextArea
          label="توضیحات"
          value={item.text}
          onChange={(value) => onChange({ ...item, text: value })}
        />
      </Grid>
    </EditorDetails>
  );
}

function HomeTextCollection({
  title,
  items,
  onChange,
}: {
  title: string;
  items: HomeTextCard[];
  onChange: (items: HomeTextCard[]) => void;
}) {
  const update = (index: number, item: HomeTextCard) => {
    const next = [...items];
    next[index] = item;
    onChange(next);
  };
  return (
    <CollectionPanel
      title={title}
      count={items.length}
      onAdd={() =>
        onChange([...items, { title: "عنوان جدید", text: "توضیحات جدید" }])
      }
    >
      {items.map((item, index) => (
        <EditorDetails
          key={`${item.title}-${index}`}
          title={item.title}
          subtitle="بخش صفحه اصلی"
          index={index}
          onRemove={() => onChange(items.filter((_, i) => i !== index))}
        >
          <Grid>
            <Field
              label="عنوان"
              value={item.title}
              onChange={(title) => update(index, { ...item, title })}
            />
            <TextArea
              label="توضیحات"
              value={item.text}
              onChange={(text) => update(index, { ...item, text })}
            />
          </Grid>
        </EditorDetails>
      ))}
    </CollectionPanel>
  );
}

function HomeCategoryCollection({
  items,
  onChange,
  upload,
}: {
  items: HomeCategory[];
  onChange: (items: HomeCategory[]) => void;
  upload: (file: File, onDone: (url: string, type: string) => void) => void;
}) {
  const update = (index: number, item: HomeCategory) => {
    const next = [...items];
    next[index] = item;
    onChange(next);
  };
  return (
    <CollectionPanel
      title="دسته‌بندی‌های صفحه اصلی"
      count={items.length}
      onAdd={() =>
        onChange([
          ...items,
          {
            title: "دسته جدید",
            en: "NEW CATEGORY",
            image: "/assets/medical-visual.jpg",
          },
        ])
      }
    >
      {items.map((item, index) => (
        <EditorDetails
          key={`${item.title}-${index}`}
          title={item.title}
          subtitle={item.en}
          index={index}
          onRemove={() => onChange(items.filter((_, i) => i !== index))}
        >
          <Grid>
            <Field
              label="عنوان فارسی"
              value={item.title}
              onChange={(title) => update(index, { ...item, title })}
            />
            <Field
              label="عنوان انگلیسی"
              value={item.en}
              onChange={(en) => update(index, { ...item, en })}
            />
            <MediaField
              wide
              kind="image"
              label="تصویر دسته"
              value={item.image}
              onUpload={(file) =>
                upload(file, (url) => update(index, { ...item, image: url }))
              }
            />
          </Grid>
        </EditorDetails>
      ))}
    </CollectionPanel>
  );
}

function AdminSnapshot({
  content,
  admins,
  onOpen,
}: {
  content: SiteContent;
  admins: number;
  onOpen: (tab: TabId) => void;
}) {
  const published = content.blogPosts.filter((post) => post.published).length;
  const blocks = Object.values(content.customBlocks).reduce(
    (sum, items) => sum + items.length,
    0,
  );
  return (
    <section className="admin-snapshot">
      <header>
        <div>
          <span>وضعیت محتوای سایت</span>
          <h2>همه‌چیز از همین‌جا در کنترل شماست</h2>
        </div>
        <small>
          <i /> همگام با سایت زنده
        </small>
      </header>
      <div>
        <button onClick={() => onOpen("products")}>
          <b>{content.products.length.toLocaleString("fa-IR")}</b>
          <span>محصول قابل ویرایش</span>
        </button>
        <button onClick={() => onOpen("blog")}>
          <b>{published.toLocaleString("fa-IR")}</b>
          <span>مقاله منتشرشده</span>
        </button>
        <button onClick={() => onOpen("builder")}>
          <b>{blocks.toLocaleString("fa-IR")}</b>
          <span>بخش سفارشی</span>
        </button>
        <button onClick={() => onOpen("admins")}>
          <b>{admins.toLocaleString("fa-IR")}</b>
          <span>مدیر فعال</span>
        </button>
      </div>
    </section>
  );
}

function BlogManager({
  content,
  setContent,
  upload,
}: {
  content: SiteContent;
  setContent: (value: SiteContent) => void;
  upload: (file: File, onDone: (url: string, type: string) => void) => void;
}) {
  const replace = (posts: BlogPost[]) =>
    setContent({ ...content, blogPosts: posts });
  const add = () =>
    replace([
      ...content.blogPosts,
      {
        id: crypto.randomUUID(),
        slug: `new-post-${Date.now()}`,
        title: "عنوان مقاله جدید",
        excerpt: "خلاصه کوتاه مقاله",
        content: "متن مقاله را اینجا بنویسید.",
        image: "/assets/medical-visual.jpg",
        category: "دانش پزشکی",
        author: "تیم Clinoro",
        publishedAt: new Date().toISOString().slice(0, 10),
        published: false,
        seoTitle: "",
        seoDescription: "",
        sources: [],
        imageCredit: "",
        imageSource: "",
      },
    ]);
  const update = (index: number, post: BlogPost) => {
    const posts = [...content.blogPosts];
    posts[index] = post;
    replace(posts);
  };
  return (
    <CollectionPanel
      title="مدیریت بلاگ و مقالات"
      count={content.blogPosts.length}
      onAdd={add}
    >
      {content.blogPosts.map((post, index) => (
        <EditorDetails
          key={post.id}
          title={post.title}
          subtitle={post.published ? "منتشرشده" : "پیش‌نویس"}
          index={index}
          open={index === content.blogPosts.length - 1}
          onRemove={() =>
            replace(content.blogPosts.filter((_, i) => i !== index))
          }
        >
          <Grid>
            <Field
              label="عنوان مقاله"
              value={post.title}
              onChange={(value) => update(index, { ...post, title: value })}
            />
            <Field
              label="آدرس انگلیسی (slug)"
              value={post.slug}
              onChange={(value) =>
                update(index, {
                  ...post,
                  slug: value.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
                })
              }
            />
            <Field
              label="دسته‌بندی"
              value={post.category}
              onChange={(value) => update(index, { ...post, category: value })}
            />
            <Field
              label="نویسنده"
              value={post.author}
              onChange={(value) => update(index, { ...post, author: value })}
            />
            <Field
              label="تاریخ انتشار"
              value={post.publishedAt}
              onChange={(value) =>
                update(index, { ...post, publishedAt: value })
              }
            />
            <label className="admin-switch">
              <span>وضعیت انتشار</span>
              <button
                className={post.published ? "on" : ""}
                onClick={() =>
                  update(index, { ...post, published: !post.published })
                }
                type="button"
              >
                <i />
                {post.published ? "منتشر شود" : "پیش‌نویس"}
              </button>
            </label>
            <TextArea
              wide
              label="خلاصه"
              value={post.excerpt}
              onChange={(value) => update(index, { ...post, excerpt: value })}
            />
            <TextArea
              wide
              label="متن کامل؛ ## برای تیتر، - برای فهرست و > برای نکته"
              value={post.content}
              onChange={(value) => update(index, { ...post, content: value })}
            />
            <MediaField
              wide
              kind="image"
              label="تصویر شاخص"
              value={post.image}
              onUpload={(file) =>
                upload(file, (url) => update(index, { ...post, image: url }))
              }
            />
            <Field
              label="اعتبار / نام عکاس"
              value={post.imageCredit || ""}
              onChange={(value) =>
                update(index, { ...post, imageCredit: value })
              }
            />
            <Field
              label="لینک منبع عکس"
              value={post.imageSource || ""}
              onChange={(value) =>
                update(index, { ...post, imageSource: value })
              }
            />
            <TextArea
              wide
              label="منابع مقاله؛ هر خط: عنوان | لینک"
              value={(post.sources || [])
                .map((source) => `${source.title} | ${source.url}`)
                .join("\n")}
              onChange={(value) =>
                update(index, {
                  ...post,
                  sources: value
                    .split("\n")
                    .map((line) => line.trim())
                    .filter(Boolean)
                    .map((line) => {
                      const split = line.lastIndexOf("|");
                      return split > 0
                        ? {
                            title: line.slice(0, split).trim(),
                            url: line.slice(split + 1).trim(),
                          }
                        : { title: line, url: "" };
                    }),
                })
              }
            />
            <Field
              wide
              label="عنوان SEO"
              value={post.seoTitle}
              onChange={(value) => update(index, { ...post, seoTitle: value })}
            />
            <TextArea
              wide
              label="توضیحات SEO"
              value={post.seoDescription}
              onChange={(value) =>
                update(index, { ...post, seoDescription: value })
              }
            />
          </Grid>
        </EditorDetails>
      ))}
    </CollectionPanel>
  );
}

const rfqStatusLabels: Record<RfqStatus, string> = {
  new: "جدید",
  reviewing: "در حال بررسی",
  contacted: "تماس گرفته شد",
  qualified: "واجد شرایط",
  closed: "بسته‌شده",
};
function RfqInbox() {
  const [items, setItems] = useState<RfqSubmission[]>([]);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<"all" | RfqStatus>("all");
  const [reload, setReload] = useState(0);
  useEffect(() => {
    let active = true;
    fetch(`/api/admin/rfq${filter === "all" ? "" : `?status=${filter}`}`, {
      cache: "no-store",
    })
      .then(async (response) => {
        const result = (await response.json()) as {
          submissions?: RfqSubmission[];
          error?: string;
        };
        if (!response.ok)
          throw new Error(result.error || "خطا در دریافت درخواست‌ها");
        if (active) setItems(result.submissions || []);
      })
      .catch((reason) => {
        if (active)
          setError(
            reason instanceof Error
              ? reason.message
              : "خطا در دریافت درخواست‌ها",
          );
      })
      .finally(() => {
        if (active) setBusy(false);
      });
    return () => {
      active = false;
    };
  }, [filter, reload]);
  const changeStatus = async (id: string, status: RfqStatus) => {
    const response = await fetch("/api/admin/rfq", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    if (response.ok)
      setItems((current) =>
        current.map((item) =>
          item.id === id ? { ...item, status, updatedAt: Date.now() } : item,
        ),
      );
    else setError("تغییر وضعیت ذخیره نشد");
  };
  const exportCsv = () => {
    const safe = (value: string) =>
      `"${(/^[=+\-@]/.test(value) ? "'" : "") + value.replaceAll('"', '""')}"`;
    const rows = [
      [
        "reference",
        "created_at",
        "status",
        "name",
        "organization",
        "phone",
        "email",
        "topic",
        "product",
        "city",
        "quantity",
        "timeline",
        "message",
      ],
      ...items.map((item) => [
        item.reference,
        new Date(item.createdAt).toISOString(),
        item.status,
        item.name,
        item.organization,
        item.phone,
        item.email,
        item.topic,
        item.productSlug,
        item.city,
        item.quantity,
        item.timeline,
        item.message,
      ]),
    ];
    const blob = new Blob(
      [
        "\ufeff" +
          rows
            .map((row) => row.map((value) => safe(String(value))).join(","))
            .join("\n"),
      ],
      { type: "text/csv;charset=utf-8" },
    );
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `clinoro-rfq-${new Date().toISOString().slice(0, 10)}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  };
  return (
    <Panel
      title="صندوق درخواست‌های واقعی"
      text="هر ارسال موفق فرم عمومی با کد پیگیری اینجا ثبت می‌شود. شماره و ایمیل فقط برای پیگیری همان درخواست استفاده شود."
    >
      <div className="rfq-admin-toolbar">
        <label>
          <span>فیلتر وضعیت</span>
          <select
            value={filter}
            onChange={(event) => {
              setBusy(true);
              setError("");
              setFilter(event.target.value as "all" | RfqStatus);
            }}
          >
            <option value="all">همه درخواست‌ها</option>
            {Object.entries(rfqStatusLabels).map(([value, label]) => (
              <option value={value} key={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <div>
          <button
            onClick={() => {
              setBusy(true);
              setError("");
              setReload((value) => value + 1);
            }}
          >
            <RefreshCw size={17} /> تازه‌سازی
          </button>
          <button onClick={exportCsv} disabled={!items.length}>
            <Download size={17} /> خروجی CSV
          </button>
        </div>
      </div>
      {error && (
        <p className="admin-message error" role="alert">
          {error}
        </p>
      )}
      {busy ? (
        <div className="admin-loading">
          <LoaderCircle className="spin" /> در حال دریافت درخواست‌ها
        </div>
      ) : items.length ? (
        <div className="rfq-admin-list">
          {items.map((item) => (
            <article key={item.id}>
              <header>
                <div>
                  <b>{item.name}</b>
                  <span dir="ltr">{item.reference}</span>
                </div>
                <time>{new Date(item.createdAt).toLocaleString("fa-IR")}</time>
              </header>
              <div className="rfq-admin-meta">
                <span>{item.organization || "بدون نام مجموعه"}</span>
                <a href={`tel:${item.phone}`} dir="ltr">
                  {item.phone}
                </a>
                {item.email && (
                  <a href={`mailto:${item.email}`}>{item.email}</a>
                )}
                <span>{item.city || "شهر نامشخص"}</span>
              </div>
              <div className="rfq-admin-topic">
                <b>{item.topic}</b>
                {item.productSlug && (
                  <small dir="ltr">{item.productSlug}</small>
                )}
                {item.quantity && <small>تعداد: {item.quantity}</small>}
                {item.timeline && <small>{item.timeline}</small>}
              </div>
              <p>{item.message}</p>
              <footer>
                <select
                  value={item.status}
                  onChange={(event) =>
                    void changeStatus(item.id, event.target.value as RfqStatus)
                  }
                >
                  {Object.entries(rfqStatusLabels).map(([value, label]) => (
                    <option value={value} key={value}>
                      {label}
                    </option>
                  ))}
                </select>
                {item.sourceUrl && (
                  <a href={item.sourceUrl} target="_blank" rel="noreferrer">
                    صفحه مبدأ
                  </a>
                )}
              </footer>
            </article>
          ))}
        </div>
      ) : (
        <div className="admin-empty">
          <Inbox size={30} />
          <b>هنوز درخواستی ثبت نشده است</b>
          <span>پس از ارسال فرم عمومی، درخواست‌ها اینجا ظاهر می‌شوند.</span>
        </div>
      )}
    </Panel>
  );
}

function TrustManager({
  content,
  setContent,
  upload,
  canVerify,
}: {
  content: SiteContent;
  setContent: (value: SiteContent) => void;
  upload: (file: File, onDone: (url: string, type: string) => void) => void;
  canVerify: boolean;
}) {
  const replace = (items: TrustItem[]) =>
    setContent({ ...content, trustItems: items });
  const update = (index: number, item: TrustItem) => {
    const items = [...content.trustItems];
    items[index] = item;
    replace(items);
  };
  const add = () =>
    replace([
      ...content.trustItems,
      {
        id: crypto.randomUUID(),
        type: "document",
        title: "مدرک جدید",
        subtitle: "",
        description: "",
        image: "",
        fileUrl: "",
        issuer: "",
        issuedAt: "",
        published: false,
        verified: false,
      },
    ]);
  return (
    <CollectionPanel
      title="پروژه‌ها، مشتریان، گواهی‌ها و مدارک اعتماد"
      count={content.trustItems.length}
      onAdd={add}
    >
      {!canVerify && (
        <div className="admin-code-warning">
          <ShieldCheck size={22} />
          <div>
            <b>تأیید نهایی با مدیر اصلی است</b>
            <p>
              شما می‌توانید اطلاعات و فایل را آماده کنید؛ وضعیت تأیید و انتشار
              عمومی فقط توسط مالک سایت فعال می‌شود.
            </p>
          </div>
        </div>
      )}
      {content.trustItems.map((item, index) => (
        <EditorDetails
          key={item.id}
          title={item.title}
          subtitle={item.verified ? "تأییدشده" : "در انتظار تأیید"}
          index={index}
          onRemove={() =>
            replace(
              content.trustItems.filter((_, itemIndex) => itemIndex !== index),
            )
          }
        >
          <Grid>
            <SelectField
              label="نوع"
              value={item.type}
              onChange={(value) =>
                update(index, { ...item, type: value as TrustItem["type"] })
              }
              options={[
                ["project", "پروژه"],
                ["client", "مشتری"],
                ["certificate", "گواهی"],
                ["document", "مدرک"],
              ]}
            />
            <Field
              label="عنوان"
              value={item.title}
              onChange={(value) => update(index, { ...item, title: value })}
            />
            <Field
              label="زیرعنوان"
              value={item.subtitle}
              onChange={(value) => update(index, { ...item, subtitle: value })}
            />
            <Field
              label="صادرکننده / مرجع"
              value={item.issuer}
              onChange={(value) => update(index, { ...item, issuer: value })}
            />
            <Field
              label="تاریخ"
              value={item.issuedAt}
              onChange={(value) => update(index, { ...item, issuedAt: value })}
            />
            <TextArea
              wide
              label="توضیحات قابل انتشار"
              value={item.description}
              onChange={(value) =>
                update(index, { ...item, description: value })
              }
            />
            <MediaField
              wide
              kind="image"
              label="تصویر یا لوگوی مجاز"
              value={item.image}
              onUpload={(file) =>
                upload(file, (url) => update(index, { ...item, image: url }))
              }
            />
            <DocumentField
              label="فایل مدرک PDF"
              value={item.fileUrl}
              onUpload={(file) =>
                upload(file, (url) => update(index, { ...item, fileUrl: url }))
              }
            />
            <label className="admin-switch">
              <span>تأیید اصالت</span>
              <button
                disabled={!canVerify}
                className={item.verified ? "on" : ""}
                onClick={() =>
                  update(index, {
                    ...item,
                    verified: !item.verified,
                    published: item.verified ? false : item.published,
                  })
                }
                type="button"
              >
                <i />
                {item.verified ? "تأییدشده" : "تأییدنشده"}
              </button>
            </label>
            <label className="admin-switch">
              <span>انتشار عمومی</span>
              <button
                disabled={!canVerify || !item.verified}
                className={item.published ? "on" : ""}
                onClick={() =>
                  update(index, { ...item, published: !item.published })
                }
                type="button"
              >
                <i />
                {item.published ? "منتشر شود" : "پنهان"}
              </button>
            </label>
          </Grid>
        </EditorDetails>
      ))}
    </CollectionPanel>
  );
}

function DocumentField({
  label,
  value,
  onUpload,
}: {
  label: string;
  value: string;
  onUpload: (file: File) => void;
}) {
  return (
    <div className="admin-image-field wide">
      <span>{label}</span>
      <div>
        {value && (
          <a href={value} target="_blank" rel="noreferrer">
            <FileText size={20} /> مشاهده فایل فعلی
          </a>
        )}
        <label>
          <Upload size={18} /> انتخاب و آپلود PDF
          <input
            type="file"
            accept="application/pdf"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) onUpload(file);
            }}
          />
        </label>
        <small>{value || "فایلی انتخاب نشده"}</small>
      </div>
    </div>
  );
}

const makeContentBlock = (type: ContentBlock["type"]): ContentBlock => ({
  id: crypto.randomUUID(),
  type,
  title: "عنوان بخش جدید",
  text: "متن موردنظر را اینجا بنویسید.",
  mediaUrl: "",
  caption: "",
  linkLabel: type === "cta" ? "اطلاعات بیشتر" : "",
  linkUrl: type === "cta" ? "/contact" : "",
  theme: "light",
  visible: true,
  hideOnDesktop: false,
  hideOnMobile: false,
  layout: type === "cta" || type === "text" ? "center" : "split",
  width: "standard",
  mediaSide: "start",
  textAlign: type === "cta" || type === "text" ? "center" : "start",
  mediaAspect: "wide",
  motion: "reveal",
  columns: 1,
  style: {
    background: "transparent",
    foreground: "",
    accent: "#3978ff",
    radius: 34,
    paddingY: 100,
    titleSize: 52,
    gap: 70,
  },
  responsive: {
    mobileTitleSize: 36,
    mobilePaddingY: 64,
    mobileGap: 28,
    tabletStack: true,
  },
});

function BlockBuilder({
  page,
  setPage,
  content,
  setContent,
  upload,
}: {
  page: PageKey;
  setPage: (page: PageKey) => void;
  content: SiteContent;
  setContent: (content: SiteContent) => void;
  upload: (file: File, onDone: (url: string, type: string) => void) => void;
}) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const blocks = content.customBlocks[page] || [];
  const replace = (next: ContentBlock[]) =>
    setContent({
      ...content,
      customBlocks: { ...content.customBlocks, [page]: next },
    });
  const add = (type: ContentBlock["type"]) =>
    replace([...blocks, makeContentBlock(type)]);
  const update = (index: number, next: ContentBlock) => {
    const items = [...blocks];
    items[index] = next;
    replace(items);
  };
  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= blocks.length) return;
    const items = [...blocks];
    [items[index], items[target]] = [items[target], items[index]];
    replace(items);
  };
  const moveTo = (from: number, to: number) => {
    if (from === to || from < 0 || to < 0) return;
    const items = [...blocks];
    const [item] = items.splice(from, 1);
    items.splice(to, 0, item);
    replace(items);
  };
  const duplicate = (index: number) => {
    const source = blocks[index];
    const copy: ContentBlock = {
      ...source,
      id: crypto.randomUUID(),
      title: `${source.title || blockTypeLabels[source.type]} — کپی`,
      style: { ...source.style },
      responsive: { ...source.responsive },
    };
    const items = [...blocks];
    items.splice(index + 1, 0, copy);
    replace(items);
  };
  return (
    <>
      <Panel
        title="سازنده محتوای آزاد"
        text="بخش‌ها را بسازید، با کشیدن جابه‌جا کنید و برای هر دستگاه، چیدمان، اندازه، رنگ، فاصله و موشن مستقل تعیین کنید."
      >
        <div className="builder-toolbar">
          <label>
            <span>صفحه مقصد</span>
            <select
              value={page}
              onChange={(event) => setPage(event.target.value as PageKey)}
            >
              {Object.entries(builderPageLabels).map(([key, label]) => (
                <option value={key} key={key}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <div>
            <button type="button" onClick={() => add("text")}>
              <FileText size={17} /> متن
            </button>
            <button type="button" onClick={() => add("image")}>
              <ImagePlus size={17} /> تصویر
            </button>
            <button type="button" onClick={() => add("video")}>
              <PlayCircle size={17} /> ویدئو
            </button>
            <button type="button" onClick={() => add("cta")}>
              <ArrowUpLeft size={17} /> دکمه و CTA
            </button>
          </div>
        </div>
      </Panel>
      <Panel
        title={`بخش‌های صفحه ${builderPageLabels[page]}`}
        text={
          blocks.length
            ? `${blocks.length.toLocaleString("fa-IR")} بخش قابل ویرایش`
            : "هنوز بخشی اضافه نشده؛ از دکمه‌های بالا شروع کنید."
        }
      >
        <div className="admin-collection">
          {blocks.map((block, index) => (
            <details
              className={`admin-item admin-block-item${block.visible ? "" : " is-hidden"}${dragIndex === index ? " is-dragging" : ""}`}
              open={index === blocks.length - 1}
              key={block.id}
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => {
                event.preventDefault();
                if (dragIndex !== null) moveTo(dragIndex, index);
                setDragIndex(null);
              }}
            >
              <summary>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <b>{block.title || blockTypeLabels[block.type]}</b>
                  <small>
                    {blockTypeLabels[block.type]} ·{" "}
                    {block.visible ? "قابل نمایش" : "پنهان"}
                  </small>
                </div>
                <ChevronDown size={18} />
              </summary>
              <div className="block-order">
                <button
                  type="button"
                  className="block-drag-handle"
                  draggable
                  onDragStart={(event) => {
                    setDragIndex(index);
                    event.dataTransfer.effectAllowed = "move";
                  }}
                  onDragEnd={() => setDragIndex(null)}
                  aria-label="گرفتن و جابه‌جایی بخش"
                >
                  <GripVertical size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => move(index, -1)}
                  disabled={index === 0}
                  aria-label="انتقال به بالا"
                >
                  <ArrowUp size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => move(index, 1)}
                  disabled={index === blocks.length - 1}
                  aria-label="انتقال به پایین"
                >
                  <ArrowDown size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => duplicate(index)}
                  aria-label="ساخت کپی از بخش"
                >
                  <Copy size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => replace(blocks.filter((_, i) => i !== index))}
                  aria-label="حذف بخش"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="admin-item-body">
                <div className="block-visibility-row">
                  <button
                    type="button"
                    className={block.visible ? "active" : ""}
                    onClick={() =>
                      update(index, { ...block, visible: !block.visible })
                    }
                  >
                    <Eye size={16} />
                    {block.visible ? "نمایش بخش" : "بخش پنهان است"}
                  </button>
                  <button
                    type="button"
                    className={block.hideOnDesktop ? "active" : ""}
                    onClick={() =>
                      update(index, {
                        ...block,
                        hideOnDesktop: !block.hideOnDesktop,
                      })
                    }
                  >
                    <Monitor size={16} /> پنهان در دسکتاپ
                  </button>
                  <button
                    type="button"
                    className={block.hideOnMobile ? "active" : ""}
                    onClick={() =>
                      update(index, {
                        ...block,
                        hideOnMobile: !block.hideOnMobile,
                      })
                    }
                  >
                    <Smartphone size={16} /> پنهان در موبایل
                  </button>
                </div>
                <Grid>
                  <SelectField
                    label="نوع بخش"
                    value={block.type}
                    onChange={(value) =>
                      update(index, {
                        ...block,
                        type: value as ContentBlock["type"],
                      })
                    }
                    options={
                      Object.entries(blockTypeLabels) as Array<[string, string]>
                    }
                  />
                  <SelectField
                    label="ظاهر بخش"
                    value={block.theme}
                    onChange={(value) =>
                      update(index, {
                        ...block,
                        theme: value as ContentBlock["theme"],
                      })
                    }
                    options={[
                      ["light", "روشن"],
                      ["glass", "شیشه‌ای"],
                      ["dark", "تیره"],
                    ]}
                  />
                  <SelectField
                    label="چیدمان"
                    value={block.layout}
                    onChange={(value) =>
                      update(index, {
                        ...block,
                        layout: value as ContentBlock["layout"],
                      })
                    }
                    options={[
                      ["split", "دو بخشی"],
                      ["stack", "رسانه بالا"],
                      ["center", "مرکزی"],
                      ["spotlight", "رسانه تمام‌نما"],
                    ]}
                  />
                  <SelectField
                    label="عرض بخش"
                    value={block.width}
                    onChange={(value) =>
                      update(index, {
                        ...block,
                        width: value as ContentBlock["width"],
                      })
                    }
                    options={[
                      ["narrow", "باریک"],
                      ["standard", "استاندارد"],
                      ["wide", "عریض"],
                      ["full", "تمام عرض"],
                    ]}
                  />
                  <SelectField
                    label="جای رسانه"
                    value={block.mediaSide}
                    onChange={(value) =>
                      update(index, {
                        ...block,
                        mediaSide: value as ContentBlock["mediaSide"],
                      })
                    }
                    options={[
                      ["start", "ابتدای ردیف"],
                      ["end", "انتهای ردیف"],
                    ]}
                  />
                  <SelectField
                    label="تراز متن"
                    value={block.textAlign}
                    onChange={(value) =>
                      update(index, {
                        ...block,
                        textAlign: value as ContentBlock["textAlign"],
                      })
                    }
                    options={[
                      ["start", "راست / شروع"],
                      ["center", "وسط"],
                      ["end", "چپ / پایان"],
                    ]}
                  />
                  <SelectField
                    label="نسبت رسانه"
                    value={block.mediaAspect}
                    onChange={(value) =>
                      update(index, {
                        ...block,
                        mediaAspect: value as ContentBlock["mediaAspect"],
                      })
                    }
                    options={[
                      ["wide", "افقی ۱۶:۹"],
                      ["square", "مربع ۱:۱"],
                      ["portrait", "عمودی ۴:۵"],
                    ]}
                  />
                  <SelectField
                    label="موشن ورود"
                    value={block.motion}
                    onChange={(value) =>
                      update(index, {
                        ...block,
                        motion: value as ContentBlock["motion"],
                      })
                    }
                    options={[
                      ["none", "بدون موشن"],
                      ["reveal", "نمایش نرم"],
                      ["float", "شناور ملایم"],
                      ["parallax", "پارالاکس عمقی"],
                      ["pulse", "پالس پزشکی"],
                    ]}
                  />
                  <SelectField
                    label="ستون متن"
                    value={String(block.columns)}
                    onChange={(value) =>
                      update(index, {
                        ...block,
                        columns: Number(value) as ContentBlock["columns"],
                      })
                    }
                    options={[
                      ["1", "یک ستون"],
                      ["2", "دو ستون"],
                    ]}
                  />
                  <Field
                    wide
                    label="عنوان"
                    value={block.title}
                    onChange={(value) =>
                      update(index, { ...block, title: value })
                    }
                  />
                  <TextArea
                    wide
                    label="متن؛ برای پاراگراف جدید Enter بزنید"
                    value={block.text}
                    onChange={(value) =>
                      update(index, { ...block, text: value })
                    }
                  />
                  {(block.type === "image" || block.type === "video") && (
                    <>
                      <MediaField
                        wide
                        kind={block.type}
                        label={
                          block.type === "video" ? "فایل ویدئو" : "فایل تصویر"
                        }
                        value={block.mediaUrl}
                        onUpload={(file) =>
                          upload(file, (url) =>
                            update(index, { ...block, mediaUrl: url }),
                          )
                        }
                      />
                      <Field
                        wide
                        label="زیرنویس رسانه"
                        value={block.caption}
                        onChange={(value) =>
                          update(index, { ...block, caption: value })
                        }
                      />
                    </>
                  )}
                  {block.type === "cta" && (
                    <>
                      <Field
                        label="متن دکمه"
                        value={block.linkLabel}
                        onChange={(value) =>
                          update(index, { ...block, linkLabel: value })
                        }
                      />
                      <Field
                        label="لینک دکمه"
                        value={block.linkUrl}
                        onChange={(value) =>
                          update(index, { ...block, linkUrl: value })
                        }
                      />
                    </>
                  )}
                </Grid>
                <div className="block-style-tools">
                  <header>
                    <Layers3 size={18} />
                    <div>
                      <b>استایل اختصاصی این بخش</b>
                      <small>
                        مقادیر شفاف، رنگ‌های تم سراسری را حفظ می‌کنند.
                      </small>
                    </div>
                  </header>
                  <Grid>
                    <ColorField
                      label="پس‌زمینه"
                      value={
                        /^#[0-9a-f]{6}$/i.test(block.style.background)
                          ? block.style.background
                          : "#f4f8f8"
                      }
                      onChange={(background) =>
                        update(index, {
                          ...block,
                          style: { ...block.style, background },
                        })
                      }
                    />
                    <ColorField
                      label="رنگ متن"
                      value={
                        /^#[0-9a-f]{6}$/i.test(block.style.foreground)
                          ? block.style.foreground
                          : "#071a31"
                      }
                      onChange={(foreground) =>
                        update(index, {
                          ...block,
                          style: { ...block.style, foreground },
                        })
                      }
                    />
                    <ColorField
                      label="رنگ تأکیدی"
                      value={block.style.accent}
                      onChange={(accent) =>
                        update(index, {
                          ...block,
                          style: { ...block.style, accent },
                        })
                      }
                    />
                    <RangeField
                      label="گردی رسانه"
                      value={block.style.radius}
                      min={0}
                      max={80}
                      suffix="px"
                      onChange={(radius) =>
                        update(index, {
                          ...block,
                          style: { ...block.style, radius },
                        })
                      }
                    />
                    <RangeField
                      label="فاصله عمودی"
                      value={block.style.paddingY}
                      min={40}
                      max={180}
                      suffix="px"
                      onChange={(paddingY) =>
                        update(index, {
                          ...block,
                          style: { ...block.style, paddingY },
                        })
                      }
                    />
                    <RangeField
                      label="اندازه عنوان"
                      value={block.style.titleSize}
                      min={24}
                      max={80}
                      suffix="px"
                      onChange={(titleSize) =>
                        update(index, {
                          ...block,
                          style: { ...block.style, titleSize },
                        })
                      }
                    />
                    <RangeField
                      label="فاصله محتوا"
                      value={block.style.gap}
                      min={12}
                      max={96}
                      suffix="px"
                      onChange={(gap) =>
                        update(index, {
                          ...block,
                          style: { ...block.style, gap },
                        })
                      }
                    />
                    <div className="block-responsive-heading wide">
                      <Smartphone size={17} />
                      <div>
                        <b>تنظیم مستقل موبایل و تبلت</b>
                        <small>
                          این مقادیر فقط در نمایش کوچک جایگزین تنظیم دسکتاپ می‌شوند.
                        </small>
                      </div>
                    </div>
                    <RangeField
                      label="اندازه عنوان موبایل"
                      value={block.responsive.mobileTitleSize}
                      min={22}
                      max={58}
                      suffix="px"
                      onChange={(mobileTitleSize) =>
                        update(index, {
                          ...block,
                          responsive: {
                            ...block.responsive,
                            mobileTitleSize,
                          },
                        })
                      }
                    />
                    <RangeField
                      label="فاصله عمودی موبایل"
                      value={block.responsive.mobilePaddingY}
                      min={28}
                      max={120}
                      suffix="px"
                      onChange={(mobilePaddingY) =>
                        update(index, {
                          ...block,
                          responsive: {
                            ...block.responsive,
                            mobilePaddingY,
                          },
                        })
                      }
                    />
                    <RangeField
                      label="فاصله محتوا در موبایل"
                      value={block.responsive.mobileGap}
                      min={12}
                      max={64}
                      suffix="px"
                      onChange={(mobileGap) =>
                        update(index, {
                          ...block,
                          responsive: { ...block.responsive, mobileGap },
                        })
                      }
                    />
                    <button
                      type="button"
                      className={`admin-responsive-toggle${block.responsive.tabletStack ? " active" : ""}`}
                      onClick={() =>
                        update(index, {
                          ...block,
                          responsive: {
                            ...block.responsive,
                            tabletStack: !block.responsive.tabletStack,
                          },
                        })
                      }
                    >
                      <Tablet size={17} />
                      <span>
                        <b>چیدمان ستونی در تبلت</b>
                        <small>
                          {block.responsive.tabletStack ? "فعال" : "غیرفعال"}
                        </small>
                      </span>
                    </button>
                  </Grid>
                </div>
              </div>
            </details>
          ))}
        </div>
      </Panel>
    </>
  );
}

function CodeInjectionEditor({
  content,
  setContent,
}: {
  content: SiteContent;
  setContent: (value: SiteContent) => void;
}) {
  const [page, setPage] = useState<PageKey>("home");
  const updateGlobal = (next: InjectionCode) =>
    setContent({
      ...content,
      injections: { ...content.injections, global: next },
    });
  const updatePage = (next: InjectionCode) =>
    setContent({
      ...content,
      injections: {
        ...content.injections,
        pages: { ...content.injections.pages, [page]: next },
      },
    });
  const global = content.injections.global;
  const local = content.injections.pages[page];
  return (
    <>
      <div className="admin-code-warning">
        <ShieldCheck size={22} />
        <div>
          <b>دسترسی ویژه مدیر اصلی</b>
          <p>
            کد تزریقی می‌تواند ظاهر و رفتار کل سایت را تغییر دهد. ابتدا در
            پیش‌نمایش بررسی کنید و سپس ذخیره کنید.
          </p>
        </div>
      </div>
      <Panel title="کد سراسری سایت" text="این کد در تمام صفحات اجرا می‌شود.">
        <Grid>
          <CodeField
            label="CSS سراسری"
            value={global.css}
            onChange={(css) => updateGlobal({ ...global, css })}
            placeholder="/* custom CSS */"
          />
          <CodeField
            label="HTML انتهای صفحه"
            value={global.html}
            onChange={(html) => updateGlobal({ ...global, html })}
            placeholder="<!-- custom HTML -->"
          />
          <CodeField
            label="JavaScript سراسری"
            value={global.javascript}
            onChange={(javascript) => updateGlobal({ ...global, javascript })}
            placeholder="// custom JavaScript"
          />
        </Grid>
      </Panel>
      <Panel
        title="کد اختصاصی هر صفحه"
        text="یک صفحه انتخاب کنید؛ کد فقط همان‌جا فعال می‌شود."
      >
        <div className="admin-code-page">
          <label>
            <span>صفحه مقصد</span>
            <select
              value={page}
              onChange={(event) => setPage(event.target.value as PageKey)}
            >
              {Object.entries(builderPageLabels).map(([key, label]) => (
                <option value={key} key={key}>
                  {label}
                </option>
              ))}
            </select>
          </label>
        </div>
        <Grid>
          <CodeField
            label="CSS صفحه"
            value={local.css}
            onChange={(css) => updatePage({ ...local, css })}
            placeholder={`/* ${page} CSS */`}
          />
          <CodeField
            label="HTML صفحه"
            value={local.html}
            onChange={(html) => updatePage({ ...local, html })}
            placeholder="<!-- page HTML -->"
          />
          <CodeField
            label="JavaScript صفحه"
            value={local.javascript}
            onChange={(javascript) => updatePage({ ...local, javascript })}
            placeholder="// page JavaScript"
          />
        </Grid>
      </Panel>
    </>
  );
}

function AdvancedEditor({
  content,
  setContent,
}: {
  content: SiteContent;
  setContent: (value: SiteContent) => void;
}) {
  const [source, setSource] = useState(() => JSON.stringify(content, null, 2));
  const [message, setMessage] = useState("");
  const apply = () => {
    try {
      const parsed = JSON.parse(source) as SiteContent;
      if (!parsed.general || !parsed.home || !Array.isArray(parsed.products))
        throw new Error();
      setContent(parsed);
      setMessage(
        "ساختار اعمال شد؛ برای نهایی‌شدن دکمه ذخیره تغییرات را بزنید.",
      );
    } catch {
      setMessage("ساختار JSON معتبر نیست.");
    }
  };
  const download = () => {
    const blob = new Blob([JSON.stringify(content, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "clinoro-content.json";
    anchor.click();
    URL.revokeObjectURL(url);
  };
  return (
    <Panel
      title="کنترل کامل ساختار محتوا"
      text="برای بکاپ، انتقال یا تغییر گروهی تمام داده‌های سایت. اگر با JSON آشنا نیستید از بخش‌های معمولی پنل استفاده کنید."
    >
      <div className="advanced-toolbar">
        <button onClick={() => setSource(JSON.stringify(content, null, 2))}>
          <FileJson size={17} /> دریافت آخرین وضعیت
        </button>
        <button onClick={download}>
          <Download size={17} /> خروجی JSON
        </button>
        <label>
          <Upload size={17} /> ورود فایل JSON
          <input
            type="file"
            accept="application/json"
            onChange={async (event) => {
              const file = event.target.files?.[0];
              if (file) setSource(await file.text());
            }}
          />
        </label>
        <button className="primary" onClick={apply}>
          <Check size={17} /> اعمال در ویرایشگر
        </button>
      </div>
      <textarea
        className="advanced-json"
        dir="ltr"
        spellCheck={false}
        value={source}
        onChange={(event) => setSource(event.target.value)}
      />
      {message && <p className="admin-message">{message}</p>}
    </Panel>
  );
}

function AdminManager({
  admins,
  currentAdmin,
  form,
  setForm,
  busy,
  message,
  add,
  remove,
}: {
  admins: AdminMember[];
  currentAdmin: AdminMember;
  form: { username: string; email: string };
  setForm: (value: { username: string; email: string }) => void;
  busy: boolean;
  message: string;
  add: () => void;
  remove: (email: string) => void;
}) {
  return (
    <>
      <Panel
        title="افزودن مدیر جدید"
        text="مدیر جدید با حساب ChatGPT و همان ایمیل وارد می‌شود. نام کاربری برای نمایش داخل پنل است و پسوردی در سایت ذخیره نمی‌شود."
      >
        <div className="admin-invite">
          <label>
            <span>نام کاربری / نام نمایشی</span>
            <input
              value={form.username}
              onChange={(event) =>
                setForm({ ...form, username: event.target.value })
              }
              placeholder="مثلاً Sara Content"
            />
          </label>
          <label>
            <span>ایمیل مدیر</span>
            <input
              dir="ltr"
              value={form.email}
              onChange={(event) =>
                setForm({ ...form, email: event.target.value })
              }
              placeholder="name@example.com"
              type="email"
            />
          </label>
          <button
            disabled={busy || !form.email || !form.username}
            onClick={add}
          >
            {busy ? (
              <LoaderCircle className="spin" size={18} />
            ) : (
              <UserPlus size={18} />
            )}{" "}
            افزودن و فعال‌سازی
          </button>
        </div>
        {message && <p className="admin-message">{message}</p>}
        <div className="admin-permission-note">
          <ShieldCheck size={20} />
          <div>
            <b>تفکیک دسترسی امنیتی</b>
            <span>
              مدیران محتوا می‌توانند مطالب، محصولات، رسانه‌ها و RFQها را مدیریت
              کنند؛ افزودن مدیر، تزریق کد و تأیید مدارک فقط در اختیار مدیر اصلی
              است.
            </span>
          </div>
        </div>
      </Panel>
      <Panel title="مدیران فعال">
        <div className="admin-members">
          {admins.map((member) => (
            <article key={member.email}>
              <span>{member.username.slice(0, 1).toUpperCase()}</span>
              <div>
                <b>{member.username}</b>
                <small dir="ltr">{member.email}</small>
              </div>
              <em>{member.role === "owner" ? "مالک" : "مدیر محتوا"}</em>
              {member.role !== "owner" &&
                member.email !== currentAdmin.email && (
                  <button
                    disabled={busy}
                    onClick={() => remove(member.email)}
                    aria-label={`حذف ${member.username}`}
                  >
                    <Trash2 size={17} />
                  </button>
                )}
            </article>
          ))}
        </div>
      </Panel>
    </>
  );
}

function DraftPreview({
  content,
  page,
}: {
  content: SiteContent;
  page: PageKey;
}) {
  const design = content.design;
  const draftStyle = {
    "--preview-ink": design.colors.ink,
    "--preview-ink-2": design.colors.ink2,
    "--preview-blue": design.colors.blue,
    "--preview-cyan": design.colors.cyan,
    "--preview-surface": design.colors.surface,
    "--preview-muted": design.colors.muted,
    "--preview-radius": `${14 * design.radiusScale}px`,
    "--preview-blur": `${design.glassBlur}px`,
    "--preview-shadow": design.shadowDepth,
  } as CSSProperties;
  const pageIntro = page === "home" ? null : content.pages[page];
  const blocks = (content.customBlocks[page] || []).filter(
    (block) => block.visible !== false,
  );

  return (
    <div
      className={`preview-site preview-preset-${design.preset} preview-card-${design.cardStyle} preview-bg-${design.backgroundStyle} preview-button-${design.buttonStyle}`}
      style={draftStyle}
    >
      <nav className={`preview-site-nav preview-header-${design.headerStyle}`}>
        <Image
          src={content.general.logoUrl}
          width={150}
          height={38}
          unoptimized
          alt={content.general.logoAlt}
        />
        <span>محصولات · خدمات · راهکارها · تماس</span>
      </nav>

      {page === "home" ? (
        <>
          <section className="preview-home-hero">
            <Image
              src={content.home.heroImage}
              alt="پیش‌نمایش تصویر اصلی"
              fill
              unoptimized
              sizes="430px"
            />
            <div />
            <article>
              <small>{content.home.kicker}</small>
              <h2>
                {content.home.title} <em>{content.home.signals[0] || ""}</em>
              </h2>
              <p>{content.home.intro}</p>
              <button type="button">شروع استعلام</button>
            </article>
          </section>
          <section className="preview-story">
            <Image
              src={content.home.storyImage}
              alt="پیش‌نمایش داستان"
              width={120}
              height={100}
              unoptimized
            />
            <div>
              <small>CLINORO APPROACH</small>
              <h3>{content.home.storyTitle}</h3>
              <p>{content.home.storyText}</p>
            </div>
          </section>
          <section className="preview-decision-studio">
            <small>{content.home.decisionStudio.eyebrow}</small>
            <h3>{content.home.decisionStudio.title}</h3>
            <p>{content.home.decisionStudio.text}</p>
            <div>
              <span>01 · محیط درمانی</span>
              <span>02 · اولویت تصمیم</span>
              <span>03 · مرحله پروژه</span>
            </div>
          </section>
          <section className="preview-trust-protocol">
            <small>{content.home.trustProtocol.eyebrow}</small>
            <h3>{content.home.trustProtocol.title}</h3>
            <p>{content.home.trustProtocol.text}</p>
          </section>
          <div className="preview-card-grid">
            {content.home.categories.slice(0, 4).map((item) => (
              <article key={item.en}>
                <Image
                  src={item.image}
                  alt={item.title}
                  width={180}
                  height={80}
                  unoptimized
                />
                <small>{item.en}</small>
                <b>{item.title}</b>
              </article>
            ))}
          </div>
        </>
      ) : (
        <>
          <section className="preview-inner-hero">
            <Image
              src={pageIntro.image}
              alt={pageIntro.title}
              fill
              unoptimized
              sizes="430px"
            />
            <div />
            <article>
              <small>{pageIntro.eyebrow}</small>
              <h2>{pageIntro.title}</h2>
              <p>{pageIntro.text}</p>
            </article>
          </section>
          {page === "products" && (
            <div className="preview-card-grid">
              {content.products.slice(0, 4).map((item) => (
                <article key={item.slug}>
                  <Image
                    src={item.image}
                    alt={item.fa}
                    width={180}
                    height={80}
                    unoptimized
                  />
                  <small>{item.en}</small>
                  <b>{item.fa}</b>
                </article>
              ))}
            </div>
          )}
          {page === "services" && (
            <div className="preview-list">
              {content.services.slice(0, 4).map((item) => (
                <article key={item.en}>
                  <small>{item.en}</small>
                  <b>{item.title}</b>
                  <p>{item.text}</p>
                </article>
              ))}
            </div>
          )}
          {page === "solutions" && (
            <div className="preview-card-grid">
              {content.solutions.slice(0, 4).map((item) => (
                <article key={item.en}>
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={180}
                    height={80}
                    unoptimized
                  />
                  <small>{item.en}</small>
                  <b>{item.title}</b>
                </article>
              ))}
            </div>
          )}
          {page === "procurement" && (
            <div className="preview-list">
              {content.procurementSteps.slice(0, 4).map((item, index) => (
                <article key={item.title}>
                  <small>STEP 0{index + 1}</small>
                  <b>{item.title}</b>
                  <p>{item.text}</p>
                </article>
              ))}
            </div>
          )}
          {page === "about" && (
            <article className="preview-about">
              <h3>{content.about.headline}</h3>
              {content.about.paragraphs.slice(0, 2).map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </article>
          )}
          {page === "contact" && (
            <div className="preview-contact">
              <input placeholder="نام و نام خانوادگی" />
              <input placeholder="نام مرکز یا شرکت" />
              <textarea placeholder="شرح تجهیز یا پروژه" />
              <button type="button">ارسال درخواست</button>
            </div>
          )}
          {page === "blog" && (
            <div className="preview-blog">
              {content.blogPosts
                .filter((post) => post.published)
                .slice(0, 3)
                .map((post) => (
                  <article key={post.id}>
                    <Image
                      src={post.image}
                      alt={post.imageAlt || post.title}
                      width={300}
                      height={100}
                      unoptimized
                    />
                    <small>{post.category}</small>
                    <b>{post.title}</b>
                    <p>{post.excerpt}</p>
                  </article>
                ))}
            </div>
          )}
        </>
      )}

      {blocks.length > 0 && (
        <div className="preview-custom-blocks">
          {blocks.map((block) => (
            <article
              className={`theme-${block.theme} layout-${block.layout}`}
              key={block.id}
              style={{
                background:
                  block.style.background === "transparent"
                    ? undefined
                    : block.style.background,
                color: block.style.foreground || undefined,
              }}
            >
              {block.mediaUrl &&
                (block.type === "image" || block.type === "video") && (
                  <Image
                    src={
                      block.type === "image"
                        ? block.mediaUrl
                        : "/assets/medical-visual.jpg"
                    }
                    width={90}
                    height={65}
                    unoptimized
                    alt={block.caption || block.title}
                  />
                )}
              <div>
                <small>CUSTOM BLOCK</small>
                <h3>{block.title}</h3>
                <p>{block.text}</p>
              </div>
            </article>
          ))}
        </div>
      )}
      <footer>{content.general.tagline}</footer>
    </div>
  );
}

function LivePreview({
  content,
  page,
  setPage,
  device,
  setDevice,
  mode,
  setMode,
  revision,
}: {
  content: SiteContent;
  page: PageKey;
  setPage: (page: PageKey) => void;
  device: "desktop" | "tablet" | "mobile";
  setDevice: (device: "desktop" | "tablet" | "mobile") => void;
  mode: "draft" | "live";
  setMode: (mode: "draft" | "live") => void;
  revision: number;
}) {
  const source = `${previewPaths[page]}?cms-preview=1&revision=${revision}`;
  return (
    <aside className="admin-preview">
      <header>
        <div>
          <span>
            <i /> {mode === "draft" ? "پیش‌نمایش زنده ادیت" : "نسخه عمومی"}
          </span>
          <small>
            {mode === "draft"
              ? "تغییرات ذخیره‌نشده همین لحظه"
              : "آخرین نسخه ذخیره‌شده سایت"}
          </small>
        </div>
        <div className="preview-devices">
          <button
            className={device === "desktop" ? "active" : ""}
            onClick={() => setDevice("desktop")}
            aria-label="نمای دسکتاپ"
            type="button"
          >
            <Monitor size={16} />
          </button>
          <button
            className={device === "tablet" ? "active" : ""}
            onClick={() => setDevice("tablet")}
            aria-label="نمای تبلت"
            type="button"
          >
            <Tablet size={16} />
          </button>
          <button
            className={device === "mobile" ? "active" : ""}
            onClick={() => setDevice("mobile")}
            aria-label="نمای موبایل"
            type="button"
          >
            <Smartphone size={16} />
          </button>
        </div>
      </header>
      <div className="preview-page-select">
        <select
          value={page}
          onChange={(event) => setPage(event.target.value as PageKey)}
        >
          {Object.entries(builderPageLabels).map(([key, label]) => (
            <option value={key} key={key}>
              {label}
            </option>
          ))}
        </select>
        <a href={previewPaths[page]} target="_blank" rel="noreferrer">
          <Eye size={15} /> بازکردن
        </a>
      </div>
      <div className="preview-mode-toggle">
        <button
          type="button"
          className={mode === "draft" ? "active" : ""}
          onClick={() => setMode("draft")}
        >
          <Sparkles size={14} /> ادیت زنده
        </button>
        <button
          type="button"
          className={mode === "live" ? "active" : ""}
          onClick={() => setMode("live")}
        >
          <Eye size={14} /> سایت ذخیره‌شده
        </button>
      </div>
      <p className="preview-hint">
        {mode === "draft"
          ? "رنگ، فونت، محتوا و چیدمان پیش از ذخیره قابل بررسی‌اند."
          : "این نما دقیقاً آخرین وضعیت ذخیره‌شده را نمایش می‌دهد."}
      </p>
      <div className={`preview-stage ${device}`}>
        <div className="preview-browser">
          <div className="preview-browser-bar">
            <i />
            <i />
            <i />
          </div>
          {mode === "draft" ? (
            <DraftPreview content={content} page={page} />
          ) : (
            <iframe
              key={source}
              src={source}
              title={`پیش‌نمایش واقعی ${builderPageLabels[page]}`}
              loading="eager"
            />
          )}
        </div>
      </div>
    </aside>
  );
}
