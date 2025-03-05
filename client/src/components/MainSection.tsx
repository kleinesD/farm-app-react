import React, { useEffect } from "react";
import AnimalHeader from "./inputComponents/AnimalHeader";
import RightClickMenu from "./RIghtClickMenu";

interface MainSectionProps {
  children: React.ReactNode,
  block: string,
  animal?: any
}

const MainSection: React.FC<MainSectionProps> = ({ children, block, animal }) => {


  return (
    <React.Fragment>
      <RightClickMenu block={block}/>

      <section className={`main-section ${block ? `${block}-module` : ''}`.trim()}>
        {animal && <AnimalHeader animal={animal} />}
        {children}
      </section>
    </React.Fragment>
  )
}

export default MainSection;