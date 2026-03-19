import pandas as pd
import numpy as np 

from fastapi import FastAPI
from pydantic import BaseModel, Field, field_validator
from fastapi.middleware.cors import CORSMiddleware 
import uvicorn

import pickle


app = FastAPI()

with open('model/model.pkl', 'rb') as f:
    model = pickle.load(f)

df_ctgan_gym = pd.read_csv(r"D:/python/pyProj/recomendExercises_gym/.csv/juputer_notebook/.csv/ctgan_gym.xls")
df_program_detail = pd.read_csv("D:\python\pyProj/recomendExercises_gym/.csv/data_users_programs/workout_programs.csv")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5500", "http://localhost:5500"],
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
        'mass': 1,
        'weight_loss': 2,
        'toning': 3,
        'strength':4
    }
    return goal_map.get(goal_str.lower(), 1)

class UserData(BaseModel):
    name: str
    age: int
    gender: str
    experience: str
    goal: str
    days_per_week: int

@app.post("/recommend"
          ,summary='Text sentiment prediction',
          description = 'Takes a data and returns the recommend of a gym exercises',
          response_description= 'recommend gym exercises')
async def recommend(data: UserData):
    gender_num = 1 if data.gender.lower() == 'male' else 0
    experience_num = map_experience(data.experience)
    goal = map_goal(data.goal)
    
    df_ctgan_gym['user_id'] = df_ctgan_gym.groupby(['age', 'gender', 'experience_numeric', 'days_per_week', 'goal']).ngroup()
    similar_users = df_ctgan_gym[
        (abs(df_ctgan_gym['age'] - data.age) <= 5) &
        (df_ctgan_gym['gender'] == gender_num) &
        (abs(df_ctgan_gym['experience_numeric'] - experience_num) <= 1) &
        (abs(df_ctgan_gym['days_per_week'] - data.days_per_week) <= 1) &
        (abs(df_ctgan_gym['goal'] - goal) <= 1)
    ]['user_id'].unique()

    if len(similar_users) > 0:
        user_id = int(similar_users[0])
        source = 'similar'
    else:
        popular = df_ctgan_gym.groupby('program_name')['rating'].mean().sort_values(ascending=False).head(3)
        recommendations = []
        for prog, rating in popular.items():
            recommendations.append({
                "program": str(prog),     
                "rating": float(rating),   
                "source": "popular"
            })
        return recommendations

    valid_programs = [int(id_program) for id_program in df_ctgan_gym['program_name'].unique() if 1 <= id_program <= 9]

    user_rated = df_ctgan_gym[df_ctgan_gym['user_id'] == user_id]['program_name'].unique()

    predictions = [(p, float(model.predict(user_id, p).est)) 
               for p in valid_programs if p not in user_rated]

    predictions.sort(key=lambda x: x[1], reverse=True)
                   
    recommendations = []
    data_by_program = {}
    for p, r in predictions[:3]:
        recommendations.append({
            "program": int(p),             
            "predicted_rating": float(r),    
            "source": str(source)            
        })
        program_exercises = df_program_detail[df_program_detail["program_id"] == int(p)]
        data_by_program[int(p)] = program_exercises.to_dict('records')

    return [recommendations, data_by_program]
    

if __name__ == "__main__":
    uvicorn.run("api:app", host="127.0.0.1", port=8000, reload=True)