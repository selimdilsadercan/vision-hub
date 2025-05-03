import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, CheckCircle2, Circle, FileText, Link2, Mail, MessageSquare, User, Users, Clock, Calendar, Award } from "lucide-react";

// Static data based on the example plan
const educationPlan = {
  title: "Introduction to Data Science",
  mentor: "Elif Kaya",
  mentorRole: "Senior Data Scientist",
  mentorBio:
    "Elif has over 8 years of experience in data science and machine learning. She has worked with companies like Google and Microsoft, and has a passion for teaching.",
  mentorContact: "elif.kaya@example.com",
  projectHandout: "Perform basic data analysis using Pandas, visualize the data, and prepare a short data report.",
  enrollmentDetails: {
    enrolledStudents: 124,
    duration: "4 weeks",
    level: "Beginner",
    lastUpdated: "2 weeks ago",
    certificate: true
  },
  nodes: [
    {
      id: 1,
      title: "Python Basics",
      resource: "Python Crash Course - YouTube",
      description: "Learn the fundamentals of Python programming including variables, loops, and conditionals.",
      skill: "Python",
      microSkills: ["variables", "loops", "conditionals"],
      instructions: "Watch the video and code a simple calculator.",
      completed: true
    },
    {
      id: 2,
      title: "Introduction to Pandas",
      resource: "Data Analysis with Pandas - YouTube",
      description: "Introduction to Pandas library for data manipulation and analysis in Python.",
      skill: "Data Analysis",
      microSkills: ["creating DataFrames", "reading data", "filtering"],
      instructions: "Read a CSV file and filter it by age.",
      completed: true
    },
    {
      id: 3,
      title: "Data Cleaning",
      resource: "Data Cleaning Techniques",
      description: "Learn how to handle missing data, remove duplicates, and prepare datasets for analysis.",
      skill: "Data Cleaning",
      microSkills: ["handling null values", "removing duplicates"],
      instructions: "Fill in missing values and clean outliers.",
      completed: false
    },
    {
      id: 4,
      title: "Visualization",
      resource: "Matplotlib and Seaborn Tutorial",
      description: "Create effective data visualizations using Matplotlib and Seaborn libraries.",
      skill: "Visualization",
      microSkills: ["histogram", "scatter plot", "bar chart"],
      instructions: "Create at least 3 different charts using your dataset.",
      completed: false
    }
  ],
  projectDetails: {
    goal: "By the end of this learning plan, the student will have performed basic data analysis on the Titanic dataset and created a data report supported with visualizations.",
    description: [
      "Download and analyze the Titanic dataset",
      "Clean missing data and interpret categorical columns",
      "Explore the effects of age, gender, and class on survival",
      "Support your findings with at least 3 types of charts (e.g., bar, histogram, scatter)",
      "Prepare a short report in Markdown including:",
      "- Problem statement",
      "- Data exploration",
      "- Findings with visualizations"
    ],
    submissionFormat: "Submit as either a PDF or a web page link.",
    evaluationCriteria: [
      "Proper data cleaning and usage",
      "Meaningful and explanatory visualizations",
      "Clear and understandable written explanations across all skills"
    ]
  }
};

