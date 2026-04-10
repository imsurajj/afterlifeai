"use client"

import { motion } from "framer-motion"
import { 
  ShieldCheck, 
  Users, 
  ScanFace, 
  Clock, 
  Fingerprint, 
  BookOpen, 
  Bell, 
  Lock,
  ArrowRight
} from "lucide-react"

const features = [
  {
    title: "Digital Vault",
    description: "AES-256 encrypted storage for credentials, hotel bookings, and private messages. Zero-knowledge by design.",
    icon: ShieldCheck,
  },
  {
    title: "Nominee Control",
    description: "Designate exactly who accesses your data. Set custom release conditions and primary/secondary nominees.",
    icon: Users,
  },
  {
    title: "Face Verification",
    description: "3D biometric ID checks ensure only authorized nominees can open your vault. Secure and spoof-proof.",
    icon: ScanFace,
  },
  {
    title: "Legacy Triggers",
    description: "Automate data release based on inactivity or verified life events. Your instructions, perfectly executed.",
    icon: Clock,
  },
  {
    title: "ID Validation",
    description: "Rigorous identity checks including government ID scans and multi-factor authentication for every nominee.",
    icon: Fingerprint,
  },
  {
    title: "Audit Log",
    description: "Full immutable history of every access attempt and permission change. Complete transparency for your peace of mind.",
    icon: BookOpen,
  },
  {
    title: "Smart Alerts",
    description: "Real-time notifications for vault activity and automated empathetic communications for your loved ones.",
    icon: Bell,
  },
  {
    title: "Privacy First",
    description: "No one else—not even us—can see your data. Your digital legacy remains private and secure forever.",
    icon: Lock,
  },
]

export default function Features() {
  return (
    <section id="features" className="bg-background py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-5xl text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-base font-semibold leading-7 text-primary uppercase tracking-widest"
          >
            Advanced Protection
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-2 text-4xl font-bold tracking-tight text-foreground sm:text-5xl"
          >
            Everything you need for peace of mind
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-lg leading-8 text-muted-foreground"
          >
            Afterlife AI combines advanced biometrics with zero-knowledge encryption to ensure your digital legacy is managed precisely as you intend.
          </motion.p>
        </div>

        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <div className="overflow-hidden rounded-xl border border-border bg-border">
            <div className="grid grid-cols-1 gap-px sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, index) => (
                <div
                  key={feature.title}
                  className="flex flex-col bg-background p-8 hover:bg-muted/50 transition-colors duration-200 group"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                    <feature.icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <dt className="text-lg font-bold leading-7 text-foreground">
                    {feature.title}
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-sm leading-6 text-muted-foreground">
                    <p className="flex-auto">{feature.description}</p>
                  </dd>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
