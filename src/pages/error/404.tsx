import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "react-vant";
import { ArrowLeft, HomeO } from "@react-vant/icons";
import styles from "./404.module.css";
import { useTitle } from "../../hooks";

const Error404: React.FC = () => {
  useTitle();
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className={styles.error404}>
      <div className={styles.errorContent}>
        <div className={styles.errorIcon}>🌱</div>
        <h1 className={styles.errorTitle}>404</h1>
        <h2 className={styles.errorSubtitle}>页面不见了</h2>
        <p className={styles.errorDesc}>
          看起来您要找的页面已经搬家了，或者被植物们藏起来了 🌿
        </p>

        <div className={styles.errorActions}>
          <Button
            type="primary"
            size="large"
            icon={<HomeO />}
            onClick={handleGoHome}
            className={styles.homeButton}
          >
            回到首页
          </Button>
          <Button
            size="large"
            icon={<ArrowLeft />}
            onClick={handleGoBack}
            className={styles.backButton}
          >
            返回上页
          </Button>
        </div>

        <div className={styles.errorTips}>
          <h3 className={styles.tipsTitle}>小贴士</h3>
          <ul className={styles.tipsList}>
            <li>检查网址是否正确</li>
            <li>尝试刷新页面</li>
            <li>回到首页重新开始</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Error404;
