"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { BiSolidZap } from "react-icons/bi"
import Cookies from "js-cookie"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { SESSION_COOKIE_NAME } from "@/lib/auth"

export function PrimaryCtaButton({ className }: { className?: string }) {
  const [isLogged, setIsLogged] = useState(false)

  useEffect(() => {
    setIsLogged(!!Cookies.get(SESSION_COOKIE_NAME))
  }, [])

  return (
    <Button
      className={cn(
        "h-12 px-8 text-base font-semibold group has-[>svg]:px-8",
        className
      )}
      size="lg"
      asChild
    >
      <Link href={isLogged ? "/dashboard" : "/api/auth/demo"}>
        <BiSolidZap className="mr-2 h-5 w-5 transition-transform duration-200 group-hover:rotate-12 group-hover:scale-110" />
        <span>{isLogged ? "Go to Vault" : "Get Started"}</span>
      </Link>
    </Button>
  )
}
