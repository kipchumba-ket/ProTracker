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
      .catch(error => console.log(error));
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
    <h1 className="text-4xl font-bold mb-3">{cohortData.id ? 'Update' : 'CREATE'} COHORT</h1>
    <form onSubmit={(e)=>{
      e.preventDefault()
      handleSubmit()}}>
      <div className="mb-4">
        <label htmlFor="name" className="block text-yellow-700 font-bold mb-2">
          Name:
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={cohortData.name}
          onChange={handleInputChange}
          className="w-full border border-yellow-400 rounded-lg px-3 py-2"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="start_date" className="block text-yellow-700 font-bold mb-2">
          Start Date:
        </label>
        <input
          type="date"
          id="start_date"
          name="start_date"
          value={cohortData.start_date}
          onChange={handleInputChange}
          className="w-full border border-yellow-400 rounded-lg px-3 py-2"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="end_date" className="block text-yellow-700 font-bold mb-2">
          End Date:
        </label>
        <input
          type="date"
          id="end_date"
          name="end_date"
          value={cohortData.end_date}
          onChange={handleInputChange}
          className="w-full border border-yellow-400 rounded-lg px-3 py-2"
        />
      </div>
      <button
        type="submit"
        className="bg-pink-900 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded"
      >
        {cohortData.id ? 'Update' : 'Create'} Cohort
      </button>
    </form>
    {cohortData.id && (
      <>
        <h2 className="text-xl font-bold my-4">Add Member</h2>
        <form onSubmit={handleMemberAdd}>
          <label htmlFor="members" className="block text-gray-700 font-bold mb-2">Select a Member:</label>
          <select
            id="members"
            name="members"
            onChange={(event) => setSelectedMember(event.target.value)}
            className="w-full border border-gray-400 rounded-lg px-3 py-2 mb-4"
          >
            <option value="">Select a Member</option>
            {members.map(member => (
              <option key={member.id} value={member.id}>{member.name}</option>
            ))}
          </select>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Add Member
          </button>
        </form>
        <h2 className="text-xl font-bold my-4">Current Members</h2>
        <ul>
          {cohortData.members.map(member => (
            <li key={member.id} className="mb-2">
              <span className="mr-2">{member.name}</span>
              <button
                onClick={() => handleMemberDismiss(member.id)}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Dismiss
              </button>
            </li>
          ))}
        </ul>
      </>
    )}
  </div>
  );
}
export default CohortForm;