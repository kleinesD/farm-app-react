import React, { useState, useEffect } from "react";
import moment from "moment";
import { QuestionMark, X } from "@phosphor-icons/react";
import useGetMilkQualityRecords from "../../../../../hooks/useGetMilkQuality";
import suggestions from './data/milkQualitySuggestions'
import MilkQualityGraph from "./components/MilkQualityGraph";

const MilkQuality: React.FC = () => {
  const [records, setRecords] = useState<any[]>([]);
  const [type, setType] = useState<string>('water');
  const [sugVis, setSugVis] = useState<boolean>(false);

  const { data, isLoading, isSuccess } = useGetMilkQualityRecords();

  useEffect(() => {
    if (isSuccess) {
      setRecords(data.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()))
    }
  }, [data, isSuccess]);

  const record = records[0];
  const sug = suggestions.find((item: any) => item.item === type);

  const changeType = (event: React.MouseEvent) => {
    const target = event.currentTarget as HTMLElement;

    if (!target) return;

    const value = target.getAttribute('data-value');

    if (!value) return;

    setType(value);
  }

  if(records.length === 0) return;

  return (
    <div className="milk-quality-graph-container">
      <div className="mp-block-outside-header">
        <div className="mp-block-outside-header-title">Качество молока</div>
      </div>

      <div className="milk-quality-graph-outter">
        <div className="milk-quality-graph">
          <MilkQualityGraph records={records} type={type} />
        </div>
        <div className="mqg-info-btn" onClick={() => setSugVis(!sugVis)}>
          {!sugVis
            ?
            <QuestionMark size={20} color="#0a0a0a" weight="bold" />
            :
            <X size={20} color="#0a0a0a" weight="bold" />
          }
        </div>

        {(sug && sugVis) &&
          <div className="mqg-info-block">
            <div className="mqg-info-title">{sug.name}</div>
            <div className="mqg-info-text">{sug.text}</div>
          </div>
        }
      </div>

      {record &&
        <div className="milk-quality-info-block">

          <div className={`milk-quality-info-item ${type === 'water' ? 'milk-quality-info-item-active' : ''}`} data-value='water' onClick={changeType}>
            <div className="milk-quality-info-title">Вода</div>
            <div className="milk-quality-info-res">{record.water ? `${record.water}%` : '-'}</div>
          </div>

          <div className={`milk-quality-info-item ${type === 'fat' ? 'milk-quality-info-item-active' : ''}`} data-value='fat' onClick={changeType}>
            <div className="milk-quality-info-title">Жиры</div>
            <div className="milk-quality-info-res">{record.fat ? `${record.fat}%` : '-'}</div>
          </div>

          <div className={`milk-quality-info-item ${type === 'dryResidue' ? 'milk-quality-info-item-active' : ''}`} data-value='dryResidue' onClick={changeType}>
            <div className="milk-quality-info-title">Сухой остаток</div>
            <div className="milk-quality-info-res">{record.dryResidue ? `${record.dryResidue}%` : '-'}</div>
          </div>

          <div className={`milk-quality-info-item ${type === 'casein' ? 'milk-quality-info-item-active' : ''}`} data-value='casein' onClick={changeType}>
            <div className="milk-quality-info-title">Казеин</div>
            <div className="milk-quality-info-res">{record.casein ? `${record.casein}%` : '-'}</div>
          </div>

          <div className={`milk-quality-info-item ${type === 'sugar' ? 'milk-quality-info-item-active' : ''}`} data-value='sugar' onClick={changeType}>
            <div className="milk-quality-info-title">Сахар</div>
            <div className="milk-quality-info-res">{record.sugar ? `${record.sugar}%` : '-'}</div>
          </div>

          <div className={`milk-quality-info-item ${type === 'phosphatides' ? 'milk-quality-info-item-active' : ''}`} data-value='phosphatides' onClick={changeType}>
            <div className="milk-quality-info-title">Фосфатиды</div>
            <div className="milk-quality-info-res">{record.phosphatides ? `${record.phosphatides}%` : '-'}</div>
          </div>

          <div className={`milk-quality-info-item ${type === 'sterols' ? 'milk-quality-info-item-active' : ''}`} data-value='sterols' onClick={changeType}>
            <div className="milk-quality-info-title">Стерины</div>
            <div className="milk-quality-info-res">{record.sterols ? `${record.sterols}%` : '-'}</div>
          </div>

          <div className={`milk-quality-info-item ${type === 'albumen' ? 'milk-quality-info-item-active' : ''}`} data-value='albumen' onClick={changeType}>
            <div className="milk-quality-info-title">Альбумин</div>
            <div className="milk-quality-info-res">{record.albumen ? `${record.albumen}%` : '-'}</div>
          </div>

          <div className={`milk-quality-info-item ${type === 'otherProteins' ? 'milk-quality-info-item-active' : ''}`} data-value='otherProteins' onClick={changeType}>
            <div className="milk-quality-info-title">Другие белки</div>
            <div className="milk-quality-info-res">{record.otherProteins ? `${record.otherProteins}%` : '-'}</div>
          </div>

          <div className={`milk-quality-info-item ${type === 'nonProteinCompounds' ? 'milk-quality-info-item-active' : ''}`} data-value='nonProteinCompounds' onClick={changeType}>
            <div className="milk-quality-info-title">Небелковые соединения</div>
            <div className="milk-quality-info-res">{record.nonProteinCompounds ? `${record.nonProteinCompounds}%` : '-'}</div>
          </div>

          <div className={`milk-quality-info-item ${type === 'saltsOfInorganicAcids' ? 'milk-quality-info-item-active' : ''}`} data-value='saltsOfInorganicAcids' onClick={changeType}>
            <div className="milk-quality-info-title">Соли неорган. кислот</div>
            <div className="milk-quality-info-res">{record.saltsOfInorganicAcids ? `${record.saltsOfInorganicAcids}%` : '-'}</div>
          </div>

          <div className={`milk-quality-info-item ${type === 'ash' ? 'milk-quality-info-item-active' : ''}`} data-value='ash' onClick={changeType}>
            <div className="milk-quality-info-title">Зола</div>
            <div className="milk-quality-info-res">{record.ash ? `${record.ash}%` : '-'}</div>
          </div>

          <div className={`milk-quality-info-item ${type === 'pigments' ? 'milk-quality-info-item-active' : ''}`} data-value='pigments' onClick={changeType}>
            <div className="milk-quality-info-title">Пигменты</div>
            <div className="milk-quality-info-res">{record.pigments ? `${record.pigments}%` : '-'}</div>
          </div>

        </div>
      }

    </div>
  )
};

export default MilkQuality;