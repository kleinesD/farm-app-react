import React, { useEffect, useState } from 'react';
import moment from 'moment';

interface Options {
  animals: any[],
  filters: string[]
}

const usePrepareItems = ({ animals, filters }: Options) => {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {

    const arr: any[] = [];
    if (filters.includes('milking')) {

      animals.forEach((animal: any) => {
        animal?.milkingResults?.forEach((res: any) => {
          arr.push({
            animal: animal,
            title: `Результат доения: ${res.result} л.`,
            editLink: `/herd/milking/${animal._id}/?edit=true&id=${res._id}`,
            id: res._id,
            date: res.creationDate ? new Date(res.creationDate) : new Date(res.date),
            type: 'milking',
            dateBefore: false
          });
        });
      });
    }
    if (filters.includes('weight')) {

      animals.forEach((animal: any) => {
        animal?.weightResults?.forEach((res: any) => {
          arr.push({
            animal: animal,
            title: `Взвешивание: ${res.result} кг.`,
            editLink: `/herd/weight/${animal._id}/?edit=true&id=${res._id}`,
            id: res._id,
            date: res.creationDate ? new Date(res.creationDate) : new Date(res.date),
            type: 'weight',
            dateBefore: false
          });
        });
      });
    }
    if (filters.includes('lactation')) {

      animals.forEach((animal: any) => {
        animal?.lactations?.forEach((res: any) => {
          arr.push({
            animal: animal,
            title: `Лактация: #${res.number}`,
            editLink: `/herd/lactation/${animal._id}/?edit=true&id=${res._id}`,
            id: res._id,
            date: res.creationDate ? new Date(res.creationDate) : new Date(res.startDate),
            type: 'lactation',
            dateBefore: false
          });
        });
      });
    }

    if (filters.includes('addition')) {
      animals.forEach((animal: any) => {
        if (animal.status !== 'dead-birth') {
          arr.push({
            animal: animal,
            title: `Добавление животного`,
            date: animal.creationDate ? new Date(animal.creationDate) : new Date(animal.birthDate),
            type: 'addition',
            dateBefore: false
          });
        } else {
          arr.push({
            animal: animal,
            title: `Добавление мертворождения`,
            date: animal.creationDate ? new Date(animal.creationDate) : new Date(animal.deadBirthDate),
            type: 'addition-dead',
            dateBefore: false
          });
        }

      });
    }

    if (filters.includes('write-off')) {
      animals.forEach((animal: any) => {
        if (animal.status === 'dead-birth' || animal.status === 'alive') return;

        arr.push({
          animal: animal,
          title: `Списание животного`,
          date: new Date(animal.writeOffDate),
          type: 'write-off',
          dateBefore: false
        });


      });
    }

    arr.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())

    arr.forEach((item: any, index: number, arr: any) => {
      if(index === 0 || !moment(item.date).isSame(arr[index - 1]?.date, 'month')) item.dateBefore = true;

    });

    setItems(arr);

  }, [animals, filters]);

  return { items };
}

export default usePrepareItems;