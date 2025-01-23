import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Mic, Square, Upload, Play } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AudioRecorderProps {
  onAnalysisComplete: (results: {
    confidenceScore: number;
    analysisDetails: Array<{
      title: string;
      score: number;
    }>;
  }) => void;
}

const AudioRecorder = ({ onAnalysisComplete }: AudioRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showAnalyzeButton, setShowAnalyzeButton] = useState(false);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const { toast } = useToast();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      
      mediaRecorder.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          const url = URL.createObjectURL(event.data);
          setAudioURL(url);
          setAudioFile(new File([event.data], 'recording.webm', { type: event.data.type }));
          setShowAnalyzeButton(true);
        }
      };

      mediaRecorder.current.start();
      setIsRecording(true);
      
      toast({
        title: "Recording started",
        description: "Speak clearly into your microphone",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not access microphone",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      setIsRecording(false);
      toast({
        title: "Recording stopped",
        description: "Your audio is ready for analysis",
      });
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAudioURL(url);
      setAudioFile(file);
      setShowAnalyzeButton(true);
      toast({
        title: "File uploaded",
        description: "Your audio is ready for analysis",
      });
    }
  };

  const handleAnalyze = async () => {
    if (!audioFile) return;

    setIsAnalyzing(true);
    try {
      // Upload the file to Supabase Storage
      const fileName = `${Date.now()}-${audioFile.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('audio')
        .upload(fileName, audioFile);

      if (uploadError) throw uploadError;

      // Create an analysis record
      const { data: analysisData, error: analysisError } = await supabase
        .from('audio_analysis')
        .insert({
          file_path: fileName,
          confidence_score: Math.floor(Math.random() * 30) + 70, // Simulated scores for demo
          voice_pattern_score: Math.floor(Math.random() * 20) + 80,
          background_noise_score: Math.floor(Math.random() * 25) + 75,
          speech_rhythm_score: Math.floor(Math.random() * 15) + 85,
          frequency_score: Math.floor(Math.random() * 20) + 80,
          is_analyzed: true
        })
        .select()
        .single();

      if (analysisError) throw analysisError;

      toast({
        title: "Analysis complete",
        description: "View the results below",
      });

      // Trigger parent component update with analysis results
      if (analysisData) {
        const results = {
          confidenceScore: analysisData.confidence_score,
          analysisDetails: [
            { title: "Voice Pattern Consistency", score: analysisData.voice_pattern_score },
            { title: "Background Noise Analysis", score: analysisData.background_noise_score },
            { title: "Speech Rhythm", score: analysisData.speech_rhythm_score },
            { title: "Frequency Distribution", score: analysisData.frequency_score }
          ]
        };
        onAnalysisComplete(results);
      }
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Analysis failed",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-white rounded-lg shadow-md">
      <div className="flex gap-4">
        <Button
          onClick={isRecording ? stopRecording : startRecording}
          className={`${isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-primary hover:bg-primary/90'} ${isRecording ? 'animate-pulse' : ''}`}
        >
          {isRecording ? (
            <>
              <Square className="w-4 h-4 mr-2" />
              Stop Recording
            </>
          ) : (
            <>
              <Mic className="w-4 h-4 mr-2" />
              Start Recording
            </>
          )}
        </Button>
        
        <label className="cursor-pointer">
          <Button variant="outline" className="relative">
            <Upload className="w-4 h-4 mr-2" />
            Upload Audio
            <input
              type="file"
              accept="audio/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </Button>
        </label>

        {showAnalyzeButton && (
          <Button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className={isAnalyzing ? 'animate-pulse' : ''}
          >
            <Play className="w-4 h-4 mr-2" />
            {isAnalyzing ? 'Analyzing...' : 'Analyze Audio'}
          </Button>
        )}
      </div>

      {audioURL && (
        <audio controls src={audioURL} className="mt-4 w-full max-w-md" />
      )}
    </div>
  );
};

export default AudioRecorder;