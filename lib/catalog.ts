export type ProductKind = "equipment" | "consumable";

export type ProductCategory = {
  id: string;
  fa: string;
  en: string;
  summary: string;
  summaryEn: string;
  image: string;
  parentId: string;
  order: number;
};

export type CatalogProductInput = {
  slug?: string;
  cat?: string;
  subcategory?: string;
  productType?: string;
  tag?: string;
  fa?: string;
  en?: string;
  summary?: string;
  seoDescription?: string;
  seoDescriptionEn?: string;
  brand?: string;
  model?: string;
  availability?: string;
  intendedUse?: string;
  specs?: string[];
  technicalSpecs?: { label?: string; value?: string }[];
  services?: string[];
  documents?: { title?: string; url?: string; type?: string }[];
  image?: string;
  imageCredit?: string;
  imageSource?: string;
  imageLicense?: string;
  procurement?: {
    evidenceLevel?: "category" | "model" | "verified";
    leadTime?: string;
    warranty?: string;
    serviceResponse?: string;
    infrastructure?: string[];
    consumables?: string[];
    training?: string[];
    acceptance?: string[];
    lifecycle?: string[];
    tcoFactors?: string[];
  };
  international?: {
    summary?: string;
    intendedUse?: string;
    specs?: string[];
    services?: string[];
    seoDescription?: string;
    procurement?: {
      leadTime?: string;
      warranty?: string;
      serviceResponse?: string;
      infrastructure?: string[];
      consumables?: string[];
      training?: string[];
      acceptance?: string[];
      lifecycle?: string[];
      tcoFactors?: string[];
    };
  };
};

const PLACEHOLDER_LINES = new Set([
  "نیازهای زیرساختی را ثبت کنید",
  "مصرفی و اکسسوری را ثبت کنید",
  "آموزش کاربر",
  "آزمون پذیرش",
  "برنامه PM و خدمات",
  "قیمت خرید",
  "خدمات",
  "مصرفی",
  "ویژگی اول",
  "مشاوره و انتخاب",
  "کاربرد محصول را بنویسید",
  "معرفی کوتاه محصول",
  "Record project infrastructure requirements",
  "Record compatible consumables and accessories",
  "User training",
  "Acceptance testing",
  "Preventive maintenance and service plan",
  "Acquisition",
  "Service",
  "Consumables",
  "Configuration to be confirmed",
  "Technical consultation",
  "Product overview pending verified model data.",
  "Intended use must be confirmed for the selected model.",
]);

export const PEPTIDES_META_FA =
  "پپتید بیومیمتیک TOSKANI مدل HCPR برای احیای مو در کلینیک؛ تحریک فولیکول، کاهش ریزش و بهبود تراکم.";
export const PEPTIDES_META_EN =
  "TOSKANI HCPR biomimetic peptides for professional clinic hair restoration, follicle support, less shedding and improved density.";

