import React, { useEffect, useRef, useState, ReactChildren } from "react";
// import { createPortal } from "react-dom";
// import { canUseDOM } from "vtex.render-runtime";

import styles from "./styles.css";

interface LazyLoadProps {
  children: ReactChildren
}

const LazyLoad: StorefrontFunctionComponent<LazyLoadProps> = ({ }) => {
  const openGate = useRef(true);
  const [loading, setloading] = useState(true);

  return <div>Sup</div>;
}

LazyLoad.schema = {
  title: "Lazy Load",
  type: "object",
  properties: {

  }
}

export default LazyLoad;