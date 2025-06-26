import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { companies } from '../data/companies';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { 
  Search, 
  Filter, 
  Building2, 
  IndianRupee, 
  Calendar,
  Users,
  ArrowRight,
  BookmarkPlus,
  Star
} from 'lucide-react';
import { useAppStore } from '../store/appStore';

export function Companies() {
  const { savedCompanies, addSavedCompany, removeSavedCompany } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTier, setSelectedTier] = useState('all');
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);
  const [packageRange, setPackageRange] = useState([0, 50]);
  const [sortBy, setSortBy] = useState('package-desc');

  const branches = ['CSE', 'IT', 'Circuit', 'Core'];
  const tiers = ['Top-Tier Companies', 'Mid-Tier Companies', 'Mass Recruiters', 'Core Engg.', 'International Roles'];

  const filteredAndSortedCompanies = useMemo(() => {
    let filtered = companies.filter(company => {
      const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          company.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          company.requirements.some(req => req.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesTier = selectedTier === 'all' || company.tier === selectedTier;
      
      const matchesBranches = selectedBranches.length === 0 || 
                            selectedBranches.some(branch => company.branches.includes(branch));
      
      const maxPackage = Math.max(...company.packageRange.split(' - ').map(p => parseFloat(p.replace(/[^\d.]/g, ''))));
      const matchesPackage = maxPackage >= packageRange[0] && maxPackage <= packageRange[1];
      
      return matchesSearch && matchesTier && matchesBranches && matchesPackage;
    });

    // Sort companies
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'package-desc':
          const aMax = Math.max(...a.packageRange.split(' - ').map(p => parseFloat(p.replace(/[^\d.]/g, ''))));
          const bMax = Math.max(...b.packageRange.split(' - ').map(p => parseFloat(p.replace(/[^\d.]/g, ''))));
          return bMax - aMax;
        case 'package-asc':
          const aMin = Math.min(...a.packageRange.split(' - ').map(p => parseFloat(p.replace(/[^\d.]/g, ''))));
          const bMin = Math.min(...b.packageRange.split(' - ').map(p => parseFloat(p.replace(/[^\d.]/g, ''))));
          return aMin - bMin;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchTerm, selectedTier, selectedBranches, packageRange, sortBy]);

  const handleBranchToggle = (branch: string) => {
    setSelectedBranches(prev =>
      prev.includes(branch)
        ? prev.filter(b => b !== branch)
        : [...prev, branch]
    );
  };

  const handleSaveCompany = (companyId: string) => {
    if (savedCompanies.includes(companyId)) {
      removeSavedCompany(companyId);
    } else {
      addSavedCompany(companyId);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            Company Directory
          </h1>
          <p className="text-lg text-muted-foreground">
            Discover {companies.length} companies with detailed interview guides and preparation materials
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24 bg-white/80 backdrop-blur-sm border-none shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Filter className="h-5 w-5 mr-2" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Search */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search companies, roles, skills..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <Separator />

                {/* Company Tier */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Company Tier</label>
                  <Select value={selectedTier} onValueChange={setSelectedTier}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select tier" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Tiers</SelectItem>
                      {tiers.map(tier => (
                        <SelectItem key={tier} value={tier}>{tier}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Eligible Branches */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Eligible Branches</label>
                  <div className="space-y-2">
                    {branches.map(branch => (
                      <div key={branch} className="flex items-center space-x-2">
                        <Checkbox
                          id={branch}
                          checked={selectedBranches.includes(branch)}
                          onCheckedChange={() => handleBranchToggle(branch)}
                        />
                        <label htmlFor={branch} className="text-sm">{branch}</label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Package Range */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Package Range: {packageRange[0]}-{packageRange[1]} LPA
                  </label>
                  <Slider
                    value={packageRange}
                    onValueChange={setPackageRange}
                    max={50}
                    min={0}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>0 LPA</span>
                    <span>50 LPA</span>
                  </div>
                </div>

                {/* Sort By */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Sort By</label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="package-desc">Package (High to Low)</SelectItem>
                      <SelectItem value="package-asc">Package (Low to High)</SelectItem>
                      <SelectItem value="name">Company Name</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Companies Grid */}
          <div className="lg:col-span-3">
            <div className="mb-6 flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {filteredAndSortedCompanies.length} of {companies.length} companies
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredAndSortedCompanies.map((company) => (
                <Card key={company.id} className="border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm group">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <Building2 className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg group-hover:text-primary transition-colors">
                            {company.name}
                          </CardTitle>
                          <CardDescription className="text-sm">
                            {company.role}
                          </CardDescription>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSaveCompany(company.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <BookmarkPlus className={`h-4 w-4 ${savedCompanies.includes(company.id) ? 'fill-current text-primary' : ''}`} />
                      </Button>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <IndianRupee className="h-4 w-4 text-green-600" />
                        <span className="font-semibold text-green-600">
                          {company.packageRange} LPA
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{company.year}</span>
                      </div>
                    </div>

                    <Badge className={getTierColor(company.tier)}>
                      {company.tier}
                    </Badge>

                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Users className="h-4 w-4 mr-2" />
                        <span>Eligible: {company.branches.join(', ')}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm font-medium">Key Skills:</div>
                      <div className="flex flex-wrap gap-1">
                        {company.requirements.slice(0, 4).map((skill, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {company.requirements.length > 4 && (
                          <Badge variant="outline" className="text-xs">
                            +{company.requirements.length - 4} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <Button asChild className="w-full group">
                        <Link to={`/company/${company.id}`}>
                          View Interview Guide
                          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredAndSortedCompanies.length === 0 && (
              <div className="text-center py-16">
                <Building2 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No companies found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your filters or search terms
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}