
import { Users, Search, Diamond, Users2, Mic2 } from "lucide-react"

export default function FeatureSelection() {
  const features = [
    {
      title: "Great Speakers",
      description: "Dolor sit amet consectetur elit sed do eiusmod tempor incd.",
      icon: Mic2,
      iconColor: "text-rose-500",
    },
    {
      title: "Experience",
      description: "Dolor sit amet consectetur elit sed do eiusmod tempor incd.",
      icon: Search,
      iconColor: "text-rose-500",
    },
    {
      title: "Networking",
      description: "Dolor sit amet consectetur elit sed do eiusmod tempor incd.",
      icon: Diamond,
      iconColor: "text-rose-500",
    },
    {
      title: "Party",
      description: "Dolor sit amet consectetur elit sed do eiusmod tempor incd.",
      icon: Users2,
      iconColor: "text-rose-500",
    },
    {
      title: "New People",
      description: "Dolor sit amet consectetur elit sed do eiusmod tempor incd.",
      icon: Users,
      iconColor: "text-rose-500",
    },
  ]

  return (
    <section className="relative overflow-hidden py-20">
      {/* Decorative elements */}
      <div className="absolute left-0 top-20 h-24 w-24 transform">
        <div className="absolute h-full w-1 rotate-45 bg-purple-500" />
        <div className="absolute left-4 h-full w-1 rotate-45 bg-purple-500" />
      </div>
      <div className="absolute right-20 top-0 h-24 w-24">
        <div className="absolute h-full w-1 -rotate-45 bg-rose-500" />
        <div className="absolute left-4 h-full w-1 -rotate-45 bg-rose-500" />
      </div>
      <div className="absolute bottom-20 right-0 h-24 w-24">
        <div className="absolute h-full w-1 rotate-45 bg-cyan-500" />
        <div className="absolute left-4 h-full w-1 rotate-45 bg-cyan-500" />
      </div>

      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className=" font-bold uppercase tracking-wider text-primary bg-gradient-to-r from-purple-700 to-pink-500 text-transparent bg-clip-text text-sm">
            FEATURES
          </h2>
          <h3 className="mt-2 text-4xl font-bold">Our Feature</h3>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="rounded-lg bg-white p-6 shadow-lg transition-transform hover:-translate-y-1"
            >
              <div className="flex items-start gap-4">
                <div
                  className={`rounded-lg bg-rose-50 p-3 ${feature.iconColor}`}
                >
                  <feature.icon className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="mb-2 text-xl font-bold text-gray-900">
                    {feature.title}
                  </h4>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}