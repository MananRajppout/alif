import { Tags } from "lucide-react";

const viewerCompany: {
  id: string;
  name: string;
  position: string;
  companyLogoImage: string;
  companyName: string;
  companyDescription: string;
  companyWebsite: string;
  JobTitle: string;
  JobDescription: string;
  role: string;
}[] = [
  {
    id: "1",
    name: "Tech Innovators",
    position: "Senior Developer",
    companyLogoImage:
      "https://www.boat-lifestyle.com/cdn/shop/files/boAt_logo_small_3067da8c-a83b-46dd-b28b-6ef1e16ccd17_small.svg?v=1693549434",
    companyName: "Tech Innovators",
    companyDescription:
      "A leading company in cutting-edge technology solutions.",
    companyWebsite: "https://techinnovators.com",
    JobTitle: "Full Stack Developer",
    JobDescription:
      "Develop and maintain web applications using React and Node.js.",
    role: "Hiring",
  },
  {
    id: "2",
    name: "HealthTech Solutions",
    position: "Project Manager",
    companyLogoImage:
      "https://www.boat-lifestyle.com/cdn/shop/files/boAt_logo_small_3067da8c-a83b-46dd-b28b-6ef1e16ccd17_small.svg?v=1693549434",
    companyName: "HealthTech Solutions",
    companyDescription: "Pioneers in healthcare technology services.",
    companyWebsite: "https://healthtech.com",
    JobTitle: "Product Manager",
    JobDescription: "Oversee product development and team coordination.",
    role: "Hiring",
  },
  {
    id: "3",
    name: "FinCorp Ltd.",
    position: "Software Engineer",
    companyLogoImage:
      "https://www.boat-lifestyle.com/cdn/shop/files/boAt_logo_small_3067da8c-a83b-46dd-b28b-6ef1e16ccd17_small.svg?v=1693549434",
    companyName: "FinCorp Ltd.",
    companyDescription: "Financial services and consulting company.",
    companyWebsite: "https://fincorp.com",
    JobTitle: "Backend Developer",
    JobDescription:
      "Build scalable financial systems using Python and PostgreSQL.",
    role: "Hiring",
  },
  {
    id: "4",
    name: "EduCore",
    position: "Lead Designer",
    companyLogoImage:
      "https://www.boat-lifestyle.com/cdn/shop/files/boAt_logo_small_3067da8c-a83b-46dd-b28b-6ef1e16ccd17_small.svg?v=1693549434",
    companyName: "EduCore",
    companyDescription: "Innovating educational platforms for online learning.",
    companyWebsite: "https://educore.com",
    JobTitle: "UX/UI Designer",
    JobDescription: "Design intuitive user experiences for learning platforms.",
    role: "Hiring",
  },
  {
    id: "5",
    name: "GreenEnergy Inc.",
    position: "Environmental Analyst",
    companyLogoImage:
      "https://www.boat-lifestyle.com/cdn/shop/files/boAt_logo_small_3067da8c-a83b-46dd-b28b-6ef1e16ccd17_small.svg?v=1693549434",
    companyName: "GreenEnergy Inc.",
    companyDescription: "Developing sustainable energy solutions.",
    companyWebsite: "https://greenenergy.com",
    JobTitle: "Data Scientist",
    JobDescription:
      "Analyze environmental data to improve sustainability efforts.",
    role: "Hiring",
  },
  {
    id: "6",
    name: "Foodies Co.",
    position: "Marketing Lead",
    companyLogoImage:
      "https://www.boat-lifestyle.com/cdn/shop/files/boAt_logo_small_3067da8c-a83b-46dd-b28b-6ef1e16ccd17_small.svg?v=1693549434",
    companyName: "Foodies Co.",
    companyDescription:
      "Food delivery service connecting customers with local restaurants.",
    companyWebsite: "https://foodiesco.com",
    JobTitle: "Digital Marketing Manager",
    JobDescription: "Lead marketing campaigns and improve digital presence.",
    role: "Hiring",
  },
  {
    id: "7",
    name: "AutoTech",
    position: "Mechanical Engineer",
    companyLogoImage:
      "https://www.boat-lifestyle.com/cdn/shop/files/boAt_logo_small_3067da8c-a83b-46dd-b28b-6ef1e16ccd17_small.svg?v=1693549434",
    companyName: "AutoTech",
    companyDescription: "Leading the way in autonomous vehicle technologies.",
    companyWebsite: "https://autotech.com",
    JobTitle: "Machine Learning Engineer",
    JobDescription: "Develop autonomous driving algorithms using AI and ML.",
    role: "Hiring",
  },
  {
    id: "8",
    name: "Medisoft",
    position: "Data Analyst",
    companyLogoImage:
      "https://www.boat-lifestyle.com/cdn/shop/files/boAt_logo_small_3067da8c-a83b-46dd-b28b-6ef1e16ccd17_small.svg?v=1693549434",
    companyName: "Medisoft",
    companyDescription: "Healthcare software solutions provider.",
    companyWebsite: "https://medisoft.com",
    JobTitle: "DevOps Engineer",
    JobDescription:
      "Ensure smooth deployment and maintenance of healthcare systems.",
    role: "Hiring",
  },
  {
    id: "9",
    name: "RetailHub",
    position: "Sales Manager",
    companyLogoImage:
      "https://www.boat-lifestyle.com/cdn/shop/files/boAt_logo_small_3067da8c-a83b-46dd-b28b-6ef1e16ccd17_small.svg?v=1693549434",
    companyName: "RetailHub",
    companyDescription:
      "Retail technology solutions for seamless shopping experiences.",
    companyWebsite: "https://retailhub.com",
    JobTitle: "Frontend Developer",
    JobDescription:
      "Build responsive retail web applications with React and Tailwind.",
    role: "Hiring",
  },
  {
    id: "10",
    name: "CloudSphere",
    position: "Cloud Architect",
    companyLogoImage:
      "https://www.boat-lifestyle.com/cdn/shop/files/boAt_logo_small_3067da8c-a83b-46dd-b28b-6ef1e16ccd17_small.svg?v=1693549434",
    companyName: "CloudSphere",
    companyDescription: "Cloud infrastructure and security services.",
    companyWebsite: "https://cloudsphere.com",
    JobTitle: "Cloud Engineer",
    JobDescription: "Design and deploy scalable cloud infrastructure on AWS.",
    role: "Hiring",
  },
];

