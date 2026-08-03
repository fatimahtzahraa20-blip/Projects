"use client";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const slides = [
  { image:"/images/hero-makkah.png", eyebrow:"Private pilgrimage journeys", title:"Closer to faith. Beyond expectation.", text:"Bespoke Hajj and Umrah journeys, planned around you." },
  { image:"/images/hero-madinah.png", eyebrow:"Makkah & Madinah", title:"Sacred places. Seamless moments.", text:"Premium stays, private transfers and support at every step." },
  { image:"/images/hero-family.png", eyebrow:"Family journeys", title:"Travel together. Focus on what matters.", text:"Comfortable, thoughtful planning for every generation." }
];
export function HeroCarousel(){
 const [active,setActive]=useState(0); const move=(n:number)=>setActive((n+slides.length)%slides.length);
 useEffect(()=>{const id=setInterval(()=>setActive(v=>(v+1)%slides.length),6500);return()=>clearInterval(id)},[]);
 return <section className="relative min-h-[100svh] overflow-hidden bg-black text-white" aria-roledescription="carousel">
  <AnimatePresence mode="popLayout">{slides.map((s,i)=>i===active&&<motion.div key={s.image} initial={{opacity:0,scale:1.03}} animate={{opacity:1,scale:1}} exit={{opacity:0}} transition={{duration:1}} className="absolute inset-0"><Image src={s.image} alt="" fill priority={i===0} sizes="100vw" className="object-cover object-center"/><div className="absolute inset-0 bg-gradient-to-r from-black via-black/65 to-transparent"/><div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/25"/></motion.div>)}</AnimatePresence>
  <div className="container-pad relative z-10 flex min-h-[100svh] items-end pb-28 pt-32 lg:items-center lg:pb-0"><AnimatePresence mode="wait"><motion.div key={active} initial={{opacity:0,y:25}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-15}} transition={{duration:.6}} className="max-w-4xl"><p className="eyebrow text-[#d3b56f]">{slides[active].eyebrow}</p><h1 className="serif mt-6 max-w-4xl text-6xl leading-[.92] sm:text-7xl lg:text-[7rem]">{slides[active].title}</h1><p className="mt-6 max-w-xl text-lg text-stone-200">{slides[active].text}</p><div className="mt-8 flex flex-wrap gap-3"><Button asChild><Link href="/register">Register interest <ArrowRight size={15}/></Link></Button><Button asChild variant="outline"><Link href="/luxury-umrah-packages">View packages</Link></Button></div></motion.div></AnimatePresence></div>
  <div className="absolute bottom-7 left-1/2 z-20 flex -translate-x-1/2 items-center gap-4"><button onClick={()=>move(active-1)} aria-label="Previous slide" className="grid h-11 w-11 place-items-center rounded-full border border-white/30 bg-black/30"><ChevronLeft/></button><div className="flex gap-2">{slides.map((_,i)=><button key={i} onClick={()=>setActive(i)} aria-label={`Go to slide ${i+1}`} className={`h-1 rounded-full transition-all ${i===active?"w-10 bg-[#d1b576]":"w-4 bg-white/40"}`}/>)}</div><button onClick={()=>move(active+1)} aria-label="Next slide" className="grid h-11 w-11 place-items-center rounded-full border border-white/30 bg-black/30"><ChevronRight/></button></div>
 </section>
}
