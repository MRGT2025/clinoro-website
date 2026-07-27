import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, PlayCircle } from "lucide-react";
import type { ContentBlock } from "../lib/site-content";

export function CustomContentBlocks({blocks}:{blocks:ContentBlock[]}){
  if(!blocks.length) return null;
  return <div className="cms-public-blocks">{blocks.map((block,index)=><section className={`cms-public-block cms-theme-${block.theme} cms-type-${block.type}`} key={block.id||index}>
    <div className="site-wrap cms-public-inner">
      {(block.type==="image"||block.type==="video")&&block.mediaUrl&&<div className="cms-public-media prism-edge">
        {block.type==="video"?<video controls playsInline preload="metadata" src={block.mediaUrl}/>:<Image src={block.mediaUrl} alt={block.caption||block.title||"محتوای Clinoro"} fill unoptimized sizes="(max-width:900px) 100vw,50vw"/>}
        {block.type==="video"&&<span className="cms-video-mark"><PlayCircle size={24}/> VIDEO</span>}
      </div>}
      <div className="cms-public-copy">
        <small>CLINORO / {String(index+1).padStart(2,"0")}</small>
        {block.title&&<h2>{block.title}</h2>}
        {block.text&&<div className="cms-public-text">{block.text.split("\n").filter(Boolean).map((line,lineIndex)=><p key={lineIndex}>{line}</p>)}</div>}
        {block.caption&&<span className="cms-public-caption">{block.caption}</span>}
        {block.linkLabel&&block.linkUrl&&<Link className="button button-primary" href={block.linkUrl}>{block.linkLabel}<ArrowLeft size={18}/></Link>}
      </div>
    </div>
  </section>)}</div>;
}
