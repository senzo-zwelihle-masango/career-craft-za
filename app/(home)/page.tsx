import FAQs from "@/components/home/faqs"
import Features from "@/components/home/features"
import Hero from "@/components/home/hero"
import Pricing from "@/components/home/pricing"
import Templates from "@/components/home/templates"
import React from "react"

const faqItems = [
    {
        id: 'item-1',
        question: 'How does the free trial work?',
        answer: 'Start with a 14-day free trial with full access to all features. No credit card required. You can upgrade to a paid plan at any time during or after the trial.',
    },
    {
        id: 'item-2',
        question: 'Can I change my plan later?',
        answer: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate the difference.",
    },
    {
        id: 'item-3',
        question: 'What payment methods do you accept?',
        answer: 'We accept all major credit cards, PayPal, and bank transfers for annual plans. Enterprise customers can also pay via invoice.',
    },
    {
        id: 'item-4',
        question: 'Is there a setup fee?',
        answer: 'No, there are no setup fees or hidden costs. You only pay for your subscription plan.',
    },
    {
        id: 'item-5',
        question: 'Do you offer refunds?',
        answer: "We offer a 30-day money-back guarantee. If you're not satisfied, contact us within 30 days for a full refund.",
    },
]

export default function Home() {
  return (
    <div className="relative mb-40 space-y-40">
      {/* hero */}
      <Hero />
      {/* features */}
      <Features />
      {/* templates */}
      <Templates/>
      {/* pricing */}
      <Pricing />

      {/* faqs */}
      <FAQs/>
    </div>
  )
}
