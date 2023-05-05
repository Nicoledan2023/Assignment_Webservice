import React from "react";
import { useEffect, useState } from "react";
import ReactMapGL from "react-map-gl";
import { Marker, Popup } from "react-map-gl";
import { Room, Star } from "@material-ui/icons";
import "./App.css";
import axios from "axios";
import { format } from "timeago.js";
import Register from "./components/Register";
import Login from "./components/Login";
import { NavigationControl } from "react-map-gl";

export default function App() {
  const myStorage = window.localStorage;
  const [currentUser, setCurrentUser] = useState(null);
  const [pins, setPins] = useState([]);
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [newPlace, setNewPlace] = useState(null);
  const [title, setTitle] = useState(null);
  const [desc, setDesc] = useState(null);
  const [rating, setRating] = useState(0);
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const [viewport, setViewport] = useState({
    latitude: 45.42202542304392,
    longitude: -75.80049555024144,
    width: "100vw",
    height: "800px",
    zoom: 8,
  });

  //fetch data from back
  useEffect(() => {
    const getPins = async () => {
      try {
        const res = await axios.get("/pins");
        setPins(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getPins();
  }, []);

  const handleMarkerClick = (id, lat, long) => {
    setCurrentPlaceId(id);
    setViewport({ ...viewport, latitude: lat, longitude: long });
  };

  const handleAddClick = (e) => {
    const long = e.lngLat.lng;
    const lat = e.lngLat.lat;
    setNewPlace({
      long,
      lat,
    });
  };

  const handlelogout = () => {
    setCurrentUser(null);
    myStorage.removeItem("user");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPin = {
      username: currentUser,
      title,
      desc,
      rating,
      lat: newPlace.lat,
      long: newPlace.long,
    };

    try {
      const res = await axios.post("/pins", newPin);
      setPins([...pins, res.data]);
      setNewPlace(null);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="App">
      <div className="button-container">
        {currentUser ? (
          <button className="logout" onClick={handlelogout}>
            log out
          </button>
        ) : (
          <div>
            <button className="login" onClick={() => setShowLogin(true)}>
              login
            </button>
            <button className="register" onClick={() => setShowRegister(true)}>
              register
            </button>
          </div>
        )}
      </div>

      <ReactMapGL
        {...viewport}
        interactive={true}
        scrollZoom={true}
        dragPan={true}
        mapboxAccessToken={process.env.REACT_APP_MAPBOX}
        transitionDuration="200"
        mapStyle="mapbox://styles/mapbox/streets-v11"
        // onMove={(evt) => {
        //   if (evt.viewport && evt.viewport.zoom) {
        //     setViewport(evt.viewport);
        //   }
        // }}
        onMove={(evt) => setViewport(evt.viewport)}
        //onViewportChange={(viewport) => setViewport(viewport)}
        style={{
          position: "relative",
          width: "90vw",
          height: "90vh",
        }}
        onDblClick={handleAddClick}
      >
        {pins.map((p) => (
          <>
            <Marker
              latitude={p.lat}
              longitude={p.long}
              offsetLeft={-viewport?.zoom * 3.5}
              offsetTop={-viewport?.zoom * 7}
            >
              <Room
                style={{
                  //   fontSize: viewport.zoom * 7,
                  color: p.username === currentUser ? "tomato" : "slateblue",
                  cursor: "pointer",
                }}
                onClick={() => handleMarkerClick(p._id, p.lat, p.long)}
              />
            </Marker>

            {p._id === currentPlaceId && (
              <Popup
                longitude={p.long}
                latitude={p.lat}
                closeButton={true}
                closeOnClick={false}
                anchor="right"
                onClose={() => setCurrentPlaceId(null)}
              >
                <div className="card">
                  <label>Place</label>
                  <h4 className="place">{p.title}</h4>
                  <label>Review</label>
                  <p className="desc">{p.desc}</p>
                  <label>Rating</label>
                  <div className="stars">
                    {Array(p.rating).fill(<Star className="star" />)}
                  </div>
                  <label>Information</label>
                  <span className="username">
                    Created by <b>{p.username}</b>
                  </span>
                  <span className="date">{format(p.createdAt)}</span>
                </div>
              </Popup>
            )}
          </>
        ))}

        {newPlace && (
          <Popup
            longitude={newPlace.long}
            latitude={newPlace.lat}
            closeButton={true}
            closeOnClick={false}
            anchor="right"
            onClose={() => setNewPlace(null)}
          >
            <div>
              <form onSubmit={handleSubmit}>
                <label>Title</label>
                <input
                  placeholder="Enter a title"
                  onChange={(e) => setTitle(e.target.value)}
                />
                <label>Review</label>
                <textarea
                  placeholder="Say us something about this place."
                  onChange={(e) => setDesc(e.target.value)}
                />
                <label>Rating</label>
                <select onChange={(e) => setRating(e.target.value)}>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3" selected>
                    3
                  </option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
                <button className="submitButton" type="submit">
                  Add Pin
                </button>
              </form>
            </div>
          </Popup>
        )}

        {showRegister && <Register setShowRegister={setShowRegister} />}
        {showLogin && (
          <Login
            setShowLogin={setShowLogin}
            myStorage={myStorage}
            setCurrentUser={setCurrentUser}
          />
        )}
        <NavigationControl position="bottom-right" />
      </ReactMapGL>
    </div>
  );
}
