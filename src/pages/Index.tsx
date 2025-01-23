import React, { useState } from 'react';
import AudioRecorder from '@/components/AudioRecorder';
import AnalysisResult from '@/components/AnalysisResult';
import EducationalSection from '@/components/EducationalSection';

const Index = () => {
  const [showResults] = useState(true);

  const mockAnalysisData = {
    confidenceScore: 85,
    analysisDetails: [
      { title: "Voice Pattern Consistency", score: 90 },
      { title: "Background Noise Analysis", score: 85 },
      { title: "Speech Rhythm", score: 82 },
      { title: "Frequency Distribution", score: 88 },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-primary">Voice Deepfake Detector</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Protect yourself from voice scams. Upload or record audio to analyze for signs of AI manipulation.
          </p>
        </div>

        <div className="flex flex-col items-center space-y-8">
          <AudioRecorder />
          
          {showResults && (
            <AnalysisResult 
              confidenceScore={mockAnalysisData.confidenceScore}
              analysisDetails={mockAnalysisData.analysisDetails}
            />
          )}
        </div>

        <div className="pt-12">
          <h2 className="text-2xl font-bold text-center mb-8">Learn About Voice Deepfakes</h2>
          <div className="flex justify-center">
            <EducationalSection />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;