"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, ExternalLink } from "lucide-react";
import { useState } from "react";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/site/theme-toggle";
import { GlobalSearchButton } from "@/components/site/global-search";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container-page flex h-14 items-center gap-4">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <Image
            src="/logo-on-light.png"
            alt="Overmap"
            width={28}
            height={28}
            priority
            className="size-7 dark:hidden"
          />
          <Image
            src="/logo-on-dark.png"
            alt="Overmap"
            width={28}
            height={28}
            priority
            className="size-7 hidden dark:block"
          />
          <span>{siteConfig.name}</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1 text-sm">
          {siteConfig.nav.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "px-3 py-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors",
                  active && "text-foreground bg-accent"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-1.5">
          <GlobalSearchButton />
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="hidden lg:inline-flex"
          >
            <a
              href={siteConfig.mainSite}
              target="_blank"
              rel="noreferrer"
              className="gap-1 text-muted-foreground"
            >
              主站 <ExternalLink className="size-3.5" />
            </a>
          </Button>
          <ThemeToggle />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label="Menu">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle>{siteConfig.name}</SheetTitle>
              </SheetHeader>
              <nav className="mt-6 flex flex-col gap-1 px-4">
                {siteConfig.nav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="rounded-md px-3 py-2 text-sm hover:bg-accent"
                  >
                    {item.label}
                  </Link>
                ))}
                <a
                  href={siteConfig.mainSite}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent"
                >
                  Overmap 主站 ↗
                </a>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
