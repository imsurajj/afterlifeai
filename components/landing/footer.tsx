import Link from "next/link"
import { FaDiscord, FaGithub, FaXTwitter } from "react-icons/fa6"
import { SiPeerlist, SiProducthunt, SiYcombinator } from "react-icons/si"

import { GITHUB_REPO, SITE_NAME } from "./branding"

export default function Footer() {
  return (
    <footer className="bg-background border-t border-border py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div>
            <h3
              className="mb-4 text-sm font-semibold uppercase"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Links
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/#features"
                  className="text-muted-foreground text-sm font-medium transition-colors duration-200 ease-in-out hover:text-foreground"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="/#pricing"
                  className="text-muted-foreground text-sm font-medium transition-colors duration-200 ease-in-out hover:text-foreground"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="/#faq"
                  className="text-muted-foreground text-sm font-medium transition-colors duration-200 ease-in-out hover:text-foreground"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3
              className="mb-4 text-sm font-semibold uppercase"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Legal
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/terms"
                  className="text-muted-foreground text-sm font-medium transition-colors duration-200 ease-in-out hover:text-foreground"
                >
                  Terms of services
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-muted-foreground text-sm font-medium transition-colors duration-200 ease-in-out hover:text-foreground"
                >
                  Privacy policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3
              className="mb-4 text-sm font-semibold uppercase"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Featured On
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="https://www.producthunt.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground flex items-center gap-2 text-sm font-medium transition-colors duration-200 ease-in-out hover:text-foreground"
                >
                  <SiProducthunt className="h-4 w-4" />
                  Product Hunt
                </Link>
              </li>
              <li>
                <Link
                  href="https://news.ycombinator.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground flex items-center gap-2 text-sm font-medium transition-colors duration-200 ease-in-out hover:text-foreground"
                >
                  <SiYcombinator className="h-4 w-4" />
                  Hacker News
                </Link>
              </li>
              <li>
                <Link
                  href="https://peerlist.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground flex items-center gap-2 text-sm font-medium transition-colors duration-200 ease-in-out hover:text-foreground"
                >
                  <SiPeerlist className="h-4 w-4" />
                  Peerlist
                </Link>
              </li>
              <li>
                <Link
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground flex items-center gap-2 text-sm font-medium transition-colors duration-200 ease-in-out hover:text-foreground"
                >
                  <FaGithub className="h-4 w-4" />
                  GitHub
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3
              className="mb-4 text-sm font-semibold uppercase"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Community
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href={`https://github.com/${GITHUB_REPO}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground flex items-center gap-2 text-sm font-medium transition-colors duration-200 ease-in-out hover:text-foreground"
                >
                  <FaGithub className="h-4 w-4" />
                  GitHub
                </Link>
              </li>
              <li>
                <Link
                  href="https://discord.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground flex items-center gap-2 text-sm font-medium transition-colors duration-200 ease-in-out hover:text-foreground"
                >
                  <FaDiscord className="h-4 w-4" />
                  Discord
                </Link>
              </li>
              <li>
                <Link
                  href="https://x.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground flex items-center gap-2 text-sm font-medium transition-colors duration-200 ease-in-out hover:text-foreground"
                >
                  <FaXTwitter className="h-4 w-4" />X
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <img src="/image.png" alt="" className="h-6 w-6 object-contain" />
              <span className="text-base font-semibold text-foreground">
                {SITE_NAME}
              </span>
            </div>
            <p className="text-muted-foreground text-sm">Secure your digital legacy and protect your loved ones.</p>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-muted-foreground text-sm">
                Copyright © {new Date().getFullYear()} — {SITE_NAME}
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
