from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import os

# Get the absolute path to the .env file in the same directory as this file
env_path = os.path.join(os.path.dirname(__file__), '.env')
load_dotenv(dotenv_path=env_path, override=True)

from planner import plan_task, get_client_info
from executor import execute_tasks

app = FastAPI()

@app.get("/health")
def health_check():
    return {"status": "healthy"}

app = FastAPI()

# Configure CORS for production and local development
allowed_origins = [
    "http://localhost:3000",
    "https://task-execution.onrender.com", # Update this after Render provides your frontend URL
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For production, you should ideally specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Request(BaseModel):
    task: str


@app.post("/run-workflow")
def run_workflow(req: Request):
    try:
        # 1. Plan
        plan = plan_task(req.task)
        
        # 2. Execute
        result = execute_tasks(plan)
        
        # Determine the provider by checking what plan_task would use
        _, provider_name = get_client_info()
        is_mock = provider_name == "mock"
        
        return {
            "status": "success",
            "message": f"Workflow completed ({provider_name.capitalize()} Mode)",
            "task": req.task,
            "plan": plan,
            "result": result,
            "mock": is_mock,
            "provider": provider_name.capitalize()
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))