const viewerPerson: {
  id: string;
  name: string;
  position: string;
  image: string;
  mail: string;
  phone: string;
  resume: string;
  description: string;
  tags: string[];
  role: string;
}[] = [
  {
    id: "1",
    name: "Alice Johnson",
    position: "Software Engineer",
    image:
      "https://www.boat-lifestyle.com/cdn/shop/files/boAt_logo_small_3067da8c-a83b-46dd-b28b-6ef1e16ccd17_small.svg?v=1693549434",
    mail: "alice.johnson@example.com",
    phone: "+1-234-567-8901",
    resume: "https://example.com/resume_alice.pdf",
    description:
      "Passionate about full-stack development with expertise in React, Node.js, and MongoDB.",
    tags: ["React", "Node.js", "MongoDB", "Full Stack"],
    role: "Job Seeker",
  },
  {
    id: "2",
    name: "Bob Smith",
    position: "Data Scientist",
    image:
      "https://www.boat-lifestyle.com/cdn/shop/files/boAt_logo_small_3067da8c-a83b-46dd-b28b-6ef1e16ccd17_small.svg?v=1693549434",
    mail: "bob.smith@example.com",
    phone: "+1-234-567-8902",
    resume: "https://example.com/resume_bob.pdf",
    description:
      "Experienced in data analysis, machine learning, and statistical modeling using Python and R.",
    tags: ["Data Science", "Machine Learning", "Python", "R"],
    role: "Job Seeker",
  },
  {
    id: "3",
    name: "Catherine Lee",
    position: "UX/UI Designer",
    image:
      "https://www.boat-lifestyle.com/cdn/shop/files/boAt_logo_small_3067da8c-a83b-46dd-b28b-6ef1e16ccd17_small.svg?v=1693549434",
    mail: "catherine.lee@example.com",
    phone: "+1-234-567-8903",
    resume: "https://example.com/resume_catherine.pdf",
    description:
      "Skilled in designing user-friendly interfaces for web and mobile applications.",
    tags: ["UX Design", "UI Design", "Figma", "Adobe XD"],
    role: "Job Seeker",
  },
  {
    id: "4",
    name: "David Brown",
    position: "Backend Developer",
    image:
      "https://www.boat-lifestyle.com/cdn/shop/files/boAt_logo_small_3067da8c-a83b-46dd-b28b-6ef1e16ccd17_small.svg?v=1693549434",
    mail: "david.brown@example.com",
    phone: "+1-234-567-8904",
    resume: "https://example.com/resume_david.pdf",
    description:
      "Specializes in backend development with Python, Django, and PostgreSQL.",
    tags: ["Python", "Django", "PostgreSQL", "Backend"],
    role: "Job Seeker",
  },
  {
    id: "5",
    name: "Emily White",
    position: "Project Manager",
    image:
      "https://www.boat-lifestyle.com/cdn/shop/files/boAt_logo_small_3067da8c-a83b-46dd-b28b-6ef1e16ccd17_small.svg?v=1693549434",
    mail: "emily.white@example.com",
    phone: "+1-234-567-8905",
    resume: "https://example.com/resume_emily.pdf",
    description:
      "Project manager with expertise in Agile and Scrum methodologies.",
    tags: ["Project Management", "Agile", "Scrum", "Leadership"],
    role: "Job Seeker",
  },
  {
    id: "6",
    name: "Frank Green",
    position: "DevOps Engineer",
    image:
      "https://www.boat-lifestyle.com/cdn/shop/files/boAt_logo_small_3067da8c-a83b-46dd-b28b-6ef1e16ccd17_small.svg?v=1693549434",
    mail: "frank.green@example.com",
    phone: "+1-234-567-8906",
    resume: "https://example.com/resume_frank.pdf",
    description:
      "Experienced in CI/CD pipelines, Docker, and cloud infrastructure on AWS.",
    tags: ["DevOps", "Docker", "AWS", "CI/CD"],
    role: "Job Seeker",
  },
  {
    id: "7",
    name: "Grace Miller",
    position: "Mobile App Developer",
    image:
      "https://www.boat-lifestyle.com/cdn/shop/files/boAt_logo_small_3067da8c-a83b-46dd-b28b-6ef1e16ccd17_small.svg?v=1693549434",
    mail: "grace.miller@example.com",
    phone: "+1-234-567-8907",
    resume: "https://example.com/resume_grace.pdf",
    description:
      "Develops cross-platform mobile apps using React Native and Flutter.",
    tags: ["React Native", "Flutter", "Mobile Development", "iOS/Android"],
    role: "Job Seeker",
  },
  {
    id: "8",
    name: "Henry Wilson",
    position: "Cloud Engineer",
    image:
      "https://www.boat-lifestyle.com/cdn/shop/files/boAt_logo_small_3067da8c-a83b-46dd-b28b-6ef1e16ccd17_small.svg?v=1693549434",
    mail: "henry.wilson@example.com",
    phone: "+1-234-567-8908",
    resume: "https://example.com/resume_henry.pdf",
    description: "Designs and implements cloud solutions using AWS and GCP.",
    tags: ["AWS", "GCP", "Cloud Architecture", "Kubernetes"],
    role: "Job Seeker",
  },
  {
    id: "9",
    name: "Ivy Thompson",
    position: "Marketing Specialist",
    image:
      "https://www.boat-lifestyle.com/cdn/shop/files/boAt_logo_small_3067da8c-a83b-46dd-b28b-6ef1e16ccd17_small.svg?v=1693549434",
    mail: "ivy.thompson@example.com",
    phone: "+1-234-567-8909",
    resume: "https://example.com/resume_ivy.pdf",
    description:
      "Digital marketing expert with skills in SEO, SEM, and content strategy.",
    tags: ["SEO", "SEM", "Content Marketing", "Digital Strategy"],
    role: "Job Seeker",
  },
  {
    id: "10",
    name: "Jack Taylor",
    position: "Game Developer",
    image:
      "https://www.boat-lifestyle.com/cdn/shop/files/boAt_logo_small_3067da8c-a83b-46dd-b28b-6ef1e16ccd17_small.svg?v=1693549434",
    mail: "jack.taylor@example.com",
    phone: "+1-234-567-8910",
    resume: "https://example.com/resume_jack.pdf",
    description: "Game developer skilled in Unity and Unreal Engine.",
    tags: ["Game Development", "Unity", "Unreal Engine", "C#"],
    role: "Job Seeker",
  },
  {
    id: "11",
    name: "Frank Green",
    position: "DevOps Engineer",
    image:
      "https://www.boat-lifestyle.com/cdn/shop/files/boAt_logo_small_3067da8c-a83b-46dd-b28b-6ef1e16ccd17_small.svg?v=1693549434",
    mail: "frank.green@example.com",
    phone: "+1-234-567-8906",
    resume: "https://example.com/resume_frank.pdf",
    description:
      "Experienced in CI/CD pipelines, Docker, and cloud infrastructure on AWS.",
    tags: ["DevOps", "Docker", "AWS", "CI/CD"],
    role: "Job Seeker",
  },
  {
    id: "12",
    name: "Grace Miller",
    position: "Mobile App Developer",
    image:
      "https://www.boat-lifestyle.com/cdn/shop/files/boAt_logo_small_3067da8c-a83b-46dd-b28b-6ef1e16ccd17_small.svg?v=1693549434",
    mail: "grace.miller@example.com",
    phone: "+1-234-567-8907",
    resume: "https://example.com/resume_grace.pdf",
    description:
      "Develops cross-platform mobile apps using React Native and Flutter.",
    tags: ["React Native", "Flutter", "Mobile Development", "iOS/Android"],
    role: "Job Seeker",
  },
];

