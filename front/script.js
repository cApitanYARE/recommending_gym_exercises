async function recommend(name,age,gender,experience,goal,days_per_week) {
    const userData = {
        name: name,
        age: age,
        gender: gender,
        experience: experience,
        goal: goal,
        days_per_week: days_per_week
    };

    const response = await fetch('http://localhost:8000/recommend', {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(userData)
    })

    const data = await response.json();

    const programs = data[0]; 
    const exercisesData = data[1];

    console.log(data[0],data[1])

    const resultsContainer = document.createElement('div');
    resultsContainer.id = 'results-container';
    resultsContainer.style.maxWidth = '1200px';
    resultsContainer.style.margin = '0 auto';
    resultsContainer.style.padding = '20px';
    resultsContainer.style.fontFamily = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif";

    const title = document.createElement('h1');
    title.textContent = 'Recomended programs';
    title.style.textAlign = 'center';
    title.style.marginBottom = '30px';
    title.style.color = 'white';
    resultsContainer.appendChild(title);

    const cardsContainer = document.createElement('div');
    cardsContainer.style.display = 'flex';
    cardsContainer.style.flexWrap = 'wrap';
    cardsContainer.style.gap = '20px';
    cardsContainer.style.justifyContent = 'center';

    for (let i = 0; i < programs.length; ++i) {
        const program = programs[i];
        const card = createCard(program, exercisesData[program.program]);
        cardsContainer.appendChild(card);
    }

    const button_back_to_form = document.createElement('button');
    button_back_to_form.textContent = 'Back to Form';
    button_back_to_form.onclick = function() {
            document.getElementById('form').style.display = 'block';
            
            const results = document.getElementById('results-container');
            if (results) {
                document.body.removeChild(results);
            }
            
            document.getElementById('name').value = '';
            document.getElementById('age').value = '';
            document.getElementById('gender').value = '';
            document.getElementById('experience').value = '';
            document.getElementById('goal').value = '';
            document.getElementById('days_per_week').value = '';
   
        }

    resultsContainer.appendChild(cardsContainer);
    resultsContainer.appendChild(button_back_to_form);
    document.body.appendChild(resultsContainer);

}

function createCard(program, exercisesData) {
        const card = document.createElement('div')
        card.style.display = 'flex';
        card.style.flexDirection = 'column'; 
        card.style.alignItems = 'flex-start'; 
        card.style.justifyContent = 'flex-start';
        card.style.backgroundColor = '#162447'
        card.style.maxWidth = '350px';
        card.style.borderRadius = '8px'; 
        card.style.overflow = 'hidden'; 

        const programNumLine = document.createElement('span');
        programNumLine.style.padding = '10px';
        programNumLine.style.fontSize = '25px';
        programNumLine.style.fontFamily = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif";
        const programNameLine = exercisesData[0].program_name;
        programNumLine.textContent = "Program #" + program.program +" "+ programNameLine;
        
        const ratingLine = document.createElement('div');
        ratingLine.style.fontSize = '15px';
        ratingLine.style.padding = '10px';
        ratingLine.style.fontWeight = 'bold';
        ratingLine.style.color = '#FFA500';
        ratingLine.textContent = `Rate: ★ ${program.predicted_rating.toFixed(1)} / 5.0`;

        card.appendChild(programNumLine);
        card.appendChild(ratingLine);

        const short_info = document.createElement('div')
        short_info.style.padding = '20px';
        short_info.style.width = '100%';
        short_info.style.boxSizing = 'border-box';

        const muscleGroups = new Set();
        const days = new Set();

        for (let i = 0; i < exercisesData.length; i++) {
            muscleGroups.add(exercisesData[i].muscle_group);
            days.add(exercisesData[i].day);
        }

        const daysInfo = document.createElement('p');
        daysInfo.style.margin = '5px 0';
        daysInfo.style.color = '#E5E5E5';
        daysInfo.innerHTML = `<strong>Days:</strong> ${days.size}`;

        const musclesInfo = document.createElement('p');
        musclesInfo.style.margin = '5px 0';
        musclesInfo.style.color = '#E5E5E5';
        musclesInfo.innerHTML = `<strong>Group of muscle:</strong> ${Array.from(muscleGroups).join(', ')}`;
        
        short_info.appendChild(daysInfo)
        short_info.appendChild(musclesInfo)

        card.appendChild(short_info)
        
        const buttons = document.createElement('div');
        buttons.style.display = 'flex';
        buttons.style.flexDirection = 'row'; 
        buttons.style.alignItems = 'space-between';
        buttons.style.marginTop = 'auto';
        buttons.style.width = '100%';
        buttons.style.padding = '10px';
        buttons.style.boxSizing = 'border-box'; 
        buttons.style.gap = '10px'; 

        const button_info = document.createElement('button');
        button_info.textContent = 'More Info';
        button_info.onclick = function(e) {
            e.stopPropagation();
            showProgramDetails(program, exercisesData)
        };
        const button_conf = document.createElement('button');
        button_conf.textContent = 'Rate';
        button_conf.style.cursor = 'pointer';
        button_conf.onclick = function() {
            alert('not working yet')
        };
        buttons.appendChild(button_info);
        buttons.appendChild(button_conf);
        card.appendChild(buttons)
        
    document.body.appendChild(card);
    return card;
}

