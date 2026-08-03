import{notFound}from"next/navigation";import type{Metadata}from"next";import{pages,pageBySlug}from"@/data/site";import{PageTemplate}from"@/components/page-template";
export function generateStaticParams(){return pages.map(p=>({slug:p.slug}))}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{const{slug}=await params;const p=pageBySlug(slug);if(!p)return{};return{title:p.label,description:p.intro,alternates:{canonical:`/${p.slug}`},openGraph:{title:`${p.label} | Hajj Umrah Tours`,description:p.intro,url:`/${p.slug}`}}}
export default async function Page({params}:{params:Promise<{slug:string}>}){const{slug}=await params;const p=pageBySlug(slug);if(!p)notFound();return <PageTemplate page={p}/>}