export const viewerForBroadcaster = () => {
  const viewers = [...viewerCompany, ...viewerPerson];

  return viewers;
};

export const viewerForRecruiter = (requiredWord: string) => {
  const lowercasedRequiredWord = requiredWord.toLowerCase();

  const sortedViewerPerson = viewerPerson.sort((a, b) => {
    // Check for matches in tags, description, and position
    const aTagMatches = a.tags.filter((tag) =>
      tag.toLowerCase().includes(lowercasedRequiredWord)
    ).length;
    const bTagMatches = b.tags.filter((tag) =>
      tag.toLowerCase().includes(lowercasedRequiredWord)
    ).length;
    const aDescriptionMatch = a.description
      .toLowerCase()
      .includes(lowercasedRequiredWord)
      ? a.description.length
      : 0;
    const bDescriptionMatch = b.description
      .toLowerCase()
      .includes(lowercasedRequiredWord)
      ? b.description.length
      : 0;
    const aPositionMatch = a.position
      .toLowerCase()
      .includes(lowercasedRequiredWord)
      ? a.position.length
      : 0;
    const bPositionMatch = b.position
      .toLowerCase()
      .includes(lowercasedRequiredWord)
      ? b.position.length
      : 0;

    // Sort based on total relevance score (tag matches, description, and position length)
    return (
      bTagMatches - aTagMatches ||
      bDescriptionMatch - aDescriptionMatch ||
      bPositionMatch - aPositionMatch
    );
  });

  return [...viewerCompany, ...sortedViewerPerson];
};

