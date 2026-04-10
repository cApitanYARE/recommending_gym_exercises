import pytest
from fastapi.testclient import TestClient
from back.api import app

client = TestClient(app)

def test_recommend_endpoint():
    response = client.post("/recommend", json={
        "name": "Michael",
        "age": 22,
        "gender": "male",
        "experience": "beginner",
        "goal": "mass",
        "days_per_week": 3,
        "location" : "gym"
    })

    assert response.status_code == 200

    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0

def test_invalid_data_types():  
    base_data = {
        "name": "Michael",
        "age": 22,
        "gender": "male",
        "experience": "beginner",
        "goal": "mass",
        "days_per_week": 3,
        "location" : "gym"
    }
    
    invalid_cases = [
        ("name", 123, "name as integer"),
        ("age", "bad", "age as string"),
        ("gender", 123, "gender as integer"),
        ("experience", 123, "experience as integer"),
        ("goal", 123, "goal as integer"),
        ("days_per_week", "three", "days_per_week as string"),
        ("location", 123, "location as integer")
    ]
    
    for field, invalid_value, description in invalid_cases:
        test_data = base_data.copy()  
        test_data[field] = invalid_value 
        
        response = client.post("/recommend", json=test_data)
        
        assert response.status_code == 422, \
            f"Field '{field}' with value '{invalid_value}' ({description}) should return 422"
