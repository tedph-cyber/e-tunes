from fastapi import APIRouter

from app.theory.curriculum import CURRICULUM

router = APIRouter(prefix="/api", tags=["curriculum"])


@router.get("/curriculum")
async def get_curriculum():
    return {
        "tiers": [
            {
                "id": t.id,
                "name": t.name,
                "description": t.description,
                "topics": [
                    {
                        "id": topic.id,
                        "name": topic.name,
                        "scale_ids": topic.scale_ids,
                        "interval_ids": topic.interval_ids,
                    }
                    for topic in t.topics
                ],
                "unlock_requirement": t.unlock_requirement,
            }
            for t in CURRICULUM
        ]
    }


@router.get("/curriculum/progress")
async def get_progress(session_id: str = "default"):
    return {
        "session_id": session_id,
        "completed": 0,
        "accuracy": 0.0,
        "current_tier": 1,
        "next_topic": "Foundations - Major & Minor",
    }
