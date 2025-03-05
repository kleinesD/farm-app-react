import React from "react";
import { TypeAnimation } from "react-type-animation";

interface LoaderProps {
  noLogo?: boolean
}

const Loader: React.FC<LoaderProps> = ({ noLogo }) => {


  return (
    <div className="loader-background">
      {!noLogo &&
        <img src={`${process.env.PUBLIC_URL}/img/logos/farmme-logo-6.png`} className="loader-logo"></img>
      }


      <TypeAnimation
        sequence={[
          "Farmme", 2000,
          "Загружаем данные...", 2000,
          "Скоро все будет готово!", 2000,
        ]}
        speed={30} // Typing speed (lower = slower, more realistic)
        deletionSpeed={50} // Deletion speed
        repeat={Infinity} // Loop forever
        style={{ fontSize: '32px', fontWeight: '700' }}
      />
    </div>
  )
}

export default Loader;