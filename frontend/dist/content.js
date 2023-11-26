const dark = '#FFA500';
const white = '#FFD580';
const lighter = '#DDEDFF';
window.addEventListener("load", () => {
    // Starts execution when the window is loaded
    // It searches for divs with class names same as that of the ones we need to pull from linkedin jd page
    // Right side full container has class = jobs-search__job-details--container
    // Job description container has class = jobs-description-content__text
    let jobDetails = document.querySelector(".jobs-search__job-details--container");
    let jdDiv = document.querySelector(".jobs-description-content__text");
    
    let headerDiv = document.querySelector(".justify-space-between");
    // If these two divs are present in the loaded web page then:
    if (headerDiv) {
        // Parent container that will be inserted once 
        let container = document.createElement("div");
        container.id = "container";
        container.style.cssText = `
            background: ${white};
            width: 100%;
            height: 110px;
            border-radius: 12px;
            margin-top: 20px;
            display: flex;
            box-shadow: 0px 0px 1px 0px rgba(0, 0, 0, 0.7);
        `;
        // container for all data on left
        let left = document.createElement("div");
        left.id = "left";
        left.style.cssText = `
            padding: 5px;
            width: 40%;
            border-radius: 12px;
            background: ${dark};
        `;
        // conatiner for all data on right
        let right = document.createElement("div");
        right.id = "right";
        right.style.cssText = `
            width: 60%;
            background: ${white};
            border-radius: 12px;
        `;

        // To display SCAN JD name
        let leftHeader = document.createElement("div");
        leftHeader.id = "leftHeader";
        leftHeader.style.color = "white";
        let heading = document.createElement("h3");
        heading.id = 'heading';
        heading.textContent = "SCAN JD";
        heading.style.cssText = `
            font-family: 'SF Pro Rounded', sans-serif;
            color: ${white};
            font-weight: bold;
            font-size: 24px;
            text-align: left;
            padding-left: 4%
        `;
        leftHeader.appendChild(heading);
        
        // To display sponsorship, workex , etc data
        let leftBody = document.createElement("div");
        leftBody.id = "leftBody";

        // To display all skills
        let rightA = document.createElement("div");
        rightA.id = "rightA";
        rightA.style.height = '50%'
        rightA.style.display = 'flex'; 
        rightA.style.justifyContent = 'center'; 

        // to display SJD logo and credit count
        let rightB = document.createElement("div");
        rightB.id = "rightB";
        rightB.style.height = '50%'
        rightB.style.padding = '5px';

        // apend everything
        // build left side
        left.appendChild(leftHeader);
        left.appendChild(leftBody);

        // build right side
        right.appendChild(rightA);
        right.appendChild(rightB);

        // build parent
        container.appendChild(left);
        container.appendChild(right);
        
        // The container div is only inserted once when the page is loaded
        // After that we just keep on manipulating the contents of the left and right divs in container
        headerDiv.insertBefore(container, headerDiv.lastChild);
        const observer = new MutationObserver(updateContainer);
        const config = { subtree: true, childList: true };
        observer.observe(jdDiv, config);

        // once page is loaded, look for the api key
        const sjd_apikey = localStorage.getItem('sjd_apikey');
        // if API key is present, call the function that will validate the apikey
        if (sjd_apikey){
            login(sjd_apikey);
        }
        else{
            // if api key is not found on load, render the login page that takes api key and verifies it
            loadLogin();
        }
    }
});