export const defaultProductCategories: ProductCategory[] = [
  {
    id: "critical",
    fa: "مراقبت ویژه",
    en: "Critical Care",
    summary: "پایش و تجهیزات حیاتی برای مراقبت ویژه، اورژانس و ریکاوری.",
    summaryEn: "Monitoring and life-support equipment for intensive care, emergency and recovery.",
    image: "/assets/patient-monitor.jpg",
    parentId: "",
    order: 1,
  },
  {
    id: "imaging",
    fa: "تصویربرداری",
    en: "Imaging",
    summary: "سامانه‌های تصویربرداری تشخیصی با انتخاب پروب، اتصال و ظرفیت مرکز.",
    summaryEn: "Diagnostic imaging systems selected around probes, connectivity and facility capacity.",
    image: "/assets/ultrasound.jpg",
    parentId: "",
    order: 2,
  },
  {
    id: "lab",
    fa: "آزمایشگاه",
    en: "Laboratory",
    summary: "آنالایزرها و گردش کار آزمایشگاه، متناسب با حجم نمونه و اتصال LIS.",
    summaryEn: "Laboratory analyzers sized around sample volume, reagents and LIS connectivity.",
    image: "/assets/hematology.jpg",
    parentId: "",
    order: 3,
  },
  {
    id: "surgery",
    fa: "اتاق عمل",
    en: "Operating Room",
    summary: "بیهوشی، نور جراحی و زیرساخت اتاق عمل در یک مسیر خرید مشخص.",
    summaryEn: "Anesthesia, surgical lighting and operating-room infrastructure on one buying path.",
    image: "/assets/anesthesia.jpg",
    parentId: "",
    order: 4,
  },
  {
    id: "sterile",
    fa: "استریل",
    en: "Sterile Processing",
    summary: "استریلیزاسیون و زنجیره استریل برای کلینیک و CSSD.",
    summaryEn: "Sterilization systems for clinics and central sterile services.",
    image: "/assets/autoclave.jpg",
    parentId: "",
    order: 5,
  },
  {
    id: "aesthetics",
    fa: "زیبایی و پوست",
    en: "Aesthetics & Skin",
    summary: "محصولات مصرفی زیبایی و پوست. هر زیرگروه صفحه جدا دارد تا کاتالوگ یک فهرست طولانی نشود.",
    summaryEn: "Aesthetic and skin consumables. Each subgroup has its own page, so the range is not one long list.",
    image: "/assets/medical-visual.jpg",
    parentId: "",
    order: 6,
  },
  {
    id: "cocktails",
    fa: "کوکتل‌های مزوتراپی",
    en: "Mesotherapy cocktails",
    summary: "کوکتل‌های مزوتراپی برای پروتکل‌های پوست و مو در کلینیک.",
    summaryEn: "Mesotherapy cocktails for clinic skin and hair protocols.",
    image: "",
    parentId: "aesthetics",
    order: 1,
  },
  {
    id: "peptides",
    fa: "پپتیدها",
    en: "Peptides",
    summary: "پپتیدهای بیومیمتیک برای پروتکل‌های پوست و مو.",
    summaryEn: "Biomimetic peptides for skin and hair protocols.",
    image: "",
    parentId: "aesthetics",
    order: 2,
  },
  {
    id: "threads",
    fa: "نخ و لیفت",
    en: "Threads & lift",
    summary: "نخ و محصولات لیفت برای پروتکل‌های زیبایی.",
    summaryEn: "Threads and lift products for aesthetic protocols.",
    image: "",
    parentId: "aesthetics",
    order: 3,
  },
  {
    id: "fillers",
    fa: "فیلر",
    en: "Fillers",
    summary: "فیلر و محصولات حجم‌دهنده برای کاربرد زیبایی.",
    summaryEn: "Fillers and volumizing products for aesthetic use.",
    image: "",
    parentId: "aesthetics",
    order: 4,
  },
];

const byOrder = (a: ProductCategory, b: ProductCategory) =>
  a.order - b.order || a.id.localeCompare(b.id);

export function categorySlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, " ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

export function categoryPath(id: string, locale: "fa" | "en" = "fa") {
  return locale === "en" ? `/en/products/category/${id}` : `/products/category/${id}`;
}

export function topLevelCategories(categories: ProductCategory[]) {
  return categories.filter((category) => !category.parentId).sort(byOrder);
}

export function childCategories(categories: ProductCategory[], parentId: string) {
  return categories.filter((category) => category.parentId === parentId).sort(byOrder);
}

export function isPublicCatalogPath(pathname: string) {
  return /^\/(?:en\/)?products(?:\/(?:category\/[a-z0-9-]+|[a-z0-9-]+))?$/.test(pathname);
}

export function isCatalogDocumentRequest(method: string, pathname: string, headers: Headers) {
  if (method !== "GET" || !isPublicCatalogPath(pathname)) return false;
  if (headers.get("rsc") === "1") return false;
  if (
    headers.has("next-router-prefetch") ||
    headers.has("next-router-segment-prefetch") ||
    headers.has("next-url")
  ) {
    return false;
  }
  return (headers.get("accept") || "").includes("text/html");
}