export const recuiterForViewer = (requiredWord: string) => {
  const lowercasedRequiredWord = requiredWord.toLowerCase();

  const sortedViewerCompany = viewerCompany.sort((a, b) => {
    // Check for matches in JobTitle, JobDescription, and Position
    const aTitleMatch = a.JobTitle.toLowerCase().includes(
      lowercasedRequiredWord
    );
    const bTitleMatch = b.JobTitle.toLowerCase().includes(
      lowercasedRequiredWord
    );
    const aDescriptionMatch = a.JobDescription.toLowerCase().includes(
      lowercasedRequiredWord
    );
    const bDescriptionMatch = b.JobDescription.toLowerCase().includes(
      lowercasedRequiredWord
    );
    const aPositionMatch = a.position
      .toLowerCase()
      .includes(lowercasedRequiredWord);
    const bPositionMatch = b.position
      .toLowerCase()
      .includes(lowercasedRequiredWord);

    // Calculate relevance score based on matches in Title, Description, and Position
    const aRelevanceScore =
      (aTitleMatch ? 2 : 0) +
      (aDescriptionMatch ? 1 : 0) +
      (aPositionMatch ? 1 : 0);
    const bRelevanceScore =
      (bTitleMatch ? 2 : 0) +
      (bDescriptionMatch ? 1 : 0) +
      (bPositionMatch ? 1 : 0);

    // Sort by relevance score (higher comes first), then by length of job title, description, or position match
    return (
      bRelevanceScore - aRelevanceScore ||
      b.JobTitle.length - a.JobTitle.length ||
      b.JobDescription.length - a.JobDescription.length ||
      b.position.length - a.position.length
    );
  });

  return [...sortedViewerCompany, ...viewerPerson];
};
