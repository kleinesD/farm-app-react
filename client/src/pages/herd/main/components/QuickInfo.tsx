import React, { useEffect, useState } from "react";

interface QuickInfoProps {
  categories: any
}

const QuickInfo: React.FC<QuickInfoProps> = ({categories}) => {
  const [counter, setCounter] = useState<number>(1);


  useEffect(() => {
    const interval = setInterval(() => {
      setCounter((prevCounter: number) => prevCounter === 6 ? 1 : prevCounter + 1);
    }, 5000);

    return () => clearInterval(interval);
  }, [])


  return (
    <div className="herd-mp-quick-info-block" data-rcm-text="Список животных" data-rcm-link="/herd/animals/list/?filter=all">
      <div className="herd-mp-quick-info-counter-block">
        <div className={`herd-mp-quick-info-counter ${counter === 1 ? 'herd-mp-quick-info-counter-active' : ''}`}></div>
        <div className={`herd-mp-quick-info-counter ${counter === 2 ? 'herd-mp-quick-info-counter-active' : ''}`}></div>
        <div className={`herd-mp-quick-info-counter ${counter === 3 ? 'herd-mp-quick-info-counter-active' : ''}`}></div>
        <div className={`herd-mp-quick-info-counter ${counter === 4 ? 'herd-mp-quick-info-counter-active' : ''}`}></div>
        <div className={`herd-mp-quick-info-counter ${counter === 5 ? 'herd-mp-quick-info-counter-active' : ''}`}></div>
        <div className={`herd-mp-quick-info-counter ${counter === 6 ? 'herd-mp-quick-info-counter-active' : ''}`}></div>
      </div>

      {counter === 1 &&
        <div className="herd-mp-quick-info-item">
          <img className="herd-mp-quick-info-item-img" src={`${process.env.PUBLIC_URL}/img/icons/herd-animal.png`}/>
          <div className="herd-mp-quick-info-item-img-shadow"/>
          <div className="herd-mp-quick-info-item-title">ЖИВОТНЫЕ</div>
          <div className="herd-mp-quick-info-item-res">{categories.all.length}</div>
        </div>
      }
      {counter === 2 &&
        <div className="herd-mp-quick-info-item">
          <img className="herd-mp-quick-info-item-img" src={`${process.env.PUBLIC_URL}/img/icons/herd-cow.png`}/>
          <div className="herd-mp-quick-info-item-img-shadow"/>
          <div className="herd-mp-quick-info-item-title">КОРОВЫ</div>
          <div className="herd-mp-quick-info-item-res">{categories.cows.length}</div>
        </div>
      }
      {counter === 3 &&
        <div className="herd-mp-quick-info-item">
          <img className="herd-mp-quick-info-item-img" src={`${process.env.PUBLIC_URL}/img/icons/herd-bull.png`}/>
          <div className="herd-mp-quick-info-item-img-shadow"/>
          <div className="herd-mp-quick-info-item-title">БЫКИ</div>
          <div className="herd-mp-quick-info-item-res">{categories.bulls.length}</div>
        </div>
      }
      {counter === 4 &&
        <div className="herd-mp-quick-info-item">
          <img className="herd-mp-quick-info-item-img" src={`${process.env.PUBLIC_URL}/img/icons/herd-milking-cow.png`}/>
          <div className="herd-mp-quick-info-item-img-shadow"/>
          <div className="herd-mp-quick-info-item-title">ДОЯЩИЕСЯ КОРОВЫ</div>
          <div className="herd-mp-quick-info-item-res">{categories.milkingCows.length}</div>
        </div>
      }
      {counter === 5 &&
        <div className="herd-mp-quick-info-item">
          <img className="herd-mp-quick-info-item-img" src={`${process.env.PUBLIC_URL}/img/icons/herd-ready-bull.png`}/>
          <div className="herd-mp-quick-info-item-img-shadow"/>
          <div className="herd-mp-quick-info-item-title">ЖИВОТНЫЕ НА ЗАБОЙ</div>
          <div className="herd-mp-quick-info-item-res">{categories.butcherAnimals.length}</div>
        </div>
      }
      {counter === 6 &&
        <div className="herd-mp-quick-info-item">
          <img className="herd-mp-quick-info-item-img" src={`${process.env.PUBLIC_URL}/img/icons/herd-calf-alone.png`}/>
          <div className="herd-mp-quick-info-item-img-shadow"/>
          <div className="herd-mp-quick-info-item-title">НЕТЕЛИ</div>
          <div className="herd-mp-quick-info-item-res">{categories.heifers.length}</div>
        </div>
      }
    </div>
  )
}

export default QuickInfo;