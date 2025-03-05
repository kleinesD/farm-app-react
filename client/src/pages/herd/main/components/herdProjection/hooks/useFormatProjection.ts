import moment from "moment";

const useFormatProjections = (projData: any[]) => {
  const projDataFormat: any[] = [];

  projData.forEach((el, inx, arr) => {
    let animals = { count: 0, change: 0 };
    let cows = { count: 0, change: 0 };
    let bulls = { count: 0, change: 0 };
    let milkingCows = { count: 0, change: 0 };
    let calves = { count: 0, change: 0 };
    let writeOff = { count: 0, change: 0 };


    el.animals.forEach((animal: any) => {
      if (animal.status === 'alive') animals.count++;
      if (animal.status === 'alive' && animal.gender === 'female' && ((moment().add(el.year, 'year').toDate().getTime() - new Date(animal.birthDate).getTime()) / 1000 / 60 / 60 / 24 / 30) > 12) cows.count++;
      if (animal.status === 'alive' && animal.gender === 'male' && ((moment().add(el.year, 'year').toDate().getTime() - new Date(animal.birthDate).getTime()) / 1000 / 60 / 60 / 24 / 30) > 12) bulls.count++;
      if (animal.status === 'alive' && animal.gender === 'female' && animal.lastLact) milkingCows.count++;
      if (animal.status === 'alive' && ((moment().add(el.year, 'year').toDate().getTime() - new Date(animal.birthDate).getTime()) / 1000 / 60 / 60 / 24 / 30) < 12) calves.count++;
      if (animal.status === 'diseased' && new Date(animal.dateOfDeath) > moment().add(el.year - 1, 'year').toDate() && new Date(animal.dateOfDeath) < moment().add(el.year, 'year').toDate()) writeOff.count++;
    });

    projDataFormat.push({
      year: el.year,
      animals,
      cows,
      bulls,
      milkingCows,
      calves,
      writeOff
    });
  });

  projDataFormat.forEach((el, inx, arr) => {
    let prevYear = inx === 0 ? undefined : arr[inx - 1];
    if (!prevYear) return;

    el.animals.change = el.animals.count - prevYear.animals.count;
    el.cows.change = el.cows.count - prevYear.cows.count;
    el.bulls.change = el.bulls.count - prevYear.bulls.count;
    el.milkingCows.change = el.milkingCows.count - prevYear.milkingCows.count;
    el.calves.change = el.calves.count - prevYear.calves.count;
    el.writeOff.change = el.writeOff.count - prevYear.writeOff.count;
  });

  let maxes: Record<string, number> = {
    animals: 0,
    cows: 0,
    bulls: 0,
    milkingCows: 0,
    writeOff: 0,
  }

  projDataFormat.forEach((year: any) => {
    if (year.animals.count > maxes.animals) maxes.animals = year.animals.count;
    if (year.cows.count > maxes.cows) maxes.cows = year.cows.count;
    if (year.bulls.count > maxes.bulls) maxes.bulls = year.bulls.count;
    if (year.milkingCows.count > maxes.milkingCows) maxes.milkingCows = year.milkingCows.count;
    if (year.writeOff.count > maxes.writeOff) maxes.writeOff = year.writeOff.count;
  })

  return {projDataFormat, maxes};
}

export default useFormatProjections;