"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import type { SiteContent } from "../lib/site-content";

const INTRO_KEY="clinoro-brand-intro-v1";

export function BrandIntro({motionMode}:{motionMode:SiteContent["general"]["motionMode"]}){
  const [visible,setVisible]=useState(true);
  const finish=useCallback(()=>{
    try{window.sessionStorage.setItem(INTRO_KEY,"seen");}catch{}
    document.documentElement.dataset.clinoroIntro="seen";
    document.documentElement.classList.remove("clinoro-intro-active");
    setVisible(false);
  },[]);

  useEffect(()=>{
    let alreadySeen=false;
    try{alreadySeen=window.sessionStorage.getItem(INTRO_KEY)==="seen";}catch{}
    const reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches||motionMode==="reduced";
    if(alreadySeen||reduced){const timer=window.setTimeout(finish,0);return()=>window.clearTimeout(timer);}
    document.documentElement.classList.add("clinoro-intro-active");
    const timer=window.setTimeout(finish,3300);
    return()=>{window.clearTimeout(timer);document.documentElement.classList.remove("clinoro-intro-active");};
  },[finish,motionMode]);

  if(!visible)return null;
  return <div className="brand-intro" role="dialog" aria-modal="true" aria-label="Clinoro brand introduction · معرفی برند Clinoro">
    <div className="brand-intro-grid" aria-hidden="true"/>
    <div className="brand-intro-glow" aria-hidden="true"/>
    <div className="brand-intro-orbit orbit-outer" aria-hidden="true"><i/><i/><i/></div>
    <div className="brand-intro-orbit orbit-inner" aria-hidden="true"/>
    <div className="brand-intro-stage">
      <span className="brand-intro-overline">MEDICAL TECHNOLOGIES · GLOBAL COMMERCE</span>
      <div className="brand-intro-mark" aria-hidden="true"><span/></div>
      <div className="brand-intro-wordmark"><Image src="/assets/clinoro-wordmark-primary.png" alt="Clinoro" width={900} height={100} priority unoptimized/></div>
      <div className="brand-intro-pulse" aria-hidden="true"><i/><b/><i/></div>
      <p>PRECISION <em/> MEDICAL TECHNOLOGY <em/> COMMERCE</p>
    </div>
    <button type="button" className="brand-intro-skip" onClick={finish}>ENTER SITE · ورود</button>
    <span className="brand-intro-index" aria-hidden="true">CLINORO / 01</span>
  </div>;
}
