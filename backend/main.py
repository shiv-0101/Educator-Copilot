from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import random
import google.generativeai as genai
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure Google Generative AI
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
model = genai.GenerativeModel('gemini-2.5-flash')

app = FastAPI(title="Educator Copiolet Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/lesson-plan")
def generate_lesson_plan(topic: str):
    prompt = f"""Create a concise, well-structured lesson plan for the topic: '{topic}'

IMPORTANT: Keep the content focused and digestible - aim for medium-length content that can be absorbed in one sitting.

Structure your response using clear markdown formatting:

## Lesson Plan: {topic}

### 🎯 Learning Objectives
- List 3-4 specific, measurable learning outcomes
- Keep them clear and achievable

### 📚 Materials Needed
- List only essential materials (5-7 items max)
- Include both physical and digital resources

### ⏱️ Time Allocation
- Provide a realistic time estimate (typically 45-60 minutes)
- Break down into activity segments

### 📖 Lesson Activities

#### Introduction (5-10 min)
- Brief engaging hook or warm-up activity
- Connect to prior knowledge

#### Main Content (20-30 min)
- 2-3 core teaching activities
- Include interactive elements
- Keep explanations concise and clear

#### Practice & Application (10-15 min)
- Hands-on activity or guided practice
- Real-world application example

#### Conclusion (5 min)
- Quick recap of key points
- Preview of next lesson

### ✅ Assessment Methods
- 2-3 practical ways to check understanding
- Include both formative and summative options

### 💡 Key Takeaways
- Summarize in 3-4 bullet points
- Focus on essential concepts

Use simple, clear language. Make it actionable and practical for educators."""
    
    response = model.generate_content(prompt)
    lesson_plan = response.text.strip()
    return {"lesson_plan": lesson_plan}

@app.get("/quiz")
def generate_quiz(topic: str):
    prompt = f"""Generate exactly 5 multiple-choice quiz questions about '{topic}'.

REQUIREMENTS:
1. Questions should test understanding at different levels (recall, comprehension, application)
2. Keep questions clear and concise
3. Make sure all options are plausible
4. Vary the correct answer position (don't always make it A or B)
5. Include brief explanations for answers

Format as a JSON array with this EXACT structure:
[
  {{
    "question": "Clear, focused question here?",
    "options": ["A) First option", "B) Second option", "C) Third option", "D) Fourth option"],
    "answer": "B",
    "explanation": "Brief 1-2 sentence explanation of why this is correct"
  }}
]

Example for topic "Photosynthesis":
[
  {{
    "question": "What is the primary function of chlorophyll in photosynthesis?",
    "options": ["A) Store water", "B) Absorb light energy", "C) Release oxygen", "D) Produce glucose"],
    "answer": "B",
    "explanation": "Chlorophyll absorbs light energy from the sun, which is essential for converting carbon dioxide and water into glucose."
  }}
]

Generate 5 questions following this format. Return ONLY the JSON array, no additional text."""
    
    response = model.generate_content(prompt)
    quiz_text = response.text.strip()
    
    # Clean up the response - remove markdown code blocks if present
    if quiz_text.startswith('```'):
        quiz_text = quiz_text.split('```')[1]
        if quiz_text.startswith('json'):
            quiz_text = quiz_text[4:]
        quiz_text = quiz_text.strip()
    
    import json
    try:
        quiz = json.loads(quiz_text)
    except Exception as e:
        # Fallback questions if parsing fails
        quiz = [
            {
                "question": f"What is a key concept related to {topic}?",
                "options": ["A) Option 1", "B) Option 2", "C) Option 3", "D) Option 4"],
                "answer": "A",
                "explanation": "This is a sample question. Please try again for actual content."
            }
        ]
    return {"quiz": quiz}

@app.get("/assignment")
def generate_assignment(topic: str):
    prompt = f"""Create an engaging, practical assignment for the topic: '{topic}'

IMPORTANT: Make it manageable and achievable - students should be able to complete it in 30-45 minutes.

Structure using markdown:

## Assignment: {topic}

### 🎯 Learning Objectives
- State 2-3 specific skills or knowledge students will demonstrate
- Be clear about what success looks like

### 📋 Assignment Overview
- Provide a brief, engaging description (2-3 sentences)
- Explain the real-world relevance

### ✏️ Instructions

**Part 1: [Descriptive Name]** (10-15 min)
- Clear, numbered steps
- 3-4 specific tasks
- Include examples where helpful

**Part 2: [Descriptive Name]** (15-20 min)
- Clear, numbered steps
- 3-4 specific tasks
- Encourage critical thinking or creativity

**Part 3: Reflection** (5-10 min)
- 2-3 thought-provoking questions
- Connect learning to personal experience or broader concepts

### 📊 Evaluation Criteria

Create a simple rubric with 3-4 criteria:
- **[Criterion 1]**: What to look for (weight: X%)
- **[Criterion 2]**: What to look for (weight: X%)
- **[Criterion 3]**: What to look for (weight: X%)

### 💡 Helpful Tips
- Provide 2-3 practical tips for success
- Mention common pitfalls to avoid

### 🚀 Extension (Optional)
- Suggest 1-2 ways students can go beyond the basics
- For advanced learners or extra credit

Keep language simple, instructions clear, and make it engaging!"""
    
    response = model.generate_content(prompt)
    assignment = response.text.strip()
    return {"assignment": assignment}

@app.post("/summarize")
def summarize_understanding(data: dict):
    topic = data.get('topic', 'topic')
    prompt = f"""Create a concise summary of student understanding for the topic: '{topic}'

Provide a focused, actionable assessment using markdown:

## Understanding Summary: {topic}

### 📊 Overall Comprehension Level
- Provide a brief assessment (2-3 sentences)
- Rate as: Excellent, Good, Developing, or Needs Support

### ✅ Strengths Observed
- List 3-4 specific areas where students showed understanding
- Include examples of successful learning behaviors

### 🎯 Areas for Improvement
- Identify 2-3 concepts that need reinforcement
- Be specific about gaps or misconceptions

### 💡 Recommended Next Steps

**Immediate Actions:**
1. [Specific intervention or activity]
2. [Specific intervention or activity]

**Ongoing Support:**
- Suggest 2-3 strategies for continued learning
- Include differentiation ideas if needed

### 📝 Key Concepts to Reinforce
- List 3-5 essential takeaways students should master
- Prioritize by importance

Keep it concise, actionable, and focused on student growth."""
    
    response = model.generate_content(prompt)
    summary = response.text.strip()
    return {"summary": summary}

@app.post("/integrate-lms")
def integrate_lms(data: dict):
    # Mock LMS integration
    return {"status": "Integrated successfully", "data": data}

@app.post("/question-answering")
def question_answering(data: dict):
    context = data.get('context', '')
    question = data.get('question', '')
    prompt = f"""You are an expert educator providing clear, concise answers to help students learn effectively.

**Context:**
{context}

**Student Question:**
{question}

**Instructions:**
1. Provide a direct, focused answer (2-4 paragraphs maximum)
2. Use simple, clear language appropriate for learners
3. If relevant, include:
   - A brief explanation of key concepts
   - A practical example or analogy
   - Connection to real-world applications
4. Format your response with markdown for readability
5. Keep it concise but complete - aim for quality over quantity

**Your Answer:**"""
    
    response = model.generate_content(prompt)
    answer = response.text.strip()
    return {"answer": answer}
