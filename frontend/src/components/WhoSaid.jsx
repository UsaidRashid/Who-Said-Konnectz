import React, { useState, useEffect } from "react";
import axios from "axios";

export default function WhoSaid() {
  const [saying, setSaying] = useState("");
  const [sayings, setSayings] = useState([]);

  useEffect(() => {
    axios
      .post("http://localhost:3002/who-said/fetch")
      .then((response) => {
        setSayings(response.data.sayings);
      })
      .catch((error) => {
        console.error("There was an error fetching the sayings!", error);
      });
  }, []);

  const saveSaying = () => {
    if (saying.trim()) {
      axios
        .post("http://localhost:3002/who-said/save", { said: saying })
        .then((response) => {
          setSayings((prevSayings) => {
            const updatedSayings = Array.isArray(prevSayings)
              ? [...prevSayings, response.data.saying]
              : [response.data.saying];
            return updatedSayings;
          });
          setSaying("");
        })
        .catch((error) => {
          console.error("There was an error saving the saying!", error);
        });
    }
  };

  return (
    <div className="container mx-auto my-48 p-4 border border-emerald-500 rounded-lg shadow-lg bg-white">
      <h2 className="text-2xl font-bold text-emerald-600 mb-4">Who Said</h2>

      <div className="mb-4">
        <div className="bg-emerald-100 p-4 rounded-lg h-64 overflow-y-scroll">
          {sayings &&
            sayings.map((saying, index) => (
              <div key={index} className="p-2 mb-2 rounded-lg bg-emerald-200">
                <p className="text-emerald-800">{saying?.said}</p>
              </div>
            ))}
        </div>
      </div>

      <div className="mb-4 flex">
        <input
          type="text"
          value={saying}
          onChange={(e) => setSaying(e.target.value)}
          placeholder="What do you want to say?"
          className="form-control border-emerald-300 rounded-lg shadow-sm"
        />
        <button
          onClick={saveSaying}
          className="btn btn-emerald-600 text-white ms-2 bg-black"
        >
          Post
        </button>
      </div>
    </div>
  );
}
