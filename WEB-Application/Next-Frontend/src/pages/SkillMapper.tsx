import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  Target, 
  TrendingUp, 
  BookOpen, 
  CheckCircle, 
  AlertCircle,
  Star,
  Code,
  Database,
  Cloud,
  Brain,
  Zap
} from 'lucide-react';
import { skillsData } from '../data/companies';
import { useAppStore } from '../store/appStore';

export function SkillMapper() {
  const { completedSkills, addCompletedSkill, removeCompletedSkill } = useAppStore();
  const [selectedSkills, setSelectedSkills] = useState<string[]>(completedSkills);

  const allSkills = [
    { name: 'Data Structures & Algorithms', category: 'Programming', level: 'Essential', icon: Code },
    { name: 'Java', category: 'Programming', level: 'Essential', icon: Code },
    { name: 'Python', category: 'Programming', level: 'Essential', icon: Code },
    { name: 'JavaScript', category: 'Programming', level: 'Intermediate', icon: Code },
    { name: 'C++', category: 'Programming', level: 'Intermediate', icon: Code },
    { name: 'SQL', category: 'Database', level: 'Essential', icon: Database },
    { name: 'DBMS', category: 'Database', level: 'Essential', icon: Database },
    { name: 'System Design', category: 'Architecture', level: 'Advanced', icon: Cloud },
    { name: 'Cloud Computing', category: 'Infrastructure', level: 'Advanced', icon: Cloud },
    { name: 'DevOps', category: 'Infrastructure', level: 'Advanced', icon: Cloud },
    { name: 'Machine Learning', category: 'AI/ML', level: 'Specialized', icon: Brain },
    { name: 'Deep Learning', category: 'AI/ML', level: 'Specialized', icon: Brain },
    { name: 'React', category: 'Frontend', level: 'Intermediate', icon: Code },
    { name: 'Node.js', category: 'Backend', level: 'Intermediate', icon: Code },
    { name: 'REST APIs', category: 'Backend', level: 'Intermediate', icon: Code },
    { name: 'Networking', category: 'Infrastructure', level: 'Specialized', icon: Cloud },
    { name: 'Operating Systems', category: 'Systems', level: 'Intermediate', icon: Code },
    { name: 'Computer Networks', category: 'Systems', level: 'Intermediate', icon: Cloud },
    { name: 'OOP Concepts', category: 'Programming', level: 'Essential', icon: Code },
    { name: 'Microservices', category: 'Architecture', level: 'Advanced', icon: Cloud }
  ];

  const categories = ['Programming', 'Database', 'Architecture', 'Infrastructure', 'AI/ML', 'Frontend', 'Backend', 'Systems'];

  // Skill name to URL mapping from Skill-Matching.csv
  const skillUrlMap: Record<string, string> = {
    'Data Structures & Algorithms': 'https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2',
    'Java': 'https://www.youtube.com/watch?app=desktop&v=4PtaheVYGEE',
    'Python': 'https://www.youtube.com/playlist?list=PLZoTAELRMXVNUL99R4bDlVYsncUNvwUBB',
    'JavaScript': 'https://www.coursera.org/learn/javascript-interview-challenges',
    'C++': 'https://www.youtube.com/watch?v=I5Gr555bZEs',
    'SQL': 'https://takeuforward.org/dbms/most-asked-dbms-interview-questions',
    'DBMS': 'https://takeuforward.org/dbms/most-asked-dbms-interview-questions',
    'System Design': 'https://takeuforward.org/system-design/complete-system-design-roadmap-with-videos-for-sdes',
    'Cloud Computing': 'https://www.coursera.org/in/articles/cloud-computing-interview-questions',
    'DevOps': 'https://www.youtube.com/watch?v=GX6fOvaS0Xs',
    'Machine Learning': 'https://www.youtube.com/playlist?list=PLTDARY42LDV7WGmlzZtY-w9pemyPrKNUZ',
    'Deep Learning': 'https://www.youtube.com/playlist?list=PLZoTAELRMXVPGU70ZGsckrMdr0FteeRUi',
    'React': 'https://www.youtube.com/playlist?list=PLu71SKxNbfoDqgPchmvIsL4hTnJIrtige',
    'Node.js': 'https://www.codecademy.com/learn/learn-node-js',
    'REST APIS': 'https://www.youtube.com/watch?v=qbLc5a9jdXo',
    'Networking': 'https://www.youtube.com/watch?v=IPvYjXCsTg8',
    'Operating Systems': 'https://takeuforward.org/operating-system/most-asked-operating-system-interview-questions',
    'Computer Networks': 'https://takeuforward.org/computer-network/most-asked-computer-networks-interview-questions',
    'OOP Concept': 'https://www.youtube.com/watch?v=u99wAoBjDvQ',
    'Microservices': 'https://www.youtube.com/watch?v=v_ABLktEwRU&t=8s',
  };

  const handleSkillToggle = (skillName: string) => {
    if (selectedSkills.includes(skillName)) {
      setSelectedSkills(prev => prev.filter(s => s !== skillName));
      removeCompletedSkill(skillName);
    } else {
      setSelectedSkills(prev => [...prev, skillName]);
      addCompletedSkill(skillName);
    }
  };

  const getSkillAnalysis = () => {
    const totalSkills = allSkills.length;
    const completedCount = selectedSkills.length;
    const completionPercentage = Math.round((completedCount / totalSkills) * 100);

    const essentialSkills = allSkills.filter(skill => skill.level === 'Essential');
    const completedEssential = essentialSkills.filter(skill => selectedSkills.includes(skill.name));
    const essentialPercentage = Math.round((completedEssential.length / essentialSkills.length) * 100);

    return {
      totalSkills,
      completedCount,
      completionPercentage,
      essentialPercentage,
      readinessLevel: essentialPercentage >= 80 ? 'Excellent' : essentialPercentage >= 60 ? 'Good' : 'Needs Improvement',
      weakAreas: categories.filter(category => {
        const categorySkills = allSkills.filter(skill => skill.category === category);
        const completedInCategory = categorySkills.filter(skill => selectedSkills.includes(skill.name));
        return (completedInCategory.length / categorySkills.length) < 0.5;
      })
    };
  };

  const analysis = getSkillAnalysis();

  const getReadinessColor = (level: string) => {
    switch (level) {
      case 'Excellent':
        return 'text-green-600';
      case 'Good':
        return 'text-blue-600';
      default:
        return 'text-orange-600';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Essential':
        return 'bg-red-100 text-red-800';
      case 'Intermediate':
        return 'bg-blue-100 text-blue-800';
      case 'Advanced':
        return 'bg-purple-100 text-purple-800';
      case 'Specialized':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            Skill Mapper & Gap Analyzer
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover your skill gaps and get personalized recommendations to match your target companies' requirements
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Analysis Cards */}
          <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="mx-auto mb-2 p-3 rounded-full bg-primary/10">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Overall Progress</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">
                {analysis.completionPercentage}%
              </div>
              <Progress value={analysis.completionPercentage} className="mb-2" />
              <p className="text-sm text-muted-foreground">
                {analysis.completedCount} of {analysis.totalSkills} skills completed
              </p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="mx-auto mb-2 p-3 rounded-full bg-green-100">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle>Readiness Level</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className={`text-2xl font-bold mb-2 ${getReadinessColor(analysis.readinessLevel)}`}>
                {analysis.readinessLevel}
              </div>
              <Progress value={analysis.essentialPercentage} className="mb-2" />
              <p className="text-sm text-muted-foreground">
                {analysis.essentialPercentage}% of essential skills mastered
              </p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="mx-auto mb-2 p-3 rounded-full bg-orange-100">
                <AlertCircle className="h-6 w-6 text-orange-600" />
              </div>
              <CardTitle>Focus Areas</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-2xl font-bold text-orange-600 mb-2">
                {analysis.weakAreas.length}
              </div>
              <div className="space-y-1">
                {analysis.weakAreas.slice(0, 3).map(area => (
                  <Badge key={area} variant="outline" className="text-xs">
                    {area}
                  </Badge>
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Categories needing attention
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="skills" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="skills">Skills Assessment</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            <TabsTrigger value="roadmap">Learning Roadmap</TabsTrigger>
          </TabsList>

          <TabsContent value="skills" className="space-y-6">
            <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Select Your Skills
                </CardTitle>
                <CardDescription>
                  Check all the skills you're comfortable with. Be honest to get accurate recommendations.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {categories.map(category => {
                    const categorySkills = allSkills.filter(skill => skill.category === category);
                    const completedInCategory = categorySkills.filter(skill => selectedSkills.includes(skill.name));
                    const categoryProgress = (completedInCategory.length / categorySkills.length) * 100;
                    const IconComponent = categorySkills[0]?.icon;

                    return (
                      <div key={category} className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold flex items-center">
                            {IconComponent && <IconComponent className="h-5 w-5 mr-2" />}
                            {category}
                          </h3>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-muted-foreground">
                              {completedInCategory.length}/{categorySkills.length}
                            </span>
                            <div className="w-20">
                              <Progress value={categoryProgress} className="h-2" />
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {categorySkills.map(skill => (
                            <div
                              key={skill.name}
                              className={
                                'flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors' +
                                (skillUrlMap[skill.name] ? ' cursor-pointer hover:shadow-md' : '')
                              }
                              onClick={() => {
                                if (skillUrlMap[skill.name]) {
                                  window.open(skillUrlMap[skill.name], '_blank');
                                }
                              }}
                            >
                              <Checkbox
                                id={skill.name}
                                checked={selectedSkills.includes(skill.name)}
                                onClick={e => e.stopPropagation()}
                                onCheckedChange={() => handleSkillToggle(skill.name)}
                              />
                              <div className="flex-1 min-w-0">
                                <label
                                  htmlFor={skill.name}
                                  className="text-sm font-medium cursor-pointer"
                                  onClick={e => e.stopPropagation()}
                                >
                                  {skill.name}
                                </label>
                                <div className="mt-1">
                                  <Badge className={getLevelColor(skill.level)}>
                                    {skill.level}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        {category !== categories[categories.length - 1] && <Separator />}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-6">
            <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Personalized Recommendations
                </CardTitle>
                <CardDescription>
                  Based on your current skills, here are the companies and roles that match your profile
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-green-600">✅ You're Ready For</h4>
                    <div className="space-y-3">
                      <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium">Mass Recruiters</h5>
                          <Badge className="bg-green-100 text-green-800">Ready</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          TCS, Infosys, Cognizant, Accenture
                        </p>
                        <div className="flex items-center space-x-2">
                          <div className="flex space-x-1">
                            {[1, 2, 3, 4].map(star => (
                              <Star key={star} className="h-4 w-4 fill-green-500 text-green-500" />
                            ))}
                            <Star className="h-4 w-4 text-gray-300" />
                          </div>
                          <span className="text-sm text-muted-foreground">Match Score: 85%</span>
                        </div>
                      </div>

                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium">Mid-Tier Companies</h5>
                          <Badge className="bg-blue-100 text-blue-800">Good Match</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          Cisco, Amadeus, Josh Technology
                        </p>
                        <div className="flex items-center space-x-2">
                          <div className="flex space-x-1">
                            {[1, 2, 3].map(star => (
                              <Star key={star} className="h-4 w-4 fill-blue-500 text-blue-500" />
                            ))}
                            <Star className="h-4 w-4 text-gray-300" />
                            <Star className="h-4 w-4 text-gray-300" />
                          </div>
                          <span className="text-sm text-muted-foreground">Match Score: 65%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-orange-600">🎯 Work Towards</h4>
                    <div className="space-y-3">
                      <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium">Top-Tier Companies</h5>
                          <Badge className="bg-orange-100 text-orange-800">Stretch Goal</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          Amazon, Google, Microsoft, JP Morgan
                        </p>
                        <div className="flex items-center space-x-2">
                          <div className="flex space-x-1">
                            {[1, 2].map(star => (
                              <Star key={star} className="h-4 w-4 fill-orange-500 text-orange-500" />
                            ))}
                            <Star className="h-4 w-4 text-gray-300" />
                            <Star className="h-4 w-4 text-gray-300" />
                            <Star className="h-4 w-4 text-gray-300" />
                          </div>
                          <span className="text-sm text-muted-foreground">Match Score: 40%</span>
                        </div>
                        <div className="mt-2 text-sm text-orange-600">
                          Missing: System Design, Advanced DSA
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="roadmap" className="space-y-6">
            <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="h-5 w-5 mr-2" />
                  Your Learning Roadmap
                </CardTitle>
                <CardDescription>
                  A structured path to improve your skills and target higher-tier companies
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {/* Immediate Focus */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                        <span className="text-sm font-bold text-red-600">1</span>
                      </div>
                      <h3 className="text-lg font-semibold text-red-600">Immediate Focus (Next 2 weeks)</h3>
                    </div>
                    <div className="ml-10 space-y-3">
                      <div className="p-4 bg-red-50 rounded-lg border-l-4 border-red-400">
                        <h4 className="font-medium mb-2">Master Essential Skills</h4>
                        <div className="space-y-2">
                          {allSkills
                            .filter(skill => skill.level === 'Essential' && !selectedSkills.includes(skill.name))
                            .slice(0, 3)
                            .map(skill => (
                              <div key={skill.name} className="flex items-center space-x-2">
                                <CheckCircle className="h-4 w-4 text-red-500" />
                                <span className="text-sm">{skill.name}</span>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Short Term */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-sm font-bold text-blue-600">2</span>
                      </div>
                      <h3 className="text-lg font-semibold text-blue-600">Short Term (Next 1-2 months)</h3>
                    </div>
                    <div className="ml-10 space-y-3">
                      <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                        <h4 className="font-medium mb-2">Build Intermediate Skills</h4>
                        <div className="space-y-2">
                          {allSkills
                            .filter(skill => skill.level === 'Intermediate' && !selectedSkills.includes(skill.name))
                            .slice(0, 3)
                            .map(skill => (
                              <div key={skill.name} className="flex items-center space-x-2">
                                <CheckCircle className="h-4 w-4 text-blue-500" />
                                <span className="text-sm">{skill.name}</span>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Long Term */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                        <span className="text-sm font-bold text-green-600">3</span>
                      </div>
                      <h3 className="text-lg font-semibold text-green-600">Long Term (Next 3-6 months)</h3>
                    </div>
                    <div className="ml-10 space-y-3">
                      <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
                        <h4 className="font-medium mb-2">Advanced & Specialized Skills</h4>
                        <div className="space-y-2">
                          {allSkills
                            .filter(skill => (skill.level === 'Advanced' || skill.level === 'Specialized') && !selectedSkills.includes(skill.name))
                            .slice(0, 3)
                            .map(skill => (
                              <div key={skill.name} className="flex items-center space-x-2">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                <span className="text-sm">{skill.name}</span>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 p-4 bg-gradient-to-r from-primary/10 to-blue-100 rounded-lg">
                  <h4 className="font-semibold mb-2">🎯 Your Goal</h4>
                  <p className="text-sm text-muted-foreground">
                    Following this roadmap will increase your readiness for top-tier companies from {analysis.essentialPercentage}% to 85%+ within 6 months.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}