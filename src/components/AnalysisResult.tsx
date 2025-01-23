import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface AnalysisResultProps {
  confidenceScore: number;
  analysisDetails: {
    title: string;
    score: number;
  }[];
}

const AnalysisResult = ({ confidenceScore, analysisDetails }: AnalysisResultProps) => {
  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Analysis Result</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Authenticity Score</h3>
            <div className="flex items-center gap-4">
              <Progress value={confidenceScore} className="flex-1" />
              <span className="text-lg font-medium">{confidenceScore}%</span>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Detailed Analysis</h3>
            {analysisDetails.map((detail, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">{detail.title}</span>
                  <span className="text-sm text-gray-500">{detail.score}%</span>
                </div>
                <Progress value={detail.score} />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalysisResult;