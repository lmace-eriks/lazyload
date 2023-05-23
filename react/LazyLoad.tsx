import React, { useEffect, useState, ReactChildren, useRef } from "react";

import styles from "./styles.css";

interface LazyLoadProps {
  loadingMessage: string
  loadingAnimation: string
  fadeIn: boolean
  buttonText: string
  boundingBox: string
  threshold: number
  height: string
  blockClass: string
  children: ReactChildren
}

const LazyLoad: StorefrontFunctionComponent<LazyLoadProps> = ({ loadingMessage, loadingAnimation, fadeIn, buttonText, boundingBox, threshold, height, blockClass, children }) => {
  const [showChildren, setShowChildren] = useState(false);
  const targetElement = useRef<any>();

  // Create / Destroy Intersection Observer
  useEffect(() => {
    if (showChildren || buttonText) return;

    const observer: IntersectionObserver = new IntersectionObserver(entries => {
      const entry: IntersectionObserverEntry = entries[0];
      if (entry.isIntersecting) {
        setShowChildren(true);
        observer.unobserve(targetElement.current);
      }
    }, { threshold: parseThreshold(), rootMargin: boundingBox || `0px` });

    observer.observe(targetElement.current);

    return () => {
      if (targetElement.current) observer.unobserve(targetElement.current);
    }
  });

  const parseThreshold = () => {
    if (!threshold) return 1;
    if (threshold > 100 || threshold < 0) return 1;
    // Convert whole number percent to 0.0 - 1.0 - LM
    return threshold * 0.01;
  }

  const TriggerDiv = () => (
    <div ref={targetElement} className={`${styles.container}--${blockClass}`} style={{ height: height, display: showChildren ? `none` : `block` }}>
      {buttonText && <ClickToLoad />}
      {loadingMessage && !buttonText && <ScrollToLoad />}
    </div>
  )

  const ClickToLoad = () => (
    <button onClick={() => setShowChildren(true)} className={`${styles.button}--${blockClass}`}>{buttonText}</button>
  )

  const ScrollToLoad = () => (
    <div className={`${styles.loadingContainer}--${blockClass}`}>
      <span className={`${styles.loadingMessage}--${blockClass}`}>{loadingMessage}</span>
      {loadingAnimation === "spinner" && <SpinnerAnim />}
      {loadingAnimation === "bouncing-arrow" && <BouncingArrowAnim />}
    </div>
  )

  const SpinnerAnim = () => (
    <svg className={styles.spinner} viewBox="0 0 50 50">
      <circle className={styles.path} cx="25" cy="25" r="20" fill="none" strokeWidth="5"></circle>
    </svg>
  )

  const BouncingArrowAnim = () => (
    <div className={styles.bounce}>▼</div>
  )

  const FadeIn = () => (
    <div className={`${styles.fadeIn}--${blockClass}`}>
      {children}
    </div>
  )

  return (<>
    <TriggerDiv />
    {showChildren ? fadeIn ? <FadeIn /> : <>{children}</> : <></>}
  </>)

}

LazyLoad.schema = {
  title: "Lazy Load",
  type: "object",
  properties: {
    loadingMessage: {
      title: "Loading Message",
      description: "Optional | Scroll loading only. Will not display if Button Text is filled out. Text to display before children content has been requested. Example: Keep Scrolling To Load Content...",
      type: "string"
    },
    loadingAnimation: {
      title: "Loading Animation",
      type: "string",
      default: "none",
      enum: ["none", "bouncing-arrow", "spinner"]
    },
    buttonText: {
      title: "Button Text",
      description: "Optional | Click loading only. Takes priority over Loading Message. Text to display in button for click loading. Example: Click Here To See Reviews",
      type: "string"
    },
    boundingBox: {
      title: "Bounding Box",
      description: "Optional | Viewport Dimentions. Leave blank if full viewport is the desired 'Trigger Area'. Follows rootMargin format for Javascript's Intersection Observer. Example: 0px 0px -200px 0px",
      type: "string"
    },
    threshold: {
      title: "Percent Intersecting to Trigger",
      description: "Optional | Number from 0 to 100. Defaults to 100 if blank. Example: 66",
      type: "number"
    },
    height: {
      title: "Height",
      description: "Optional | Approximate height of fully loaded children. Example: 10rem",
      type: "string"
    }
  }
}

export default LazyLoad;