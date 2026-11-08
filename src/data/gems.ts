import type { GemName } from "@/components/Gem"

/**
 * Image for each gem. Files live in public/gems/ and are referenced as "/gems/name.png".
 * Any gem left empty falls back to the small drawn gem.
 */
export const GEM_IMAGES: Partial<Record<GemName, string>> = {
  Stone: "/gems/stone.png",
  Quartz: "/gems/quartz.png",
  Jade: "/gems/jade.png",
  Ruby: "/gems/ruby.png",
  Diamond: "/gems/diamond.png",
}