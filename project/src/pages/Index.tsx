import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Video, Calendar, Pill, Shield, Clock, Star, ArrowRight, Activity, Stethoscope, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  }),
};

const features = [
  { icon: Video, title: 'Video Consultations', description: 'Connect with doctors face-to-face from home via HD video calls', color: 'bg-primary' },
  { icon: Calendar, title: 'Easy Scheduling', description: 'Book appointments instantly or schedule for later at your convenience', color: 'bg-info' },
  { icon: Pill, title: 'Digital Prescriptions', description: 'Receive and manage prescriptions digitally with pharmacy integration', color: 'bg-success' },
  { icon: MapPin, title: 'Pharmacy Finder', description: 'Locate nearby pharmacies and check medicine availability in real-time', color: 'bg-accent' },
  { icon: Activity, title: 'Symptom Checker', description: 'AI-powered symptom analysis to guide you to the right specialist', color: 'bg-warning' },
  { icon: Shield, title: 'Health Records', description: 'Secure storage and easy access to all your medical history', color: 'bg-destructive' },
];

const stats = [
  { value: '10K+', label: 'Happy Patients' },
  { value: '500+', label: 'Expert Doctors' },
  { value: '24/7', label: 'Available' },
  { value: '4.8★', label: 'Rating' },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background font-body">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-gradient-primary flex items-center justify-center">
              <Heart className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-bold text-foreground">MeDora</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">How it Works</a>
            <a href="#stats" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm">Log in</Button>
            </Link>
            <Link to="/signup">
              <Button size="sm" className="bg-gradient-primary text-primary-foreground shadow-primary hover:opacity-90">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary via-background to-background" />
        <div className="absolute top-20 right-0 w-[500px] h-[500px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-accent/5 blur-3xl" />

        <div className="container mx-auto relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary text-secondary-foreground text-sm font-medium mb-6">
                <Stethoscope className="w-4 h-4" />
                Trusted by 10,000+ patients
              </span>
            </motion.div>

            <motion.h1
              className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6"
              initial="hidden" animate="visible" variants={fadeUp} custom={1}
            >
              Healthcare at Your{' '}
              <span className="text-gradient-primary">Fingertips</span>
            </motion.h1>

            <motion.p
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
              initial="hidden" animate="visible" variants={fadeUp} custom={2}
            >
              Connect with expert doctors, manage prescriptions, and track your health — all from the comfort of your home.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
              initial="hidden" animate="visible" variants={fadeUp} custom={3}
            >
              <Link to="/signup">
                <Button size="lg" className="bg-gradient-primary text-primary-foreground shadow-primary hover:opacity-90 px-8 h-12 text-base">
                  Start Free Consultation
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg" className="h-12 px-8 text-base">
                  I already have an account
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Stats */}
          <motion.div
            id="stats"
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto"
            initial="hidden" animate="visible" variants={fadeUp} custom={5}
          >
            {stats.map((stat) => (
              <div key={stat.label} className="text-center p-4 rounded-xl bg-card shadow-card">
                <div className="font-display text-2xl md:text-3xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Everything You Need</h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              A complete healthcare platform designed for patients, doctors, and pharmacies.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                className="group p-6 rounded-2xl bg-card shadow-card hover:shadow-card-hover transition-all duration-300 border border-border hover:border-primary/20"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-4`}>
                  <feature.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="font-display text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-20 px-6 bg-secondary/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground text-lg">Three simple steps to better healthcare</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: '01', title: 'Sign Up & Choose', desc: 'Create your account and browse available doctors by specialization' },
              { step: '02', title: 'Book & Consult', desc: 'Schedule an appointment or start an instant video consultation' },
              { step: '03', title: 'Get Treated', desc: 'Receive digital prescriptions and find medicines at nearby pharmacies' },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-primary text-primary-foreground font-display text-xl font-bold flex items-center justify-center mx-auto mb-4 shadow-primary">
                  {item.step}
                </div>
                <h3 className="font-display text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center p-12 rounded-3xl bg-gradient-hero text-primary-foreground relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent)]" />
            <div className="relative z-10">
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                Ready to Take Control of Your Health?
              </h2>
              <p className="text-primary-foreground/80 text-lg mb-8">
                Join thousands who trust MeDora for accessible, affordable healthcare.
              </p>
              <Link to="/signup">
                <Button size="lg" className="bg-card text-foreground hover:bg-card/90 px-8 h-12 text-base font-semibold">
                  Get Started Free
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <Heart className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-foreground">MeDora</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2026 MeDora. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground">Privacy</Link>
            <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground">Terms</Link>
            <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
