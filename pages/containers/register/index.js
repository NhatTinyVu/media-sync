import React, { useState, useCallback } from "react";
import axios from "axios";
import { Modal, Input } from "antd";

const Register = ({ socketID, onComplete }) => {
  const [name, setName] = useState("");

  const handleOk = useCallback(async () => {
    if (!name) return;

    const resp = await axios.post("/api/register", {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [socketID]: { name } }),
    });

    if (resp) console.log(resp);
    onComplete();
  }, [socketID, name]);

  return (
    <Modal title="Nhập tên bạn nhé" visible={true} onOk={handleOk}>
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Cho xin cái tên nào"
      />
    </Modal>
  );
};

export default Register;