function normalizeCategory(value: unknown): ProductCategory | null {
  if (!value || typeof value !== "object") return null;
  const item = value as Partial<ProductCategory>;
  const id = categorySlug(String(item.id || ""));
  if (!id || id === "all") return null;
  const order = Number(item.order);
  return {
    id,
    fa: String(item.fa || id).trim() || id,
    en: String(item.en || id).trim() || id,
    summary: String(item.summary || "").trim(),
    summaryEn: String(item.summaryEn || "").trim(),
    image: String(item.image || "").trim(),
    parentId: categorySlug(String(item.parentId || "")),
    order: Number.isFinite(order) ? order : 100,
  };
}

export function mergeProductCategories(base: ProductCategory[], saved: unknown): ProductCategory[] {
  const incoming = Array.isArray(saved) ? saved : null;
  if (!incoming?.length) return base.map((category) => ({ ...category }));
  const map = new Map(base.map((category) => [category.id, { ...category }]));
  for (const raw of incoming) {
    const next = normalizeCategory(raw);
    if (!next) continue;
    const previous = map.get(next.id);
    map.set(next.id, previous ? { ...previous, ...next, id: next.id } : next);
  }
  const list = [...map.values()];
  const byId = new Map(list.map((category) => [category.id, category]));
  return list
    .map((category) => {
      const parent = byId.get(category.parentId);
      if (!parent || parent.id === category.id || parent.parentId) return { ...category, parentId: "" };
      return category;
    })
    .sort(byOrder);
}

function isAestheticAlias(value: string) {
  const key = value.trim().toLowerCase().replace(/&/g, " and ").replace(/[_-]+/g, " ").replace(/\s+/g, " ");
  return (
    key === "aesthetic" ||
    key === "aesthetics" ||
    key === "aesthetic medicine" ||
    key === "aesthetics and skin" ||
    key === "زیبایی" ||
    key === "زیبایی و پوست"
  );
}

function inferAestheticSubcategory(product: CatalogProductInput) {
  const slug = (product.slug || "").toLowerCase();
  if (slug.includes("peptide")) return "peptides";
  if (slug.includes("cocktail") || slug.includes("meso")) return "cocktails";
  if (slug.includes("thread") || slug.includes("lift")) return "threads";
  if (slug.includes("filler")) return "fillers";
  const text = `${product.en || ""} ${product.fa || ""}`.toLowerCase();
  if (text.includes("peptide") || text.includes("پپتید")) return "peptides";
  if (text.includes("cocktail") || text.includes("کوکتل") || text.includes("مزوتراپی") || text.includes("mesotherap")) return "cocktails";
  if (text.includes("thread") || text.includes("لیفت") || /(^|\s)نخ(\s|$)/.test(product.fa || "")) return "threads";
  if (text.includes("filler") || text.includes("فیلر")) return "fillers";
  return "";
}

