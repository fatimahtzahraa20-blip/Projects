import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Plane, Hotel, Car, MapPin, Quote, FileText, CheckCircle, CreditCard, Send, Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/reveal";
import { HeroCarousel } from "@/components/hero-carousel";

const journeys = [
  { n: "01", title: "Luxury Umrah", text: "Five-star stays, private transfers and personal support.", href: "/luxury-umrah-packages", img: "/images/hero-makkah.png" },
  { n: "02", title: "Royal Executive", text: "Discreet, flexible arrangements at the highest level.", href: "/royal-executive-umrah", img: "/images/hero-makkah.png" },
  { n: "03", title: "Family Umrah", text: "Calm, comfortable travel for every generation.", href: "/family-umrah", img: "/images/hero-makkah.png" }
];

const steps = [
  { icon: FileText, title: "Choose Your Package", desc: "Select a ready-made package or customize your trip based on your preferences." },
  { icon: Send, title: "Upload Documents", desc: "Upload your passport details and personal photo quickly and easily." },
  { icon: CreditCard, title: "Complete Payment", desc: "Secure your booking through a simple and seamless payment process." },
  { icon: CheckCircle, title: "Verification", desc: "Your eligibility and submitted information will be reviewed automatically." },
  { icon: Map, title: "Explore", desc: "Receive your instant eVisa and get ready to discover the Holy Cities." }
];

export default function Home() {
  return (
    <>
      <HeroCarousel/>

      {/* Booking Modes / Partners */}
      <section className="bg-slate-50 py-20">
        <div className="container-pad">
          <Reveal className="text-center mb-16">
            <p className="eyebrow">Travel Partners</p>
            <h2 className="serif text-4xl lg:text-5xl mt-3 text-slate-900">How would you like to book?</h2>
          </Reveal>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Reveal className="bg-white rounded-3xl p-10 shadow-xl shadow-slate-200/50 border border-slate-100">
              <div className="w-14 h-14 bg-teal-100 text-teal-700 rounded-2xl flex items-center justify-center mb-6">
                <MapPin size={28} />
              </div>
              <h3 className="serif text-2xl font-bold text-slate-900 mb-4">Complete Packages</h3>
              <p className="text-slate-600 mb-8 leading-relaxed">
                Build your trip step-by-step and secure your booking instantly.
              </p>
              <ul className="space-y-4 text-sm text-slate-700 mb-8">
                <li className="flex gap-3"><CheckCircle size={18} className="text-teal-600 shrink-0" /> <strong>Instant & Seamless:</strong> Get your automated tourist eVisa delivered directly.</li>
                <li className="flex gap-3"><CheckCircle size={18} className="text-teal-600 shrink-0" /> <strong>Easy Step-by-Step:</strong> Select destination, accommodation, and nights.</li>
                <li className="flex gap-3"><CheckCircle size={18} className="text-teal-600 shrink-0" /> <strong>Fast Issuance:</strong> Receive your visa via email within 24 hours.</li>
              </ul>
              <Button asChild className="w-full bg-teal-600 hover:bg-teal-700 rounded-xl h-12">
                <Link href="/inquiry">Book Complete Package</Link>
              </Button>
            </Reveal>

            <Reveal className="bg-white rounded-3xl p-10 shadow-xl shadow-slate-200/50 border border-slate-100">
              <div className="w-14 h-14 bg-amber-100 text-amber-700 rounded-2xl flex items-center justify-center mb-6">
                <Car size={28} />
              </div>
              <h3 className="serif text-2xl font-bold text-slate-900 mb-4">Customized Itineraries</h3>
              <p className="text-slate-600 mb-8 leading-relaxed">
                Design a personalized travel experience tailored to your plans.
              </p>
              <ul className="space-y-4 text-sm text-slate-700 mb-8">
                <li className="flex gap-3"><CheckCircle size={18} className="text-amber-600 shrink-0" /> <strong>Multi-Destination:</strong> Book custom itineraries spanning multiple cities.</li>
                <li className="flex gap-3"><CheckCircle size={18} className="text-amber-600 shrink-0" /> <strong>Flexible Booking:</strong> Select flights and hotels independently.</li>
                <li className="flex gap-3"><CheckCircle size={18} className="text-amber-600 shrink-0" /> <strong>Enriched Journey:</strong> Add curated activities and Ziyarat.</li>
              </ul>
              <Button asChild variant="outline" className="w-full border-2 border-slate-200 hover:border-amber-600 hover:text-amber-700 rounded-xl h-12">
                <Link href="/contact">Plan Custom Trip</Link>
              </Button>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Visa Application Guide Steps */}
      <section className="bg-white py-24 border-y border-slate-100">
        <div className="container-pad">
          <Reveal className="text-center max-w-3xl mx-auto mb-16">
            <p className="eyebrow">Visa Application Guide</p>
            <h2 className="serif text-4xl lg:text-5xl mt-3 text-slate-900 mb-6">Start your journey with a simple booking experience</h2>
            <p className="text-slate-600 text-lg">From choosing your package and uploading documents to receiving your visa, every step is designed to make planning your trip easier.</p>
          </Reveal>

          <div className="relative">
            <div className="hidden lg:block absolute top-12 left-0 w-full h-0.5 bg-slate-100" />
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
              {steps.map((step, i) => {
                const Icon = step.icon;
                return (
                  <Reveal key={step.title} className="relative z-10 bg-white group">
                    <div className="w-24 h-24 mx-auto bg-slate-50 rounded-full flex items-center justify-center mb-6 shadow-sm border border-slate-100 group-hover:border-teal-300 group-hover:bg-teal-50 transition-colors">
                      <Icon size={32} className="text-teal-600" />
                    </div>
                    <div className="text-center px-2">
                      <h4 className="serif text-lg font-bold text-slate-900 mb-2">{step.title}</h4>
                      <p className="text-sm text-slate-500 leading-relaxed">{step.desc}</p>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Packages Grid */}
      <section className="bg-slate-50 py-24">
        <div className="container-pad">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <p className="eyebrow">Explore Packages</p>
              <h2 className="serif text-4xl lg:text-5xl mt-3 text-slate-900">Featured Travel Packages</h2>
            </div>
            <Link href="/luxury-umrah-packages" className="text-teal-700 font-semibold flex items-center gap-2 hover:underline">
              View all packages <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {journeys.map((j) => (
              <Link href={j.href} key={j.n} className="group block bg-white rounded-3xl overflow-hidden shadow-lg shadow-slate-200/40 hover:shadow-2xl hover:shadow-teal-900/10 transition-all duration-300 border border-slate-100">
                <div className="relative h-60 overflow-hidden bg-slate-200">
                  <Image src={j.img} alt={j.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-teal-800">
                    Package {j.n}
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="serif text-2xl font-bold text-slate-900 mb-3 group-hover:text-teal-700 transition-colors">{j.title}</h3>
                  <p className="text-slate-600 mb-6 line-clamp-2">{j.text}</p>
                  <div className="flex items-center text-teal-600 font-semibold text-sm">
                    Explore Details <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-teal-900 py-24 text-center text-white">
        <div className="container-pad">
          <p className="eyebrow text-teal-300">Your Journey Begins Here</p>
          <h2 className="serif mx-auto mt-4 max-w-4xl text-4xl lg:text-6xl font-medium">Let us create something deeply personal.</h2>
          <Button asChild className="mt-10 bg-white text-teal-900 hover:bg-slate-10 h-14 px-10 rounded-full text-lg font-semibold shadow-xl">
            <Link href="/inquiry">Request a personal proposal</Link>
          </Button>
        </div>
      </section>
    </>
  );
}

