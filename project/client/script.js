// Function to display error message
function displayError(field, message) {
  const errorElement = document.getElementById(`${field}Error`);
  errorElement.textContent = message;
}
 
// Function to clear error message
function clearError(field) {
  const errorElement = document.getElementById(`${field}Error`);
  errorElement.textContent = '';
}
 
// Function to clear all errors
function clearErrors() {
  const errorElements = document.querySelectorAll('.error');
  errorElements.forEach((element) => {
    element.textContent = '';
  });
}
 
// Function to display stored data
function displayStoredData(data) {
  const dataTable = document.getElementById('dataTable');
 
  // Clear existing rows
  while (dataTable.rows.length > 1) {
    dataTable.deleteRow(1);
  }
 
  // Add a new row to the table for each entry in the data array
  data.forEach((entry) => {
    const row = dataTable.insertRow();
    Object.values(entry).forEach((value) => {
      const cell = row.insertCell();
      cell.textContent = value;
    });
     
 
      // Add Edit and Delete buttons
  const editCell = row.insertCell();
  const deleteCell = row.insertCell();
 
  const editButton = document.createElement('button');
  editButton.textContent = 'Edit';
  editButton.addEventListener('click', () => editData(entry.id));
  editCell.appendChild(editButton);
 
  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Delete';
  deleteButton.addEventListener('click', () => deleteData(entry.id));
  deleteCell.appendChild(deleteButton);
 
   
  });
}
 
function viewData() {
  fetchAndDisplayData();
  document.getElementById('studentForm').style.display = 'none';
  document.getElementById('displaySection').style.display = 'block';
}
 
 
// Function to handle form submission
async function submitForm() {
  clearErrors(); // Clear previous errors
 
  const name = document.getElementById('name').value;
  const age = document.getElementById('age').value;
  const grade = document.getElementById('grade').value;
  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;
 
  let formValid = true;
 
  if (!name.trim()) {
    displayError('name', 'Please enter name');
    formValid = false;
  }
  if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    displayError('email', 'Please enter a valid email address');
    formValid = false;
  }
 
  if (!phone.match(/^\d{10}$/)) {
    displayError('phone', 'Please enter a valid 10-digit phone number');
    formValid = false;
  }
 
  if (isNaN(age) || age <= 0) {
    displayError('age', 'Age must be a positive number');
    formValid = false;
  }
 
  if (!grade.trim() || !grade.match(/^[a-zA-Z]+$/)) {
    displayError('grade', 'Please enter valid grade, only alphabets allowed');
    formValid = false;
  }
 
 
  if (!formValid) {
    return;
  }
 
  // Submit data to the server
  const data = {
   
    name,
    age,
    grade,
    email,
    phone,
  };
 
  try {
    const response = await fetch('/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
 
    // Check if the response indicates an error
    if (!response.ok) {
      const errorMessage = await response.text();
      alert(`Error: ${errorMessage}`);
      return;
    }
 
    // Display a success message
    alert('Form submitted successfully!');
 
    // Fetch and display stored data
    const displayResponse = await fetch('/display');
    const storedData = await displayResponse.json();
    displayStoredData(storedData);
 
    // Show the display section and hide the form
    document.getElementById('studentForm').style.display = 'none';
    document.getElementById('stu').style.display ='none';
    document.getElementById('displaySection').style.display = 'block';
 
    // Optionally, reset the form
    document.getElementById('studentForm').reset();
  } catch (error) {
    console.error('Error:', error); // Log any errors that occur during the fetch
  }
}
 
// Function to validate a field against the server
function validateField(fieldName, fieldValue) {
  fetch('/validate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ [fieldName]: fieldValue }),
  })
  .then(response => response.json())
  .then(data => {
    const fieldError = document.getElementById(`${fieldName}Error`);
    if (data.exists) {
      fieldError.innerHTML = "Data already exists in the database";
    }
  })
  .catch(error => console.error('Error:', error));
}
 
 
 
