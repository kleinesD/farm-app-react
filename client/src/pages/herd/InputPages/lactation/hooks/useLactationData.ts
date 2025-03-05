import React, { useState, useEffect } from "react";
import moment from 'moment';

const useLactationData = (data: any, lactId: string | null, edit: boolean) => {
  const [unfinishedLact, setUnfinishedLact] = useState<any>(null);
  const [lactHistory, setLactHistory] = useState<[]>([]);
  const [lactNumberOptions, setLactNumberOptions] = useState<any[]>([]);
  const [url, setUrl] = useState<string>('');
  const [lactForEdit, setLactForEdit] = useState<any>(null);
  const [otherLacts, setOtherLacts] = useState<any[]>([]);

  useEffect(() => {
    if(data) {

      const animal = data.data.animal;
  
      const lactations = structuredClone(animal.lactations);
      lactations.sort((a: any, b: any) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
  
      setLactHistory([]);
      setLactHistory(lactations.map((lact: any) => {
        return {
          link: `/herd/lactation/${animal._id}/?edit=true&id=${lact._id}`,
          text: `Лактация #${lact.number}`,
          date: `${moment(lact.startDate).locale('ru').format('DD MMM YY').toUpperCase()}`
        }
      }))
  
      setUnfinishedLact(null);
      setUnfinishedLact((prev: any) => {
        const uLact = animal.lactations.find((lact: any) => !lact.finishDate)
        if (!uLact) return prev;
  
        return JSON.stringify(prev) !== JSON.stringify(uLact) ? uLact : prev;
      });
  
      setLactForEdit(null);
      setLactForEdit((prev: any) => {
        const lact = animal.lactations.find((l: any) => l._id === lactId);
        if (!lact) return prev;
  
        return JSON.stringify(prev) !== JSON.stringify(lact) ? lact : prev;
      });
  
      setOtherLacts([]);
      setOtherLacts((prev: any) => {
        const lacts = animal.lactations.filter((l: any) => l._id !== lactId);
  
        return JSON.stringify(prev) !== JSON.stringify(lacts) ? lacts : prev;
      });
  
      setLactNumberOptions([]);
      for (let i = 1; i <= 10; i++) {
        setLactNumberOptions((prev: any) => [...prev, {
          title: i.toString(),
          value: i.toString(),
          restricted: lactations.find((lact: any) => lact.number === i && lact._id !== lactId) ? true : false
        }])
      }
  
      setUrl('');
      setUrl(!edit ? `/api/animals/lactation/${animal._id}` : `/api/animals/lactation/${animal.id}/${lactId}`);
    }
  }, [data, lactId, edit]);

  return { unfinishedLact, lactHistory, lactNumberOptions, url, lactForEdit, otherLacts };
}

export default useLactationData;