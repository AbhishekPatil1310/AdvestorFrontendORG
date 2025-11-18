import React, { useState, useEffect } from "react";

const ANIMATION_DURATION = 350; // ms

const LocationPermissionPopup = ({ onClose, onLocationFetched }) => {
  const [locationData, setLocationData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleClose = () => {
    setShow(false);
    setTimeout(onClose, ANIMATION_DURATION);
  };

  const fetchLocation = () => {
    if (!("geolocation" in navigator)) {
      setError("Your browser does not support geolocation.");
      return;
    }

    setLoading(true);
    setError("");
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
          );

          const data = await response.json();
          const { road, city, state, postcode, country } = data.address;

          const parsedLocation = {
            latitude,
            longitude,
            address: {
              road: road || "N/A",
              city: city || "N/A",
              state: state || "N/A",
              postcode: postcode || "N/A",
              country: country || "N/A",
              fullAddress: data.display_name,
            },
          };

          setLocationData(parsedLocation);

          // Send location to parent
          if (onLocationFetched) {
            onLocationFetched(parsedLocation.address);
          }
        } catch (error) {
          setError("Failed to retrieve address information.");
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        setError(`Location access denied. (${err.message})`);
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <>
      <div
        style={{
          ...styles.overlay,
          animation: `${show ? "overlay-fade-in" : "overlay-fade-out"} ${ANIMATION_DURATION}ms ease`,
        }}
      >
        <div
          style={{
            ...styles.popup,
            animation: `${show ? "popup-fade-in" : "popup-fade-out"} ${ANIMATION_DURATION}ms cubic-bezier(0.38, 0.96, 0.58, 1.06)`,
          }}
        >
          <button
            onClick={handleClose}
            style={styles.closeButton}
            aria-label="Close"
          >
            &times;
          </button>

          <h2 style={styles.heading}>We'd Like to Know Your Location</h2>
          <p style={styles.subtext}>
            To show you the most relevant ads based on your area,
            we need access to your location. Please allow access below.
          </p>

          {error && (
            <p style={{ color: "#D43829", marginBottom: 16, fontWeight: 500 }}>
              {error}
            </p>
          )}

          {!locationData ? (
            <button
              onClick={fetchLocation}
              disabled={loading}
              style={{
                ...styles.actionButton,
                opacity: loading ? 0.7 : 1,
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Fetching Location..." : "Allow Location Access"}
            </button>
          ) : (
            <div style={styles.resultBox}>
              <p>
                <strong>Location Saved:</strong> {locationData.address.fullAddress}
              </p>
              <button
                onClick={handleClose}
                style={{ ...styles.secondaryButton, marginTop: 10 }}
              >
                Continue
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background: "rgba(23, 28, 39, 0.42)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
    backdropFilter: "blur(1.2px)",
  },
  popup: {
    background: "#fff",
    padding: "1.2rem",
    width: "90vw",
    maxWidth: "340px",
    borderRadius: "14px",
    textAlign: "center",
    position: "relative",
    boxShadow: "0px 4px 16px rgba(0,0,0,0.1)",
  },
  closeButton: {
    position: "absolute",
    top: 12,
    right: 12,
    fontSize: "1.4rem",
    color: "#888",
    background: "none",
    border: "none",
    cursor: "pointer",
  },
  heading: {
    marginBottom: 6,
    fontSize: "1.2rem",
    fontWeight: 600,
  },
  subtext: {
    fontSize: "0.95rem",
    color: "#555",
    marginBottom: "1rem",
  },
  actionButton: {
    background: "#4F46E5",
    color: "#fff",
    padding: "0.6rem 1.3rem",
    fontSize: "0.95rem",
    borderRadius: "8px",
    border: "none",
    fontWeight: 500,
  },
  secondaryButton: {
    background: "#f1f5f9",
    padding: "0.5rem 1.1rem",
    borderRadius: "8px",
    border: "none",
  },
  resultBox: {
    marginTop: "1rem",
    fontSize: "0.9rem",
    color: "#444",
  },
};

export default LocationPermissionPopup;
