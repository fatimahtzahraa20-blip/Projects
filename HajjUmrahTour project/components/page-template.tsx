"use client";
import Link from "next/link";
import { ArrowRight, Check, ShieldCheck, Clock3, Headphones, ChevronDown } from "lucide-react";
import { PageData } from "@/data/site";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/reveal";
import { InquiryForm } from "@/components/inquiry-form";
import * as Accordion from "@radix-ui/react-accordion";

export function PageTemplate({ page }: { page: PageData }) {
  const form = ["inquiry", "contact"].includes(page.slug);
  
  return (
    <>
      <section className="relative flex min-h-[65vh] items-end overflow-hidden bg-teal-950 pb-16 pt-36 text-white lg:min-h-[70vh] lg:pb-24">
        <div className="absolute inset-0 bg-[url('/images/hero-makkah.png')] bg-cover bg-center opacity-40 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-r from-teal-950 via-teal-900/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
        <div className="container-pad relative z-10">
          <p className="eyebrow flex items-center gap-3 text-teal-300">
            <span className="teal-line bg-teal-300" />
            {page.subtitle}
          </p>
          <h1 className="serif mt-5 max-w-4xl text-5xl leading-[1.05] sm:text-6xl lg:text-7xl font-medium drop-shadow-md">
            {page.title}
          </h1>
          <p className="mt-7 max-w-2xl text-base leading-8 text-teal-50 sm:text-lg">
            {page.intro}
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Button asChild className="bg-teal-600 hover:bg-teal-500 text-white border-0 h-12 px-8 rounded-full text-base shadow-lg shadow-teal-900/20">
              <Link href={form ? "#inquiry" : "/inquiry"}>
                {form ? "Send an inquiry" : "Plan my journey"}
                <ArrowRight size={16} className="ml-2" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-12 px-8 rounded-full text-base border-white/30 text-white hover:bg-white/10 backdrop-blur-sm">
              <Link href="/contact">Speak to a specialist</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 border-b border-slate-100 shadow-sm relative z-20 -mt-6 rounded-t-3xl max-w-[96%] mx-auto">
        <div className="container-pad grid gap-8 md:grid-cols-3">
          {[
            [ShieldCheck, "Considered planning", "Every detail reviewed around your needs."],
            [Clock3, "Your time, respected", "Responsive support and clear next steps."],
            [Headphones, "Personal guidance", "One expert team throughout your journey."]
          ].map(([I, t, d]) => {
            const Icon = I as typeof ShieldCheck;
            return (
              <div className="flex gap-5 items-start p-4 hover:bg-slate-50 rounded-2xl transition-colors" key={t as string}>
                <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center shrink-0">
                  <Icon className="text-teal-600" size={24} />
                </div>
                <div>
                  <h2 className="serif text-xl font-bold text-slate-900">{t as string}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{d as string}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {form && (
        <section id="inquiry" className="py-24 bg-slate-50">
          <div className="container-pad grid gap-12 lg:grid-cols-[.8fr_1.2fr]">
            <Reveal>
              <p className="eyebrow text-teal-600">Your private consultation</p>
              <h2 className="serif mt-4 text-4xl lg:text-5xl text-slate-900">A few details. One exceptional journey.</h2>
              <p className="mt-5 max-w-md leading-8 text-slate-600 text-lg">
                Share your preferences without passport or payment details. A travel specialist can then discuss a proposal with you.
              </p>
            </Reveal>
            <Reveal className="bg-white p-8 md:p-10 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
              <InquiryForm />
            </Reveal>
          </div>
        </section>
      )}

      {page.sections.map((s, i) => (
        <section key={s.title} className={`py-24 ${i % 2 ? "bg-slate-50" : "bg-white"}`}>
          <div className="container-pad grid items-start gap-12 lg:grid-cols-[1fr_1fr] lg:gap-20">
            <Reveal>
              <p className="eyebrow text-teal-600">0{i + 1} / {page.category}</p>
              <h2 className="serif mt-4 text-4xl leading-tight lg:text-5xl text-slate-900">{s.title}</h2>
              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">{s.body}</p>
            </Reveal>
            
            <Reveal>
              <Accordion.Root type="single" collapsible className="w-full space-y-4">
                {s.items.map((x, n) => (
                  <Accordion.Item 
                    value={`item-${n}`} 
                    key={x} 
                    className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:border-teal-200 transition-colors data-[state=open]:border-teal-300 data-[state=open]:shadow-md"
                  >
                    <Accordion.Header>
                      <Accordion.Trigger className="flex items-center justify-between w-full p-6 text-left group">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-teal-50 text-teal-700 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                            <Check size={16} />
                          </span>
                          <span className="serif text-xl font-medium text-slate-800">{x}</span>
                        </div>
                        <ChevronDown className="text-slate-400 group-data-[state=open]:rotate-180 transition-transform duration-300" />
                      </Accordion.Trigger>
                    </Accordion.Header>
                    <Accordion.Content className="overflow-hidden data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp">
                      <div className="px-6 pb-6 pt-2 pl-[4.5rem] text-slate-600">
                        Detailed arrangements and premium services related to {x.toLowerCase()} are included to ensure your complete peace of mind during your journey.
                      </div>
                    </Accordion.Content>
                  </Accordion.Item>
                ))}
              </Accordion.Root>
            </Reveal>
          </div>
        </section>
      ))}

      <section className="bg-teal-900 py-24 text-center text-white">
        <Reveal className="container-pad text-center">
          <p className="eyebrow text-teal-300">Begin with a conversation</p>
          <h2 className="serif mx-auto mt-4 max-w-3xl text-4xl lg:text-5xl font-medium">Your journey deserves thoughtful attention.</h2>
          <p className="mx-auto mt-6 max-w-xl text-teal-100 text-lg">Tell us what matters to you. We'll help shape the path forward.</p>
          <Button asChild className="mt-10 bg-white text-teal-900 hover:bg-slate-100 h-14 px-10 rounded-full text-lg font-semibold shadow-xl">
            <Link href="/inquiry">Request a personal proposal</Link>
          </Button>
        </Reveal>
      </section>
    </>
  );
}
