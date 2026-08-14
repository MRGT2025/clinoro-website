import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, PlayCircle } from "lucide-react";
import type { CSSProperties } from "react";
import type { ContentBlock } from "../lib/site-content";

export function CustomContentBlocks({ blocks }: { blocks: ContentBlock[] }) {
  const visibleBlocks = blocks.filter((block) => block.visible !== false);
  if (!visibleBlocks.length) return null;
  return (
    <div className="cms-public-blocks">
      {visibleBlocks.map((block, index) => {
        const style = block.style;
        const blockStyle = {
          "--block-bg": style?.background || "transparent",
          "--block-fg": style?.foreground || "",
          "--block-accent": style?.accent || "var(--cobalt)",
          "--block-radius": `${style?.radius ?? 34}px`,
          "--block-padding": `${style?.paddingY ?? 100}px`,
          "--block-title-size": `${style?.titleSize ?? 52}px`,
          "--block-gap": `${style?.gap ?? 70}px`,
          "--block-mobile-title-size": `${block.responsive?.mobileTitleSize ?? 36}px`,
          "--block-mobile-padding": `${block.responsive?.mobilePaddingY ?? 64}px`,
          "--block-mobile-gap": `${block.responsive?.mobileGap ?? 28}px`,
        } as CSSProperties;
        return (
          <section
            id={`content-${block.id}`}
            style={blockStyle}
            className={[
              "cms-public-block",
              `cms-theme-${block.theme}`,
              `cms-type-${block.type}`,
              `cms-layout-${block.layout || "split"}`,
              `cms-width-${block.width || "standard"}`,
              `cms-media-${block.mediaSide || "start"}`,
              `cms-align-${block.textAlign || "start"}`,
              `cms-aspect-${block.mediaAspect || "wide"}`,
              `cms-motion-${block.motion || "reveal"}`,
              `cms-columns-${block.columns || 1}`,
              block.responsive?.tabletStack ? "cms-tablet-stack" : "",
              block.hideOnDesktop ? "cms-hide-desktop" : "",
              block.hideOnMobile ? "cms-hide-mobile" : "",
              style?.background && style.background !== "transparent"
                ? "cms-custom-bg"
                : "",
              style?.foreground ? "cms-custom-fg" : "",
            ]
              .filter(Boolean)
              .join(" ")}
            key={block.id || index}
          >
            <div className="site-wrap cms-public-inner">
              {(block.type === "image" || block.type === "video") &&
                block.mediaUrl && (
                  <div className="cms-public-media prism-edge">
                    {block.type === "video" ? (
                      <video
                        controls
                        playsInline
                        preload="metadata"
                        src={block.mediaUrl}
                      />
                    ) : (
                      <Image
                        src={block.mediaUrl}
                        alt={block.caption || block.title || "محتوای Clinoro"}
                        fill
                        unoptimized
                        sizes="(max-width:900px) 100vw,50vw"
                      />
                    )}
                    {block.type === "video" && (
                      <span className="cms-video-mark">
                        <PlayCircle size={24} /> VIDEO
                      </span>
                    )}
                  </div>
                )}
              <div className="cms-public-copy">
                <small>CLINORO / {String(index + 1).padStart(2, "0")}</small>
                {block.title && <h2>{block.title}</h2>}
                {block.text && (
                  <div className="cms-public-text">
                    {block.text
                      .split("\n")
                      .filter(Boolean)
                      .map((line, lineIndex) => (
                        <p key={lineIndex}>{line}</p>
                      ))}
                  </div>
                )}
                {block.caption && (
                  <span className="cms-public-caption">{block.caption}</span>
                )}
                {block.linkLabel && block.linkUrl && (
                  <Link className="button button-primary" href={block.linkUrl}>
                    {block.linkLabel}
                    <ArrowLeft size={18} />
                  </Link>
                )}
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
