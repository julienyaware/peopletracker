import React from 'react';
import { useState, useEffect } from 'react'
import { collection, query, orderBy, onSnapshot } from "firebase/firestore"
import { db } from './../database/fireBase'
import PersonDetails from './PersonDetails';
import styles from "./../styles/listOfPersonsInContact.css"

function ListOfPersonsInContact(props) {
  // List of people user was in contact with
  const [listOfPeople, setListOfPeople] = useState([])
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredNames, setFilteredNames] = useState([])

  useEffect(() => {
    const q = query(collection(db, 'personsOfContact'), orderBy('created', 'desc'))
    onSnapshot(q, (querySnapshot) => {
      setListOfPeople(querySnapshot.docs.map(doc => ({
        id: doc.id,
        data: doc.data()
      })))
    })
  }, [])


//Filters list of names by name search
  const filterPeople = (e) => {
    const searchedWord = e.target.value;

    if (searchedWord !== '') {
      const results = listOfPeople.filter((person) => {
        return person.data.personName.toLowerCase().startsWith(searchTerm.toLowerCase());
      });
      setFilteredNames(results)
    } else {
      setFilteredNames(listOfPeople);
    }
    setSearchTerm(searchedWord)
  }
  return (
    <div className='fullList'>
      <label>Search By Name</label>

      <input type="search"
        value={searchTerm}
        onChange={filterPeople}
        className="input"
        placeholder="Search name"></input>

      {/* User can search a name but the default is the full list */}

      {filteredNames && filteredNames.length > 0 ? (
        filteredNames.map((person) => (
          <PersonDetails
            id={person.id}
            key={person.id}
            personName={person.data.personName}
            dateOfContact={person.data.dateOfContact}
            locationOfContact={person.data.locationOfContact}
          />
        ))
      ) : (
        listOfPeople.map((person) => (
          <PersonDetails
            id={person.id}
            key={person.id}
            personName={person.data.personName}
            dateOfContact={person.data.dateOfContact}
            locationOfContact={person.data.locationOfContact}
          />
        ))
      )}

    </div>
  );
}

export default ListOfPersonsInContact;