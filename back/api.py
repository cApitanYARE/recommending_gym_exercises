import pandas as pd
import numpy as np 

from fastapi import FastAPI
from pydantic import BaseModel, Field, field_validator
from fastapi.middleware.cors import CORSMiddleware 
import uvicorn

import pickle
import os

app = FastAPI()

MODEL_PATH = os.path.join(os.path.dirname(__file__), "model/model.pkl") 
with open(MODEL_PATH, "rb") as f:
    model = pickle.load(f)

df_ctgan_gym = pd.read_csv("csv/jupyter_notebook/ctgan_gym.xls")
df_program_detail = pd.read_csv("csv/data_users_programs/workouts.csv")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/", summary= "API test",description='Simple check that the API works as expected')
def root():
    return {"message": "model API running"}


def map_experience(exp_str: str) -> int:
    experience_map = {
        'beginner': 1,
        'intermediate': 2,
        'advanced': 3,
    }
    return experience_map.get(exp_str.lower(), 1)

def map_goal(goal_str) -> int:
    goal_map = {
        'mass': 0,
        'toning': 1,
        'strength': 2,
        'weight_loss':3
    }
    return goal_map.get(goal_str.lower(), 1)

def map_location(loc_str: str) -> int:
    location_map = {
        'gym' : 0,
        'home' : 1,
        'street' : 2,
    }
    return location_map.get(loc_str.lower(), 0)

class UserData(BaseModel):
    name: str
    age: int
    gender: str
    experience: str
    goal: str
    days_per_week: int
    location: str

@app.post("/recommend")
async def recommend(data: UserData):
    gender_num = 1 if data.gender.lower() == 'male' else 0
    experience_num = map_experience(data.experience)
    goal = map_goal(data.goal)
    location = data.location.lower()

    temp_user_df = pd.DataFrame([{
        'age': data.age,
        'gender': gender_num,
        'experience_numeric': experience_num,
        'days_per_week': data.days_per_week,
        'goal': goal, 
        'location': location
    }])
    
    temp_user_df['user_id'] = temp_user_df.groupby(
        ['age', 'gender', 'experience_numeric', 'days_per_week', 'goal', 'location']
    ).ngroup()
    
    user_id = int(temp_user_df['user_id'].iloc[0])
    
    print(f"Generated user_id: {user_id}")  
    print(f"User data: age={data.age}, gender={gender_num}, experience={experience_num}, days={data.days_per_week}, goal={goal}, location={location}")
    
    available_programs = df_program_detail[
        (df_program_detail['location'] == location) &
        (df_program_detail['gender'] == data.gender.lower())
    ]['program_id'].unique()
    
    print(f"Available programs: {available_programs}")  
    
    if len(available_programs) == 0:
        print(f"No programs found for location={location}, gender={data.gender.lower()}")
        return [[], {}]
    
    predictions = []
    for program_id in available_programs:
        try:
            pred = float(model.predict(user_id, int(program_id)).est)
            predictions.append((int(program_id), pred))
            print(f"Program {program_id}: predicted rating = {pred}")
        except Exception as e:
            print(f"Error predicting program {program_id}: {e}")
            predictions.append((int(program_id), 3.5))
    
    predictions.sort(key=lambda x: x[1], reverse=True)
    
    recommendations = []
    data_by_program = {}
    
    for program_id, rating in predictions[:3]:
        recommendations.append({
            "program_num": program_id,
            "predicted_rating": rating,
            "location": location,
            "gender": data.gender.lower()
        })
        
        program_exercises = df_program_detail[
            (df_program_detail["program_id"] == program_id) &
            (df_program_detail["location"] == location) &
            (df_program_detail["gender"] == data.gender.lower())
        ].to_dict('records')
        
        data_by_program[str(program_id)] = program_exercises
    
    print(f"Recommendations: {recommendations}") 
    
    return [recommendations, data_by_program]

#if __name__ == "__main__":
#    uvicorn.run("api:app", host="127.0.0.1", port=8000, reload=True)