// This function is called when the user clicks on a different job on two page linkedin jobs view
function updateContainer(event){
    // clear the container
    clearLeftBody();
    clearRightA();
    clearRightB();
    // console.log("new job clicked");
    setTimeout(function() {
        // check for apikey
        const sjd_apikey = localStorage.getItem('sjd_apikey');
        // if API key is present, call the function that will render the Analyze this JD button in the container
        if (sjd_apikey){
            loadBTN();
        }
        else{
        // if api key is not found on load, render the login page that takes api key and verifies it
            loadLogin();
        }
    }, 350);
}
// Loading the login page where user inputs apikey
function loadLogin(){
    // reset component states
    clearRightA();
    // Create a clickable SVG image
    var clickableImage1 = document.createElement('a');
    clickableImage1.id = 'clickableImage1';
    clickableImage1.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="14" viewBox="0 0 10 14" fill="none">
        <path d="M5 10C5.6875 10 6.25 9.4375 6.25 8.75C6.25 8.0625 5.6875 7.5 5 7.5C4.3125 7.5 3.75 8.0625 3.75 8.75C3.75 9.4375 4.3125 10 5 10ZM8.75 4.375H8.125V3.125C8.125 1.4 6.725 0 5 0C3.275 0 1.875 1.4 1.875 3.125V4.375H1.25C0.5625 4.375 0 4.9375 0 5.625V11.875C0 12.5625 0.5625 13.125 1.25 13.125H8.75C9.4375 13.125 10 12.5625 10 11.875V5.625C10 4.9375 9.4375 4.375 8.75 4.375ZM3.0625 3.125C3.0625 2.05625 3.93125 1.1875 5 1.1875C6.06875 1.1875 6.9375 2.05625 6.9375 3.125V4.375H3.0625V3.125ZM8.75 11.875H1.25V5.625H8.75V11.875Z" fill="black"/>
        </svg>
    `;    
    clickableImage1.style.cssText = `
        margin-left: 5px;
        margin-top: 5px;
        margin-bottom: 2px;
    `;
    // input box for taking in api key
    var apiKey = document.createElement('input');
    apiKey.type = 'text';
    apiKey.id = 'apiKey';
    
    // Apply CSS for styling the input field
    apiKey.style.cssText = `
        border: 0;
        outline: none;
        border-radius: 0;
        width: 100%;
        height: 50px;
        margin: 0;
        box-shadow: none;
        text-decoration: none;
    `;
    apiKey.setAttribute('placeholder', 'Enter your API key');
    
    // Append to the document
    document.body.appendChild(apiKey);

    // creating the div housing images and input fields
    var inputBoxA = document.createElement('div');
    inputBoxA.id = 'inputBoxA';
    inputBoxA.style.cssText = `
        background: ${lighter};
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 10%;
        border-radius: 5px;
    `;
    // append all containers
    inputBoxA.appendChild(clickableImage1);
    inputBoxA.appendChild(apiKey);

    let rightA = document.getElementById('rightA');
    rightA.appendChild(inputBoxA);

    // Create a button for checking the API key
    var rightB = document.getElementById('rightB');
    rightB.innerHTML = '';
    
    const inputBoxB = document.createElement('div');
    inputBoxB.id = 'inputBoxB'
    inputBoxB.style.display = 'flex';
    inputBoxB.style.justifyContent = 'center'; 
    inputBoxB.style.alignItems = 'center';
    
    const loginBtn = document.createElement('button');
    loginBtn.id = 'loginBtn';
    
    // Apply CSS for styling the button
    loginBtn.style.cssText = `
        width: 96px;
        height: 29px;
        background: ${dark};
        border-radius: 14.50px;
        font-family: 'SF Pro Rounded', sans-serif;
        color: ${white};
        font-weight: bold;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 5px;
        margin-bottom: 2px;
        padding-left: 10px;
        padding-right: 10px;
        border: none;
    `;
    
    // Add a shadow on hover
    loginBtn.addEventListener('mouseover', function() {
        loginBtn.style.boxShadow = '0 0 5px rgba(0, 0, 0, 0.3)';
    });
    
    loginBtn.addEventListener('mouseout', function() {
        loginBtn.style.boxShadow = 'none';
    });
    
    loginBtn.addEventListener('click', function() {
        login(document.getElementById('apiKey').value);
    });
    
    loginBtn.textContent = 'Save Key';
    // Append containers
    inputBoxB.appendChild(loginBtn);
    rightB.appendChild(inputBoxB);
    
    let right = document.getElementById('right');
    right.appendChild(rightA);
    right.appendChild(rightB);

}

function login(apikey) {
    // sends apikey to validate endpoint and receives credits or appropriate error messages
    const url = "https://scanjd.xyz/validate";
    const data = { apikey };
    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data), 
    })
    .then(response => {
        if (response.status === 200) {
            // Successful response, parse JSON
            return response.json();
        } else {
            // display that error message somewhere
            message = response.json().response;
            alert(message);
        }
    })
    .then(responseData => {
        // check if server is sending any response or not
        if (responseData) {
            localStorage.setItem('sjd_credits', responseData.credits);
            localStorage.setItem('sjd_apikey', apikey);
            loadBTN();
        } else {
            // Handle error responses here
            alert("Did not receive response from server");
            loadLogin();
        }
    })
    .catch(error => {
        // Handle network errors here
        console.error("An error occurred:", error);
    });
}


function loadBTN(){
    // load rightB div and clear it
    var rightBDiv = document.getElementById('rightB');
    rightBDiv.innerHTML = '';
    rightBDiv.style.cssText = `
        text-align: center;
        font-family: 'SF Pro Rounded', sans-serif;
        height: 50%;
    `;

    // load rightA div and clear it
    var rightADiv = document.getElementById('rightA');
    rightADiv.innerHTML = '';
    rightADiv.style.cssText = `
        text-align: center;
        font-family: 'SF Pro Rounded', sans-serif;
        height: 50%;
    `;
    // create a div to host contents of the hurray and credits line
    var contentDiv = document.createElement('div');
    contentDiv.id = 'contentDiv';
    contentDiv.style.cssText = `
        margin: auto;
        text-align: center;
    `;

    
    var hurray = document.createElement('h4');
    hurray.id = 'hurray';
    hurray.textContent = 'Hey there,';
    hurray.style.cssText = `
        color: ${dark};
        font-weight: bold;
        font-size: 15px;
        margin-top: 10px;
    `;
    
    var bottomLineDiv = document.createElement('div');
    bottomLineDiv.id = 'bottomLineDiv';
    bottomLineDiv.style.cssText = `
        display: flex;
        text-align: center;
        margin-left: auto;
        justify-content: center;
    `;

    var d1 = document.createElement('h4');
    d1.innerText="You";
    d1.style.color = 'black';
    d1.style.paddingRight = '5px';
    d1.style.fontSize = '13px';

    var d2 = document.createElement('h4');
    d2.innerText="got  ";
    d2.style.cssText = `
        color: black;
        padding-right: 5px;
        font-size: 13px;
    `;

    var credits = localStorage.getItem('sjd_credits');
    var d3 = document.createElement('h4');
    d3.innerText= credits;
    d3.style.cssText = `
        color: ${dark};
        padding-right: 5px;
        font-size: 13px;
    `;
    

    var d4 = document.createElement('h4');
    d4.innerText="credits!";
    d4.style.cssText = `
        color: black;
        padding-right: 5px;
        font-size: 13px;
    `;

    bottomLineDiv.appendChild(d1);
    bottomLineDiv.appendChild(d2);
    bottomLineDiv.appendChild(d3);
    bottomLineDiv.appendChild(d4);

    contentDiv.appendChild(hurray);
    contentDiv.appendChild(bottomLineDiv);

    // creating the button div
    const analysisBTN = document.createElement('button');
    analysisBTN.id = 'analysisBTN';
    analysisBTN.textContent = 'Analyse this JD';
    analysisBTN.style.cssText = `
        font-family: 'SF Pro Rounded', sans-serif;
        cursor: pointer;
        background-color: #0C65C4;
        color: white;
        font-size: 11px;
        height: 35px;
        width: 105px;
        border-radius: 14.5px;
    `;
    // analysisBTN.style.marginTop = '8px';
    analysisBTN.addEventListener("click", function(){
        analyze();
    });

    rightADiv.appendChild(contentDiv);
    rightBDiv.appendChild(analysisBTN);
}



function loadAnalysisRight(data){
    
    let rightB = document.getElementById('rightB');
    rightB.innerHTML = '';
    let rightA = document.getElementById('rightA');
    rightA.innerHTML = '';
    rightA.style.height = '100%';

    // Create a <style> element with the customized scrollbar CSS
    const customScrollbarCSS = `
        #rightA {
            overflow: hidden;
            padding-right : 10px;
        }
        #rightA:hover {
            overflow-y: scroll;
            padding-right : 0px;
        }
        #rightA::-webkit-scrollbar {
            width: 10px;
            right: -10px; 
        }
        #rightA::-webkit-scrollbar-track {
            border-radius: 20px;
            background-color: transparent;

        }
        #rightA::-webkit-scrollbar-thumb {
            border-radius: 20px;
            background-color: #0C65C4;
        }
    `;

    // Create a <style> element and append it to the document's head
    const styleElement = document.createElement('style');
    styleElement.innerHTML = customScrollbarCSS;
    document.head.insertAdjacentElement('beforeend', styleElement);

    const skills = data.technical_skills;
    const skillsDiv = document.createElement('div')
    skillsDiv.id = 'skillsDiv';
    skillsDiv.style.cssText = `
        display: flex;
        flex-wrap: wrap;
        margin: 5px;
    `;
    const divCSS = `
        height: 25px;
        background-color: #0C65C4;
        font-weight: bold;
        font-size: 12px;
        color: white;
        margin: 4px;
        padding-top: 4.5px;
        padding-left: 8px;
        padding-right: 8px;
        border-radius: 12px;
    `; 
    for (let i = 0; i < skills.length; i++){
        // create container
        const div = document.createElement('div');
        div.textContent = skills[i];
        // attach styles
        div.style.cssText = divCSS;
        // attach container as child to 
        skillsDiv.appendChild(div);
    }
    rightA.appendChild(skillsDiv);
};


function sendAnalysisRequest(jdID, jd, apikey) {
    const url = "https://scanjd.xyz/analyze";
    const data = { "apikey": apikey, "jdID": jdID, "jd": jd };
    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
    .then(response => {
        if (response.status === 200) {
            // Successful response, parse JSON
            return response.json();
        } else {
            // display that error message somewhere
            message = response.json().response;
            alert(message);
        }
    })
    .then(data => {
        loadAnalysisLeft(data);
        loadAnalysisRight(data);
    })
    .catch(error => {
        // Handle network errors here
        console.error("An error occurred:", error);
    });
}

function loadAnalysisLeft(data){
    var leftBody = document.getElementById('leftBody');
    leftBody.innerHTML = '';
    var sponsorData = document.createElement('div');
    sponsorData.style.display = 'flex';
    sponsorData.style.alignItems = 'center';
    sponsorData.style.marginLeft = '5px';

    var sponsorImage = document.createElement('a');
    sponsorImage.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="14" viewBox="0 0 16 14" fill="none">
        <path d="M13 10.4V9.2L8.36842 6.2V2.9C8.36842 2.402 7.98053 2 7.5 2C7.01947 2 6.63158 2.402 6.63158 2.9V6.2L2 9.2V10.4L6.63158 8.9V12.2L5.47368 13.1V14L7.5 13.4L9.52632 14V13.1L8.36842 12.2V8.9L13 10.4Z" fill="white"/>
        </svg>
    `;

    var sponsorText = document.createElement('h4');
    sponsorText.innerText = 'Sponsorship : ' + data.sponsorship;
    sponsorText.style.cssText = `
        color: #FFFFFF;
        font-weight: bold;
        font-size: 12px;
        display: flex;
        margin-left: 2px;
    `;

    sponsorData.appendChild(sponsorImage);
    sponsorData.appendChild(sponsorText);

    var experienceData = document.createElement('div');
    experienceData.style.cssText = `
        display: flex;
        align-items: center;
        margin-left: 5px;
    `;

    var experienceImage = document.createElement('a');
    experienceImage.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="14" viewBox="0 0 16 14" fill="none">
        <path d="M11.8646 3.95494H10.5463C10.5463 2.49823 9.36647 1.31836 7.90976 1.31836C6.45305 1.31836 5.27318 2.49823 5.27318 3.95494H3.95489C3.22983 3.95494 2.6366 4.54817 2.6366 5.27323V13.183C2.6366 13.908 3.22983 14.5013 3.95489 14.5013H11.8646C12.5897 14.5013 13.1829 13.908 13.1829 13.183V5.27323C13.1829 4.54817 12.5897 3.95494 11.8646 3.95494ZM7.90976 2.63665C8.63482 2.63665 9.22805 3.22988 9.22805 3.95494H6.59147C6.59147 3.22988 7.1847 2.63665 7.90976 2.63665ZM11.8646 13.183H3.95489V5.27323H5.27318V6.59152C5.27318 6.95405 5.56979 7.25066 5.93232 7.25066C6.29485 7.25066 6.59147 6.95405 6.59147 6.59152V5.27323H9.22805V6.59152C9.22805 6.95405 9.52466 7.25066 9.88719 7.25066C10.2497 7.25066 10.5463 6.95405 10.5463 6.59152V5.27323H11.8646V13.183Z" fill="white"/>
        </svg>
    `;

    var experienceText = document.createElement('h4');
    experienceText.innerText = 'Experience : ' + data.experience + ' years';
    experienceText.style.cssText = `
        color: #FFFFFF;
        font-weight: bold;
        font-size: 12px;
        display: flex;
        margin-left: 2px;
    `;

    experienceData.appendChild(experienceImage);
    experienceData.appendChild(experienceText);

    // update credits
    let credits = parseInt(localStorage.getItem('sjd_credits'), 10) - 1;
    localStorage.setItem('sjd_credits', credits.toString());

    leftBody.appendChild(sponsorData); 
    leftBody.appendChild(experienceData); 
};




async function analyze(){
    // get apikey
    sjd_apikey = localStorage.getItem('sjd_apikey');
    if(!sjd_apikey){
        alert("You need to put API key");
        loadLogin();
    }
    // get JD
    const jdDiv = document.querySelector('.jobs-description-content__text');
    const jd = jdDiv.textContent;
    const url = new URL(window.location.href);
    const pathnameSegments = url.pathname.split('/');
    console.log(url);
    if(pathnameSegments[2] !="view"){
        jdID = url.searchParams.get("currentJobId");
        sendAnalysisRequest(jdID, jd, sjd_apikey);
        return;
    }
    if(pathnameSegments[2] == "view" && athnameSegments[3]){
        jdID = pathnameSegments[3];
        sendAnalysisRequest(jdID, jd, sjd_apikey);
        return;
    }
    else{
        // error with url
        alert('Error with url of loaded page');
    }
}

// function updateJD() {
//     // Remove old text and styles
//     let sjd = document.querySelector("#sjdDiv");
//     sjd.textContent = "";
//     sjd.style.background = "linear-gradient(to right, #00FF00, #00BFFF)"; // New background color
//     let job = document.querySelector(".job-details-jobs-unified-top-card__job-title");
//     // Attach new text and styles
//     const newText = "Updated JD: " + job.textContent; // Modify this as needed
//     const newTextElement = document.createTextNode(newText);
//     sjd.appendChild(newTextElement);
//     // Add any other styles or modifications you want here
// }

function clearLeftBody(){
  var leftBody = document.getElementById('leftBody');
  leftBody.innerHTML = '';
}

function clearRightA(){
  var rightA = document.getElementById('rightA');
  rightA.innerHTML = '';
}
function clearRightB(){
  var rightB = document.getElementById('rightB');
  rightB.innerHTML = '';
}