"use client";
import React, { useState, useEffect } from "react";
import {
  Shield,
  Users,
  CheckCircle,
  Eye,
  Lock,
  Smartphone,
  BarChart3,
  Clock,
  ArrowRight,
  Menu,
  X,
  ChevronDown,
  Vote,
  Globe,
  Zap,
  Award,
  FileCheck,
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  Calendar,
  TrendingUp,
  Star,
} from "lucide-react";
import Link from "next/link";

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [currentElection, setCurrentElection] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const [stats, setStats] = useState({
    voters: 0,
    elections: 0,
    participation: 0,
  });

  // Handle client-side hydration
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Animated counter effect
  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prev) => ({
        voters: prev.voters < 15420 ? prev.voters + 127 : 15420,
        elections: prev.elections < 48 ? prev.elections + 1 : 48,
        participation: prev.participation < 89 ? prev.participation + 1 : 89,
      }));
    }, 100);

    const timeout = setTimeout(() => clearInterval(interval), 3000);
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  // Auto-scroll elections
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentElection((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Top-Level Security",
      description:
        "256-bit encryption and multi-factor authentication protect every vote",
    },
    {
      icon: <Eye className="w-8 h-8" />,
      title: "Complete Transparency",
      description:
        "Real-time results and comprehensive audit trails for full accountability",
    },
    {
      icon: <Lock className="w-8 h-8" />,
      title: "Anonymous Voting",
      description:
        "Your vote remains private while ensuring it's counted accurately",
    },
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: "Mobile Optimized",
      description:
        "Vote securely from any device, anywhere on campus or remotely",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Register Account",
      description:
        "Sign up with your university credentials and verify your identity",
    },
    {
      number: "02",
      title: "Email Verification",
      description:
        "Confirm your university email to activate your voting account",
    },
    {
      number: "03",
      title: "Browse Elections",
      description: "View all available elections and candidate information",
    },
    {
      number: "04",
      title: "Cast Your Vote",
      description: "Make your selection and submit your secure, encrypted vote",
    },
    {
      number: "05",
      title: "Get Confirmation",
      description:
        "Receive instant confirmation with your unique voting receipt",
    },
  ];

  const elections = [
    {
      title: "Student Union President 2024",
      status: "Active",
      participants: "12,450",
      timeLeft: "2 days left",
      bgColor: "from-green-500 to-emerald-600",
    },
    {
      title: "Faculty Senate Elections",
      status: "Upcoming",
      participants: "Opening Soon",
      timeLeft: "Starts in 5 days",
      bgColor: "from-green-400 to-green-500",
    },
    {
      title: "Campus Activities Board",
      status: "Completed",
      participants: "8,920",
      timeLeft: "Results Available",
      bgColor: "from-gray-400 to-gray-500",
    },
  ];

  const faqs = [
    {
      question: "How do I register for the voting system?",
      answer:
        "Simply click 'Register' and use your university credentials. You'll need your student ID, university email, and phone number for verification.",
    },
    {
      question: "Is my vote really anonymous and secure?",
      answer:
        "Yes! We use advanced encryption and top level technology to ensure your vote is completely anonymous while maintaining a verifiable audit trail.",
    },
    {
      question: "What happens if I try to vote twice?",
      answer:
        "Our system prevents duplicate voting through multiple security layers including session management, database constraints, and real-time monitoring.",
    },
    {
      question: "Can I vote from my mobile device?",
      answer:
        "Absolutely! Our platform is fully responsive and optimized for mobile devices, tablets, and desktop computers.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <Vote className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">UATVote</h1>
                <p className="text-xs text-gray-500">Secure Digital Voting</p>
              </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#home"
                className="text-gray-700 hover:text-green-600 transition-colors font-medium"
              >
                Home
              </a>
              <a
                href="#features"
                className="text-gray-700 hover:text-green-600 transition-colors font-medium"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="text-gray-700 hover:text-green-600 transition-colors font-medium"
              >
                How It Works
              </a>
              <a
                href="#elections"
                className="text-gray-700 hover:text-green-600 transition-colors font-medium"
              >
                Elections
              </a>
              <a
                href="#contact"
                className="text-gray-700 hover:text-green-600 transition-colors font-medium"
              >
                Contact
              </a>

              <div className="flex items-center space-x-3">
                <Link href={"/login"}>
                  <button className="px-4 py-2 text-green-600 hover:text-green-700 font-medium transition-colors">
                    Login
                  </button>
                </Link>
                <Link href={"/register"}>
                  <button className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
                    Register
                  </button>
                </Link>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-white shadow-lg border-t">
            <div className="p-4 space-y-4">
              <a
                href="#home"
                className="block text-gray-700 hover:text-green-600 font-medium"
              >
                Home
              </a>
              <a
                href="#features"
                className="block text-gray-700 hover:text-green-600 font-medium"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="block text-gray-700 hover:text-green-600 font-medium"
              >
                How It Works
              </a>
              <a
                href="#elections"
                className="block text-gray-700 hover:text-green-600 font-medium"
              >
                Elections
              </a>
              <a
                href="#contact"
                className="block text-gray-700 hover:text-green-600 font-medium"
              >
                Contact
              </a>
              <div className="pt-4 border-t space-y-3">
                <button className="block w-full text-left text-green-600 font-medium">
                  Login
                </button>
                <button className="block w-full px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg text-center">
                  Register
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section
        id="home"
        className="pt-24 pb-16 bg-gradient-to-br from-green-50 via-white to-emerald-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center px-4 py-2 bg-green-100 rounded-full text-green-700 text-sm font-medium mb-6">
                <Zap className="w-4 h-4 mr-2" />
                Secure • Transparent • Accessible
              </div>

              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Digital Voting
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-600">
                  Made Simple
                </span>
              </h1>

              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Experience the future of university elections with our secure,
                transparent, and user-friendly e-voting platform. Every vote
                counts, every voice matters.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href={"/register"}>
                  {" "}
                  <button className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center">
                    Start Voting Now
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </button>
                </Link>
                {/* <button className="px-8 py-4 border-2 border-green-500 text-green-600 rounded-xl font-semibold hover:bg-green-50 transition-all duration-300 flex items-center justify-center">
                  View Demo
                  <Eye className="w-5 h-5 ml-2" />
                </button> */}
              </div>
            </div>

            <div className="relative">
              {/* Floating Stats Cards */}
              <div className="absolute -top-8 -left-8 bg-white rounded-2xl p-6 shadow-xl border border-green-100 transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.voters.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600">Registered Voters</p>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-8 -right-8 bg-white rounded-2xl p-6 shadow-xl border border-green-100 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.participation}%
                    </p>
                    <p className="text-sm text-gray-600">Participation</p>
                  </div>
                </div>
              </div>

              {/* Main Image Placeholder */}
              <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-3xl p-8 h-96 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-4">
                    <Vote className="w-12 h-12 text-white" />
                  </div>
                  <p className="text-green-700 font-semibold">
                    Secure Voting Interface
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose Our Platform?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built with cutting-edge security and user experience in mind, our
              platform ensures fair, transparent, and accessible elections for
              everyone.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-8 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section
        id="how-it-works"
        className="py-20 bg-gradient-to-br from-green-50 via-white to-emerald-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Getting started is simple. Follow these five easy steps to
              participate in university elections.
            </p>
          </div>

          <div className="relative">
            {/* Connection Lines */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-green-200 via-green-300 to-green-200 transform -translate-y-1/2"></div>

            <div className="grid lg:grid-cols-5 gap-8">
              {steps.map((step, index) => (
                <div key={index} className="relative">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-xl font-bold shadow-lg relative z-10">
                      {step.number}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Current Elections Section */}
      <section id="elections" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Current Elections
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Stay updated with ongoing and upcoming elections. Your
              participation shapes the future of our university.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {elections.map((election, index) => (
              <div
                key={index}
                className={`relative overflow-hidden rounded-2xl p-8 text-white bg-gradient-to-br ${election.bgColor} transform hover:scale-105 transition-all duration-300 shadow-xl`}
              >
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
                      {election.status}
                    </span>
                    <Clock className="w-5 h-5" />
                  </div>

                  <h3 className="text-xl font-bold mb-3 leading-tight">
                    {election.title}
                  </h3>

                  <div className="space-y-2 mb-6">
                    <div className="flex justify-between">
                      <span className="opacity-90">Participants:</span>
                      <span className="font-semibold">
                        {election.participants}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="opacity-90">Status:</span>
                      <span className="font-semibold">{election.timeLeft}</span>
                    </div>
                  </div>

                  <button className="w-full py-3 bg-white/20 hover:bg-white/30 rounded-lg font-semibold transition-all duration-300 backdrop-blur-sm">
                    {election.status === "Active"
                      ? "Vote Now"
                      : election.status === "Upcoming"
                      ? "Set Reminder"
                      : "View Results"}
                  </button>
                </div>

                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white"></div>
                  <div className="absolute -left-4 -bottom-4 w-24 h-24 rounded-full bg-white"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 bg-gradient-to-br from-green-50 via-white to-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-2">
                {stats.voters.toLocaleString()}
              </p>
              <p className="text-gray-600">Registered Voters</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Vote className="w-8 h-8 text-white" />
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-2">
                {stats.elections}
              </p>
              <p className="text-gray-600">Elections Conducted</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-2">
                {stats.participation}%
              </p>
              <p className="text-gray-600">Average Participation</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-white" />
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-2">99.9%</p>
              <p className="text-gray-600">System Uptime</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Got questions? Weve got answers. Heres everything you need to know
              about our e-voting system.
            </p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 hover:shadow-lg transition-all duration-300"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                  <MessageCircle className="w-5 h-5 text-green-600 mr-3" />
                  {faq.question}
                </h3>
                <p className="text-gray-600 leading-relaxed pl-8">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        className="py-20 bg-gradient-to-br from-green-50 via-white to-emerald-50"
      >
        <div className="max-w-7xl mx-auto px-4  sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Need Help?
            </h2>
            <p className="text-xl text-gray-600">
              Our support team is here to assist you with any questions or
              technical issues.
            </p>
          </div>

          <div className=" flex flex-row justify-center gap-8">
            <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Phone className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Call Us</h3>
              <p className="text-gray-600 mb-4">
                Get immediate assistance from our support team
              </p>
              <p className="font-semibold text-green-600">
                +234 (906) 335-5315
              </p>
            </div>

            <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Email Support
              </h3>
              <p className="text-gray-600 mb-4">
                Send us your questions anytime
              </p>
              <p className="font-semibold text-green-600">
                oluseyiwmwm@gmail.com
              </p>
            </div>

            {/* <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Visit Us</h3>
              <p className="text-gray-600 mb-4">
                IT Support Center, Main Campus
              </p>
              <p className="font-semibold text-green-600">
                Room 204, Admin Building
              </p>
            </div> */}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <Vote className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">UniVote</h3>
                  <p className="text-sm text-gray-400">Secure Digital Voting</p>
                </div>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Empowering democratic participation through secure, transparent,
                and accessible digital voting technology.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-6">Quick Links</h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-green-400 transition-colors"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-green-400 transition-colors"
                  >
                    How It Works
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-green-400 transition-colors"
                  >
                    Security
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-green-400 transition-colors"
                  >
                    Support
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-6">Legal</h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-green-400 transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-green-400 transition-colors"
                  >
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-green-400 transition-colors"
                  >
                    Cookie Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-green-400 transition-colors"
                  >
                    Accessibility
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-6">System Status</h4>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-gray-400">System Online</span>
                </div>
                <div className="text-sm text-gray-500">
                  {isClient
                    ? `Last updated: ${new Date().toLocaleString()}`
                    : "Last updated: Loading..."}
                </div>
                <div className="text-sm text-gray-500">Version 2.1.0</div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>
              &copy; 2024 UniVote - University E-Voting System. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