export function cleanName(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function preferMeta(current: string | undefined, fallback: string) {
  const raw = current || "";
  const clean = raw.replace(/\s+/g, " ").trim();
  if (clean && clean.length <= 200 && !/[\r\n]/.test(raw)) return clean;
  return fallback;
}

function clipMeta(text: string, max = 180) {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  const space = cut.lastIndexOf(" ");
  return `${(space > 80 ? cut.slice(0, space) : cut).trim()}…`;
}

export function classifyProduct<T extends CatalogProductInput>(
  product: T,
  categories: ProductCategory[],
  typeExplicit = false,
): T & {
  cat: string;
  subcategory: string;
  productType: ProductKind;
  fa: string;
  en: string;
  seoDescription: string;
  seoDescriptionEn: string;
} {
  const originalCat = (product.cat || "").trim();
  let cat = originalCat;
  let subcategory = (product.subcategory || "").trim();
  const child = categories.find((category) => category.id === cat && category.parentId);
  if (child) {
    subcategory = subcategory || cat;
    cat = child.parentId;
  }
  const aesthetic =
    isAestheticAlias(originalCat) ||
    isAestheticAlias(product.tag || "") ||
    isAestheticAlias(subcategory) ||
    cat === "aesthetics" ||
    categories.some((category) => category.parentId === "aesthetics" && (category.id === subcategory || category.id === originalCat));
  if (aesthetic) cat = "aesthetics";
  const knownChild = categories.some((category) => category.parentId === cat && category.id === subcategory);
  if (cat === "aesthetics" && !knownChild) {
    const inferred = inferAestheticSubcategory(product);
    if (categories.some((category) => category.id === inferred && category.parentId === "aesthetics")) subcategory = inferred;
    else if (!knownChild) subcategory = "";
  }
  if (cat !== "aesthetics" && !categories.some((category) => category.id === subcategory && category.parentId === cat)) {
    subcategory = categories.some((category) => category.id === subcategory && category.parentId === cat) ? subcategory : "";
  }
  let productType: ProductKind = product.productType === "consumable" ? "consumable" : "equipment";
  if (typeExplicit) productType = product.productType === "consumable" ? "consumable" : "equipment";
  else if (cat === "aesthetics") productType = "consumable";
  const fa = cleanName(product.fa || "");
  const en = cleanName(product.en || "");
  return {
    ...product,
    cat,
    subcategory,
    productType,
    fa,
    en,
    seoDescription: product.slug === "peptides" ? preferMeta(product.seoDescription, PEPTIDES_META_FA) : (product.seoDescription || "").replace(/\s+/g, " ").trim(),
    seoDescriptionEn: product.slug === "peptides" ? preferMeta(product.seoDescriptionEn, PEPTIDES_META_EN) : (product.seoDescriptionEn || "").replace(/\s+/g, " ").trim(),
  };
}

export function linesOf(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.map((item) => String(item ?? "").trim()).filter(Boolean);
}

export function visibleLines(value: unknown) {
  return linesOf(value).filter((line) => !PLACEHOLDER_LINES.has(line.replace(/\s+/g, " ").trim()));
}

export function visibleText(value: unknown) {
  const text = String(value ?? "").replace(/\s+/g, " ").trim();
  if (!text || PLACEHOLDER_LINES.has(text)) return "";
  return text;
}

export function bodyText(value: unknown) {
  const text = String(value ?? "").replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
  if (!text || PLACEHOLDER_LINES.has(text.replace(/\s+/g, " ").trim())) return "";
  return text;
}

export function productMetaDescription(product: CatalogProductInput, locale: "fa" | "en") {
  const explicit = locale === "fa" ? product.seoDescription : product.seoDescriptionEn;
  const cleanExplicit = (explicit || "").replace(/\s+/g, " ").trim();
  if (cleanExplicit) return clipMeta(cleanExplicit);
  if (product.slug === "peptides") return locale === "fa" ? PEPTIDES_META_FA : PEPTIDES_META_EN;
  const summary = locale === "fa" ? product.summary : product.international?.summary;
  return clipMeta((summary || "").replace(/\s+/g, " ").trim());
}

export function productMatchesCategory(product: CatalogProductInput, categories: ProductCategory[], id: string) {
  if (id === "all") return true;
  const category = categories.find((item) => item.id === id);
  if (!category) return product.cat === id;
  if (category.parentId) return product.subcategory === id || product.cat === id;
  const childIds = new Set(childCategories(categories, id).map((item) => item.id));
  return product.cat === id || childIds.has(product.subcategory || "") || childIds.has(product.cat || "");
}

export function productsForCategoryPage<T extends CatalogProductInput>(products: T[], categories: ProductCategory[], id: string) {
  const category = categories.find((item) => item.id === id);
  if (!category) return [];
  if (category.parentId) return products.filter((product) => product.subcategory === id || product.cat === id);
  const children = childCategories(categories, id);
  if (!children.length) return products.filter((product) => product.cat === id);
  return products.filter((product) => product.cat === id && !product.subcategory);
}

export function categoryImage(category: ProductCategory, categories: ProductCategory[], products: CatalogProductInput[]) {
  if (category.image) return category.image;
  const listed = productsForCategoryPage(products, categories, category.id);
  if (listed[0]?.image) return listed[0].image || "";
  const parent = categories.find((item) => item.id === category.parentId);
  return parent?.image || "/assets/medical-visual.jpg";
}

type ProcurementBlock = NonNullable<CatalogProductInput["procurement"]>;

export type PublicProductView = {
  consumable: boolean;
  fa: string;
  en: string;
  tag: string;
  summary: string;
  summaryEn: string;
  brand: string;
  model: string;
  availability: string;
  intendedUse: string;
  intendedUseEn: string;
  specs: string[];
  specsEn: string[];
  services: string[];
  servicesEn: string[];
  technicalSpecs: { label: string; value: string }[];
  documents: { title: string; url: string; type: string }[];
  evidenceLevel: "category" | "model" | "verified";
  leadTime: string;
  leadTimeEn: string;
  warranty: string;
  warrantyEn: string;
  sla: string;
  slaEn: string;
  infrastructure: string[];
  infrastructureEn: string[];
  consumableNotes: string[];
  consumableNotesEn: string[];
  training: string[];
  trainingEn: string[];
  acceptance: string[];
  acceptanceEn: string[];
  lifecycle: string[];
  lifecycleEn: string[];
  tco: string[];
  tcoEn: string[];
  showIntended: boolean;
  showTechnical: boolean;
  showSpecs: boolean;
  showServices: boolean;
  showDocuments: boolean;
  showDecisionPack: boolean;
  showIntelligence: boolean;
  showReadiness: boolean;
  showImageCredit: boolean;
  metaDescriptionFa: string;
  metaDescriptionEn: string;
};

function procurementOf(product: CatalogProductInput): ProcurementBlock {
  return product.procurement || {};
}

export function publicProductView(product: CatalogProductInput): PublicProductView {
  const consumable = product.productType === "consumable";
  const procurement = procurementOf(product);
  const english = product.international?.procurement || {};
  const infrastructure = consumable ? [] : visibleLines(procurement.infrastructure);
  const infrastructureEn = consumable ? [] : visibleLines(english.infrastructure);
  const consumableNotes = visibleLines(procurement.consumables);
  const consumableNotesEn = visibleLines(english.consumables);
  const training = consumable ? [] : visibleLines(procurement.training);
  const trainingEn = consumable ? [] : visibleLines(english.training);
  const acceptance = consumable ? [] : visibleLines(procurement.acceptance);
  const acceptanceEn = consumable ? [] : visibleLines(english.acceptance);
  const lifecycle = consumable ? [] : visibleLines(procurement.lifecycle);
  const lifecycleEn = consumable ? [] : visibleLines(english.lifecycle);
  const tco = consumable ? [] : visibleLines(procurement.tcoFactors);
  const tcoEn = consumable ? [] : visibleLines(english.tcoFactors);
  const warranty = consumable ? "" : visibleText(procurement.warranty);
  const warrantyEn = consumable ? "" : visibleText(english.warranty);
  const sla = consumable ? "" : visibleText(procurement.serviceResponse);
  const slaEn = consumable ? "" : visibleText(english.serviceResponse);
  const genericLeadTimes = new Set([
    "در پیشنهاد همان پروژه تأیید می‌شود",
    "Confirmed in the project-specific proposal",
  ]);
  const leadFa = visibleText(procurement.leadTime);
  const leadEn = visibleText(english.leadTime);
  const leadTime = consumable && genericLeadTimes.has(leadFa) ? "" : leadFa;
  const leadTimeEn = consumable && genericLeadTimes.has(leadEn) ? "" : leadEn;
  const intendedUse = bodyText(product.intendedUse);
  const intendedUseEn = bodyText(product.international?.intendedUse);
  const specs = visibleLines(product.specs);
  const specsEn = visibleLines(product.international?.specs);
  const services = visibleLines(product.services);
  const servicesEn = visibleLines(product.international?.services);
  const technicalSpecs = (product.technicalSpecs || [])
    .map((spec) => ({ label: (spec.label || "").trim(), value: (spec.value || "").trim() }))
    .filter((spec) => spec.label || spec.value);
  const documents = (product.documents || [])
    .map((document) => ({
      title: (document.title || "").trim(),
      url: (document.url || "").trim(),
      type: (document.type || "").trim() || "PDF",
    }))
    .filter((document) => document.title && document.url);
  const evidenceLevel = procurement.evidenceLevel || "category";
  const showDecisionPack =
    !consumable &&
    Boolean(intendedUse || infrastructure.length || consumableNotes.length || training.length || acceptance.length || lifecycle.length);
  const showIntelligence = consumable
    ? Boolean(leadTime || evidenceLevel === "model" || evidenceLevel === "verified")
    : Boolean(evidenceLevel || leadTime || warranty || sla);
  return {
    consumable,
    fa: cleanName(product.fa || ""),
    en: cleanName(product.en || ""),
    tag: (product.tag || "").trim(),
    summary: bodyText(product.summary),
    summaryEn: bodyText(product.international?.summary),
    brand: visibleText(product.brand),
    model: visibleText(product.model),
    availability: visibleText(product.availability),
    intendedUse,
    intendedUseEn,
    specs,
    specsEn,
    services,
    servicesEn,
    technicalSpecs,
    documents,
    evidenceLevel,
    leadTime,
    leadTimeEn,
    warranty,
    warrantyEn,
    sla,
    slaEn,
    infrastructure,
    infrastructureEn,
    consumableNotes,
    consumableNotesEn,
    training,
    trainingEn,
    acceptance,
    acceptanceEn,
    lifecycle,
    lifecycleEn,
    tco,
    tcoEn,
    showIntended: Boolean(intendedUse),
    showTechnical: technicalSpecs.length > 0,
    showSpecs: specs.length > 0,
    showServices: services.length > 0,
    showDocuments: documents.length > 0,
    showDecisionPack,
    showIntelligence,
    showReadiness: !consumable,
    showImageCredit: Boolean((product.imageCredit || "").trim() || (product.imageSource || "").trim()),
    metaDescriptionFa: productMetaDescription(product, "fa"),
    metaDescriptionEn: productMetaDescription(product, "en"),
  };
}

type StoredProcurement = {
  leadTime: string;
  warranty: string;
  serviceResponse: string;
  infrastructure: string[];
  consumables: string[];
  training: string[];
  acceptance: string[];
  lifecycle: string[];
  tcoFactors: string[];
};

export function asConsumableProduct<T extends { procurement: StoredProcurement & { evidenceLevel?: "category" | "model" | "verified" }; international: { procurement: StoredProcurement } }>(item: T): T & { productType: "consumable" } {
  const cleanList = (lines: string[]) => lines.map((line) => line.trim()).filter((line) => line && !PLACEHOLDER_LINES.has(line));
  const cleanValue = (value: string, blocked: string[]) => (blocked.includes(value.trim()) ? "" : value);
  return {
    ...item,
    productType: "consumable",
    procurement: {
      ...item.procurement,
      leadTime: cleanValue(item.procurement.leadTime, ["در پیشنهاد همان پروژه تأیید می‌شود"]),
      warranty: cleanValue(item.procurement.warranty, ["بر اساس برند و مدل منتخب"]),
      serviceResponse: cleanValue(item.procurement.serviceResponse, ["در SLA پیشنهاد فنی تعریف می‌شود"]),
      infrastructure: cleanList(item.procurement.infrastructure),
      consumables: cleanList(item.procurement.consumables),
      training: cleanList(item.procurement.training),
      acceptance: cleanList(item.procurement.acceptance),
      lifecycle: cleanList(item.procurement.lifecycle),
      tcoFactors: cleanList(item.procurement.tcoFactors),
    },
    international: {
      ...item.international,
      procurement: {
        ...item.international.procurement,
        leadTime: cleanValue(item.international.procurement.leadTime, ["Confirmed in the project-specific proposal"]),
        warranty: cleanValue(item.international.procurement.warranty, ["Defined for the selected brand, model and service scope"]),
        serviceResponse: cleanValue(item.international.procurement.serviceResponse, ["Defined in the project SLA"]),
        infrastructure: cleanList(item.international.procurement.infrastructure),
        consumables: cleanList(item.international.procurement.consumables),
        training: cleanList(item.international.procurement.training),
        acceptance: cleanList(item.international.procurement.acceptance),
        lifecycle: cleanList(item.international.procurement.lifecycle),
        tcoFactors: cleanList(item.international.procurement.tcoFactors),
      },
    },
  };
}
