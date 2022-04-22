import React from 'react';
import styles from "./../styles/personDetails.css"

function PersonDetails({personName,dateOfContact,locationOfContact}) {
    return (
        <div className='personCard'>
        <h3>Name : {personName}</h3>
        <p>Date :{dateOfContact}</p>
        <span>location :{locationOfContact}</span>
        </div>
    );
}

export default PersonDetails;