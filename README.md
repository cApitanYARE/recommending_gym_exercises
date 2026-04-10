# Recommending Gym Exercises

##### The dataset for the model was almost entirely generated artificially using ChatGPT and DeepSeek. The only exception is the file jupyter_notebook/ctgan_gym.xls, which was generated using CTGAN.

The project consists of the following parts:
1. **Model**
2. **Backend**
3. **Frontend**
4. **Deploy**

## 1. Model
&nbsp;&nbsp;&nbsp;&nbsp;The file located at `notebooks/rctgan_data_generation.ipynb` contains the prepared data used to train the model. In this notebook, you can find a detailed description of loading and combining DataFrames, filling missing values, encoding the dataset, and generating new data with CTGAN.  
&nbsp;&nbsp;&nbsp;&nbsp;The file at notebooks/recommend_model.ipynb explains how to create a recommendation model using the `Surprise` library.

The .pkl file is located in `back/model/model.pkl`.

## 2. Backend
&nbsp;&nbsp;&nbsp;&nbsp;The backend uses the following libraries: `FastAPI`, `Pydantic`, and `Uvicorn`. The backend code is located in `back/api.py`.  
&nbsp;&nbsp;&nbsp;&nbsp;The first step in `api.py` is to load the model file and the necessary `.csv` files for recommendations. After that, the script calls a function that converts two variables from type str to numeric.  
&nbsp;&nbsp;&nbsp;&nbsp;Next, the FastAPI endpoint receives input data and searches for similar records to provide recommendations. If no similar data is found, it simply recommends the most popular programs.

## 3. Frontend
#### The starting page allows the user to enter data. Here is how it looks:   
![img/blang.png](https://github.com/cApitanYARE/recommending_gym_exercises/blob/2aea0d693d31d64e79385755cadef7d4b643faca/img/blank.png)
#### Each field must be filled; leaving it blank is not allowed. 
![img/fill blank.png](https://github.com/cApitanYARE/recommending_gym_exercises/blob/2aea0d693d31d64e79385755cadef7d4b643faca/img/fill_blank.png)
#### Added a new field for training location: gym, home, street.
![img/options_location.png](https://github.com/cApitanYARE/recommending_gym_exercises/blob/2aea0d693d31d64e79385755cadef7d4b643faca/img/options_location.png)
#### After all fields are filled and the "Confirm" button is pressed, you will see this page:  
![img/result.png](https://github.com/cApitanYARE/recommending_gym_exercises/blob/a81db3fb48f629cb5e9615c089a80b9978adae9c/img/result.png)
#### For more information about each program, you can click the "More Info" button. After that, you will see a page like this:  
![img/prog1.png](https://github.com/cApitanYARE/recommending_gym_exercises/blob/a81db3fb48f629cb5e9615c089a80b9978adae9c/img/prog1.png)
![img/prog2.png](https://github.com/cApitanYARE/recommending_gym_exercises/blob/a81db3fb48f629cb5e9615c089a80b9978adae9c/img/prog2.png)
![img/prog3.png](https://github.com/cApitanYARE/recommending_gym_exercises/blob/a81db3fb48f629cb5e9615c089a80b9978adae9c/img/prog3.png)

#### If you want to save the program, you can click the "Download PDF" button, and you will see the following.  
![img/prog_download.png](https://github.com/cApitanYARE/recommending_gym_exercises/blob/a81db3fb48f629cb5e9615c089a80b9978adae9c/img/prog_download.png)
### This will allow you to save the program.

## 4. Deploy
For deploying the project, I used a free instance on Render with a 512 MB memory limit.

Frontend: https://recommending-gym-exercises.onrender.com
API (Backend): https://recommending-gym-exercises-api.onrender.com
