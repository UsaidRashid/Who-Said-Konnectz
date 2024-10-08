import React, { useState, useEffect } from "react";
import axios from "axios";
const api = import.meta.env.VITE_BACKEND_URL;

export default function WhoSaid() {
  const [saying, setSaying] = useState("");
  const [sayings, setSayings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingPost, setLoadingPost] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .post(api + "who-said/fetch")
      .then((response) => {
        setSayings(response.data.sayings);
      })
      .catch((error) => {
        console.error("There was an error fetching the sayings!", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const saveSaying = () => {
    if (saying.trim()) {
      setLoadingPost(true);
      axios
        .post(api + "who-said/save", { said: saying })
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
        })
        .finally(() => {
          setLoadingPost(false);
        });
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-emerald-50 py-12 px-6 my-32">
      {loading ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div
              className="text-2xl font-bold text-emerald-600 mb-16"
              style={{ animation: "glow 1.5s infinite alternate" }}
            >
              Fetching Latest Stories...
              <p>Hang up tight!</p>
            </div>
            <div className="relative flex justify-center items-center">
              <div
                className="absolute w-24 h-24 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"
                style={{ animationDuration: "1s" }}
              ></div>
            </div>
          </div>

          <style>{`
            @keyframes glow {
              from {
                text-shadow: 0 0 5px rgba(76, 175, 80, 0.5);
              }
              to {
                text-shadow: 0 0 20px rgba(76, 175, 80, 1);
              }
            }
          `}</style>
        </div>
      ) : (
        <>
          <div className="container mx-auto p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-emerald-700 mb-6 text-center">
              Who Said - Some Untold Stories & Quotes
            </h2>

            <div className="space-y-4">
              {sayings.length > 0 ? (
                sayings.map((saying, index) => (
                  <div
                    key={index}
                    className="p-4 bg-emerald-100 border border-emerald-300 rounded-lg shadow-md"
                  >
                    <p className="text-emerald-800">{saying?.said}</p>
                  </div>
                ))
              ) : (
                <p className="text-emerald-600">
                  No sayings yet. Be the first to post!
                </p>
              )}
            </div>
          </div>

          <div className="fixed bottom-0 left-0 w-full bg-emerald-600 p-4 shadow-lg">
            <div className="container mx-auto flex items-center space-x-4 mb-12">
              <input
                type="text"
                value={saying}
                onChange={(e) => setSaying(e.target.value)}
                placeholder="What do you want to say?"
                className="flex-grow p-3 border border-emerald-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                onClick={saveSaying}
                className="bg-white text-emerald-600 font-semibold px-6 py-2 rounded-lg shadow-md hover:bg-emerald-100 transition duration-200"
                disabled={loadingPost}
              >
                {loadingPost ? "Posting..." : "Post"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
