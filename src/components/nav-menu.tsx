"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { LayoutDashboard, Package } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

interface NavMenuProps extends ComponentProps<typeof NavigationMenu> {
  role?: string;
}

export const NavMenu = ({ role, ...props }: NavMenuProps) => (
  <NavigationMenu viewport={false} {...props}>
    <NavigationMenuList className="data-[orientation=vertical]:-ms-2 data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-start data-[orientation=vertical]:justify-start">
      <NavigationMenuItem>
        <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
          <Link href="/">Home</Link>
        </NavigationMenuLink>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
          <Link href="/course">Course</Link>
        </NavigationMenuLink>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
          <Link href="/about">About</Link>
        </NavigationMenuLink>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
          <Link href="/product">Product</Link>
        </NavigationMenuLink>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
          <Link href="/contact">Contact</Link>
        </NavigationMenuLink>
      </NavigationMenuItem>
      {role === "admin" && (
        <NavigationMenuItem>
          <NavigationMenuTrigger>
            <LayoutDashboard className="size-4 mr-1" />
            Admin
          </NavigationMenuTrigger>
          <NavigationMenuContent className="rounded-[20px] min-w-[12rem]">
            <ul className="grid w-full gap-0.5 p-1.5">
              <li>
                <NavigationMenuLink
                  asChild
                  className="rounded-lg px-3 py-2 text-sm hover:bg-accent"
                >
                  <Link href="/dashboard">
                    <LayoutDashboard className="size-4" />
                    Dashboard
                  </Link>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink
                  asChild
                  className="rounded-lg px-3 py-2 text-sm hover:bg-accent"
                >
                  <Link href="/dashboard/products">
                    <Package className="size-4" />
                    Product
                  </Link>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      )}
    </NavigationMenuList>
  </NavigationMenu>
);
