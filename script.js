let addStudentButton=document.getElementById("addStudentBtn");
let updateStudentBtn=document.getElementById('updateStudentBtn');
let studentName=document.getElementById('studentName');
let studentMajor=document.getElementById('studentMajor');
let studentYear=document.getElementById('studentYear');
let studentStatus=document.getElementById('studentStatus');
let studentTableBody=document.querySelector('tbody');
let totalStudents=document.getElementById('totalStudents');
let activeStudents=document.getElementById('activeStudents');
let totalDepartments=document.getElementById('totalDepartments');
let searchInput=document.getElementById('searchInput');
let yearFilter=document.getElementById('yearFilter');
let darkModBtn=document.getElementById('darkModBtn');
let showFormBtn=document.getElementById('showFormBtn');
let studentForm=document.getElementById('studentForm');
let cancelStudentBtn=document.getElementById('cancelStudentBtn');
let noStudentsMessage=document.getElementById('noStudentsMessage');
let students=[];
let selectRow=null;

showFormBtn.onclick=function()
{studentForm.style.display='flex';}

cancelStudentBtn.onclick=function()
{studentForm.style.display='none';
    studentName.value="";
    studentMajor.value="";
    studentYear.value="";
    studentStatus.value="Active";
    addStudentButton.style.display='inline-block';
    updateStudentBtn.style.display='none';
    selectRow=null;}

addStudentButton.onclick=function()
{let name = studentName.value;
 let major = studentMajor.value;
 let year = studentYear.value;
 let status = studentStatus.value;
 if(!validateStudent(name,major,year))
    {return;}
 let studentExists=students.some(function(student){
    return student.name.trim().toLowerCase() === name.trim().toLowerCase();
 });
 if(studentExists){
   window.alert('This student already exists.');
    return;
 }
 students.push({
    name:name,
    major:major,
    year:year,
    status:status
 });
 saveStudents();
 showStudents();
 updateStats();
 cleardata();
studentForm.style.display='none';
}

function cleardata()
{studentName.value='';
 studentMajor.value='';
 studentYear.value='';
 studentStatus.value='Active';}

 function saveStudents()
{localStorage.setItem('students',JSON.stringify(students))}

studentTableBody.onclick=function(event)
{if(event.target.classList.contains('deleteBtn'))
{let row=event.target.parentElement.parentElement;
    let stdName=row.dataset.name;
    let confirmed=confirm("Are you sure you want to delete this student?");
    if(!confirmed){return;}
    students=students.filter(function(student){
        return student.name !==stdName;
    });
    saveStudents();
    showStudents();
    updateStats();
}
else if(event.target.textContent==="Edit")
{ selectRow=event.target.parentElement.parentElement;

  selectRow.dataset.oldName=selectRow.dataset.name;
  studentForm.style.display = "flex";
  studentName.value=selectRow.children[0].textContent;
  studentMajor.value=selectRow.children[1].textContent;
  studentYear.value=selectRow.children[2].textContent;
  studentStatus.value=selectRow.children[3].textContent;
  
  addStudentButton.style.display="none";
  updateStudentBtn.style.display="block"
  
}}

updateStudentBtn.onclick=function()
{  if(!validateStudent(studentName.value,studentMajor.value,studentYear.value))
   {return;}
   let nameExists=students.some(function(student){
    return(student.name.toLowerCase()===studentName.value.toLowerCase()&&student.name!==selectRow.dataset.oldName);
   });
   if(nameExists){
    alert("This student already exists.");
    return;
   }
   let oldName=selectRow.dataset.oldName;
   selectRow.children[0].textContent = studentName.value;
   selectRow.children[1].textContent = studentMajor.value;
   selectRow.children[2].textContent = studentYear.value;
   selectRow.children[3].innerHTML =`<span class="status-badge ${studentStatus.value.toLowerCase()}">${studentStatus.value}</span>`;
   let student=students.find(function(student){
    return student.name===oldName; });
    student.name=studentName.value;
    student.major=studentMajor.value;
    student.year=studentYear.value;
    student.status=studentStatus.value;
    saveStudents();
    showStudents();
    updateStats();
    cleardata();
    studentForm.style.display = "none";
    addStudentButton.style.display = "inline-block";
    updateStudentBtn.style.display = "none";

    selectRow= null;}

function updateStats()
{
 totalStudents.textContent=students.length;
 let activeCount=0;
 let departments=[];
 students.forEach(function(student){
    
    if(student.status.trim() === 'Active')
    {activeCount++;}
    if (!departments.includes(student.major)) 
    {departments.push(student.major);}
 });
 activeStudents.textContent=activeCount;
 totalDepartments.textContent=departments.length;
}
updateStats();

function loadStudents()
{let saveStudents=localStorage.getItem('students');
    if(saveStudents)
    {students=JSON.parse(saveStudents);}}

function showStudents()
{studentTableBody.innerHTML="";
 students.forEach(function(students){
 let newRow=document.createElement('tr');

 newRow.dataset.name=students.name;
 newRow.innerHTML=`<td>${students.name}</td>
                   <td>${students.major}</td>
                   <td>${students.year}</td>
                   <td><span class="status-badge ${students.status.toLowerCase()}">
                   ${students.status}</span></td>
                   <td>
                   <button>Edit</button>
                   <button class="deleteBtn">Delete</button>
                   </td>`;
                studentTableBody.appendChild(newRow);});
   }

darkModBtn.onclick=function()
{document.body.classList.toggle('dark-mode');
    if(document.body.classList.contains('dark-mode'))
    {localStorage.setItem('darkMode','enabled');}
    else
    {localStorage.setItem('darkMode','disabled');}}
    
function filterStudents(){
    let searchValue=searchInput.value.toLowerCase();
    let selectedYear=yearFilter.value;
    let rows=studentTableBody.querySelectorAll('tr');
    let visibleRows=0;
    rows.forEach(function(row){
        let studentName=row.children[0].textContent.toLowerCase();
        let studentYear=row.children[2].textContent;
        if(studentName.includes(searchValue) && (selectedYear === 'all' || studentYear === selectedYear))
        {row.style.display="";
         visibleRows++;
        }
        else
        {row.style.display='none';}
    });
    if(visibleRows === 0)
    {noStudentsMessage.style.display='block';}
    else
    {noStudentsMessage.style.display='none';}

}
searchInput.oninput=filterStudents;
yearFilter.onchange=filterStudents;


let saveDarkMode=localStorage.getItem('darkMode');
if(saveDarkMode==='enabled')
document.body.classList.add('dark-mode');
loadStudents();
showStudents();
updateStats();
let sidebarLinks=document.querySelectorAll('.sidebar a');
sidebarLinks.forEach(function(link){
    link.onclick=function()
    {sidebarLinks.forEach(function(item){item.classList.remove('active')});
link.classList.add('active');};});

function validateStudent(name,major,year)
{ if(name.trim() === "" || major.trim() === "" || year === "") {
        alert("Please fill in all fields.");
        return false;}
  if (year < 1 || year > 4) {
        alert("Year must be between 1 and 4.");
        return false;}
  if (!/^[a-zA-Z\s]+$/.test(name)) {
        alert("Name can only contain letters.");
        return false;}
  if (!/^[a-zA-Z\s]+$/.test(major)) {
        alert("Major can only contain letters.");
        return false;}
  return true;
}