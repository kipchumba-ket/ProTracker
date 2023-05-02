import React, { useState, useEffect } from 'react';

function CohortForm({cohortData,setCohortData,handleSubmit,handleInputChange}) {

  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState('');

  useEffect(() => {
    // Fetch members for the dropdown
    fetch(`http://localhost:3000/cohort/cohort_members`, {
      headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
    })
      .then(response => response.json())
      .then(data => setMembers(data))
      .catch(error => {});
  },[]);

  // function handleInputChange(event) {
  //   const { name, value } = event.target;
  //   setCohortData({ ...cohortData, [name]: value });
  // }
  
  // function handleSubmit() {
  //   console.log(cohortData)
  //   fetch(`http://localhost:3000/cohorts/create_cohort`, {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       'Authorization': 'Bearer ' + localStorage.getItem('jwt')
  //     },
  //     body: JSON.stringify(cohortData)
  //   })
  //     .then(response => response.json())
  //     .then(data => console.log(data))
  //     .catch(error => console.error(error));
  // }
  
  function handleMemberAdd(event) {
    event.preventDefault();
    fetch(`http://localhost:3000/cohort/members`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      },
      body: JSON.stringify({ user_id: selectedMember })
    })
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.log(error));
  }
  
  function handleMemberDismiss(memberId) {
    fetch(`http://localhost:3000/members/${memberId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    })
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.log(error));
  }
//   function selected_cohort() {
//     return { id: 1 }; // replace this with your own implementation to get the selected cohort
//   }
  

  
  return (
    <div className="max-w-lg mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{cohortData.id ? 'Update' : 'Create'} Cohort</h1>
      <form onSubmit={(e)=>{
        e.preventDefault()
        handleSubmit()}}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 font-bold mb-2">
            Name:
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={cohortData.name}
            onChange={handleInputChange}
            className="w-full border border-gray-400 p-2 rounded-lg"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="start_date" className="block text-gray-700 font-bold mb-2">
            Start Date:
          </label>
          <input
            type="date"
            id="start_date"
            name="start_date"
            value={cohortData.start_date}
            onChange={handleInputChange}
            className="w-full border border-gray-400 p-2 rounded-lg"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="end_date" className="block text-gray-700 font-bold mb-2">
            End Date:
          </label>
          <input
            type="date"
            id="end_date"
            name="end_date"
            value={cohortData.end_date}
            onChange={handleInputChange}
            className="w-full border border-gray-400 p-2 rounded-lg"
          />
        </div>
        <button
          type="submit"
  >{cohortData.id ? 'Update' : 'Create'} Cohort</button>
      </form>
      {cohortData.id && (
        <>
          <h2>Add Member</h2>
          <form onSubmit={handleMemberAdd}>
            <label htmlFor="members">Select a Member:</label>
            <select id="members" name="members" onChange={(event) => setSelectedMember(event.target.value)}>
              <option value="">Select a Member</option>
              {members.map(member => (
                <option key={member.id} value={member.id}>{member.name}</option>
              ))}
            </select>
            <button type="submit">Add Member</button>
          </form>
          <h2>Current Members</h2>
          <ul>
            {cohortData.members.map(member => (
              <li key={member.id}>
                {member.name}
                <button onClick={() => handleMemberDismiss(member.id)}>Dismiss</button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default CohortForm;
