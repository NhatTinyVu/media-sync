import React, { useState, useCallback, useEffect } from "react";
import { Input, Tag } from "antd";
import axios from "axios";

const { Search } = Input;

const containerStyle = {
  margin: "0 16px",
  padding: "16px 16px 24px",
  maxWidth: 500,
  borderRadius: 2,
  background: `rgba(255, 255, 255, 0.65)`,
};

const titleStyle = {
  color: "#3e91f7",
  fontSize: 14,
  marginBottom: 4,
  fontWeight: "bold",
};

const tagStyle = {
  padding: 8,
  fontWeight: "bold",
};

const ExcerciseProgram = ({ program = [] }) => {
  const [listProgram, setListProgram] = useState([]);
  const [programName, setProgramName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddProgram = useCallback(async () => {
    if (!programName) return;

    setLoading(true);
    const resp = await axios.post("/api/program", {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: programName }),
    });
    setLoading(false);
    setProgramName("");

    if (resp) console.log(resp);
  }, [programName]);

  const handleDeleteProgram = useCallback(async (name) => {
    if (!name) return;

    const resp = await axios.put("/api/program", {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    if (resp) console.log(resp);
  }, []);

  useEffect(() => {
    const getProgram = async () => {
      const resp = await axios.get("/api/program", {
        headers: { "Content-Type": "application/json" },
      });

      if (resp) console.log(resp);

      if (resp?.data) setListProgram(resp?.data);
    };

    getProgram();
  }, []);

  useEffect(() => {
    if (program) setListProgram(program);
  }, [program]);

  return (
    <div style={containerStyle}>
      <div style={titleStyle}>Bạn muốn tập môn gì?</div>
      <Search
        value={programName}
        onChange={(e) =>
          setProgramName(e.target.value.replace(/ /g, "").toUpperCase())
        }
        placeholder="Ví dụ: BODYJAM74"
        loading={loading}
        enterButton="Thêm"
        onSearch={handleAddProgram}
      />
      {listProgram?.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <div style={titleStyle}>Các môn sẽ tập</div>
          {listProgram.map((program) => (
            <Tag
              key={program}
              closable
              style={tagStyle}
              color="#3e91f7"
              onClose={() => handleDeleteProgram(program)}
            >
              {program}
            </Tag>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExcerciseProgram;
