//SECTION 1: APPLICATION DATA
const assessments=[{
    id: 1,
    title: "HTML and CSS Practical",
    course: "Web Development",
    type: "Assignment",
    deadline: dateFromToday,
    priority: "High",
    notes: "Create and style a responsive webpage.",
    completed: false
},
    
    {id:2,
        title: "Programming Fundamentals Test",
        course: "Computer Programming",
        type: "Test",
        deadline: dateFromToday(2),
        priority: "High",
        notes: "Revise variables, conditions and loops.",
        completed: false
    },

    {
        id: 3,
        title: "Learning Theories Presentation",
        course: "Educational Psychologyy",
        type: "Presentation",
        deadline: dateFromToday(7),
        priority: "Medium",
        notes: "Prepare slides and presentation notes.",
        completed: false
    },

    {
        id: 4,
        title: "Computer Security Coursework",
        course: "Computer Security",
        type: "Assignment",
        deadline: dateFromToday(-3),
        priority: "High",
        notes: "Explain common computer security threats.",
        completed: false
    },

    {id: 5,
    title: "Mathematics Examination",
    course: "Discrete Mathematics",
    type: "Examination",
    deadline: dateFromToday(10),
    priority: "High",
    notes: "Revise algorithms and mathematical logic.",
    completed: false
    },  

    {
        id: 6,
        title: "Database Design Project",
        course: "Database Systems",
        type: "Test",
        deadline: dateFromToday(14),
        priority: "Medium",
        notes: "Prepare a sample database design.",
        completed: false
    },

    {
        id: 7,
        title: "Computer Applications Test",
        course: "Computer Applications",
        type: "Test",
        deadline:dateFromToday(0),
        priority: "Medium",
        notes: "Review practical computer applications.",
        completed: false
    },

    {
        id: 8,
        title: "Research Skills Presentation",
        course: "Research Methods",
        type: "Presentation",
        deadline: dateFromToday(1),
        priority: "Low",
        notes: "Present the main stages of research.",
        completed: false
    }
];

let nextid = 9;


//SECTION 2: DATE FUNCTION

function dateFromToday(offset){
    const date = new Date();
    date.setHours(12,0,0,0);
    date.setDate(date.getDate()+offset);

    const year = date.getFullYear();
    const month = String(date.getMonth()+1).padStart(2,"0");
    const day =String(date.getDate()).padStart(2,"0");

    return '${year}-${month}-${day}';
}

function getDaysRemaining(deadline){
    const today = new Date();
    today.setHours(0,0,0,0);

    const dueDate = new Date('${deadline}T00:00:00');
    dueDate.setHours(0,0,0,0);

    return Math.round(
        (dueDate.getTime()-today.getTime())/86400000
    );
}

function formatDate(dateString){
    const date = new Date('${dateString)}T12:00:00');

    return date.toLocaleDateString("en-UG",{
        day: "numeric",
        month: "short",
        year: "numeric"
    });
}

//SECTION 3: SAFE TEXT DISPLAY

function escapeHTML(value){
    return String(value).replace(/[&<>""]/g, character => {
        const replacements ={
            "&": "&amp;",
            "<": "&lt;",
            ">": "&quot;",
            "": "&#30;"
        };

        return replacements[character];
    });
}

//SECTION 4: DETERMINE TASK STATUS

function getTaskStatus(assessment){
    if (assessment.completed){
        return "Completed";
    }

    if(getDaysRemaining(assessment.deadline)<0){
        return "Overdue";
    }

    return "Pending";
}

//SECTION 5:SEARCH AND FILTER ASSESSMENTS

function searchAssessments(){
    const searchTerm = document
    .getElementById("search-input")
    .value.trim()
    .toLowerCase();

    const selectedType =
    document.getElementById("type-filter").value;
    const selectedStatus =
    document.getElementById("status-filter").value;
    const sortOption =
    document.getElementById("sort-filter").value

    let filtered = assessments.filter(assessment =>{
        const matchesSearch =
        assessment.title.toLowerCase().includes(searchTerm)||
        assessment.course.toLowerCase().includes(searchTerm)||
        assessment.type.toLowerCase().includes(searchTerm);

        const matchesType =
        !selectedType || assessment.type === selectedType;

        const status = getTaskStatus(assessment);

        const machesStatus =
        !selectedStatus ||
        (selectedStatus ==="Pending" && status !== "Completed") ||
        (selectedStatus ==="Completed" && status ===
        "Completed");

        return matchesSearch && matchesType && machesStatus;
    });

    //SECTION 6:SORT RESULTS

    filtered.sort((a,b)=>{
        if(sortOption === "date-desc"){
            return b.deadline.localeCompare(a.deadline);
        }

        if(sortOption === "courrse"){
            return a.course.localeCompare(b.deadline)
        }

        return a.deadline.localeCompare(b.deadline);
    });

    renderAssessments(filtered);
}

//SECTION 7:DISPLAY ASSESSMENT CARDS

