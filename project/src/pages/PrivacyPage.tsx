import { Link } from 'react-router-dom';
import { Heart, ArrowLeft, Shield, Lock, Eye, Database, UserCheck, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PrivacyPage = () => {
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
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </nav>

      {/* Content */}
      <div className="pt-24 pb-16 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-muted-foreground text-lg">Last updated: January 2024</p>
          </div>

          <div className="prose prose-lg max-w-none">
            <div className="bg-card rounded-2xl p-8 shadow-card mb-8">
              <h2 className="font-display text-2xl font-bold mb-4 flex items-center gap-2">
                <Lock className="w-6 h-6 text-primary" />
                Your Privacy Matters
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                At MeDora, we are committed to protecting your privacy and ensuring the security of your personal health information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our telemedicine platform.
              </p>
            </div>

            <div className="space-y-8">
              <section className="bg-card rounded-2xl p-8 shadow-card">
                <h3 className="font-display text-xl font-bold mb-4 flex items-center gap-2">
                  <Database className="w-5 h-5 text-primary" />
                  Information We Collect
                </h3>
                <div className="space-y-4 text-muted-foreground">
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Personal Information</h4>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>Name, email address, phone number</li>
                      <li>Date of birth, gender, address</li>
                      <li>Government-issued ID for verification</li>
                      <li>Payment and billing information</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Health Information</h4>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>Medical history and health records</li>
                      <li>Symptoms, diagnoses, and treatment plans</li>
                      <li>Prescriptions and medication history</li>
                      <li>Lab results and medical images</li>
                      <li>Video consultation recordings (with consent)</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Technical Information</h4>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>IP address, browser type, device information</li>
                      <li>Usage data and interaction with our platform</li>
                      <li>Cookies and similar tracking technologies</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="bg-card rounded-2xl p-8 shadow-card">
                <h3 className="font-display text-xl font-bold mb-4 flex items-center gap-2">
                  <Eye className="w-5 h-5 text-primary" />
                  How We Use Your Information
                </h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Provide and improve our telemedicine services</li>
                  <li>Facilitate video consultations between patients and doctors</li>
                  <li>Process prescriptions and coordinate with pharmacies</li>
                  <li>Maintain your health records securely</li>
                  <li>Send appointment reminders and health notifications</li>
                  <li>Process payments and prevent fraud</li>
                  <li>Comply with legal and regulatory requirements</li>
                  <li>Improve our platform through analytics and research</li>
                </ul>
              </section>

              <section className="bg-card rounded-2xl p-8 shadow-card">
                <h3 className="font-display text-xl font-bold mb-4 flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-primary" />
                  Information Sharing
                </h3>
                <p className="text-muted-foreground mb-4">
                  We do not sell your personal information. We may share your information only in the following circumstances:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li><strong className="text-foreground">Healthcare Providers:</strong> With doctors, specialists, and pharmacies involved in your care</li>
                  <li><strong className="text-foreground">Service Providers:</strong> With trusted third-party vendors who help us operate our platform</li>
                  <li><strong className="text-foreground">Legal Requirements:</strong> When required by law or to protect rights and safety</li>
                  <li><strong className="text-foreground">With Your Consent:</strong> When you explicitly authorize us to share your information</li>
                </ul>
              </section>

              <section className="bg-card rounded-2xl p-8 shadow-card">
                <h3 className="font-display text-xl font-bold mb-4 flex items-center gap-2">
                  <Lock className="w-5 h-5 text-primary" />
                  Data Security
                </h3>
                <p className="text-muted-foreground mb-4">
                  We implement industry-standard security measures to protect your information:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>End-to-end encryption for video consultations</li>
                  <li>Secure data storage with encryption at rest</li>
                  <li>Regular security audits and vulnerability assessments</li>
                  <li>Access controls and authentication mechanisms</li>
                  <li>HIPAA-compliant data handling practices</li>
                  <li>Regular staff training on data protection</li>
                </ul>
              </section>

              <section className="bg-card rounded-2xl p-8 shadow-card">
                <h3 className="font-display text-xl font-bold mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Your Rights
                </h3>
                <p className="text-muted-foreground mb-4">You have the right to:</p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Access your personal and health information</li>
                  <li>Request corrections to inaccurate information</li>
                  <li>Request deletion of your data (subject to legal requirements)</li>
                  <li>Opt-out of marketing communications</li>
                  <li>Download your health records</li>
                  <li>Withdraw consent for data processing</li>
                  <li>File a complaint with data protection authorities</li>
                </ul>
              </section>

              <section className="bg-card rounded-2xl p-8 shadow-card">
                <h3 className="font-display text-xl font-bold mb-4">Data Retention</h3>
                <p className="text-muted-foreground">
                  We retain your information for as long as necessary to provide our services and comply with legal obligations. Medical records are retained according to healthcare regulations, typically for a minimum of 7 years. You may request deletion of your account, but we may retain certain information as required by law.
                </p>
              </section>

              <section className="bg-card rounded-2xl p-8 shadow-card">
                <h3 className="font-display text-xl font-bold mb-4">Children's Privacy</h3>
                <p className="text-muted-foreground">
                  Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
                </p>
              </section>

              <section className="bg-card rounded-2xl p-8 shadow-card">
                <h3 className="font-display text-xl font-bold mb-4">Changes to This Policy</h3>
                <p className="text-muted-foreground">
                  We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. We encourage you to review this Privacy Policy periodically.
                </p>
              </section>

              <section className="bg-gradient-primary rounded-2xl p-8 text-primary-foreground">
                <h3 className="font-display text-xl font-bold mb-4">Contact Us</h3>
                <p className="mb-4">
                  If you have any questions about this Privacy Policy or our data practices, please contact us:
                </p>
                <div className="space-y-2">
                  <p><strong>Email:</strong> bhemachandran2006@gmail.com</p>
                  <p><strong>Phone:</strong> +91 9042339824</p>
                  <p><strong>Address:</strong> MeDora, Healthcare Services, India</p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-border">
        <div className="container mx-auto text-center">
          <p className="text-sm text-muted-foreground">© 2026 MeDora. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default PrivacyPage;
