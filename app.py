import uvicorn
import logging
from fastapi import FastAPI, HTTPException, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from langchain.chains import GraphCypherQAChain
from langchain_community.chat_models import ChatOpenAI
from langchain.graphs import Neo4jGraph

# Initialize FastAPI app
logging.basicConfig(
    level=logging.DEBUG, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)

asgi_app = FastAPI()
asgi_app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

routers = APIRouter()

# Define a Pydantic model for the request body
class QuestionPayload(BaseModel):
    question: str

@routers.get("/ping")
async def ping():
    """
    Test router
    """
    try:
        return {"message": "pong"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

NEO4J_URI = 'neo4j+ssc://8e650769.databases.neo4j.io:7687'
NEO4J_USERNAME = 'neo4j'
NEO4J_PASSWORD = 'cLtGV_rgS78sVyURuUHq21JTNRs5T-TRKTy-dERp0Gc'
OPENAI_API_KEY = 'REPLACEWITHAPI'

openai_model = ChatOpenAI(model="gpt-4o", api_key=OPENAI_API_KEY)
graph = Neo4jGraph(url=NEO4J_URI, username=NEO4J_USERNAME, password=NEO4J_PASSWORD)

chain = GraphCypherQAChain.from_llm(graph=graph, llm=openai_model, allow_dangerous_requests=True)

@routers.post("/query")
async def query_graph(payload: QuestionPayload):
    """
    Endpoint to accept a question and return results from the Neo4j graph.
    """
    try:
        question = payload.question
        output = chain.invoke(question)['result']
     
        # Return the answer in a JSON format
        return {"answer": output}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing request: {str(e)}")

asgi_app.include_router(routers)

# Run the FastAPI app with Uvicorn
# uvicorn src.app:asgi_app --host 0.0.0.0 --port 8080 --reload --log-level info
if __name__ == "__main__":
    uvicorn.run(asgi_app, port=8080, host="0.0.0.0")