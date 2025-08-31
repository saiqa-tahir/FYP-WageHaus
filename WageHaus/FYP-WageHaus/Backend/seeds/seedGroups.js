// seedGroups.js
const mongoose = require('mongoose');
const Group = require('../models/Group'); // Correct path

const groups = [
  {
    name: "Python Developers",
    description: "A community for Python enthusiasts to share knowledge, projects, and job opportunities for professionals.",
    tags: ["python", "programming", "web development"],
    membersLimit: 150,
  },
  {
    name: "Data Science Enthusiasts",
    description: "Learn and discuss data science, machine learning, and AI with like-minded professionals.",
    tags: ["data science", "machine learning", "AI"],
    membersLimit: 150,
  },
  {
    name: "Web Developers",
    description: "A group for web developers to discuss frontend, backend, and full-stack development.",
    tags: ["web development", "javascript", "react"],
    membersLimit: 150,
  },
  {
    name: "Mobile App Developers",
    description: "Connect with mobile app developers and share insights on iOS, Android, and cross-platform development.",
    tags: ["mobile development", "iOS", "Android"],
    membersLimit: 150,
  },
  {
    name: "Cloud Computing Experts",
    description: "Discuss cloud platforms like AWS, Azure, and Google Cloud with experts.",
    tags: ["cloud computing", "AWS", "Azure"],
    membersLimit: 150,
  },
  {
    name: "UI/UX Designers",
    description: "A community for designers to share tips, tools, and best practices for UI/UX design.",
    tags: ["UI/UX", "design", "figma"],
    membersLimit: 150,
  },
  {
    name: "DevOps Engineers",
    description: "Learn and share DevOps tools, practices, and CI/CD pipelines.",
    tags: ["devops", "CI/CD", "docker"],
    membersLimit: 150,
  },
  {
    name: "Cybersecurity Professionals",
    description: "Discuss cybersecurity trends, tools, and best practices to secure systems.",
    tags: ["cybersecurity", "ethical hacking", "network security"],
    membersLimit: 150,
  },
  {
    name: "Blockchain Developers",
    description: "A group for blockchain enthusiasts to discuss cryptocurrencies, smart contracts, and DApps.",
    tags: ["blockchain", "cryptocurrency", "smart contracts"],
    membersLimit: 150,
  },
  {
    name: "AI and Machine Learning",
    description: "Explore AI and ML algorithms, models, and applications with experts.",
    tags: ["AI", "machine learning", "deep learning"],
    membersLimit: 150,
  },
  {
    name: "Software Testers",
    description: "Share testing strategies, tools, and automation techniques for software quality assurance.",
    tags: ["software testing", "QA", "automation"],
    membersLimit: 150,
  },
  {
    name: "Product Managers",
    description: "A community for product managers to discuss product development, strategy, and roadmaps.",
    tags: ["product management", "agile", "scrum"],
    membersLimit: 150,
  },
  {
    name: "Digital Marketing Experts",
    description: "Learn and share digital marketing strategies, SEO, and social media tips.",
    tags: ["digital marketing", "SEO", "social media"],
    membersLimit: 150,
  },
  {
    name: "Freelancers and Remote Workers",
    description: "Connect with freelancers and remote workers to share opportunities and tips.",
    tags: ["freelancing", "remote work", "gig economy"],
    membersLimit: 150,
  },
  {
    name: "Career Guidance and Mentorship",
    description: "Get career advice, mentorship, and guidance from experienced professionals.",
    tags: ["career guidance", "mentorship", "job search"],
    membersLimit: 150,
  },
];

const seedGroups = async () => {
  try {
    await mongoose.connect('mongodb+srv://samanzlfqr1:mm45l6dvJpyqpvzs@fypcluster.9oobf.mongodb.net/WageHausDB?retryWrites=true&w=majority', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await Group.deleteMany(); 
    await Group.insertMany(groups); 
    console.log('Groups seeded successfully!');
  } catch (error) {
    console.error('Error seeding groups:', error);
  } finally {
    mongoose.connection.close();
  }
};

seedGroups();