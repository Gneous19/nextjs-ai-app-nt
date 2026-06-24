import { Suspense } from "react"
import Link from "next/link"
import { Package, Truck, Shield, Headphones, Star, Smile, Zap, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

async function StoreStats() {
  const stats = [
    { label: "Total Products", value: "2,500+", icon: Package, color: "text-[#FF6B6B]" },
    { label: "Trusted Customers", value: "15,000+", icon: Smile, color: "text-[#4ECDC4]" },
    { label: "Completed Orders", value: "50,000+", icon: TrendingUp, color: "text-[#FFE66D]" },
    { label: "24-Hour Delivery", value: "98%", icon: Zap, color: "text-[#60A5FA]" },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {stats.map((stat) => (
        <Card key={stat.label} className="text-center">
          <CardContent>
            <stat.icon className={`mx-auto mb-3 size-10 ${stat.color}`} />
            <div className="font-heading text-3xl md:text-4xl text-foreground">{stat.value}</div>
            <p className="text-muted-foreground text-base mt-1">{stat.label}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

const features = [
  {
    icon: Truck,
    title: "Free Shipping",
    description: "Free delivery nationwide on orders over $25. Fast shipping within 1-3 business days.",
    color: "bg-[#FF6B6B]/15 text-[#FF6B6B]",
  },
  {
    icon: Shield,
    title: "Product Warranty",
    description: "Quality guaranteed on every item. 7-day return policy. Not satisfied? Full refund, no questions asked.",
    color: "bg-[#4ECDC4]/15 text-[#4ECDC4]",
  },
  {
    icon: Star,
    title: "Premium Quality",
    description: "Curated products from top brands. Every item passes rigorous quality checks before shipping.",
    color: "bg-[#FFE66D]/15 text-[#E6C84D]",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Our team is ready to help around the clock — via chat, phone, and email.",
    color: "bg-[#60A5FA]/15 text-[#60A5FA]",
  },
]

const values = [
  { emoji: "💎", title: "Quality Above All", desc: "We never compromise on product quality. Every item goes through rigorous inspection." },
  { emoji: "🤝", title: "Customers Are Family", desc: "We treat every customer like family, ready to solve any issue with sincerity and care." },
  { emoji: "🚀", title: "Relentless Innovation", desc: "Continuously improving our platform for the simplest and most enjoyable shopping experience." },
  { emoji: "🌱", title: "Grow Together", desc: "Supporting local entrepreneurs and building a sustainable ecommerce ecosystem for everyone." },
]

export default function AboutPage() {
  return (
    <main>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FFF5F5] to-background">
        <div className="mx-auto max-w-(--breakpoint-xl) px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center">
          <Badge variant="filter" className="mb-6">
            <Star className="size-3 fill-[#FF6B6B]" /> #1 Ecommerce Platform
          </Badge>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl tracking-tight mb-6">
            Shopping That Fits<br />
            <span className="text-primary">Your Lifestyle</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg md:text-xl text-muted-foreground mb-8">
            We are an ecommerce platform designed for you — with quality products,
            fair prices, and an experience you&apos;ll love.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Button size="lg" asChild>
              <Link href="/product">Browse Products</Link>
            </Button>
            <Button size="lg" variant="ghost" asChild>
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>

        {/* Decorative dots */}
        <div className="absolute top-0 right-0 -z-0 opacity-10">
          <div className="grid grid-cols-8 gap-4 p-8">
            {Array.from({ length: 64 }).map((_, i) => (
              <div key={i} className="size-3 rounded-full bg-primary" />
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="mx-auto max-w-(--breakpoint-xl) px-4 sm:px-6 lg:px-8 -mt-12 relative z-10">
        <Suspense
          fallback={
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-card rounded-lg p-6 animate-pulse">
                  <div className="mx-auto mb-3 size-10 rounded-full bg-muted" />
                  <div className="h-8 w-16 mx-auto bg-muted rounded" />
                  <div className="h-4 w-20 mx-auto bg-muted rounded mt-2" />
                </div>
              ))}
            </div>
          }
        >
          <StoreStats />
        </Suspense>
      </section>

      {/* Our Story Section */}
      <section className="mx-auto max-w-(--breakpoint-xl) px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div>
            <Badge variant="filter" className="mb-4">Our Story</Badge>
            <h2 className="font-heading text-3xl md:text-4xl mb-6">
              Founded on the belief that<br />
              <span className="text-primary">shopping should be delightful</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-4">
              Established in 2024 with a vision to make quality products accessible at fair prices.
              We started as a small shop and grew through the trust of every single customer.
            </p>
            <p className="text-lg text-muted-foreground mb-6">
              Today we carry over 2,500 products across every category — from fashion and electronics
              to supplements and home essentials. And we&apos;re still improving the platform every single day.
            </p>
            <Button variant="secondary" asChild>
              <Link href="/course">Learn More</Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { emoji: "👕", label: "Fashion" },
              { emoji: "📱", label: "Electronics" },
              { emoji: "🏠", label: "Home & Living" },
              { emoji: "💄", label: "Beauty" },
            ].map((cat) => (
              <Card key={cat.label} className="text-center py-8">
                <div className="text-5xl mb-3">{cat.emoji}</div>
                <p className="font-heading text-xl">{cat.label}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-muted/50 py-16 md:py-24">
        <div className="mx-auto max-w-(--breakpoint-xl) px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge variant="filter" className="mb-4">Why Choose Us</Badge>
            <h2 className="font-heading text-3xl md:text-4xl mb-4">
              Shop with Confidence
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              We&apos;re committed to delivering the best shopping experience to you.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} variant="elevated">
                <CardHeader>
                  <div className={`inline-flex size-12 items-center justify-center rounded-md ${feature.color}`}>
                    <feature.icon className="size-6" />
                  </div>
                </CardHeader>
                <CardContent>
                  <CardTitle className="mb-2">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="mx-auto max-w-(--breakpoint-xl) px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center mb-12">
          <Badge variant="filter" className="mb-4">Our Values</Badge>
          <h2 className="font-heading text-3xl md:text-4xl mb-4">
            What We Believe In
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Four principles that drive every decision we make.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value) => (
            <Card key={value.title} className="text-center">
              <CardContent>
                <div className="text-5xl mb-4">{value.emoji}</div>
                <h3 className="font-heading text-xl mb-2">{value.title}</h3>
                <p className="text-muted-foreground text-base">{value.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section className="bg-muted/50 py-16 md:py-24">
        <div className="mx-auto max-w-(--breakpoint-xl) px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="filter" className="mb-4">Our Team</Badge>
          <h2 className="font-heading text-3xl md:text-4xl mb-4">
            Driven by Exceptional People
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground mb-12">
            A team of 50+ people dedicated to every step — from product curation
            to delivery at your doorstep.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: "Somchai Rakdee", role: "CEO & Founder", emoji: "👨‍💼" },
              { name: "Somsri Jaingam", role: "Head of Product", emoji: "👩‍💻" },
              { name: "Wichai Mankong", role: "Head of Operations", emoji: "👨‍🔧" },
            ].map((member) => (
              <Card key={member.name} variant="elevated" className="text-center">
                <CardContent>
                  <div className="text-6xl mb-4">{member.emoji}</div>
                  <h3 className="font-heading text-xl">{member.name}</h3>
                  <p className="text-muted-foreground">{member.role}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mx-auto max-w-(--breakpoint-xl) px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <Card className="bg-primary text-primary-foreground border-none shadow-coral text-center py-12 px-6">
          <h2 className="font-heading text-3xl md:text-4xl mb-4">
            Ready to Start Shopping?
          </h2>
          <p className="mx-auto max-w-xl text-lg opacity-90 mb-8">
            Sign up today and get 10% off your first order.
            Plus exclusive perks waiting just for you.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/signup">Sign Up Free</Link>
            </Button>
            <Button size="lg" variant="ghost" className="border-white text-white hover:bg-white/15" asChild>
              <Link href="/product">View All Products</Link>
            </Button>
          </div>
        </Card>
      </section>
    </main>
  )
}
