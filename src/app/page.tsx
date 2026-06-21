// app/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  GraduationCap, 
  Users, 
  BookOpen, 
  Calendar, 
  Bell, 
  Menu, 
  X, 
  ChevronRight, 
  BarChart3, 
  Shield, 
  Zap,
  ArrowRight,
  CheckCircle2,
  School,
  Clock,
  Award,
  TrendingUp
} from 'lucide-react';

export default function HomePage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeRole, setActiveRole] = useState<'admin' | 'teacher' | 'student' | 'parent'>('admin');

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const stats = [
    { label: 'Students', value: '2,500+', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Teachers', value: '180+', icon: GraduationCap, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Courses', value: '120+', icon: BookOpen, color: 'text-violet-600', bg: 'bg-violet-50' },
    { label: 'Events', value: '50+', icon: Calendar, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  const features = [
    {
      title: 'Student Management',
      description: 'Complete lifecycle from admission to alumni. Track attendance, grades, and behavior in real-time.',
      icon: Users,
      color: 'bg-blue-600',
      lightColor: 'bg-blue-50',
      href: '/list/students'
    },
    {
      title: 'Academic Planning',
      description: 'Curriculum design, timetable generation, and examination management with automated grading.',
      icon: BookOpen,
      color: 'bg-emerald-600',
      lightColor: 'bg-emerald-50',
      href: '/list/lessons'
    },
    {
      title: 'Staff Administration',
      description: 'Teacher profiles, payroll, leave management, and performance evaluation dashboards.',
      icon: GraduationCap,
      color: 'bg-violet-600',
      lightColor: 'bg-violet-50',
      href: '/list/teachers'
    },
    {
      title: 'Scheduling & Events',
      description: 'Dynamic calendar, room booking, parent-teacher meetings, and school event coordination.',
      icon: Calendar,
      color: 'bg-amber-600',
      lightColor: 'bg-amber-50',
      href: '/list/events'
    },
    {
      title: 'Analytics & Reports',
      description: 'Comprehensive dashboards with attendance trends, grade distributions, and financial summaries.',
      icon: BarChart3,
      color: 'bg-rose-600',
      lightColor: 'bg-rose-50',
      href: '/list/results'
    },
    {
      title: 'Security & Access',
      description: 'Role-based access control, data encryption, and audit logs for complete data safety.',
      icon: Shield,
      color: 'bg-cyan-600',
      lightColor: 'bg-cyan-50',
      href: '/list/parents'
    },
  ];

  const roles = [
    {
      id: 'admin' as const,
      label: 'Administrator',
      desc: 'Full system access',
      icon: Shield,
      color: 'bg-indigo-600',
      features: ['Manage all users', 'View analytics', 'Configure settings', 'Financial oversight']
    },
    {
      id: 'teacher' as const,
      label: 'Teacher',
      desc: 'Classroom management',
      icon: GraduationCap,
      color: 'bg-emerald-600',
      features: ['Take attendance', 'Grade assignments', 'View schedules', 'Communicate with parents']
    },
    {
      id: 'student' as const,
      label: 'Student',
      desc: 'Learning portal',
      icon: School,
      color: 'bg-blue-600',
      features: ['View grades', 'Access materials', 'Submit assignments', 'Track progress']
    },
    {
      id: 'parent' as const,
      label: 'Parent',
      desc: 'Family oversight',
      icon: Users,
      color: 'bg-amber-600',
      features: ['Monitor grades', 'View attendance', 'Pay fees', 'Message teachers']
    }
  ];

  const navLinks = [
    { name: 'Dashboard', href: '/admin' },
    { name: 'Students', href: '/list/students' },
    { name: 'Teachers', href: '/list/teachers' },
    { name: 'Classes', href: '/list/classes' },
    { name: 'Calendar', href: '/list/events' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/90 backdrop-blur-md shadow-lg border-b border-slate-200/50' 
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20 group-hover:scale-105 transition-transform">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <span className={`text-xl font-bold tracking-tight ${isScrolled ? 'text-slate-900' : 'text-slate-900 lg:text-white'}`}>
                SchoolMS
              </span>
            </Link>

            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isScrolled ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100' : 'text-white/90 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="hidden lg:flex items-center gap-3">
              <button 
              aria-label=" User"
              className={`p-2 rounded-lg transition-colors ${isScrolled ? 'hover:bg-slate-100 text-slate-600' : 'hover:bg-white/10 text-white'}`}>
                <Bell className="w-5 h-5" />
              </button>
              <Link
                href="/sign-in"
                className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  isScrolled
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-600/20'
                    : 'bg-white text-indigo-600 hover:bg-indigo-50'
                }`}
              >
                Sign In
              </Link>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 shadow-xl">
            <div className="px-4 py-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="block px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-indigo-600 font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-4 pb-2 border-t border-slate-100 mt-2">
                <Link
                  href="/sign-in"
                  className="flex items-center justify-center w-full px-5 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 pt-32 pb-20 lg:pt-48 lg:pb-32">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        </div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium mb-8">
            <Zap className="w-4 h-4" />
            <span>v2.0 Now with advanced analytics</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white tracking-tight mb-6 leading-tight">
            School Management
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">
              Made Simple
            </span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-slate-400 mb-10 leading-relaxed">
            A comprehensive platform for modern educational institutions. Streamline administration, 
            enhance learning outcomes, and connect your entire school community.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/admin"
              className="group flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/40"
            >
              Access Dashboard
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/sign-in"
              className="flex items-center gap-2 px-8 py-4 bg-white/5 text-white border border-white/10 rounded-xl font-semibold hover:bg-white/10 transition-all backdrop-blur-sm"
            >
              Sign In
            </Link>
          </div>

          <div className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8 max-w-4xl mx-auto">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors"
              >
                <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className="text-2xl lg:text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Role Selector Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Tailored for Every Role
            </h2>
            <p className="text-lg text-slate-600">
              Different dashboards and permissions for administrators, teachers, students, and parents.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Role Tabs */}
            <div className="lg:col-span-4 space-y-3">
              {roles.map((role) => (
                <button
                  key={role.id}
                  onClick={() => setActiveRole(role.id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                    activeRole === role.id
                      ? 'border-indigo-600 bg-indigo-50 shadow-md'
                      : 'border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className={`w-12 h-12 ${role.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <role.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className={`font-semibold ${activeRole === role.id ? 'text-indigo-900' : 'text-slate-900'}`}>
                      {role.label}
                    </div>
                    <div className="text-sm text-slate-500">{role.desc}</div>
                  </div>
                  <ChevronRight className={`w-5 h-5 ml-auto transition-transform ${activeRole === role.id ? 'text-indigo-600 rotate-90' : 'text-slate-400'}`} />
                </button>
              ))}
            </div>

            {/* Role Preview */}
            <div className="lg:col-span-8">
              <div className="bg-slate-50 rounded-2xl border border-slate-200 p-8 h-full">
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-10 h-10 ${roles.find(r => r.id === activeRole)?.color} rounded-lg flex items-center justify-center`}>
                    {React.createElement(roles.find(r => r.id === activeRole)?.icon || Shield, { className: "w-5 h-5 text-white" })}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">
                      {roles.find(r => r.id === activeRole)?.label} Portal
                    </h3>
                    <p className="text-sm text-slate-500">
                      {roles.find(r => r.id === activeRole)?.desc}
                    </p>
                  </div>
                  <Link
                    href={`/${activeRole}`}
                    className="ml-auto px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors"
                  >
                    Enter Portal
                  </Link>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {roles.find(r => r.id === activeRole)?.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                      <span className="font-medium text-slate-700">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Mock UI Preview based on role */}
                <div className="mt-6 bg-white rounded-xl border border-slate-200 overflow-hidden">
                  <div className="bg-slate-100 border-b border-slate-200 px-4 py-3 flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-400" />
                      <div className="w-3 h-3 rounded-full bg-amber-400" />
                      <div className="w-3 h-3 rounded-full bg-emerald-400" />
                    </div>
                    <div className="flex-1 text-center text-xs text-slate-500 font-medium">
                      {activeRole.charAt(0).toUpperCase() + activeRole.slice(1)} Dashboard
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      {[
                        { label: activeRole === 'admin' ? 'Total Users' : activeRole === 'teacher' ? 'My Classes' : activeRole === 'student' ? 'My Courses' : 'Children', val: activeRole === 'admin' ? '2.8k' : '6', color: 'bg-blue-100 text-blue-700' },
                        { label: activeRole === 'admin' ? 'Revenue' : activeRole === 'teacher' ? 'Students' : activeRole === 'student' ? 'Assignments' : 'Fees Due', val: activeRole === 'admin' ? '$48k' : '32', color: 'bg-emerald-100 text-emerald-700' },
                        { label: 'Pending', val: activeRole === 'admin' ? '12' : activeRole === 'teacher' ? '5' : '3', color: 'bg-amber-100 text-amber-700' },
                      ].map((stat, i) => (
                        <div key={i} className={`${stat.color} rounded-lg p-3 text-center`}>
                          <div className="text-lg font-bold">{stat.val}</div>
                          <div className="text-xs opacity-80">{stat.label}</div>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                          <div className="w-8 h-8 rounded-full bg-slate-200" />
                          <div className="flex-1">
                            <div className="h-2 bg-slate-200 rounded w-3/4 mb-1" />
                            <div className="h-2 bg-slate-100 rounded w-1/2" />
                          </div>
                          <div className="text-xs text-slate-400">2m ago</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Complete School Management
            </h2>
            <p className="text-lg text-slate-600">
              Powerful modules designed specifically for educational institutions.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <Link
                key={idx}
                href={feature.href}
                className="group relative p-8 rounded-2xl border border-slate-200 bg-white hover:shadow-xl hover:shadow-slate-200/50 hover:border-indigo-100 transition-all duration-300"
              >
                <div className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-slate-600 leading-relaxed mb-4">
                  {feature.description}
                </p>
                <div className="flex items-center text-indigo-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Manage <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-sm font-medium mb-6">
                <TrendingUp className="w-4 h-4" />
                <span>Live Analytics</span>
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6">
                Real-time Insights for
                <span className="text-indigo-600"> Better Decisions</span>
              </h2>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                Your existing components — <code className="bg-slate-100 px-2 py-1 rounded text-sm text-slate-700">AttendanceChart</code>, <code className="bg-slate-100 px-2 py-1 rounded text-sm text-slate-700">CountChart</code>, <code className="bg-slate-100 px-2 py-1 rounded text-sm text-slate-700">FinanceChart</code> — all feed into a unified dashboard experience.
              </p>
              
              <div className="space-y-4">
                {[
                  'Live attendance tracking with your BigCalendar integration',
                  'Automated grade calculation and report generation',
                  'Financial overview with fee collection analytics',
                  'Parent portal with real-time notifications',
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700 font-medium">{item}</span>
                  </div>
                ))}
              </div>

              <Link
                href="/admin"
                className="inline-flex items-center gap-2 mt-10 px-6 py-3 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-colors"
              >
                View Dashboard
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="mt-12 lg:mt-0 relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-3xl opacity-20 blur-2xl" />
              <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
                <div className="bg-slate-100 border-b border-slate-200 px-4 py-3 flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-amber-400" />
                    <div className="w-3 h-3 rounded-full bg-emerald-400" />
                  </div>
                  <div className="flex-1 text-center text-xs text-slate-500 font-medium">Admin Dashboard</div>
                </div>
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { label: 'Attendance', val: '94%', color: 'bg-emerald-100 text-emerald-700' },
                      { label: 'Avg Grade', val: 'B+', color: 'bg-blue-100 text-blue-700' },
                      { label: 'Revenue', val: '$48k', color: 'bg-violet-100 text-violet-700' },
                    ].map((stat, i) => (
                      <div key={i} className={`${stat.color} rounded-lg p-3 text-center`}>
                        <div className="text-lg font-bold">{stat.val}</div>
                        <div className="text-xs opacity-80">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                  <div className="h-32 bg-slate-50 rounded-lg flex items-end justify-around p-4 gap-2 border border-slate-100">
                    {[40, 65, 45, 80, 55, 70, 60].map((h, i) => (
                      <div key={i} className="w-full bg-indigo-500 rounded-t-sm opacity-80 hover:opacity-100 transition-opacity" style={{ height: `${h}%` }} />
                    ))}
                  </div>
                  <div className="space-y-2">
                    {[
                      { title: 'Math Exam - Grade 10', time: 'Today, 9:00 AM', icon: Clock },
                      { title: 'Parent Meeting', time: 'Today, 2:00 PM', icon: Calendar },
                      { title: 'Assignment Due: Physics', time: 'Tomorrow', icon: Award },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                        <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center">
                          <item.icon className="w-4 h-4 text-slate-600" />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-slate-900">{item.title}</div>
                          <div className="text-xs text-slate-500">{item.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Access Modules */}
      <section className="py-24 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Quick Access to Your Modules
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Direct links to all your existing list pages and management tools.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              { name: 'Students', href: '/list/students', icon: Users, count: '2,403' },
              { name: 'Teachers', href: '/list/teachers', icon: GraduationCap, count: '182' },
              { name: 'Parents', href: '/list/parents', icon: Users, count: '1,890' },
              { name: 'Classes', href: '/list/classes', icon: School, count: '48' },
              { name: 'Subjects', href: '/list/subjects', icon: BookOpen, count: '64' },
              { name: 'Lessons', href: '/list/lessons', icon: Calendar, count: '320' },
              { name: 'Exams', href: '/list/exams', icon: Award, count: '12' },
              { name: 'Assignments', href: '/list/assignments', icon: BookOpen, count: '45' },
              { name: 'Results', href: '/list/results', icon: BarChart3, count: 'View' },
              { name: 'Attendance', href: '/list/attendance', icon: CheckCircle2, count: 'Track' },
              { name: 'Events', href: '/list/events', icon: Calendar, count: '8' },
              { name: 'Announcements', href: '/list/announcements', icon: Bell, count: '3 New' },
            ].map((module, idx) => (
              <Link
                key={idx}
                href={module.href}
                className="group p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl hover:bg-white/10 hover:border-white/20 transition-all"
              >
                <module.icon className="w-8 h-8 text-indigo-400 mb-4 group-hover:scale-110 transition-transform" />
                <div className="text-white font-semibold mb-1">{module.name}</div>
                <div className="text-sm text-slate-400">{module.count}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-5xl font-bold text-slate-900 mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-slate-600 mb-10 max-w-2xl mx-auto">
            Your school management system is already set up. Sign in to access your dashboard based on your role.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/sign-in"
              className="px-8 py-4 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/25 w-full sm:w-auto"
            >
              Sign In to Dashboard
            </Link>
            <Link
              href="/admin"
              className="px-8 py-4 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition-all w-full sm:w-auto"
            >
              Preview as Admin
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-50 border-t border-slate-200 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <Link href="/" className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold text-slate-900">SchoolMS</span>
              </Link>
              <p className="text-slate-600 text-sm leading-relaxed">
                Comprehensive school management for modern education.
              </p>
            </div>
            
            {[
              { title: 'Modules', links: ['Students', 'Teachers', 'Classes', 'Calendar'] },
              { title: 'System', links: ['Dashboard', 'Sign In', 'Admin', 'Settings'] },
              { title: 'Support', links: ['Documentation', 'Help Center', 'Contact'] },
            ].map((group, idx) => (
              <div key={idx}>
                <h4 className="font-semibold text-slate-900 mb-4">{group.title}</h4>
                <ul className="space-y-2">
                  {group.links.map((link, i) => (
                    <li key={i}>
                      <Link href="#" className="text-sm text-slate-600 hover:text-indigo-600 transition-colors">
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-500">
              © 2026 School Management System. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-slate-500">
              <Link href="#" className="hover:text-slate-900">Privacy</Link>
              <Link href="#" className="hover:text-slate-900">Terms</Link>
              <Link href="#" className="hover:text-slate-900">Cookies</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

//postgres://aed5cefb5701a250cc62b454ae956c793aca4f8c83cdc49956a156d668f7cc34:sk_k_e1tlRjge_10HdPhJh5W@db.prisma.io:5432/postgres?sslmode=require