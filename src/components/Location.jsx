 import React, {useEffect, useRef, useState} from 'react'
import { Search, GpsFixed } from "@material-ui/icons"
import styles from "./../styles/location.css"


const apiKey = 'AIzaSyA9WeezfSNHFGp7Wg_uGCGQMTy4coxbuZM'

const mapApiJs = 'https://maps.googleapis.com/maps/api/js';
const geocodeJson = 'https://maps.googleapis.com/maps/api/geocode/json';


// load google map api js

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


function Location() {

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


  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        reverseGeocode(position.coords)
      })
    }
  }

  useEffect(() => {
    initMapScript().then(() => initAutocomplete())
  }, []);



  return (
    <div className="App">
      <div>
        <div className="search">
          <span><Search /></span>
          <input ref={searchInput} type="text" placeholder="Search location...."/>
          <button onClick={getCurrentLocation}><GpsFixed /></button>
        </div>

      </div>
    </div>
  )
}

export default Location