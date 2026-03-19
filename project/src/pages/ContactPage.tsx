import { Link } from 'react-router-dom';
import { Heart, ArrowLeft, Mail, Phone, MapPin, Clock, Send, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send the message
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

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
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">Get in Touch</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Have questions or need support? We're here to help. Reach out to us through any of the channels below.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Contact Information */}
            <div className="space-y-6">
              <div className="bg-card rounded-2xl p-8 shadow-card">
                <h2 className="font-display text-2xl font-bold mb-6">Contact Information</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Email</h3>
                      <a 
                        href="mailto:bhemachandran2006@gmail.com" 
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        bhemachandran2006@gmail.com
                      </a>
                      <p className="text-sm text-muted-foreground mt-1">
                        We'll respond within 24 hours
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-success" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Phone</h3>
                      <a 
                        href="tel:+919042339824" 
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        +91 9042339824
                      </a>
                      <p className="text-sm text-muted-foreground mt-1">
                        Mon-Fri, 9:00 AM - 6:00 PM IST
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-info/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-info" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Address</h3>
                      <p className="text-muted-foreground">
                        MeDora<br />
                        Healthcare Services<br />
                        India
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-6 h-6 text-warning" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Business Hours</h3>
                      <div className="text-muted-foreground space-y-1">
                        <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                        <p>Saturday: 10:00 AM - 4:00 PM</p>
                        <p>Sunday: Closed</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-primary rounded-2xl p-8 text-primary-foreground">
                <h3 className="font-display text-xl font-bold mb-3">Need Immediate Help?</h3>
                <p className="mb-4">
                  For medical emergencies, please call emergency services immediately.
                </p>
                <div className="space-y-2 text-sm">
                  <p><strong>Emergency:</strong> 108 / 112</p>
                  <p><strong>Ambulance:</strong> 108</p>
                  <p><strong>Police:</strong> 100</p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-card rounded-2xl p-8 shadow-card">
              <h2 className="font-display text-2xl font-bold mb-6">Send us a Message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="text-sm font-medium mb-2 block">Your Name</label>
                  <Input
                    type="text"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="h-11"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Email Address</label>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="h-11"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Subject</label>
                  <Input
                    type="text"
                    placeholder="What is this about?"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    required
                    className="h-11"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Message</label>
                  <textarea
                    placeholder="Tell us more about your inquiry..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    rows={6}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 bg-gradient-primary text-primary-foreground shadow-primary hover:opacity-90"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
              </form>

              <p className="text-sm text-muted-foreground text-center mt-6">
                We typically respond within 24 hours during business days.
              </p>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-card rounded-2xl p-8 shadow-card">
            <h2 className="font-display text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-foreground mb-2">How do I book an appointment?</h3>
                <p className="text-sm text-muted-foreground">
                  Sign up or log in, browse available doctors, select a time slot, and confirm your booking. You'll receive a confirmation email.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">Is my health data secure?</h3>
                <p className="text-sm text-muted-foreground">
                  Yes, we use end-to-end encryption and follow HIPAA compliance standards to protect your health information.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">What if I need to cancel?</h3>
                <p className="text-sm text-muted-foreground">
                  You can cancel appointments up to 24 hours in advance for a full refund. See our Terms of Service for details.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">Do you accept insurance?</h3>
                <p className="text-sm text-muted-foreground">
                  We're working on insurance integration. Currently, we accept direct payments and provide receipts for reimbursement.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">Can I get prescriptions online?</h3>
                <p className="text-sm text-muted-foreground">
                  Yes, doctors can issue digital prescriptions during consultations, which you can use at any pharmacy.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">What are your consultation fees?</h3>
                <p className="text-sm text-muted-foreground">
                  Fees vary by doctor and specialization. You'll see the exact fee before booking an appointment.
                </p>
              </div>
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

export default ContactPage;
