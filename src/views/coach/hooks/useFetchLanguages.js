import { useState, useEffect } from "react";
import { fetchLanguages } from "../services/api";


export const useFetchLanguages = () => {
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchLanguages()
      .then((res) => {
        setLanguages(res.languages);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return { languages, loading };
};
