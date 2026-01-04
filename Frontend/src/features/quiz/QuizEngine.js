/**
 * Pathfinder Quiz 2.0 - Situational Judgment Questions
 * Maps to 4 broad streams: A (Engineering), B (Medical), C (Creative), D (Commerce)
 */

export const quizQuestions = [
  {
    id: 1,
    scenario: "The Broken System",
    question: "You walk into a room and see a fan wobbling dangerously and making a loud noise. What is your immediate instinct?",
    illustration: "🌀",
    options: [
      {
        id: "A",
        text: "I want to climb up, open the motor, and see which screw is loose",
        stream: "ENGINEERING",
        insight: "Ah, a logical thinker!"
      },
      {
        id: "B",
        text: "I worry it might fall on someone and quickly move people out of the way",
        stream: "MEDICAL",
        insight: "Safety first mindset!"
      },
      {
        id: "C",
        text: "I notice how the noise ruins the room's vibe and imagine a silent, sleek fan design instead",
        stream: "CREATIVE",
        insight: "Design-oriented perspective!"
      },
      {
        id: "D",
        text: "I immediately call maintenance and file a complaint to get it fixed",
        stream: "COMMERCE",
        insight: "Process and management!"
      }
    ]
  },
  {
    id: 2,
    scenario: "The Netflix Test",
    question: "You have a free Sunday to binge-watch a documentary series. Which title do you click first?",
    illustration: "📺",
    options: [
      {
        id: "A",
        text: "Mega Structures: How Skyscrapers are Built",
        stream: "ENGINEERING",
        insight: "Curious about systems!"
      },
      {
        id: "B",
        text: "The Human Brain: Mysteries of Memory",
        stream: "MEDICAL",
        insight: "Fascinated by biology!"
      },
      {
        id: "C",
        text: "Abstract: The Art of Design",
        stream: "CREATIVE",
        insight: "Creative inspiration!"
      },
      {
        id: "D",
        text: "Inside Bill Gates' Brain: Business Strategies",
        stream: "COMMERCE",
        insight: "Strategic thinker!"
      }
    ]
  },
  {
    id: 3,
    scenario: "The Group Project",
    question: "Your team has to present a project, but it looks boring. What role do you naturally take to save it?",
    illustration: "👥",
    options: [
      {
        id: "A",
        text: "I build a working model or coded demo to show proof of concept",
        stream: "ENGINEERING",
        insight: "Hands-on builder!"
      },
      {
        id: "B",
        text: "I research real-life case studies of how this affects people's lives",
        stream: "MEDICAL",
        insight: "Empathetic researcher!"
      },
      {
        id: "C",
        text: "I redesign the slides, fonts, and colors to make it visually stunning",
        stream: "CREATIVE",
        insight: "Visual perfectionist!"
      },
      {
        id: "D",
        text: "I write the script and decide who speaks when to make the presentation smooth",
        stream: "COMMERCE",
        insight: "Natural coordinator!"
      }
    ]
  },
  {
    id: 4,
    scenario: "The Crisis",
    question: "A sudden crisis hits your city (e.g., a flood). You want to help. How?",
    illustration: "🌊",
    options: [
      {
        id: "A",
        text: "I use drones to drop supplies or map out safe routes",
        stream: "ENGINEERING",
        insight: "Tech-driven solution!"
      },
      {
        id: "B",
        text: "I volunteer at the medical camp to bandage wounds and comfort victims",
        stream: "MEDICAL",
        insight: "Direct care provider!"
      },
      {
        id: "C",
        text: "I document the event through photos/videos to raise awareness and funds",
        stream: "CREATIVE",
        insight: "Storyteller advocate!"
      },
      {
        id: "D",
        text: "I organize the collection drive, managing money and logistics of food trucks",
        stream: "COMMERCE",
        insight: "Operations manager!"
      }
    ]
  },
  {
    id: 5,
    scenario: "The Toy Store",
    question: "You are buying a gift for a 10-year-old. Which toy do you think is the 'best' gift?",
    illustration: "🎁",
    options: [
      {
        id: "A",
        text: "A high-end Lego Technic set with gears and motors",
        stream: "ENGINEERING",
        insight: "Mechanism lover!"
      },
      {
        id: "B",
        text: "A microscope kit to look at leaf cells",
        stream: "MEDICAL",
        insight: "Science explorer!"
      },
      {
        id: "C",
        text: "A professional sketching and painting set",
        stream: "CREATIVE",
        insight: "Artistic expression!"
      },
      {
        id: "D",
        text: "A Monopoly board game or Stock Market game",
        stream: "COMMERCE",
        insight: "Strategic player!"
      }
    ]
  },
  {
    id: 6,
    scenario: "The Exam Prep",
    question: "You are studying a new chapter. When do you feel you have truly 'understood' it?",
    illustration: "📚",
    options: [
      {
        id: "A",
        text: "When I can solve the hardest numerical problem without looking at the formula",
        stream: "ENGINEERING",
        insight: "Problem solver!"
      },
      {
        id: "B",
        text: "When I can visualize the biological process happening inside a body",
        stream: "MEDICAL",
        insight: "Visual learner!"
      },
      {
        id: "C",
        text: "When I can draw a mind map or diagram connecting all the concepts",
        stream: "CREATIVE",
        insight: "Conceptual thinker!"
      },
      {
        id: "D",
        text: "When I can explain the concept to a friend and convince them it's easy",
        stream: "COMMERCE",
        insight: "Natural teacher!"
      }
    ]
  },
  {
    id: 7,
    scenario: "The Million Dollar",
    question: "An investor gives you $1 Million to start a company. What is it?",
    illustration: "💰",
    options: [
      {
        id: "A",
        text: "A Tech Startup building a new AI or EV battery",
        stream: "ENGINEERING",
        insight: "Innovation driver!"
      },
      {
        id: "B",
        text: "A chain of affordable hospitals or mental health clinics",
        stream: "MEDICAL",
        insight: "Healthcare advocate!"
      },
      {
        id: "C",
        text: "A production house making movies or a fashion label",
        stream: "CREATIVE",
        insight: "Creative entrepreneur!"
      },
      {
        id: "D",
        text: "A FinTech firm or venture capital fund investing in others",
        stream: "COMMERCE",
        insight: "Financial strategist!"
      }
    ]
  },
  {
    id: 8,
    scenario: "The Mistake",
    question: "You make a big mistake in your work. How do you fix it?",
    illustration: "⚠️",
    options: [
      {
        id: "A",
        text: "Debug step-by-step. Isolate the variable. Fix the logic",
        stream: "ENGINEERING",
        insight: "Systematic debugger!"
      },
      {
        id: "B",
        text: "Apologize to the person affected and try to heal the damage caused",
        stream: "MEDICAL",
        insight: "Relationship healer!"
      },
      {
        id: "C",
        text: "Tear it down and start over. The fix will look ugly; I want it perfect",
        stream: "CREATIVE",
        insight: "Quality perfectionist!"
      },
      {
        id: "D",
        text: "Negotiate a compromise or find a workaround to minimize the loss",
        stream: "COMMERCE",
        insight: "Pragmatic negotiator!"
      }
    ]
  },
  {
    id: 9,
    scenario: "The Tool",
    question: "You are sent to a deserted island and can bring only one 'unconventional' tool.",
    illustration: "🏝️",
    options: [
      {
        id: "A",
        text: "A Swiss Army Knife (Utility/Function)",
        stream: "ENGINEERING",
        insight: "Practical utility!"
      },
      {
        id: "B",
        text: "A First Aid Kit (Survival/Biology)",
        stream: "MEDICAL",
        insight: "Survival prepared!"
      },
      {
        id: "C",
        text: "A Journal & Pen (Reflection/Expression)",
        stream: "CREATIVE",
        insight: "Expressive soul!"
      },
      {
        id: "D",
        text: "A Satellite Phone (Communication/Network)",
        stream: "COMMERCE",
        insight: "Network builder!"
      }
    ]
  },
  {
    id: 10,
    scenario: "The Afterlife",
    question: "You retire at age 65. What do you want people to say about you?",
    illustration: "🌟",
    options: [
      {
        id: "A",
        text: "They invented things that made life easier",
        stream: "ENGINEERING",
        insight: "Legacy of innovation!"
      },
      {
        id: "B",
        text: "They saved lives and helped people heal",
        stream: "MEDICAL",
        insight: "Legacy of care!"
      },
      {
        id: "C",
        text: "They created beautiful things that inspired us",
        stream: "CREATIVE",
        insight: "Legacy of beauty!"
      },
      {
        id: "D",
        text: "They built an empire and led thousands of people",
        stream: "COMMERCE",
        insight: "Legacy of leadership!"
      }
    ]
  }
]

