const containerStyle = {
  margin: "0 16px",
  padding: "16px 16px 8px",
  maxWidth: 500,
  borderRadius: 2,
  background: `rgba(255, 255, 255, 0.65)`,
  marginBottom: 16,
};

const titleStyle = {
  color: "#3e91f7",
  fontSize: 14,
  marginBottom: 4,
  fontWeight: "bold",
};

const Announcement = () => (
  <div style={containerStyle}>
    <div style={titleStyle}>Một số thông tin</div>
    <p>
      Lịch tập của TINY, BODYJAM, 7h30PM từ T2-T6, cuối tuần sớm hơn,{" "}
      <a
        href="https://meet.google.com/gmz-ocpo-bgd"
        target="_blank"
        rel="noreferrer"
      >
        Link Google Meet
      </a>{" "}
      Code: <b>gmz-ocpo-bgd</b>
    </p>
    <p>
      Lịch tập của ANN, tập đủ môn, 6h30PM từ T2-T6{" "}
      <a
        href="https://meet.google.com/qje-mysj-zzk"
        target="_blank"
        rel="noreferrer"
      >
        Link Google Meet
      </a>{" "}
      Code: <b>qje-mysj-zzk</b>
    </p>
    <p>
      Link masterclass{" "}
      <a
        href="https://drive.google.com/drive/folders/1Z--6Ruef5Pm2aubf9jpY3Lu34eLpSunR?usp=sharing"
        target="_blank"
        rel="noreferrer"
      >
        Google Drive
      </a>
      <div>
        Lưu ý: Những phiên bản BODYJAM 75, 74, 73... trở về trước tải file có
        tiền tố &quot;<b>[Tai file nay tap chung]</b>&quot; để có thể play trên
        trình duyệt. Cám ơn
      </div>
    </p>
  </div>
);

export default Announcement;