function renderAssessments(records){
    const list = document.getElementById("assessment-list");
    const resultsCount =
    document.getElementById("results-count");

    resultsCount.textContent =
    '${records.length}assessment${records.length===1?"":"s"}found';

    if(records.length === 0){
        list.innerHTML = `
        <div class="empty-state">
        <h3>No assessments found</h3>
        <p>Try changing your search or filters, or add a new assessment.</p>
        </div>
        `;

        return;
    }

    list.innerHTML =records.map(assessment =>{
        const status = getTaskStatus(assessment);
        const days = getDaysRemaining(assessment.deadline);

        let daysText;

        if(assessment.completed){
            daysText = "This assessment is completed.";
        }
        else if (days < 0){
            daysText = `Overdue by ${Math.abs(days)} day(s).`;
        }
        else if (days===0){
            daysText = "Deadline is today.";
        }
        else {
            daysText = `${days} day(s) remaining. `;
        }

        const completedButton = assessment.completed
        ?`<button class = "button button-light" disabled>
        Completed </button>`
        :`<button class = "button button-success"
        data-action = "complete" data-id = "${assessment.id}">
        Mark completed </button>`;

        return`
        <article class = "assessment-card">
        <div class ="badges">
        <span class = "badges"> ${escapeHTML(assessment.type)}
        </span>
        
        <span class = "badge $ {status}"> ${status}</span>
        </div>
        
        <h3> ${escapeHTML(assessment.title)} </h3>
        
        <p class = "card-meta">
        <strong> Course: </strong>
        ${escapeHTML(assessment.course)}
        </p>
        
        <p>
        <strong> Deadline: </strong>
        ${escapeHTML(assessment.deadline)}
        </p>
        
        <p>
        <strong> Priority: </strong>
        ${escapeHTML(assessment.priority)}
        </p>
        
        <p class = "card-meta">
        ${escapeHTML(assessment.notes || "No additional notes.")}
        </p>
        
        <p class = "days-remaining"> ${daysText} </p>
        
        <div class = "card-actions">
        ${completedButton}
        
        <button class = "button button-danger"
        data-action = "delete" data-id = "${assessment.id}">
        Delete </button>
        </div>
        </article>
        ;`
    }).join("");
}

//SECTION 8:CALCULATE DASHBOARD SUMMARY

function calculateSummary(){
    const total = assessments.length;

    const upcoming = assessments.filter(assessment =>
        !assessment.completed &&
        getDaysRemaining(assessment.deadline) >= 0
    ).length;

    const overdue = assessments.filter(assessment =>
        !assessment.completed &&
        getDaysRemaining(assessment.deadline) < 0
    ).length;


    const completed = assessments.filter(
        assessment => assessment.completed
    ).length;

    document.getElementById("total-count").textContent = total;
    document.getElementById("upcoming-count").textContent = upcoming;
    document.getElementById("overdue-count").textContent = completed;
}

//  section 9:REFRESH THE APPLICATION

function refreshPlanner(){
    calculateSummary();
    searchAssessments();
}

//SECTION 10:ADD NEW DEADLINE

function handleFormSubmit(event) {
    event.preventDefault();

    const form = document.getElementById("deadline-form");
    const message = document.getElementById("form-message");

    if (!form.checkValidity ()){
        form.reportValidity ();
        return;
    }

    const title = FormData.get("title").trim();
    const course = FormData.get("course").trim();
    const type = FormData.get("type");
    const deadline = FormData.get("deadline");
    const priority = FormData.get("priority");
    const notes = FormData.get("notes").trim();

    if (title.length <3 || course.length <2){
        showMessage(
            "Enter a valid assessment title and course name.",
            "error"
        );
    }

    if (
        !["Assignment", "Test", "Presentation", "Examination", "Project"]
        .includes(type)
    ){
        showMessage("Please select a valid assessment type.",
            "error"
        );

        return;
    }

    if (!deadline || Number.isNaN(new Date(deadline).getTime())){
        showMessage("Please enter a valid deadline date.", "error");
        return;
    }

    assessments.push({
        id: nextId++,
        title,
        course,
        type,
        deadline,
        priority,
        notes,
        completed:false
    });

    form.requestFullscreen();

    showMessage(
        "Assessment added successfully to your sample plan.",
        "success"
    );

    refreshPlanner();
}

//SECTION 11:SHOW SUCCESS AND ERROR MESSAGES

function showMessage(text, type){
    const message = document.getElementById("form-message");

    message.textContent = text;
    message.className = `feedback ${type}`;
}

//SECTION 12:HANDLE CARD ACTIONS

function handleAssessmentAction(event){
    const button = event.target.closest("button[data-action]");

    if (!button){
        return;
    }

    const id = Number(button.dataset.id);
    const action = button.dataset.action;

    const assessment = assessments.find(item => item.id === id);

    if (!assessment){
        return;
    }

    if (action === "complete") {
        assessment.completed = true;
        showMessage(
            `"${assessment.title}" marked as completed.`,
            "success"
        );
    }

    if (action === "delete"){
        const index = assessments.findIndex(item => item.id === id);

        if (index !== -1){
            assessments.splice(index, 1);
        }

        showMessage("Assessment removed from the sample plan.",
            "success"
        );
    }

    refreshPlanner();
}

// SECTION 13:RESET SEARCH AND FILTERS

function resetFilters(){
    document.getElementById("search-input").value = "";
    document.getElementById("type-filter").value = "";
    document.getElementById("status-filter").value = "",
    document.getElementById("sort-filter").value = "date-asc";

    refreshPlanner();
}

// SECTION 14:INITIALISE THE APPLICATION

function initialisePlanner(){
    const today = new Date();

    document.getElementById("today-date").textContent = 
    today.toLocaleDateString("en-UG", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric"
    });

    document.getElementById("deadline-form").addEventListener(
        "submit",
        handleFormSubmit
    );

    document.getElementById("search-input").addEventListener(
        "input",
        searchAssessments
    );

    document.getElementById("type-filter").addEventListener(
        "change",
        searchAssessments
    );

    const statusFilter = document.getElementById("status-filter").addEventListener(
        "change",
        searchAssessments
    );

    const sortFilter = document.getElementById("sort-filter").addEventListener(
        "change",
        searchAssessments
    );

    const resetFilter = document.getElementById("reset-filter");addEventListener(
        "click",
        resetFilters
    );

    const assessmentList = document.getElementById("assessment-list").addEventListener(
        "click",
        handleAssessmentAction
    );

    refreshPlanner();
}

document.addEventListener("DOMContentLoaded",
initialisePlanner);
 