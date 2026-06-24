"use client"

type Flip7LogoProps = {
  ribbonText?: string
  className?: string
}

export function Flip7Logo({
  ribbonText = "SCORE CARD",
  className,
}: Flip7LogoProps) {
  return (
    <div className={`flip7-logo ${className ?? ""}`}>
      {/* Fan Cards Background */}
      <div className="flip7-logo__fan" aria-hidden="true">
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} className="flip7-logo__fan-card" />
        ))}
      </div>

      {/* FLIP7 Text Block */}
      <div className="flip7-logo__text-block">
        <span className="flip7-logo__text-flip">FLIP</span>
        <span className="flip7-logo__text-7">7</span>
      </div>

      {/* Ribbon Banner with folded tails */}
      <div className="flip7-logo__ribbon">
        <span className="flip7-logo__ribbon-fold flip7-logo__ribbon-fold--left" />
        <span className="flip7-logo__ribbon-fold flip7-logo__ribbon-fold--right" />
        <span className="flip7-logo__ribbon-text">{ribbonText}</span>
      </div>
    </div>
  )
}

/* Victory ranking components */

type Flip7RankProps = {
  rank: number
  name: string
  score: number
  emoji?: string
  className?: string
}

export function Flip7RankCard({
  rank,
  name,
  score,
  emoji = "🏆",
  className,
}: Flip7RankProps) {
  const rankClass =
    rank === 2 ? "flip7-rank--silver" : rank === 3 ? "flip7-rank--bronze" : ""

  return (
    <div className={`flip7-card ${rankClass} ${className ?? ""}`}>
      <div className="flex items-center gap-3">
        <div className="flip7-rank__avatar flex items-center justify-center text-xl">
          {emoji}
        </div>
        <div className="flex-1 min-w-0">
          <p className="flip7-body truncate">{name}</p>
          <p className="flip7-sm" style={{ color: "var(--flip7-coral)" }}>
            #{rank}
          </p>
        </div>
        <div className="flip7-h3" style={{ color: "var(--flip7-primary-dark)" }}>
          {score.toLocaleString()}
        </div>
      </div>
    </div>
  )
}
