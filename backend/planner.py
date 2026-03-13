from openai import OpenAI
from groq import Groq
import os
from dotenv import load_dotenv

def get_client_info():
    env_path = os.path.join(os.path.dirname(__file__), '.env')
    load_dotenv(dotenv_path=env_path, override=True)
    groq_key = os.getenv("GROQ_API_KEY")
    # Try Groq first (better free tier)
    if groq_key and not groq_key.startswith("YOUR_"):
        return Groq(api_key=groq_key), "groq"
    
    # Try OpenAI second
    openai_key = os.getenv("OPENAI_API_KEY")
    if openai_key and not openai_key.startswith("YOUR_"):
        return OpenAI(api_key=openai_key), "openai"
    
    # Return None for Mock Mode
    return None, "mock"

def plan_task(task):
    if not task.strip():
        raise ValueError("Task description cannot be empty.")
    
    client, provider = get_client_info()
    
    # Mock Mode
    if provider == "mock":
        import random
        keywords = [w for w in task.split() if len(w) > 3]
        topic = keywords[0] if keywords else "this task"
        
        verbs = ["Research", "Analyze", "Design", "Configure", "Develop", "Test"]
        steps = [f"1. Define objectives for {topic}"]
        
        num_steps = random.randint(3, 5)
        for i in range(2, num_steps):
            verb = random.choice(verbs)
            steps.append(f"{i}. {verb} {topic} based on requirements")
            
        steps.append(f"{num_steps}. Review and finalize {topic} workflow")
        
        return "\n".join(steps)
    
    prompt = f"""
    Break the following request into workflow steps:

    {task}

    Return a numbered list.
    """

    try:
        if provider == "groq":
            response = client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[{"role": "user", "content": prompt}]
            )
        else:
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[{"role": "user", "content": prompt}]
            )
        return response.choices[0].message.content
    except Exception as e:
        raise RuntimeError(f"{provider.capitalize()} API error in planner: {str(e)}")