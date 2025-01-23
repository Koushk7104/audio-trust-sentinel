import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Shield, Brain, Fingerprint } from 'lucide-react';

const EducationalSection = () => {
  const tips = [
    {
      icon: <AlertTriangle className="w-6 h-6 text-yellow-500" />,
      title: "Common Signs of Voice Deepfakes",
      content: "Listen for unnatural pauses, robotic tones, or inconsistent background noise.",
    },
    {
      icon: <Shield className="w-6 h-6 text-green-500" />,
      title: "Protect Yourself",
      content: "Verify caller identity through established channels and never share sensitive information.",
    },
    {
      icon: <Brain className="w-6 h-6 text-purple-500" />,
      title: "How AI Detection Works",
      content: "Our system analyzes voice patterns, frequencies, and natural speech markers.",
    },
    {
      icon: <Fingerprint className="w-6 h-6 text-blue-500" />,
      title: "Voice Authentication",
      content: "Use voice authentication systems when available for additional security.",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
      {tips.map((tip, index) => (
        <Card key={index} className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center gap-4">
            {tip.icon}
            <CardTitle className="text-lg">{tip.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">{tip.content}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default EducationalSection;