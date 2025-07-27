"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

import {
  ClipboardDocumentListIcon,
  CalendarIcon,
  ChartBarIcon,
  BanknotesIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  BeakerIcon,
} from "@heroicons/react/24/outline";

export default function Home() {
  useEffect(() => {
    AOS.init({ once: true, duration: 1000, easing: "ease-in-out" });
  }, []);

  const features = [
    {
      title: "Task Management",
      subtitle: "Streamline Your Workflow",
      description:
        "Effortlessly organize your tasks with customizable categories, due dates, and progress tracking. Drag and drop tasks across stages, create checklists, and set priorities to stay focused. Perfect for managing projects or daily to-dos with a clean, intuitive interface.",
      icon: <ClipboardDocumentListIcon className="w-8 h-8" />,
      color: "from-blue-200 to-blue-300",
      iconColor: "text-blue-500",
      href: "/task",
      screenshot: "/assets/task.png",
    },
    {
      title: "Daily Planner",
      subtitle: "Plan with Precision",
      description:
        "Schedule your day with time-blocked slots and smart suggestions. Sync tasks and events, get real-time updates, and enjoy a clutter-free design that helps you focus on what matters most. Ideal for busy professionals and students alike.",
      icon: <CalendarIcon className="w-8 h-8" />,
      color: "from-purple-200 to-purple-300",
      iconColor: "text-purple-500",
      href: "/planner",
      screenshot: "/assets/planner.png",
    },
    {
      title: "Habit Tracker",
      subtitle: "Build Lasting Habits",
      description:
        "Track your habits with beautiful weekly and monthly visualizations. Set goals, monitor streaks, and receive gentle reminders to stay consistent. Whether it's exercise, reading, or mindfulness, FocusZen helps you build routines that stick.",
      icon: <ChartBarIcon className="w-8 h-8" />,
      color: "from-green-200 to-green-300",
      iconColor: "text-green-500",
      href: "/habits",
      screenshot: "/assets/habits.png",
    },
    {
      title: "Expense Tracker",
      subtitle: "Master Your Finances",
      description:
        "Categorize expenses, set budgets, and visualize spending patterns with clear charts. FocusZen's expense tracker simplifies financial management, helping you save more and stress less with insightful summaries and alerts.",
      icon: <BanknotesIcon className="w-8 h-8" />,
      color: "from-pink-200 to-pink-300",
      iconColor: "text-pink-500",
      href: "/expense",
      screenshot: "/assets/expense.png",
    },
    {
      title: "Dashboard Analytics",
      subtitle: "See Your Progress",
      description:
        "Get a holistic view of your productivity with integrated analytics. Track task completion, habit consistency, and spending trends in one place. Customizable charts and insights empower you to optimize your daily routine.",
      icon: <ChartBarIcon className="w-8 h-8" />,
      color: "from-indigo-200 to-indigo-300",
      iconColor: "text-indigo-500",
      href: "/dashboard",
      screenshot: "/assets/task.png", // Using task image as placeholder since dashboard image doesn't exist
    },
  ];

  const benefits = [
    {
      title: "Intuitive Design",
      description:
        "Enjoy a clean, distraction-free interface that makes productivity feel effortless and calming.",
      icon: <CheckCircleIcon className="w-6 h-6" />,
    },
    {
      title: "All-in-One Solution",
      description:
        "Manage tasks, habits, schedules, and finances in one seamless platform, reducing app overload.",
      icon: <CheckCircleIcon className="w-6 h-6" />,
    },
    {
      title: "Personalized Insights",
      description:
        "Receive tailored recommendations to improve your routines and achieve your goals faster.",
      icon: <CheckCircleIcon className="w-6 h-6" />,
    },
    {
      title: "Seamless Experience",
      description:
        "Sync across devices and access your data anytime, anywhere with a fluid, responsive design.",
      icon: <CheckCircleIcon className="w-6 h-6" />,
    },
  ];

  return (
    <div className="min-h-screen font-['Inter'] bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BeakerIcon className="w-6 h-6 text-indigo-500" />
            <span className="text-xl font-semibold text-gray-800">FocusZen</span>
          </div>
          <Link
            href="/dashboard"
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 text-sm transition-all duration-300"
          >
            Launch App <ArrowRightIcon className="w-4 h-4" />
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <header className="pt-24 pb-16 text-center px-6">
        <h1
          className="text-4xl md:text-6xl font-bold text-gray-800 leading-tight"
          data-aos="fade-down"
          data-aos-delay="100"
        >
          Find{" "}
          <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
            Peace
          </span>{" "}
          in Productivity
        </h1>
        <p
          className="text-lg md:text-xl text-gray-500 mt-4 max-w-2xl mx-auto"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          A serene, all-in-one suite to plan tasks, track habits, manage finances, and optimize your day.
        </p>
        <div
          className="mt-8 flex justify-center gap-4 flex-wrap"
          data-aos="fade-up"
          data-aos-delay="300"
        >
          <Link
            href="/dashboard"
            className="bg-indigo-500 text-white px-6 py-3 rounded-lg text-base font-medium hover:bg-indigo-600 transition-all duration-300"
          >
            Get Started
          </Link>
          <button className="text-indigo-500 font-medium text-base hover:text-indigo-600 transition-all duration-300">
            Watch Demo
          </button>
        </div>
      </header>

      {/* Features */}
      <section className="py-16 bg-white/50">
        <div className="max-w-7xl mx-auto px-6">
          <h2
            className="text-3xl md:text-4xl font-semibold text-center text-gray-800 mb-12"
            data-aos="fade-up"
          >
            Discover Your Productivity Suite
          </h2>
          {features.map((feature, i) => (
            <div
              key={i}
              className={`py-12 flex flex-col ${i % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"} items-center gap-8`}
              data-aos="fade-up"
              data-aos-delay={i * 150}
            >
              <div className="lg:w-1/2">
                <div
                  className={`w-12 h-12 mb-4 flex items-center justify-center rounded-lg bg-gradient-to-br ${feature.color}`}
                >
                  <div className={`${feature.iconColor}`}>{feature.icon}</div>
                </div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                  {feature.title}
                </h3>
                <h4 className="text-lg text-gray-600 mb-4">{feature.subtitle}</h4>
                <p className="text-gray-500 text-base mb-6">{feature.description}</p>
                <Link
                  href={feature.href}
                  className="inline-flex items-center text-base font-medium text-indigo-500 hover:text-indigo-600 transition-all duration-300"
                >
                  Explore {feature.title} <ArrowRightIcon className="w-4 h-4 ml-2" />
                </Link>
              </div>
              <div className="lg:w-1/2">
                <div className="relative bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
                  <Image
                    src={feature.screenshot}
                    alt={`${feature.title} Screenshot`}
                    width={600}
                    height={400}
                    className="w-full h-auto object-cover"
                    priority={i < 2} // Prioritize first two images
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2
            className="text-3xl md:text-4xl font-semibold text-center text-gray-800 mb-12"
            data-aos="fade-up"
          >
            Why FocusZen?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {benefits.map((benefit, idx) => (
              <div
                key={idx}
                className="bg-white/80 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300"
                data-aos="zoom-in"
                data-aos-delay={idx * 150}
              >
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                  <div className="text-indigo-500">{benefit.icon}</div>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-500 text-base">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-indigo-100 to-purple-100 text-center">
        <h2
          className="text-3xl md:text-4xl font-semibold text-gray-800 mb-4"
          data-aos="fade-up"
        >
          Begin Your Calm Productivity Journey
        </h2>
        <p
          className="text-lg text-gray-500 mb-6 max-w-2xl mx-auto"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          Transform the way you manage your day with FocusZen's intuitive tools.
        </p>
        <Link
          href="/dashboard"
          className="bg-indigo-500 text-white px-6 py-3 rounded-lg font-medium text-base hover:bg-indigo-600 transition-all duration-300 inline-flex items-center gap-2"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          Launch Now <ArrowRightIcon className="w-4 h-4" />
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-8 text-center">
        <p className="text-sm">&copy; 2025 FocusZen. All rights reserved.</p>
      </footer>
    </div>
  );
}