import React, { useState } from 'react';
import { Stethoscope, AlertCircle, CheckCircle, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import DashboardLayout from '@/components/shared/DashboardLayout';

const SymptomCheckerPage: React.FC = () => {
  const [symptoms, setSymptoms] = useState('');
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const analyzeSymptoms = () => {
    if (!symptoms.trim()) {
      toast.error('Please describe your symptoms');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setAnalysis({
        severity: 'Moderate',
        possibleConditions: [
          { name: 'Common Cold', probability: 'High', description: 'Viral infection of upper respiratory tract' },
          { name: 'Flu', probability: 'Medium', description: 'Influenza viral infection' },
          { name: 'Allergies', probability: 'Low', description: 'Allergic reaction to environmental factors' },
        ],
        recommendations: [
          'Rest and stay hydrated',
          'Take over-the-counter pain relievers if needed',
          'Monitor temperature regularly',
          'Consult a doctor if symptoms worsen',
        ],
        urgency: 'Consult doctor within 24-48 hours if symptoms persist'
      });
      setLoading(false);
      toast.success('Analysis complete');
    }, 2000);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Symptom Checker</h1>
        <p className="text-muted-foreground mt-1">AI-powered health analysis (For informational purposes only)</p>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-primary" />
            Describe Your Symptoms
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea 
            placeholder="Describe your symptoms in detail... (e.g., fever, headache, cough)"
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            rows={6}
            className="resize-none"
          />
          <Button onClick={analyzeSymptoms} disabled={loading} className="w-full bg-gradient-primary">
            {loading ? (
              <>Analyzing...</>
            ) : (
              <>
                <Search className="w-4 h-4 mr-2" />
                Analyze Symptoms
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {analysis && (
        <>
          <Card className="shadow-card border-l-4 border-l-warning">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-warning mt-1" />
                <div>
                  <p className="font-medium">Severity: {analysis.severity}</p>
                  <p className="text-sm text-muted-foreground mt-1">{analysis.urgency}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Possible Conditions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {analysis.possibleConditions.map((condition: any, idx: number) => (
                <div key={idx} className="p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium">{condition.name}</p>
                    <Badge variant={
                      condition.probability === 'High' ? 'default' :
                      condition.probability === 'Medium' ? 'secondary' : 'outline'
                    }>
                      {condition.probability} Probability
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{condition.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-success" />
                Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {analysis.recommendations.map((rec: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-success mt-2" />
                    <span className="text-sm">{rec}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow-card bg-destructive/5 border-destructive/20">
            <CardContent className="p-4">
              <p className="text-sm text-destructive font-medium">
                ⚠️ Disclaimer: This is an AI-powered analysis for informational purposes only. 
                Always consult with a qualified healthcare professional for proper diagnosis and treatment.
              </p>
            </CardContent>
          </Card>
        </>
      )}
    </div>
    </DashboardLayout>
  );
};

export default SymptomCheckerPage;
