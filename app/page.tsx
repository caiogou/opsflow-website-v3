'use client';

import React from 'react';
import {
  ArrowRight,
  BarChart3,
  Zap,
  TrendingUp,
  AlertTriangle,
  Users,
  CheckCircle2,
  Globe,
  Lock,
  Gauge,
  Layers,
  Activity,
  Calendar,
  Target,
} from 'lucide-react';

export default function Home() {
  return (
    <div className="w-full overflow-hidden">
      {/* HERO SECTION */}
      <section className="w-full bg-navy py-20 md:py-32 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 leading-tight">
              AI-Powered Supply Chain Execution for EMEA
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-10 leading-relaxed max-w-3xl">
              From diagnostic to measurable execution in 6 weeks — not 6 months. Senior-led, AI-driven, built for mid-market manufacturers.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <a
                href="/diagnostic"
                className="inline-flex items-center justify-center px-8 py-4 bg-teal hover:bg-teal-light text-navy font-bold rounded-lg transition-colors"
              >
                Take the S&OP Maturity Assessment
                <ArrowRight className="ml-2 w-5 h-5" />
              </a>
              <a
                href="https://calendly.com/caio-opsflow-advisory/30min"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-teal text-teal hover:bg-teal hover:text-navy font-bold rounded-lg transition-colors"
              >
                Book a Free Problem Session
                <ArrowRight className="ml-2 w-5 h-5" />
              </a>
            </div>

            {/* Trust Line */}
            <div className="flex flex-col sm:flex-row gap-6 text-sm text-teal-muted">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                MIT-certified methodology
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                20+ years EMEA experience
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                AI decision engines
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY NOW SECTION */}
      <section id="why-now" className="w-full bg-gray-50 py-20 md:py-28 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 md:mb-20">
            <div className="text-teal font-bold text-sm md:text-base tracking-widest uppercase mb-2">
              Why Now
            </div>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-navy mb-4">
              The Urgency Window Is Open
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Four converging forces demand immediate action in 2026
            </p>
          </div>

          {/* 4 Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1 */}
            <div className="bg-white rounded-lg p-6 md:p-8 shadow-sm border-l-4 border-teal">
              <Lock className="w-10 h-10 text-teal mb-4" />
              <h3 className="text-lg md:text-xl font-bold text-navy mb-3">EU Compliance</h3>
              <p className="text-gray-700 text-sm md:text-base">
                CSRD & CSDDD deadlines arrive July 2026. You need supply chain visibility now.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-lg p-6 md:p-8 shadow-sm border-l-4 border-gold">
              <Zap className="w-10 h-10 text-gold mb-4" />
              <h3 className="text-lg md:text-xl font-bold text-navy mb-3">AI Disruption</h3>
              <p className="text-gray-700 text-sm md:text-base">
                Less than 10% of mid-market companies have AI in supply chain. You're being outpaced.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-lg p-6 md:p-8 shadow-sm border-l-4 border-teal">
              <Users className="w-10 h-10 text-teal mb-4" />
              <h3 className="text-lg md:text-xl font-bold text-navy mb-3">Talent Shortage</h3>
              <p className="text-gray-700 text-sm md:text-base">
                You can't hire supply chain experts. You need to buy their expertise instead.
              </p>
            </div>

            {/* Card 4 */}
            <div className="bg-white rounded-lg p-6 md:p-8 shadow-sm border-l-4 border-gold">
              <TrendingUp className="w-10 h-10 text-gold mb-4" />
              <h3 className="text-lg md:text-xl font-bold text-navy mb-3">Post-COVID Redesign</h3>
              <p className="text-gray-700 text-sm md:text-base">
                Networks, sourcing, planning, and working capital must be completely rebuilt.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* THE GAP SECTION */}
      <section className="w-full bg-navy py-20 md:py-28 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 md:mb-20">
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-6">
              Mid-Market Manufacturers Have No Execution Partner
            </h2>
          </div>

          {/* Three Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 mb-12">
            {/* Big 4 */}
            <div className="bg-navy-mid rounded-lg p-8 text-center border border-gray-700">
              <BarChart3 className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Big 4 Consultants</h3>
              <p className="text-teal-muted text-sm">
                $500K+ fees, 6-month studies, 200-slide decks. No execution.
              </p>
            </div>

            {/* The Pain */}
            <div className="bg-gradient-to-br from-red-900 to-navy-mid rounded-lg p-8 text-center border border-red-700">
              <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <div className="text-4xl md:text-5xl font-bold text-red-400 mb-3">3–8%</div>
              <p className="text-white text-sm">
                Revenue lost annually due to poor supply chain execution
              </p>
            </div>

            {/* Freelancers */}
            <div className="bg-navy-mid rounded-lg p-8 text-center border border-gray-700">
              <Users className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Freelancers</h3>
              <p className="text-teal-muted text-sm">
                No methodology, no tech integration, no accountability. Temporary fixes.
              </p>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="bg-teal bg-opacity-10 border-l-4 border-teal rounded-lg p-6 md:p-8">
            <p className="text-center text-white text-lg">
              <span className="font-bold text-teal">OpsFlow combines</span> Big 4 expertise, freelancer agility, and AI-driven execution — all in 6 weeks.
            </p>
          </div>
        </div>
      </section>

      {/* AI SOLUTIONS / EXECUTION SYSTEM SECTION */}
      <section id="ai-solutions" className="w-full bg-gray-50 py-20 md:py-28 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 md:mb-20">
            <div className="text-teal font-bold text-sm md:text-base tracking-widest uppercase mb-2">
              Powered by AI
            </div>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-navy mb-6">
              Our AI Execution System
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Decision engines that deliver results — not reports
            </p>
          </div>

          {/* 2x2 Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Engine 1: S&OP Maturity */}
            <div className="bg-white rounded-lg p-8 shadow-sm border-2 border-teal border-opacity-20 hover:shadow-lg transition-shadow">
              <div className="inline-block bg-teal bg-opacity-10 text-teal px-3 py-1 rounded text-xs font-bold tracking-widest uppercase mb-4">
                Lead Engine
              </div>
              <h3 className="text-2xl font-bold text-navy mb-4">S&OP Maturity Engine</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-teal mt-0.5 flex-shrink-0" />
                  <span>32-dimension automated assessment</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-teal mt-0.5 flex-shrink-0" />
                  <span>Radar chart maturity profiling</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-teal mt-0.5 flex-shrink-0" />
                  <span>Live on-site diagnostic</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-teal mt-0.5 flex-shrink-0" />
                  <span>Instant gap identification</span>
                </li>
              </ul>
            </div>

            {/* Engine 2: Inventory Decision */}
            <div className="bg-white rounded-lg p-8 shadow-sm border-2 border-teal border-opacity-20 hover:shadow-lg transition-shadow">
              <div className="inline-block bg-teal bg-opacity-10 text-teal px-3 py-1 rounded text-xs font-bold tracking-widest uppercase mb-4">
                Execution
              </div>
              <h3 className="text-2xl font-bold text-navy mb-4">Inventory Decision Engine</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-teal mt-0.5 flex-shrink-0" />
                  <span>ABC/XYZ automated segmentation</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-teal mt-0.5 flex-shrink-0" />
                  <span>Stockout risk scoring</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-teal mt-0.5 flex-shrink-0" />
                  <span>Working capital targets</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-teal mt-0.5 flex-shrink-0" />
                  <span>Safety stock optimization</span>
                </li>
              </ul>
            </div>

            {/* Engine 3: Demand Intelligence */}
            <div className="bg-white rounded-lg p-8 shadow-sm border-2 border-teal border-opacity-20 hover:shadow-lg transition-shadow">
              <div className="inline-block bg-teal bg-opacity-10 text-teal px-3 py-1 rounded text-xs font-bold tracking-widest uppercase mb-4">
                Execution
              </div>
              <h3 className="text-2xl font-bold text-navy mb-4">Demand Intelligence Engine</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-teal mt-0.5 flex-shrink-0" />
                  <span>Forecast accuracy analysis</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-teal mt-0.5 flex-shrink-0" />
                  <span>Volatility detection & alerts</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-teal mt-0.5 flex-shrink-0" />
                  <span>AI method recommendations</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-teal mt-0.5 flex-shrink-0" />
                  <span>Bias and seasonality modeling</span>
                </li>
              </ul>
            </div>

            {/* Engine 4: Risk & Performance */}
            <div className="bg-white rounded-lg p-8 shadow-sm border-2 border-teal border-opacity-20 hover:shadow-lg transition-shadow">
              <div className="inline-block bg-teal bg-opacity-10 text-teal px-3 py-1 rounded text-xs font-bold tracking-widest uppercase mb-4">
                Execution
              </div>
              <h3 className="text-2xl font-bold text-navy mb-4">Risk & Performance Engine</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-teal mt-0.5 flex-shrink-0" />
                  <span>Supplier concentration scoring</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-teal mt-0.5 flex-shrink-0" />
                  <span>Automated risk heat maps</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-teal mt-0.5 flex-shrink-0" />
                  <span>End-to-end visibility</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-teal mt-0.5 flex-shrink-0" />
                  <span>Real-time KPI dashboards</span>
                </li>
              </ul>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <a
              href="/diagnostic"
              className="inline-flex items-center justify-center px-8 py-4 bg-teal hover:bg-teal-light text-navy font-bold rounded-lg transition-colors"
            >
              Experience Our S&OP Maturity Engine Live
              <ArrowRight className="ml-2 w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      {/* DASHBOARD SHOWCASE SECTION */}
      <section className="w-full bg-navy py-20 md:py-28 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 md:mb-20">
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-4">
              See It in Action
            </h2>
            <p className="text-teal-muted text-lg">
              Live diagnostic dashboards — not PowerPoint
            </p>
          </div>

          {/* 3 Dashboard Preview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* Maturity Radar */}
            <div className="bg-navy-mid rounded-lg p-8 border border-gray-700">
              <div className="w-full h-48 mb-6 rounded-lg bg-gradient-to-br from-teal via-navy-mid to-navy-deep flex items-center justify-center relative overflow-hidden">
                {/* SVG-like Radar Chart */}
                <svg className="w-32 h-32" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" stroke="#0D9488" strokeWidth="1" fill="none" opacity="0.3" />
                  <circle cx="50" cy="50" r="30" stroke="#0D9488" strokeWidth="1" fill="none" opacity="0.3" />
                  <circle cx="50" cy="50" r="20" stroke="#0D9488" strokeWidth="1" fill="none" opacity="0.3" />
                  <circle cx="50" cy="50" r="10" stroke="#0D9488" strokeWidth="1" fill="none" opacity="0.3" />
                  <polygon points="50,10 70,30 80,50 70,70 50,90 30,70 20,50 30,30" fill="#0D9488" opacity="0.6" stroke="#14B8A6" strokeWidth="2" />
                  <line x1="50" y1="50" x2="50" y2="10" stroke="#0D9488" strokeWidth="1" opacity="0.3" />
                  <line x1="50" y1="50" x2="70" y2="30" stroke="#0D9488" strokeWidth="1" opacity="0.3" />
                  <line x1="50" y1="50" x2="80" y2="50" stroke="#0D9488" strokeWidth="1" opacity="0.3" />
                  <line x1="50" y1="50" x2="70" y2="70" stroke="#0D9488" strokeWidth="1" opacity="0.3" />
                  <line x1="50" y1="50" x2="50" y2="90" stroke="#0D9488" strokeWidth="1" opacity="0.3" />
                  <line x1="50" y1="50" x2="30" y2="70" stroke="#0D9488" strokeWidth="1" opacity="0.3" />
                  <line x1="50" y1="50" x2="20" y2="50" stroke="#0D9488" strokeWidth="1" opacity="0.3" />
                  <line x1="50" y1="50" x2="30" y2="30" stroke="#0D9488" strokeWidth="1" opacity="0.3" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Maturity Radar</h3>
              <p className="text-teal-muted text-sm">
                8-dimension supply chain maturity assessment. Benchmark, identify gaps, set targets.
              </p>
            </div>

            {/* Inventory Matrix */}
            <div className="bg-navy-mid rounded-lg p-8 border border-gray-700">
              <div className="w-full h-48 mb-6 rounded-lg bg-gradient-to-br from-teal via-gold to-navy-mid flex items-center justify-center relative overflow-hidden">
                {/* ABC/XYZ Grid */}
                <svg className="w-40 h-40" viewBox="0 0 100 100">
                  {/* Grid lines */}
                  <line x1="33" y1="5" x2="33" y2="95" stroke="#0D9488" strokeWidth="1" opacity="0.3" />
                  <line x1="67" y1="5" x2="67" y2="95" stroke="#0D9488" strokeWidth="1" opacity="0.3" />
                  <line x1="5" y1="33" x2="95" y2="33" stroke="#0D9488" strokeWidth="1" opacity="0.3" />
                  <line x1="5" y1="67" x2="95" y2="67" stroke="#0D9488" strokeWidth="1" opacity="0.3" />
                  {/* Cells with color gradients */}
                  <rect x="5" y="5" width="28" height="28" fill="#0D9488" opacity="0.8" />
                  <rect x="37" y="5" width="28" height="28" fill="#14B8A6" opacity="0.7" />
                  <rect x="69" y="5" width="26" height="28" fill="#5EEAD4" opacity="0.6" />
                  <rect x="5" y="37" width="28" height="28" fill="#F59E0B" opacity="0.7" />
                  <rect x="37" y="37" width="28" height="28" fill="#FBBF24" opacity="0.6" />
                  <rect x="69" y="37" width="26" height="28" fill="#FCD34D" opacity="0.5" />
                  <rect x="5" y="69" width="28" height="26" fill="#FBBF24" opacity="0.6" />
                  <rect x="37" y="69" width="28" height="26" fill="#FCD34D" opacity="0.5" />
                  <rect x="69" y="69" width="26" height="26" fill="#FDE68A" opacity="0.4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Inventory Matrix</h3>
              <p className="text-teal-muted text-sm">
                ABC/XYZ segmentation in 9 cells. Automated classification by value and volatility.
              </p>
            </div>

            {/* Risk Heat Map */}
            <div className="bg-navy-mid rounded-lg p-8 border border-gray-700">
              <div className="w-full h-48 mb-6 rounded-lg bg-gradient-to-br from-navy-deep via-navy-mid to-navy flex items-center justify-center relative overflow-hidden">
                {/* Heat Map Grid */}
                <svg className="w-40 h-40" viewBox="0 0 100 100">
                  {/* Grid of cells with color intensity */}
                  {[
                    { x: 5, y: 5, color: '#06B6D4', opacity: 0.8 },
                    { x: 27, y: 5, color: '#06B6D4', opacity: 0.7 },
                    { x: 49, y: 5, color: '#F59E0B', opacity: 0.7 },
                    { x: 71, y: 5, color: '#EF4444', opacity: 0.8 },
                    { x: 5, y: 27, color: '#06B6D4', opacity: 0.6 },
                    { x: 27, y: 27, color: '#F59E0B', opacity: 0.6 },
                    { x: 49, y: 27, color: '#F59E0B', opacity: 0.7 },
                    { x: 71, y: 27, color: '#EF4444', opacity: 0.7 },
                    { x: 5, y: 49, color: '#F59E0B', opacity: 0.6 },
                    { x: 27, y: 49, color: '#F59E0B', opacity: 0.6 },
                    { x: 49, y: 49, color: '#EF4444', opacity: 0.6 },
                    { x: 71, y: 49, color: '#EF4444', opacity: 0.8 },
                    { x: 5, y: 71, color: '#F59E0B', opacity: 0.5 },
                    { x: 27, y: 71, color: '#EF4444', opacity: 0.6 },
                    { x: 49, y: 71, color: '#EF4444', opacity: 0.7 },
                    { x: 71, y: 71, color: '#DC2626', opacity: 0.9 },
                  ].map((cell, idx) => (
                    <rect
                      key={idx}
                      x={cell.x}
                      y={cell.y}
                      width="20"
                      height="20"
                      fill={cell.color}
                      opacity={cell.opacity}
                    />
                  ))}
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Risk Heat Map</h3>
              <p className="text-teal-muted text-sm">
                Supplier risk by concentration and location. Real-time alerts and mitigation paths.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <a
              href="/diagnostic"
              className="inline-flex items-center justify-center px-8 py-4 bg-teal hover:bg-teal-light text-navy font-bold rounded-lg transition-colors"
            >
              Try Our Live S&OP Assessment
              <ArrowRight className="ml-2 w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      {/* HOW WE DELIVER SECTION */}
      <section id="how" className="w-full bg-gray-50 py-20 md:py-28 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 md:mb-20">
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-navy mb-4">
              From First Conversation to Measurable Execution
            </h2>
          </div>

          {/* 4 Steps - Horizontal */}
          <div className="space-y-8 md:space-y-0 md:grid md:grid-cols-4 md:gap-6 mb-16">
            {/* Step 1 */}
            <div className="relative md:pb-8">
              <div className="bg-white rounded-lg p-6 md:p-8 border-2 border-teal border-opacity-20 h-full">
                <div className="bg-teal text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg mb-4">
                  1
                </div>
                <h3 className="text-lg font-bold text-navy mb-2">Problem Session</h3>
                <p className="text-sm text-gray-700 mb-3">
                  90-minute deep dive with your leadership team. Understand the full picture.
                </p>
                <div className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded inline-block">
                  Week 1
                </div>
              </div>
              {/* Connector */}
              <div className="hidden md:block absolute top-1/2 right-0 w-6 h-0.5 bg-gradient-to-r from-teal to-transparent transform translate-x-6" />
            </div>

            {/* Step 2 */}
            <div className="relative md:pb-8">
              <div className="bg-white rounded-lg p-6 md:p-8 border-2 border-teal border-opacity-20 h-full">
                <div className="bg-teal text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg mb-4">
                  2
                </div>
                <h3 className="text-lg font-bold text-navy mb-2">Rapid Assessment</h3>
                <p className="text-sm text-gray-700 mb-3">
                  Our AI engines run against your data. Full maturity assessment delivered.
                </p>
                <div className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded inline-block">
                  Week 2
                </div>
              </div>
              {/* Connector */}
              <div className="hidden md:block absolute top-1/2 right-0 w-6 h-0.5 bg-gradient-to-r from-teal to-transparent transform translate-x-6" />
            </div>

            {/* Step 3 */}
            <div className="relative md:pb-8">
              <div className="bg-white rounded-lg p-6 md:p-8 border-2 border-teal border-opacity-20 h-full">
                <div className="bg-teal text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg mb-4">
                  3
                </div>
                <h3 className="text-lg font-bold text-navy mb-2">Full Engagement</h3>
                <p className="text-sm text-gray-700 mb-3">
                  Execution phase. Implement decisions. Build your optimization roadmap.
                </p>
                <div className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded inline-block">
                  Weeks 3–6
                </div>
              </div>
              {/* Connector */}
              <div className="hidden md:block absolute top-1/2 right-0 w-6 h-0.5 bg-gradient-to-r from-teal to-transparent transform translate-x-6" />
            </div>

            {/* Step 4 */}
            <div className="relative">
              <div className="bg-white rounded-lg p-6 md:p-8 border-2 border-teal border-opacity-20 h-full">
                <div className="bg-teal text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg mb-4">
                  4
                </div>
                <h3 className="text-lg font-bold text-navy mb-2">Retainer Advisory</h3>
                <p className="text-sm text-gray-700 mb-3">
                  Ongoing decision support and continuous optimization. Stay ahead.
                </p>
                <div className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded inline-block">
                  Month 2+
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Summary */}
          <div className="bg-gradient-to-r from-navy to-navy-mid rounded-lg p-8 text-center text-white">
            <p className="text-lg font-bold mb-2">
              Senior-led | AI-enabled speed | Execution, not slides
            </p>
            <p className="text-teal">6 weeks, not 6 months</p>
          </div>
        </div>
      </section>

      {/* 4 PRACTICES SECTION */}
      <section className="w-full bg-navy py-20 md:py-28 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 md:mb-20">
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-4">
              End-to-End Supply Chain Execution
            </h2>
            <p className="text-teal-muted text-lg">
              Four integrated practices, one unified system
            </p>
          </div>

          {/* 4 Practice Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Practice 1 */}
            <div className="bg-navy-mid rounded-lg p-8 border border-gray-700 hover:border-teal transition-colors">
              <Gauge className="w-10 h-10 text-teal mb-4" />
              <h3 className="text-lg font-bold text-white mb-3">Planning & Execution</h3>
              <ul className="space-y-2 text-teal-muted text-sm">
                <li>• S&OP redesign</li>
                <li>• Demand sensing</li>
                <li>• Inventory optimization</li>
                <li>• Master scheduling</li>
              </ul>
            </div>

            {/* Practice 2 */}
            <div className="bg-navy-mid rounded-lg p-8 border border-gray-700 hover:border-teal transition-colors">
              <Activity className="w-10 h-10 text-teal mb-4" />
              <h3 className="text-lg font-bold text-white mb-3">Supply Resilience</h3>
              <ul className="space-y-2 text-teal-muted text-sm">
                <li>• Risk mapping</li>
                <li>• Supplier diversification</li>
                <li>• Dual sourcing</li>
                <li>• Continuity planning</li>
              </ul>
            </div>

            {/* Practice 3 */}
            <div className="bg-navy-mid rounded-lg p-8 border border-gray-700 hover:border-teal transition-colors">
              <Globe className="w-10 h-10 text-teal mb-4" />
              <h3 className="text-lg font-bold text-white mb-3">Network & Footprint</h3>
              <ul className="space-y-2 text-teal-muted text-sm">
                <li>• Logistics network design</li>
                <li>• Manufacturing footprint</li>
                <li>• DC location & sizing</li>
                <li>• Routing optimization</li>
              </ul>
            </div>

            {/* Practice 4 */}
            <div className="bg-navy-mid rounded-lg p-8 border border-gray-700 hover:border-teal transition-colors">
              <Zap className="w-10 h-10 text-teal mb-4" />
              <h3 className="text-lg font-bold text-white mb-3">Rapid Insights</h3>
              <ul className="space-y-2 text-teal-muted text-sm">
                <li>• Analytics dashboards</li>
                <li>• Predictive modeling</li>
                <li>• Decision automation</li>
                <li>• Real-time monitoring</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* LEAD CAPTURE CTA SECTION */}
      <section className="w-full bg-gradient-to-r from-teal to-teal-light py-20 md:py-28 px-4 md:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-navy mb-4">
            Ready to Stop Losing 3–8% of Revenue?
          </h2>
          <p className="text-lg text-navy text-opacity-80 mb-10 max-w-2xl mx-auto">
            Take our free S&OP Maturity Assessment — 12 minutes, 32 dimensions, instant results.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
            <a
              href="/diagnostic"
              className="inline-flex items-center justify-center px-8 py-4 bg-navy hover:bg-navy-mid text-white font-bold rounded-lg transition-colors"
            >
              Start Your Assessment Now
              <ArrowRight className="ml-2 w-5 h-5" />
            </a>
            <a
              href="https://calendly.com/caio-opsflow-advisory/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-navy text-navy hover:bg-navy hover:text-white font-bold rounded-lg transition-colors bg-white bg-opacity-50"
            >
              Book a 90-Min Problem Session
              <ArrowRight className="ml-2 w-5 h-5" />
            </a>
          </div>

          {/* Trust Line */}
          <p className="text-sm text-navy text-opacity-70">
            opsflow-advisory.ch · Nyon, Switzerland · MIT-certified methodology
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="w-full bg-navy py-12 md:py-16 px-4 md:px-8 border-t border-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-8">
            {/* Brand */}
            <div>
              <div className="text-2xl font-bold text-teal mb-2">OpsFlow</div>
              <div className="text-xs text-teal-muted mb-4">ADVISORY</div>
              <p className="text-teal-muted text-sm">
                Smarter supply chains. Built by people. Powered by AI.
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-bold text-white mb-4">Services</h4>
              <ul className="space-y-2 text-teal-muted text-sm">
                <li>
                  <a href="/diagnostic" className="hover:text-teal transition-colors">
                    S&OP Assessment
                  </a>
                </li>
                <li>
                  <a href="https://calendly.com/caio-opsflow-advisory/30min" target="_blank" rel="noopener noreferrer" className="hover:text-teal transition-colors">
                    Book a Session
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-teal transition-colors">
                    Retainer Advisory
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-bold text-white mb-4">Location</h4>
              <p className="text-teal-muted text-sm mb-2">
                Nyon & Rolle, Canton Vaud, Switzerland
              </p>
              <p className="text-teal-muted text-sm">
                <a href="https://opsflow-advisory.ch" target="_blank" rel="noopener noreferrer" className="hover:text-teal transition-colors">
                  opsflow-advisory.ch
                </a>
              </p>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 pt-8 text-center text-teal-muted text-sm">
            <p>&copy; 2026 OpsFlow Advisory. AI-powered execution for mid-market manufacturers.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
