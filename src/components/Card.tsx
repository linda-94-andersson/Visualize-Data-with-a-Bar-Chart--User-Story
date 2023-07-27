import { useState, useEffect } from "react";
import axios from "axios";
import DataSvg from "./DataSvg";

interface GDPData {
  code: string;
  column_names: string[];
  data: [string, number][]; // An array of tuples, where the first element is a string (DATE) and the second element is a number (VALUE)
  description: string;
  display_url: string;
  errors: object; // The type of 'errors' is not clearly specified in the provided data, so we use 'object' for now.
  frequency: string;
  from_date: string;
  id: number;
  name: string;
  premium: boolean;
  private: boolean;
  source_code: string;
  source_name: string;
  to_date: string;
  type: null | unknown; // 'type' can be null or an unknown type (since its type is not specified in the data).
  updated_at: string;
  urlize_name: string;
}

const Card = () => {
  const [data, setData] = useState<GDPData | null>(null); 
  const url =
    "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";

  const getData = async () => {
    const { data } = await axios.get<GDPData>(url);
    console.log(data);
    setData(data);
  };

  useEffect(() => {
    getData();
  }, []);

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div id="card">
      <h1 id="title">United States GDP</h1>
      <DataSvg data={data.data} />
    </div>
  );
};

export default Card;
