import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Target, 
  BookmarkCheck, 
  TrendingUp, 
  Calendar,
  Award,
  Clock,
  Building2,
  CheckCircle,
  AlertTriangle,
  Star,
  ArrowRight
} from 'lucide-react';
import { companies } from '../data/companies';
import { progress, UserProgress } from '../data/progress';

export function Dashboard() {
  // Get user from localStorage
  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null;
  const email = user?.email;
  const userProgress: UserProgress = (email && progress[email]) || {
    completedSkills: [],
    savedCompanies: [],
    mockInterviews: 0,
  };

  // Use userProgress instead of useAppStore
  const savedCompanies = userProgress.savedCompanies;
  const completedSkills = userProgress.completedSkills;
  const mockInterviews = userProgress.mockInterviews;

  const savedCompanyData = companies.filter(company => savedCompanies.includes(company.id));
  
  const getReadinessScore = () => {
    const totalSkills = 20; // Total skills available
    const completedCount = completedSkills.length;
    return Math.round((completedCount / totalSkills) * 100);
  };

  const getRecentActivity = () => [
    { type: 'skill', action: 'Completed Python assessment', time: '2 hours ago', icon: CheckCircle },
    { type: 'company', action: 'Added Amazon to prep list', time: '1 day ago', icon: BookmarkCheck },
    { type: 'interview', action: 'Completed mock interview', time: '3 days ago', icon: Target },
    { type: 'skill', action: 'Started System Design course', time: '1 week ago', icon: TrendingUp }
  ];

  const getUpcomingDeadlines = () => [
    { company: 'Amazon', deadline: '2024-02-15', type: 'Application Deadline' },
    { company: 'Google', deadline: '2024-02-20', type: 'Resume Submission' },
    { company: 'Microsoft', deadline: '2024-02-25', type: 'Online Assessment' }
  ];

  const readinessScore = getReadinessScore();
  const recentActivity = getRecentActivity();
  const upcomingDeadlines = getUpcomingDeadlines();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            Your Dashboard
          </h1>
          <p className="text-lg text-muted-foreground">
            Track your placement preparation progress and stay on top of your goals
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Overall Readiness
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <div className="text-2xl font-bold text-primary">
                  {readinessScore}%
                </div>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </div>
              <Progress value={readinessScore} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Saved Companies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <div className="text-2xl font-bold text-blue-600">
                  {savedCompanies.length}
                </div>
                <Building2 className="h-4 w-4 text-blue-500" />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Companies in prep list
              </p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Skills Mastered
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <div className="text-2xl font-bold text-green-600">
                  {completedSkills.length}
                </div>
                <Award className="h-4 w-4 text-green-500" />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Out of 20 total skills
              </p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Mock Interviews
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <div className="text-2xl font-bold text-purple-600">
                  {mockInterviews}
                </div>
                <Target className="h-4 w-4 text-purple-500" />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Completed this week
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="companies" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="companies">My Companies</TabsTrigger>
                <TabsTrigger value="progress">Progress</TabsTrigger>
                <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
              </TabsList>

              <TabsContent value="companies" className="space-y-4">
                <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BookmarkCheck className="h-5 w-5 mr-2" />
                      Saved Companies ({savedCompanies.length})
                    </CardTitle>
                    <CardDescription>
                      Companies you're actively preparing for
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {savedCompanyData.length > 0 ? (
                      <div className="space-y-4">
                        {savedCompanyData.map((company) => (
                          <div key={company.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className="p-2 rounded-lg bg-primary/10">
                                <Building2 className="h-4 w-4 text-primary" />
                              </div>
                              <div>
                                <h4 className="font-medium">{company.name}</h4>
                                <p className="text-sm text-muted-foreground">{company.role}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline">{company.packageRange} LPA</Badge>
                              <Button asChild size="sm" variant="ghost">
                                <Link to={`/company/${company.id}`}>
                                  <ArrowRight className="h-4 w-4" />
                                </Link>
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="font-medium mb-2">No companies saved yet</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Start by exploring companies and adding them to your prep list
                        </p>
                        <Button asChild>
                          <Link to="/companies">Browse Companies</Link>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="progress" className="space-y-4">
                <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <TrendingUp className="h-5 w-5 mr-2" />
                      Skill Progress
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Programming Skills</span>
                          <span className="font-medium">75%</span>
                        </div>
                        <Progress value={75} className="h-2" />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>System Design</span>
                          <span className="font-medium">40%</span>
                        </div>
                        <Progress value={40} className="h-2" />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Database Skills</span>
                          <span className="font-medium">60%</span>
                        </div>
                        <Progress value={60} className="h-2" />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Communication</span>
                          <span className="font-medium">85%</span>
                        </div>
                        <Progress value={85} className="h-2" />
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <Button asChild className="w-full">
                        <Link to="/skill-mapper">
                          Update Skills Assessment
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="recommendations" className="space-y-4">
                <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Star className="h-5 w-5 mr-2" />
                      Personalized Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <h4 className="font-medium text-blue-900 mb-2">
                          🎯 Focus on System Design
                        </h4>
                        <p className="text-sm text-blue-700 mb-3">
                          Your system design skills need improvement for top-tier companies
                        </p>
                        <Button size="sm" variant="outline">
                          Start Learning
                        </Button>
                      </div>

                      <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                        <h4 className="font-medium text-green-900 mb-2">
                          ✅ Ready for Mid-Tier Companies
                        </h4>
                        <p className="text-sm text-green-700 mb-3">
                          Your current skills match well with companies like Cisco, Amadeus
                        </p>
                        <Button size="sm" variant="outline">
                          View Companies
                        </Button>
                      </div>

                      <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                        <h4 className="font-medium text-purple-900 mb-2">
                          🚀 Take Mock Interviews
                        </h4>
                        <p className="text-sm text-purple-700 mb-3">
                          Practice with company-specific mock interviews
                        </p>
                        <Button size="sm" variant="outline">
                          Start Practice
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Clock className="h-5 w-5 mr-2" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="p-1 rounded-full bg-primary/10">
                        <activity.icon className="h-3 w-3 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{activity.action}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Deadlines */}
            <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Calendar className="h-5 w-5 mr-2" />
                  Upcoming Deadlines
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingDeadlines.map((deadline, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
                      <div>
                        <p className="text-sm font-medium">{deadline.company}</p>
                        <p className="text-xs text-muted-foreground">{deadline.type}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-orange-600">
                          {new Date(deadline.deadline).toLocaleDateString()}
                        </p>
                        <AlertTriangle className="h-4 w-4 text-orange-500 ml-auto" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button asChild className="w-full justify-start" variant="outline">
                  <Link to="/mock-interview">
                    <Target className="h-4 w-4 mr-2" />
                    Take Mock Interview
                  </Link>
                </Button>
                <Button asChild className="w-full justify-start" variant="outline">
                  <Link to="/skill-mapper">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Update Skills
                  </Link>
                </Button>
                <Button asChild className="w-full justify-start" variant="outline">
                  <Link to="/companies">
                    <Building2 className="h-4 w-4 mr-2" />
                    Explore Companies
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}