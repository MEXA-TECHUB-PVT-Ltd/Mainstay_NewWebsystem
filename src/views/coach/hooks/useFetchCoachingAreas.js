import { useState, useEffect } from "react";
import { fetchCoachingAreas } from "../services/api";

export const useFetchCoachingAreas = () => {
  const [coachingAreas, setCoachingAreas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    fetchCoachingAreas()
      .then((res) => {
        setCoachingAreas(res.result);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, []);

  return { coachingAreas, loading, error };
};
