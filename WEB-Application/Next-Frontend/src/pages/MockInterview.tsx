import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { 
  Mic, 
  Play, 
  Pause, 
  RotateCcw, 
  Timer, 
  Code, 
  MessageCircle,
  User,
  CheckCircle,
  AlertCircle,
  Trophy,
  BarChart3,
  Brain
} from 'lucide-react';
import { companies } from '../data/companies';

type InterviewMode = 'company' | 'role' | 'random';
type InterviewPhase = 'setup' | 'coding' | 'technical' | 'hr' | 'results';

export function MockInterview() {
  const [mode, setMode] = useState<InterviewMode>('company');
  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [currentPhase, setCurrentPhase] = useState<InterviewPhase>('setup');
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [numQuestions, setNumQuestions] = useState(3);
  const [roundType, setRoundType] = useState<'coding' | 'technical' | 'hr'>('coding');
  const [currentQuestionText, setCurrentQuestionText] = useState<string>('');
  const [previousAnswers, setPreviousAnswers] = useState<{question: string, answer: string}[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{correct: number, total: number} | null>(null);

  const handleStartInterview = async () => {
    setLoading(true);
    setError(null);
    setCurrentQuestionText('');
    setPreviousAnswers([]);
    setCurrentAnswer('');
    setResult(null);
    setCurrentPhase(roundType);
    try {
      const res = await fetch('http://localhost:5000/mock_interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company: mode === 'company' ? selectedCompany : undefined,
          role: mode === 'role' ? selectedRole : undefined,
          round_type: roundType.charAt(0).toUpperCase() + roundType.slice(1),
          num_questions: numQuestions,
          previous_answers: [],
        }),
      });
      const data = await res.json();
      if (data.finished) {
        setResult({ correct: data.correct, total: data.total });
        setCurrentPhase('results');
      } else if (data.question) {
        setCurrentQuestionText(data.question);
      } else {
        setError(data.error || 'Failed to generate question.');
      }
    } catch (e) {
      setError('Failed to connect to AI service.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAnswer = async () => {
    setLoading(true);
    setError(null);
    const newPrev = [...previousAnswers, { question: currentQuestionText, answer: currentAnswer }];
    setPreviousAnswers(newPrev);
    setCurrentAnswer('');
    try {
      const res = await fetch('http://localhost:5000/mock_interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company: mode === 'company' ? selectedCompany : undefined,
          role: mode === 'role' ? selectedRole : undefined,
          round_type: roundType.charAt(0).toUpperCase() + roundType.slice(1),
          num_questions: numQuestions,
          previous_answers: newPrev,
        }),
      });
      const data = await res.json();
      if (data.finished) {
        setResult({ correct: data.correct, total: data.total });
        setCurrentPhase('results');
      } else if (data.question) {
        setCurrentQuestionText(data.question);
      } else {
        setError(data.error || 'Failed to generate question.');
      }
    } catch (e) {
      setError('Failed to connect to AI service.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            Mock Interview Simulator
          </h1>
          <p className="text-lg text-muted-foreground">
            Practice with AI-powered interviews tailored to your target companies
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Interview Progress</span>
            <span className="text-sm text-muted-foreground">
              {result ? 100 : previousAnswers.length / numQuestions * 100}% Complete
            </span>
          </div>
          <Progress value={result ? 100 : previousAnswers.length / numQuestions * 100} className="h-2" />
        </div>

        {currentPhase === 'setup' && (
          <Card className="max-w-2xl mx-auto border-none shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mic className="h-5 w-5 mr-2" />
                Interview Setup
              </CardTitle>
              <CardDescription>
                Choose your interview mode and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Interview Mode</label>
                  <Select value={mode} onValueChange={(value) => setMode(value as InterviewMode)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select interview mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="company">Company-Specific</SelectItem>
                      <SelectItem value="role">Role-Specific</SelectItem>
                      <SelectItem value="random">Random Practice</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {mode === 'company' && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Select Company</label>
                    <Select value={selectedCompany} onValueChange={setSelectedCompany}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a company" />
                      </SelectTrigger>
                      <SelectContent>
                        {companies.slice(0, 10).map(company => (
                          <SelectItem key={company.id} value={company.name}>
                            {company.name} - {company.role}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {mode === 'role' && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Select Role</label>
                    <Select value={selectedRole} onValueChange={setSelectedRole}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a role" />
                      </SelectTrigger>
                      <SelectContent>
                        {[...new Set(companies.map(c => c.role))].map(role => (
                          <SelectItem key={role} value={role}>{role}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Interview Round</label>
                  <Select value={roundType} onValueChange={v => setRoundType(v as any)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select round type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="coding">Coding</SelectItem>
                      <SelectItem value="technical">Technical</SelectItem>
                      <SelectItem value="hr">HR</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Number of Questions</label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={numQuestions}
                    onChange={e => setNumQuestions(Number(e.target.value))}
                    className="border rounded px-2 py-1 w-20"
                  />
                </div>
                <Button onClick={handleStartInterview} disabled={loading}>
                  {loading ? 'Generating Question...' : 'Start Interview'}
                </Button>
                {error && <div className="text-red-500 text-sm">{error}</div>}
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Interview Structure</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Code className="h-4 w-4 text-blue-500" />
                      <span className="text-sm">Coding Round</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Brain className="h-4 w-4 text-purple-500" />
                      <span className="text-sm">Technical Interview</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <MessageCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">HR Round</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Question Phase */}
        {(currentPhase === 'coding' || currentPhase === 'technical' || currentPhase === 'hr') && !loading && currentQuestionText && !result && (
          <Card className="max-w-2xl mx-auto border-none shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Brain className="h-5 w-5 mr-2" />
                {roundType.charAt(0).toUpperCase() + roundType.slice(1)} Interview - Question {previousAnswers.length + 1} of {numQuestions}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-muted/50 rounded-lg">
                <h3 className="font-semibold mb-2">Question:</h3>
                <p>{currentQuestionText}</p>
              </div>

              <div className="space-y-4">
                <Textarea
                  placeholder="Type your answer here..."
                  value={currentAnswer}
                  onChange={(e) => setCurrentAnswer(e.target.value)}
                  className="min-h-[150px]"
                />
                
                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setIsRecording(!isRecording)}
                  >
                    {isRecording ? <Pause className="h-4 w-4 mr-2" /> : <Mic className="h-4 w-4 mr-2" />}
                    {isRecording ? 'Stop Recording' : 'Voice Answer'}
                  </Button>
                  <Button onClick={handleSubmitAnswer} disabled={!currentAnswer.trim()}>
                    {previousAnswers.length + 1 === numQuestions ? 'Finish Round' : 'Submit Answer'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12 text-lg text-muted-foreground">Generating question, please wait...</div>
        )}

        {currentPhase === 'results' && result && (
          <div className="max-w-4xl mx-auto space-y-6">
            <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-4 rounded-full bg-green-100">
                  <Trophy className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-2xl">Interview Complete!</CardTitle>
                <CardDescription>
                  You answered {result.correct} out of {result.total} questions correctly.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button onClick={() => setCurrentPhase('setup')} variant="outline">
                    Take Another Interview
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}