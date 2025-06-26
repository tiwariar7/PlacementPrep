import { useParams, Link } from 'react-router-dom';
import { companies } from '../data/companies';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Building2, 
  IndianRupee, 
  Calendar,
  Users,
  ArrowLeft,
  BookmarkPlus,
  CheckCircle,
  Clock,
  Target,
  BookOpen,
  Star,
  TrendingUp
} from 'lucide-react';
import { useAppStore } from '../store/appStore';

export function CompanyDetail() {
  const { id } = useParams<{ id: string }>();
  const { savedCompanies, addSavedCompany, removeSavedCompany } = useAppStore();
  
  const company = companies.find(c => c.id === id);

  if (!company) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Company not found</h2>
          <Button asChild>
            <Link to="/companies">Back to Companies</Link>
          </Button>
        </div>
      </div>
    );
  }

  const handleSaveCompany = () => {
    if (savedCompanies.includes(company.id)) {
      removeSavedCompany(company.id);
    } else {
      addSavedCompany(company.id);
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Top-Tier Companies':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Mid-Tier Companies':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Mass Recruiters':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'Core Engg.':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'International Roles':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const parseInterviewRounds = (roundsText: string) => {
    const rounds = roundsText.split('\n').filter(round => round.trim());
    return rounds.map(round => {
      const parts = round.split(' – ');
      const title = parts[0].replace(/^\d+\.\s*/, '');
      const description = parts[1] || '';
      return { title, description };
    });
  };

  const interviewRounds = parseInterviewRounds(company.interviewRounds);

  const preparationTopics = [
    ...company.requirements,
    ...(company.tier === 'Top-Tier Companies' ? ['System Design', 'Leadership Principles'] : []),
    ...(company.tier === 'Core Engg.' ? ['Domain Knowledge', 'Technical Fundamentals'] : [])
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link to="/companies">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Companies
            </Link>
          </Button>
          
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-4 rounded-xl bg-primary/10">
                <Building2 className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-2">{company.name}</h1>
                <p className="text-xl text-muted-foreground mb-2">{company.role}</p>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <IndianRupee className="h-5 w-5 text-green-600" />
                    <span className="font-semibold text-green-600 text-lg">
                      {company.packageRange} LPA
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{company.year}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <Button
              onClick={handleSaveCompany}
              variant={savedCompanies.includes(company.id) ? "default" : "outline"}
              size="lg"
            >
              <BookmarkPlus className="h-4 w-4 mr-2" />
              {savedCompanies.includes(company.id) ? 'Saved' : 'Save Company'}
            </Button>
          </div>
        </div>

        {/* Quick Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center text-lg">
                <Target className="h-5 w-5 mr-2 text-primary" />
                Company Tier
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Badge className={getTierColor(company.tier)}>
                {company.tier}
              </Badge>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center text-lg">
                <Users className="h-5 w-5 mr-2 text-primary" />
                Eligible Branches
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {company.branches.map(branch => (
                  <Badge key={branch} variant="outline">{branch}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center text-lg">
                <TrendingUp className="h-5 w-5 mr-2 text-primary" />
                Difficulty Level
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Interview Difficulty</span>
                  <span className="font-medium">
                    {company.tier === 'Top-Tier Companies' ? 'Hard' : 
                     company.tier === 'Mid-Tier Companies' ? 'Medium' : 'Easy'}
                  </span>
                </div>
                <Progress 
                  value={
                    company.tier === 'Top-Tier Companies' ? 90 : 
                    company.tier === 'Mid-Tier Companies' ? 60 : 40
                  } 
                  className="h-2"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="interview-process" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="interview-process">Interview Process</TabsTrigger>
            <TabsTrigger value="preparation">Preparation Guide</TabsTrigger>
          </TabsList>

          <TabsContent value="interview-process" className="space-y-6">
            <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Interview Timeline
                </CardTitle>
                <CardDescription>
                  Complete breakdown of the interview process with expected duration and difficulty
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {interviewRounds.map((round, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-semibold text-primary">{index + 1}</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold mb-2">{round.title}</h4>
                        <p className="text-sm text-muted-foreground">{round.description}</p>
                      </div>
                      {index < interviewRounds.length - 1 && (
                        <div className="absolute left-4 mt-8 w-px h-6 bg-border"></div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Round-wise Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {interviewRounds.map((round, index) => (
                    <AccordionItem key={index} value={`round-${index}`}>
                      <AccordionTrigger className="text-left">
                        <div className="flex items-center space-x-3">
                          <Badge variant="outline">Round {index + 1}</Badge>
                          <span>{round.title}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-4">
                        <div className="bg-muted/50 p-4 rounded-lg">
                          <h5 className="font-medium mb-2">What to Expect:</h5>
                          <p className="text-sm text-muted-foreground">{round.description}</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <h5 className="font-medium">Preparation Tips:</h5>
                            <ul className="text-sm text-muted-foreground space-y-1">
                              {index === 0 && (
                                <>
                                  <li>• Practice coding problems daily</li>
                                  <li>• Focus on time management</li>
                                  <li>• Review basic CS concepts</li>
                                </>
                              )}
                              {index === 1 && (
                                <>
                                  <li>• Prepare project explanations</li>
                                  <li>• Practice system design basics</li>
                                  <li>• Review technical fundamentals</li>
                                </>
                              )}
                              {index === 2 && (
                                <>
                                  <li>• Prepare behavioral questions</li>
                                  <li>• Research company culture</li>
                                  <li>• Practice communication skills</li>
                                </>
                              )}
                            </ul>
                          </div>
                          
                          <div className="space-y-2">
                            <h5 className="font-medium">Success Rate:</h5>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>Pass Rate</span>
                                <span className="font-medium">
                                  {index === 0 ? '70%' : index === 1 ? '60%' : '85%'}
                                </span>
                              </div>
                              <Progress 
                                value={index === 0 ? 70 : index === 1 ? 60 : 85} 
                                className="h-2"
                              />
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preparation" className="space-y-6">
            <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Must-Know Topics
                </CardTitle>
                <CardDescription>
                  Essential skills and topics you need to master for this company
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {preparationTopics.map((topic, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="font-medium">{topic}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Recommended Resources</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold">Coding Practice</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <span className="text-sm">LeetCode</span>
                        <Badge variant="outline">Practice</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <span className="text-sm">GeeksforGeeks</span>
                        <Badge variant="outline">Theory</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <span className="text-sm">HackerRank</span>
                        <Badge variant="outline">Practice</Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-semibold">Study Materials</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <span className="text-sm">Cracking the Coding Interview</span>
                        <Badge variant="outline">Book</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <span className="text-sm">System Design Primer</span>
                        <Badge variant="outline">GitHub</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <span className="text-sm">Company Tech Blogs</span>
                        <Badge variant="outline">Blog</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="experiences" className="space-y-6">
            <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Student Experiences</CardTitle>
                <CardDescription>
                  Real experiences from students who successfully interviewed at {company.name}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <span className="text-sm font-medium">Anonymous Student</span>
                      <Badge variant="outline">CSE</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      "The interview process was well-structured. The technical rounds focused heavily on DSA and system design. 
                      HR round was more about cultural fit and past experiences. Overall, a great experience!"
                    </p>
                    <div className="text-xs text-muted-foreground">
                      Interviewed: {company.year}
                    </div>
                  </div>

                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4].map((star) => (
                          <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                        <Star className="h-4 w-4 text-gray-300" />
                      </div>
                      <span className="text-sm font-medium">Anonymous Student</span>
                      <Badge variant="outline">IT</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      "The online assessment was challenging but fair. Make sure to practice medium-level problems on LeetCode. 
                      The interviewers were friendly and provided hints when needed."
                    </p>
                    <div className="text-xs text-muted-foreground">
                      Interviewed: {company.year}
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-4">
                    Share your interview experience to help fellow students
                  </p>
                  <Button variant="outline">
                    Share Your Experience
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Floating Action Button */}
        <div className="fixed bottom-8 right-8">
          <Button size="lg" className="rounded-full shadow-lg">
            <BookmarkPlus className="h-5 w-5 mr-2" />
            Add to Prep List
          </Button>
        </div>
      </div>
    </div>
  );
}