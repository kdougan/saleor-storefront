import React, { useEffect, useRef } from "react";

import * as S from "./styles";
import { IProps } from "./types";

const AdyenPaymentGateway: React.FC<IProps> = ({ config }: IProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const originKey = config.find(({ field }) => field === "origin_key")?.value;
  const adyenConfig = config.find(({ field }) => field === "config")?.value;
  const parsedAdyenConfig = adyenConfig && JSON.parse(adyenConfig);
  console.log(config, originKey, parsedAdyenConfig);

  useEffect(() => {
    if (originKey && parsedAdyenConfig) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href =
        "https://checkoutshopper-test.adyen.com/checkoutshopper/sdk/3.9.5/adyen.css";
      document.body.appendChild(link);

      const script = document.createElement("script");
      script.src =
        "https://checkoutshopper-test.adyen.com/checkoutshopper/sdk/3.9.5/adyen.js";
      script.async = true;
      script.onload = initAdyenCheckout; // Wait until the script is loaded before initiating AdyenCheckout
      document.body.appendChild(script);
    }
  }, [originKey, parsedAdyenConfig]);

  // TODO: Replace configuratio with the configuration returned by Saleor backend API, when SDK will handle it.
  const initAdyenCheckout = () => {
    const configuration = {
      locale: "en_US",
      environment: "test",
      originKey,
      paymentMethodsResponse: {
        paymentMethods: parsedAdyenConfig,
      },
      amount: {
        value: 1000,
        currency: "EUR",
      },
    };

    // TODO: Remove following comments appropriately.
    // You can add AdyenCheckout to your list of globals and then delete the window reference:
    // const checkout = new AdyenCheckout(configuration);
    const checkout = new window.AdyenCheckout(configuration);
    // If you need to refer to the dropin externaly, you can save this inside a variable:
    // const dropin = checkout.create...
    checkout
      .create("dropin", {
        onSubmit: (state, dropin) => {
          dropin.setStatus("loading");
          console.log(dropin);
          // makePaymentCall(state.data).then...
        },
        onAdditionalDetails: (state, dropin) => {
          // makeDetailsCall(state.data).then...
        },
      })
      .mount(ref.current);
  };

  // const dropInComponent = useMemo(() => <div ref={ref} />, []);

  return (
    <S.Wrapper>
      AdyenPaymentGateway
      <div ref={ref} />
    </S.Wrapper>
  );
};

export { AdyenPaymentGateway };
