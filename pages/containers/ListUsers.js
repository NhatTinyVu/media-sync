import React, { useCallback, useMemo, useState } from "react";
import { Button, Modal } from "antd";
import axios from "axios";
import { omit } from "lodash";

import User from "../components/User";

const titleStyle = {
  color: "white",
  fontWeight: "bold",
  fontSize: 16,
  textShadow: `0px 0px 4px rgb(9,9,121)`,
  margin: "8px 0px 4px",
};

const backgroundStyle = {
  background: `rgba(255,255,255,0.75)`,
  padding: 16,
  borderRadius: 2,
};

const ListUsers = ({ users, host, socketID }) => {
  const [resetLoading, setResetLoading] = useState(false);
  const [hostLoading, setHostLoading] = useState(false);
  const [hostData, myData, othersData] = useMemo(
    () => [
      users ? users[host] : null,
      host !== socketID ? users && users[socketID] : null,
      omit(users, [host]),
    ],
    [users, host, socketID]
  );

  const handleReset = useCallback(() => {
    Modal.confirm({
      okText: "Đồng ý",
      cancelText: "Thôi",
      title: "Tất cả người tham gia sẽ thoát ra, bạn chắc chắn chứ?",
      onOk: async () => {
        window?.localStorage?.setItem("socketID", undefined);
        window?.localStorage?.clear();

        setResetLoading(true);
        const resp = await axios.post("/api/reset", {
          headers: { "Content-Type": "application/json" },
        });
        setResetLoading(false);

        if (resp) console.log(resp);
      },
    });
  }, []);

  const handleTakeHost = useCallback(async () => {
    setHostLoading(true);
    const resp = await axios.post("/api/takeHost", {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ host: socketID }),
    });
    setHostLoading(false);

    if (resp) console.log(resp);
  }, [socketID, host]);

  const handleResetHost = useCallback(async () => {
    setHostLoading(true);
    const resp = await axios.post("/api/takeHost", {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ host: "" }),
    });
    setHostLoading(false);

    if (resp) console.log(resp);
  }, [socketID, host]);

  const isHost = socketID === host;

  return (
    <div style={{ padding: 16 }}>
      <div style={backgroundStyle}>
        <div>
          <Button
            loading={hostLoading}
            type={isHost ? "dashed" : "primary"}
            onClick={isHost ? handleResetHost : handleTakeHost}
          >
            {isHost ? "Bỏ quyền host" : "Lấy quyền host"}
          </Button>{" "}
          <Button
            loading={resetLoading}
            type="primary"
            danger
            onClick={handleReset}
          >
            Xóa toàn bộ người tham gia
          </Button>
        </div>
        <div>
          <div style={titleStyle}>Bạn bè đang tập</div>
          <div style={{ display: "flex", gap: 4 }}>
            {hostData && <User name={hostData?.name} isHost />}
            {myData && <User name={myData?.name} active />}
            {othersData &&
              Object.entries(othersData).map(([key, value]) => (
                <User key={key} name={value?.name} />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListUsers;