/**
 * Initialize stream counts
 */
export const initializeScores = () => {
  return {
    ENGINEERING: 0,
    MEDICAL: 0,
    CREATIVE: 0,
    COMMERCE: 0
  }
}

/**
 * Update stream scores based on answer
 * @param {Object} scores - Current stream counts
 * @param {string} stream - Stream to increment
 * @param {number} weight - Weight multiplier (1 for normal, 2 for gut feeling)
 */
export const updateScores = (scores, stream, weight = 1) => {
  return {
    ...scores,
    [stream]: scores[stream] + weight
  }
}

/**
 * Calculate archetype based on dominant stream
 */
export const calculateResults = (streamCounts) => {
  const total = Object.values(streamCounts).reduce((sum, count) => sum + count, 0)
  const percentages = {}

  Object.keys(streamCounts).forEach(stream => {
    percentages[stream] = (streamCounts[stream] / total) * 100
  })

  const dominant = Object.entries(percentages).sort((a, b) => b[1] - a[1])[0]
  const secondary = Object.entries(percentages).sort((a, b) => b[1] - a[1])[1]

  // Pure archetypes (>60%)
  if (dominant[1] > 60) {
    const archetypes = {
      ENGINEERING: {
        title: "The Architect",
        subtitle: "The Builder of Systems",
        description: "You think in logic, patterns, and structures. You see problems as puzzles to be solved through systematic thinking and technical innovation.",
        careers: ["Software Engineering", "Mechanical Engineering", "Robotics", "Data Science"],
        icon: "🔧"
      },
      MEDICAL: {
        title: "The Healer",
        subtitle: "The Compassionate Caregiver",
        description: "You are driven by empathy and a desire to help others. You understand the human condition and want to make a tangible difference in people's lives.",
        careers: ["Medicine", "Psychology", "Nursing", "Biotechnology"],
        icon: "⚕️"
      },
      CREATIVE: {
        title: "The Creator",
        subtitle: "The Visionary Artist",
        description: "You see the world through an aesthetic lens. Beauty, expression, and originality drive you. You want to create things that inspire and move people.",
        careers: ["Design", "Architecture", "Film Making", "Fine Arts"],
        icon: "🎨"
      },
      COMMERCE: {
        title: "The Leader",
        subtitle: "The Strategic Orchestrator",
        description: "You excel at organizing, managing, and leading. You understand systems, people, and how to bring them together to achieve goals.",
        careers: ["Business Management", "Finance", "Law", "Entrepreneurship"],
        icon: "📊"
      }
    }
    return {
      ...archetypes[dominant[0]],
      streamCounts,
      percentages
    }
  }

  // Mixed archetypes
  const mix = `${dominant[0]}_${secondary[0]}`
  const mixedArchetypes = {
    "ENGINEERING_CREATIVE": {
      title: "The Creative Technologist",
      subtitle: "The Design Engineer",
      description: "You blend technical skills with creative vision. You build things that are not just functional, but beautiful and user-friendly.",
      careers: ["UX/UI Design", "Product Design", "Game Development", "Creative Technology"],
      icon: "💻🎨"
    },
    "ENGINEERING_COMMERCE": {
      title: "The Tech Entrepreneur",
      subtitle: "The Startup Founder",
      description: "You combine technical knowledge with business acumen. You can build products and scale businesses.",
      careers: ["Tech Entrepreneurship", "Product Management", "Consulting", "FinTech"],
      icon: "🚀"
    },
    "ENGINEERING_MEDICAL": {
      title: "The Biotech Innovator",
      subtitle: "The Medical Engineer",
      description: "You merge engineering precision with healthcare impact. You create technology that saves lives.",
      careers: ["Biomedical Engineering", "Medical Devices", "Health Tech", "Prosthetics"],
      icon: "🔬"
    },
    "MEDICAL_COMMERCE": {
      title: "The Healthcare Leader",
      subtitle: "The Medical Administrator",
      description: "You want to improve healthcare through better systems and management, not just direct patient care.",
      careers: ["Healthcare Management", "Pharma Business", "Medical Consulting", "Public Health"],
      icon: "🏥"
    },
    "MEDICAL_CREATIVE": {
      title: "The Medical Communicator",
      subtitle: "The Health Advocate",
      description: "You combine empathy with storytelling to educate and inspire health awareness.",
      careers: ["Medical Illustration", "Health Writing", "Public Health Campaign", "Medical Photography"],
      icon: "🎨⚕️"
    },
    "CREATIVE_COMMERCE": {
      title: "The Creative Director",
      subtitle: "The Brand Strategist",
      description: "You understand both art and business. You can create compelling narratives and turn creativity into profit.",
      careers: ["Marketing", "Advertising", "Brand Management", "Media Production"],
      icon: "📢"
    },
    "CREATIVE_ENGINEERING": {
      title: "The Design Technologist",
      subtitle: "The Creative Coder",
      description: "You bring artistic vision to life through code. You merge aesthetics with functionality.",
      careers: ["Creative Coding", "Interactive Design", "Animation", "Visual Effects"],
      icon: "🎨💻"
    },
    "COMMERCE_ENGINEERING": {
      title: "The Business Technologist",
      subtitle: "The Strategic Builder",
      description: "You see how technology drives business value and can translate between technical and business teams.",
      careers: ["Product Management", "Business Analysis", "Operations", "Tech Consulting"],
      icon: "📊🔧"
    },
    "COMMERCE_MEDICAL": {
      title: "The Health Entrepreneur",
      subtitle: "The Medical Business Leader",
      description: "You see opportunities in healthcare and want to build scalable health solutions.",
      careers: ["Health Startups", "Pharma Sales", "Medical Insurance", "Health Policy"],
      icon: "💊📊"
    },
    "COMMERCE_CREATIVE": {
      title: "The Brand Builder",
      subtitle: "The Marketing Innovator",
      description: "You craft compelling brand stories that drive business growth.",
      careers: ["Brand Strategy", "Content Marketing", "Digital Marketing", "PR"],
      icon: "🎯"
    }
  }

  const pureArchetypes = {
    ENGINEERING: {
      title: "The Architect",
      subtitle: "The Builder of Systems",
      description: "You think in logic, patterns, and structures. You see problems as puzzles to be solved through systematic thinking and technical innovation.",
      careers: ["Software Engineering", "Mechanical Engineering", "Robotics", "Data Science"],
      icon: "🔧"
    },
    MEDICAL: {
      title: "The Healer",
      subtitle: "The Compassionate Caregiver",
      description: "You are driven by empathy and a desire to help others. You understand the human condition and want to make a tangible difference in people's lives.",
      careers: ["Medicine", "Psychology", "Nursing", "Biotechnology"],
      icon: "⚕️"
    },
    CREATIVE: {
      title: "The Creator",
      subtitle: "The Visionary Artist",
      description: "You see the world through an aesthetic lens. Beauty, expression, and originality drive you. You want to create things that inspire and move people.",
      careers: ["Design", "Architecture", "Film Making", "Fine Arts"],
      icon: "🎨"
    },
    COMMERCE: {
      title: "The Leader",
      subtitle: "The Strategic Orchestrator",
      description: "You excel at organizing, managing, and leading. You understand systems, people, and how to bring them together to achieve goals.",
      careers: ["Business Management", "Finance", "Law", "Entrepreneurship"],
      icon: "📊"
    }
  }

  return {
    ...(mixedArchetypes[mix] || pureArchetypes[dominant[0]]),
    streamCounts,
    percentages
  }
}
