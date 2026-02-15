"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Menu, X, ChevronDown, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  {
    name: "Events",
    href: "/events",
    children: [
      { name: "Upcoming Events", href: "/events" },
      { name: "Past Events", href: "/events/past" },
    ],
  },
  { name: "Mentors", href: "/mentors" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold text-primary">
                WorkChat<span className="text-secondary">Seattle</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-1">
            {navigation.map((item) =>
              item.children ? (
                <DropdownMenu key={item.name}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className={cn(
                        "flex items-center gap-1",
                        isActive(item.href) && "bg-accent"
                      )}
                    >
                      {item.name}
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    {item.children.map((child) => (
                      <DropdownMenuItem key={child.name} asChild>
                        <Link href={child.href}>{child.name}</Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                    isActive(item.href)
                      ? "bg-accent text-accent-foreground"
                      : "text-foreground"
                  )}
                >
                  {item.name}
                </Link>
              )
            )}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={session.user.image || undefined}
                        alt={session.user.name || "User"}
                      />
                      <AvatarFallback>
                        {session.user.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      {session.user.name && (
                        <p className="font-medium">{session.user.name}</p>
                      )}
                      {session.user.email && (
                        <p className="w-[200px] truncate text-sm text-muted-foreground">
                          {session.user.email}
                        </p>
                      )}
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/mentor/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Mentor Profile
                    </Link>
                  </DropdownMenuItem>
                  {session.user.role === "ADMIN" && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin" className="cursor-pointer">
                        Admin Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => signOut()}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" asChild>
                  <Link href="/auth/signin">Sign in</Link>
                </Button>
                <Button asChild>
                  <Link href="/auth/signup">Sign up</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="space-y-1 px-4 pb-3 pt-2">
            {navigation.map((item) =>
              item.children ? (
                <div key={item.name} className="space-y-1">
                  <span className="block px-3 py-2 text-sm font-medium text-muted-foreground">
                    {item.name}
                  </span>
                  {item.children.map((child) => (
                    <Link
                      key={child.name}
                      href={child.href}
                      className={cn(
                        "block rounded-md px-3 py-2 pl-6 text-sm font-medium",
                        isActive(child.href)
                          ? "bg-accent text-accent-foreground"
                          : "text-foreground hover:bg-accent"
                      )}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {child.name}
                    </Link>
                  ))}
                </div>
              ) : (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "block rounded-md px-3 py-2 text-sm font-medium",
                    isActive(item.href)
                      ? "bg-accent text-accent-foreground"
                      : "text-foreground hover:bg-accent"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              )
            )}

            {/* Mobile Auth */}
            <div className="border-t pt-4">
              {session ? (
                <div className="space-y-2">
                  <div className="px-3 py-2">
                    <p className="font-medium">{session.user.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {session.user.email}
                    </p>
                  </div>
                  <Link
                    href="/mentor/profile"
                    className="block rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Mentor Profile
                  </Link>
                  {session.user.role === "ADMIN" && (
                    <Link
                      href="/admin"
                      className="block rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => signOut()}
                    className="block w-full rounded-md px-3 py-2 text-left text-sm font-medium hover:bg-accent"
                  >
                    Sign out
                  </button>
                </div>
              ) : (
                <div className="space-y-2 px-3">
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/auth/signin">Sign in</Link>
                  </Button>
                  <Button className="w-full" asChild>
                    <Link href="/auth/signup">Sign up</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
