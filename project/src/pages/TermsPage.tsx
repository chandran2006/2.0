import { Link } from 'react-router-dom';
import { Heart, ArrowLeft, FileText, AlertCircle, CheckCircle, XCircle, Scale } from 'lucide-react';
import { Button } from '@/components/ui/button';

const TermsPage = () => {
  return (
    <div className="min-h-screen bg-background font-body">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-gradient-primary flex items-center justify-center">
              <Heart className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-bold text-foreground">TeleAsha 2.0</span>
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
              <FileText className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">Terms of Service</h1>
            <p className="text-muted-foreground text-lg">Last updated: January 2024</p>
          </div>

          <div className="prose prose-lg max-w-none">
            <div className="bg-card rounded-2xl p-8 shadow-card mb-8">
              <h2 className="font-display text-2xl font-bold mb-4 flex items-center gap-2">
                <Scale className="w-6 h-6 text-primary" />
                Agreement to Terms
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Welcome to TeleAsha 2.0. By accessing or using our telemedicine platform, you agree to be bound by these Terms of Service. Please read them carefully. If you do not agree to these terms, you may not use our services.
              </p>
            </div>

            <div className="space-y-8">
              <section className="bg-card rounded-2xl p-8 shadow-card">
                <h3 className="font-display text-xl font-bold mb-4">1. Service Description</h3>
                <p className="text-muted-foreground mb-4">
                  TeleAsha 2.0 is a telemedicine platform that connects patients with licensed healthcare providers through:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Video and audio consultations with doctors</li>
                  <li>Appointment scheduling and management</li>
                  <li>Digital prescription services</li>
                  <li>Health record storage and management</li>
                  <li>Pharmacy finder and medicine search</li>
                  <li>Symptom checker and health assessment tools</li>
                </ul>
              </section>

              <section className="bg-card rounded-2xl p-8 shadow-card">
                <h3 className="font-display text-xl font-bold mb-4">2. User Eligibility</h3>
                <div className="space-y-4 text-muted-foreground">
                  <p>To use TeleAsha 2.0, you must:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Be at least 18 years old or have parental/guardian consent</li>
                    <li>Provide accurate and complete registration information</li>
                    <li>Maintain the security of your account credentials</li>
                    <li>Comply with all applicable laws and regulations</li>
                    <li>Not use the service for any illegal or unauthorized purpose</li>
                  </ul>
                </div>
              </section>

              <section className="bg-card rounded-2xl p-8 shadow-card">
                <h3 className="font-display text-xl font-bold mb-4 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-warning" />
                  3. Medical Disclaimer
                </h3>
                <div className="space-y-4 text-muted-foreground">
                  <p className="font-semibold text-foreground">IMPORTANT: Please read carefully</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>TeleAsha 2.0 is a platform connecting patients with healthcare providers; we do not provide medical advice directly</li>
                    <li>Our services are not for medical emergencies. Call emergency services (108/112) for urgent medical situations</li>
                    <li>Telemedicine has limitations and may not be suitable for all conditions</li>
                    <li>Healthcare providers on our platform are independent professionals responsible for their own medical advice</li>
                    <li>We do not guarantee specific medical outcomes or results</li>
                    <li>Always follow up with in-person care when recommended by your healthcare provider</li>
                  </ul>
                </div>
              </section>

              <section className="bg-card rounded-2xl p-8 shadow-card">
                <h3 className="font-display text-xl font-bold mb-4">4. User Responsibilities</h3>
                <div className="space-y-4 text-muted-foreground">
                  <p className="font-semibold text-foreground">As a Patient, you agree to:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Provide accurate medical history and information</li>
                    <li>Follow prescribed treatment plans and medical advice</li>
                    <li>Attend scheduled appointments or cancel with adequate notice</li>
                    <li>Pay for services as agreed</li>
                    <li>Respect healthcare providers and other users</li>
                  </ul>
                  <p className="font-semibold text-foreground mt-4">As a Healthcare Provider, you agree to:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Maintain valid medical licenses and credentials</li>
                    <li>Provide professional and ethical medical care</li>
                    <li>Comply with medical standards and regulations</li>
                    <li>Maintain patient confidentiality</li>
                    <li>Keep your availability and schedule updated</li>
                  </ul>
                </div>
              </section>

              <section className="bg-card rounded-2xl p-8 shadow-card">
                <h3 className="font-display text-xl font-bold mb-4">5. Payments and Fees</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Consultation fees are set by individual healthcare providers</li>
                  <li>Payment is required before or at the time of consultation</li>
                  <li>We may charge platform fees for using our services</li>
                  <li>Refunds are subject to our refund policy and applicable laws</li>
                  <li>You are responsible for any applicable taxes</li>
                  <li>Prices may change with notice</li>
                </ul>
              </section>

              <section className="bg-card rounded-2xl p-8 shadow-card">
                <h3 className="font-display text-xl font-bold mb-4">6. Cancellation and Refund Policy</h3>
                <div className="space-y-4 text-muted-foreground">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-success mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-foreground">Full Refund:</p>
                      <p>Cancellations made 24+ hours before appointment</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-warning mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-foreground">50% Refund:</p>
                      <p>Cancellations made 6-24 hours before appointment</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-destructive mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-foreground">No Refund:</p>
                      <p>Cancellations made less than 6 hours before appointment or no-shows</p>
                    </div>
                  </div>
                </div>
              </section>

              <section className="bg-card rounded-2xl p-8 shadow-card">
                <h3 className="font-display text-xl font-bold mb-4">7. Privacy and Data Protection</h3>
                <p className="text-muted-foreground mb-4">
                  Your privacy is important to us. Our collection and use of personal information is governed by our Privacy Policy. By using TeleAsha 2.0, you consent to:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Collection and processing of your health information</li>
                  <li>Sharing information with healthcare providers for treatment</li>
                  <li>Recording of video consultations for quality and legal purposes</li>
                  <li>Use of cookies and tracking technologies</li>
                </ul>
              </section>

              <section className="bg-card rounded-2xl p-8 shadow-card">
                <h3 className="font-display text-xl font-bold mb-4">8. Intellectual Property</h3>
                <p className="text-muted-foreground mb-4">
                  All content on TeleAsha 2.0, including text, graphics, logos, software, and design, is owned by us or our licensors and protected by intellectual property laws. You may not:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Copy, modify, or distribute our content without permission</li>
                  <li>Use our trademarks or branding without authorization</li>
                  <li>Reverse engineer or attempt to extract source code</li>
                  <li>Create derivative works based on our platform</li>
                </ul>
              </section>

              <section className="bg-card rounded-2xl p-8 shadow-card">
                <h3 className="font-display text-xl font-bold mb-4">9. Prohibited Activities</h3>
                <p className="text-muted-foreground mb-4">You may not:</p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Impersonate others or provide false information</li>
                  <li>Harass, abuse, or harm other users or healthcare providers</li>
                  <li>Attempt to gain unauthorized access to our systems</li>
                  <li>Use automated systems to access the platform</li>
                  <li>Transmit viruses, malware, or harmful code</li>
                  <li>Violate any applicable laws or regulations</li>
                  <li>Use the platform for fraudulent purposes</li>
                </ul>
              </section>

              <section className="bg-card rounded-2xl p-8 shadow-card">
                <h3 className="font-display text-xl font-bold mb-4">10. Limitation of Liability</h3>
                <p className="text-muted-foreground mb-4">
                  To the maximum extent permitted by law:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>TeleAsha 2.0 is provided "as is" without warranties of any kind</li>
                  <li>We are not liable for medical advice provided by healthcare providers</li>
                  <li>We are not responsible for technical issues or service interruptions</li>
                  <li>Our liability is limited to the amount you paid for services</li>
                  <li>We are not liable for indirect, incidental, or consequential damages</li>
                </ul>
              </section>

              <section className="bg-card rounded-2xl p-8 shadow-card">
                <h3 className="font-display text-xl font-bold mb-4">11. Account Termination</h3>
                <p className="text-muted-foreground mb-4">
                  We reserve the right to suspend or terminate your account if you:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Violate these Terms of Service</li>
                  <li>Engage in fraudulent or illegal activities</li>
                  <li>Abuse or harass other users or providers</li>
                  <li>Fail to pay for services</li>
                  <li>Provide false or misleading information</li>
                </ul>
                <p className="text-muted-foreground mt-4">
                  You may delete your account at any time, but we may retain certain information as required by law.
                </p>
              </section>

              <section className="bg-card rounded-2xl p-8 shadow-card">
                <h3 className="font-display text-xl font-bold mb-4">12. Dispute Resolution</h3>
                <p className="text-muted-foreground mb-4">
                  Any disputes arising from these terms or your use of TeleAsha 2.0 will be resolved through:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                  <li>Good faith negotiation between parties</li>
                  <li>Mediation if negotiation fails</li>
                  <li>Arbitration in accordance with Indian law</li>
                  <li>Courts in India shall have exclusive jurisdiction</li>
                </ul>
              </section>

              <section className="bg-card rounded-2xl p-8 shadow-card">
                <h3 className="font-display text-xl font-bold mb-4">13. Changes to Terms</h3>
                <p className="text-muted-foreground">
                  We may modify these Terms of Service at any time. We will notify you of significant changes via email or platform notification. Continued use of TeleAsha 2.0 after changes constitutes acceptance of the new terms.
                </p>
              </section>

              <section className="bg-card rounded-2xl p-8 shadow-card">
                <h3 className="font-display text-xl font-bold mb-4">14. Governing Law</h3>
                <p className="text-muted-foreground">
                  These Terms of Service are governed by the laws of India. Any legal action must be brought in the courts of India.
                </p>
              </section>

              <section className="bg-gradient-primary rounded-2xl p-8 text-primary-foreground">
                <h3 className="font-display text-xl font-bold mb-4">Contact Us</h3>
                <p className="mb-4">
                  If you have any questions about these Terms of Service, please contact us:
                </p>
                <div className="space-y-2">
                  <p><strong>Email:</strong> bhemachandran2006@gmail.com</p>
                  <p><strong>Phone:</strong> +91 9042339824</p>
                  <p><strong>Address:</strong> TeleAsha 2.0, Healthcare Services, India</p>
                </div>
              </section>

              <div className="bg-secondary/50 rounded-2xl p-6 text-center">
                <p className="text-sm text-muted-foreground">
                  By using TeleAsha 2.0, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-border">
        <div className="container mx-auto text-center">
          <p className="text-sm text-muted-foreground">© 2026 TeleAsha 2.0. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default TermsPage;
