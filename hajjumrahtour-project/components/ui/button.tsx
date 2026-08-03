import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import * as React from "react";
const variants=cva("inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 text-[12px] font-bold uppercase tracking-[.14em] transition duration-300 disabled:opacity-50",{variants:{variant:{gold:"bg-[#b7924b] text-black hover:bg-[#d1b576]",light:"bg-white text-black hover:bg-stone-200",outline:"border border-current bg-transparent hover:bg-white/10",dark:"bg-black text-white hover:bg-stone-800"}},defaultVariants:{variant:"gold"}});
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>,VariantProps<typeof variants>{asChild?:boolean}
export function Button({className,variant,asChild=false,...props}:ButtonProps){const Comp=asChild?Slot:"button";return <Comp className={cn(variants({variant}),className)} {...props}/>}
