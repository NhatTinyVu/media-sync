import React, { useState, useCallback, useEffect } from "react";
import axios from "axios";
import { Modal, Input, Button } from "antd";

const Register = ({ socketID, setHost, onComplete }) => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleOk = useCallback(async () => {
    if (!name) return;

    setLoading(true);
    const resp = await axios.post("/api/register", {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [socketID]: { name } }),
    });
    setLoading(false);

    if (resp) console.log(resp);
    onComplete();
  }, [socketID, name]);

  useEffect(() => {
    const getHost = async () => {
      setLoading(true);
      const resp = await axios.get("/api/host", {
        headers: { "Content-Type": "application/json" },
      });
      setLoading(false);

      if (resp) console.log(resp);

      if (resp?.data) setHost(resp.data);
    };

    const checkUser = async () => {
      setLoading(true);
      const resp = await axios.get("/api/users", {
        headers: { "Content-Type": "application/json" },
      });
      setLoading(false);

      if (resp) console.log(resp);

      if (resp?.data[socketID]?.name) setName(resp.data[socketID].name);
    };

    if (socketID) checkUser();
    getHost();
  }, [socketID]);

  return (
    <Modal
      width={420}
      centered
      visible
      closable={false}
      footer={null}
      title="Để tham gia vui lòng nhập tên bạn nhé"
      onOk={handleOk}
    >
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Cho xin cái tên nào"
        onPressEnter={handleOk}
        autoFocus
      />
      <div style={{ textAlign: "center", marginTop: 24 }}>
        <Button
          loading={loading}
          type="primary"
          onClick={handleOk}
          disabled={!name}
        >
          Đăng nhập
        </Button>
      </div>
    </Modal>
  );
};

export default Register;
