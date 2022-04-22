import React, { useEffect, useState,useRef } from 'react';
import {db} from './../database/fireBase'
import {collection, addDoc, Timestamp} from 'firebase/firestore'
import Location from './Location';
import styles from './../styles/inputDetailsOfThePerson.css'

const apiKey = 'AIzaSyA9WeezfSNHFGp7Wg_uGCGQMTy4coxbuZM'

const mapApiJs = 'https://maps.googleapis.com/maps/api/js';
const geocodeJson = 'https://maps.googleapis.com/maps/api/geocode/json';

function loadAsyncScript(src) {
    return new Promise(resolve => {
      const script = document.createElement("script");
      Object.assign(script, {
        type: "text/javascript",
        async: true,
        src
      })
      script.addEventListener("load", () => resolve(script));
      document.head.appendChild(script);
    })
  }
  
  const extractAddress = (place) => {
  
    const address = {
      city: "",
      state: "",
      zip: "",
      country: "",
      plain() {
        const city = this.city ? this.city + ", " : "";
        const zip = this.zip ? this.zip + ", " : "";
        const state = this.state ? this.state + ", " : "";
        return city + zip + state + this.country;
      }
    }
  
    if (!Array.isArray(place?.address_components)) {
      return address;
    }
  
    place.address_components.forEach(component => {
      const types = component.types;
      const value = component.long_name;
  
      if (types.includes("locality")) {
        address.city = value;
      }
  
      if (types.includes("administrative_area_level_2")) {
        address.state = value;
      }
  
      if (types.includes("postal_code")) {
        address.zip = value;
      }
  
      if (types.includes("country")) {
        address.country = value;
      }
  
    });
  
    return address;
  }
  


function InputDetailsOfThePesron(props) {

    const [currentLocation, setCurrentLocation] = useState()
    const [personName, setPersonName] = useState()
    const [dateOfContact, setDateOfContact] = useState()
    const [locationOfContact, setLocationOfContact] = useState()

    const searchInput = useRef(null);
  const [address, setAddress] = useState({});


  // init gmap script
  const initMapScript = () => {
    if(window.google) {
      return Promise.resolve();
    }
    const src = `${mapApiJs}?key=${apiKey}&libraries=places&v=weekly`;
    return loadAsyncScript(src);
  }

  const onChangeLocation = (autocomplete) => {
    const place = autocomplete.getPlace();
    setAddress(extractAddress(place));
  }

  //  autocomplete from places API 
  const initAutocomplete = () => {
    if (!searchInput.current) return;

    const autocomplete = new window.google.maps.places.Autocomplete(searchInput.current);
    autocomplete.setFields(["address_component", "geometry"]);
    autocomplete.addListener("place_changed", () => onChangeLocation(autocomplete));

  }


  const reverseGeocode = ({ latitude: lat, longitude: lng}) => {
    const url = `${geocodeJson}?key=${apiKey}&latlng=${lat},${lng}`;
    searchInput.current.value = "Loading current location...";
    fetch(url)
        .then(response => response.json())
        .then(location => {
          const place = location.results[0];
          const _address = extractAddress(place);
          setAddress(_address);
          searchInput.current.value = _address.plain();
        })
  }


  const getCurrentLocation = (e) => {
      e.preventDefault()
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        reverseGeocode(position.coords)
      })
    }
  }

  useEffect(() => {
    initMapScript().then(() => initAutocomplete())
  }, []);
  

    const handleSubmit = async (e) => {
        e.preventDefault()
        console.log(locationOfContact)
        try {
          await addDoc(collection(db, 'personsOfContact'), {
            personName: personName,
            dateOfContact: dateOfContact,
            locationOfContact: address.city,
            created: Timestamp.now()
          })
        } catch (err) {
            console.log('addresss is',address)
          alert(err)
        }
      }


    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name</label>
                    <input
                        name='name'
                        placeholder='Name'
                        value={personName}
                        onChange={(e) => setPersonName(e.target.value)} 
                    />
                    <label>Date</label>
                    <input
                        name='date'
                        type='date'
                        value={dateOfContact}
                        placeholder='Date'
                        onChange={(e) => setDateOfContact(e.target.value)} 
                    />
                    <label>Location</label>
                    <div className="searchLocation">
                    <input ref={searchInput}  
                        name='location'
                        type = "textArea"
                        placeholder="Search location...."
                        onChange={(e) => setLocationOfContact(e.target.value)} 
                    />
                     <button onClick={getCurrentLocation}>Use Current Location</button>
                     </div>
                </div>
                <button className='addButton' type='submit'>Add Person</button>
            </form>

        </div>
    );
}

export default InputDetailsOfThePesron;