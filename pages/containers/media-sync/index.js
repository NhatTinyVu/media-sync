import MediaPlayer from "../../components/media-player";
import User from "../../components/user";
import styles from "../../../styles/Home.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <User name="Nhat Vu" />
      <MediaPlayer />
    </div>
  );
}
