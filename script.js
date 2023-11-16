document.addEventListener('DOMContentLoaded', async () => {
    const api = 'https://fsa-crud-2aa9294fe819.herokuapp.com/api/2308-acc-et-web-pt-b/events';
  
    const partiesList = document.getElementById('parties-list');
    const form = document.getElementById('new-party-form');
  
    //Function definition: 'getPartyHtml' is a function that takes a singel parameter
    //Using template literals to create multi-line HTML
    //<br> break line used to separate HTML
    const getPartyHtml = (party) => `
      <li id="party-${party.id}">
        Name: ${party.name} <br>
        Date: ${party.date} <br>
        Time: ${party.time} <br>
        Location: ${party.location} <br>
        Description: ${party.description} <br>
        <button onclick="deleteParty(${party.id})">Delete</button>
      </li>
    `;
  
    // Function to delete a party
    window.deleteParty = async (id) => {
      try {
        const response = await fetch(`${api}/${id}`, {
          method: 'DELETE'
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        document.getElementById(`party-${id}`).remove();
      } catch (error) {
        console.error('Error deleting party:', error);
      }
    };
  
    // Function to render all parties
    const renderParties = (parties) => {
      if (Array.isArray(parties)) {
        partiesList.innerHTML = parties.map(getPartyHtml).join('');
      } else {
        console.error('Expected an array for parties, but got:', parties);
      }
    };
  
    // Function to fetch all parties
    const fetchParties = async () => {
        try {
          const response = await fetch(api);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const jsonResponse = await response.json();
          const parties = jsonResponse.data
          console.log(parties);
          renderParties(parties)
         // if (jsonResponse.success && Array.isArray(jsonResponse.data)) {
           // renderParties(jsonResponse.data);
          //} else {
            //console.error('Expected an array for parties, but got:', jsonResponse);
          //}
        } catch (error) {
          console.error('Error fetching parties:', error);
        }
    }
  
    // Event listener for form submission
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const formData = new FormData(form);
      const newParty = Object.fromEntries(formData.entries()); 
      const isoDate = new Date(`${newParty.date}T${newParty.time}`).toISOString();
      newParty.date = isoDate;
      delete newParty.time 
      console.log(newParty);
      try {
        const response = await fetch(api, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          }, body: JSON.stringify(newParty)
        });
      
        if (!response.ok) {
          const errorBody = await response.text();
          throw new Error(`HTTP error! status: ${response.status}. Error body: ${errorBody}`);
        }
      
        await response.json();
        await fetchParties();
        form.reset();
      } catch (error) {
        console.error('Error adding new party:', error);
      }      
    });
    console.log(fetchParties);  
    fetchParties();
  });
  
  