import React from 'react';
import InputDetailsOfThePerson from './InputDetailsOfThePerson';
import ListOfPersonsInContact from './ListOfPersonsInContact';
import styles from "./../styles/homePage.css"

function HomePage(props) {
    return (
        <div className='home'>
           <InputDetailsOfThePerson/>
           <ListOfPersonsInContact/>
        </div>
    );
}

export default HomePage;