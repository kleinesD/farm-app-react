import React, { useEffect, useState } from "react";
import moment from "moment";

interface ClassificationProps {
  animals: any[]
}

const Classification: React.FC<ClassificationProps> = ({ animals }) => {
  const [type, setType] = useState<string>('age');
  const [renderClass, setRenderClass] = useState<any[]>([]);

  const typeChange = (event: React.MouseEvent) => {
    const target = event.target as HTMLElement;

    if (!target) return;

    const value = target.getAttribute('data-value');

    if (!value || !['age', 'category', 'gender', 'breed'].includes(value)) return;

    setType(value);
  }

  useEffect(() => {
    const classArr: any = [];
    if (type === 'age') {
      animals.forEach((anim: any) => {
        const years = moment().diff(new Date(anim.birthDate), "year");
        const existingItem = classArr.find((item: any) => item.value === years);

        if (!existingItem) {
          classArr.push({ value: years, animals: [anim], percent: Math.round(1 / (animals.length / 100)) })
        } else {
          existingItem.animals.push(anim);
          existingItem.percent = Math.round(existingItem.animals.length / (animals.length / 100))
        }
      });
    }
    if (type === 'category') {
      animals.forEach((anim: any) => {
        const category = anim.category ? anim.category : 'Без категории';
        const existingItem = classArr.find((item: any) => item.value === category);

        if (!existingItem) {
          classArr.push({ value: category, animals: [anim], percent: Math.round(1 / (animals.length / 100)) })
        } else {
          existingItem.animals.push(anim);
          existingItem.percent = Math.round(existingItem.animals.length / (animals.length / 100))
        }
      });
    }
    if (type === 'gender') {
      animals.forEach((anim: any) => {
        const gender = anim.gender;
        const existingItem = classArr.find((item: any) => item.value === gender);

        if (!existingItem) {
          classArr.push({ value: gender, animals: [anim], percent: Math.round(1 / (animals.length / 100)) })
        } else {
          existingItem.animals.push(anim);
          existingItem.percent = Math.round(existingItem.animals.length / (animals.length / 100))
        }
      });
    }
    if (type === 'breed') {
      animals.forEach((anim: any) => {
        const breed = anim.breedRussian ? anim.breedRussian : 'Парода не указана';
        const existingItem = classArr.find((item: any) => item.value === breed);

        if (!existingItem) {
          classArr.push({ value: breed, animals: [anim], percent: Math.round(1 / (animals.length / 100)) })
        } else {
          existingItem.animals.push(anim);
          existingItem.percent = Math.round(existingItem.animals.length / (animals.length / 100))
        }
      });
    }

    setRenderClass(classArr.sort((a: any, b: any) => b.percent - a.percent));
  }, [type]);

  return (
    <div className="herd-breakdown-block">
      <div className="mp-block-outside-header">
        <div className="mp-block-outside-header-title">Классификация животных</div>
        <div className="mp-block-outside-header-btn-block">
          <div className={`mp-block-outside-header-btn ${type === 'age' ? 'mp-block-outside-header-btn-active' : ''}`} data-value='age' onClick={typeChange}>Возраст</div>
          <div className={`mp-block-outside-header-btn ${type === 'category' ? 'mp-block-outside-header-btn-active' : ''}`} data-value='category' onClick={typeChange}>Группа</div>
          <div className={`mp-block-outside-header-btn ${type === 'gender' ? 'mp-block-outside-header-btn-active' : ''}`} data-value='gender' onClick={typeChange}>Пол</div>
          <div className={`mp-block-outside-header-btn ${type === 'breed' ? 'mp-block-outside-header-btn-active' : ''}`} data-value='breed' onClick={typeChange}>Порода</div>
        </div>
      </div>

      <div className="herd-breakdown-block-inner">
        {renderClass.length > 0 && renderClass.map((item: any, index: number) => (
          <div className="hbb-line" key={index}>
            {type === 'age' && <div className="hbb-line-text">{item.value} г.</div>}
            {type === 'category' && <div className="hbb-line-text">{item.value}</div>}
            {type === 'gender' && <div className="hbb-line-text">{item.value === 'male' ? 'Мужской' : 'Женский'}</div>}
            {type === 'breed' && <div className="hbb-line-text">{item.value}</div>}

            <div className="hbb-line-text-second">{item.percent}%</div>
            <div className="hbb-animals-block">
              {item.animals.map((anim: any, inx: number) => (
                <div className="hbb-animal-item" key={inx}></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Classification