function showProgramDetails(program, exercisesData){
    const window = document.createElement('div')
    window.className = 'modal';
    window.style.display = 'flex';
    window.style.position = 'fixed';
    window.style.zIndex = '1000';
    window.style.left = '0';
    window.style.top = '0';
    window.style.width = '100%';
    window.style.height = '100%';
    window.style.backgroundColor = 'rgba(0,0,0,0.5)';
    window.style.alignItems = 'center';
    window.style.justifyContent = 'center';

    const windowContent = document.createElement('div');
    windowContent.style.backgroundColor = '#2d5186';
    windowContent.style.padding = '20px';
    windowContent.style.borderRadius = '10px';
    windowContent.style.maxWidth = '800px';
    windowContent.style.width = '90%';
    windowContent.style.maxHeight = '80vh';
    windowContent.style.overflowY = 'auto';
    windowContent.style.position = 'relative';
    
    const title = document.createElement('h2');
    title.style.marginBottom = '20px';
    title.style.color = '#E5E5E5';
    title.textContent = `Program #${program.program} - ${exercisesData[0].program_name}`;

    const rating = document.createElement('div');
    rating.style.marginBottom = '20px';
    rating.style.fontSize = '18px';
    rating.style.fontWeight = 'bold';
    rating.style.color = '#FFA500';
    rating.textContent = `Rate: ★ ${program.predicted_rating.toFixed(1)} / 5.0`;

    const closeBtn = document.createElement('span');
    closeBtn.innerHTML = '&times;';
    closeBtn.style.position = 'absolute';
    closeBtn.style.right = '20px';
    closeBtn.style.top = '10px';
    closeBtn.style.fontSize = '28px';
    closeBtn.style.fontWeight = 'bold';
    closeBtn.style.cursor = 'pointer';
    closeBtn.style.color = '#aaa';
    closeBtn.onclick = function() {
        document.body.removeChild(window);
    };

    windowContent.appendChild(title);
    windowContent.appendChild(rating);
    windowContent.appendChild(closeBtn);

    const exercisesByDay = {};
    for (let i = 0; i < exercisesData.length; ++i) {
        const day = exercisesData[i].day;
        if (!exercisesByDay[day]) {
            exercisesByDay[day] = [];
        }
        exercisesByDay[day].push(exercisesData[i]);
    }

    for (let day in exercisesByDay) {
        const dayExercises = exercisesByDay[day];
        
        const dayHeader = document.createElement('h3');
        dayHeader.style.fontSize = '20px';
        dayHeader.style.marginBottom = '15px';
        dayHeader.style.marginTop = '20px';
        dayHeader.style.padding = '10px';
        dayHeader.style.backgroundColor = '#162447';
        dayHeader.style.borderRadius = '5px';
        dayHeader.style.color = '#E5E5E5';
        dayHeader.textContent = day;
        windowContent.appendChild(dayHeader);
        
        for (let i = 0; i < dayExercises.length; ++i) {
            const recordDiv = document.createElement('div');
            recordDiv.style.marginBottom = '10px';
            recordDiv.style.padding = '12px';
            recordDiv.style.backgroundColor = '#0D1117';
            recordDiv.style.borderRadius = '5px';
            recordDiv.style.borderLeft = '4px solid #0d8ecf';
            
            const mainRow = document.createElement('div');
            mainRow.style.display = 'flex';
            mainRow.style.flexWrap = 'wrap';
            mainRow.style.gap = '15px';
            mainRow.style.alignItems = 'center';
            
            const muscleGroup = document.createElement('span');
            muscleGroup.style.fontWeight = 'bold';
            muscleGroup.style.minWidth = '120px';
            muscleGroup.style.color = '#E5E5E5';
            muscleGroup.textContent = dayExercises[i].muscle_group;
            
            const name = document.createElement('span');
            name.style.flex = '1';
            name.style.minWidth = '200px';
            name.style.color = '#E5E5E5';
            name.textContent = dayExercises[i].name;
            
            const reps = document.createElement('span');
            reps.style.minWidth = '100px';
            reps.style.color = '#E5E5E5';
            reps.textContent = `${dayExercises[i].min_reps} - ${dayExercises[i].max_reps} reps`;
            
            const sets = document.createElement('span');
            sets.style.minWidth = '60px';
            sets.style.color = '#E5E5E5';
            sets.textContent = `${dayExercises[i].sets} sets`;
            
            mainRow.appendChild(muscleGroup);
            mainRow.appendChild(name);
            mainRow.appendChild(reps);
            mainRow.appendChild(sets);
            
            recordDiv.appendChild(mainRow);
            windowContent.appendChild(recordDiv);
        }
    }

    const downloadPdfBtn = document.createElement('button');
    downloadPdfBtn.textContent = 'Download PDF';
    downloadPdfBtn.style.backgroundColor = '#28a745';
    downloadPdfBtn.style.cursor = 'pointer';
    downloadPdfBtn.onclick = function() {
        downloadProgramAsPDF(program, exercisesData);
    };


    const closeBottomBtn = document.createElement('button');
    closeBottomBtn.textContent = 'Close';
    closeBottomBtn.style.cursor = 'pointer';
    closeBottomBtn.onclick = function() {
        document.body.removeChild(window);
    };
    windowContent.appendChild(downloadPdfBtn)
    windowContent.appendChild(closeBottomBtn)

    window.appendChild(windowContent);
    document.body.appendChild(window);
}

