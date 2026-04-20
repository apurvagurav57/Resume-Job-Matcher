import {
  Brain,
  Briefcase,
  CheckCircle2,
  FileText,
  Rocket,
  Workflow,
} from "lucide-react";
import { Link } from "react-router-dom";
import Footer from "../components/common/Footer";

const features = [
  {
    icon: Brain,
    title: "AI Analysis",
    text: "Parse your resume into structured skills and experience insights.",
  },
  {
    icon: Briefcase,
    title: "Smart Matching",
    text: "Get realistic scores and ranked jobs based on your profile.",
  },
  {
    icon: Workflow,
    title: "Application Tracker",
    text: "Track every job from saved to offer in one visual board.",
  },
];

const steps = [
  { icon: FileText, text: "Upload or paste your resume" },
  { icon: Brain, text: "AI extracts your profile" },
  { icon: Briefcase, text: "Get ranked matches instantly" },
  { icon: Rocket, text: "Track and improve applications" },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-bg text-white">
      <main className="mx-auto max-w-7xl space-y-16 px-4 py-14">
        <section className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/20 to-transparent p-10 text-center">
          <h1 className="text-4xl font-bold leading-tight md:text-6xl">
            ResuMatch: Find Jobs That Match Your Resume
          </h1>
          <p className="mx-auto mt-4 max-w-3xl text-lg text-gray-300">
            ResuMatch analyzes your resume, compares it against real openings,
            and gives practical match insights in seconds.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link to="/register" className="btn-primary">
              Get Started Free
            </Link>
            <Link to="/login" className="btn-secondary">
              See Demo
            </Link>
          </div>
        </section>
        <section className="grid gap-4 md:grid-cols-3">
          {features.map(({ icon: Icon, title, text }) => (
            <div key={title} className="card">
              <Icon className="h-8 w-8 text-primary" />
              <h3 className="mt-3 text-xl font-semibold">{title}</h3>
              <p className="mt-2 text-gray-400">{text}</p>
            </div>
          ))}
        </section>
        <section className="card">
          <h2 className="text-2xl font-semibold">How It Works</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-4">
            {steps.map(({ icon: Icon, text }, i) => (
              <div
                key={text}
                className="rounded-xl border border-gray-800 bg-surface p-4"
              >
                <p className="mb-2 text-xs text-primary">Step {i + 1}</p>
                <Icon className="h-6 w-6" />
                <p className="mt-2 text-sm text-gray-300">{text}</p>
              </div>
            ))}
          </div>
        </section>
        <section className="grid gap-4 md:grid-cols-3">
          {["10k+ Jobs Analyzed", "95% Match Accuracy", "Free to Use"].map(
            (label) => (
              <div key={label} className="card text-center">
                <CheckCircle2 className="mx-auto h-7 w-7 text-success" />
                <p className="mt-3 text-lg font-semibold">{label}</p>
              </div>
            ),
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