export default function EducationPlanPage() {
  const completedNodes = educationPlan.nodes.filter((node) => node.completed).length;
  const progress = (completedNodes / educationPlan.nodes.length) * 100;

  return (
    <div className="container mx-auto py-12 px-4 md:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content - 2/3 width on large screens */}
        <div className="lg:col-span-2 space-y-10">
          {/* Header Section */}
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <h1 className="text-3xl font-bold">{educationPlan.title}</h1>
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-muted-foreground" />
                <span className="text-muted-foreground">Mentor: {educationPlan.mentor}</span>
              </div>
            </div>
            <p className="text-muted-foreground text-lg">{educationPlan.projectHandout}</p>
            <div className="flex items-center gap-4 p-2">
              <Progress value={progress} className="w-[200px]" />
              <span className="text-sm text-muted-foreground">
                {completedNodes}/{educationPlan.nodes.length} nodes completed
              </span>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Main Content */}
          <Tabs defaultValue="nodes" className="space-y-6">
            <TabsList className="w-full md:w-auto">
              <TabsTrigger value="nodes" className="px-6 py-2">
                Learning Nodes
              </TabsTrigger>
              <TabsTrigger value="project" className="px-6 py-2">
                Project Details
              </TabsTrigger>
              <TabsTrigger value="mentor" className="px-6 py-2">
                Mentor
              </TabsTrigger>
            </TabsList>

            <TabsContent value="nodes" className="space-y-6 pt-4">
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-muted hidden md:block"></div>

                {educationPlan.nodes.map((node) => (
                  <div key={node.id} className="relative pl-0 md:pl-10 mb-6">
                    {/* Timeline dot */}
                    <div className="absolute left-4 top-4 w-3 h-3 rounded-full bg-primary hidden md:block"></div>

                    <Card className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                          <CardTitle className="flex items-center gap-2 text-lg">
                            {node.completed ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <Circle className="w-5 h-5 text-muted-foreground" />}
                            {node.title}
                          </CardTitle>
                          <Badge variant="secondary" className="w-fit">
                            {node.skill}
                          </Badge>
                        </div>
                        <CardDescription className="flex items-center gap-2 mt-1">
                          <Link2 className="w-4 h-4" />
                          {node.resource}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4 pb-4">
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm">Description</h4>
                          <p className="text-muted-foreground text-sm">{node.description}</p>
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm">Micro Skills</h4>
                          <div className="flex flex-wrap gap-2">
                            {node.microSkills.map((skill) => (
                              <Badge key={skill} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm">Instructions</h4>
                          <p className="text-muted-foreground text-sm">{node.instructions}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="project" className="space-y-6 pt-4">
              <Card className="overflow-hidden">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Project Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 pb-6">
                  <div className="space-y-3">
                    <h4 className="font-medium">Goal</h4>
                    <p className="text-muted-foreground">{educationPlan.projectDetails.goal}</p>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium">Project Description</h4>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground pl-2">
                      {educationPlan.projectDetails.description.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium">Submission Format</h4>
                    <p className="text-muted-foreground">{educationPlan.projectDetails.submissionFormat}</p>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium">Evaluation Criteria</h4>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground pl-2">
                      {educationPlan.projectDetails.evaluationCriteria.map((criterion, index) => (
                        <li key={index}>{criterion}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="mentor" className="space-y-6 pt-4">
              <Card className="overflow-hidden">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    About the Mentor
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 pb-6">
                  <div className="flex items-start gap-4">
                    <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
                      <User className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold">{educationPlan.mentor}</h3>
                      <p className="text-muted-foreground">{educationPlan.mentorRole}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium">Bio</h4>
                    <p className="text-muted-foreground">{educationPlan.mentorBio}</p>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium">Contact</h4>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <a href={`mailto:${educationPlan.mentorContact}`} className="text-primary hover:underline">
                        {educationPlan.mentorContact}
                      </a>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <Button className="w-full" variant="outline">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Message Mentor
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Panel - 1/3 width on large screens */}
        <div className="lg:col-span-1">
          <div className="sticky top-6 space-y-6">
            <Card className="overflow-hidden">
              <CardHeader className="pb-4">
                <CardTitle>Course Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Enrolled Students</p>
                    <p className="text-2xl font-bold">{educationPlan.enrollmentDetails.enrolledStudents}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Duration</p>
                    <p className="text-lg">{educationPlan.enrollmentDetails.duration}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <BookOpen className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Level</p>
                    <p className="text-lg">{educationPlan.enrollmentDetails.level}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Last Updated</p>
                    <p className="text-lg">{educationPlan.enrollmentDetails.lastUpdated}</p>
                  </div>
                </div>

                {educationPlan.enrollmentDetails.certificate && (
                  <div className="flex items-center gap-3">
                    <Award className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Certificate</p>
                      <p className="text-lg">Available</p>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="border-t pt-4">
                <Button className="w-full">Enroll Now</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
