import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, 
  Search, 
  BarChart3, 
  Mic, 
  ArrowRight, 
  CheckCircle, 
  Users,
  Target,
  BookOpen
} from 'lucide-react';

export function Home() {
  const features = [
    {
      icon: Building2,
      title: "Company-Specific Prep",
      description: "Detailed guides for 30+ companies with interview patterns, skills required, and preparation strategies."
    },
    {
      icon: Search,
      title: "Interview Round Breakdown",
      description: "Complete breakdown of each interview round with sample questions and expected difficulty levels."
    },
    {
      icon: BarChart3,
      title: "Skill Gap Analyzer",
      description: "Identify your skill gaps and get personalized learning paths to meet company requirements."
    },
    {
      icon: Mic,
      title: "Mock Interview Simulator",
      description: "Practice with AI-powered mock interviews tailored to specific companies and roles."
    }
  ];

  const stats = [
    { label: "Companies Analyzed", value: "30+" },
    { label: "Interview Patterns Mapped", value: "100+" },
    { label: "Students Helped", value: "1000+" },
    { label: "Success Rate", value: "85%" }
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "CSE, Final Year",
      company: "Placed at Amazon",
      content: "PlacementPrep's company-specific guides helped me understand exactly what Amazon was looking for. Got placed as SDE-1!"
    },
    {
      name: "Rahul Patel",
      role: "IT, Final Year", 
      company: "Placed at JP Morgan",
      content: "The skill gap analyzer showed me exactly what I needed to focus on. Cracked JP Morgan in my first attempt!"
    },
    {
      name: "Ankit Kumar",
      role: "Circuit, Final Year",
      company: "Placed at Cisco",
      content: "Mock interviews were incredibly helpful. Felt confident during my actual Cisco interview rounds."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-blue-50/50 to-purple-50/30">
        <div className="container mx-auto px-4 py-20 lg:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-6">
               Your Ultimate Placement Partner
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent">
              Ace Your Campus Placements
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              Company-specific interview guides, skill mappers, and mock interviews tailored for your college placements. 
              Get placed at your dream company with our data-driven preparation platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-lg px-8">
                <Link to="/companies">
                  Browse Companies
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8">
                <Link to="/skill-mapper">
                  Take Skill Assessment
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need to Get Placed
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our comprehensive platform provides all the tools and resources you need to succeed in your placement journey.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white/80 backdrop-blur-sm">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 p-3 rounded-full bg-primary/10">
                    <feature.icon className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Company Tiers Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Companies Across All Tiers
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From top-tier tech giants to core engineering companies, we cover preparation for all company categories.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-2 border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-6 w-6 mr-2 text-yellow-600" />
                  Top-Tier Companies
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  High-package companies with competitive selection processes
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">Amazon</Badge>
                  <Badge variant="outline">Google</Badge>
                  <Badge variant="outline">Microsoft</Badge>
                  <Badge variant="outline">JP Morgan</Badge>
                </div>
                <div className="mt-4 text-sm font-medium text-green-600">
                  Package: 15+ LPA
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-6 w-6 mr-2 text-blue-600" />
                  Mid-Tier Companies
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Established companies with good growth opportunities
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">Cisco</Badge>
                  <Badge variant="outline">Amadeus</Badge>
                  <Badge variant="outline">ZS Associates</Badge>
                  <Badge variant="outline">BNY Mellon</Badge>
                </div>
                <div className="mt-4 text-sm font-medium text-green-600">
                  Package: 8-15 LPA
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="h-6 w-6 mr-2 text-green-600" />
                  Mass Recruiters
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Large recruiters with multiple openings and training programs
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">TCS</Badge>
                  <Badge variant="outline">Infosys</Badge>
                  <Badge variant="outline">Cognizant</Badge>
                  <Badge variant="outline">Accenture</Badge>
                </div>
                <div className="mt-4 text-sm font-medium text-green-600">
                  Package: 3-8 LPA
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-blue-50/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Success Stories
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Hear from students who landed their dream jobs using PlacementPrep.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <Badge variant="secondary">{testimonial.company}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 italic">
                    "{testimonial.content}"
                  </p>
                  <div className="border-t pt-4">
                    <div className="font-medium">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Your Placement Journey?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join thousands of students who have successfully placed at their dream companies using our platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary" className="text-lg px-8">
              <Link to="/companies">
                Explore Companies
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg px-8 border-white text-white hover:bg-white hover:text-primary">
              <Link to="/dashboard">
                Create Account
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}