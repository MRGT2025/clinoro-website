import type { PageKey, SiteContent } from "../lib/site-content";

export function InjectionLayer({content,page}:{content:SiteContent;page:PageKey}){
  const global=content.injections.global;
  const local=content.injections.pages[page];
  const css=[global.css,local.css].filter(Boolean).join("\n");
  const javascript=[global.javascript,local.javascript].filter(Boolean).join("\n");
  return <>
    {css&&<style data-clinoro-injection="styles" dangerouslySetInnerHTML={{__html:css}}/>}
    {global.html&&<div data-clinoro-injection="global-html" dangerouslySetInnerHTML={{__html:global.html}}/>}
    {local.html&&<div data-clinoro-injection={`${page}-html`} dangerouslySetInnerHTML={{__html:local.html}}/>}
    {javascript&&<script data-clinoro-injection="javascript" dangerouslySetInnerHTML={{__html:javascript}}/>}
  </>;
}
