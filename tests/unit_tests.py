import pytest
from unittest.mock import MagicMock ,patch
import pandas as pd

fake_model = MagicMock()
fake_model.predict.return_value = 4.5

from back.api import recommend, UserData


def test_map_experience():
    from back.api import map_experience

    assert map_experience("beginner") == 1
    assert map_experience("intermediate") == 2
    assert map_experience("advanced") == 3
    assert map_experience("unknown") == 1  

def test_map_goal():
    from back.api import map_goal

    assert map_goal("mass") == 1
    assert map_goal("weight_loss") == 2
    assert map_goal("toning") == 3
    assert map_goal("strength") == 4
    assert map_goal("random") == 1  # default

@pytest.mark.asyncio
async def test_recommend_logic_no_similar_users():

    fake_df = pd.DataFrame({
        "age": [50, 50, 50],
        "gender": [1, 1, 1],
        "experience_numeric": [3, 3, 3],
        "days_per_week": [6, 6, 6],
        "goal": [4, 4, 4],
        "program_name": [1, 2, 3],
        "rating": [5, 4, 3]
    })

    with patch("back.api.df_ctgan_gym", fake_df):
        data = UserData(
            name="Michael",
            age=22,
            gender="male",
            experience="beginner",
            goal="mass",
            days_per_week=3
        )

        result = await recommend(data)

        assert isinstance(result, list)
        assert not (len(result) == 2 and isinstance(result[1], dict))
        assert result[0]["source"] == "popular"
        assert "rating" in result[0]  

@pytest.mark.asyncio
async def test_model_used_in_recommend():
    from types import SimpleNamespace

    fake_df = pd.DataFrame({
        "age": [22, 23],
        "gender": [1, 1],
        "experience_numeric": [1, 1],
        "days_per_week": [3, 3],
        "goal": [1, 1],
        "program_name": [1, 2],
        "rating": [5, 4]
    })

    fake_model = MagicMock()
    fake_model.predict.return_value = SimpleNamespace(est=4.5)

    with patch("back.api.model", fake_model):
        with patch("back.api.df_ctgan_gym", fake_df):

            data = UserData(
                name="Michael",
                age=22,
                gender="male",
                experience="beginner",
                goal="mass",
                days_per_week=3
            )

            result = await recommend(data)
            assert fake_model.predict.called

            assert isinstance(result, list)
            assert len(result) == 2

            recommendations = result[0]
            assert recommendations[0]["source"] == "similar"
            assert "predicted_rating" in recommendations[0] 
            assert recommendations[0]["predicted_rating"] == 4.5