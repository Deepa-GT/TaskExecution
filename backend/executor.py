from openai import OpenAI
from groq import Groq
import os
from dotenv import load_dotenv
from planner import get_client_info

def execute_tasks(plan):
    if not plan.strip():
        raise ValueError("Plan description cannot be empty.")
    
    client, provider = get_client_info()
    
    # Mock Mode
    if provider == "mock":
        first_step = plan.split("\n")[0] if "\n" in plan else plan
        summary = first_step.replace("1. ", "").strip()
        
        return (
            f"Execution Summary:\n"
            f"- Successfully initiated {summary}\n"
            f"- All dependent steps in the plan have been processed.\n"
            f"- Final verification for {plan.split()[-1]} passed."
        )
    
    prompt = f"""
    Execute the following workflow plan
    and produce results:

    {plan}
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
        raise RuntimeError(f"{provider.capitalize()} API error in executor: {str(e)}")