function downloadProgramAsPDF(program, exercisesData) {
    const printWindow = window.open('', '_blank');
    
    let html = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Program #${program.program}</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 10px; }
                h2 { color: #2d5186; text-align: center; }
                h3 { color: #FFA500; text-align: center; }
                h4 { background-color: #162447; color: white; padding: 10px; border-radius: 5px; }
                table { width: 100%; border-collapse: collapse; margin-top: 10px; }
                th { background-color: #f2f2f2; border: 1px solid #ddd; padding: 2px; text-align: left; }
                td { border: 1px solid #ddd; padding: 2px; }
                .date { text-align: center; margin-top: 10px; color: #666; font-size: 12px; }
            </style>
        </head>
        <body>
            <h2>Program #${program.program} - ${exercisesData[0].program_name}</h2>
            <h3>Rating: ★ ${program.predicted_rating.toFixed(1)} / 5.0</h3>
    `;
    
    const exercisesByDay = {};
    for (let i = 0; i < exercisesData.length; ++i) {
        const day = exercisesData[i].day;
        if (!exercisesByDay[day]) {
            exercisesByDay[day] = [];
        }
        exercisesByDay[day].push(exercisesData[i]);
    }
    
    for (let day in exercisesByDay) {
        html += `<h4>${day}</h4>`;
        html += `
            <table>
                <thead>
                    <tr>
                        <th>Muscle Group</th>
                        <th>Exercise</th>
                        <th>Reps</th>
                        <th>Sets</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        exercisesByDay[day].forEach(ex => {
            html += `
                <tr>
                    <td>${ex.muscle_group}</td>
                    <td>${ex.name}</td>
                    <td>${ex.min_reps} - ${ex.max_reps}</td>
                    <td>${ex.sets}</td>
                </tr>
            `;
        });
        
        html += `</tbody></table>`;
    }
    
    html += `<p class="date">Generated on: www</p>`;
    html += `</body></html>`;
    
     printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
}


function btn_confirm_form(){
    const div = document.getElementById('form');
    const info = document.getElementById('info');

    const name = document.getElementById('name');
    const age = document.getElementById('age');
    const gender = document.getElementById('gender');
    const experience = document.getElementById('experience');
    const goal = document.getElementById('goal');
    const days_per_week = document.getElementById('days_per_week');
    
    let fields = [name,age,gender,experience,goal,days_per_week]

    let isEmpty = false;

    for (let i = 0; i < fields.length; i++) {
        if (!fields[i] || fields[i].value.trim() === '') {
            isEmpty = true;
            break;
        }
    }

    if (isEmpty) {
        info.textContent = 'You must enter all fields';
        info.style.color = 'red';
    } else {
        div.style.display = 'none';
        info.textContent = 'Please, enter the form';
        info.style.color = '';
        recommend(name.value,age.value,gender.value,experience.value,goal.value,days_per_week.value)
    }    
}