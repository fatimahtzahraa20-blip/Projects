const socials=[
 {label:"Instagram",short:"IG",href:"https://www.instagram.com/hajjumrahtours"},
 {label:"Facebook",short:"f",href:"https://www.facebook.com/hajjumrahtours"},
 {label:"YouTube",short:"YT",href:"https://www.youtube.com/@hajjumrahtours"},
 {label:"X",short:"X",href:"https://x.com/hajjumrahtours"}
];
export function SocialLinks({compact=false}:{compact?:boolean}){return <div className="flex flex-wrap gap-2" aria-label="Social media links">{socials.map(s=><a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={`${s.label} — opens in new tab`} className={`${compact?"h-10 w-10":"h-11 px-4"} inline-flex items-center justify-center rounded-full border border-white/20 text-xs font-bold transition hover:border-[#b7924b] hover:bg-[#b7924b] hover:text-black`}>{compact?s.short:s.label}</a>)}</div>}