// Validation functions for individual fields
function validateName() {
  const nameValue = document.getElementById('name').value;
  const nameError = document.getElementById('nameError');
  nameError.textContent = '';
 
  if (!nameValue.trim()) {
    nameError.textContent = 'Please enter name';
  }
}
 
function validateEmail() {
  const emailValue = document.getElementById('email').value;
  const emailError = document.getElementById('emailError');
  emailError.textContent = '';
 
  if (!emailValue.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    emailError.textContent = 'Please enter a valid email address';
  } else {
    validateField('email', emailValue);
  }
}
 
function validatePhone() {
  const phoneValue = document.getElementById('phone').value;
  const phoneError = document.getElementById('phoneError');
  phoneError.textContent = '';
 
  if (!phoneValue.match(/^\d{10}$/)) {
    phoneError.textContent = 'Please enter a valid 10-digit phone number';
  } else {
    validateField('phone', phoneValue);
  }
}
 
function validateGrade() {
  const gradeValue = document.getElementById('grade').value;
  const gradeError = document.getElementById('gradeError');
  gradeError.textContent = '';
 
  const isValidGrade = gradeValue.trim() !== '' && /^[a-zA-Z]+$/.test(gradeValue);
 
  if (!isValidGrade) {
    gradeError.textContent = 'Please enter a valid grade (only alphabets allowed)';
  }
  }
 
 
function validateAge() {
  const ageValue = document.getElementById('age').value;
  const ageError = document.getElementById('ageError');
  ageError.textContent = '';
 
  const isValidAge = ageValue.trim() !== '' && /^\d+$/.test(ageValue) && parseInt(ageValue) > 0;
 
  if (!isValidAge) {
    ageError.textContent = 'Please enter a valid positive number for age';
  }
}
 
function editData(id) {
  fetch(`/data/${id}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(student => {
      // Populate the form with the data for editing
      document.getElementById('name').value = student.name;
      document.getElementById('age').value = student.age;
      document.getElementById('grade').value = student.grade;
      document.getElementById('email').value = student.email;
      document.getElementById('phone').value = student.phone;
 
      // Show the form for editing
      document.getElementById('studentForm').style.display = 'block';
      document.getElementById('displaySection').style.display = 'none';
 
      // Set up an event listener for the form submission to handle the update
      document.getElementById('submit_btn').onclick = () => updateData(id);
    })
    .catch(error => console.error('Error fetching data for edit:', error));
}
 
 
 
// Function to handle update button click
async function updateData(id) {
  // Get the updated data from the form
  const name = document.getElementById('name').value;
  const age = document.getElementById('age').value;
  const grade = document.getElementById('grade').value;
  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;
 
  const updatedData = {
    id,
    name,
    age,
    grade,
    email,
    phone,
  };
 
  try {
    // Send the updated data to the server for processing
    const response = await fetch(`/update/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedData),
    });
 
    // Check if the response indicates an error
    if (!response.ok) {
      const errorMessage = await response.text();
      alert(`Error: ${errorMessage}`);
      return;
    }
 
    // Display a success message
    alert('Data updated successfully!');
 
    // Fetch and display stored data
    fetchAndDisplayData();
 
    // Show the display section and hide the form
    document.getElementById('studentForm').style.display = 'none';
    document.getElementById('displaySection').style.display = 'block';
 
    // Optionally, reset the form
    document.getElementById('studentForm').reset();
  } catch (error) {
    console.error('Error updating data:', error);
  }
}
 
 
// Function to handle delete button click
function deleteData(id) {
  const confirmDelete = confirm('Are you sure you want to delete this data?');
 
  if (confirmDelete) {
    fetch(`/delete/${id}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (!response.ok) {
          return response.text().then(error => Promise.reject(error));
        }
       
        // Fetch and display updated data after deletion
        fetchAndDisplayData();
      })
      .catch(error => console.error('Error deleting data:', error));
  }
}
 
// Function to fetch and display data
function fetchAndDisplayData() {
  fetch('/display')
    .then(response => response.json())
    .then(storedData => {
      // Assuming you have a function named displayStoredData to display the data
      displayStoredData(storedData);
     
    })
    .catch(error => console.error('Error fetching data:', error));
}
 