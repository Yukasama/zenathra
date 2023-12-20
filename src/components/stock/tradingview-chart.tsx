"use client";

import { useState, useEffect, useRef } from "react";

function TradingViewWidget() {
  const container = useRef(null);
  const [isScriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    if (!isScriptLoaded) {
      const script = document.createElement("script");
      script.src =
        "https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js";
      script.type = "text/javascript";
      script.async = true;
      script.innerHTML = JSON.stringify({
        symbols: [
          ["Apple", "AAPL|1D"],
          ["Google", "GOOGL|1D"],
          ["Microsoft", "MSFT|1D"],
        ],
        // ... other script options
      });

      document.body.appendChild(script);

      script.onload = () => {
        setScriptLoaded(true);
      };

      container.current.appendChild(script);
    }
  }, [isScriptLoaded]);

  if (!isScriptLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="tradingview-widget-container" ref={container}>
      <div className="tradingview-widget-container__widget"></div>
      <div className="tradingview-widget-copyright">
        <a
          href="https://www.tradingview.com/"
          rel="noopener nofollow"
          target="_blank">
          <span className="blue-text">Track all markets on TradingView</span>
        </a>
      </div>
    </div>
  );
}

export default TradingViewWidget;
